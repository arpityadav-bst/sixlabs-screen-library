// The Accordion's state grids, its size ladder and the single or multiple choice. Split from accordion.tsx
// to keep each file short. Every cell is the real component, forced through its forceState prop.
import { Accordion, type AccordionForce, type AccordionVariant } from "@/components/design-system/Accordion";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Item } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid, type StateGridCell } from "@/app/design-system/_kit/StateGrid";
import { ACC_SIZES, ACC_STATES, FAQ_ITEMS, ONE, TWO, type AccState } from "./accordion-data";

export const SYS = { from: "@/components/design-system/Accordion", name: "Accordion" };

const FORCE: Record<AccState, AccordionForce | undefined> = {
  closed: undefined,
  hover: "hover",
  pressed: "pressed",
  "focus-visible": "focus-visible",
  open: "open",
  disabled: "disabled",
  loading: "loading",
};

// A flush cell holds two rows and forces the first, because a lone row is the last one, which drops its
// rule, so its hover and open lines would look like closed.
function cell(variant: AccordionVariant) {
  return function AccordionCell({ state }: StateGridCell<AccState, string>) {
    return state === "live" ? (
      <Accordion items={[ONE, TWO]} variant={variant} size="sm" />
    ) : (
      <Accordion items={variant === "flush" ? [ONE, TWO] : [ONE]} variant={variant} size="sm" forceState={FORCE[state]} />
    );
  };
}

const RUNG = { width: 300 };

export function AccordionStates() {
  return (
    <>
      <Spec
        title="Accordion states"
        source={SYS}
        props="forceState"
        role="Hover firms the line, a press tints the row and focus rings it, so no state moves a row except opening it."
        caption="cells at sm · the card on the page ground, flush on white with a second row, so the first keeps its rule"
      >
        <StateGrid label="Card accordion states" ground="page" states={ACC_STATES} minCell={230} render={cell("card")} />
        <StateGrid label="Flush accordion states" ground="surface" states={ACC_STATES} minCell={230} render={cell("flush")} />
      </Spec>

      <Spec
        title="Accordion sizes"
        source={SYS}
        props="size"
        role="The md size is the FAQ row itself, and sm and lg keep its proportions for a tighter panel or a roomier page."
        caption="trigger height · specs hold from md up, under md the md and lg rows take the FAQ's phone step"
      >
        <SizeLadder
          label="Accordion sizes"
          tolerance={0.06}
          sizes={ACC_SIZES.map((s) => ({
            name: s.name,
            spec: s.spec,
            select: "[data-acc-trigger]",
            node: (
              <div style={RUNG}>
                <Accordion items={[ONE]} size={s.name} />
              </div>
            ),
          }))}
        />
      </Spec>

      <Spec
        title="Single and multiple"
        source={SYS}
        props="type"
        role="Multiple keeps an answer open while the next is read, and single suits rows that are steps of one task."
      >
        <Canvas ground="page" layout="grid" label="Multiple and single accordions">
          <Item label="multiple · the FAQ's way" align="start">
            <Accordion items={FAQ_ITEMS.slice(0, 3)} />
          </Item>
          <Item label="single" align="start">
            <Accordion type="single" items={FAQ_ITEMS.slice(0, 3)} />
          </Item>
        </Canvas>
      </Spec>
    </>
  );
}
