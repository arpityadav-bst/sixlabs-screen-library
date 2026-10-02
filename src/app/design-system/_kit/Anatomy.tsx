"use client";

// Numbered callouts measured on the live specimen, never drawn by hand. Each pin's selector is found
// in the specimen (or inside a same-origin frame such as a ViewportPreview) and outlined in an SVG over
// it, with a navy disc in the side margin and a leader to the part. Each outline and leader is drawn over
// a wider light halo, so it reads on a navy part as well as a white one. Padding shows as hatched bands.
// anatomy-watch.ts measures it again whenever a part can have moved, while the stage is near the screen.
// The legend maps each number to part, token, value and file:line, and a selector that no longer matches
// turns its row red ("pin lost"), which is the drift alarm. It opens on the clean specimen, the overlay one
// switch away, and the switch is named after the canvas ("Tile floor view"), so two never share a name.
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { layoutCallouts, padBands, type AnatomyPin, type Callout, type Measured } from "./anatomy-measure";
import { useAnatomyWatch, type AnatomyState } from "./anatomy-watch";
import { Canvas, type Ground } from "./Canvas";
import { KitSeg } from "./KitSeg";

export type { AnatomyPin } from "./anatomy-measure";

export type AnatomyProps = {
  pins: readonly AnatomyPin[];
  /** measure inside the first iframe in the specimen (true) or the iframe matching this selector */
  frame?: true | string;
  ground?: Ground;
  /** how the specimen sits: centred and wrapping (flow) or a full-width column (stack) */
  layout?: "flow" | "stack";
  /** the side margins the discs sit in, px */
  gutter?: number;
  minHeight?: number;
  /** the view it opens on: the clean specimen by default, "anatomy" where the spec is about the measures */
  view?: "anatomy" | "specimen";
  legend?: boolean;
  /** names the canvas as a group, and its view switch ("<label> view") */
  label?: string;
  isolateKeys?: boolean;
  children: ReactNode;
};

type View = "anatomy" | "specimen";

/** the disc's radius: 20px across, room for a 12px number */
const DISC_R = 10;

const VIEWS = [
  { value: "specimen" as View, label: "Specimen" },
  { value: "anatomy" as View, label: "Anatomy" },
];

export function Anatomy({
  pins,
  frame,
  ground = "page",
  layout = "flow",
  gutter = 40,
  minHeight,
  view: initial = "specimen",
  legend = true,
  label,
  isolateKeys,
  children,
}: AnatomyProps) {
  const stage = useRef<HTMLDivElement>(null);
  const pinsRef = useRef(pins);
  const [view, setView] = useState<View>(initial);
  const [st, setSt] = useState<AnatomyState>({ w: 0, h: 0, m: pins.map(() => ({ status: "pending" })) });
  const hatch = `ds-hatch-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    pinsRef.current = pins;
  });

  useAnatomyWatch(stage, pinsRef, frame, pins.length, setSt);

  const callouts = view === "anatomy" ? layoutCallouts(pins, st.m, st.w, gutter) : [];
  const lost = st.m.filter((x) => x.status === "lost").length;

  return (
    <div className="ds-anat">
      <Canvas ground={ground} layout="bleed" minHeight={minHeight} label={label} isolateKeys={isolateKeys}>
        <div className="ds-anat-wrap">
          <div ref={stage} className={`ds-anat-stage ds-anat-stage--${layout}`} style={{ paddingInline: gutter }}>
            {children}
          </div>
          {callouts.length > 0 && (
            <svg className="ds-anat-svg" width={st.w} height={st.h} aria-hidden="true">
              <defs>
                <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect className="ds-anat-hatch-ground" width="6" height="6" />
                  <line className="ds-anat-hatch-line" x1="0" y1="0" x2="0" y2="6" />
                  <line className="ds-anat-hatch-alt" x1="3" y1="0" x2="3" y2="6" />
                </pattern>
              </defs>
              {callouts.map((c) => (
                <g key={c.n}>
                  {c.pad && padBands(c.box, c.pad).map((b, i) => (
                    <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${hatch})`} />
                  ))}
                  <Outline c={c} cls="ds-anat-halo" />
                  <Outline c={c} cls="ds-anat-outline" />
                  <circle className="ds-anat-tip" cx={c.anchor.x} cy={c.anchor.y} r="1.5" />
                  <circle className="ds-anat-disc" cx={c.disc.x} cy={c.disc.y} r={DISC_R} />
                  <text className="ds-anat-num" x={c.disc.x} y={c.disc.y} textAnchor="middle" dominantBaseline="central">
                    {c.n}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </Canvas>
      <div className="ds-anat-foot">
        <KitSeg label={`${label ?? "Anatomy"} view`} options={VIEWS} value={view} onChange={setView} />
        <span className="ds-label">
          {pins.length} {pins.length === 1 ? "pin" : "pins"}
          {lost > 0 && <span className="ds-anat-alarm"> · {lost} lost</span>}
          {st.w > 0 && ` · measured at ${Math.round(st.w)} wide`}
        </span>
      </div>
      {legend && <AnatomyLegend pins={pins} measured={st.m} />}
    </div>
  );
}

/** One outline and its leader, drawn twice per callout: the wide halo first, then the thin line over it. */
function Outline({ c, cls }: { c: Callout; cls: string }) {
  return (
    <>
      <rect className={cls} x={c.box.x + 0.5} y={c.box.y + 0.5} width={Math.max(0, c.box.w - 1)} height={Math.max(0, c.box.h - 1)} />
      <line className={cls} x1={c.disc.x + (c.anchor.x > c.disc.x ? DISC_R : -DISC_R)} y1={c.disc.y} x2={c.anchor.x} y2={c.anchor.y} />
    </>
  );
}

const STATUS_NOTE: Partial<Record<Measured["status"], string>> = {
  hidden: "not shown at this width",
  pending: "measures when the frame has loaded",
};

function AnatomyLegend({ pins, measured }: { pins: readonly AnatomyPin[]; measured: readonly Measured[] }) {
  return (
    <div className="ds-table-wrap ds-anat-legend">
      <table className="ds-table">
        <caption className="ds-sr">Anatomy legend</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Part</th>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {pins.map((p, i) => {
            const s = measured[i]?.status ?? "pending";
            return (
              <tr key={`${p.selector}-${i}`} className={s === "lost" ? "ds-anat-lost" : undefined}>
                <td>
                  <span className="ds-anat-key">{p.n ?? i + 1}</span>
                </td>
                <td>
                  {p.name}
                  {s === "lost" && (
                    <span className="ds-anat-status">
                      pin lost: <code className="ds-mono">{p.selector}</code>
                    </span>
                  )}
                  {STATUS_NOTE[s] && <span className="ds-anat-status ds-anat-status--quiet">{STATUS_NOTE[s]}</span>}
                </td>
                <td className="ds-mono">{p.token}</td>
                <td>{p.value}</td>
                <td className="ds-mono">{p.source}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
