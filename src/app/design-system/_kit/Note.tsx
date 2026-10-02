"use client";

// Note holds a fact the specimen cannot show. Warn is kept for real traps (the floor's global ShaderChunk
// patch, ClickLock, the R key), so it stays loud. Both sit just under the spec they qualify.
import { Info, TriangleAlert } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useProseCheck } from "./prose-check";

function Callout({ tone, children }: { tone: "note" | "warn"; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useProseCheck(ref, "note");
  const Icon = tone === "warn" ? TriangleAlert : Info;
  return (
    <div className={tone === "warn" ? "ds-note ds-note--warn" : "ds-note"} role="note">
      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      <div ref={ref}>{children}</div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <Callout tone="note">{children}</Callout>;
}

export function Warn({ children }: { children: ReactNode }) {
  return <Callout tone="warn">{children}</Callout>;
}
