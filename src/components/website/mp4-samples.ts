// The sample table of an MP4 holding one H.264 video track (the players' stacked clips, tools/stack-alpha.sh),
// read straight from the file's boxes: each frame's bytes, time and whether it is a keyframe, and what the
// decoder is configured with (its codec string and the avcC record). Enough for clip-frames.ts to feed
// WebCodecs; not a general MP4 reader: one video track, frames in display order (no B-frames), no edit list,
// as those files are made. Null for anything else.
export type Sample = {
  offset: number;
  size: number;
  ts: number; // microseconds
  dur: number;
  key: boolean;
};
export type Mp4 = {
  codec: string;
  description: Uint8Array;
  width: number;
  height: number;
  samples: Sample[];
  duration: number; // seconds
};
type Range = [number, number];

export function readMp4(buf: ArrayBuffer): Mp4 | null {
  const v = new DataView(buf),
    u8 = new Uint8Array(buf);
  const kind = (o: number) =>
    String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]);
  // the boxes between from and to: their type and payload
  const boxes = (from: number, to: number) => {
    const out: [string, number, number][] = [];
    for (let o = from; o + 8 <= to; ) {
      let size = v.getUint32(o),
        head = 8;
      if (size === 1) {
        size = Number(v.getBigUint64(o + 8));
        head = 16;
      } else if (size === 0) size = to - o;
      if (size < head || o + size > to) break;
      out.push([kind(o + 4), o + head, o + size]);
      o += size;
    }
    return out;
  };
  const find = (r: Range, ...path: string[]): Range | null => {
    for (const p of path) {
      const b = boxes(r[0], r[1]).find(([t]) => t === p);
      if (!b) return null;
      r = [b[1], b[2]];
    }
    return r;
  };
  const moov = find([0, buf.byteLength], "moov");
  if (!moov) return null;
  const mdia = boxes(...moov)
    .filter(([t]) => t === "trak")
    .map(([, s, e]) => find([s, e], "mdia"))
    .find((m) => {
      const h = m && find(m, "hdlr");
      return h && kind(h[0] + 8) === "vide";
    });
  const mdhd = mdia && find(mdia, "mdhd"),
    stbl = mdia && find(mdia, "minf", "stbl");
  if (!mdhd || !stbl) return null;
  const timescale = v.getUint32(mdhd[0] + (u8[mdhd[0]] === 1 ? 20 : 12));

  // the sample description: an avc1 entry and its avcC record
  const stsd = find(stbl, "stsd");
  const entry = stsd && boxes(stsd[0] + 8, stsd[1])[0];
  if (!entry || !/^avc[13]$/.test(entry[0])) return null;
  const avcC = boxes(entry[1] + 78, entry[2]).find(([t]) => t === "avcC");
  if (!avcC) return null;
  const description = u8.slice(avcC[1], avcC[2]);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const codec = `avc1.${hex(description[1])}${hex(description[2])}${hex(description[3])}`;

  // a full box's table: its entry count, then each entry's 32-bit fields
  const table = (name: string, fields: number) => {
    const r = find(stbl, name);
    if (!r) return null;
    const n = v.getUint32(r[0] + 4),
      out: number[][] = [];
    for (let i = 0; i < n; i++)
      out.push(
        Array.from({ length: fields }, (_, f) =>
          v.getUint32(r[0] + 8 + (i * fields + f) * 4),
        ),
      );
    return out;
  };
  const stsz = find(stbl, "stsz");
  if (!stsz || find(stbl, "ctts")) return null; // B-frames would need their display order
  const fixed = v.getUint32(stsz[0] + 4),
    count = v.getUint32(stsz[0] + 8);
  const sizes = Array.from({ length: count }, (_, i) =>
    fixed || v.getUint32(stsz[0] + 12 + i * 4),
  );
  const co64 = find(stbl, "co64");
  const chunks = co64
    ? Array.from({ length: v.getUint32(co64[0] + 4) }, (_, i) =>
        Number(v.getBigUint64(co64[0] + 8 + i * 8)),
      )
    : (table("stco", 1) ?? []).map(([o]) => o);
  const stsc = table("stsc", 3) ?? [],
    stts = table("stts", 2) ?? [];
  const sync = table("stss", 1); // none: every frame a keyframe
  const keys = new Set(sync?.map(([n]) => n - 1));

  const samples: Sample[] = [];
  let t = 0;
  const times = stts.flatMap(([n, d]) => Array(n).fill(d) as number[]);
  stsc.forEach(([first, per], e) => {
    const next = stsc[e + 1]?.[0] ?? chunks.length + 1;
    for (let c = first; c < next; c++) {
      let o = chunks[c - 1];
      for (let k = 0; k < per && samples.length < count; k++) {
        const i = samples.length,
          d = times[i] ?? 0;
        samples.push({
          offset: o,
          size: sizes[i],
          ts: Math.round((t * 1e6) / timescale),
          dur: Math.round((d * 1e6) / timescale),
          key: !sync || keys.has(i),
        });
        o += sizes[i];
        t += d;
      }
    }
  });
  if (!samples.length || !samples[0].key) return null;
  const width = v.getUint16(entry[1] + 24),
    height = v.getUint16(entry[1] + 26);
  return { codec, description, width, height, samples, duration: t / timescale };
}
