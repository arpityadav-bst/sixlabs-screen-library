// A row of buttons at a 12px gap, primary last so it sits on the right where the eye ends. Under 400px the
// row stacks at full width and reverses, so the primary lands on top under the thumb.
import type { ReactNode } from "react";

const ALIGN = { start: "justify-start", end: "justify-end", between: "justify-between" } as const;

export function ButtonGroup({
  align = "end",
  children,
  className = "",
}: {
  align?: keyof typeof ALIGN;
  /** buttons in reading order, the primary last */
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      className={
        "flex flex-wrap items-center gap-3 max-[400px]:flex-col-reverse max-[400px]:items-stretch " +
        `max-[400px]:*:w-full ${ALIGN[align]} ${className}`
      }
    >
      {children}
    </div>
  );
}
