"use client";

// The players section's other clips (Players.tsx), fetched ahead: once the section is near, and after a
// pause that leaves the shown player's own clips the line, the other players' clips (the human and the AI
// copy of each, in the files this browser plays) download one at a time at low priority, so switching player
// plays at once instead of waiting seconds for its clips. Every player on a desktop; on a touch screen only
// the ones either side of the shown one (the carousel's next swipe), to spare mobile data. A clip is fetched
// once a visit.
import { useEffect } from "react";
import { PLAYERS } from "./players-data";
import type { ClipFormat } from "./useClipFormat";

const WAIT_MS = 2500;
const fetched = new Set<string>();

export function usePrefetchClips(
  near: boolean,
  active: number,
  format: ClipFormat,
) {
  useEffect(() => {
    if (!near || format === "still") return;
    let stop = false;
    const touch = window.matchMedia("(hover: none)").matches;
    const urls = PLAYERS.flatMap((p, k) => {
      if (k === active || (touch && Math.abs(k - active) !== 1)) return [];
      return [p.video, p.aiVideo].flatMap((c) =>
        c ? [format === "stacked" ? c.stacked : c.src] : [],
      );
    });
    const timer = window.setTimeout(async () => {
      for (const u of urls) {
        if (stop) return;
        if (fetched.has(u)) continue;
        fetched.add(u);
        try {
          await (await fetch(u, { priority: "low" } as RequestInit)).blob();
        } catch {
          fetched.delete(u); // a later visit to the section tries again
        }
      }
    }, WAIT_MS);
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [near, active, format]);
}
