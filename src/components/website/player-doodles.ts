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
  scale?: number; // this drawing's size against the others (1 = the usual)
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
// seconds, each starting a little before the last one ends. A part is [path, seconds, dotted?]. The
// drawings beside the shoulders (LOWER) are a little larger, so they hold their space.
const LOWER = 1.25;
const cluster = (
  to: [number, number],
  at: number,
  parts: [string, number, boolean?][],
  scale = 1,
): Stroke[] => {
  let t = at;
  return parts.map(([d, dur, dotted]) => {
    const s: Stroke = { d, at: t, dur, dotted, o: [0, 0], to, scale };
    t += dur * 0.85;
    return s;
  });
};

// The grinder, at it every night: a clock at 2 a.m., a dotted run over the hood to a crescent moon and
// its stars, a mug of coffee still steaming, and a game controller.
const GRINDER: Stroke[] = [
  ...cluster([60, 132], 0, [
    [circle(0, 0, 46), 0.6],
    ["M 0 -46 V -38 M 46 0 H 38 M 0 46 V 38 M -46 0 H -38", 0.3],
    ["M 0 -30 V 0 L 19 -11", 0.3],
  ]),
  { d: "M 95 80 Q 400 -85 700 72", at: 1.15, dur: 1.2, dotted: true },
  ...cluster([725, 125], 2.15, [
    ["M 12 -42 A 44 44 0 1 0 42 14 A 34 34 0 0 1 12 -42 Z", 0.7],
    [sparkle(60, -32, 11), 0.25],
    [sparkle(66, 26, 7), 0.2],
  ]),
  ...cluster(
    [35, 420],
    3.5,
    [
      [
        "M -34 -20 H 30 V 22 A 14 14 0 0 1 16 36 H -20 A 14 14 0 0 1 -34 22 Z",
        0.6,
      ],
      ["M 30 -10 C 52 -10 52 22 30 22", 0.3],
      [
        "M -16 -30 C -24 -40 -8 -48 -16 -58 M 0 -30 C -8 -40 8 -48 0 -58 M 16 -30 C 8 -40 24 -48 16 -58",
        0.5,
      ],
    ],
    LOWER,
  ),
  ...cluster(
    [795, 445],
    4.9,
    [
      [
        "M -52 -16 C -52 -30 -40 -32 -26 -30 H 26 C 40 -32 52 -30 52 -16 L 60 22 C 62 36 46 42 36 30 L 26 18 H -26 L -36 30 C -46 42 -62 36 -60 22 Z",
        0.8,
      ],
      ["M -34 -14 V 6 M -44 -4 H -24", 0.25],
      [circle(24, -10, 4) + " " + circle(36, 0, 4), 0.25],
    ],
    LOWER,
  ),
  { d: sparkle(195, 35, 18), at: 6.3, dur: 0.3, o: [195, 35] },
  { d: sparkle(-20, 295, 12), at: 6.5, dur: 0.3, o: [-20, 295] },
];

// The spender: a credit card, a dotted arc high over the ponytail to a cut diamond, a coin with a dollar
// sign, a shopping cart, and sparkles.
const SPENDER: Stroke[] = [
  ...cluster([70, 135], 0, [
    [
      "M -58 -36 H 58 A 8 8 0 0 1 66 -28 V 28 A 8 8 0 0 1 58 36 H -58 A 8 8 0 0 1 -66 28 V -28 A 8 8 0 0 1 -58 -36 Z",
      0.7,
    ],
    ["M -66 -16 H 66", 0.2],
    ["M -48 2 H -26 V 18 H -48 Z M 2 20 H 48", 0.35],
  ]),
  { d: "M 110 70 Q 400 -94 700 60", at: 1.15, dur: 1.2, dotted: true },
  ...cluster([725, 130], 2.15, [
    ["M -50 -16 L -30 -40 H 30 L 50 -16 L 0 44 Z", 0.6],
    ["M -50 -16 H 50 M -14 -16 L 0 -40 L 14 -16", 0.3],
    ["M -30 -40 L -14 -16 L 0 44 L 14 -16 L 30 -40", 0.35],
  ]),
  ...cluster(
    [45, 420],
    3.5,
    [
      [circle(0, 0, 40), 0.5],
      [circle(0, 0, 31), 0.35],
      [
        "M 11 -12 C 8 -18 -12 -18 -12 -7 C -12 3 12 -1 12 10 C 12 20 -8 20 -12 12 M 0 -24 V 24",
        0.45,
      ],
    ],
    LOWER,
  ),
  ...cluster(
    [795, 445],
    4.8,
    [
      ["M -62 -34 H -46 L -32 20 H 40 L 54 -18 H -40", 0.7],
      ["M -36 0 H 47", 0.2],
      [circle(-20, 36, 7) + " " + circle(30, 36, 7), 0.3],
    ],
    LOWER,
  ),
  { d: sparkle(190, 45, 18), at: 6.1, dur: 0.3, o: [190, 45] },
  { d: sparkle(640, 30, 13), at: 6.3, dur: 0.3, o: [640, 30] },
  { d: sparkle(-20, 295, 12), at: 6.5, dur: 0.3, o: [-20, 295] },
];

// The one you lose: a skull for the boss that stopped him, a dotted run over the head that sags and drops,
// a broken heart, a battery nearly empty, a chart arrow falling away, and a bored "zzz".
const LOST: Stroke[] = [
  ...cluster([100, 130], 0, [
    [
      "M -38 10 C -48 -30 -24 -48 0 -48 C 24 -48 48 -30 38 10 C 34 18 26 20 24 28 V 40 H -24 V 28 C -26 20 -34 18 -38 10 Z",
      0.8,
    ],
    [circle(-15, -6, 10) + " " + circle(15, -6, 10), 0.35],
    ["M -4 14 L 0 6 L 4 14 Z M -12 28 V 40 M 0 28 V 40 M 12 28 V 40", 0.35],
  ]),
  {
    d: "M 150 60 C 300 -33 520 -43 630 10 C 670 29 680 80 690 120",
    at: 1.3,
    dur: 1.2,
    dotted: true,
  },
  ...cluster([720, 125], 2.4, [
    [
      "M 0 40 C -60 0 -50 -40 -22 -40 C -8 -40 0 -30 0 -22 C 0 -30 8 -40 22 -40 C 50 -40 60 0 0 40 Z",
      0.7,
    ],
    ["M 0 -22 L -8 -6 L 6 6 L -4 22 L 0 40", 0.35],
  ]),
  ...cluster(
    [90, 380],
    3.5,
    [
      ["M -46 -22 H 40 V 22 H -46 Z M 40 -8 H 48 V 8 H 40", 0.6],
      ["M -38 -14 H -28 V 14 H -38 Z", 0.25],
    ],
    LOWER,
  ),
  ...cluster(
    [790, 420],
    4.4,
    [
      ["M -60 -40 L -26 -8 L -6 -24 L 36 26", 0.6],
      ["M 14 26 H 38 V 2", 0.25],
    ],
    LOWER,
  ),
  ...cluster([640, 265], 5.4, [
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
