"use client";

// The stats and typed word specimens that hold state: the hero figures with a ready switch and a count
// that ticks every 2.4s while it is on screen, and the typed word held until its switch lets it go. The
// switches are guide chrome (KitSeg). Replay remounts each specimen, so its entrance runs again.
import { useEffect, useRef, useState, type RefObject } from "react";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { Replay } from "@/app/design-system/_kit/Replay";
import { typeStyle } from "@/components/design-system/tokens";
import { HeroNumbers } from "@/components/website/HeroBits";
import { TypedWord } from "@/components/website/TypedWord";
import { COPIES_BASE, heroStats, TICK_MS } from "./stats-typed-data";

const READY = [
  { value: "waiting", label: "Floor loading" },
  { value: "ready", label: "Floor ready" },
] as const;
const HOLD = [
  { value: "held", label: "Held" },
  { value: "free", label: "Released" },
] as const;

/** The live count: one more every TICK_MS, only while the specimen is in view, so an unread count never
 *  re-keys its figure or wakes the Anatomy round it. */
function useTick(host: RefObject<HTMLElement | null>) {
  const [copies, setCopies] = useState(COPIES_BASE);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [host]);
  useEffect(() => {
    if (!shown) return;
    const id = window.setInterval(() => setCopies((c) => c + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [shown]);
  return copies;
}

/** The container row's figures: invisible until ready, then rising in after the tiles. */
export function LiveNumbers({ left = false }: { left?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const copies = useTick(host);
  const [ready, setReady] = useState<"waiting" | "ready">("ready");
  return (
    <div ref={host} className="flex w-full flex-col items-center gap-6">
      {!left && <KitSeg label="Hero floor" options={READY} value={ready} onChange={setReady} />}
      <Replay>
        <div className={`ds-a-stats flex w-full ${left ? "justify-start" : "justify-center"}`}>
          <HeroNumbers stats={heroStats(copies)} ready={left || ready === "ready"} left={left} />
        </div>
      </Replay>
    </div>
  );
}

/** The full view's hold: the word waits, paused, until its loader lets the copy in. */
export function HeldWord() {
  const [hold, setHold] = useState<"held" | "free">("held");
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <KitSeg label="Hold" options={HOLD} value={hold} onChange={setHold} />
      <Replay>
        <p className="text-(--ds-color-ink)" style={typeStyle("hero")}>
          Making <TypedWord word="models" className="text-accent" hold={hold === "held"} /> of
          <br />
          human players.
        </p>
      </Replay>
    </div>
  );
}
