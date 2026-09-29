// The doodles drawn around each player's head (PlayerDoodles.tsx). Coordinates are the portrait video's own
// frame (810 x 1080, the head in its upper middle, about 75 to 450 down); each drawing is placed just
// clear of that player's measured outline. `at` is when each stroke starts, seconds after the doodling begins.
// `o` is the centre of the drawing a stroke belongs to as written, which it is shrunk about (SIZE), and
// `to` is where that centre is placed, close around the head
export type Stroke = {
  d: string;
  at: number;
  dur: number;
  dotted?: boolean;
  o?: [number, number];
  to?: [number, number];
};

const circle = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} a ${r} ${r} 0 1 1 -0.1 0`;
const sparkle = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s}`;

// The explorer: a compass and a dotted route over the head to a map pin, the pin's trail on to an X, a
// magnifying glass, a peak with a flag, and a few sparkles. `at` is when each stroke starts, seconds.
const EXPLORER: Stroke[] = [
  { d: circle(-50, 150, 46), at: 0, dur: 0.7, o: [-50, 140], to: [60, 132] },
  {
    d: "M -50 116 L -41 150 L -50 184 L -59 150 Z",
    at: 0.6,
    dur: 0.4,
    o: [-50, 140],
    to: [60, 132],
  },
  {
    d: "M -57 88 L -50 74 L -43 88",
    at: 0.95,
    dur: 0.25,
    o: [-50, 140],
    to: [60, 132],
  },
  { d: "M 95 80 Q 400 -85 700 72", at: 1.15, dur: 1.2, dotted: true },
  {
    d: "M 830 190 C 800 150 790 130 790 110 A 40 40 0 1 1 870 110 C 870 130 860 150 830 190 Z",
    at: 2.15,
    dur: 0.6,
    o: [830, 140],
    to: [725, 125],
  },
  {
    d: circle(830, 108, 14),
    at: 2.65,
    dur: 0.3,
    o: [830, 140],
    to: [725, 125],
  },
  {
    d: "M 838 205 C 875 250 845 290 900 320 S 955 370 935 398",
    at: 2.85,
    dur: 0.8,
    dotted: true,
    o: [830, 140],
    to: [725, 125],
  },
  {
    d: "M 918 408 L 950 440",
    at: 3.55,
    dur: 0.2,
    o: [830, 140],
    to: [725, 125],
  },
  {
    d: "M 950 408 L 918 440",
    at: 3.75,
    dur: 0.2,
    o: [830, 140],
    to: [725, 125],
  },
  {
    d: circle(-70, 430, 40),
    at: 4.05,
    dur: 0.6,
    o: [-60, 440],
    to: [35, 420],
  },
  { d: "M -42 459 L 2 503", at: 4.55, dur: 0.3, o: [-60, 440], to: [35, 420] },
  {
    d: "M -94 424 A 25 25 0 0 1 -74 404",
    at: 4.85,
    dur: 0.25,
    o: [-60, 440],
    to: [35, 420],
  },
  {
    d: "M 700 560 L 770 480 L 805 515 L 870 430 L 960 560",
    at: 5.15,
    dur: 0.8,
    o: [830, 470],
    to: [795, 445],
  },
  {
    d: "M 848 458 L 866 472 L 886 454",
    at: 5.85,
    dur: 0.25,
    o: [830, 470],
    to: [795, 445],
  },
  {
    d: "M 870 430 L 870 360",
    at: 6.05,
    dur: 0.25,
    o: [830, 470],
    to: [795, 445],
  },
  {
    d: "M 870 362 L 912 377 L 870 392",
    at: 6.25,
    dur: 0.3,
    o: [830, 470],
    to: [795, 445],
  },
  { d: sparkle(150, 26, 18), at: 6.55, dur: 0.3, o: [150, 26], to: [195, 35] },
  { d: sparkle(650, 4, 14), at: 6.75, dur: 0.3, o: [650, 4], to: [605, 12] },
  {
    d: sparkle(-150, 300, 12),
    at: 6.95,
    dur: 0.3,
    o: [-150, 300],
    to: [-20, 295],
  },
  {
    d: sparkle(990, 250, 12),
    at: 7.15,
    dur: 0.3,
    o: [990, 250],
    to: [875, 220],
  },
];

// A drawing written about its own centre (0, 0), placed at `to`, its strokes following one another from `at`
// seconds, each starting a little before the last one ends. A part is [path, seconds, dotted?].
const cluster = (
  to: [number, number],
  at: number,
  parts: [string, number, boolean?][],
): Stroke[] => {
  let t = at;
  return parts.map(([d, dur, dotted]) => {
    const s: Stroke = { d, at: t, dur, dotted, o: [0, 0], to };
    t += dur * 0.85;
    return s;
  });
};

