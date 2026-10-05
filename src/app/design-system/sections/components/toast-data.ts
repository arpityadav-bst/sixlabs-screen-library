// The Toast section's data: the specimen toasts (filler, with the session count quoted from the jobs data),
// the anatomy pins, the drawer rows, the life timeline and the snippet.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import type { ToastItem, ToastTone } from "@/components/design-system/toast-store";
import { sv, tv, type CheckedRow, type Pin } from "./display-values";

const TT = "Toast.tsx";
const TS = "ToastStack.tsx";
const TR = "Toaster.tsx";
const ST = "toast-store.ts";

export type ToastSpecimen = { tone: ToastTone; title: string; body?: string; action?: string };

export const TOAST_TONES: readonly ToastSpecimen[] = [
  { tone: "success", title: "Link copied" },
  { tone: "info", title: "New run ready", body: "The model finished reading 2,163 sessions.", action: "View" },
  { tone: "error", title: "The answer did not load", body: "Your question is saved.", action: "Try again" },
  { tone: "loading", title: "Reading 2,163 sessions" },
];

const item = (id: string, title: string): ToastItem => ({ id, tone: "success", title, version: 0 });

/** Three toasts of one height, oldest first, so the tucked edges read evenly. */
export const TOAST_TRIO: readonly ToastItem[] = [
  item("trio-1", "Filters cleared"),
  item("trio-2", "Run saved"),
  item("trio-3", "Link copied"),
];

export const TOAST_PINS: readonly Pin[] = [
  { selector: "[data-part=surface]", name: "Surface", token: "--ds-color-primary", value: "radius 16 · p 14 by 16 · min 52", source: `${TT}:24`, expect: "flex min-h-[52px] w-full flex-col justify-center rounded-(--ds-radius-sm) bg-(--ds-color-primary) px-4 py-3.5", padding: true },
  { selector: "[data-part=icon]", name: "Status icon", token: "--ds-color-accent-on-dark", value: "18, the tone's on-dark colour", source: `${TT}:75,78`, expect: ["grid h-[18px] w-[18px]", "size={18}"] },
  { selector: "[data-part=title]", name: "Title", value: "Inter 14 / 20 / 500, white", source: `${TT}:84`, expect: 'data-part="title" className="text-[14px] font-medium leading-5"' },
  { selector: "[data-part=body]", name: "Body", token: "--ds-color-on-blue-75", value: "Inter 13 / 18", source: `${TT}:88`, expect: "text-[13px] leading-[18px] text-(--ds-color-on-blue-75)" },
  { selector: "[data-part=action]", name: "Action", token: "--ds-color-accent-on-dark", value: "13 / 500, white on hover", source: `${TT}:29,30`, expect: ["text-[13px] font-medium leading-5 text-(--ds-color-accent-on-dark)", "hover:text-white"] },
  { selector: "[data-part=close]", name: "Close", token: "--ds-color-on-blue-50", value: "28 circle · X 14", source: `${TT}:35,108,114`, expect: ["grid h-7 w-7 shrink-0 place-items-center rounded-full", "Dismiss ${title}", "<X aria-hidden size={14}"] },
];

