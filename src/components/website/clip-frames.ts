// A stacked clip's frames, decoded on demand with WebCodecs for the cursor-scrubbed turn (PlayerPortrait.tsx).
// show(t) draws the frame at time t; one step is worked at a time and the latest target is taken when it
// lands, so a fast cursor never queues a backlog. Seeking a <video> took 50 to 190 ms a step on an Intel Mac,
// most of it the browser's own seek (its media pipeline flushed and refilled, then a wait for a drawn frame).
//   - The clip is read as it arrives: its sample table (mp4-samples.ts) comes first in the file, and a frame
//     can be decoded as soon as its bytes and the ones before it back to its keyframe are in, so the turn
//     starts before the whole file has.
//   - A step forward goes on from the last frame decoded: one frame, not the run from the keyframe before it
//     (every third frame is one). A step back starts again from the keyframe before the frame.
//   - The frame asked for is drawn the moment the decoder gives it out. A decoder that holds frames back is
//     flushed for it (after HOLD_MS, then at once on every step), which ends the run, so the next step starts
//     from a keyframe again.
//   - Chrome is asked for its software decoder (prefer-software) where it has one: it works inside the page's
//     own process, while the hardware decoder's frames went by way of the browser's GPU process and waited
//     behind its compositing. ?decoder=hw asks for the hardware one instead, ?decoder=sw for software anywhere.
// shown(ms) hears how long each drawn frame took from being asked for (?perf, perf.ts). Null where the clip
// cannot be decoded here (no WebCodecs, no H.264 decoder): the <video> plays it.
import { readMp4, type Mp4 } from "./mp4-samples";

export type ClipFrames = { duration: number; kind: string; show(t: number): void; close(): void };

const HOLD_MS = 40;
const param = (k: string) =>
  typeof location === "undefined" ? null : new URLSearchParams(location.search).get(k);
// Safari and every browser on iPhone and iPad (WebKit) seek a stacked clip fast enough themselves (about 20 ms a
// step, measured): they keep the <video> unless ?scrub=decode; ?scrub=seek keeps it everywhere
const webkit = () => {
  const ua = navigator.userAgent;
  return (
    /iP(hone|ad|od)/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ||
    (/Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\//.test(ua))
  );
};
export const canDecode = () =>
  typeof window !== "undefined" &&
  typeof VideoDecoder !== "undefined" &&
  typeof EncodedVideoChunk !== "undefined" &&
  param("scrub") !== "seek" &&
  (param("scrub") === "decode" || !webkit());

// the clip's bytes as they arrive: got() is how many are in, onData hears each new piece
function stream(res: Response, onData: () => void) {
  let buf = new Uint8Array(Number(res.headers.get("content-length")) || 1 << 21),
    got = 0;
  const reader = res.body!.getReader();
  const pump = async (): Promise<void> => {
    const { done, value } = await reader.read();
    if (done) return;
    if (got + value.length > buf.length) {
      const grown = new Uint8Array(Math.max(buf.length * 2, got + value.length));
      grown.set(buf.subarray(0, got));
      buf = grown;
    }
    buf.set(value, got);
    got += value.length;
    onData();
    return pump();
  };
  return { done: pump(), got: () => got, buf: () => buf };
}

async function config(mp4: Mp4) {
  const base: VideoDecoderConfig = {
    codec: mp4.codec,
    description: mp4.description,
    codedWidth: mp4.width,
    codedHeight: mp4.height,
    optimizeForLatency: true,
  };
  const want = param("decoder");
  const tries: [HardwareAcceleration, string][] =
    want === "hw" ? [["prefer-hardware", "hw"]] : want === "sw" || !webkit() ? [["prefer-software", "sw"]] : [];
  for (const [hardwareAcceleration, kind] of tries) {
    const c = { ...base, hardwareAcceleration };
    if ((await VideoDecoder.isConfigSupported(c)).supported) return { c, kind };
  }
  return (await VideoDecoder.isConfigSupported(base)).supported ? { c: base, kind: "any" } : null;
}

export async function clipFrames(
  url: string,
  draw: (frame: VideoFrame) => void,
  shown: (ms: number) => void,
  signal: AbortSignal,
): Promise<ClipFrames | null> {
  if (!canDecode()) return null;
  const res = await fetch(url, { signal });
  if (!res.ok || !res.body) return null;
  let mp4: Mp4 | null = null,
    run = () => {},
    parsed = () => {};
  const table = new Promise<void>((r) => (parsed = r));
  const file = stream(res, () => {
    if (!mp4 && (mp4 = readMp4(file.buf().buffer, file.got()))) parsed();
    run();
  });
  file.done.catch(() => {});
  await Promise.race([table, file.done]); // the sample table: in with the first few kB
  const clip = mp4 as Mp4 | null;
  if (!clip || signal.aborted) return null;
  const setup = await config(clip);
  if (!setup || signal.aborted) return null;
  const { samples } = clip;
  const keyOf = (k: number) => {
    while (k > 0 && !samples[k].key) k--;
    return k;
  };
  const has = (to: number) => samples[to].offset + samples[to].size <= file.got();

  let want = -1,
    showing = -1,
    asked = 0,
    busy = false,
    dead = false,
    fed = -1, // the last frame fed in the current run (-1: the next must start from a keyframe)
    holds = false, // the decoder keeps frames back until flushed
    waitTs = -1,
    landed: (() => void) | null = null,
    held: VideoFrame | null = null;
  const land = (frame: VideoFrame | null) => {
    if (frame && !dead) draw(frame);
    frame?.close();
    const l = landed;
    landed = null;
    l?.();
  };
  const decoder = new VideoDecoder({
    output: (frame) => {
      if (landed && frame.timestamp === waitTs) {
        held?.close();
        held = null;
        return land(frame);
      }
      held?.close();
      held = frame;
    },
    error: () => {
      dead = true;
      land(null);
    },
  });
  decoder.configure(setup.c);
  const flush = () => {
    fed = -1;
    decoder.flush().then(
      () => {
        if (!landed) return;
        const f = held;
        held = null;
        land(f);
      },
      () => land(null),
    );
  };

  run = async () => {
    if (busy || dead || want < 0 || want === showing) return;
    const k = want,
      since = asked,
      key = keyOf(k),
      from = fed >= key && k > fed ? fed + 1 : key;
    if (!has(k)) return; // its bytes are not in yet: run again as more arrive
    busy = true;
    waitTs = samples[k].ts;
    const step = new Promise<void>((r) => (landed = r));
    for (let i = from; i <= k; i++) {
      const s = samples[i];
      decoder.decode(
        new EncodedVideoChunk({
          type: i === key ? "key" : "delta",
          timestamp: s.ts,
          duration: s.dur,
          data: file.buf().subarray(s.offset, s.offset + s.size),
        }),
      );
    }
    fed = k;
    let timer = 0;
    if (holds) flush();
    else
      timer = window.setTimeout(() => {
        if (!landed) return;
        holds = true;
        flush();
      }, HOLD_MS);
    await step;
    clearTimeout(timer);
    busy = false;
    if (dead) return;
    showing = k;
    shown(performance.now() - since);
    run();
  };
  return {
    duration: clip.duration,
    kind: setup.kind,
    // the frame showing at t, as a <video> at that currentTime would show it
    show(t: number) {
      let k = 0;
      while (k + 1 < samples.length && samples[k + 1].ts <= t * 1e6 + 1) k++;
      if (k === want) return;
      want = k;
      asked = performance.now();
      run();
    },
    close() {
      dead = true;
      held?.close();
      held = null;
      if (decoder.state !== "closed") decoder.close();
    },
  };
}
