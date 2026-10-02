"use client";

// The guide's frame: a 264px sticky sidebar and the main column (toolbar, then the sections, capped at
// 1180px). Under 900px the sidebar goes and the toolbar's Sections button opens the same nav in a drawer (a
// native modal dialog, so the rest of the page is inert while it is open). It also mounts what the whole page
// shares, once: the system Toaster (any section's demo can toast), the guide's one polite status region
// (announce, in go.ts) and GpuAwake, the high-performance WebGL context that, from the first live WebGL slot on,
// keeps a two-GPU Mac from switching GPUs each time a HeavySlot lets a specimen go. Every ds- class lives in the five kit
// stylesheets (ds.css, ds-shell.css, ds-spec.css, ds-measure.css, ds-chart.css), so nothing here restyles
// the site.
import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Toaster } from "@/components/design-system/Toaster";
import { Drawer } from "./Drawer";
import { ANNOUNCER_ID, focusHeading } from "./go";
import { GpuAwake } from "./GpuAwake";
import { GUIDE_TOP } from "./guide-metrics";
import { Nav } from "./Nav";
import { SpyProvider } from "./spy";
import { Toolbar } from "./Toolbar";

/** the scroll offset under the toolbar, for the sections' scroll margin (ds.css) */
const ROOT_STYLE = { "--dsg-top": `${GUIDE_TOP}px` } as CSSProperties;

export function GuideShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus: boolean, to?: string) => {
    setOpen(false);
    if (to) focusHeading(to);
    else if (returnFocus) trigger.current?.focus();
  }, []);

  return (
    <SpyProvider>
      <div className="ds-root" style={ROOT_STYLE}>
        <a className="ds-skip" href="#ds-content">
          Skip to content
        </a>
        <aside className="ds-side">
          <Nav />
        </aside>
        <div className="ds-main">
          <Toolbar menuRef={trigger} menuOpen={open} onMenu={() => setOpen(true)} />
          <main id="ds-content" className="ds-content" tabIndex={-1}>
            {children}
          </main>
        </div>
        <Drawer open={open} onClose={close} />
        <p id={ANNOUNCER_ID} className="ds-sr" role="status" aria-live="polite" />
        <Toaster />
        <GpuAwake />
      </div>
    </SpyProvider>
  );
}
