// Every data module of the guide, imported once so Coverage can walk what each one exports: the Assertions
// it holds and the Anatomy pins it lists. The list is checked against the folder at build (meta-pins.ts), so
// a new *-data.ts, *-pins.ts or _data file that is not added here fails Coverage instead of going unchecked.
// coverage-data is left out because it reads this report. The guide's shared specimen copy
// (_data/specimens.ts) sits beside sections/ and is keyed by its own path.
import * as accordion from "../components/accordion-data";
import * as avatar from "../components/avatar-data";
import * as badgeTag from "../components/badge-tag-data";
import * as button from "../components/button-data";
import * as card from "../components/card-data";
import * as carousel from "../components/carousel-data";
import * as chip from "../components/chip-data";
import * as comparison from "../components/comparison-data";
import * as dialog from "../components/dialog-data";
import * as emptyState from "../components/empty-state-data";
import * as iconButton from "../components/icon-button-data";
import * as loading from "../components/loading-data";
import * as progress from "../components/progress-data";
import * as sectionHead from "../components/section-head-data";
import * as segmented from "../components/segmented-data";
import * as statsTyped from "../components/stats-typed-data";
import * as tabs from "../components/tabs-data";
import * as terminal from "../components/terminal-data";
import * as textLink from "../components/text-link-data";
import * as toast from "../components/toast-data";
import * as tooltip from "../components/tooltip-data";
import * as choice from "../components/_data/choice";
import * as fields from "../components/_data/fields";
import * as selectSearch from "../components/_data/select-search";
import * as slider from "../components/_data/slider";
import * as accentWater from "../effects/accent-water-data";
import * as asciiField from "../effects/ascii-field-data";
import * as doodles from "../effects/doodles-data";
import * as families from "../effects/families-data";
import * as floorLifecycle from "../effects/floor-lifecycle-data";
import * as floorLifecyclePins from "../effects/floor-lifecycle-pins";
import * as floorParams from "../effects/floor-params-data";
import * as holograms from "../effects/holograms-data";
import * as layerStack from "../effects/layer-stack-data";
import * as perfRule from "../effects/perf-rule-data";
import * as portraitSweep from "../effects/portrait-sweep-data";
import * as scrollLine from "../effects/scroll-line-data";
import * as tileActivation from "../effects/tile-activation-data";
import * as tileFloor from "../effects/tile-floor-data";
import * as tileFloorPins from "../effects/tile-floor-pins";
import * as tileStates from "../effects/tile-states-data";
import * as accessibility from "../foundations/accessibility-data";
import * as colourContrast from "../foundations/colour-contrast-data";
import * as colourRoles from "../foundations/colour-roles-data";
import * as colourSpecial from "../foundations/colour-special-data";
import * as elevation from "../foundations/elevation-data";
import * as focus from "../foundations/focus-data";
import * as icons from "../foundations/icons-data";
import * as layout from "../foundations/layout-data";
import * as radius from "../foundations/radius-data";
import * as spacing from "../foundations/spacing-data";
import * as type from "../foundations/type-data";
import * as changelog from "./changelog-data";
import * as conventions from "./conventions-data";
import * as decisions from "./decisions-data";
import * as gaps from "./gaps-data";
import * as choreography from "../motion/_data/choreography";
import * as entrance from "../motion/_data/entrance";
import * as loops from "../motion/_data/loops";
import * as micro from "../motion/_data/micro";
import * as reduced from "../motion/_data/reduced";
import * as motionTokens from "../motion/_data/tokens";
import * as composition from "../patterns/composition-data";
import * as forms from "../patterns/forms-data";
import * as hero from "../patterns/hero-data";
import * as lightSections from "../patterns/light-sections-data";
import * as responsive from "../patterns/responsive-data";
import * as scrollPlayers from "../patterns/scroll-players-data";
import * as surfaces from "../patterns/surfaces-data";
import * as systemStates from "../patterns/system-states-data";
import * as voice from "../patterns/voice-data";
import * as backToTop from "../shell/back-to-top-data";
import * as behaviours from "../shell/behaviours-data";
import * as footer from "../shell/footer-data";
import * as header from "../shell/header-data";
import * as identity from "../shell/identity-data";
import * as languageMenu from "../shell/language-menu-data";
import * as mobileMenu from "../shell/mobile-menu-data";
import * as overview from "../start/overview-data";
import * as principles from "../start/principles-data";
import * as specimens from "../../_data/specimens";

