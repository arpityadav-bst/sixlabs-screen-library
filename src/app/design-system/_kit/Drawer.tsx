"use client";

// The nav on phones and narrow windows (under 900px): a native modal dialog, a sheet from the left over a
// solid ink veil (its ::backdrop). showModal makes everything else on the page inert, the skip link and the
// toast region included, so Tab stays inside. It takes focus on its close button when it opens, closes on
// Escape, on the veil, on its close button and on any link (focus then moves to the chosen section's
// heading), and closes itself if the window grows past 900px. Under 600px, where the toolbar has no room
// for it, the jump field sits at its top.
import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { scrollToSection } from "./go";
import { GUIDE_NAV_BP } from "./guide-metrics";
import { Jump } from "./Jump";
import { Nav } from "./Nav";

export type DrawerProps = {
  open: boolean;
  /** returnFocus: give focus back to the Sections button. to: the section the reader chose */
  onClose: (returnFocus: boolean, to?: string) => void;
};

export function Drawer({ open, onClose }: DrawerProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("[data-drawer-close]")?.focus();
    const wide = window.matchMedia(`(min-width: ${GUIDE_NAV_BP}px)`);
    const onWide = () => {
      if (wide.matches) onClose(false);
    };
    wide.addEventListener("change", onWide);
    return () => {
      html.style.overflow = overflow;
      wide.removeEventListener("change", onWide);
    };
  }, [open, onClose]);

  // a click on the veil lands on the dialog itself, outside its box
  const onVeil = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) onClose(true);
  };

  return (
    <dialog
      ref={dialog}
      className="ds-drawer"
      aria-label="Sections"
      onCancel={(e) => {
        e.preventDefault();
        onClose(true);
      }}
      onClose={() => {
        if (open) onClose(true);
      }}
      onClick={onVeil}
    >
      {open && (
        <>
          <div className="ds-drawer-head">
            <span>Sections</span>
            <button type="button" className="ds-btn" data-drawer-close aria-label="Close sections" onClick={() => onClose(true)}>
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <div className="ds-drawer-jump">
            <Jump
              onPick={(id) => {
                scrollToSection(id);
                onClose(false, id);
              }}
            />
          </div>
          <Nav onNavigate={(id) => onClose(false, id)} />
        </>
      )}
    </dialog>
  );
}
