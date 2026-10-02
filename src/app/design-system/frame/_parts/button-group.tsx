// Frame part "button-group": the system ButtonGroup on the page ground, so its under-400px stack is seen
// at the frame's own width (the stack answers the viewport, not the box it sits in).
import { Button } from "@/components/design-system/Button";
import { ButtonGroup } from "@/components/design-system/ButtonGroup";

export function ButtonGroupPart() {
  return (
    <div style={{ padding: 24, background: "var(--ds-color-page)", minHeight: "100vh" }}>
      <ButtonGroup>
        <Button variant="ghost">Cancel</Button>
        <Button variant="secondary">Sign in</Button>
        <Button>Try now</Button>
      </ButtonGroup>
    </div>
  );
}
