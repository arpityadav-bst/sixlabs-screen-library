// A frame that promises a live hand must be one. A ViewportPreview is inert unless it is marked `interactive`,
// so a spec whose note invites the reader to hover, tap, Tab or try it live, or a state grid's live column
// (its caption says "hover or Tab here" unless it is given another), must not wrap an inert one. Read from the
// sections' source at build, as JSX text: a tag runs to its first `>` outside braces and double or back
// quotes. Server only.
import { filesDeep, lineAt, readRepo } from "../_kit/source";

const SECTIONS_DIR = "src/app/design-system/sections";
/** Words that invite a hand: hover, tap, the Tab key, a live column or cell, trying it live. A bare "live"
 *  means running here as often as operable ("pauses while this one is live"), so it alone promises nothing. */
const PROMISES = [
  /\bhover/i,
  /\btaps?\b/i,
  /\bTab\b/,
  /\btab (through|into|to)\b/i,
  /\blive (column|cell)\b/i,
  /\b(try|use|operate|drive|play with)\b[^.]{0,24}\blive\b/i,
];
const promises = (v: string) => PROMISES.some((re) => re.test(v));
const DEFAULT_LIVE_CAPTION = "hover or Tab here";

/** The index of the `>` that ends the tag opening at `start`, skipping braces and quoted strings. */
function tagEnd(text: string, start: number): number {
  let depth = 0;
  let quote = "";
  for (let i = start + 1; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote && text[i - 1] !== "\\") quote = "";
    } else if (c === '"' || c === "`") quote = c; // an apostrophe is JSX text far more often than a quote
    else if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) return i;
  }
  return text.length;
}

/** A prop's written value in a tag: the quoted text, or the braced expression with its braces. */
function propValue(tag: string, name: string): string | undefined {
  const m = new RegExp(`\\b${name}=`).exec(tag);
  if (!m) return undefined;
  const from = m.index + m[0].length;
  if (tag[from] === '"') return tag.slice(from + 1, tag.indexOf('"', from + 1));
  if (tag[from] !== "{") return undefined;
  let depth = 0;
  for (let i = from; i < tag.length; i++) {
    if (tag[i] === "{") depth++;
    else if (tag[i] === "}" && --depth === 0) return tag.slice(from, i + 1);
  }
  return undefined;
}

/** The last opening of a tag before `at`, or -1. */
function lastOpen(text: string, name: string, at: number): number {
  const re = new RegExp(`<${name}[\\s>]`, "g");
  let found = -1;
  for (let m = re.exec(text); m && m.index < at; m = re.exec(text)) found = m.index;
  return found;
}

/** Words of a prop's value, its markup and code dropped. */
const words = (v: string) => v.replace(/<[^>]*>/g, " ").replace(/[{}()"'`]/g, " ");

export function liveProblems(): string[] {
  const out: string[] = [];
  for (const file of filesDeep(SECTIONS_DIR, /\.tsx$/)) {
    const text = readRepo(file) ?? "";
    for (const m of text.matchAll(/<ViewportPreview[\s>]/g)) {
      const at = m.index ?? 0;
      const tag = text.slice(at, tagEnd(text, at) + 1);
      if (/\binteractive\b(?!=\{false\})/.test(tag)) continue;
      const where = `${file.replace(`${SECTIONS_DIR}/`, "")}:${lineAt(text, at)}`;
      const spec = lastOpen(text, "Spec", at);
      if (spec >= 0) {
        const end = tagEnd(text, spec);
        const note = propValue(text.slice(spec, end + 1), "note");
        const inside = end < at && !text.slice(end, at).includes("</Spec>");
        if (inside && note && promises(words(note))) {
          out.push(`${where}: its spec's note promises a live hand over an inert ViewportPreview (give it interactive)`);
        }
      }
      const grid = lastOpen(text, "StateGrid", at);
      if (grid >= 0 && tagEnd(text, grid) > at) {
        const sg = text.slice(grid, tagEnd(text, grid) + 1);
        const caption = /\blive=\{false\}/.test(sg) ? undefined : (propValue(sg, "liveCaption") ?? DEFAULT_LIVE_CAPTION);
        if (caption && promises(words(caption))) {
          out.push(`${where}: a state grid's live column wraps an inert ViewportPreview (give it interactive)`);
        }
      }
    }
  }
  return out;
}
