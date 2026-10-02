// The drawer-row helpers every Components section shares, built on the kit's token-rows.ts. A token row reads
// its value and source from tokens.ts, and an unknown name throws, so a typo fails the build. A site row
// cites the shipped file:line it was read from and carries the exact text it was read off (its needles) as
// an Assertion, which Coverage collects, so the day the site stops saying it the row turns red. A row citing
// a site file without a needle throws.
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { siteRow, tokenRow } from "@/app/design-system/_kit/token-rows";
import type { Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import { TYPE_ROLES, tokenByName } from "@/components/design-system/tokens";

/** A drawer row, with the Assertion its value is held to when it was read off a site file. */
export type CheckedRow = ValueRow & { readonly assert?: Assertion };

/** An Anatomy pin with the text its cited lines must still write (one needle, or one per cite), which
 *  Coverage reads on those lines at build (meta-pins.ts), so a cite that drifts onto a brace turns red. */
export type Pin = AnatomyPin & { readonly expect?: string | readonly string[] };

const WEBSITE = new Set([
  "AccentWave.tsx", "AsciiBackdrop.tsx", "BackToTop.tsx", "ClickLock.tsx", "Closing.tsx", "CopyLine.tsx",
  "CopyLinePicture.tsx", "CtaDots.tsx", "DoodleStroke.tsx", "Faq.tsx", "FloatingBadges.tsx", "Footer.tsx",
  "Header.tsx", "Hero.tsx", "HeroBits.tsx", "HeroLoader.tsx", "JobTerminal.tsx", "Jobs.tsx", "LanguageMenu.tsx",
  "LiquidLine.tsx", "MobileMenu.tsx", "ModeToggle.tsx", "PlayerCarousel.tsx", "PlayerDoodles.tsx",
  "PlayerPortrait.tsx", "PlayerTraits.tsx", "Players.tsx", "PortraitSwap.tsx", "PrimaryCta.tsx", "ScrollCue.tsx",
  "ScrubLine.tsx", "StackedSwap.tsx", "TypedWord.tsx", "Understands.tsx", "brand-marks.tsx", "jobs-data.ts",
  "faq-data.ts", "players-data.ts", "floating-badges-data.ts", "hero-intro.ts", "glide.ts", "ascii-field.js",
]);

/** The repo path (from src/) of a site file a source names, or undefined for a system file. */
export function siteFile(source: string | undefined): string | undefined {
  const name = source?.split(":")[0].trim().replace(/^src\//, "");
  if (!name) return undefined;
  if (name.includes("/")) return /^(components\/website|components\/tiles|app\/website)\//.test(name) ? name : undefined;
  if (name === "globals.css") return "app/globals.css";
  if (name === "TileFloor.tsx") return "components/tiles/TileFloor.tsx";
  return WEBSITE.has(name) ? `components/website/${name}` : undefined;
}

/** A drawer row for a system token: the kit's tokenRow, which throws on an unknown name. */
export const tv = tokenRow;

/** A drawer row for a value written in a file: the kit's siteRow (which checks the token it names), plus
 *  the needles a site source must carry, the exact text the value was read off, kept as its Assertion. */
export function sv(part: string, value: string, source?: string, token?: string, ...needles: string[]): CheckedRow {
  const file = siteFile(source);
  if (file && needles.length === 0) {
    throw new Error(`Components drawer: "${part}" cites ${source} with no needle to hold it to`);
  }
  const name = token?.replace(/^--ds-/, "");
  // a type role prints as the --ds-type-<role>-* family, so it is checked against TYPE_ROLES, not tokenByName
  if (name?.startsWith("type-") && !TYPE_ROLES.some((r) => `type-${r.name}` === name)) {
    throw new Error(`Components drawer: "${part}" names --ds-${name}, which is not a type role`);
  }
  const role = name?.startsWith("type-") ? `--ds-${name}` : undefined;
  const plain = role ? undefined : name;
  // with no source the token is still checked: tokenRow throws on a name tokens.ts does not hold
  if (!source) return plain ? { part, token: tokenRow(part, plain).token, value } : { part, value, ...(role ? { token: role } : {}) };
  const base = siteRow(part, value, source, plain);
  const row: ValueRow = role ? { ...base, token: role } : base;
  return file ? { ...row, assert: { file, needles } } : row;
}

/** A props row. */
export function pr(name: string, type: string, def?: string, note?: string): PropRow {
  return { name, type, ...(def ? { default: def } : {}), ...(note ? { note } : {}) };
}

/** A token's colour for captions and contrast badges: its sRGB form when it has one, so an oklch token
 *  still parses (the kit's tokenValue prints the value as written). */
export function tokenColour(name: string): string {
  const t = tokenByName(name);
  if (!t) throw new Error(`Components: --ds-${name} is not in tokens.ts`);
  return t.srgb && !t.srgb.includes(" ") ? t.srgb : t.value;
}

/** The file:line a token mirrors, or tokens.ts for a system addition. */
export function tokenSource(name: string): string {
  const t = tokenByName(name);
  return t && t.source !== "system" ? t.source : "tokens.ts";
}
