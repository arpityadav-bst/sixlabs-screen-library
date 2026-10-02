// Motion values the overlays (Tooltip, Toast, Dialog) share, every one read from the token set so none is a
// local copy: the exit ease from ease-in, the tooltip's quick in from dur-quick and its out from dur-press,
// the toast's exit from dur-quick, the panel's exit from dur-exit, the sheet's slide back from dur-ui, the
// veil from dur-menu and the reduced fade from dur-exit. The sheet's spring is the one overlay value with no
// token yet.
import { DURATIONS, EASES } from "./token-motion";

function bezier(name: string): [number, number, number, number] {
  const t = EASES.find((e) => e.name === name);
  const n = (t?.value.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  if (n.length !== 4) throw new Error(`overlay-motion.ts: no cubic-bezier token ${name}`);
  return [n[0], n[1], n[2], n[3]];
}

function seconds(name: string): number {
  const t = DURATIONS.find((d) => d.name === name);
  if (!t) throw new Error(`overlay-motion.ts: no duration token ${name}`);
  return parseFloat(t.value) / 1000;
}

/** cubic-bezier(0.4, 0, 1, 1), the exits' ease */
export const EASE_IN = bezier("ease-in");

/** Overlay timings in seconds, as motion/react takes them. */
export const OVERLAY = {
  /** the tooltip fading and settling in (dur-quick) */
  tooltipIn: seconds("dur-quick"),
  /** the tooltip fading out (dur-press) */
  tooltipOut: seconds("dur-press"),
  /** a toast dropping 8px and fading (dur-quick) */
  toastOut: seconds("dur-quick"),
  /** the dialog panel leaving (dur-exit) */
  dialogOut: seconds("dur-exit"),
  /** the sheet sliding back down (dur-ui) */
  sheetOut: seconds("dur-ui"),
  /** the modal veil, on MobileMenu's 250ms (dur-menu) */
  veil: seconds("dur-menu"),
  /** every overlay under reduced motion: opacity only (dur-exit) */
  reducedFade: seconds("dur-exit"),
} as const;

/** The sheet rising from the bottom edge: firmer than the pop, so a tall panel lands without a bounce. */
export const SHEET_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;
