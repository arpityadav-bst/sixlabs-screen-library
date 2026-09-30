// The order the floor's first cast downloads in (planPictures, characters.js). The floor waits only for
// the humans on tiles this screen shows, most central first; then come the humans on tiles it does not
// show (there for a resize), then the AI copies, the one the auto-play converts first ahead of the rest
// (autoplay.js: the most central tile with 0.4 of it in view), the others in the same central-first order.
// A static render waits for everything. Returns { cast, pictures, wait }.
import { castTiles, planPictures } from './characters.js';

export function planLoad(P, bustTiles, isStatic) {
  const cast = castTiles(bustTiles, P.chars ?? [], P.charActive);
  const human = (n) => `chars/${n}`, ai = (n) => `chars-ai/${n}`, uniq = (a) => [...new Set(a)];
  const tiles = bustTiles.map((t) => ({ t, name: cast.get(`${t.i},${t.j}`) })).filter((x) => x.name);
  const seen = tiles.filter(({ t }) => (t.shown ?? 0) > 0).sort((a, b) => (a.t.mid ?? 0) - (b.t.mid ?? 0));
  const shown = uniq(seen.map((x) => x.name));
  const all = uniq([...shown, ...tiles.map((x) => x.name)]);
  const first = seen.find(({ t }) => t.shown >= 0.4)?.name;
  const pictures = planPictures(P, [shown.map(human), all.map(human), first ? [ai(first)] : [], all.map(ai)]);
  const wait = isStatic ? [...all.map(human), ...all.map(ai)] : shown.map(human);
  return { cast, pictures, wait };
}
