"use client";

// The selected player's trait bars in the players section (Players.tsx): a label and a white bar filled to
// the trait's value, on the accent blue. The bars slide to the new values when another player is picked.
import { motion } from "motion/react";
import type { Player } from "./players-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function PlayerTraits({
  traits,
  className = "",
  dense,
}: {
  traits: Player["traits"];
  className?: string;
  dense?: boolean; // the phone carousel's (PlayerCarousel.tsx): tighter rows, smaller labels
}) {
  return (
    <dl
      className={
        "max-w-[440px] " + (dense ? "space-y-2.5 " : "space-y-4 ") + className
      }
    >
      {traits.map((t) => (
        <div
          key={t.label}
          className={
            "grid items-center " +
            (dense
              ? "grid-cols-[124px_1fr] gap-3"
              : "grid-cols-[130px_1fr] gap-4")
          }
        >
          <dt
            className={
              "font-sans text-white/75 " +
              (dense ? "text-[13px]" : "text-[14px]")
            }
          >
            {t.label}
          </dt>
          <dd className="h-1.5 rounded-full bg-white/20">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={false}
              animate={{ width: `${t.value * 100}%` }}
              transition={{ duration: 0.7, ease }}
            />
          </dd>
        </div>
      ))}
    </dl>
  );
}
