"use client";

// The live page-level states. The jobs row swaps three skeleton composites for the system Card that stands
// in for the job card (the site's own card is not a part it exports, and its frame is under Card), carrying
// the shipped copy, run and tag icons, so the row is seen to hold its height. The offline view runs a real
// Retry that turns busy and comes back, and the failed row's Try again does the same, as a retry that fails
// again would.
import { useEffect, useRef, useState } from "react";
import { Banner } from "@/components/design-system/Banner";
import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { EmptyState } from "@/components/design-system/EmptyState";
import { SectionHead } from "@/components/design-system/SectionHead";
import { Switch } from "@/components/design-system/Switch";
import { TagList } from "@/components/design-system/Tag";
import { JobTerminal } from "@/components/website/JobTerminal";
import { JOBS } from "@/components/website/jobs-data";
import { tagsOf } from "../components/badge-tag-data";
import { JobCardSkeleton } from "../components/loading-composites";
import { FAILED, OFFLINE } from "./system-states-data";
import s from "./system-states.module.css";

const RETRY_MS = 1200;

function useBusy() {
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const run = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => setBusy(false), RETRY_MS);
  };
  return [busy, run] as const;
}

function JobCard({ k }: { k: number }) {
  const j = JOBS[k];
  return (
    <Card tone="surface" size="feature" sheen className={s["ds-ss-card"]}>
      <CardTitle as="h4">{j.title}</CardTitle>
      <CardBody>{j.body}</CardBody>
      <div className={s["ds-ss-terminal"]}>
        <JobTerminal run={j.run} play={false} />
      </div>
      <TagList items={tagsOf(j)} label={`${j.title} tags`} className={s["ds-ss-tags"]} />
    </Card>
  );
}

export function JobsRowLoading() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={s["ds-ss-stack"]}>
      <Switch label="Loaded" checked={loaded} onChange={setLoaded} />
      <div className={s["ds-ss-row"]} aria-live="polite">
        {JOBS.map((j, k) => (loaded ? <JobCard key={j.id} k={k} /> : <JobCardSkeleton key={j.id} />))}
      </div>
    </div>
  );
}

/** The offline banner above the view it is about, and the row that failed, in place of its cards. */
export function OfflineView() {
  const [retrying, retry] = useBusy();
  const [trying, tryAgain] = useBusy();
  return (
    <div data-pin="banner" className={s["ds-ss-stack"]}>
      <Banner tone="offline" title={OFFLINE.title} body={OFFLINE.body} action={{ label: OFFLINE.retry, onClick: retry, loading: retrying }} />
      <SectionHead as="h3" title="One model." accent="Three jobs." sub="Everything comes from the model of your players." />
      <EmptyState
        variant="error"
        contained
        headingLevel={4}
        title={FAILED.title}
        body={FAILED.body}
        primaryAction={
          <Button variant="secondary" loading={trying} onClick={tryAgain}>
            {FAILED.retry}
          </Button>
        }
      />
    </div>
  );
}

/** The banner's live cell: Retry runs, the close hides it, and the kit button brings it back. */
export function LiveBanner({ part }: { part: "action" | "close" }) {
  const [retrying, retry] = useBusy();
  const [gone, setGone] = useState(false);
  if (gone)
    return (
      <button type="button" className="ds-btn ds-btn--line" onClick={() => setGone(false)}>
        Show it again
      </button>
    );
  return (
    <Banner
      tone="offline"
      title={OFFLINE.title}
      action={{ label: OFFLINE.retry, onClick: retry, loading: retrying }}
      dismissible={part === "close"}
      onDismiss={() => setGone(true)}
    />
  );
}
