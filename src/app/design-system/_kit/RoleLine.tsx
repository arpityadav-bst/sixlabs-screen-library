"use client";

// One sentence of why a part looks the way it does, 25 words at most. In development it warns when the
// line runs long or when the same sentence already sits elsewhere on the page.
import { useRef, type ReactNode } from "react";
import { useProseCheck } from "./prose-check";

export function RoleLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useProseCheck(ref, "role");
  return (
    <p ref={ref} className="ds-role">
      {children}
    </p>
  );
}
