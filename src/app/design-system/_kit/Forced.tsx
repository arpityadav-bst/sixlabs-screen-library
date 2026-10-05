// A picture of a state, for a forced specimen outside a StateGrid (a focus ring in Foundations, a field shown
// focused on a card, a tooltip held open in an Anatomy). It is the box a forced StateGrid cell uses: the part
// sits in a wrapper carrying data-ds-state="<state>" and inert, so it is out of the tab order and deaf to the
// pointer and never fights the real state, with a screen-reader line outside the inert box ("email field,
// focus") so a reader hears what the picture shows. The part still takes its forceState prop as before.
// The box is display: contents by default, so wrapping a specimen never moves it, and the reader line is
// visually hidden and out of flow, so a flex or grid parent keeps its slots. Use as="span" inside phrasing
// content, such as an Anatomy pin. Holds no state, so it works in server and client sections alike.
import type { ReactNode } from "react";

export type ForcedProps = {
  /** the state the picture shows, read to a screen reader and set as data-ds-state */
  state: string;
  /** what the part is, read before the state ("primary" gives "primary, hover") */
  label?: string;
  /** the box's element: div by default, span inside phrasing content */
  as?: "div" | "span";
  /** the box's class: ds-forced (display: contents) by default, ds-sg-cell in a StateGrid */
  className?: string;
  children: ReactNode;
};

export function Forced({ state, label, as: Box = "div", className = "ds-forced", children }: ForcedProps) {
  return (
    <>
      <span className="ds-sr">{label ? `${label}, ${state}` : state}</span>
      <Box className={className} data-ds-state={state} inert>
        {children}
      </Box>
    </>
  );
}
