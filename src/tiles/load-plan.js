// The order the floor's first cast downloads in (planPictures, characters.js): the humans on tiles this
// screen shows, most central first, then the AI copy the auto-play converts first (autoplay.js: the most
// central tile with 0.4 of it in view), the other AI copies on screen, then the humans and AI copies on tiles
// it does not show (there for a resize). The live floor waits for the humans on screen and then, for at most
// REST_MS more, for the rest of the cast, so a first visit starts as a reload does: every picture in and on
// the GPU under the loader (the floor's rehearsal frame puts them up), none arriving mid-intro. A slow line
// waits no longer than that and takes the rest as it lands. A static render waits for everything.
// Returns { cast, pictures, wait }: wait holds keys and one promise (addCharacters waits for both).
import { castTiles, planPictures } from './characters.js';

const REST_MS = 3000;

export function planLoad(P, bustTiles, isStatic) {
  const cast = castTiles(bustTiles, P.chars ?? [], P.charActive);
  const human = (n) => `chars/${n}`, ai = (n) => `chars-ai/${n}`, uniq = (a) => [...new Set(a)];
  const tiles = bustTiles.map((t) => ({ t, name: cast.get(`${t.i},${t.j}`) })).filter((x) => x.name);
  const seen = tiles.filter(({ t }) => (t.shown ?? 0) > 0).sort((a, b) => (a.t.mid ?? 0) - (b.t.mid ?? 0));
  const shown = uniq(seen.map((x) => x.name));
  const all = uniq([...shown, ...tiles.map((x) => x.name)]);
  const first = seen.find(({ t }) => t.shown >= 0.4)?.name;
  const pictures = planPictures(P, [shown.map(human), first ? [ai(first)] : [], shown.map(ai), all.map(human), all.map(ai)]);
  if (isStatic) return { cast, pictures, wait: [...all.map(human), ...all.map(ai)] };
  const faces = shown.map(human), rest = uniq([...shown.map(ai), ...all.map(human), ...all.map(ai)]);
  const settled = Promise.all(faces.map((k) => pictures.get.get(k))).then(() => Promise.race([
    Promise.allSettled(rest.map((k) => pictures.get.get(k))),
    new Promise((r) => setTimeout(r, REST_MS)),
  ]));
  return { cast, pictures, wait: [...faces, settled] };
}
