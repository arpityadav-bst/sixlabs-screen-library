"use client";

// The avatar as a button (a profile, a picker): a client leaf, because the press handler cannot come from
// a server file. The live cell counts its presses so a click shows it landed.
import { useState } from "react";
import { Avatar, type AvatarShape } from "@/components/design-system/Avatar";
import type { ForceState } from "@/components/design-system/force";

export function ClickableAvatar({
  name,
  src,
  shape = "circle",
  forceState,
}: {
  name: string;
  src?: string;
  shape?: AvatarShape;
  forceState?: ForceState;
}) {
  const [n, setN] = useState(0);
  return (
    <span className="inline-flex flex-col items-center gap-2">
      <Avatar name={name} src={src} shape={shape} size={48} status="online" forceState={forceState} onClick={() => setN((x) => x + 1)} />
      {forceState === undefined && (
        <span className="ds-label" aria-live="polite">
          {n === 0 ? "not pressed" : `pressed ${n}`}
        </span>
      )}
    </span>
  );
}
