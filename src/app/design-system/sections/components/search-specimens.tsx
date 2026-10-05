"use client";

// SearchField's specimens: its anatomy (empty with the shortcut chip, then filled with results), the
// state grid, the size ladder, a live search over the FAQ questions, the empty answer and a live Select.
import { useEffect, useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { SearchField } from "@/components/design-system/SearchField";
import { Select } from "@/components/design-system/Select";
import { matchQuestions, PLAYER_OPTIONS, SEARCH_PINS, SEARCH_STATES, SIZES, TAG_OPTIONS, type SearchState } from "./_data/select-search";
import styles from "./inputs.module.css";

const LABEL = "Search the questions";

export function SearchAnatomy() {
  return (
    <Anatomy pins={SEARCH_PINS} ground="page" gutter={48} isolateKeys label="Search field anatomy">
      <div className={styles["ds-in-stack"]}>
        <SearchField label={LABEL} placeholder={LABEL} shortcut="/" bindShortcut={false} landmark={false} />
        <SearchField label={LABEL} placeholder={LABEL} defaultValue="play" suggestions={matchQuestions("play")} inline landmark={false} />
      </div>
    </Anatomy>
  );
}

function cell(state: SearchState) {
  const query = state === "filled" || state === "results" || state === "searching" ? "player" : state === "no-results" ? "pricing" : "";
  return (
    <SearchField
      label={LABEL}
      placeholder="Search"
      shortcut="/"
      bindShortcut={false}
      defaultValue={query}
      suggestions={matchQuestions(query)}
      loading={state === "searching"}
      disabled={state === "disabled"}
      forceState={state === "hover" ? "hover" : state === "focus" ? "focus" : undefined}
      inline={state === "no-results" || state === "results"}
      active={state === "results" ? 0 : undefined}
      landmark={false}
    />
  );
}

export function SearchStates() {
  return (
    <StateGrid
      label="Search field states"
      states={SEARCH_STATES}
      live={false}
      minCell={200}
      isolateKeys
      render={({ state }) => (state === "live" ? null : cell(state))}
    />
  );
}

const SPEC = { sm: 32, md: 40, lg: 48 } as const;

export function SearchLadder() {
  return (
    <SizeLadder
      label="Search field sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=box]",
        node: (
          <div className={styles["ds-in-w240"]}>
            <SearchField label={`Size ${s}`} size={s} placeholder="Search" shortcut="/" bindShortcut={false} landmark={false} />
          </div>
        ),
      }))}
    />
  );
}

/** A real search over the FAQ: results arrive after a 350ms wait, so the spinner has a moment to show. */
export function SearchLive() {
  const [query, setQuery] = useState("");
  const [settled, setSettled] = useState("");
  const [picked, setPicked] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(query), 350);
    return () => window.clearTimeout(t);
  }, [query]);
  return (
    <Canvas ground="page" minHeight={380} isolateKeys label="Live search over the FAQ questions">
      <div className={styles["ds-in-w440"]}>
        <SearchField
          label={LABEL}
          placeholder={LABEL}
          shortcut="/"
          bindShortcut={false}
          value={query}
          onChange={setQuery}
          loading={query.trim() !== "" && query !== settled}
          suggestions={matchQuestions(settled)}
          onSelect={(o) => setPicked(o.label)}
        />
        <p className="ds-label">{picked ? `Picked: ${picked}` : "Try player, model or test"}</p>
      </div>
    </Canvas>
  );
}

/** Both pickers free, in a canvas tall enough for the panel to open. */
export function SelectLive() {
  return (
    <Canvas ground="page" minHeight={420} isolateKeys label="Live selects">
      <div className={styles["ds-in-row"]}>
        <div className={styles["ds-in-w240"]}>
          <Select label="Player type" options={PLAYER_OPTIONS} native="never" />
        </div>
        <div className={styles["ds-in-w240"]}>
          <Select label="Run type" options={TAG_OPTIONS} helper="Grouped by job" native="never" />
        </div>
      </div>
    </Canvas>
  );
}

export function SearchDoDont() {
  return (
    <DoDont>
      <Do reason="A status row says the search ran and found nothing, and names the query it ran." isolateKeys tall>
        <div className={styles["ds-in-w320"]}>
          <SearchField label={LABEL} placeholder="Search" defaultValue="pricing" inline bindShortcut={false} landmark={false} />
        </div>
      </Do>
      <Dont reason="Closing the list without a word reads as a search that never ran." isolateKeys tall>
        <div className={styles["ds-in-w320"]}>
          <SearchField label={LABEL} placeholder="Search" defaultValue="pricing" bindShortcut={false} landmark={false} />
        </div>
      </Dont>
    </DoDont>
  );
}
