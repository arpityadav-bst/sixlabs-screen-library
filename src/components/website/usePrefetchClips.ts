"use client";

// The players section's clips (Players.tsx), fetched ahead, one at a time at low priority, each after a pause
// that leaves the line to what is on screen. Once the hero's floor is in (warm), the shown player's own clips
// (the human and the AI copy, in the files this browser plays), so a first visit finds them already in the
// browser's cache when it reaches the section, as a reload does. Once the section is near, the other players'
// clips, so switching player plays at once instead of waiting seconds for its clips. Every player on a desktop;
// on a touch screen only the ones either side of the shown one (the carousel's next swipe), and nothing ahead
// of the section, to spare mobile data. A clip is fetched once a visit.
import { useEffect } from "react";
import { PLAYERS } from "./players-data";
import type { ClipFormat } from "./useClipFormat";

const WAIT_MS = 2500;
const fetched = new Set<string>();

export function usePrefetchClips(
  near: boolean,
  warm: boolean,
  active: number,
  format: ClipFormat,
) {
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    if (!(near || (warm && !touch)) || format === "still") return;
    let stop = false;
    const clipsOf = (k: number) =>
      [PLAYERS[k].video, PLAYERS[k].aiVideo].flatMap((c) =>
        c ? [format === "stacked" ? c.stacked : c.src] : [],
      );
    const urls = near
      ? PLAYERS.flatMap((_, k) =>
          k === active || (touch && Math.abs(k - active) !== 1) ? [] : clipsOf(k),
        )
      : clipsOf(active);
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
  }, [near, warm, active, format]);
}
