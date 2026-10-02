"use client";

// The Tooltip section's specimens. They live in a client leaf because each trigger is an IconButton, whose
// icon is a component and cannot cross from a server file. Open bubbles are the docs form (open set), the
// live ones are the real hover and focus path.
import { ArrowUp, ChevronLeft, ChevronRight, Copy, RotateCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/design-system/Button";
import { IconButton } from "@/components/design-system/IconButton";
import { Tooltip, type TooltipSide } from "@/components/design-system/Tooltip";
import type { TooltipCellState } from "./tooltip-data";
import styles from "./overlays.module.css";

type Trigger = { side: TooltipSide; icon: LucideIcon; label: string };

/** One trigger per side. The labels are the site's own aria-labels and the wave button's label. */
const SIDES: readonly Trigger[] = [
  { side: "top", icon: ArrowUp, label: "Back to top" },
  { side: "right", icon: ChevronRight, label: "Next player" },
  { side: "bottom", icon: RotateCw, label: "Next wave" },
  { side: "left", icon: ChevronLeft, label: "Previous player" },
];

export function TipAnatomy() {
  return (
    <span data-pin="tt" className={styles["ds-room-top"]}>
      <Tooltip open arrow shortcut="Home" content="Back to top">
        <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" forceState="hover" />
      </Tooltip>
    </span>
  );
}

export function TipSides({ arrow = false, shortcut = false }: { arrow?: boolean; shortcut?: boolean }) {
  return (
    <>
      {SIDES.map((t) => (
        <span key={t.side} className={styles["ds-room"]}>
          <Tooltip open side={t.side} arrow={arrow} shortcut={shortcut ? "Home" : undefined} content={t.label}>
            <IconButton icon={t.icon} label={t.label} variant="elevated" size="lg" />
          </Tooltip>
        </span>
      ))}
    </>
  );
}

export function TipCell({ state }: { state: TooltipCellState | "live" }) {
  if (state === "live") {
    return (
      <span className={styles["ds-room-top"]}>
        <Tooltip content="Back to top">
          <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" />
        </Tooltip>
      </span>
    );
  }
  const hovered = state === "entering" || state === "open";
  return (
    <span className={styles["ds-room-top"]}>
      <Tooltip
        open={state !== "hidden"}
        forceState={state === "entering" || state === "leaving" ? state : undefined}
        content="Back to top"
      >
        <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" forceState={hovered ? "hover" : "rest"} />
      </Tooltip>
    </span>
  );
}

export function TipInverse() {
  return (
    <span className={styles["ds-room-top"]}>
      <Tooltip open arrow tone="inverse" content="Copy the run">
        <IconButton icon={Copy} label="Copy the run" variant="glass" size="md" />
      </Tooltip>
    </span>
  );
}

/** Three live triggers in a row: the first waits 400ms, the next ones open at once inside 600ms. */
export function TipRow() {
  return (
    <span className={styles["ds-room-row"]}>
      {[SIDES[3], SIDES[1], SIDES[0]].map((t) => (
        <Tooltip key={t.label} content={t.label}>
          <IconButton icon={t.icon} label={t.label} variant="elevated" size="lg" />
        </Tooltip>
      ))}
    </span>
  );
}

export function TipDo() {
  return (
    <span className={styles["ds-room-top"]}>
      <Tooltip open content="Next player">
        <IconButton icon={ChevronRight} label="Next player" variant="elevated" size="lg" />
      </Tooltip>
    </span>
  );
}

export function TipDont() {
  return (
    <span className={styles["ds-room-top"]}>
      <Tooltip open content="Sign in">
        <Button variant="secondary">Sign in</Button>
      </Tooltip>
    </span>
  );
}
