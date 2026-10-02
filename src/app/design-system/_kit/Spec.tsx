// The specimen primitive. It reads in three layers: glance (the canvas), read (one role line) and dig
// (the drawer). Slots in order: head (title, the identity chip, at most one fact chip, role line), the
// children (one or more Canvas), an optional caption row, the drawer, then a Note or Warn just under the
// panel. The props a spec varies and the chips past the first go in the drawer, which opens itself for them
// when the spec gives no drawer of its own. The head's chip is for a behaviour flag only (WebGL, pointer
// only, live, frame, read at build): a first chip that reads as a name (a token, a class, a file:line, a
// formula, so it holds --, :, / or =) teaches nothing at a glance, so it goes to the drawer with the rest,
// and in development the console names the spec, so its section can move it.
import type { ReactNode } from "react";
import { Note, Warn } from "./Note";
import { SpecDrawer, type SpecDrawerProps } from "./SpecDrawer";
import { SpecHead, type SpecSource } from "./SpecHead";

export type SpecProps = {
  title: string;
  source?: SpecSource;
  /** the props this spec varies, as one string ("variant size"), listed in the drawer */
  props?: string;
  /** the first shows in the head (a fact that changes how the specimen behaves), the rest in the drawer */
  chips?: readonly string[];
  /** one sentence of why, 25 words at most */
  role?: ReactNode;
  /** heading level of the title: 3 by default, 4 inside a Sub */
  level?: 3 | 4;
  /** a mono fact line under the canvases */
  caption?: ReactNode;
  drawer?: SpecDrawerProps;
  note?: ReactNode;
  warn?: ReactNode;
  /** an anchor for linking straight to this spec (never a site id) */
  id?: string;
  children?: ReactNode;
};

/** A name rather than a behaviour flag: a token, a class, a file:line, a constant or a formula. */
const NAMEY = /--|:|\/|=/;

export function Spec({ title, source, props, chips, role, level = 3, caption, drawer, note, warn, id, children }: SpecProps) {
  const first = chips?.[0];
  const flag = first !== undefined && !NAMEY.test(first) ? first : undefined;
  if (process.env.NODE_ENV !== "production" && first !== undefined && !flag) {
    console.warn(`[ds] Spec "${title}": its head chip "${first}" is a name, not a behaviour flag, so it shows in the drawer`);
  }
  const names = flag ? chips?.slice(1) : chips;
  const placed = props || (names && names.length > 0);
  return (
    <>
      <div className="ds-spec" id={id}>
        <SpecHead title={title} source={source} chip={flag} role={role} level={level} />
        {children}
        {caption && <p className="ds-spec-caption">{caption}</p>}
        {(drawer || placed) && <SpecDrawer {...drawer} varies={props} names={names} level={level} of={title} />}
      </div>
      {note && <Note>{note}</Note>}
      {warn && <Warn>{warn}</Warn>}
    </>
  );
}
