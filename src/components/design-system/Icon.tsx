// The one way to draw a lucide icon. Size picks the stroke from the ladder (12 at 2.25 down to 24 at
// 1.5), so the rendered stroke is 1.13 to 1.33px at 12 to 20, and 1.5 at a standalone 24, and the set
// reads as one weight. Colour is
// currentColor only, so the icon takes its control's state. It is decorative (aria-hidden) unless it is
// given a label, which makes it an image with that name. Three forms: standalone in a control, inline in
// a line of text (shifted -0.125em onto the baseline), and boxed in a white circle with a hairline.
// No hooks, so server and client sections both render it.
import type { LucideIcon } from "lucide-react";
import { ICON_STROKE, type IconSize } from "./token-shape";

export type IconForm = "standalone" | "inline" | "boxed";
export type IconBox = 32 | 40 | 48;

export type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  /** the accessible name: role img with this aria-label. Leave it out when a text label sits beside it */
  label?: string;
  form?: IconForm;
  /** the circle of the boxed form, 32 / 40 / 48. By default 32 up to 16, 40 at 18, 48 from 20 */
  box?: IconBox;
  className?: string;
};

/** The circle a size sits in when boxed. */
export const ICON_BOX: Readonly<Record<IconSize, IconBox>> = { 12: 32, 14: 32, 16: 32, 18: 40, 20: 48, 24: 48 };

const BOX_SIZE: Readonly<Record<IconBox, string>> = { 32: "size-8", 40: "size-10", 48: "size-12" };

const BOXED =
  "inline-grid shrink-0 place-items-center rounded-full border border-(--ds-color-line) bg-(--ds-color-surface)";

/** The rendered stroke in px: strokeWidth is in the 24-unit grid, so it scales with the size. */
export const renderedStroke = (size: IconSize) => (ICON_STROKE[size] * size) / 24;

export function Icon({ icon: Glyph, size = 16, label, form = "standalone", box, className = "" }: IconProps) {
  const stroke = ICON_STROKE[size];
  const named = label ? { role: "img" as const, "aria-label": label } : undefined;

  if (form === "boxed") {
    return (
      <span className={`${BOXED} ${BOX_SIZE[box ?? ICON_BOX[size]]} ${className}`} {...named}>
        <Glyph aria-hidden size={size} strokeWidth={stroke} className="shrink-0" />
      </span>
    );
  }

  const place = form === "inline" ? "inline-block align-[-0.125em]" : "block";
  return (
    <Glyph
      size={size}
      strokeWidth={stroke}
      className={`${place} shrink-0 ${className}`}
      {...(named ?? { "aria-hidden": true })}
    />
  );
}
