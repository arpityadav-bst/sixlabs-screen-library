// "Skip to content": the first stop on the Tab path, so a keyboard visitor passes the header in one
// press. It is the primary sm Button, invisible and deaf to the pointer until it holds focus, then shown
// at once (no transition) fixed 16px from the top left at z 70, above the header's z 40. A forced state
// (focus, hover, pressed) shows it too, for the StateGrid. inline keeps it in the flow, for the guide's
// cells. No hooks of its own, so a server section can render it.
import { Button } from "./Button";
import type { ForceState } from "./force";

export type SkipLinkProps = {
  /** the id of the page's main landmark, with its hash */
  href?: string;
  children?: string;
  /** rest hides it, focus, hover and pressed show it */
  forceState?: ForceState;
  /** in the flow instead of fixed to the corner, for docs */
  inline?: boolean;
  className?: string;
};

const PIN = "fixed left-4 top-4 z-(--ds-z-tooltip)";
const REVEAL =
  "opacity-0 pointer-events-none focus-within:opacity-100 focus-within:pointer-events-auto " +
  "has-[[data-force]]:opacity-100 has-[[data-force]]:pointer-events-auto";

export function SkipLink({
  href = "#main",
  children = "Skip to content",
  forceState,
  inline = false,
  className = "",
}: SkipLinkProps) {
  return (
    <div data-skip-link="" className={`${inline ? "inline-flex" : PIN} ${REVEAL} ${className}`}>
      <Button variant="primary" size="sm" href={href} forceState={forceState}>
        {children}
      </Button>
    </div>
  );
}