export const TOAST_VALUES: readonly CheckedRow[] = [
  tv("Surface", "color-primary", `${TT}:24`, "bg-(--ds-color-primary) px-4"),
  tv("Radius", "radius-sm", `${TT}:24`, "rounded-(--ds-radius-sm)"),
  tv("Shadow", "shadow-float", `${TT}:25`, "shadow-(--ds-shadow-float)"),
  sv("Box", "padding 14 by 16, min height 52", `${TT}:24`, undefined, "min-h-[52px]", "px-4 py-3.5"),
  tv("Success icon", "color-success-on-dark", `${TT}:18`, 'success: "text-(--ds-color-success-on-dark)"'),
  tv("Error icon", "color-danger-on-dark", `${TT}:19`, 'error: "text-(--ds-color-danger-on-dark)"'),
  tv("Info icon", "color-accent-on-dark", `${TT}:20`, 'info: "text-(--ds-color-accent-on-dark)"'),
  sv("Loading icon", "Spinner 16, on dark, no delay", `${TT}:80`, undefined, '<Spinner size={16} tone="onDark" delay={0} decorative />'),
  tv("Body", "color-on-blue-75", `${TT}:88`, "text-[13px] leading-[18px] text-(--ds-color-on-blue-75)"),
  tv("Action", "color-accent-on-dark", `${TT}:29`, "font-medium leading-5 text-(--ds-color-accent-on-dark)"),
  tv("Close at rest", "color-on-blue-50", `${TT}:35`, "rounded-full text-(--ds-color-on-blue-50)"),
  tv("Close on hover", "color-on-blue-15", `${TT}:37`, "hover:bg-(--ds-color-on-blue-15) hover:text-white"),
  { ...tv("Focus ring", "focus-color-dark", `${TT}:32, 40, focus.ts:22`), assert: [system(TT, "FOCUS_DARK;"), system("focus.ts", "focus-visible:outline-(--ds-focus-color-dark)")] },
  sv("Place", "bottom centre, 24 up from md, 64 plus the safe area below", `${TR}:31-32`, undefined, "fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom,0px))]", "mx-auto", "md:bottom-6"),
  sv("Width", "min(420px, 100vw - 32px)", `${TR}:32`, undefined, "w-[min(420px,calc(100vw-32px))]"),
  tv("Layer", "z-toast", `${TR}:31`, "z-(--ds-z-toast)"),
  sv("Stack", "3 on screen, older ones 8 up, scale 0.04 and opacity 0.1 less a step", `${TS}:18-20, 69-70`, undefined, "export const STACK_VISIBLE = 3;", "const PEEK = 8;", "const scale = expanded ? 1 : 1 - 0.04 * k;", "const opacity = expanded ? 1 : 1 - 0.1 * k;"),
  sv("Fanned", "8 apart on hover or focus, every timer held", `${TS}:19, 67, 130`, undefined, "const GAP = 8;", "useLife(live ? lifeOf(t) : Infinity, expanded,", "const expanded = forced ?? (hovered || focused);"),
  sv("In", "y 16, scale 0.96 (SCALE.panel) and opacity on the pop spring", `${TS}:78-79`, undefined, "{ opacity: 0, y: y + 16, scale: SCALE.panel }", ": SPRING.pop }}"),
  { part: "Out", value: "y 8 and opacity, 160ms ease in", source: `${TS}:83, overlay-motion.ts:31`, assert: [system(TS, "{ opacity: 0, y: y + 8, transition: { duration: OVERLAY.toastOut, ease: EASE_IN } }"), system("overlay-motion.ts", 'toastOut: seconds("dur-quick")')] },
  sv("Life", "5s, and a toast with an action, an error or a loading one stays until it is dismissed", `${ST}:33, 64-67`, undefined, "base: 5000", 'if (t.tone === "error" || t.tone === "loading" || t.action) return Infinity;'),
  { part: "Hotkey", value: "Alt+T (TOAST_HOTKEY) moves focus to the front toast, and an action toast's spoken line names it", source: `${ST}:9, 47, ${TR}:63`, assert: [system(ST, 'export const TOAST_HOTKEY = "Alt+T";', "available, press ${TOAST_HOTKEY}`"), system(TR, "front.focus();")] },
  sv("Close name", "Dismiss plus the toast's title", `${TT}:108`, undefined, "aria-label={`Dismiss ${title}`}"),
  sv("Swipe", "down 40 on a coarse pointer", `${TS}:21, 89, 191`, undefined, "const SWIPE = 40;", "if (info.offset.y > SWIPE) dismiss(t.id);", "swipe={live && coarse}"),
  sv("Words", "a polite status region, an alert region for errors", `${TR}:73, 76`, undefined, '<div role="status" aria-live="polite" className="sr-only">', '<div role="alert" className="sr-only">'),
];

export const TOAST_PROPS: readonly PropRow[] = [
  { name: "tone", type: "\"success\" | \"error\" | \"info\" | \"loading\"", default: "\"info\"" },
  { name: "title", type: "string", note: "the outcome, a few words" },
  { name: "body", type: "string", note: "one line of detail" },
  { name: "action", type: "{ label, onClick }", note: "one at most, and the toast then stays until dismissed" },
  { name: "duration", type: "number", note: "ms, overrides the tone's life" },
];

export const TOAST_CODE = `import { toast } from "@/components/design-system/toast-store";
// once, near the root: <Toaster /> from "@/components/design-system/Toaster"

toast({ tone: "success", title: "Link copied" });
toast({ tone: "error", title: "The answer did not load", action: { label: "Try again", onClick: retry } });
toast.promise(save(), { loading: "Saving the run", success: "Run saved", error: "The run did not save" });`;

export const TOAST_LIFE: readonly TimelineLane[] = [
  {
    label: "Success",
    items: [
      { label: "in, pop spring", at: 0 },
      { label: "on screen", at: 0, to: 5 },
      { label: "out", at: 5, to: 5.16 },
    ],
  },
  {
    label: "With an action",
    items: [
      { label: "in, pop spring", at: 0 },
      { label: "stays until dismissed, Alt+T reaches it", at: 0, to: 9 },
    ],
  },
  {
    label: "Error",
    items: [
      { label: "in, pop spring", at: 0 },
      { label: "stays until closed", at: 0, to: 9 },
    ],
  },
];

export const TOAST_CONTROL_STATES = ["rest", "hover", "focus-visible", "pressed"] as const;
export const TOAST_CONTROLS = ["action", "close"] as const;