/** Each module by its path under sections/, without the extension. */
export const DATA_MODULES: Readonly<Record<string, object>> = {
  "components/accordion-data": accordion, "components/avatar-data": avatar, "components/badge-tag-data": badgeTag,
  "components/button-data": button, "components/card-data": card, "components/carousel-data": carousel,
  "components/chip-data": chip, "components/comparison-data": comparison, "components/dialog-data": dialog,
  "components/empty-state-data": emptyState, "components/icon-button-data": iconButton,
  "components/loading-data": loading, "components/progress-data": progress,
  "components/section-head-data": sectionHead, "components/segmented-data": segmented,
  "components/stats-typed-data": statsTyped, "components/tabs-data": tabs, "components/terminal-data": terminal,
  "components/text-link-data": textLink, "components/toast-data": toast, "components/tooltip-data": tooltip,
  "components/_data/choice": choice, "components/_data/fields": fields,
  "components/_data/select-search": selectSearch, "components/_data/slider": slider,
  "effects/accent-water-data": accentWater, "effects/ascii-field-data": asciiField, "effects/doodles-data": doodles,
  "effects/families-data": families, "effects/floor-lifecycle-data": floorLifecycle,
  "effects/floor-lifecycle-pins": floorLifecyclePins, "effects/floor-params-data": floorParams,
  "effects/holograms-data": holograms, "effects/layer-stack-data": layerStack, "effects/perf-rule-data": perfRule,
  "effects/portrait-sweep-data": portraitSweep, "effects/scroll-line-data": scrollLine,
  "effects/tile-activation-data": tileActivation, "effects/tile-floor-data": tileFloor,
  "effects/tile-floor-pins": tileFloorPins, "effects/tile-states-data": tileStates,
  "foundations/accessibility-data": accessibility, "foundations/colour-contrast-data": colourContrast,
  "foundations/colour-roles-data": colourRoles, "foundations/colour-special-data": colourSpecial,
  "foundations/elevation-data": elevation, "foundations/focus-data": focus, "foundations/icons-data": icons,
  "foundations/layout-data": layout, "foundations/radius-data": radius, "foundations/spacing-data": spacing,
  "foundations/type-data": type,
  "meta/changelog-data": changelog, "meta/conventions-data": conventions, "meta/decisions-data": decisions,
  "meta/gaps-data": gaps,
  "motion/_data/choreography": choreography, "motion/_data/entrance": entrance, "motion/_data/loops": loops,
  "motion/_data/micro": micro, "motion/_data/reduced": reduced, "motion/_data/tokens": motionTokens,
  "patterns/composition-data": composition, "patterns/forms-data": forms, "patterns/hero-data": hero,
  "patterns/light-sections-data": lightSections, "patterns/responsive-data": responsive,
  "patterns/scroll-players-data": scrollPlayers, "patterns/surfaces-data": surfaces,
  "patterns/system-states-data": systemStates, "patterns/voice-data": voice,
  "shell/back-to-top-data": backToTop, "shell/behaviours-data": behaviours, "shell/footer-data": footer,
  "shell/header-data": header, "shell/identity-data": identity, "shell/language-menu-data": languageMenu,
  "shell/mobile-menu-data": mobileMenu,
  "start/overview-data": overview, "start/principles-data": principles,
  "_data/specimens": specimens,
};

/** Modules that read this report themselves, so importing them here would loop. */
export const NOT_COLLECTED: readonly string[] = ["meta/coverage-data"];
