// The Empty state section's data: the copy for each variant (filler written in the site's voice), the
// anatomy pins, the drawer rows, the props and the snippet.
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { ButtonVariant } from "@/components/design-system/button-styles";
import type { EmptyStateVariant } from "@/components/design-system/EmptyState";
import { sv, tv, type Pin } from "./display-values";

const ES = "EmptyState.tsx";

export type EmptyCopy = {
  title: string;
  body: string;
  primary: { label: string; variant: ButtonVariant };
  link?: string;
};

export const EMPTY_VARIANTS: readonly EmptyStateVariant[] = ["firstUse", "noResults", "error", "offline", "noAccess"];

export const EMPTY_COPY: Record<EmptyStateVariant, EmptyCopy> = {
  firstUse: {
    title: "No runs yet",
    body: "Ask the model a question about your players and its first answer lands here.",
    primary: { label: "Ask a question", variant: "primary" },
    link: "See an example",
  },
  noResults: {
    title: "No sessions match “refund”",
    body: "Try a shorter phrase, or clear the filters to see every session.",
    primary: { label: "Clear filters", variant: "secondary" },
  },
  error: {
    title: "The answer did not load",
    body: "Your question is saved. Trying again picks up where the run stopped.",
    primary: { label: "Try again", variant: "secondary" },
    link: "Contact support",
  },
  offline: {
    title: "You are offline",
    body: "Answers need a connection. This view reloads once you are back.",
    primary: { label: "Try again", variant: "secondary" },
  },
  noAccess: {
    title: "This workspace is private",
    body: "Ask its owner to add you, or sign in with the account they invited.",
    primary: { label: "Sign in", variant: "primary" },
    link: "Request access",
  },
};

export const EMPTY_PINS: readonly Pin[] = [
  { selector: "[data-part=container]", name: "Container", token: "--ds-color-container", value: "radius 36 · p 48, 32 under 560", source: `${ES}:24`, expect: "rounded-(--ds-radius-xl) border border-(--ds-color-line-faint) bg-(--ds-color-container) p-12", padding: true },
  { selector: "[data-part=icon]", name: "Boxed icon", token: "--ds-color-surface", value: "48 circle · icon 24", source: `${ES}:28,84`, expect: ["grid h-12 w-12 shrink-0 place-items-center rounded-full", "size={24}"] },
  { selector: "[data-part=title]", name: "Title", value: "Outfit 20 / 500 · -0.03em", source: `${ES}:89`, expect: "font-display text-[20px] font-medium leading-tight tracking-[-0.03em]" },
  { selector: "[data-part=body]", name: "Body", token: "--ds-color-text-body", value: "Inter 14 / 1.5", source: `${ES}:94`, expect: "text-[14px] leading-normal" },
  { selector: "[data-part=actions]", name: "Actions", value: "mt 24 · gap 20 · stacks under 400", source: `${ES}:31-32`, expect: ["mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3", "@max-[400px]:flex-col"] },
];

export const EMPTY_VALUES: readonly ValueRow[] = [
  tv("Container fill", "color-container", `${ES}:24`),
  tv("Container radius", "radius-xl", `${ES}:24`),
  tv("Container line", "color-line-faint", `${ES}:24`),
  sv("Padding", "48, 32 when the part is under 560 wide", `${ES}:24`),
  sv("Uncontained padding", "40 by 24, 32 by 16 under 560", `${ES}:25`),
  sv("Content", "centred, max 400", `${ES}:79`),
  tv("Icon box fill", "color-surface", `${ES}:28`),
  tv("Icon box line", "color-line", `${ES}:28`),
  tv("Icon stroke at 24", "icon-24-stroke", `${ES}:84`),
  tv("Error icon", "color-danger-ink", `${ES}:70`),
  sv("Title", "card-title role, Outfit 20 / 500 / -0.03em, ink", `${ES}:89`),
  tv("Body", "color-text-body", `${ES}:94`),
  sv("Actions", "mt 24, gap 20 by 12, column under a 400 container", `${ES}:31-32`),
  tv("Rise", "dur-reveal", "empty-state.module.css:4"),
  sv("Rise travel", "y 12 to 0 with opacity, none under reduced motion", "empty-state.module.css:9-10"),
];

export const EMPTY_PROPS: readonly PropRow[] = [
  { name: "variant", type: "\"firstUse\" | \"noResults\" | \"error\" | \"offline\" | \"noAccess\"", default: "\"firstUse\"", note: "sets the icon" },
  { name: "title", type: "string", note: "names the state" },
  { name: "body", type: "ReactNode", note: "the reason or the way on" },
  { name: "primaryAction", type: "ReactNode", note: "one md Button" },
  { name: "secondaryAction", type: "ReactNode", note: "a TextLink" },
  { name: "contained", type: "boolean", default: "true", note: "false inside a card" },
  { name: "icon", type: "LucideIcon", note: "replaces the variant's icon" },
  { name: "mark", type: "boolean", default: "false", note: "the 44 brand mark" },
  { name: "headingLevel", type: "2 | 3 | 4", default: "3" },
  { name: "announce", type: "boolean", default: "false", note: "role alert after the visitor's own action" },
];

export const EMPTY_CODE = `import { EmptyState } from "@/components/design-system/EmptyState";
import { Button } from "@/components/design-system/Button";

<EmptyState
  variant="error"
  title="The answer did not load"
  body="Your question is saved. Trying again picks up where the run stopped."
  primaryAction={<Button variant="secondary" onClick={retry}>Try again</Button>}
/>`;
