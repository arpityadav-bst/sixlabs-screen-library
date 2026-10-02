// The only place token values become CSS. It prints one <style> that declares every token in tokens.ts as a
// --ds-* custom property on the guide document's root, plus each type role's family, size, leading,
// tracking, weight, case and figures, with the role's breakpoint steps as media blocks in cascade order. Every name
// carries the ds- prefix, so nothing on the site can read them. Mounted by (guide)/layout.tsx and
// frame/layout.tsx.
import { ALL_TOKENS, MEDIA, TYPE_ROLES, type MediaKey } from "./tokens";

const FAMILY = {
  display: "var(--ds-font-display)",
  sans: "var(--ds-font-sans)",
  mono: "var(--ds-font-mono)",
} as const;

function decl(name: string, value: string) {
  return `--ds-${name}:${value};`;
}

/** The token CSS for a selector. Built once per selector, the values never change at runtime. */
export function tokenCss(selector = ":root"): string {
  const base = ALL_TOKENS.filter((t) => t.css !== false).map((t) => decl(t.name, t.value));
  const steps: Partial<Record<Exclude<MediaKey, "base">, string[]>> = {};
  for (const r of TYPE_ROLES) {
    const p = `type-${r.name}`;
    base.push(
      decl(`${p}-family`, FAMILY[r.family]),
      decl(`${p}-size`, r.size),
      decl(`${p}-leading`, r.leading),
      decl(`${p}-tracking`, r.tracking),
      decl(`${p}-weight`, String(r.weight)),
      decl(`${p}-case`, r.caps ? "uppercase" : "none"),
      decl(`${p}-numeric`, r.tabular ? "tabular-nums" : "normal"),
    );
    for (const s of r.steps ?? []) {
      if (s.at === "base") continue;
      const list = (steps[s.at] ??= []);
      list.push(decl(`${p}-size`, s.size));
      if (s.leading) list.push(decl(`${p}-leading`, s.leading));
      if (s.tracking) list.push(decl(`${p}-tracking`, s.tracking));
    }
  }
  const blocks = (Object.keys(MEDIA) as Exclude<MediaKey, "base">[])
    .filter((k) => steps[k]?.length)
    .map((k) => `@media ${MEDIA[k]}{${selector}{${steps[k]!.join("")}}}`);
  return `${selector}{${base.join("")}}${blocks.join("")}`;
}

const ROOT_CSS = tokenCss();

export function TokenStyle({ selector }: { selector?: string }) {
  const css = selector ? tokenCss(selector) : ROOT_CSS;
  return <style data-ds-tokens="" dangerouslySetInnerHTML={{ __html: css }} />;
}
