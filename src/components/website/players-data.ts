// The four player types of the "Real player. Their model." section, each with its own portrait (public/players:
// head to chest, fading out at the bottom). Trait values are 0..1 and drive the bars.
export type Player = {
  id: string;
  title: string;
  tagline: string; // one line for the selector card
  body: string;
  picture: string;
  video?: string; // a left-to-right turn the cursor scrubs (PlayerPortrait.tsx), in place of the still
  traits: { label: string; value: number }[];
};

const traits = (
  curiosity: number,
  patience: number,
  price: number,
  skill: number,
) => [
  { label: "Curiosity", value: curiosity },
  { label: "Patience", value: patience },
  { label: "Price sensitivity", value: price },
  { label: "Skill", value: skill },
];

export const PLAYERS: Player[] = [
  {
    id: "explorer",
    title: "The explorer",
    tagline: "Maps every corner before the main path.",
    body: "Opens every menu. Walks the wrong way on purpose. Finds your bugs before QA does.",
    picture: "/players/explorer.webp?v=3",
    video: "/players/explorer.webm?v=2",
    traits: traits(0.95, 0.72, 0.55, 0.6),
  },
  {
    id: "grinder",
    title: "The grinder",
    tagline: "Runs the same loop until something changes.",
    body: "Same loop, every night. Never reads the tutorial. Notices the second you change the drop rate.",
    picture: "/players/grinder.webp?v=2",
    traits: traits(0.2, 0.96, 0.8, 0.82),
  },
  {
    id: "spender",
    title: "The spender",
    tagline: "Pays the moment the value is clear.",
    body: "Checks the shop before the quest. Buys when the value is obvious. Leaves when the price shows first.",
    picture: "/players/spender.webp?v=2",
    traits: traits(0.5, 0.35, 0.18, 0.45),
  },
  {
    id: "lost",
    title: "The one you lose",
    tagline: "Quits at the first wall that feels unfair.",
    body: "Hits the wall at the boss. Tries twice. Closes the app. Your D7 number is made of this player.",
    picture: "/players/lost.webp?v=2",
    traits: traits(0.4, 0.15, 0.7, 0.3),
  },
];
