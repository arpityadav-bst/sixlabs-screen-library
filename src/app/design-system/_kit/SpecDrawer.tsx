// The spec's drawer: closed by default, the one place exact values pile up, so the panel above stays
// scannable. In order: the props the spec varies and the names it cites, a values table (part, token, value,
// source), a props table (name, type, default) and a copyable snippet (the import plus a minimal usage), each
// optional. Its summary names what it holds ("Values and code"), with the spec's title after it for a screen
// reader, so the many drawers on the page are told apart, and its headings sit one level under the spec's
// title. Under 600px the values table stacks its rows as blocks, and the code block takes a tab stop while it
// scrolls (ScrollBox).
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Chip } from "./Chip";
import { CopyButton } from "./CopyButton";
import { ScrollBox } from "./ScrollBox";
import { SpecTable } from "./SpecTable";

export type ValueRow = {
  readonly part: string;
  readonly token?: string;
  readonly value: string;
  /** file:line the value is read from */
  readonly source?: string;
};

export type PropRow = {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly note?: string;
};

export type SpecDrawerProps = {
  values?: readonly ValueRow[];
  props?: readonly PropRow[];
  code?: string;
  /** the summary line, named from what the drawer holds by default */
  label?: string;
  /** anything else that belongs in the drawer, after the tables and before the code */
  children?: ReactNode;
};

type Placed = {
  /** the props the spec varies, as one string ("variant size"), from Spec's props */
  varies?: string;
  /** further names the spec cites (a class, a token, a sibling part), from Spec's chips past the first */
  names?: readonly string[];
  /** the spec title's level, so the drawer's headings sit one under it */
  level?: 3 | 4;
  /** what the snippet is, for its copy button's name ("Copy Try now code") */
  of?: string;
};

const list = (words: string[]) =>
  words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

/** "Values, props and code" for a drawer that holds all three, "Values" for one with values alone. */
function summary(p: SpecDrawerProps & Placed): string {
  const held = [
    p.values?.length ? "values" : "",
    p.props?.length || p.varies ? "props" : "",
    p.names?.length ? "names" : "",
    p.code ? "code" : "",
  ].filter(Boolean);
  const text = held.length ? list(held) : "details";
  return text[0].toUpperCase() + text.slice(1);
}

export function SpecDrawer(p: SpecDrawerProps & Placed) {
  const { values, props, code, label, children, varies, names, level = 3, of } = p;
  const H = level === 4 ? "h5" : "h4";
  return (
    <details className="ds-sd">
      <summary>
        <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
        {label ?? summary(p)}
        {of && <span className="ds-sr">, {of}</span>}
      </summary>
      <div className="ds-sd-body">
        {(varies || (names && names.length > 0)) && (
          <div className="ds-sd-names">
            {varies && (
              <p className="ds-sd-line">
                <span className="ds-h4">Varies</span> <code className="ds-mono">{varies}</code>
              </p>
            )}
            {names && names.length > 0 && (
              <p className="ds-sd-line">
                <span className="ds-h4">Names</span>
                {names.map((n) => (
                  <Chip key={n}>{n}</Chip>
                ))}
              </p>
            )}
          </div>
        )}
        {values && values.length > 0 && (
          <div>
            <H className="ds-h4">Values</H>
            <SpecTable
              caption="Values"
              columns={["Part", "Token", "Value", "Source"]}
              mono={[1, 2, 3]}
              stack
              rows={values.map((v) => [v.part, v.token ?? "", v.value, v.source ?? ""])}
            />
          </div>
        )}
        {props && props.length > 0 && (
          <div>
            <H className="ds-h4">Props</H>
            <SpecTable
              caption="Props"
              columns={["Name", "Type", "Default", "Note"]}
              mono={[0, 1, 2]}
              rows={props.map((r) => [r.name, r.type, r.default ?? "", r.note ?? ""])}
            />
          </div>
        )}
        {children}
        {code && (
          <div className="ds-code">
            <ScrollBox as="pre" label={of ? `${of} code` : "Code"}>
              <code>{code}</code>
            </ScrollBox>
            <CopyButton text={code} of={of} />
          </div>
        )}
      </div>
    </details>
  );
}
