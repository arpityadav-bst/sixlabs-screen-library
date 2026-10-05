// Contextual palettes: the white ladder on the accent blue and on navy, the terminal window, the hologram
// glows, the chromatic fringe and the logo's own fills. Each stays in its context and never styles plain UI.
import { tk, type Token } from "./token-types";

const W = "components/website/";
const G = "app/globals.css";

export const ON_BLUE: readonly Token[] = [
  tk("color-on-blue-80", "rgb(255 255 255 / 0.8)", "Body on blue", "Player body, carousel body, ModeToggle rest text",
    "Light grounds", `${W}Players.tsx:127`, { utility: "text-white/80" }),
  tk("color-on-blue-75", "rgb(255 255 255 / 0.75)", "Trait label on blue", "The trait bar labels",
    "Light grounds", `${W}PlayerTraits.tsx:37`, { utility: "text-white/75" }),
  tk("color-on-blue-50", "rgb(255 255 255 / 0.5)", "Quiet white on navy and blue",
    "Toast close and tooltip shortcut at rest, inverse card meta, the read-only switch on blue, paused progress",
    "Text a reader must read", "system"),
  tk("color-on-blue-40", "rgb(255 255 255 / 0.4)", "Rest dot and line on blue",
    "Carousel dots at rest, terminal bar fills, the glass Button and on-blue Chip lines, the segmented blue " +
      "track, Slider ticks and the Switch track's hover on blue",
    "Text", `${W}PlayerCarousel.tsx:109`, { utility: "bg-white/40" }),
  tk("color-on-blue-25", "rgb(255 255 255 / 0.25)", "Ring on blue", "The ModeToggle track and arrow rings",
    "Text", `${W}ModeToggle.tsx:29`, { utility: "ring-white/25" }),
  tk("color-on-blue-20", "rgb(255 255 255 / 0.2)", "Track on blue", "The trait bar track", "Text",
    `${W}PlayerTraits.tsx:43`, { utility: "bg-white/20" }),
  tk("color-on-blue-15", "rgb(255 255 255 / 0.15)", "Glass fill on blue",
    "The ModeToggle track, glass hover fills, the IconButton glass fill, the on-blue Badge",
    "Light grounds, where it vanishes", `${W}ModeToggle.tsx:29`, { utility: "bg-white/15" }),
];

export const TERMINAL: readonly Token[] = [
  tk("color-terminal-bg", "#0b1526", "Terminal body", "The jobs terminal window", "UI outside the terminal",
    `${W}JobTerminal.tsx:135`, { utility: "bg-[#0b1526]" }),
  tk("color-terminal-bar", "#111d31", "Terminal title bar", "The bar holding the window dots",
    "UI outside the terminal", `${W}JobTerminal.tsx:137`, { utility: "bg-[#111d31]" }),
  tk("color-terminal-rule", "rgb(255 255 255 / 0.06)", "Terminal rule", "The bar's foot rule", "Light grounds",
    `${W}JobTerminal.tsx:137`, { utility: "border-white/[0.06]" }),
  tk("color-terminal-track", "rgb(255 255 255 / 0.08)", "Terminal track", "Load and score bar tracks",
    "Light grounds", `${W}JobTerminal.tsx:222`, { utility: "bg-white/[0.08]" }),
  tk("color-terminal-fill", "rgb(255 255 255 / 0.4)", "Terminal fill", "Load and score bar fills",
    "Light grounds", `${W}JobTerminal.tsx:224`, { utility: "bg-white/40" }),
  tk("color-accent-on-dark", "#6ea8ff", "Accent lifted for dark", "The terminal's answer, the dark focus ring, info toasts",
    "Light grounds, where it fails contrast", `${W}JobTerminal.tsx:32`),
  tk("color-accent-on-dark-glow", "rgb(110 168 255 / 0.11)", "Terminal foot glow", "The radial at the terminal's foot",
    "Text or lines", `${W}JobTerminal.tsx:149`),
  tk("color-terminal-red", "#ff5f57", "Window dot", "The terminal's first dot", "Status, which takes color-danger",
    `${W}JobTerminal.tsx:138`),
  tk("color-terminal-amber", "#febc2e", "Window dot", "The terminal's second dot", "Status, which takes color-warning",
    `${W}JobTerminal.tsx:139`),
  tk("color-terminal-green", "#28c840", "Window dot", "The terminal's third dot", "Status, which takes color-success",
    `${W}JobTerminal.tsx:140`),
];

export const HOLOGRAM: readonly Token[] = [
  tk("color-holo-glow", "#7fb2ff", "Hologram glow", "The AI doodle's glow lines and pen halos",
    "Text or UI", `${W}DoodleStroke.tsx:18`),
  tk("color-holo-laser", "rgb(120 175 255 / 0.95)", "Laser glow", "The Human / AI sweep's laser line glow",
    "Text or UI", `${W}PortraitSwap.tsx:30`),
  tk("color-holo-dot", "#9cc0ff", "CTA dot band", "The primary button's sweeping dot band",
    "Text or UI", `${W}CtaDots.tsx:17`),
  tk("color-doodle", "rgb(255 255 255 / 0.85)", "Hand doodle line", "The doodles round the players",
    "Light grounds", `${W}DoodleStroke.tsx:94`),
  tk("color-band-ink", "#2f6dff", "Glyph sweep ink", "The ASCII field's sweep band",
    "UI, which takes color-accent", `${W}ascii-field.js:62`),
];

export const FRINGE: readonly Token[] = [
  tk("color-fringe-red", "#e89fa4", "Chromatic split, warm side", "The footer wordmark's left copy",
    "Text or UI", `${G}:208`),
  tk("color-fringe-cyan", "#9ed5dd", "Chromatic split, cool side", "The footer wordmark's right copy",
    "Text or UI", `${G}:212`),
  tk("color-fringe-red-ascii", "rgb(255 90 90)", "Glyph fringe, warm", "The ASCII pool's red fringe at 0.14",
    "Text or UI", `${W}ascii-field.js:181`),
  tk("color-fringe-cyan-ascii", "rgb(90 200 255)", "Glyph fringe, cool", "The ASCII pool's cyan fringe at 0.14",
    "Text or UI", `${W}ascii-field.js:182`),
];

export const BRAND: readonly Token[] = [
  tk("color-logo-blue", "#1770EF", "Logo blades", "The 6labs mark only", "UI, which takes color-accent",
    `${W}brand-marks.tsx:86`),
  tk("color-logo-navy", "#030D2D", "Logo core", "The 6labs mark only", "UI, which takes color-ink",
    `${W}brand-marks.tsx:85`),
];
