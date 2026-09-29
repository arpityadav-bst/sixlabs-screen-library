"use client";

// Page background darkens as the page moves from the scroll line to the players: 7% darker than the white,
// eased in from the middle of the scroll line (#model-line, half way through its track) to the moment the
// players section (#players) reaches the top of the view, and back again on the way up.
import { useEffect } from "react";

const FROM = [249, 250, 251]; // #f9fafb
const TO = FROM.map((c) => Math.round(c * 0.93)); // 7% darker

export function BackdropShade() {
  useEffect(() => {
    const line = document.getElementById("model-line"),
      players = document.getElementById("players");
    if (!line || !players) return;
    let queued = false;
    const paint = () => {
      queued = false;
      const y = window.scrollY,
        vh = window.innerHeight;
      const lineTop = line.getBoundingClientRect().top + y;
      const start = lineTop + (line.offsetHeight - vh) * 0.5;
      const end = players.getBoundingClientRect().top + y;
      const t = Math.min(
        1,
        Math.max(0, (y - start) / Math.max(1, end - start)),
      );
      document.body.style.backgroundColor = `rgb(${FROM.map((c, k) => Math.round(c + (TO[k] - c) * t)).join(",")})`;
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.body.style.backgroundColor = "";
    };
  }, []);
  return null;
}
