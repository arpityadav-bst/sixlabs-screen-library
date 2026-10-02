"use client";

// The carousel's live specimens. The shipped parts take their state from a parent (Players.tsx), so each
// specimen here is that parent: one active index shared by the arrows beside a portrait box and the
// carousel under it, as below lg on the site. The box stands in for the portrait and draws nothing.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { IconButton } from "@/components/design-system/IconButton";
import { PlayerArrows, PlayerCarousel } from "@/components/website/PlayerCarousel";
import { PLAYERS } from "@/components/website/players-data";
import { Label } from "@/app/design-system/_kit/Label";
import { noop } from "@/app/design-system/_kit/reduced-motion";

/** a slide equals this box, as a slide equals a phone's width */
const PHONE: CSSProperties = { width: 390, maxWidth: "100%" };
const PORTRAIT: CSSProperties = { position: "relative", height: 160, display: "grid", placeItems: "center" };

/** The arrows beside a portrait box and the carousel under it, on one shared index. */
export function CarouselPair() {
  const [active, setActive] = useState(0);
  return (
    <div style={PHONE}>
      <div style={PORTRAIT}>
        <Label>portrait box</Label>
        <PlayerArrows active={active} onChange={setActive} />
      </div>
      <div style={{ marginTop: 24 }}>
        <PlayerCarousel active={active} onChange={setActive} />
      </div>
    </div>
  );
}

const ARROW_BOX: CSSProperties = { position: "relative", width: 176, height: 56 };

/** A forced cell: the arrows pinned at one index. */
export function ArrowsAt({ active }: { active: number }) {
  return (
    <div style={ARROW_BOX}>
      <PlayerArrows active={active} onChange={noop} />
    </div>
  );
}

/** The Don't: a pair of glass arrows that stay live at the first player, as a looping row would. */
export function ArrowsAlwaysOn() {
  return (
    <div style={{ display: "flex", gap: 104 }}>
      <IconButton icon={ChevronLeft} label="Previous player" variant="glass" />
      <IconButton icon={ChevronRight} label="Next player" variant="glass" />
    </div>
  );
}

/** The live cell: the arrows on their own index, with the slide they point at. */
export function ArrowsLive() {
  const [active, setActive] = useState(0);
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 8 }}>
      <div style={ARROW_BOX}>
        <PlayerArrows active={active} onChange={setActive} />
      </div>
      <Label>
        {active + 1} of {PLAYERS.length}
      </Label>
    </div>
  );
}
