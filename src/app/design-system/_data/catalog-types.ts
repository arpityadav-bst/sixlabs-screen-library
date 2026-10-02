// The shapes the catalog is written in, and the helpers that keep each entry short. Pure data: nothing here
// imports a component, so the index page can read the catalog without pulling in the guide.

export type GroupId =
  | "start"
  | "foundations"
  | "motion"
  | "effects"
  | "shell"
  | "components"
  | "patterns"
  | "meta";

/** Ids the site's own parts carry. A section or group id must never equal one, and a section lists the ones
 *  it mounts in the guide document in `renders`. */
export const SITE_IDS = ["players", "model-line", "site-head", "understands", "jobs", "faq", "get-access"] as const;
export type SiteId = (typeof SITE_IDS)[number];

/** One part a section specimens. `component` is the export name as the source scan reads it. */
export type Cover = {
  readonly component: string;
  /** repo-relative file that exports it */
  readonly source: string;
  readonly variants?: readonly string[];
  readonly states?: readonly string[];
  /** owed states that do not apply to this part (a field is never pressed), which coverage counts as met */
  readonly na?: readonly string[];
};

export type SectionDef = {
  /** the section element's id, its #anchor and its registry key */
  readonly id: string;
  /** the h2 and the nav label (one string, so they cannot disagree) */
  readonly title: string;
  /** optional nav sub-label inside a group (Components: Actions, Selection, Inputs and so on) */
  readonly sub?: string;
  /** the section's main file, repo-relative */
  readonly file: string;
  /** the DESIGN.md chapter that holds the reasons, as its number ("7.1") */
  readonly designMd: string;
  /** a whole chapter's DESIGN.md heading, when its partial titles it apart from the section ("About this
   *  document" for Overview). A numbered section is always headed by its catalog title. */
  readonly designMdTitle?: string;
  /** site ids the section mounts in the guide document itself (so two sections never mount the same one) */
  readonly renders?: readonly SiteId[];
  readonly covers: readonly Cover[];
};

export type GroupDef = {
  readonly id: GroupId;
  readonly title: string;
  /** one sentence under the group label on the page, saying what the group holds */
  readonly lead: string;
  readonly sections: readonly SectionDef[];
};

/** Keeps every literal (ids above all) so SectionId is a closed union. */
export function defineGroup<const G extends GroupDef>(group: G): G {
  return group;
}

/** A run of a group's sections kept in a file of its own, its literals kept as defineGroup keeps them. */
export function defineSections<const S extends readonly SectionDef[]>(sections: S): S {
  return sections;
}

type CoverOpts = {
  /** the file's base name when it differs from the export (HeroNumbers lives in HeroBits) */
  file?: string;
  /** space-separated, a dash inside a name ("focus-visible", "near-limit") */
  variants?: string;
  states?: string;
  /** owed states that do not apply, space-separated ("pressed") */
  na?: string;
};

const words = (s?: string) => (s ? s.split(/\s+/).filter(Boolean) : undefined);

function cover(component: string, dir: string, ext: string, o: CoverOpts): Cover {
  const c: Cover = { component, source: `${dir}/${o.file ?? component}${ext}` };
  const variants = words(o.variants);
  const states = words(o.states);
  const na = words(o.na);
  return { ...c, ...(variants ? { variants } : {}), ...(states ? { states } : {}), ...(na ? { na } : {}) };
}

/** a shipped part from src/components/website */
export const site = (component: string, o: CoverOpts = {}) =>
  cover(component, "src/components/website", ".tsx", o);

/** a shipped part from src/components/tiles */
export const tiles = (component: string, o: CoverOpts = {}) =>
  cover(component, "src/components/tiles", ".tsx", o);

/** a new part from src/components/design-system */
export const sys = (component: string, o: CoverOpts = {}) =>
  cover(component, "src/components/design-system", ".tsx", o);

/** the section file path, from its place under src/app/design-system/sections */
export const sectionFile = (path: string) => `src/app/design-system/sections/${path}.tsx`;
