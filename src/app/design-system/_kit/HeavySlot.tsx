"use client";

// The mount gate for WebGL specimens and iframes. A slot claims its cost from gl-budget when it comes
// within half a viewport, and releases it when it is more than one and a half viewports away, so a slot
// on the edge never flickers. A third observer tells the budget when the slot is on screen, so a slot in
// view takes room from slots out of it. Until it is granted it shows a calm card (a poster if one is given)
// with the reason and a Show live button. On release it unmounts the specimen first (its own cleanup runs),
// then loses the WebGL context of every canvas that was inside, because accentWaveGL, swapGL and
// createLiquid have no dispose, and blanks any iframe, which unloads its page. The guide keeps one
// high-performance context of its own (GpuAwake), so a release here never switches a two-GPU Mac's GPU.
// Show live swaps the card, and the focused button with it, for the specimen, so focus moves into the
// specimen (its first focusable part, else the slot itself, tabIndex -1 until focus leaves it, with the kit
// ring) rather than to the body.
// Only the waiting card reads the ledger's count, so a claim elsewhere never re-renders a live slot.
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CAPACITY, claim, force, release, see, touch, useGlBudget, type Handlers, type HeavyCost } from "./gl-budget";

export type HeavySlotProps = {
  /** what it costs while live, for example { gl: 1, floor: true } or { frames: 1 } */
  cost: HeavyCost;
  /** what the slot holds, read on its card ("The tile floor") */
  label: string;
  /** a still from public/, shown on the card while the slot waits */
  poster?: string;
  /** the box, the same live and waiting, so the page never jumps. fill takes the parent's height. */
  height?: number;
  minHeight?: number;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

type Status = "idle" | "waiting" | "live";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
type Left = { gl: WebGLRenderingContext[]; frames: HTMLIFrameElement[] };

const EMPTY_LEFT: Left = { gl: [], frames: [] };

/** The WebGL context a canvas already holds, without ever making one. getContext("2d") answers for a canvas
 *  that holds no context yet (it takes a cheap 2D one) or a 2D one, and only a canvas already given to WebGL
 *  returns null there. Then asking for its own kind returns the context it has. */
function contextOf(c: HTMLCanvasElement): WebGLRenderingContext | null {
  try {
    if (c.getContext("2d")) return null;
    return (c.getContext("webgl2") as WebGLRenderingContext | null) ?? c.getContext("webgl");
  } catch {
    return null; // a canvas handed to an OffscreenCanvas, or a frame gone mid-read
  }
}

/** Every live WebGL context and iframe inside, including canvases inside same-origin frames. */
function collect(root: HTMLElement): Left {
  try {
    return gather(root);
  } catch {
    return EMPTY_LEFT;
  }
}

function gather(root: HTMLElement): Left {
  const canvases = [...root.querySelectorAll("canvas")];
  const frames = [...root.querySelectorAll("iframe")];
  for (const f of frames) {
    try {
      const doc = f.contentDocument;
      if (doc) canvases.push(...doc.querySelectorAll("canvas"));
    } catch {
      // a cross-origin frame keeps its own canvases, and blanking it below unloads them
    }
  }
  const gl = canvases.map(contextOf).filter((c): c is WebGLRenderingContext => !!c && !c.isContextLost());
  return { gl, frames };
}

function loseAll({ gl, frames }: Left) {
  for (const ctx of gl) {
    try {
      if (!ctx.isContextLost()) ctx.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      // already gone with its frame
    }
  }
  for (const f of frames) {
    try {
      f.src = "about:blank";
    } catch {
      // detached
    }
  }
}

/** px from the viewport's edge to the box, 0 when any of it is on screen. */
function distanceOf(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return r.bottom < 0 ? -r.bottom : r.top > vh ? r.top - vh : 0;
}

export function HeavySlot({ cost, label, poster, height, minHeight, fill, className, style, children }: HeavySlotProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const left = useRef<Left | null>(null);
  const now = useRef<Status>("idle");
  const costRef = useRef(cost);
  const handlers = useRef<Handlers | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const focusIn = useRef(false);

  useEffect(() => {
    costRef.current = cost;
  });

  // after the specimen has unmounted, lose what it left behind
  useEffect(() => {
    if (status === "live" || !left.current) return;
    loseAll(left.current);
    left.current = null;
  }, [status]);

  // a grant that came from Show live hands focus to the specimen that replaced the button
  useEffect(() => {
    const el = root.current;
    if (status !== "live" || !focusIn.current || !el) return;
    focusIn.current = false;
    // a forced state grid cell is inert, so its parts never take focus
    const first = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].find((f) => !f.closest("[inert]"));
    first?.focus({ preventScroll: true });
    if (first && document.activeElement === first) return;
    // nothing to take it: the slot itself holds focus until it moves on, then gives the tab stop back, so a
    // click inside a live specimen never lands focus on the slot
    el.tabIndex = -1;
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
    el.focus({ preventScroll: true });
  }, [status]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const set = (s: Status) => {
      now.current = s;
      setStatus(s);
    };
    const h: Handlers = {
      grant: () => set("live"),
      evict: () => {
        left.current = collect(el);
        set("waiting");
      },
      distance: () => distanceOf(el),
    };
    handlers.current = h;
    let shown = false;
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1]?.isIntersecting) return;
        if (now.current === "live") touch(id);
        else if (now.current === "idle") {
          set(claim(id, costRef.current, h) ? "live" : "waiting");
          see(id, shown);
        }
      },
      { rootMargin: "50% 0px" },
    );
    const far = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (!e || e.isIntersecting || now.current === "idle") return;
        if (now.current === "live") left.current = collect(el);
        release(id);
        set("idle");
      },
      { rootMargin: "150% 0px" },
    );
    const onScreen = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      shown = e.isIntersecting;
      see(id, shown);
    });
    near.observe(el);
    far.observe(el);
    onScreen.observe(el);
    return () => {
      near.disconnect();
      far.disconnect();
      onScreen.disconnect();
      if (now.current === "live") {
        const rest = collect(el);
        window.setTimeout(() => loseAll(rest), 0);
      }
      now.current = "idle";
      handlers.current = null;
      release(id);
    };
  }, [id]);

  const showLive = () => {
    const h = handlers.current;
    if (!h) return;
    focusIn.current = true;
    force(id, costRef.current, h);
    h.grant();
  };

  const box: CSSProperties = {
    ...style,
    height: fill ? "100%" : height,
    minHeight: minHeight ?? (height || fill ? undefined : 240),
  };
  const cls = ["ds-heavy", fill ? "ds-heavy--fill" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div ref={root} className={cls} style={box} data-status={status}>
      {status === "live" ? (
        children
      ) : (
        <div className="ds-heavy-card" style={poster ? { backgroundImage: `url(${poster})` } : undefined}>
          <div className="ds-heavy-note">
            <span className="ds-heavy-label">{label}</span>
            {status === "waiting" ? <WaitingNote /> : <span className="ds-heavy-why">Starts as it scrolls near</span>}
            {status === "waiting" && (
              <button type="button" className="ds-btn ds-btn--line" aria-label={`Show live: ${label}`} onClick={showLive}>
                Show live
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** The waiting card's reason, the one place a slot reads the ledger's count. */
function WaitingNote() {
  const { live } = useGlBudget();
  return (
    <span className="ds-heavy-why">
      Paused to keep the page light: {live} live {live === 1 ? "view" : "views"}
    </span>
  );
}

/** A reading of the ledger, "GL 3/8 · floor 0/1 · frames 2/8", shown in the Compositor-safe rule section. */
export function BudgetPill() {
  const b = useGlBudget();
  return (
    <span className="ds-pill ds-budget-pill" title="Live WebGL units, the tile floor and iframes on this page">
      GL {b.gl}/{CAPACITY.gl} · floor {b.floor}/{CAPACITY.floor} · frames {b.frames}/{CAPACITY.frames}
    </span>
  );
}
