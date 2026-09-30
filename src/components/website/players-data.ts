// The four player types of the "Real player. Their model." section, each with its own portrait (public/players:
// head to chest, fading out at the bottom). Trait values are 0..1 and drive the bars.
export type Clip = {
  src: string;
  straight: number;
  stacked: string;
  still: string;
};

export type Player = {
  id: string;
  title: string;
  tagline: string; // one line for the selector card
  body: string;
  picture: string;
  // a left-to-right turn the cursor scrubs (PlayerPortrait.tsx), in place of the still; `straight` is where
  // in it (a share of its length) they look straight at the camera
  // `stacked` is the same clip as a stacked-alpha MP4 and `still` its straight-ahead frame, for browsers
  // that cannot show the WebM's transparency (useClipFormat.ts)
  video?: Clip;
  aiVideo?: Clip; // the same turn as their AI copy (the Human / AI toggle)
  holoVideo?: Clip; // that AI copy as the blue hologram, for the hologram pages (art.tsx)
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
    video: {
      src: "/players/explorer.webm?v=3",
      straight: 0.49,
      stacked: "/players/explorer-stacked.mp4?v=2",
      still: "/players/explorer-still.webp",
    },
    aiVideo: {
      src: "/players/explorer-ai.webm?v=1",
      straight: 0.49,
      stacked: "/players/explorer-ai-stacked.mp4?v=2",
      still: "/players/explorer-ai-still.webp",
    },
    holoVideo: {
      src: "/players-holo/explorer-ai.webm?v=1",
      straight: 0.48,
      stacked: "/players-holo/explorer-ai-stacked.mp4?v=1",
      still: "/players-holo/explorer-ai-still.webp",
    },
    traits: traits(0.95, 0.72, 0.55, 0.6),
  },
  {
    id: "grinder",
    title: "The grinder",
    tagline: "Runs the same loop until something changes.",
    body: "Same loop, every night. Never reads the tutorial. Notices the second you change the drop rate.",
    picture: "/players/grinder.webp?v=2",
    video: {
      src: "/players/grinder.webm?v=1",
      straight: 0.5,
      stacked: "/players/grinder-stacked.mp4?v=2",
      still: "/players/grinder-still.webp",
    },
    aiVideo: {
      src: "/players/grinder-ai.webm?v=1",
      straight: 0.5,
      stacked: "/players/grinder-ai-stacked.mp4?v=2",
      still: "/players/grinder-ai-still.webp",
    },
    holoVideo: {
      src: "/players-holo/grinder-ai.webm?v=1",
      straight: 0.48,
      stacked: "/players-holo/grinder-ai-stacked.mp4?v=1",
      still: "/players-holo/grinder-ai-still.webp",
    },
    traits: traits(0.2, 0.96, 0.8, 0.82),
  },
  {
    id: "spender",
    title: "The spender",
    tagline: "Pays the moment the value is clear.",
    body: "Checks the shop before the quest. Buys when the value is obvious. Leaves when the price shows first.",
    picture: "/players/spender.webp?v=2",
    video: {
      src: "/players/spender.webm?v=1",
      straight: 0.54,
      stacked: "/players/spender-stacked.mp4?v=2",
      still: "/players/spender-still.webp",
    },
    aiVideo: {
      src: "/players/spender-ai.webm?v=1",
      straight: 0.52,
      stacked: "/players/spender-ai-stacked.mp4?v=2",
      still: "/players/spender-ai-still.webp",
    },
    holoVideo: {
      src: "/players-holo/spender-ai.webm?v=2",
      straight: 0.48,
      stacked: "/players-holo/spender-ai-stacked.mp4?v=2",
      still: "/players-holo/spender-ai-still.webp?v=2",
    },
    traits: traits(0.5, 0.35, 0.18, 0.45),
  },
  {
    id: "lost",
    title: "The one you lose",
    tagline: "Quits at the first wall that feels unfair.",
    body: "Hits the wall at the boss. Tries twice. Closes the app. Your D7 number is made of this player.",
    picture: "/players/lost.webp?v=2",
    video: {
      src: "/players/lost.webm?v=1",
      straight: 0.52,
      stacked: "/players/lost-stacked.mp4?v=2",
      still: "/players/lost-still.webp",
    },
    aiVideo: {
      src: "/players/lost-ai.webm?v=1",
      straight: 0.52,
      stacked: "/players/lost-ai-stacked.mp4?v=2",
      still: "/players/lost-ai-still.webp",
    },
    holoVideo: {
      src: "/players-holo/lost-ai.webm?v=2",
      straight: 0.48,
      stacked: "/players-holo/lost-ai-stacked.mp4?v=2",
      still: "/players-holo/lost-ai-still.webp?v=2",
    },
    traits: traits(0.4, 0.15, 0.7, 0.3),
  },
];
