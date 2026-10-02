"use client";

// The sticky bar over the main column: where the reader is (group / section), the jump field and the
// reduced-motion reading. Solid page ground with a hairline, no blur. Under 900px it also carries the
// Sections button that opens the drawer. There is no theme toggle, because the site has no dark reading.
// The live WebGL ledger is a developer's reading, so it lives in the Compositor-safe rule section, not here.
import { Menu } from "lucide-react";
import type { Ref } from "react";
import { sectionById } from "../_data/catalog";
import { Jump } from "./Jump";
import { useReducedMotionSetting } from "./reduced-motion";
import { useCurrentSection } from "./spy";

/** The reduced-motion reading in its short form at every width, the full sentence in its title, so the
 *  crumb keeps its room. */
function MotionPill() {
  const reduced = useReducedMotionSetting();
  return (
    <span
      className="ds-pill ds-motion-pill"
      title={`Reduced motion: ${reduced ? "on" : "off"} (read from the system setting)`}
    >
      Motion {reduced ? "reduced" : "full"}
    </span>
  );
}

export function Toolbar({
  menuRef,
  menuOpen,
  onMenu,
}: {
  menuRef: Ref<HTMLButtonElement>;
  menuOpen: boolean;
  onMenu: () => void;
}) {
  const s = sectionById(useCurrentSection());
  return (
    <header className="ds-toolbar">
      <button
        ref={menuRef}
        type="button"
        className="ds-btn ds-btn--line ds-menu-btn"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        onClick={onMenu}
      >
        <Menu size={14} strokeWidth={2} aria-hidden="true" />
        Sections
      </button>
      <p className="ds-crumb">
        <span className="ds-crumb-group ds-crumb-name">{s.groupTitle}</span>
        <span className="ds-crumb-group ds-crumb-sep" aria-hidden="true">
          /
        </span>
        <b>{s.title}</b>
      </p>
      <div className="ds-toolbar-end">
        <Jump />
        <MotionPill />
      </div>
    </header>
  );
}
