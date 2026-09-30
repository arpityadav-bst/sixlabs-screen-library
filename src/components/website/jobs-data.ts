// The three jobs of "One model. Three jobs." (Jobs.tsx): each card's copy and tags, and the run its terminal
// plays (JobTerminal.tsx), step by step, as the agent doing that job. Every figure comes from the job's
// example on the current site; none is new.
//   cmd   a command, typed in after the prompt
//   load  a step with a progress bar that fills, then reads "done"
//   out   a plain line (tone: dim for narration, ink for a finding)
//   kv    a label and its value, the value in ink or the accent
//   check a line ticked off
//   bar   a share, as a bar against the largest share in its group (`of`)

export type Step =
  | { t: "cmd"; text: string }
  | { t: "load"; text: string; ms?: number }
  | { t: "out"; text: string; tone?: "dim" | "ink" }
  | { t: "kv"; k: string; v: string; accent?: boolean }
  | { t: "check"; text: string }
  | { t: "bar"; text: string; value: number; of: number; accent?: boolean };

export type Job = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  run: Step[];
};

export const JOBS: Job[] = [
  {
    id: "intelligence",
    title: "Intelligence",
    body: "Your KPIs show what happened. The model tells you why it happened.",
    tags: ["Why, not just what", "Evidence clips", "BI plug-in"],
    run: [
      { t: "cmd", text: 'ask "why are payments abandoned?"' },
      { t: "load", text: "reading 2,163 sessions" },
      { t: "kv", k: "why", v: "not cold feet", accent: true },
      { t: "out", text: "what they do next" },
      {
        t: "bar",
        text: "watch a rewarded ad",
        value: 13,
        of: 13,
        accent: true,
      },
      { t: "bar", text: "claim free rewards", value: 12, of: 13 },
      { t: "bar", text: "buy with in-game currency", value: 8, of: 13 },
      { t: "kv", k: "evidence", v: "3 clips · 02:07 05:41 09:15" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    body: "Play every new build the way your real players would, before launch.",
    tags: ["Functional", "Behavioral", "Large scale", "Localization"],
    run: [
      { t: "cmd", text: "run players --build 4.2.0" },
      { t: "out", text: "6 player models on the build" },
      { t: "check", text: "explorer" },
      { t: "check", text: "grinder" },
      { t: "check", text: "spender" },
      { t: "check", text: "newcomer" },
      { t: "check", text: "speedrunner" },
      { t: "check", text: "whale" },
      { t: "kv", k: "found", v: "3 defects · 2 friction points", accent: true },
      { t: "kv", k: "report", v: "ready · 11m" },
    ],
  },
  {
    id: "creation",
    title: "Game creation",
    body: "Read any game's loop and hooks from video, then check builds against it.",
    tags: ["Deconstruct", "Verify", "Observe"],
    run: [
      { t: "cmd", text: "read reference-game.mp4" },
      { t: "load", text: "watching the video" },
      { t: "check", text: "core loop" },
      { t: "check", text: "economy" },
      { t: "check", text: "monetization" },
      { t: "check", text: "retention hooks" },
      { t: "out", text: "spec written", tone: "ink" },
      { t: "cmd", text: "check build 4.2.0 --against spec" },
      { t: "load", text: "new build vs spec", ms: 900 },
      { t: "kv", k: "matched", v: "12 / 14" },
      { t: "kv", k: "flagged", v: "2 gaps", accent: true },
    ],
  },
];
