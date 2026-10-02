"use client";

// The shipped FAQ as its specimen: the real section, its 128px foot padding cropped, with its first
// question opened once on mount (as a visitor's click would), so the answer's parts can be pinned. The ref
// keeps a development double mount from closing it again.
import { useEffect, useRef, type CSSProperties } from "react";
import { Faq } from "@/components/website/Faq";

/** the section's pb-32 (Faq.tsx:18) */
const FOOT = 128;
const CROP: CSSProperties = { display: "flow-root", overflow: "clip" };

export function FaqOpenFirst() {
  const box = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    box.current?.querySelector<HTMLButtonElement>('li button[aria-expanded="false"]')?.click();
  }, []);
  return (
    <div ref={box} style={CROP}>
      <div style={{ marginBottom: -FOOT }}>
        <Faq />
      </div>
    </div>
  );
}
