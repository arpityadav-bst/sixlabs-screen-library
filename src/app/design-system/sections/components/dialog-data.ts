// The Dialog section's data: the specimen copy (the request description is quoted from Closing.tsx, the rest
// is house filler), anatomy pins, drawer rows, props, the motion curves and the snippet. Widths are the
// part's own DIALOG_WIDTH_PX, never a second list.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import type { DialogSize } from "@/components/design-system/Dialog";
import { DIALOG_WIDTH_PX } from "@/components/design-system/dialog-styles";
import { SHEET_SPRING } from "@/components/design-system/overlay-motion";
import { SPRING_VALUES } from "@/components/design-system/token-motion";
import { sv, tv, type CheckedRow, type Pin } from "./display-values";

const D = "Dialog.tsx";
const S = "dialog-styles.ts";
const DP = "DialogPanel.tsx";

export const REQUEST = {
  title: "Request access",
  description: "Every studio that joins makes the model better for every studio after it.",
  cancel: "Cancel",
  confirm: "Request access",
};

export const REMOVE = {
  title: "Remove item one?",
  description: "Item one leaves the list.",
  cancel: "Keep item",
  confirm: "Remove item",
};

const USE: Record<DialogSize, string> = { sm: "confirm", md: "form", lg: "content" };
export const SIZES: readonly { size: DialogSize; px: number; use: string }[] = (["sm", "md", "lg"] as const).map((size) => ({
  size,
  px: DIALOG_WIDTH_PX[size],
  use: USE[size],
}));

export const DIALOG_STATES = ["closed", "opening", "open", "busy", "closing"] as const;
export const SHEET_STATES = ["closed", "open", "dragging"] as const;

export const DIALOG_PINS: readonly Pin[] = [
  { selector: "[data-part=panel]", name: "Panel", token: "--ds-color-surface", value: "radius 28, p 32 from md (24 and 24 under), hairline", source: `${S}:22,26`, expect: ["border border-(--ds-color-line) bg-(--ds-color-surface)", "md:rounded-(--ds-radius-lg) md:p-8"], padding: true },
  { selector: "[data-part=title]", name: "Title", value: "Outfit 24 / 30 / 500 · -0.03em", source: `${S}:33`, expect: "font-display text-[24px] font-medium leading-[30px] tracking-[-0.03em]" },
  { selector: "[data-part=description]", name: "Description", token: "--ds-color-text-muted", value: "Inter 15 / 22", source: `${S}:35`, expect: "mt-2 text-[15px] leading-[22px]" },
  { selector: "[data-part=close] button", name: "Close", value: "md ghost icon button · 16 in", source: `${DP}:90,91`, expect: ['data-part="close"', '<IconButton icon={X} label="Close" size="md" variant="ghost"'] },
  { selector: "[data-part=body]", name: "Body", value: "mt 24 · scrolls inside the panel", source: `${S}:37`, expect: "mt-6 min-h-0 flex-1 overflow-y-auto" },
  { selector: "[data-part=footer]", name: "Footer", value: "mt 32 · right · gap 12 · primary last", source: `${S}:40`, expect: "mt-8 flex shrink-0 flex-wrap items-center justify-end gap-3" },
];

export const SHEET_PINS: readonly Pin[] = [
  { selector: "[data-part=handle]", name: "Handle", token: "--ds-color-line-strong", value: "36 by 4 · 8 from the top", source: `${S}:45,48`, expect: ["pt-2", "h-1 w-9 rounded-full"] },
  { selector: "[data-part=panel]", name: "Sheet", token: "--ds-radius-lg", value: "top corners 28 · max 90svh", source: `${S}:29`, expect: "max-h-[90svh] max-w-[680px] rounded-t-(--ds-radius-lg)" },
  { selector: "[data-part=footer]", name: "Stacked footer", value: "full width · primary on top", source: `${S}:41`, expect: "flex-col-reverse gap-3 *:w-full" },
];

