// Data for the Forms pattern: the copy each form uses (obvious filler, or quoted where the site has the
// words), the validation steps, the pins and the drawer rows. The layout values are the system's own.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { SelectOption } from "@/components/design-system/Select";
import { JOBS } from "@/components/website/jobs-data";
import { pr, sv, tv } from "../components/display-values";

const D = "components/design-system/";
const G = "app/design-system/sections/patterns/forms.module.css";

/** A pragmatic check: something, an @, something, a dot, something. The server has the last word. */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WAITLIST = {
  label: "Work email",
  placeholder: "you@studio.com",
  cta: "Request access",
  invalid: "Enter an email like you@studio.com.",
  empty: "Enter your work email.",
  sent: "You are on the list",
  sentBody: "Your access details go to this address once they are ready.",
} as const;

export type FlowStep = "empty" | "invalid" | "fixed" | "submitting" | "success";

export const FLOW: readonly { step: FlowStep; label: string; value: string }[] = [
  { step: "empty", label: "1 · empty, the button already live", value: "" },
  { step: "invalid", label: "2 · invalid, shown once the field is left", value: "ana@studio" },
  { step: "fixed", label: "3 · fixed, the error clears as it types", value: "ana@studio.com" },
  { step: "submitting", label: "4 · submitting, the button busy", value: "ana@studio.com" },
  { step: "success", label: "5 · success, a toast and the line reset", value: "" },
];

/** The topics are the three jobs, quoted from jobs-data.ts. */
export const TOPICS: readonly SelectOption[] = JOBS.map((j) => ({ value: j.id, label: j.title }));

export const CONTACT = {
  topic: "Topic",
  message: "Message",
  messageHelper: "What you want the model to do for your game.",
  consent: "Contact me about this request.",
  cancel: "Cancel",
  send: "Send",
} as const;

export const SIGN_IN = {
  title: "Sign in",
  email: "Work email",
  password: "Password",
  keep: "Keep me signed in",
  forgot: "Forgot password",
} as const;

export const WAITLIST_PINS: readonly AnatomyPin[] = [
  { selector: '[data-pin="card"] > article', name: "White card", token: "--ds-color-surface", value: "fields never sit straight on the grey", source: "Card.tsx:92", expect: "tone = \"surface\"", padding: true, side: "left" },
  { selector: '[data-pin="card"] label', name: "Label", value: "above the field, never a placeholder", source: "Field.tsx:90", expect: "data-slot=\"label\"", side: "left" },
  { selector: '[data-pin="card"] [data-slot="box"]', name: "Field", value: "lg · 52 tall · 16px text", source: "field-styles.ts:32", expect: "h: \"h-13\"", side: "left" },
  { selector: '[data-pin="card"] button[type="submit"]', name: "Request access", token: "--ds-color-primary", value: "xl · 52 · the one primary", source: "button-styles.ts:36", expect: "xl: { box: \"h-[52px]", side: "right" },
];

export const SIGN_IN_PINS: readonly AnatomyPin[] = [
  { selector: '[data-pin="signin"] [data-part="title"]', name: "Title", value: "the action, in two words", source: "DialogPanel.tsx:81", expect: "data-part=\"title\"", side: "left" },
  { selector: '[data-pin="fields"]', name: "Fields", value: "gap 20 · labels above", source: "forms.module.css:38", expect: "gap: var(--ds-space-5, 20px);", side: "left" },
  { selector: '[data-pin="show"]', name: "Show", value: "ghost xs · names what it does next", source: "button-styles.ts:32", expect: "xs: { box: \"h-7", side: "right" },
  { selector: '[data-pin="keep"]', name: "Keep and forgot", value: "one row, the link last", source: "forms.module.css:44", expect: "justify-content: space-between;", side: "right" },
  { selector: '[data-pin="signin"] [data-part="footer"]', name: "Sign in", token: "--ds-color-primary", value: "lg · full width", source: "DialogPanel.tsx:99", expect: "data-part=\"footer\"", side: "right" },
];

const K = '[data-pin="contact"]';

export const CONTACT_PINS: readonly AnatomyPin[] = [
  { selector: `${K} > div:first-child > :nth-child(1)`, name: "Select", value: "md · the three jobs", source: "Select.tsx:64", expect: "size = \"md\"", side: "left" },
  { selector: `${K} > div:first-child > :nth-child(2)`, name: "Message", value: "grows to 280 · counter at 500", source: "TextArea.tsx:12", expect: "const MAX_H = 280;", side: "left" },
  { selector: `${K} > div:first-child > :nth-child(3)`, name: "Consent", value: "unticked by default", source: "Checkbox.tsx:60", expect: "defaultChecked = false,", side: "right" },
  { selector: `${K} > div:last-child`, name: "Actions", value: "mt 32 under the fields", source: "forms.module.css:48", expect: "margin-top: var(--ds-space-8, 32px);", side: "right" },
  { selector: `${K} > div:last-child > [role="group"]`, name: "Button row", value: "gap 12 · the primary last", source: "ButtonGroup.tsx:21", expect: "flex flex-wrap items-center gap-3", side: "right" },
];

/** The Do / Don't error lines: one says what to type, one only says no. */
export const ERRORS = { helpful: WAITLIST.invalid, bare: "Invalid input", value: "ana@studio" } as const;

export const FORM_VALUES = [
  tv("Between fields", "space-5", `${G}:38`),
  tv("Before the actions", "space-8", `${G}:48`),
  tv("Card padding", "space-6"),
  sv("Label", "above its field, never inside it as a placeholder", `${D}Field.tsx:89`),
  sv("Field sizes", "sm 36, md 44, lg 52 · 16px text under md", `${D}field-styles.ts:9`),
  sv("Error", "under the field, danger ink, with an icon, once the field is left or on submit", `${D}Field.tsx:128`, "--ds-color-danger-ink"),
  tv("Invalid halo", "color-danger-halo"),
  sv("Submit", "a busy Button: label held at opacity 0, a centred Spinner, clicks ignored", `${D}Button.tsx:127`),
  sv("Success", "an inline Toast, tone success, then the line resets", `${D}Toast.tsx:53`),
] as const;

export const FORM_PROPS = [
  pr("error", "ReactNode", undefined, "set once the field is left or on submit, cleared as the value turns valid"),
  pr("loading", "boolean", "false", "on the submit Button while the request runs"),
  pr("type", '"submit"', '"button"', "the one submit per form"),
];

export const FORM_CODE = `import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { TextInput } from "@/components/design-system/TextInput";

<Card tone="surface">
  <form onSubmit={submit} noValidate>
    <TextInput label="Work email" type="email" size="lg" autoComplete="email" error={error} />
    <Button type="submit" size="xl" loading={sending}>Request access</Button>
  </form>
</Card>`;
