"use client";

// Live chip rows, each holding its own state: a labelled group of filter toggles, the system ChipGroup of
// choice chips (one tab stop, the arrows, Home and End), and the system ChipInputGroup of removable input
// chips with a way to bring them back.
import { useRef, useState } from "react";
import { Avatar } from "@/components/design-system/Avatar";
import { Chip, type ChipSize } from "@/components/design-system/Chip";
import { ChipGroup } from "@/components/design-system/ChipGroup";
import { ChipInputGroup } from "@/components/design-system/ChipInputGroup";
import { TRAITS, TYPES } from "./chip-data";
import styles from "./tabs.module.css";

type Ground = "light" | "onBlue";

export function FilterRow({
  labels = TRAITS,
  size,
  ground,
  scroll = false,
}: {
  labels?: readonly string[];
  size?: ChipSize;
  ground?: Ground;
  scroll?: boolean;
}) {
  const [on, setOn] = useState<ReadonlySet<string>>(() => new Set([labels[0]]));
  const flip = (l: string, next: boolean) =>
    setOn((s) => {
      const n = new Set(s);
      if (next) n.add(l);
      else n.delete(l);
      return n;
    });
  return (
    <div role="group" aria-label="Filter by trait" className={styles[scroll ? "ds-chip-scroll" : "ds-chip-wrap"]}>
      {labels.map((l) => (
        <Chip key={l} size={size} ground={ground} selected={on.has(l)} onToggle={(n) => flip(l, n)}>
          {l}
        </Chip>
      ))}
    </div>
  );
}

const TYPE_OPTIONS = TYPES.map((t) => ({ id: t, label: t }));

/** The choice chips as the system ChipGroup ships them, holding the pick. */
export function ChoiceRow({ size, ground }: { size?: ChipSize; ground?: Ground }) {
  const [value, setValue] = useState<(typeof TYPES)[number]>(TYPES[0]);
  return <ChipGroup label="Player type" options={TYPE_OPTIONS} value={value} onChange={setValue} size={size} ground={ground} />;
}

const ALL = TYPES.slice(0, 3);

/** Removable values in the system ChipInputGroup, which moves focus to the next remove button (or the one
 *  before) when one goes, and to Bring them back once the set is empty. */
export function InputRow({ size }: { size?: ChipSize }) {
  const [left, setLeft] = useState<readonly string[]>(ALL);
  const back = useRef<HTMLButtonElement>(null);
  const items = left.map((t) => ({ id: t, label: t, avatar: <Avatar name={t} size={20} shape="model" /> }));

  return (
    <div className="grid justify-items-start gap-3">
      <ChipInputGroup
        label="Chosen player types"
        items={items}
        onRemove={(id) => setLeft((l) => l.filter((x) => x !== id))}
        size={size}
        fallback={back}
      />
      {left.length < ALL.length && (
        <button ref={back} type="button" className="ds-btn ds-btn--line" onClick={() => setLeft(ALL)}>
          Bring them back
        </button>
      )}
    </div>
  );
}
