// The one checked copy of the specimen copy that a section and a frame part both show, kept here so a frame
// never reaches into a section's folder and the two can never show different words. Quoted from the site's
// source, each quote held to its file by an Assertion (the day the site rewords it, Coverage turns red), or
// the house filler (Person one to six). Pure data: types only from components, nothing rendered. An Assertion
// here has the shape foundation-assert.ts gives one ({ file under src/, needles }), written out so this
// module imports nothing from a section.
import type { AvatarPerson } from "@/components/design-system/AvatarGroup";
import type { Stat } from "@/components/website/HeroBits";

/** Exact text that must still be in a site file (a path from src/), as foundation-assert.ts's Assertion. */
export type Assertion = { readonly file: string; readonly needles: readonly string[] };
const site = (file: string, ...needles: string[]): Assertion => ({ file: `components/website/${file}`, needles });

const NTH = ["one", "two", "three", "four", "five", "six"];

/** The house filler people for avatars and avatar groups, Person one to six. */
export const PEOPLE: readonly AvatarPerson[] = NTH.map((n) => ({ name: `Person ${n}` }));

const CHARS = ["01-snapback", "02-pink-buns", "03-braids", "04-silver-shades", "05-ponytail-headset", "07-curls-glasses"];
const title = (slug: string) => {
  const words = slug.replace(/^\d+-/, "").split("-");
  return words.map((w, k) => (k === 0 ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
};

/** The tiles' characters as player models (public/tiles/chars) and their AI copies (public/tiles-holo/chars-ai). */
export type Model = { name: string; human: string; ai: string };
export const MODELS: readonly Model[] = CHARS.map((c) => ({
  name: title(c),
  human: `/tiles/chars/${c}.webp`,
  ai: `/tiles-holo/chars-ai/${c}.webp`,
}));

/** The hero's base count of digital copies. Hero.tsx keeps it private, so HERO_FIGURES holds this to it. */
export const COPIES_BASE = 1_009_271;

/** The hero's tone classes, as Hero.tsx writes them. */
export const TONE_HUMANS = "text-[#0a1b33]";
export const TONE_COPIES = "text-accent";

/** The hero's figures, words and tones held to Hero.tsx. */
export const HERO_FIGURES: Assertion = site(
  "Hero.tsx",
  "const COPIES_BASE = 1_009_271;",
  'value: "2B"',
  'label: ["Human players"]',
  'label: ["Digital copies made"]',
  `tone: "${TONE_HUMANS}"`,
  `tone: "${TONE_COPIES}"`,
);

/** The hero's two figures as Hero.tsx builds them, in its own tone classes. */
export function heroStats(copies: number, toneOfCopies = TONE_COPIES): Stat[] {
  return [
    { value: "2B", label: ["Human players"], tone: TONE_HUMANS, live: false },
    { value: copies.toLocaleString("en-US"), label: ["Digital copies made"], tone: toneOfCopies, live: true },
  ];
}

/** The hero's lede, written inline in Hero.tsx across two lines, so it cannot be imported. */
export const HERO_LEDE = "Our model watched millions of hours of gameplay. Now it understands the game player.";
export const HERO_LEDE_SOURCE: Assertion = site(
  "Hero.tsx",
  "Our model watched millions of hours of gameplay. Now it",
  "understands the game player.",
);

/** The site's own section headings as copy, each held to its file. */
export const JOBS_HEAD = { title: "One model.", accent: "Three jobs.", sub: "Everything comes from the model of your players." } as const;
export const JOBS_HEAD_SOURCE: Assertion = site(
  "Jobs.tsx",
  `${JOBS_HEAD.title} <span className="text-accent">${JOBS_HEAD.accent}</span>`,
  JOBS_HEAD.sub,
);
export const FAQ_HEAD = { title: "Questions,", accent: "answered." } as const;
export const FAQ_HEAD_SOURCE: Assertion = site("Faq.tsx", `${FAQ_HEAD.title} <span className="text-accent">${FAQ_HEAD.accent}</span>`);
export const CLOSING_HEAD = { title: "1 million made", accent: "2 billion to go" } as const;
export const CLOSING_HEAD_SOURCE: Assertion = site(
  "Closing.tsx",
  CLOSING_HEAD.title,
  `<TypedWord word="${CLOSING_HEAD.accent}" className="text-accent" onView />`,
);
