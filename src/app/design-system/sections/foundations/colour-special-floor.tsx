"use client";

// The floor scene's palette, read live from /tiles/floor-params.json on every load with no cache, so the
// guide shows the params the floor reads today. The scene colours are a strip keyed by parameter name.
// The two tile-state ramps run in one column per parameter, default over shine, so a key reads downward,
// and the drawer lists every key with both values.
import { useEffect, useState } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Label } from "@/app/design-system/_kit/Label";
import { SpecDrawer } from "@/app/design-system/_kit/SpecDrawer";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { Strip, tint } from "./colour-strip";
import s from "./colour.module.css";

const PARAMS = "/tiles/floor-params.json";
const HEX = /^#[0-9a-f]{6}$/i;

type Colours = readonly (readonly [string, string])[];
type Floor =
  | { status: "loading" }
  | { status: "failed"; why: string }
  | { status: "ready"; scene: Colours; states: readonly { name: string; colours: Map<string, string> }[]; keys: readonly string[] };

const colours = (o: unknown): Colours =>
  o && typeof o === "object"
    ? Object.entries(o).filter((e): e is [string, string] => typeof e[1] === "string" && HEX.test(e[1]))
    : [];

function read(p: Record<string, unknown>): Floor {
  const raw = p.states && typeof p.states === "object" ? (p.states as Record<string, unknown>) : {};
  const states = Object.entries(raw).map(([name, o]) => ({ name, colours: new Map(colours(o)) }));
  const keys = [...new Set(states.flatMap((st) => [...st.colours.keys()]))];
  return { status: "ready", scene: colours(p), states, keys };
}

export function FloorPalette() {
  const [floor, setFloor] = useState<Floor>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch(PARAMS, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((p: Record<string, unknown>) => alive && setFloor(read(p)))
      .catch((e: unknown) => alive && setFloor({ status: "failed", why: e instanceof Error ? e.message : "no response" }));
    return () => {
      alive = false;
    };
  }, []);

  if (floor.status !== "ready") {
    return (
      <Canvas ground="page" label="Floor palette">
        <p className={s["ds-col-status"]} role="status">
          {floor.status === "loading" ? `Reading ${PARAMS}` : `${PARAMS} did not load: ${floor.why}`}
        </p>
      </Canvas>
    );
  }

  return (
    <>
      <Canvas ground="page" layout="stack" label="Floor scene colours">
        <Strip label="Floor scene colours" items={floor.scene.map(([k, hex]) => ({ name: k, value: hex, mode: "fill", caption: hex }))} />
      </Canvas>
      <Canvas ground="page" layout="stack" label="Tile state ramps">
        <div className={s["ds-col-ramps"]} role="img" aria-label={`Tile state ramps, ${floor.keys.length} parameters in ${floor.states.length} states, listed in the drawer`}>
          {floor.states.map((st) => (
            <div key={st.name} className={s["ds-col-ramp"]} style={{ ["--ds-col-n" as string]: floor.keys.length }}>
              <span>{st.name}</span>
              {floor.keys.map((k) => {
                const hex = st.colours.get(k);
                return (
                  <span
                    key={k}
                    className={hex ? s["ds-col-ramp-chip"] : `${s["ds-col-ramp-chip"]} ${s["ds-col-ramp-chip--empty"]}`}
                    style={hex ? tint(hex) : undefined}
                    title={`${k} ${hex ?? "not set"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <Label>
          {floor.scene.length} scene colours · {floor.keys.length} state parameters · read live from {PARAMS}
        </Label>
      </Canvas>
      <SpecDrawer label="Every floor colour by parameter">
        <SpecTable
          caption="Tile state colours by parameter"
          columns={["Parameter", ...floor.states.map((st) => st.name)]}
          mono={[0, ...floor.states.map((_, i) => i + 1)]}
          rows={floor.keys.map((k) => [k, ...floor.states.map((st) => st.colours.get(k) ?? "not set")])}
        />
      </SpecDrawer>
    </>
  );
}
