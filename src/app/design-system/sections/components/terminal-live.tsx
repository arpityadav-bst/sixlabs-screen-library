"use client";

// The terminal's live specimens. A run never restarts, so a fresh one is a remount: Reset remounts the
// controls and the windows back to idle. Each job keeps its own window once picked, shown while it is the
// pick and hidden after, so a pick never mounts a second glyph field for the same job (the field keeps its
// observers and listener for good, JobTerminal.tsx:62). A job picked while Run is on plays at once.
import { Play } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { JobTerminal } from "@/components/website/JobTerminal";
import { JOBS, type Step } from "@/components/website/jobs-data";
import { Button } from "@/components/design-system/Button";
import { Segmented } from "@/components/design-system/Segmented";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Label } from "@/app/design-system/_kit/Label";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { runLanes, runSeconds } from "./terminal-data";

/** a job card's inner width below xl, where the card is at most 560 */
const CARD: CSSProperties = { width: 480, maxWidth: "100%" };
/** clear of the Reset button at the canvas top-right */
const BAR: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, paddingRight: 64, ...CARD };

type JobId = (typeof JOBS)[number]["id"];
const OPTIONS = JOBS.map((j) => ({ id: j.id as JobId, label: j.title }));

/** Pick a job and Run it, with the run's timeline under the window. Reset puts it back to idle. */
export function TerminalDemo() {
  const [id, setId] = useState<JobId>(JOBS[0].id);
  const job = JOBS.find((j) => j.id === id) ?? JOBS[0];
  return (
    <>
      <Canvas ground="surface" layout="stack" label="Job terminal">
        <Replay label="Reset">
          <RunBox id={id} onPick={setId} />
        </Replay>
        <Label>
          {job.title} · {job.run.length} steps · {runSeconds(job.run).toFixed(2)}s from play to done
        </Label>
      </Canvas>
      <Timeline label={`${job.title} run, step by step`} axisLabel="from play" lanes={runLanes(job.run)} />
    </>
  );
}

const runOf = (id: JobId) => (JOBS.find((j) => j.id === id) ?? JOBS[0]).run;

function RunBox({ id, onPick }: { id: JobId; onPick: (id: JobId) => void }) {
  const [play, setPlay] = useState(false);
  // the jobs picked so far, each with its one window, and the ones asked to play (asked stays asked, so a
  // window hidden mid-run finishes its run rather than freezing half typed)
  const [kept, setKept] = useState<readonly JobId[]>([id]);
  const [asked, setAsked] = useState<ReadonlySet<JobId>>(() => new Set());
  const ask = (k: JobId) => setAsked((s) => new Set(s).add(k));
  const pick = (next: JobId) => {
    setKept((k) => (k.includes(next) ? k : [...k, next]));
    if (play) ask(next);
    onPick(next);
  };
  return (
    <>
      <div style={BAR}>
        <Segmented options={OPTIONS} value={id} onChange={pick} label="Job" size="sm" />
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={Play}
          disabled={play}
          onClick={() => {
            setPlay(true);
            ask(id);
          }}
        >
          Run
        </Button>
      </div>
      <div style={CARD}>
        {kept.map((k) => (
          <div key={k} hidden={k !== id}>
            <JobTerminal run={runOf(k)} play={asked.has(k)} />
          </div>
        ))}
      </div>
    </>
  );
}

/** A terminal asked to play from mount, so it is done by the time it is read. */
export function Played({ run }: { run: Step[] }) {
  return (
    <div style={CARD}>
      <JobTerminal run={run} play />
    </div>
  );
}

/** A terminal left waiting. */
export function Idle({ run }: { run: Step[] }) {
  return (
    <div style={CARD}>
      <JobTerminal run={run} play={false} />
    </div>
  );
}
