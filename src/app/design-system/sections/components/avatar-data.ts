// Data for the avatar section: pins, drawer values and props, with the filler people and the player models
// (public/tiles/chars and their AI copies in public/tiles-holo/chars-ai) read from the guide's one copy in
// _data/specimens.ts, which the frames show too. The size ladder is the part's own AVATAR_SIZES, never a
// second list.
import { AVATAR_SIZES } from "@/components/design-system/avatar-sizes";
import { MODELS, PEOPLE, type Model } from "@/app/design-system/_data/specimens";
import { pr, sv, tv, type Pin } from "./display-values";

export { MODELS, PEOPLE, type Model };

/** A picture that is not there, so the specimen shows the initials it falls back to. */
export const MISSING = "/tiles/chars/00-not-on-file.webp";

/** A transparent 1px picture. It loads, so no initials are drawn, and shows nothing, so the disc reads as
 *  it does while a real picture decodes (Avatar.tsx holds the img at opacity 0 until onLoad): the bare
 *  ground with no initials, held still so it can be judged. */
export const LOADING = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const AV = "Avatar.tsx";

export const AVATAR_PINS: readonly Pin[] = [
  { selector: ".ds-a-person > span", name: "Person", token: "--ds-radius-full", value: "circle, ink on #e3e5e8", source: `${AV}:75,79`, expect: ["--ds-radius-full", "bg-(--ds-color-container) text-(--ds-color-ink)"] },
  { selector: ".ds-a-person span.font-display", name: "Initials", token: "--ds-font-display", value: "Outfit 500 on the type scale: 24:11, 32:13, 40:16, 48:20, 64:26, 96:34, none at 20", source: `${AV}:30,98`, expect: ["{ 20: null, 24: 11, 32: 13, 40: 16, 48: 20, 64: 26, 96: 34 }", "font-display font-medium"] },
  { selector: ".ds-a-person > span > span:last-child", name: "Status dot", value: "25% of the size, min 6, 2px page ring", source: `${AV}:77,125`, expect: ["Math.max(6, Math.round(size * 0.25))", "0 0 0 2px var(--ds-color-page)"] },
  { selector: ".ds-a-model > span", name: "Model", token: "--ds-radius-model", value: "the model radius, the tiles' character", source: `${AV}:75`, expect: "--ds-radius-model" },
  { selector: ".ds-a-ai > span", name: "AI copy", token: "--ds-color-primary", value: "the hologram on navy", source: `${AV}:79`, expect: "bg-(--ds-color-primary) text-white" },
];

export const GROUP_PINS: readonly Pin[] = [
  { selector: ".ds-a-group [role=group] > span", index: 1, name: "Overlap", value: "-25% of the size, 2px page ring", source: "AvatarGroup.tsx:59,61", expect: ["ringed", "marginLeft: -size * 0.25"] },
  { selector: '.ds-a-group [aria-label$="more"]', index: 1, name: "More disc", token: "--ds-color-fill-highlight", value: "Inter 12 / 500, #475569", source: "AvatarGroup.tsx:14-15", expect: ["bg-(--ds-color-fill-highlight) font-sans font-medium", "text-(--ds-color-text-body)"] },
];

export const AVATAR_SIZE_ROWS = AVATAR_SIZES;

export const AVATAR_VALUES = [
  sv("Sizes", AVATAR_SIZES.join(", "), "avatar-sizes.ts:5"),
  tv("Fill", "color-container"),
  tv("Initials", "color-ink"),
  sv("Initials size", "24:11, 32:13, 40:16, 48:20, 64:26, 96:34 on the type scale, none at 20, Outfit 500", `${AV}:30`),
  tv("Model radius", "radius-model", `${AV}:75`),
  tv("AI copy fill", "color-primary"),
  sv("Status dot", "25% of the size, at least 6", `${AV}:77`),
  tv("Live dot", "color-accent"),
  tv("Online dot", "color-success"),
  tv("Away dot", "color-line-strong"),
  tv("Ring", "color-page"),
  tv("Picture fade", "dur-ui"),
  sv("Hover", "2px ring in line-strong", `${AV}:140`),
  tv("Pressed", "scale-press-round", `${AV}:142`),
  sv("Group overlap", "-25% of the size", "AvatarGroup.tsx:61"),
  sv("Group most", "4, 3 on phones", "AvatarGroup.tsx:48-49"),
  tv("More fill", "color-fill-highlight"),
] as const;

export const AVATAR_PROPS = [
  pr("name", "string", undefined, "the accessible name and the initials"),
  pr("src", "string", undefined, "falls back to initials on an error"),
  pr("size", AVATAR_SIZES.join(" | "), "40"),
  pr("shape", '"circle" | "model"', '"circle"', "people are circles, models squares"),
  pr("fill", '"container" | "navy"', '"container"', "navy behind an AI copy"),
  pr("status", '"live" | "online" | "idle"', undefined, "spoken after the name"),
  pr("onClick", "() => void", undefined, "makes it a button"),
  pr("disabled", "boolean", "false"),
  pr("ringed", "boolean", "false", "set by the group"),
  pr("forceState", "ForceState"),
  pr("AvatarGroup people", "{ name, src? }[]"),
  pr("AvatarGroup max", "number", "4", "one fewer on phones"),
  pr("AvatarGroup label", "string", '"N people"'),
] as const;

export const AVATAR_CODE = `import { Avatar } from "@/components/design-system/Avatar";
import { AvatarGroup } from "@/components/design-system/AvatarGroup";

<Avatar name={person.name} size={40} status="online" />
<Avatar name="Snapback" src="/tiles/chars/01-snapback.webp" shape="model" />
<AvatarGroup people={people} label="6 players" />`;
