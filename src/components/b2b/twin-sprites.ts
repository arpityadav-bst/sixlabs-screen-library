// The pictures the B2B hero's stage (twin-stage.ts) stamps every frame, drawn once per size: the people as
// ASCII stick figures in the terminal's type (JetBrains Mono), the glyphs a person breaks into as the model
// reads them, the twins as dot-matrix figures on an exact grid, and the "[ ]" of a twin slot still pending.
// Stamping a small prepared canvas is far cheaper than writing text or dots afresh for hundreds of figures.

export const INK = "#767b85"; // the people: onBlue's dim ink
export const ACCENT = "#1a6dff"; // the twins and the model
// the panorama's colour split at its ends (twin-stage.ts): a red copy one way, a cyan copy the other
export const SPLIT = ["#ff3d5a", "#16c8e8"] as const;
// the chip colour a person takes on as they near the line (twin-stage.ts): circuit teal, and its glint
export const CHIP = ["#0fae9c", "#5ff2dc"] as const;

export type Sprite = { img: HTMLCanvasElement; w: number; h: number };

// a person: a head, arms and a stride, three characters by three lines; STEP is the legs together, for walking
export const PERSON = [" o ", "/|\\", "/ \\"];
export const STEP = [" o ", "/|\\", " | "];
// what a person breaks into while the model reads them
export const GLYPHS = "01<>/\\|#*+=%$&{}[]~:;";

// a twin: the same figure as a 7 by 11 dot matrix, one dot per filled cell
const TWIN = [
  "..###..",
  "..###..",
  "...#...",
  ".#####.",
  "#.###.#",
  "#..#..#",
  "...#...",
  "..#.#..",
  "..#.#..",
  ".#...#.",
  ".#...#.",
];

export type Metrics = { fs: number; cw: number; lh: number; figW: number; figH: number };

export function metrics(fs: number): Metrics {
  const cw = fs * 0.6, // JetBrains Mono's advance
    lh = fs * 1.05;
  return { fs, cw, lh, figW: Math.ceil(cw * 3), figH: Math.ceil(lh * 3) };
}

function sprite(w: number, h: number, dpr: number, draw: (x: CanvasRenderingContext2D) => void): Sprite {
  const img = document.createElement("canvas");
  img.width = Math.ceil(w * dpr);
  img.height = Math.ceil(h * dpr);
  const x = img.getContext("2d")!;
  x.scale(dpr, dpr);
  draw(x);
  return { img, w, h };
}

const text = (m: Metrics, dpr: number, family: string, lines: string[], color: string) =>
  sprite(m.figW, m.figH, dpr, (x) => {
    x.font = `500 ${m.fs}px ${family}`;
    x.textBaseline = "top";
    x.fillStyle = color;
    lines.forEach((l, k) => [...l].forEach((ch, i) => ch !== " " && x.fillText(ch, i * m.cw, k * m.lh)));
  });

export type Sprites = {
  m: Metrics;
  person: Sprite;
  step: Sprite;
  twin: Sprite;
  pending: Sprite;
  glyphs: Sprite[]; // one per GLYPHS character, in the accent
  split: { person: Sprite[]; step: Sprite[]; twin: Sprite[] }; // each in SPLIT's red, then cyan
  chip: { person: Sprite[]; step: Sprite[] }; // each in CHIP's teal, then its glint
};

export function makeSprites(fs: number, dpr: number, family: string): Sprites {
  const m = metrics(fs);
  const p = Math.min(m.figH / TWIN.length, m.figW / 7), // the dot pitch: the twin fits a person's box
    r = p * 0.36;
  const dots = (color: string) => sprite(m.figW, m.figH, dpr, (x) => {
    x.fillStyle = color;
    const ox = (m.figW - p * 7) / 2 + p / 2,
      oy = m.figH - p * TWIN.length + p / 2; // standing on the same line as a person's feet
    TWIN.forEach((row, j) =>
      [...row].forEach((c, i) => {
        if (c !== "#") return;
        x.beginPath();
        x.arc(ox + i * p, oy + j * p, r, 0, Math.PI * 2);
        x.fill();
      }),
    );
  });
  const twin = dots(ACCENT);
  return {
    m,
    person: text(m, dpr, family, PERSON, INK),
    step: text(m, dpr, family, STEP, INK),
    twin,
    pending: text(m, dpr, family, ["   ", "[ ]", "   "], ACCENT),
    chip: {
      person: CHIP.map((c) => text(m, dpr, family, PERSON, c)),
      step: CHIP.map((c) => text(m, dpr, family, STEP, c)),
    },
    split: {
      person: SPLIT.map((c) => text(m, dpr, family, PERSON, c)),
      step: SPLIT.map((c) => text(m, dpr, family, STEP, c)),
      twin: SPLIT.map((c) => dots(c)),
    },
    glyphs: [...GLYPHS].map((g) =>
      sprite(m.cw, m.lh, dpr, (x) => {
        x.font = `500 ${m.fs}px ${family}`;
        x.textBaseline = "top";
        x.fillStyle = ACCENT;
        x.fillText(g, 0, 0);
      }),
    ),
  };
}
