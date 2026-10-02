// The toast queue: a module store anything can push to with toast(), read by the one Toaster through
// useSyncExternalStore. Each change also writes the line a screen reader hears, polite for most tones and
// assertive for errors, so the announcement never depends on which toasts are on screen. A toast with an
// action also says how to reach it, since it waits for the visitor and the hotkey is its only keyboard path.

export type ToastTone = "success" | "error" | "info" | "loading";

/** The hotkey that moves focus to the front toast's first control, as aria-keyshortcuts writes it. */
export const TOAST_HOTKEY = "Alt+T";
export type ToastAction = { label: string; onClick?: () => void };

export type ToastInput = {
  tone?: ToastTone;
  title: string;
  body?: string;
  action?: ToastAction;
  /** ms on screen. Defaults by tone, see lifeOf. */
  duration?: number;
};

export type ToastItem = Omit<ToastInput, "tone"> & {
  id: string;
  tone: ToastTone;
  /** goes up on every update, which restarts the toast's time */
  version: number;
};

export type Announcement = { text: string; urgent: boolean; n: number };
export type ToastState = { items: readonly ToastItem[]; said: Announcement };

/** Time on screen: 5s. A toast with an action stays until it is dismissed, since its only keyboard path is
 *  the Toaster's hotkey and no timer can know how long that takes (WCAG 2.2.1). Errors and loading stay. */
export const TOAST_LIFE = { base: 5000, action: Infinity } as const;

const EMPTY: ToastState = { items: [], said: { text: "", urgent: false, n: 0 } };
let state: ToastState = EMPTY;
let seq = 0;
const listeners = new Set<() => void>();

function commit(next: ToastState) {
  state = next;
  listeners.forEach((l) => l());
}

// the newest toast is the front one, so the hotkey reaches the action it announces
const say = (t: ToastItem): Announcement => ({
  text: [t.title, t.body, t.action && `${t.action.label} available, press ${TOAST_HOTKEY}`].filter(Boolean).join(". "),
  urgent: t.tone === "error",
  n: state.said.n + 1,
});

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => state,
  server: () => EMPTY,
};

/** How long a toast stays, in ms (Infinity for one that waits for the visitor). */
export function lifeOf(t: Pick<ToastItem, "tone" | "action" | "duration">): number {
  if (t.duration !== undefined) return t.duration;
  if (t.tone === "error" || t.tone === "loading" || t.action) return Infinity;
  return TOAST_LIFE.base;
}

/** Shows a toast and returns its id. */
export function toast(input: ToastInput): string {
  const item: ToastItem = { ...input, tone: input.tone ?? "info", id: `toast-${++seq}`, version: 0 };
  commit({ items: [...state.items, item], said: say(item) });
  return item.id;
}

/** Changes a toast in place (loading to success, say) and restarts its time. */
toast.update = function update(id: string, patch: Partial<ToastInput>) {
  let changed: ToastItem | undefined;
  const items = state.items.map((t) => {
    if (t.id !== id) return t;
    changed = { ...t, ...patch, tone: patch.tone ?? t.tone, version: t.version + 1 };
    return changed;
  });
  if (changed) commit({ items, said: say(changed) });
};

/** Removes one toast, or every toast with no id. */
toast.dismiss = function dismiss(id?: string) {
  commit({ ...state, items: id ? state.items.filter((t) => t.id !== id) : [] });
};

/** A loading toast that turns into success or error in place when the work settles. */
toast.promise = async function promise<T>(
  work: Promise<T>,
  copy: { loading: string; success: string; error: string },
): Promise<T> {
  const id = toast({ tone: "loading", title: copy.loading });
  try {
    const value = await work;
    toast.update(id, { tone: "success", title: copy.success });
    return value;
  } catch (err) {
    toast.update(id, { tone: "error", title: copy.error });
    throw err;
  }
};
