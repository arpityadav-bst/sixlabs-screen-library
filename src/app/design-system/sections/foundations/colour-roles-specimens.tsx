// The canvases that say each colour tier at a glance: the grounds nested as the site nests them, the text
// roles on two grounds, the two navies side by side, the accent where it may appear, and the status colours
// on the system Badge. Server components, drawn from the --ds-* tokens.
import { CircleCheck, CircleX } from "lucide-react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Item, Label } from "@/app/design-system/_kit/Label";
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import { Badge } from "@/components/design-system/Badge";
import { StatusDot } from "@/components/design-system/StatusDot";
import { cssVar, typeStyle } from "@/components/design-system/tokens";
import { cssName, itemsOf, tok } from "./colour-kit";
import { FAQ_HEAD, TEXT_LINES } from "./colour-roles-data";
import { Strip, tint } from "./colour-strip";
import s from "./colour.module.css";

/** Page, then the hero container, then a white card, then its sunken panel, with the footer ground under. */
export function GroundNest() {
  return (
    <div className={s["ds-col-nest"]}>
      <span className={s["ds-col-tag"]}>color-page</span>
      <div className={s["ds-col-nest-container"]}>
        <span className={s["ds-col-tag"]}>color-container</span>
        <div className={s["ds-col-nest-surface"]}>
          <span className={s["ds-col-tag"]}>color-surface</span>
          <div className={s["ds-col-nest-sunken"]}>
            <span className={s["ds-col-tag"]}>color-surface-sunken</span>
          </div>
        </div>
      </div>
      <div className={s["ds-col-nest-footer"]}>
        <span className={s["ds-col-tag"]}>color-footer</span>
        <span className={`${s["ds-col-tag"]} ${s["ds-col-nest-tail"]}`}>color-footer-tail</span>
      </div>
    </div>
  );
}

function TextLines() {
  return (
    <div className={s["ds-col-text"]}>
      {TEXT_LINES.map((l) => (
        <p key={l.token} className={s["ds-col-text-row"]}>
          <span
            style={{ ...typeStyle(l.type), color: cssVar(l.token), textTransform: l.caps ? "uppercase" : undefined }}
          >
            {l.text}
          </span>
          <span className={s["ds-col-text-tok"]}>
            {l.token} · {l.source}
          </span>
        </p>
      ))}
    </div>
  );
}

/** The four text roles, on the page and on the container, because the container is where muted runs short. */
export function TextStack() {
  return (
    <>
      <Canvas ground="page" label="Text roles on the page">
        <TextLines />
      </Canvas>
      <Canvas ground="container" label="Text roles on the container">
        <TextLines />
      </Canvas>
    </>
  );
}

/** Ink and primary, and the primary's hover, at 120px, with how far apart ink and primary are. */
export function NavyPair() {
  const ink = tok("color-ink");
  const primary = tok("color-primary");
  const hover = tok("color-primary-hover");
  const apart = contrastRatio(ink.value, primary.value);
  return (
    <Canvas ground="page" layout="stack" label="The two navies">
      <div className={s["ds-col-pair"]}>
        {[
          { t: ink, use: "type" },
          { t: primary, use: "fills" },
          { t: hover, use: "fill on hover" },
        ].map(({ t, use }) => (
          <Item key={t.name} label={`${t.name} · ${use} · ${t.value}`}>
            <span className={s["ds-col-square"]} style={tint(cssVar(t.name))} aria-hidden="true" />
          </Item>
        ))}
      </div>
      <Label>
        {ink.name} to {primary.name}: {apart === null ? "unreadable" : `${formatRatio(apart)}:1`}, too close for the eye to tell apart
      </Label>
    </Canvas>
  );
}

/** The accent where it may sit on a light ground: a display word, a live dot, the caret's glow. Its glows
 *  on the blue sit on the accent water, where they ship. */
export function AccentUse() {
  const glows = ["color-accent-glow-28", "color-accent-glow-08"].map(tok);
  const light = ["color-accent", "color-accent-glow-55", "color-accent-glow-50", "color-accent-glow-30"].map(tok);
  return (
    <>
      <Canvas ground="page" layout="stack" label="The accent on the page">
        <p style={{ ...typeStyle("h2"), margin: 0, color: cssVar("color-ink"), textAlign: "center" }}>
          {FAQ_HEAD.lead}
          <span style={{ color: cssVar("color-accent") }}>{FAQ_HEAD.accent}</span>
        </p>
        <Strip
          label="Accent and its glows on the page"
          items={itemsOf(light, (t) => (t.name === "color-accent" ? "text" : "dot"), { caption: (t) => t.role })}
        />
        <Item label="StatusDot · live ping · color-accent-ping">
          <StatusDot motion="ping" />
        </Item>
      </Canvas>
      <Canvas ground="on-blue" label="The players glow on the blue">
        <Strip label="Players glow" items={itemsOf(glows, "glow", { caption: (t) => t.role })} />
      </Canvas>
    </>
  );
}

/** Status on the system Badge on white, and the two on-dark icons on navy. */
export function StatusUse() {
  return (
    <>
      <Canvas ground="surface" label="Status badges on white">
        <Badge tone="success" dot>
          Passed
        </Badge>
        <Badge tone="warning" dot>
          Slow
        </Badge>
        <Badge tone="danger" dot>
          Failed
        </Badge>
        <span style={{ ...typeStyle("caption"), color: cssVar("color-danger-ink") }}>This field is required</span>
      </Canvas>
      <Canvas ground="navy" label="Status icons on navy">
        <Item label={cssName(tok("color-success-on-dark"))}>
          <CircleCheck size={20} strokeWidth={1.75} color={cssVar("color-success-on-dark")} aria-hidden="true" />
        </Item>
        <Item label={cssName(tok("color-danger-on-dark"))}>
          <CircleX size={20} strokeWidth={1.75} color={cssVar("color-danger-on-dark")} aria-hidden="true" />
        </Item>
      </Canvas>
    </>
  );
}
