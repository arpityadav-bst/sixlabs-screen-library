// Maps each catalog id to its section component. The page renders them in catalog order, and the
// `satisfies` below fails tsc when a catalog section has no component or a component has no section.
import type { ComponentType } from "react";
import type { SectionId } from "@/app/design-system/_data/catalog";
import { OverviewSection } from "./start/overview";
import { PrinciplesSection } from "./start/principles";
import { ColourSection } from "./foundations/colour-roles";
import { ColourSpecialSection } from "./foundations/colour-special";
import { ContrastSection } from "./foundations/colour-contrast";
import { TypeSection } from "./foundations/type-roles";
import { SpacingSection } from "./foundations/spacing";
import { LayoutSection } from "./foundations/layout-breakpoints";
import { RadiusSection } from "./foundations/radius";
import { ElevationSection } from "./foundations/stroke-elevation";
import { IconsSection } from "./foundations/icons";
import { FocusSection } from "./foundations/focus";
import { AccessibilitySection } from "./foundations/accessibility";
import { MotionTokensSection } from "./motion/tokens";
import { MotionEntranceSection } from "./motion/entrance";
import { MotionMicroSection } from "./motion/micro";
import { MotionLoopsSection } from "./motion/loops";
import { MotionChoreographySection } from "./motion/choreography";
import { MotionReducedSection } from "./motion/reduced";
import { LayerStackSection } from "./effects/layer-stack";
import { TileFloorSection } from "./effects/tile-floor";
import { TileStatesSection } from "./effects/tile-states";
import { TileActivationSection } from "./effects/tile-activation";
import { HologramsSection } from "./effects/characters-holograms";
import { FloorLifecycleSection } from "./effects/floor-lifecycle";
import { AsciiFieldSection } from "./effects/ascii-field";
import { ScrollLineSection } from "./effects/scroll-line";
import { AccentWaterSection } from "./effects/accent-water";
import { PortraitSweepSection } from "./effects/portrait-sweep";
import { DoodlesSection } from "./effects/doodles";
import { FamiliesSection } from "./effects/families";
import { PerfRuleSection } from "./effects/perf-rule";
import { IdentitySection } from "./shell/identity";
import { HeaderSection } from "./shell/header";
import { MobileMenuSection } from "./shell/mobile-menu";
import { LanguageMenuSection } from "./shell/language-menu";
import { FooterSection } from "./shell/footer";
import { BackToTopSection } from "./shell/back-to-top";
import { BehavioursSection } from "./shell/behaviours";
import { ButtonSection } from "./components/button";
import { IconButtonSection } from "./components/icon-button";
import { TextLinkSection } from "./components/text-link";
import { SegmentedSection } from "./components/segmented";
import { TabsSection } from "./components/tabs";
import { ChipSection } from "./components/chip";
import { FieldsSection } from "./components/field-text";
import { SelectSearchSection } from "./components/select-search";
import { ChoiceSection } from "./components/choice";
import { SliderSection } from "./components/slider";
import { CardSection } from "./components/card";
import { ComparisonSection } from "./components/comparison";
import { StatsTypedSection } from "./components/stats-typed";
import { BadgeTagSection } from "./components/badge-tag";
import { AvatarSection } from "./components/avatar";
import { SectionHeadSection } from "./components/section-head";
import { ProgressSection } from "./components/progress";
import { CarouselSection } from "./components/carousel";
import { TerminalSection } from "./components/terminal";
import { AccordionSection } from "./components/accordion";
import { LoadingSection } from "./components/spinner-skeleton";
import { EmptyStateSection } from "./components/empty-state";
import { TooltipSection } from "./components/tooltip";
import { ToastSection } from "./components/toast";
import { DialogSection } from "./components/dialog";
import { SurfacesSection } from "./patterns/surfaces";
import { HeroSection } from "./patterns/hero";
import { ScrollPlayersSection } from "./patterns/scroll-players";
import { LightSectionsSection } from "./patterns/light-sections";
import { PageSection } from "./patterns/page-composition";
import { ResponsiveSection } from "./patterns/responsive";
import { FormsSection } from "./patterns/forms";
import { SystemStatesSection } from "./patterns/system-states";
import { VoiceSection } from "./patterns/voice";
import { CoverageSection } from "./meta/coverage";
import { GapsSection } from "./meta/gaps";
import { DecisionsSection } from "./meta/decisions";
import { ConventionsSection } from "./meta/conventions";
import { ChangelogSection } from "./meta/changelog";

export const SECTION_COMPONENTS = {
  overview: OverviewSection,
  principles: PrinciplesSection,
  colour: ColourSection,
  "colour-special": ColourSpecialSection,
  contrast: ContrastSection,
  type: TypeSection,
  spacing: SpacingSection,
  layout: LayoutSection,
  radius: RadiusSection,
  elevation: ElevationSection,
  icons: IconsSection,
  focus: FocusSection,
  accessibility: AccessibilitySection,
  "motion-tokens": MotionTokensSection,
  "motion-entrance": MotionEntranceSection,
  "motion-micro": MotionMicroSection,
  "motion-loops": MotionLoopsSection,
  "motion-choreography": MotionChoreographySection,
  "motion-reduced": MotionReducedSection,
  "layer-stack": LayerStackSection,
  "tile-floor": TileFloorSection,
  "tile-states": TileStatesSection,
  "tile-activation": TileActivationSection,
  holograms: HologramsSection,
  "floor-lifecycle": FloorLifecycleSection,
  "ascii-field": AsciiFieldSection,
  "scroll-line": ScrollLineSection,
  "accent-water": AccentWaterSection,
  "portrait-sweep": PortraitSweepSection,
  doodles: DoodlesSection,
  families: FamiliesSection,
  "perf-rule": PerfRuleSection,
  identity: IdentitySection,
  header: HeaderSection,
  "mobile-menu": MobileMenuSection,
  "language-menu": LanguageMenuSection,
  footer: FooterSection,
  "back-to-top": BackToTopSection,
  behaviours: BehavioursSection,
  button: ButtonSection,
  "icon-button": IconButtonSection,
  "text-link": TextLinkSection,
  segmented: SegmentedSection,
  tabs: TabsSection,
  chip: ChipSection,
  fields: FieldsSection,
  "select-search": SelectSearchSection,
  choice: ChoiceSection,
  slider: SliderSection,
  card: CardSection,
  comparison: ComparisonSection,
  "stats-typed": StatsTypedSection,
  "badge-tag": BadgeTagSection,
  avatar: AvatarSection,
  "section-head": SectionHeadSection,
  progress: ProgressSection,
  carousel: CarouselSection,
  terminal: TerminalSection,
  accordion: AccordionSection,
  loading: LoadingSection,
  "empty-state": EmptyStateSection,
  tooltip: TooltipSection,
  toast: ToastSection,
  dialog: DialogSection,
  surfaces: SurfacesSection,
  hero: HeroSection,
  "scroll-players": ScrollPlayersSection,
  "light-sections": LightSectionsSection,
  page: PageSection,
  responsive: ResponsiveSection,
  forms: FormsSection,
  "system-states": SystemStatesSection,
  voice: VoiceSection,
  coverage: CoverageSection,
  gaps: GapsSection,
  decisions: DecisionsSection,
  conventions: ConventionsSection,
  changelog: ChangelogSection,
} satisfies Record<SectionId, ComponentType>;
