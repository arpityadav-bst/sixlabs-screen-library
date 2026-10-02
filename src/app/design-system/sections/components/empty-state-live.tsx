"use client";

// The live cell of the empty state's grid: the real Retry, which turns busy for 1.2s and comes back, as a
// retry that fails again would. The copy comes from the section's data.
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/design-system/Button";
import { EmptyState, type EmptyStateVariant } from "@/components/design-system/EmptyState";
import { EMPTY_COPY } from "./empty-state-data";

const RETRY_MS = 1200;

export function RetryEmpty({ variant }: { variant: EmptyStateVariant }) {
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const c = EMPTY_COPY[variant];
  const retry = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => setBusy(false), RETRY_MS);
  };
  return (
    <EmptyState
      variant={variant}
      title={c.title}
      body={c.body}
      headingLevel={4}
      primaryAction={
        <Button variant={c.primary.variant} loading={busy} onClick={retry}>
          {c.primary.label}
        </Button>
      }
    />
  );
}
