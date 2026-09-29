// The four player types of the "Real player. Their model." section, each cast with one of the floor's
// characters. Trait values are 0..1 and drive the bars.
export type Player = {
  id: string;
  title: string;
  body: string;
  picture: string;
  traits: { label: string; value: number }[];
};

const traits = (curiosity: number, patience: number, price: number, skill: number) => [
  { label: "Curiosity", value: curiosity },
  { label: "Patience", value: patience },
  { label: "Price sensitivity", value: price },
  { label: "Skill", value: skill },
];

export const PLAYERS: Player[] = [
  {
    id: "explorer",
    title: "The explorer",
    body: "Opens every menu. Walks the wrong way on purpose. Finds your bugs before QA does.",
    picture: "/tiles/chars/27-vr-explorer.webp",
    traits: traits(0.95, 0.72, 0.55, 0.6),
  },
  {
    id: "grinder",
    title: "The grinder",
    body: "Same loop, every night. Never reads the tutorial. Notices the second you change the drop rate.",
    picture: "/tiles/chars/22-grey-beard-raider.webp",
    traits: traits(0.2, 0.96, 0.8, 0.82),
  },
  {
    id: "spender",
    title: "The spender",
    body: "Checks the shop before the quest. Buys when the value is obvious. Leaves when the price shows first.",
    picture: "/tiles/chars/26-ponytail-mobile.webp",
    traits: traits(0.5, 0.35, 0.18, 0.45),
  },
  {
    id: "lost",
    title: "The one you lose",
    body: "Hits the wall at the boss. Tries twice. Closes the app. Your D7 number is made of this player.",
    picture: "/tiles/chars/12-glasses-lost.webp",
    traits: traits(0.4, 0.15, 0.7, 0.3),
  },
];

export const PLAYERS_SUBTITLE =
  "Left is a real player. Right is their model, playing a second and a half behind. Same habits. Same shortcuts. Same mistakes.";

