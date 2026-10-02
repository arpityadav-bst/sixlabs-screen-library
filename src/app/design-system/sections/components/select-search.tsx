// Select and search: picking from a list and searching, built on the header language menu's panel with
// its blur taken out. Both are system parts, shown like shipped ones.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { SEARCH_CODE, SEARCH_PROPS, SEARCH_VALUES, SELECT_CODE, SELECT_PROPS, SELECT_VALUES } from "./_data/select-search";
import { SearchAnatomy, SearchDoDont, SearchLadder, SearchLive, SearchStates, SelectLive } from "./search-specimens";
import { SelectAnatomy, SelectDoDont, SelectLadder, SelectStates } from "./select-specimens";

const SELECT = { from: "@/components/design-system/Select", name: "Select" };
const SEARCH = { from: "@/components/design-system/SearchField", name: "SearchField" };

export function SelectSearchSection() {
  return (
    <Section
      id="select-search"
      lead="A list that opens from a field, and a search that answers as you type. Both open the same solid white panel."
    >
      <Sub title="Select">
        <Spec
          level={4}
          title="Anatomy and row states"
          source={SELECT}
          chips={["SelectPanel"]}
          props="inline active"
          role="The panel is the language menu's, made solid, so a reader meets one list design across the header and the forms."
          drawer={{ values: SELECT_VALUES, props: SELECT_PROPS, code: SELECT_CODE }}
          note={
            <>
              The panel is the header&apos;s language menu (LanguageMenu.tsx:78) with its backdrop blur and blur
              transitions removed. The shipped menu is specced under Shell, in <SectionLink id="language-menu" />.
            </>
          }
        >
          <SelectAnatomy />
        </Spec>
        <Spec
          level={4}
          title="Trigger states"
          source={SELECT}
          props="forceState disabled readOnly error"
          role="The trigger is the text field's box, so a Select and an input in one form share every state."
        >
          <SelectStates />
        </Spec>
        <Spec level={4} title="Sizes" source={SELECT} props="size" role="The trigger takes the field heights, so it lines up with the inputs beside it.">
          <SelectLadder />
        </Spec>
        <Spec
          level={4}
          title="Live"
          source={SELECT}
          role="Focus stays on the trigger while arrows, letters, Enter and Escape drive the list."
        >
          <SelectLive />
        </Spec>
        <Spec
          level={4}
          title="Across widths"
          source={SELECT}
          props="native"
          role="Below 768 the trigger opens the phone's own picker, which is larger and easier to thumb."
          caption="375 · 1280"
        >
          <Canvas ground="container" layout="stack">
            <ViewportPreview part="select-native" title="Select and search at the frame's width" height={360} widths={[375, 1280]} width={375} />
          </Canvas>
        </Spec>
        <SelectDoDont />
      </Sub>
      <Sub title="Search">
        <Spec
          level={4}
          title="Anatomy"
          source={SEARCH}
          chips={["SelectPanel"]}
          role="A pill reads as search before it is read, and the results reuse the select panel with the match in 500 ink."
          drawer={{ values: SEARCH_VALUES, props: SEARCH_PROPS, code: SEARCH_CODE }}
          note="On this page the guide's own Jump field owns the / key, so the specimens show the chip without binding it."
        >
          <SearchAnatomy />
        </Spec>
        <Spec
          level={4}
          title="States"
          source={SEARCH}
          props="loading disabled forceState"
          role="The right edge carries the state: the shortcut chip while empty, a clear button once filled, a spinner while searching."
        >
          <SearchStates />
        </Spec>
        <Spec level={4} title="Sizes" source={SEARCH} props="size" role="Search runs a step shorter than the field ladder, because it sits in toolbars and headers.">
          <SearchLadder />
        </Spec>
        <Spec
          level={4}
          title="Live"
          source={SEARCH}
          props="value suggestions loading onSelect"
          role="Escape clears the query and closes the results, and focus stays in the field."
        >
          <SearchLive />
        </Spec>
        <SearchDoDont />
      </Sub>
    </Section>
  );
}
