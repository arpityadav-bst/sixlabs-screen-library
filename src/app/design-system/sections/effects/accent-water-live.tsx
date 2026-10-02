"use client";

// The accent water on a panel canvas: the real accentWaveGL, sized to its box at the device's pixel ratio
// (up to 2) before it is made, then one frame per change. The level comes from the same formula AccentWave
// runs on the scroll (waterLevel), driven here by a range instead. It mounts inside a HeavySlot, which
// loses the context when the panel scrolls away, because accentWaveGL has no dispose. The band is set when
// the renderer is made, so the canvas is keyed on it and a new band gets a new canvas. The pinned parts are
// empty boxes laid over the canvas from the same geometry, keyed on the level so the anatomy measures again.
import { useEffect, useRef, useState } from "react";
import { accentWaveGL } from "@/components/website/accent-wave-gl";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { HeavySlot } from "@/app/design-system/_kit/HeavySlot";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { Spec } from "@/app/design-system/_kit/Spec";
import {
  DRAINED_BELOW,
  FULL_AT,
  PRESETS,
  PRESET_OPTIONS,
  WATER,
  WATER_CODE,
  WATER_H,
  WATER_PINS,
  WATER_PROPS,
  WATER_VALUES,
  waterLevel,
  waterMarks,
  type Dir,
} from "./accent-water-data";
import { WATER_RISE_ROW } from "./scrub-exports";
import s from "./fx-live.module.css";

type Gl = NonNullable<ReturnType<typeof accentWaveGL>>;

export function WaterCanvas({ level, dir, dots, band = WATER.band }: { level: number; dir: Dir; dots: boolean; band?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const gl = useRef<Gl | null>(null);
  const made = useRef<HTMLCanvasElement | null>(null); // the canvas the renderer was made on
  const frame = useRef({ level, dir, dots });
  const paint = useRef<() => void>(() => {});

  useEffect(() => {
    frame.current = { level, dir, dots };
    paint.current();
  }, [level, dir, dots]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const w = c.clientWidth,
        h = c.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(w * dpr),
        ch = Math.round(h * dpr);
      if (c.width !== cw || c.height !== ch) {
        c.width = cw;
        c.height = ch;
      }
      if (made.current !== c) {
        made.current = c;
        gl.current = accentWaveGL(c, { ...WATER, band });
      }
      gl.current?.draw({ w, h, ...frame.current }, dpr);
    };
    paint.current = draw;
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => {
      ro.disconnect();
      paint.current = () => {};
    };
  }, [band]);

  return <canvas key={band} ref={ref} aria-hidden="true" className={s["ds-water-canvas"]} />;
}

function Marks({ level, dir, h }: { level: number; dir: Dir; h: number }) {
  const m = waterMarks(level, dir, h);
  return (
    <>
      <div data-ds="water-band" className={s["ds-water-mark"]} style={m.band} />
      <div data-ds="water-edge" className={s["ds-water-mark"]} style={m.edge} />
      <div data-ds="water-solid" className={s["ds-water-mark"]} style={m.solid} />
    </>
  );
}

const DIRS = [
  { value: 1, label: "Rise" },
  { value: -1, label: "Drain" },
];
const DOTS = [
  { value: "on", label: "Dots on" },
  { value: "off", label: "Dots off" },
];
const WIDTHS = [
  { value: "panel", label: "Panel width" },
  { value: "375", label: "375" },
];

function stateName(k: number, dir: Dir) {
  if (dir === 1) return k === 0 ? "empty" : k >= FULL_AT ? "full · accentwave filled true" : "rising";
  if (k >= 1) return "drained";
  return 1 - k < DRAINED_BELOW ? "draining · accentwave filled false" : "draining";
}

export function WaterSpec() {
  const [k, setK] = useState(0.55);
  const [dir, setDir] = useState<Dir>(1);
  const [dots, setDots] = useState("on");
  const [width, setWidth] = useState("panel");
  const level = Math.round(waterLevel(k, dir, WATER_H));

  return (
    <Spec
      title="The water, under your hand"
      level={4}
      source={{ from: "@/components/website/accent-wave-gl", name: "accentWaveGL", file: "accent-wave-gl.ts" }}
      props="level dir dots"
      chips={["AccentWave.tsx:36"]}
      role="Its level is the scroll's own, so the takeover moves only as fast as the reader and needs no motion of its own."
      drawer={{ values: [...WATER_VALUES, WATER_RISE_ROW], props: WATER_PROPS, code: WATER_CODE }}
      note="On the site the canvas is the whole viewport. The arc stays 90px at every width, so a phone sees a deeper curve."
    >
      <div className={s["ds-fx-bar"]}>
        {PRESET_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            className="ds-btn ds-btn--line"
            onClick={() => {
              setK(PRESETS[o.value].k);
              setDir(PRESETS[o.value].dir);
            }}
          >
            {o.label}
          </button>
        ))}
        <label className={s["ds-fx-ctl"]}>
          Water level
          <input
            type="range"
            className={s["ds-range"]}
            min={0}
            max={100}
            value={Math.round(k * 100)}
            onChange={(e) => setK(Number(e.currentTarget.value) / 100)}
            aria-label="Water level"
            aria-valuetext={`${Math.round(k * 100)}% ${dir === 1 ? "risen" : "drained"}, level ${level}`}
          />
        </label>
        <KitSeg label="Direction" options={DIRS} value={dir} onChange={(v) => setDir(v === -1 ? -1 : 1)} />
        <KitSeg label="Halftone dots" options={DOTS} value={dots} onChange={setDots} />
        <KitSeg label="Canvas width" options={WIDTHS} value={width} onChange={setWidth} />
      </div>
      <Anatomy pins={WATER_PINS} ground="page" layout="stack" label="Accent water">
        <div
          data-ds="water-stage"
          className={s["ds-water-stage"]}
          style={{ height: WATER_H, maxWidth: width === "375" ? 375 : undefined }}
        >
          <HeavySlot cost={{ gl: 1 }} label="The accent water" fill>
            <WaterCanvas level={level} dir={dir} dots={dots === "on"} />
          </HeavySlot>
          <Marks key={`${dir}:${level}:${width}`} level={level} dir={dir} h={WATER_H} />
        </div>
      </Anatomy>
      <p className="ds-spec-caption">
        level {level} · {dir === 1 ? "rise" : "drain"} {Math.round(k * 100)}% · dots {dots} · {stateName(k, dir)}
      </p>
    </Spec>
  );
}

/** A fixed frame for the Do and Don't pair: the same level, a full or a short band. */
export function BandPanel({ band }: { band: number }) {
  return (
    <div className={s["ds-water-stage"]} style={{ height: 400 }}>
      <HeavySlot cost={{ gl: 1 }} label={`Water with a ${band}px band`} fill>
        <WaterCanvas level={340} dir={1} dots band={band} />
      </HeavySlot>
    </div>
  );
}
