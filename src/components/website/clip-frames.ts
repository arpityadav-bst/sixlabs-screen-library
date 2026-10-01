// A stacked clip's frames, decoded on demand with WebCodecs for the cursor-scrubbed turn (PlayerPortrait.tsx).
// The file is fetched once and its sample table read (mp4-samples.ts); show(t) draws the frame at time t by
// decoding from the keyframe before it (every third frame is one, so at most three frames a step, on the
// computer's video decoder: a few ms). Seeking a <video> took 70 to 190 ms a step on an Intel Mac, most of it
// the browser's own seek: its media pipeline flushed and refilled, then a wait for the next drawn frame.
// One decode runs at a time and the latest target is decoded when it lands, so a fast cursor never queues a
// backlog. Of each step's frames only the last (the one asked for) is drawn, the rest closed unseen.
// shown(ms) hears how long each drawn frame took from being asked for (?perf, perf.ts).
// Null where this browser cannot decode the clip (no WebCodecs, or no H.264 decoder): the <video> plays it.
import { readMp4 } from "./mp4-samples";

export type ClipFrames = { duration: number; show(t: number): void; close(): void };

export const canDecode = () =>
  typeof window !== "undefined" &&
  typeof VideoDecoder !== "undefined" &&
  typeof EncodedVideoChunk !== "undefined" &&
  !/[?&]scrub=seek/.test(location.search); // ?scrub=seek: the <video> seeking, for a side-by-side check

export async function clipFrames(
  url: string,
  draw: (frame: VideoFrame) => void,
  shown: (ms: number) => void,
  signal: AbortSignal,
): Promise<ClipFrames | null> {
  if (!canDecode()) return null;
  const buf = await (await fetch(url, { signal })).arrayBuffer();
  const mp4 = readMp4(buf);
  if (!mp4 || signal.aborted) return null;
  const config: VideoDecoderConfig = {
    codec: mp4.codec,
    description: mp4.description,
    codedWidth: mp4.width,
    codedHeight: mp4.height,
    optimizeForLatency: true,
  };
  if (!(await VideoDecoder.isConfigSupported(config)).supported) return null;
  const { samples } = mp4;
  let want = -1,
    showing = -1,
    asked = 0,
    busy = false,
    dead = false,
    last: VideoFrame | null = null;
  const decoder = new VideoDecoder({
    output: (frame) => {
      last?.close();
      last = frame;
    },
    error: () => {
      dead = true;
    },
  });
  decoder.configure(config);
  const run = async () => {
    if (busy || dead || want < 0 || want === showing) return;
    busy = true;
    const k = want,
      since = asked;
    let key = k;
    while (key > 0 && !samples[key].key) key--;
    for (let i = key; i <= k; i++) {
      const s = samples[i];
      decoder.decode(
        new EncodedVideoChunk({
          type: i === key ? "key" : "delta",
          timestamp: s.ts,
          duration: s.dur,
          data: new Uint8Array(buf, s.offset, s.size),
        }),
      );
    }
    try {
      await decoder.flush(); // every frame out; the next decode starts from a keyframe again
    } catch {
      dead = true;
    }
    busy = false;
    const frame = last as VideoFrame | null;
    last = null;
    if (frame && !dead) draw(frame);
    frame?.close();
    if (dead) return;
    showing = k;
    shown(performance.now() - since);
    run();
  };
  return {
    duration: mp4.duration,
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
      if (decoder.state !== "closed") decoder.close();
    },
  };
}
