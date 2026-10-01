// Two casts of characters take turns on the floor: each reset wave (autoplay.js) swaps every tile to the
// other one, P.chars then P.chars2. Only the cast on screen stays on the GPU. The other is fetched (from the
// browser's cache after the first time) and put up (warm, upload.js: one picture per idle moment) when it is
// next asked for (prepare(): the auto-play asks once most of the tiles on screen have played, or a wave is
// about to run, and a wave waits for it); once a wave has brought every tile over, the pictures no tile
// shows any more are let go (texture.dispose). Holding both casts kept some 230 MB more of pictures on the
// GPU, and after the first wave an Intel MacBook Pro stalled for half a second at every small change on the
// page. A cast's humans come before its AI copies. With mixWaves (a floor of many tiles, where the second
// cast is too few to fill it) the second cast takes the middle tiles, one character each, and the first
// cast's characters fill the tiles around them (castTiles, characters.js).
import { planPictures, castTiles } from './characters.js';

// Returns { prepare(), next(), show(key, b), done(b) }: prepare loads the cast the coming wave shows and
// resolves when it is ready (at once if there is none, or it is in), next is that cast, show swaps one tile's
// pictures, done records the swap, brings every other tile (off screen too) along and lets the rest go.
export function createCasts({ P, chars, bustTiles, pictures, gone, mixWaves = false, warm }) {
  const casts = [new Map([...chars].map(([k, c]) => [k, c.name]))];
  if (P.chars2?.length) casts.push(castTiles(bustTiles, P.chars2, null, mixWaves ? P.chars : null));
  const keysOf = (names) => [...new Set(names)].flatMap((n) => [`chars/${n}`, `chars-ai/${n}`]);
  // picture key -> its texture: asked for (held, a promise) and in (now)
  const held = new Map(pictures), now = new Map();
  const track = (k, p) => p.then((t) => { if (held.get(k) === p) now.set(k, t); }, () => { if (held.get(k) === p) held.delete(k); });
  held.forEach((p, k) => track(k, p));
  const ev = (cast) => { if (window.__floorEvents) window.__floorEvents.cast = cast; }; // ?perf's log (website/perf.ts)
  const ready = [true, false];
  let shown = 0, loading = null;

  const load = (b) => {
    if (ready[b] || gone()) return Promise.resolve();
    return (loading ??= (async () => {
      ev('loading');
      const keys = keysOf(casts[b].values()), missing = keys.filter((k) => !held.has(k));
      const plan = planPictures(P, [missing.filter((k) => k.startsWith('chars/')), missing.filter((k) => k.startsWith('chars-ai/'))]).get;
      plan.forEach((p, k) => { held.set(k, p); track(k, p); });
      for (const k of keys) await warm(await held.get(k));
      ready[b] = !gone();
      ev('ready');
    })().catch(() => {}).finally(() => { loading = null; })); // a cast that fails to load leaves the waves on this one
  };

  const api = {
    prepare: () => (casts.length > 1 ? load(1 - shown) : Promise.resolve()),
    next: () => (casts.length > 1 && ready[1 - shown] ? 1 - shown : shown),
    show: (key, b) => {
      const n = casts[b]?.get(key), ch = chars.get(key);
      if (!n || !ch || ch.name === n) return;
      const human = now.get(`chars/${n}`), ai = now.get(`chars-ai/${n}`);
      if (!human || !ai) return; // a picture that did not come in: the tile keeps its character
      ch.setPictures(human, ai);
      ch.name = n;
    },
    done: (b) => {
      shown = b;
      chars.forEach((_, key) => api.show(key, b));
      // what no tile shows any more goes off the GPU; the cast it belonged to loads again before its next wave
      const keep = new Set(keysOf([...chars.values()].map((c) => c.name)));
      for (const [k, t] of now) if (!keep.has(k)) { t.dispose(); now.delete(k); held.delete(k); }
      ready.forEach((_, c) => { if (c !== b) ready[c] = false; });
    },
  };
  return api;
}
