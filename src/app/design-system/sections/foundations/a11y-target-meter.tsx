"use client";

// Measures a real part's hit box where it ships and draws, centred on it, the 24px minimum (dotted) and
// the 44px touch size (dashed) at true scale, with the part's own box solid. The caption prints the
// measured size and how far it falls short. The overlay sits beside the specimen, outside the observed
// subtree, so drawing it never triggers another measure. Pass a module-level targets array. On a ground
// where a 12px caption cannot reach 4.5:1 (the blue, the container), pass onLines and print the lines
// under the canvas with TargetLines instead.
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { TARGET_MIN, TARGET_TOUCH, type Target } from "./accessibility-data";
import styles from "./accessibility.module.css";

type Box = { x: number; y: number; w: number; h: number };

const square = (b: Box, size: number): CSSProperties => ({
  left: b.x + b.w / 2 - size / 2,
  top: b.y + b.h / 2 - size / 2,
  width: size,
  height: size,
});

function verdict(b: Box | null | undefined): string {
  if (!b) return "…";
  const w = Math.round(b.w);
  const h = Math.round(b.h);
  const m = Math.min(w, h);
  const size = `${w} × ${h}`;
  if (m >= TARGET_TOUCH) return `${size} · meets ${TARGET_TOUCH}`;
  if (m >= TARGET_MIN) return `${size} · meets ${TARGET_MIN} · ${TARGET_TOUCH - m} short of ${TARGET_TOUCH}`;
  return `${size} · ${TARGET_MIN - m} short of ${TARGET_MIN}`;
}

/** The verdict lines, set under a canvas in the panel's own ink. */
export function TargetLines({ lines }: { lines: readonly string[] }) {
  return (
    <div className={`ds-spec-caption ${styles["ds-target-lines"]}`}>
      {lines.map((l) => (
        <p key={l.split(" · ")[0]}>{l}</p>
      ))}
    </div>
  );
}

export function TargetMeter({
  targets,
  block = false,
  onLines,
  children,
}: {
  targets: readonly Target[];
  /** full width, for a part that fills its row (the carousel) */
  block?: boolean;
  /** takes the verdict lines instead of printing them inside the canvas. Pass a stable setter */
  onLines?: (lines: readonly string[]) => void;
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<(Box | null)[]>([]);
  const lines = targets.map((t, i) => `${t.name} · ${verdict(boxes[i])}`);
  const said = lines.join("\n");

  useEffect(() => {
    onLines?.(said.split("\n"));
  }, [onLines, said]);

  useEffect(() => {
    const s = stage.current;
    const c = content.current;
    if (!s || !c) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const o = s.getBoundingClientRect();
        setBoxes(
          targets.map((t) => {
            const el = c.querySelectorAll(t.select)[t.index ?? 0];
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
          }),
        );
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    const mo = new MutationObserver(measure);
    mo.observe(c, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-current"] });
    c.addEventListener("transitionend", measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      c.removeEventListener("transitionend", measure);
      window.removeEventListener("resize", measure);
    };
  }, [targets]);

  return (
    <figure className={block ? `${styles["ds-target"]} ${styles["ds-target--block"]}` : styles["ds-target"]}>
      <div ref={stage} className={styles["ds-target-stage"]}>
        <div ref={content}>{children}</div>
        <div aria-hidden="true" className={styles["ds-target-overlay"]}>
          {boxes.map(
            (b, i) =>
              b && (
                <Fragment key={i}>
                  <span className={styles["ds-target-part"]} style={{ left: b.x, top: b.y, width: b.w, height: b.h }} />
                  <span className={styles["ds-target-min"]} style={square(b, TARGET_MIN)} />
                  <span className={styles["ds-target-touch"]} style={square(b, TARGET_TOUCH)} />
                </Fragment>
              ),
          )}
        </div>
      </div>
      {!onLines && (
        <figcaption>
          {lines.map((l, i) => (
            <p key={targets[i].name} className="ds-label">
              {l}
            </p>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
