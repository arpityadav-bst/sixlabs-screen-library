// Two casts of characters take turns on the floor: each reset wave (autoplay.js) swaps every tile to the
// other one, P.chars then P.chars2. The second downloads in the background once the floor is live; until
// it is in, waves keep the first. Its textures are uploaded to the GPU as soon as they arrive, so the
// swap mid-wave never stalls. With mixWaves (a floor of many tiles, where the second cast is too few to fill
// it) the second cast takes the middle tiles, one character each, and the first cast's characters fill the
// tiles around them (castTiles, characters.js); those pictures are the first cast's own, already loaded.
import { loadPictures, castTiles } from './characters.js';

const settled = async (pics) => new Map(await Promise.all([...pics].map(async ([k, t]) => [k, await t])));

// Returns { next(), show(key, b), done(b) }: next is the cast the coming wave shows, show swaps one tile's
// pictures, done records the swap and brings every other tile (off screen too) along.
export function createCasts({ P, renderer, chars, bustTiles, pictures, gone, mixWaves = false }) {
  const casts = [{ names: new Map([...chars].map(([k, c]) => [k, c.name])), tex: null }, null];
  settled(pictures).then((tex) => { casts[0].tex = tex; });
  if (P.chars2?.length) {
    settled(loadPictures(P, P.chars2)).then((tex) => {
      if (gone()) return;
      tex.forEach((t) => renderer.initTexture(t));
      casts[1] = { names: castTiles(bustTiles, P.chars2, null, mixWaves ? P.chars : null), tex };
    });
  }
  let shown = 0;
  const api = {
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
