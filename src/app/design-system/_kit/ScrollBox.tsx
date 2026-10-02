"use client";

// The kit's sideways scroll box (a table, a state grid, a timeline, a code block). While its content is wider
// than the box, it takes a tab stop and is a named region, so a keyboard reader on a phone or at 400% zoom can
// reach the hidden columns with the arrow keys even when nothing inside is focusable. When it all fits it is a
// plain box again, so it never adds an empty stop. It takes the kit's focus ring (ds.css, [data-ds-scroll]).
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** True while the element's content is wider than the element, watched through its size and its children's. */
export function useOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [over, setOver] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setOver(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(read);
    ro.observe(el);
    for (const c of el.children) ro.observe(c);
    read();
    return () => ro.disconnect();
  }, []);
  return [ref, over] as const;
}

export function ScrollBox({
  as = "div",
  className,
  label,
  style,
  children,
}: {
  as?: "div" | "pre";
  className?: string;
  /** the region's name while it scrolls, from the box's caption ("Values", "Button states") */
  label: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [ref, over] = useOverflow<HTMLElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={style}
      data-ds-scroll=""
      tabIndex={over ? 0 : undefined}
      role={over ? "region" : undefined}
      aria-label={over ? label : undefined}
    >
      {children}
    </Tag>
  );
}