export const DIALOG_VALUES: readonly CheckedRow[] = [
  tv("Veil", "color-veil-modal", `${D}:247`, "bg-(--ds-color-veil-modal)"),
  tv("Veil fade", "dur-menu", "overlay-motion.ts:37", 'veil: seconds("dur-menu")'),
  tv("Panel", "color-surface", `${S}:22`, "bg-(--ds-color-surface)"),
  tv("Panel line", "color-line", `${S}:22`, "border border-(--ds-color-line)"),
  tv("Panel shadow", "shadow-modal", `${S}:23`, "shadow-(--ds-shadow-modal)"),
  tv("Radius from md", "radius-lg", `${S}:26`, "md:rounded-(--ds-radius-lg)"),
  tv("Radius under md", "radius-md", `${S}:26`, "max-h-[calc(100svh-96px)] rounded-(--ds-radius-md)"),
  sv("Padding", "32 from md, 24 under", `${S}:26`, undefined, "rounded-(--ds-radius-md) p-6", "md:p-8"),
  sv("Widths", SIZES.map((s) => `${s.size} ${s.px}`).join(" · "), `${S}:8`, undefined, ...SIZES.map((s) => `${s.size}: ${s.px}`)),
  sv("Height", "viewport less 96, the body scrolls", `${S}:26, 37`, undefined, "max-h-[calc(100svh-96px)]", "min-h-0 flex-1 overflow-y-auto"),
  sv("Title", "Outfit 24 / 30 / 500, -0.03em, ink", `${S}:33`, undefined, "font-display text-[24px] font-medium leading-[30px] tracking-[-0.03em] text-(--ds-color-ink)"),
  tv("Description", "color-text-muted", `${S}:35`, 'DESCRIPTION = "mt-2 text-[15px] leading-[22px] text-(--ds-color-text-muted)"'),
  sv("Footer", "right-aligned, gap 12, primary last", `${S}:40`, undefined, "items-center justify-end gap-3"),
  sv("In", "opacity, scale 0.96 (SCALE.panel) and y 8 on the pop spring", `${D}:86-87`, undefined, "initial: { opacity: 0, scale: SCALE.panel, y: 8 }", "transition: SPRING.pop"),
  sv("Out", "opacity and scale 0.96, 140ms ease in", `${D}:88`, undefined, "exit: { opacity: 0, scale: SCALE.panel, transition: { duration: OVERLAY.dialogOut, ease: EASE_IN } }"),
  sv("Sheet", "bottom-attached, top corners 28, max 90svh, foot past the safe area", `${S}:29-30`, undefined, "max-h-[90svh]", "rounded-t-(--ds-radius-lg) rounded-b-none", "pb-[calc(24px+env(safe-area-inset-bottom,0px))]"),
  tv("Handle", "color-line-strong", `${S}:48`, "h-1 w-9 rounded-full bg-(--ds-color-line-strong)"),
  {
    ...sv("Sheet in", "y 100% to 0 on stiffness 400, damping 40", `overlay-motion.ts:43, ${D}:80-81`),
    assert: [system("overlay-motion.ts", 'SHEET_SPRING = { type: "spring", stiffness: 400, damping: 40 }'), system(D, 'initial: { y: "100%" }', "animate: { y: 0, transition: SHEET_SPRING }")],
  },
  sv("Sheet close", "a drag past 96 or a flick at 600 px/s", `${D}:53-54, 205`, undefined, "const DRAG_CLOSE = 96;", "const FLICK = 600;", "info.offset.y > DRAG_CLOSE || info.velocity.y > FLICK"),
  tv("Reduced motion", "dur-exit", "overlay-motion.ts:39", 'reducedFade: seconds("dur-exit")'),
  sv("Layer", "the native top layer, above every z value", `${D}:168`, undefined, "d.showModal();"),
  sv("Focus", "initialFocus when given, else the first footer action in an alertdialog, else the first field, else the primary", `${D}:60-68`, undefined, "given ??", 'role === "alertdialog" ? actions[0] : (field ?? actions[actions.length - 1])', ":is(input, select, textarea):not([disabled])"),
  sv("Page", "held still with overflow clip while open, as MobileMenu holds it", `${D}:56-58`, undefined, 'document.documentElement.style.overflow = on ? "clip" : "";'),
];

export const DIALOG_PROPS: readonly PropRow[] = [
  { name: "open", type: "boolean", default: "false" },
  { name: "onOpenChange", type: "(open: boolean) => void", note: "Escape, the veil and the close call it with false" },
  { name: "onClosed", type: "() => void", note: "once the exit is done and focus is back on the trigger: report an outcome (a toast) here" },
  { name: "title", type: "string" },
  { name: "description", type: "ReactNode" },
  { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"" },
  { name: "role", type: "\"dialog\" | \"alertdialog\"", default: "\"dialog\"", note: "the veil does not close an alertdialog" },
  { name: "presentation", type: "\"auto\" | \"dialog\" | \"sheet\"", default: "\"auto\"", note: "auto is a sheet under md" },
  { name: "footer", type: "ReactNode", note: "actions in reading order, primary last. DialogAction parts follow busy" },
  { name: "busy", type: "boolean", default: "false", note: "holds the close, Escape, the veil and the drag" },
  { name: "initialFocus", type: "RefObject<HTMLElement>" },
  { name: "inline", type: "boolean", note: "docs only, the panel in the flow" },
  { name: "forceState", type: "DialogState", note: "docs only, one frame" },
];

export const DIALOG_CODE = `import { Dialog } from "@/components/design-system/Dialog";
import { DialogAction } from "@/components/design-system/DialogAction";

// busy holds the close, Escape, the veil and the drag, and the DialogAction footer follows it:
// the primary spins and Cancel holds while the request is sending
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Request access"
  busy={sending}
  footer={
    <>
      <DialogAction variant="secondary" onClick={() => setOpen(false)}>Cancel</DialogAction>
      <DialogAction primary onClick={send}>Request access</DialogAction>
    </>
  }
>
  ...the form
</Dialog>`;

/** The panel's pop and the sheet's rise, for the motion plots. */
export const POP = SPRING_VALUES.pop;
export const SHEET = { stiffness: SHEET_SPRING.stiffness, damping: SHEET_SPRING.damping };
