"use client";

// The page's measuring switches (perf.ts): ?off=… and the ?perf readout, set up once on every website page.
import { useEffect } from "react";
import { applyOff, perfReadout } from "./perf";

export function PerfBoot() {
  useEffect(() => {
    applyOff();
    perfReadout();
  }, []);
  return null;
}
