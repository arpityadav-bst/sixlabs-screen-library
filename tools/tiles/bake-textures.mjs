// Paints the floor's procedural textures (src/tiles/textures.js) once, exactly as the page paints them, into
// public/tiles/baked/*.png, and lists each in src/tiles/baked-manifest.js with every floor setting its painting
// read (the page uses a picture only while all of those still match: baked-textures.js). Both of the floor's
// states are baked (floor-params.json's default and shine, merged over its top level as floor.js merges them).
// Run it after changing public/tiles/floor-params.json:   node tools/tiles/bake-textures.mjs
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { SPECS, pixels } from '../../src/tiles/textures.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = JSON.parse(fs.readFileSync(path.join(root, 'public/tiles/floor-params.json'), 'utf8'));
const states = [RAW.states?.default, RAW.states?.shine].map((s) => Object.assign({}, RAW, s ?? {}));
const outDir = path.join(root, 'public/tiles/baked');

// the settings a painting reads, as it reads them
function recording(P) {
  const read = {};
  return [new Proxy(P, { get: (t, k) => { if (typeof k === 'string') read[k] = t[k] ?? null; return t[k]; } }), read];
}

// The canvas's blur(r px): a Gaussian of standard deviation r, on premultiplied colour, transparent past the edges.
function blur(data, size, sigma) {
  const r = Math.ceil(sigma * 3), w = Array.from({ length: 2 * r + 1 }, (_, i) => Math.exp(-((i - r) ** 2) / (2 * sigma * sigma)));
  const sum = w.reduce((a, b) => a + b, 0), k = w.map((v) => v / sum);
  let src = new Float64Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const a = data[i * 4 + 3] / 255;
    src[i * 4] = data[i * 4] * a; src[i * 4 + 1] = data[i * 4 + 1] * a; src[i * 4 + 2] = data[i * 4 + 2] * a; src[i * 4 + 3] = data[i * 4 + 3];
  }
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const dst = new Float64Array(src.length);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const o = (y * size + x) * 4;
      for (let t = -r; t <= r; t++) {
        const sx = x + t * dx, sy = y + t * dy;
        if (sx < 0 || sy < 0 || sx >= size || sy >= size) continue;
        const s = (sy * size + sx) * 4, f = k[t + r];
        dst[o] += src[s] * f; dst[o + 1] += src[s + 1] * f; dst[o + 2] += src[s + 2] * f; dst[o + 3] += src[s + 3] * f;
      }
    }
    src = dst;
  }
  const out = new Uint8ClampedArray(data.length);
  for (let i = 0; i < size * size; i++) {
    const a = src[i * 4 + 3], f = a > 0 ? 255 / a : 0;
    out[i * 4] = src[i * 4] * f; out[i * 4 + 1] = src[i * 4 + 1] * f; out[i * 4 + 2] = src[i * 4 + 2] * f; out[i * 4 + 3] = a;
  }
  return out;
}

// RGBA pixels as a PNG: grey, RGB or RGBA by what the pixels need, each row with its smallest filter.
function png(data, size) {
  let grey = true, opaque = true;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 255) opaque = grey = false;
    if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) grey = false;
  }
  const ch = grey ? 1 : opaque ? 3 : 4, type = grey ? 0 : opaque ? 2 : 6, stride = size * ch;
  const raw = Buffer.alloc((stride + 1) * size);
  let prev = new Uint8Array(stride);
  for (let y = 0; y < size; y++) {
    const row = new Uint8Array(stride);
    for (let x = 0; x < size; x++) for (let c = 0; c < ch; c++) row[x * ch + c] = data[(y * size + x) * 4 + c];
    const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
    let best = null, bestCost = Infinity;
    for (let f = 0; f < 5; f++) {
      const line = new Uint8Array(stride);
      for (let i = 0; i < stride; i++) {
        const a = i >= ch ? row[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
        line[i] = row[i] - [0, a, b, (a + b) >> 1, paeth(a, b, c)][f];
      }
      const cost = line.reduce((s, v) => s + (v < 128 ? v : 256 - v), 0);
      if (cost < bestCost) { bestCost = cost; best = [f, line]; }
    }
    raw[y * (stride + 1)] = best[0];
    raw.set(best[1], y * (stride + 1) + 1);
    prev = row;
  }
  const chunk = (name, body) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(body.length);
    head.write(name, 4, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(Buffer.concat([head.subarray(4), body])));
    return Buffer.concat([head, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = type;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, f));
const manifest = {};
for (const key of Object.keys(SPECS)) {
  for (const P of states) {
    const [watched, read] = recording(P);
    const s = SPECS[key](watched);
    let data = pixels(s);
    if (s.blur > 0) data = blur(data, s.size, s.blur);
    const params = JSON.parse(JSON.stringify(read));
    const id = crypto.createHash('sha1').update(JSON.stringify(params)).digest('hex').slice(0, 10);
    const file = `${key}-${id}.png`;
    manifest[key] ??= [];
    if (manifest[key].some((e) => e.file === file)) continue; // both states read the same settings
    const bytes = png(data, s.size);
    fs.writeFileSync(path.join(outDir, file), bytes);
    manifest[key].push({ file, srgb: s.srgb, params });
    console.log(`${file}  ${s.size}px  ${(bytes.length / 1024).toFixed(0)} KB`);
  }
}
fs.writeFileSync(path.join(root, 'src/tiles/baked-manifest.js'),
  `// Written by tools/tiles/bake-textures.mjs; run it again after changing public/tiles/floor-params.json.\nconst BAKED = ${JSON.stringify(manifest, null, 2)};\nexport default BAKED;\n`);
