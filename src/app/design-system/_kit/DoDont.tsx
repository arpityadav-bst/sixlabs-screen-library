// A decision taught as a pair: two real specimens side by side (stacked under md), a 2px rule on each,
// then the verdict and a one-line reason. A Don't panel is the one place outside a players ground where
// the guide may show an accent fill, and reviewers exempt it.
import { CircleCheck, CircleX } from "lucide-react";
import type { ReactNode } from "react";
import { Canvas, type CanvasLayout, type Ground } from "./Canvas";

export type DoDontPanelProps = {
  /** one line, the reason rather than an adjective */
  reason: ReactNode;
  ground?: Ground;
  layout?: CanvasLayout;
  tall?: boolean;
  isolateKeys?: boolean;
  children: ReactNode;
};

export function DoDont({ children }: { children: ReactNode }) {
  return <div className="ds-dd">{children}</div>;
}

function Panel({ kind, reason, ground = "page", layout = "flow", tall, isolateKeys, children }: DoDontPanelProps & { kind: "do" | "dont" }) {
  const Icon = kind === "do" ? CircleCheck : CircleX;
  return (
    <figure className={`ds-dd-panel ds-dd-panel--${kind}`}>
      <div className="ds-dd-rule" aria-hidden="true" />
      <Canvas ground={ground} layout={layout} tall={tall} isolateKeys={isolateKeys}>
        {children}
      </Canvas>
      <figcaption className="ds-dd-cap">
        <span className="ds-dd-verdict">
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          {kind === "do" ? "Do" : "Don't"}
        </span>
        <p className="ds-dd-reason">{reason}</p>
      </figcaption>
    </figure>
  );
}

export function Do(props: DoDontPanelProps) {
  return <Panel kind="do" {...props} />;
}

export function Dont(props: DoDontPanelProps) {
  return <Panel kind="dont" {...props} />;
}
