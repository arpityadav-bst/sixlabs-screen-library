// The floor's three procedural textures (textures.js: the resting tiles' frost, the raised tile's gradient and
// its glint), painted ahead of time by tools/tiles/bake-textures.mjs into public/tiles/baked/, so the page loads
// them as pictures instead of painting them pixel by pixel on its main thread (about 1.4 s of the first load on
// a 2019 MacBook Pro). Each picture is listed in baked-manifest.js with every floor setting its painting read;
// one is used only where all of those still match, so a changed setting is painted at load as before until the
// bake is run again. The pixels are the same either way, and the animation (the rim beam, the sweep, the glint's
// move, the blue spill) is drawn over them by the shaders as before. The floor waits for them (bakedReady)
// before it draws anything.
import * as THREE from 'three';
import MANIFEST from './baked-manifest.js';

const pending = new Set();
export const bakedReady = () => Promise.all([...pending]);

// Safari before 17 and Firefox before 98 decode pictures as <img> instead (as characters.js does)
const bitmaps = typeof createImageBitmap !== 'undefined' && !(() => {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  const safari = /^((?!chrome|android).)*safari/i.test(ua) && +(ua.match(/Version\/(\d+)/)?.[1] ?? 0) < 17;
  return safari || +(ua.match(/Firefox\/(\d+)/)?.[1] ?? 99) < 98;
})();

const matches = (P, params) => Object.entries(params).every(([k, v]) => JSON.stringify(P[k] ?? null) === JSON.stringify(v));

// The texture for key under settings P: the baked picture where one matches, else paint() (textures.js).
export function bakedTexture(key, P, paint) {
  const hit = typeof document !== 'undefined' && MANIFEST[key]?.find((e) => matches(P, e.params));
  if (!hit) return paint();
  const t = new THREE.Texture();
  if (hit.srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  const url = `${P.assetBase ?? '/tiles'}/baked/${hit.file}`;
  // decoded upside down where it is a bitmap, as the painted canvas was flipped on upload
  const load = bitmaps
    ? new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' })
      .loadAsync(url).then((img) => { t.flipY = false; return img; })
    : new THREE.ImageLoader().loadAsync(url);
  const done = load
    .then((img) => { t.image = img; }, () => { t.image = paint().image; }) // the picture missing: painted as before
    .then(() => { t.needsUpdate = true; pending.delete(done); });
  pending.add(done);
  return t;
}
