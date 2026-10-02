// Where a live tooltip goes. It sits on its side at an 8px offset, flips to the far side when it would cross
// the viewport's 8px collision padding and the far side has room, then slides along the edge to stay inside.
// The arrow offset is where the trigger's centre falls on the bubble, kept clear of the rounded corners.
export type TooltipSide = "top" | "bottom" | "left" | "right";

/** gap between the trigger and the bubble, px */
export const TOOLTIP_OFFSET = 8;
/** the least room kept to the viewport edge, px */
export const TOOLTIP_PADDING = 8;

const FAR: Record<TooltipSide, TooltipSide> = { top: "bottom", bottom: "top", left: "right", right: "left" };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export type TooltipPlacement = { side: TooltipSide; x: number; y: number; arrow: number };

/** The bubble's viewport position for a trigger rect, the bubble's size and the asked-for side. */
export function placeTooltip(
  t: DOMRect,
  w: number,
  h: number,
  side: TooltipSide,
  vw: number,
  vh: number,
): TooltipPlacement {
  const o = TOOLTIP_OFFSET;
  const p = TOOLTIP_PADDING;
  const room = (s: TooltipSide) =>
    s === "top"
      ? t.top - o - h >= p
      : s === "bottom"
        ? t.bottom + o + h <= vh - p
        : s === "left"
          ? t.left - o - w >= p
          : t.right + o + w <= vw - p;
  const s = room(side) || !room(FAR[side]) ? side : FAR[side];
  const across = s === "top" || s === "bottom";
  const cx = t.left + t.width / 2;
  const cy = t.top + t.height / 2;
  const x = across ? clamp(cx - w / 2, p, vw - p - w) : s === "left" ? t.left - o - w : t.right + o;
  const y = across ? (s === "top" ? t.top - o - h : t.bottom + o) : clamp(cy - h / 2, p, vh - p - h);
  const arrow = across ? clamp(cx - x, 8, w - 8) : clamp(cy - y, 6, h - 6);
  return { side: s, x, y, arrow };
}
