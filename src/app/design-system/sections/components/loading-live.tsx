"use client";

// The swap from skeleton to content. The two layers share one grid cell and crossfade over 300ms, and each
// skeleton line sits in a box the height of the text line it stands for, so both layers measure the same.
// Both heights are read live and printed, which is the proof that nothing moves.
import { useEffect, useRef, useState } from "react";
import { Label } from "@/app/design-system/_kit/Label";
import { CardContext } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { Skeleton } from "@/components/design-system/Skeleton";
import { Switch } from "@/components/design-system/Switch";
import { JOBS } from "@/components/website/jobs-data";
import { SWAP_JOB } from "./loading-data";
import styles from "./overlays.module.css";

function useHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const v = e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
      setH(Math.round(v * 10) / 10);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, h] as const;
}

const fmt = (h: number | null) => (h === null ? "…" : h.toFixed(1));

/** a text line's box: 25 for the 20px title at 1.25, 19.6 for 14px body at 1.4 */
const FEATURE = { element: "article", size: "feature", selectable: false } as const;
const TITLE_BOX = "flex h-[25px] items-center";
const BODY_BOX = "flex h-[19.6px] items-center";

export function SkeletonSwap() {
  const [loaded, setLoaded] = useState(false);
  const [skRef, skH] = useHeight<HTMLDivElement>();
  const [ctRef, ctH] = useHeight<HTMLDivElement>();
  const job = JOBS[SWAP_JOB];
  return (
    <div className="flex flex-col items-center gap-5">
      <Switch label="Loaded" checked={loaded} onChange={setLoaded} />
      <div className={styles["ds-swap"]} aria-busy={!loaded}>
        <div ref={skRef} data-off={loaded || undefined} aria-hidden="true">
          <div className={TITLE_BOX}>
            <Skeleton shape="title" className="w-full" />
          </div>
          <div className="mt-[9px]">
            <div className={BODY_BOX}>
              <Skeleton className="w-full" />
            </div>
            <div className={BODY_BOX}>
              <Skeleton width="60%" className="w-full" />
            </div>
          </div>
        </div>
        <div ref={ctRef} data-off={!loaded || undefined} aria-hidden={!loaded} inert={!loaded}>
          {/* the job card's own title and body, at the feature size, the body held to two lines as Jobs.tsx:167 holds it */}
          <CardContext.Provider value={FEATURE}>
            <CardTitle as="span">{job.title}</CardTitle>
            <CardBody className="min-h-[2.8em]">{job.body}</CardBody>
          </CardContext.Provider>
        </div>
        {!loaded && <span className="sr-only">Loading</span>}
      </div>
      <Label>
        skeleton {fmt(skH)} · content {fmt(ctH)} · fade 300ms
      </Label>
    </div>
  );
}
