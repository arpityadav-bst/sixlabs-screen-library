// Two casts of characters take turns on the floor: each reset wave (autoplay.js) swaps every tile to the
// other one, P.chars then P.chars2. The second is not fetched until it is asked for (prepare(): the
// auto-play asks once most of the tiles on screen have played, or a wave is about to run), and then only
// once the first is all in (load-plan.js); its humans come before its AI copies. So a weak machine's GPU
// carries one cast, not two, through the opening minutes. A wave waits for it (autoplay.js). Its textures go up to the GPU (warm, upload.js: one per idle moment) before its first wave, so
// the swap mid-wave never stalls. With mixWaves (a floor of many tiles, where the second cast is too few to
// fill it) the second cast takes the middle tiles, one character each, and the first cast's characters fill
// the tiles around them (castTiles, characters.js); those pictures are the first cast's own, already loaded.
import { planPictures, castTiles } from './characters.js';

const settled = async (pics) => new Map(await Promise.all([...pics].map(async ([k, t]) => [k, await t])));

// Returns { prepare(), next(), show(key, b), done(b) }: prepare starts the second cast's download (once) and
// resolves when it is ready to show (at once if there is none), next is the cast the coming wave shows, show
// swaps one tile's pictures, done records the swap and brings every other tile (off screen too) along.
export function createCasts({ P, chars, bustTiles, pictures, gone, mixWaves = false, warm }) {
  const casts = [{ names: new Map([...chars].map(([k, c]) => [k, c.name])), tex: null }, null];
  const first = settled(pictures).then((tex) => { casts[0].tex = tex; });
  let second = null;
  const ev = (cast) => { if (window.__floorEvents) window.__floorEvents.cast = cast; }; // ?perf's log (website/perf.ts)
  const prepare = () => (second ??= first.then(async () => {
    if (!P.chars2?.length || gone()) return;
    ev('loading');
    const names = P.chars2;
    const two = await settled(planPictures(P, [names.map((n) => `chars/${n}`), names.map((n) => `chars-ai/${n}`)]).get);
    for (const t of two.values()) await warm(t);
    if (gone()) return;
    casts[1] = { names: castTiles(bustTiles, names, null, mixWaves ? P.chars : null), tex: two };
    ev('ready');
  }).catch(() => {})); // a cast that fails to load leaves the waves on the first
  let shown = 0;
  const api = {
    prepare,
    next: () => (casts[1] && casts[0].tex ? 1 - shown : shown),
    show: (key, b) => {
      const c = casts[b], n = c?.names.get(key), ch = chars.get(key);
      if (!n || !ch || ch.name === n) return;
      const tex = (k) => c.tex.get(k) ?? casts[0].tex?.get(k); // a first-cast character in the second wave
      ch.setPictures(tex(`chars/${n}`), tex(`chars-ai/${n}`));
      ch.name = n;
    },
    done: (b) => { shown = b; chars.forEach((_, key) => api.show(key, b)); },
  };
  return api;
}
