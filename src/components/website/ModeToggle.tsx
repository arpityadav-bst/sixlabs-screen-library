"use client";

// Human / AI switch in the players section (Players.tsx): which copy of the player the portrait shows,
// the real person or their AI model. A pill on the accent blue; the white thumb slides to the choice.
import { motion } from "motion/react";

export type Mode = "human" | "ai";

const OPTIONS: { id: Mode; label: string }[] = [
  { id: "human", label: "Human" },
  { id: "ai", label: "AI" },
];

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Show the human or their AI copy"
      className="inline-flex rounded-full bg-white/15 p-1 ring-1 ring-inset ring-white/25"
    >
      {OPTIONS.map((o) => {
        const on = o.id === mode;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={
              "relative w-28 rounded-full py-2 text-center font-sans text-[14px] font-medium transition-colors duration-200 " +
              (on ? "text-[#0a1b33]" : "text-white/80 hover:text-white")
            }
          >
            {on && (
              <motion.span
                layoutId="mode-thumb"
                className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_-8px_rgba(10,27,51,0.45)]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
