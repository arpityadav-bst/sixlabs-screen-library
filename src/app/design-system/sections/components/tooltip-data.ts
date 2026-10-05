// The Tooltip section's data: anatomy pins, the drawer rows, props and the snippet. The specimen labels are
// the site's own aria-labels (Back to top, Previous player, Next player) or filler.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import { sv, tv, type CheckedRow, type Pin } from "./display-values";

const T = "Tooltip.tsx";
const B = "TooltipBubble.tsx";
const P = "tooltip-place.ts";

export const TOOLTIP_PINS: readonly Pin[] = [
  { selector: "[data-pin=tt] button", name: "Trigger", value: "an icon-only control, its name the same words", source: `${T}:142,144`, expect: ['getAttribute("aria-label") !== content', "aria-describedby"] },
  { selector: "[data-part=bubble]", name: "Bubble", token: "--ds-color-primary", value: "6 by 8 · radius 8 · max 240", source: `${B}:28`, expect: "max-w-[240px] rounded-(--ds-radius-bubble) px-2 py-1.5", padding: true },
  { selector: "[data-part=shortcut]", name: "Shortcut", token: "--ds-color-on-blue-50", value: "mono 11 · 6 after the words", source: `${B}:93`, expect: "ml-1.5 font-(family-name:--ds-font-mono) text-[11px]" },
  { selector: "[data-arrow=top]", name: "Arrow", value: "8 by 4, the bubble's fill, off by default", source: `${B}:35-37`, expect: ["w: 8", "M0 0H8L4 4Z"] },
];

export const TOOLTIP_VALUES: readonly CheckedRow[] = [
  tv("Bubble", "color-primary", `${B}:13`, 'default: "bg-(--ds-color-primary) text-white"'),
  sv("Words", "Inter 12 / 16 / 500, white", `${B}:13, 28-29`, undefined, 'default: "bg-(--ds-color-primary) text-white"', "font-sans text-[12px] font-medium", '"leading-4 shadow-(--ds-shadow-tooltip)"'),
  sv("Box", "padding 6 by 8, radius 8, max width 240", `${B}:28`, undefined, "max-w-[240px] rounded-(--ds-radius-bubble) px-2 py-1.5"),
  tv("Shadow", "shadow-tooltip", `${B}:29`, "shadow-(--ds-shadow-tooltip)"),
  tv("Shortcut", "color-on-blue-50", `${B}:18`, 'default: "text-(--ds-color-on-blue-50)"'),
  tv("Inverse bubble", "color-surface", `${B}:14`, 'inverse: "bg-(--ds-color-surface) text-(--ds-color-ink)"'),
  tv("Inverse words", "color-ink", `${B}:14`, 'inverse: "bg-(--ds-color-surface) text-(--ds-color-ink)"'),
  sv("Offset", "8 from the trigger", `${P}:7`, undefined, "export const TOOLTIP_OFFSET = 8;"),
  sv("Collision padding", "8 to the viewport, flips then slides", `${P}:9`, undefined, "export const TOOLTIP_PADDING = 8;"),
  tv("Layer", "z-tooltip", `${T}:253`, "z-(--ds-z-tooltip)"),
  sv("Open delay", "400ms from hover, 0 from keyboard focus", `${T}:84, 127-130`, undefined, "delay = 400,", 'e.target.matches(":focus-visible")'),
  sv("Skip window", "600ms after the last one closed, the next opens at once", `${T}:33, 119`, undefined, "export const TOOLTIP_SKIP = 600;", "if (Date.now() - lastClosed < TOOLTIP_SKIP) show();"),
  sv("Grace", "100ms to cross from the trigger onto the bubble", `${T}:35, 125`, undefined, "const GRACE = 100;", "timer.current = window.setTimeout(hide, GRACE);"),
  { part: "In", value: "opacity, scale 0.96 and 4px toward the trigger, 160ms ease out", source: `${T}:68-71, 255-256, overlay-motion.ts:27`, assert: [system(T, "top: { y: 4, originY: 1 }", "{ opacity: 0, scale: SCALE.panel, x: toward.x ?? 0, y: toward.y ?? 0 }", "transition: { duration: OVERLAY.tooltipIn, ease: EASE } }"), system("overlay-motion.ts", 'tooltipIn: seconds("dur-quick")')] },
  { ...tv("Out", "dur-press", `${T}:257, overlay-motion.ts:29`), assert: [system(T, "exit={{ opacity: 0, transition: { duration: OVERLAY.tooltipOut, ease: EASE_IN } }}"), system("overlay-motion.ts", 'tooltipOut: seconds("dur-press")')] },
  sv("Reduced motion", "opacity only", `${T}:255`, undefined, "initial={reduced ? { opacity: 0 } :"),
];

export const TOOLTIP_PROPS: readonly PropRow[] = [
  { name: "content", type: "string", note: "short, no links or buttons" },
  { name: "side", type: "\"top\" | \"bottom\" | \"left\" | \"right\"", default: "\"top\"", note: "flips near an edge" },
  { name: "delay", type: "number", default: "400", note: "ms from hover" },
  { name: "shortcut", type: "string", note: "a key hint in mono" },
  { name: "arrow", type: "boolean", default: "false" },
  { name: "tone", type: "\"default\" | \"inverse\"", default: "\"default\"", note: "inverse on the terminal" },
  { name: "open", type: "boolean", note: "docs only, open in place" },
  { name: "forceState", type: "\"entering\" | \"leaving\"", note: "docs only, one frame" },
  { name: "children", type: "ReactNode", note: "one focusable trigger" },
];

export const TOOLTIP_CODE = `import { Tooltip } from "@/components/design-system/Tooltip";
import { IconButton } from "@/components/design-system/IconButton";
import { ArrowUp } from "lucide-react";

<Tooltip content="Back to top">
  <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" />
</Tooltip>`;

/** How it closes, for the states spec (the motion frames cannot show the triggers). */
export const TOOLTIP_CLOSE_ROWS: readonly KeyRow[] = [
  { key: "pointer leaves", value: "closes after a 100ms grace, held while the pointer is on the bubble", source: `${T}:122-125` },
  { key: "Escape", value: "closes it and is used up, so a dialog round it stays open", source: `${T}:181-185` },
  { key: "blur, press", value: "close it at once", source: `${T}:131-133, 217-218` },
  { key: "scroll, resize", value: "move it with its trigger, and close it once the trigger is out of view", source: `${T}:187-192` },
  { key: "touch", value: "opens nothing, the trigger's name carries the words", source: `${T}:116` },
];

export const TOOLTIP_STATES = ["hidden", "entering", "open", "leaving"] as const;
export type TooltipCellState = (typeof TOOLTIP_STATES)[number];