// The grinder: a repeat loop, a dotted run over the head to a crescent moon and its stars (the night
// session), an XP bar filling with a level-up arrow, tally marks, and a loot gem dropping in.
const GRINDER: Stroke[] = [
  ...cluster([60, 132], 0, [
    ["M -40 -24 A 46 46 0 0 1 38 -26", 0.45],
    ["M 22 -40 L 38 -26 L 20 -14", 0.2],
    ["M 40 24 A 46 46 0 0 1 -38 26", 0.45],
    ["M -22 40 L -38 26 L -20 14", 0.2],
  ]),
  { d: "M 95 80 Q 400 -85 700 72", at: 1.15, dur: 1.2, dotted: true },
  ...cluster([725, 125], 2.15, [
    ["M 10 -47 A 48 48 0 1 0 38 30 A 44 44 0 0 1 10 -47 Z", 0.7],
    [sparkle(62, -40, 11), 0.25],
    [sparkle(72, 18, 7), 0.2],
  ]),
  ...cluster([35, 420], 3.5, [
    ["M -80 -14 H 80 A 14 14 0 0 1 80 14 H -80 A 14 14 0 0 1 -80 -14 Z", 0.6],
    [
      "M -66 8 L -56 -8 M -46 8 L -36 -8 M -26 8 L -16 -8 M -6 8 L 4 -8 M 14 8 L 24 -8",
      0.5,
    ],
    ["M 58 -30 V -62 M 46 -50 L 58 -62 L 70 -50", 0.3],
  ]),
  ...cluster([795, 445], 4.9, [
    ["M -45 -35 V 35 M -22 -35 V 35 M 1 -35 V 35 M 24 -35 V 35", 0.55],
    ["M -60 22 L 40 -22", 0.2],
  ]),
  ...cluster([875, 235], 5.8, [
    ["M 0 -78 V -36", 0.35, true],
    ["M -18 -8 L -8 -20 H 8 L 18 -8 L 0 18 Z M -18 -8 H 18", 0.4],
  ]),
  { d: sparkle(195, 35, 18), at: 6.6, dur: 0.3, o: [195, 35] },
  { d: sparkle(-20, 295, 12), at: 6.8, dur: 0.3, o: [-20, 295] },
];

// The spender: a price tag on its string, a dotted arc high over the ponytail to a cut gem, a stack of
// coins, a shopping bag, and sparkles.
const SPENDER: Stroke[] = [
  ...cluster([70, 135], 0, [
    ["M -60 0 L -30 -32 H 55 V 32 H -30 Z", 0.6],
    [circle(-32, 0, 7), 0.2],
    ["M -39 0 C -60 -30 -82 -30 -96 -12", 0.3],
  ]),
  { d: "M 110 70 Q 400 -150 700 60", at: 1.15, dur: 1.2, dotted: true },
  ...cluster([725, 130], 2.15, [
    ["M -50 -18 L -26 -44 H 26 L 50 -18 L 0 46 Z", 0.6],
    ["M -50 -18 H 50 M -12 -18 L 0 -44 L 12 -18", 0.3],
    ["M -12 -18 L 0 46 L 12 -18", 0.25],
  ]),
  ...cluster([45, 420], 3.5, [
    ["M -40 -24 a 40 13 0 1 0 80 0 a 40 13 0 1 0 -80 0", 0.45],
    ["M -40 -24 V 24 M 40 -24 V 24", 0.25],
    ["M -40 0 a 40 13 0 0 0 80 0 M -40 24 a 40 13 0 0 0 80 0", 0.4],
  ]),
  ...cluster([795, 445], 4.8, [
    ["M -38 -20 H 38 L 44 50 H -44 Z", 0.55],
    ["M -18 -20 C -18 -54 18 -54 18 -20", 0.3],
  ]),
  { d: sparkle(190, 45, 18), at: 5.9, dur: 0.3, o: [190, 45] },
  { d: sparkle(640, 30, 13), at: 6.1, dur: 0.3, o: [640, 30] },
  { d: sparkle(-20, 295, 12), at: 6.3, dur: 0.3, o: [-20, 295] },
  { d: sparkle(875, 230, 12), at: 6.5, dur: 0.3, o: [875, 230] },
];

// The one you lose: a brick wall, a dotted run over the head that sags and drops, a power button (the app
// closed), a retry arrow tried twice, a retention line falling away, and a bored "zzz".
const LOST: Stroke[] = [
  ...cluster([100, 130], 0, [
    ["M -60 -40 H 60 V 40 H -60 Z", 0.6],
    ["M -60 -13 H 60 M -60 13 H 60", 0.3],
    [
      "M -20 -40 V -13 M 30 -40 V -13 M 0 -13 V 13 M -40 -13 V 13 M 45 -13 V 13 M -25 13 V 40 M 20 13 V 40",
      0.45,
    ],
  ]),
  {
    d: "M 150 60 C 300 -70 520 -80 630 10 C 670 45 680 80 690 120",
    at: 1.15,
    dur: 1.2,
    dotted: true,
  },
  ...cluster([720, 125], 2.3, [
    ["M -26 -28 A 38 38 0 1 0 26 -28", 0.55],
    ["M 0 -44 V -6", 0.2],
  ]),
  ...cluster([90, 380], 3.2, [
    ["M 30 -22 A 36 36 0 1 0 36 10", 0.5],
    ["M 20 -36 L 31 -21 L 13 -14", 0.2],
    ["M 58 -12 V 12 M 72 -12 V 12", 0.25],
  ]),
  ...cluster([790, 420], 4.3, [
    ["M -60 -50 V 45 H 70", 0.45],
    ["M -48 -36 L -20 -24 L 6 2 L 32 10 L 60 34", 0.5],
    [circle(60, 34, 5), 0.15],
  ]),
  ...cluster([640, 10], 5.4, [
    ["M 0 0 H 16 L 0 16 H 16", 0.25],
    ["M 26 -24 H 38 L 26 -12 H 38", 0.2],
    ["M 46 -42 H 55 L 46 -33 H 55", 0.15],
  ]),
];

export const DOODLES: Record<string, Stroke[]> = {
  explorer: EXPLORER,
  grinder: GRINDER,
  spender: SPENDER,
  lost: LOST,
};
