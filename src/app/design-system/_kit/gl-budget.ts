// The page's budget for heavy specimens, one module-wide ledger. Three pools: WebGL units (8), the tile
// floor (1, any TileFloor, direct or inside a framed page that carries the hero) and live iframes (8).
// A HeavySlot claims its cost when it nears the viewport. A claim that does not fit waits in a queue, and
// when a holder releases, the waiting claims nearest the viewport are granted first. Each slot also says
// whether it is on screen (see), so a waiting claim that comes into view evicts holders that are off screen,
// least recently seen first, and a slot in view never waits behind one out of it: the same promotion runs
// again whenever a holder scrolls off screen and after every release, so a waiting slot in view never stays
// paused behind a holder that has since left. "Show live" forces a claim by evicting the holders in its way,
// off screen ones first. An evicted holder rejoins the queue, so it comes back on its own when room frees.
// The waiting cards and the perf-rule pill read the ledger through useGlBudget, GpuAwake through onBudget.
import { useSyncExternalStore } from "react";
import { CAPACITY, type HeavyCost, type Pools } from "./gl-capacity";

export { CAPACITY, type HeavyCost } from "./gl-capacity";

export type BudgetSnapshot = Readonly<Pools & { live: number; waiting: number }>;

export type Handlers = {
  /** the claim was granted later, from the queue */
  grant: () => void;
  /** the holder was evicted by another claim and must release now */
  evict: () => void;
  /** how far the slot is from the viewport, px (0 when on screen), so the queue drains nearest first */
  distance?: () => number;
};

type Holder = { cost: Pools; seen: number; visible: boolean } & Handlers;
type Waiting = { cost: Pools; visible: boolean } & Handlers;

const live = new Map<string, Holder>();
const queue = new Map<string, Waiting>();
const listeners = new Set<() => void>();
let clock = 0;

const EMPTY: BudgetSnapshot = { gl: 0, floor: 0, frames: 0, live: 0, waiting: 0 };
let snapshot: BudgetSnapshot = EMPTY;

const POOLS = ["gl", "floor", "frames"] as const;

function pools(c: HeavyCost): Pools {
  return { gl: Math.max(0, c.gl ?? 0), floor: c.floor ? 1 : 0, frames: Math.max(0, c.frames ?? 0) };
}

function used(skip?: ReadonlySet<string>): Pools {
  const u = { gl: 0, floor: 0, frames: 0 };
  for (const [id, h] of live) if (!skip?.has(id)) for (const k of POOLS) u[k] += h.cost[k];
  return u;
}

/** A cost bigger than a whole pool still fits an empty one, so nothing is unshowable. */
function fits(c: Pools, u = used()): boolean {
  return POOLS.every((k) => c[k] === 0 || u[k] + c[k] <= CAPACITY[k] || u[k] === 0);
}

function emit() {
  const u = used();
  snapshot = { ...u, live: live.size, waiting: queue.size };
  for (const l of listeners) l();
}

function far(h: Handlers): number {
  try {
    return h.distance?.() ?? Infinity;
  } catch {
    return Infinity;
  }
}

function hold(id: string, w: Waiting) {
  queue.delete(id);
  live.set(id, { cost: w.cost, grant: w.grant, evict: w.evict, distance: w.distance, visible: w.visible, seen: ++clock });
}

/** Makes room for a cost by evicting holders `may` allows, off screen and least recently seen first. Evicts
 *  nothing unless the evictions would make it fit. True when it fits afterwards. */
function makeRoom(c: Pools, may: (h: Holder) => boolean): boolean {
  if (fits(c)) return true;
  const order = [...live.entries()]
    .filter(([, h]) => may(h))
    .sort((a, b) => Number(a[1].visible) - Number(b[1].visible) || a[1].seen - b[1].seen);
  const out = new Set<string>();
  for (const [oid, h] of order) {
    const u = used(out);
    if (fits(c, u)) break;
    if (POOLS.some((k) => c[k] > 0 && h.cost[k] > 0 && u[k] + c[k] > CAPACITY[k])) out.add(oid);
  }
  if (!fits(c, used(out))) return false;
  for (const oid of out) {
    const h = live.get(oid) as Holder;
    live.delete(oid);
    queue.set(oid, { cost: h.cost, grant: h.grant, evict: h.evict, distance: h.distance, visible: h.visible });
    h.evict();
  }
  return true;
}

function drain() {
  const order = [...queue.entries()].sort((a, b) => Number(b[1].visible) - Number(a[1].visible) || far(a[1]) - far(b[1]));
  for (const [id, q] of order) {
    if (!fits(q.cost)) continue;
    hold(id, q);
    q.grant();
  }
}

/** Grants every waiting claim that is on screen, nearest first, by evicting holders that are off screen. True
 *  when it granted any. */
function promote(): boolean {
  let granted = false;
  const order = [...queue.entries()].filter(([, q]) => q.visible).sort((a, b) => far(a[1]) - far(b[1]));
  for (const [id, q] of order) {
    if (queue.get(id) !== q || !makeRoom(q.cost, (o) => !o.visible)) continue;
    hold(id, q);
    q.grant();
    granted = true;
  }
  return granted;
}

/** Claims a cost for a slot. True when granted now, false when queued (grant is called later). */
export function claim(id: string, cost: HeavyCost, handlers: Handlers): boolean {
  if (live.has(id)) return true;
  const w: Waiting = { cost: pools(cost), visible: queue.get(id)?.visible ?? false, ...handlers };
  if (fits(w.cost)) {
    hold(id, w);
    emit();
    return true;
  }
  queue.set(id, w);
  emit();
  return false;
}

/** Releases a slot's claim or its place in the queue, then grants whoever now fits, nearest first. */
export function release(id: string) {
  const had = live.delete(id) || queue.delete(id);
  if (!had) return;
  drain();
  promote();
  emit();
}

/** Marks a holder as seen now, which keeps it from being the first evicted. */
export function touch(id: string) {
  const h = live.get(id);
  if (h) h.seen = ++clock;
}

/** Says whether a slot is on screen. A waiting claim that comes into view takes room from holders off screen. */
export function see(id: string, visible: boolean) {
  const h = live.get(id);
  if (h) {
    const left = h.visible && !visible;
    h.visible = visible;
    h.seen = ++clock;
    // a holder that left the screen may be all that keeps a waiting slot in view paused
    if (left && promote()) emit();
    return;
  }
  const q = queue.get(id);
  if (!q) return;
  q.visible = visible;
  if (!visible || !makeRoom(q.cost, (o) => !o.visible)) return;
  hold(id, q);
  q.grant();
  emit();
}

/** Grants a claim at once by evicting the holders that stand in its way, off screen ones first. */
export function force(id: string, cost: HeavyCost, handlers: Handlers) {
  const visible = live.get(id)?.visible ?? queue.get(id)?.visible ?? true;
  queue.delete(id);
  live.delete(id);
  const w: Waiting = { cost: pools(cost), visible, ...handlers };
  makeRoom(w.cost, () => true);
  hold(id, w);
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Calls back on every change of the ledger with its snapshot, for code outside React. Returns the unsubscribe. */
export function onBudget(cb: (b: BudgetSnapshot) => void): () => void {
  return subscribe(() => cb(snapshot));
}

/** The ledger now. */
export const budgetNow = (): BudgetSnapshot => snapshot;

/** The ledger, live: units in use per pool, holders and waiting claims. Zero on the server. */
export function useGlBudget(): BudgetSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY,
  );
}
