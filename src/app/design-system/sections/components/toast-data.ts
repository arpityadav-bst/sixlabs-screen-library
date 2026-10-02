// The Toast section's data: the specimen toasts (filler, with the session count quoted from the jobs data),
// the anatomy pins, the drawer rows, the life timeline and the snippet.
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import type { ToastItem, ToastTone } from "@/components/design-system/toast-store";
import { sv, tv, type Pin } from "./display-values";

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

export const TOAST_VALUES: readonly ValueRow[] = [
  tv("Surface", "color-primary", `${TT}:24`),
  tv("Radius", "radius-sm", `${TT}:24`),
  tv("Shadow", "shadow-float", `${TT}:25`),
  sv("Box", "padding 14 by 16, min height 52", `${TT}:24`),
  tv("Success icon", "color-success-on-dark", `${TT}:18`),
  tv("Error icon", "color-danger-on-dark", `${TT}:19`),
  tv("Info icon", "color-accent-on-dark", `${TT}:20`),
  sv("Loading icon", "Spinner 16, on dark, no delay", `${TT}:80`),
  tv("Body", "color-on-blue-75", `${TT}:88`),
  tv("Action", "color-accent-on-dark", `${TT}:29`),
  tv("Close at rest", "color-on-blue-50", `${TT}:35`),
  tv("Close on hover", "color-on-blue-15", `${TT}:37`),
  tv("Focus ring", "focus-color-dark", `${TT}:32, 40`),
  sv("Place", "bottom centre, 24 up from md, 64 plus the safe area below", `${TR}:31-32`),
  sv("Width", "min(420px, 100vw - 32px)", `${TR}:32`),
  tv("Layer", "z-toast", `${TR}:31`),
  sv("Stack", "3 on screen, older ones 8 up, scale 0.04 and opacity 0.1 less a step", `${TS}:18-20, 69-70`),
  sv("Fanned", "8 apart on hover or focus, every timer held", `${TS}:19`),
  sv("In", "y 16, scale 0.96 (SCALE.panel) and opacity on the pop spring", `${TS}:78-79`),
  sv("Out", "y 8 and opacity, 160ms ease in", `${TS}:83`),
  sv("Life", "5s, and a toast with an action, an error or a loading one stays until it is dismissed", `${ST}:33, 64-67`),
  sv("Hotkey", "Alt+T (TOAST_HOTKEY) moves focus to the front toast, and an action toast's spoken line names it", `${ST}:9, 47, ${TR}:63`),
  sv("Close name", "Dismiss plus the toast's title", `${TT}:108`),
  sv("Swipe", "down 40 on a coarse pointer", `${TS}:19`),
  sv("Words", "a polite status region, an alert region for errors", `${TR}:73, 76`),
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
