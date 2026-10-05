// Site values the partials quote, each tied to the source line it was read from. build.mjs fails when a
// needle is no longer in its file (the site moved, so the partial that quotes it is stale) or when the
// partial no longer says what the fact records (the prose moved, so the fact needs updating with it).
// Paths are from the project root. A needle is a plain substring of the file, a `says` a plain substring of
// the partial. Add a fact whenever a partial quotes a number or a class that a site change could falsify.

const W = "src/components/website/";
const PARAMS = "public/tiles/floor-params.json";

/** Partial id -> [file, needle in the file, what the partial says about it]. */
export const FACTS = {
  comparison: [
    [`${W}Understands.tsx`, "text-[26px] md:text-[34px] leading-[1.1]", "Outfit 34 at 1.1 (26 on a phone)"],
    [`${W}Understands.tsx`, "font-sans text-[16px] md:text-[18px] font-normal leading-[1.5]", "Inter 18 at 1.5 (16 on a phone)"],
    [`${W}Understands.tsx`, "h-9 w-9 md:h-11 md:w-11", "a 44px mark (36 on a phone)"],
    [`${W}Understands.tsx`, "flex items-center gap-3", "12px apart"],
    [`${W}Understands.tsx`, "max-md:h-16 max-md:w-16 max-md:text-[27px]", "the disc from 80 to 64 and its word from 34 to 27"],
    [`${W}Understands.tsx`, "-top-[0.07em]", "lifted 0.07em"],
  ],
  doodles: [
    [`${W}PlayerDoodles.tsx`, "const DELAY_S = 1;", "The hand starts 1s after"],
    [`${W}PlayerDoodles.tsx`, "const HAND_PACE = 0.6;", "at 0.6x its written timing"],
    [`${W}PlayerDoodles.tsx`, "const AI_LEAD_S = 0.6;", "the switch plus 0.6s"],
    [`${W}usePlayerMode.ts`, "const AUTO_S = 5;", "the first switch at 5s"],
  ],
  "portrait-sweep": [[`${W}usePlayerMode.ts`, "const AUTO_S = 5;", "every 5s"]],
  "scroll-players": [
    [`${W}usePlayerMode.ts`, "const AUTO_S = 5;", "every 5s"],
    [`${W}usePlayersScale.ts`, "const BASE = 1920;", "Past 1920"],
    [`${W}usePlayersScale.ts`, "const MAX = 1.35;", "to at most 1.35"],
    [`${W}usePlayersScale.ts`, "const DENSE = 1.5;", "devicePixelRatio 1.5 and up"],
    [`${W}SafariScroll.tsx`, "const MAGNET = 0.3;", "within 0.3 of a screen"],
  ],
  behaviours: [
    [`${W}SafariScroll.tsx`, "const MAGNET = 0.3;", "within 0.3 of a screen"],
    [`${W}SafariScroll.tsx`, "const MAGNET_S = 0.6;", "in 0.6s"],
    [`${W}SafariScroll.tsx`, "const REST_MS = 120;", "rests 120ms"],
    [`${W}SafariScroll.tsx`, "lerp: 0.15", "lerp 0.15"],
  ],
  "motion-choreography": [
    [`${W}PlayerDoodles.tsx`, "const DELAY_S = 1;", "The hand draws from 1s"],
    [`${W}usePlayerMode.ts`, "const AUTO_S = 5;", "first turns AI at 5s"],
  ],
  "floor-lifecycle": [[`${W}HeroLoader.tsx`, "tracking-[0.18em] text-slate-500", "Its label is slate-500"]],
  "tile-states": [
    [PARAMS, '"footShade": 0.12', "up to 12% darker at its foot"],
    [PARAMS, '"footBand": 0.07', "fading to none 0.07 up"],
    [PARAMS, '"frostCorner": 0.08', "8% darker"],
    [PARAMS, '"frostCornerR": 0.3', "about 0.3 of the tile wide"],
    [PARAMS, '"actFootHold": 0.3', "over its lower 30%"],
    [PARAMS, '"actWallShade": 0.25', "at 0.25 here"],
    [PARAMS, '"actWallShade": 0.12', "0.12 activated"],
  ],
};

/** The errors for every fact: a needle gone from its file, or a partial that no longer says the value. */
export function factErrors(readFile, partials) {
  const out = [];
  const files = new Map();
  const source = (f) => {
    if (!files.has(f)) {
      try {
        files.set(f, readFile(f));
      } catch {
        files.set(f, null);
      }
    }
    return files.get(f);
  };
  for (const [id, facts] of Object.entries(FACTS)) {
    const md = partials.get(id);
    if (md === undefined) {
      out.push(`facts.mjs names ${id}, which is not a partial`);
      continue;
    }
    const flat = md.replace(/\s+/g, " ");
    for (const [file, needle, says] of facts) {
      const text = source(file);
      if (text === null) out.push(`${id}.md quotes ${file}, which is gone`);
      else if (!text.includes(needle)) out.push(`${id}.md quotes ${file} for "${says}", but "${needle}" is no longer there: update the partial and the fact`);
      if (!flat.includes(says)) out.push(`${id}.md no longer says "${says}" (${file}): update the fact in tools/design-md/facts.mjs`);
    }
  }
  return out;
}
