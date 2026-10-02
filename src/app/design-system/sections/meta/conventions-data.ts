// How the system and the guide are kept. The house conventions and the steps for adding a spec are written
// rules. The code rules that can be measured are measured here at build: the files over the line limit, any
// em dash in the guide, the system folder and the DESIGN.md partials, and any semicolon in the comments and
// JSX text of the guide, the system folder and the DESIGN.md build (meta-prose.ts).
import { filesDeep, readRepo } from "@/app/design-system/_kit/source";
import { semicolonFiles } from "./meta-prose";

export const HOUSE = [
  { key: "One token, one value", value: "A value gets one --ds-* name, with its role, use and misuse written beside it in tokens.ts." },
  { key: "Say it once", value: "Pictures live here and reasons in DESIGN.md, with the chip on each section pointing from one to the other." },
  { key: "Measure, do not transcribe", value: "Numbers here are read from the DOM or the source. A value that has to be written down gets an assertion." },
  { key: "Effects are ambience", value: "The floor, the water and the glyphs set the mood. No content and no control depends on one being live." },
  { key: "Nothing loops unattended", value: "A loop runs only while it is in view and stops under reduced motion. WebGL on this page lives in a HeavySlot." },
  { key: "Real parts only", value: "A shipped part is imported, never copied. A new part is built in the site's language and shown the same way." },
] as const;

export const ADD_STEPS = [
  { key: "1 · Catalog", value: "Add the section to its catalog file, with covers naming each part, its variants and the states it shows." },
  { key: "2 · Section file", value: "Create sections/<group>/<id>.tsx exporting <Id>Section and add it to sections/registry.tsx. Split siblings off before a file reaches 300 lines." },
  { key: "3 · Assertions", value: "Every value written down gets an Assertion, so Coverage fails the day the source stops saying it." },
  { key: "4 · Cost", value: "Anything with WebGL or an iframe mounts in a HeavySlot or a ViewportPreview that declares its cost." },
  { key: "5 · Ids", value: "A site id renders once, listed in the section's renders. #players, #model-line and #site-head never render here." },
  { key: "6 · DESIGN.md", value: "Write the chapter partial in docs/design-md with the reasons, never a copy of the guide's own lines." },
] as const;

export const ADD_CODE = `// _data/catalog-components.ts
{ id: "chip", title: "Chip", sub: "Selection", file: f("components/chip"), designMd: "7.6",
  covers: [sys("Chip", { variants: "filter choice input", states: "rest hover focus-visible pressed selected disabled" })] },

// sections/components/chip.tsx
export function ChipSection() {
  return <Section id="chip" lead="...">{/* Spec, Anatomy, StateGrid, SizeLadder, DoDont */}</Section>;
}`;

const LIMIT = 300;
const TREES = ["src/app/design-system", "src/components/design-system"];
const EM_DASH = String.fromCharCode(0x2014);

/** Code files of the guide and the system folder over the line limit. Markdown is exempt. */
export function overLimit(): { file: string; lines: number }[] {
  return TREES.flatMap((t) => filesDeep(t, /\.(tsx?|css)$/))
    .map((file) => ({ file, lines: (readRepo(file) ?? "").replace(/\n$/, "").split("\n").length }))
    .filter((f) => f.lines > LIMIT);
}

/** Files holding an em dash, across the guide, the system folder and the DESIGN.md partials. */
export function emDashFiles(): string[] {
  return [...TREES, "docs/design-md"]
    .flatMap((t) => filesDeep(t, /\.(tsx?|css|md)$/))
    .filter((f) => (readRepo(f) ?? "").includes(EM_DASH));
}

/** Where the prose rule is measured: the two trees and the script that builds DESIGN.md. */
const PROSE_TREES = [...TREES, "tools/design-md"];

export function codeRules() {
  const over = overLimit();
  const dashes = emDashFiles();
  const semis = semicolonFiles(PROSE_TREES);
  const scanned = [...TREES, "docs/design-md"].flatMap((t) => filesDeep(t, /\.(tsx?|css|md)$/)).length;
  return [
    { key: "ds- prefix", value: "Every guide class starts with ds- and every token prints as --ds-*, so nothing here restyles the site." },
    { key: "Compositor rule", value: "No backdrop-filter, mix-blend-mode, CSS mask, CSS filter or blur in new code. Light is drawn in canvas or WebGL." },
    {
      key: "Accent fill",
      value:
        "Accent blue fills only the accent water, the water specimen and Don't panels. Selected and checked fills are navy on every light ground, the container included. On the accent water the chosen state is white with ink, as ModeToggle ships it. Live dots on a light ground are an open owner call, under Decisions pending.",
      source: "decisions-data.ts, dots",
    },
    {
      key: `${LIMIT} lines`,
      value: over.length ? `${over.length} over: ${over.map((f) => `${f.file} (${f.lines})`).join(", ")}` : `No code file over ${LIMIT} lines, measured at build.`,
      source: TREES.join(", "),
    },
    {
      key: "No em dash",
      value: dashes.length ? `Found in ${dashes.join(", ")}` : `None in ${scanned} files, measured at build.`,
      source: [...TREES, "docs/design-md"].join(", "),
    },
    {
      key: "Prose punctuation",
      value: semis.files.length
        ? `Semicolons in the prose of ${semis.files.length} ${semis.files.length === 1 ? "file" : "files"}: ${semis.files.map((f) => `${f.file} (${f.n})`).join(", ")}`
        : `Comments and JSX text use commas, colons and full stops. No semicolon in ${semis.scanned} files, measured at build. Code keeps its own syntax.`,
      source: PROSE_TREES.join(", "),
    },
    { key: "Quoted copy", value: "Specimen text is quoted from the site's source or is obvious filler, never new marketing copy." },
  ];
}
