"use client";

// The live floor, as the hero mounts it: the real TileFloor filling a box of the hero's kind, and the real
// WaveButton over its bottom-right corner calling the handle's reset(). The floor mounts only inside the
// kit's HeavySlot (one floor and one WebGL unit), which releases it when it scrolls far away. The box's
// shape can change, so the camera's reframe for a wide or a tall box is seen live. Keys stop at the
// canvas, so typing in the guide never reaches the floor's window R listener.
//
// One floor builds at a time. A build cut short (Replay intro, or the slot released while it loads) runs
// on to its end and only then disposes itself (TileFloor.tsx), and that dispose puts three's own tone
// mapping chunk back (lean.js), under any floor built meanwhile. So each mount waits for the one before it
// to be done: its handle delivered, or its canvas taken away by that late dispose, or LATE_MS for a build
// that failed and never will be. The engine's chunk is fetched before TileFloor mounts, because TileFloor
// reads its container when that import lands, and a slot released mid-download would hand it none.
import { useCallback, useEffect, useRef, useState } from "react";
import { TileFloor, type FloorHandle } from "@/components/tiles/TileFloor";
import { WaveButton } from "@/components/website/HeroBits";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { HeavySlot } from "@/app/design-system/_kit/HeavySlot";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { Replay } from "@/app/design-system/_kit/Replay";
import { FLOOR_PINS, INTRO_DELAY, SHAPES, type Shape } from "./tile-floor-pins";
import s from "./floor.module.css";

const LATE_MS = 20000;
let prior: Promise<void> = Promise.resolve(); // the last mount's build, done or not

/** Mounts the floor once the build before it is done, hands its handle up, and takes it back on unmount. */
function Mount({ onHandle }: { onHandle: (h: FloorHandle | null) => void }) {
  const [go, setGo] = useState(false);
  const host = useRef<HTMLDivElement | null>(null); // kept past unmount, unlike a ref React detaches
  const ready = useRef(false);
  const done = useRef<() => void>(() => {});
  const keep = useCallback((el: HTMLDivElement | null) => {
    if (el) host.current = el;
  }, []);
  const onReady = useCallback(
    (h: FloorHandle) => {
      ready.current = true;
      done.current();
      onHandle(h);
    },
    [onHandle],
  );

  useEffect(() => {
    let finish: () => void = () => {};
    const built = new Promise<void>((r) => (finish = () => r()));
    done.current = finish;
    const before = prior;
    prior = before.then(() => built);
    let on = true;
    before
      .then(() => import("@/tiles/floor.js"))
      .then(
        () => on && setGo(true),
        () => finish(), // no engine, so no build: the next floor may go
      );
    return () => {
      on = false;
      onHandle(null);
      const el = host.current;
      // never started, or built (TileFloor's own cleanup disposes it now): the next floor may go
      if (!el || ready.current) return finish();
      // cut short mid-build: done when its late dispose takes the canvas away
      const mo = new MutationObserver((recs) => {
        if (recs.some((r) => [...r.removedNodes].some((n) => n.nodeName === "CANVAS"))) end();
      });
      const timer = window.setTimeout(() => end(), LATE_MS);
      function end() {
        mo.disconnect();
        window.clearTimeout(timer);
        finish();
      }
      mo.observe(el, { childList: true, subtree: true });
    };
  }, [onHandle]);

  if (!go) return null;
  return (
    <div ref={keep} className="absolute inset-0">
      <TileFloor className="absolute inset-0" introDelay={INTRO_DELAY} onReady={onReady} />
    </div>
  );
}

export function FloorLive() {
  const box = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<Shape>("hero");
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [handle, setHandle] = useState<FloorHandle | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the hero's sendWave: busy from the press until the wave's flip begins (it may wait for the next cast)
  const sendWave = () => {
    if (!handle || busy) return;
    setBusy(true);
    Promise.resolve(handle.reset()).finally(() => setBusy(false));
  };

  const caption = size ? `${size.w} × ${size.h} · aspect ${(size.w / size.h).toFixed(2)}` : "measuring";

  return (
    <Anatomy ground="container" layout="stack" pins={FLOOR_PINS} view="specimen" label="Live tile floor" isolateKeys>
      <div className={s["ds-fl-bar"]}>
        <KitSeg options={SHAPES} value={shape} onChange={setShape} label="Box shape" />
        <p className="ds-label" aria-live="polite">
          {caption}
        </p>
      </div>
      <div ref={box} className={s["ds-fl-box"]} data-shape={shape} data-floor-box="">
        <HeavySlot cost={{ gl: 1, floor: true }} label="The tile floor" fill>
          <Replay label="Replay intro">
            <Mount onHandle={setHandle} />
          </Replay>
        </HeavySlot>
        <div className={s["ds-fl-wave"]} data-floor-wave="">
          <WaveButton full busy={busy} onClick={sendWave} />
        </div>
      </div>
    </Anatomy>
  );
}
