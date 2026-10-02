"use client";

// Frame parts for the input sections, each on the page ground so the viewport's own width decides:
// "field-sizes" shows the three field sizes (their text steps up to 16px under md, so iOS never zooms),
// "select-native" shows a Select that hands over to the native picker under md beside a SearchField, and
// "radio-stack" shows a horizontal radio row (it stacks under 480) over the card row (it stacks under 640).
import { Mail } from "lucide-react";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { RadioGroup } from "@/components/design-system/Radio";
import { SearchField } from "@/components/design-system/SearchField";
import { Select } from "@/components/design-system/Select";
import { TextInput } from "@/components/design-system/TextInput";

const GROUND = { padding: 24, background: "var(--ds-color-page)", minHeight: "100vh" } as const;
const COLUMN = { display: "grid", gap: 20, maxWidth: 420 } as const;

export function FieldSizesPart() {
  return (
    <div style={GROUND}>
      <div style={COLUMN}>
        <TextInput size="sm" label="Work email" leadingIcon={Mail} defaultValue="mira@northwind.games" />
        <TextInput size="md" label="Work email" leadingIcon={Mail} defaultValue="mira@northwind.games" />
        <TextInput size="lg" label="Work email" leadingIcon={Mail} defaultValue="mira@northwind.games" />
      </div>
    </div>
  );
}

const PLAYER_OPTIONS = PLAYERS.map((p) => ({ value: p.id, label: p.title }));

export function SelectNativePart() {
  return (
    <div style={GROUND}>
      <div style={COLUMN}>
        <Select label="Player type" options={PLAYER_OPTIONS} defaultValue={PLAYERS[0].id} />
        <SearchField label="Search the questions" placeholder="Search the questions" bindShortcut={false} />
      </div>
    </div>
  );
}

export function RadioStackPart() {
  return (
    <div style={GROUND}>
      <div style={{ display: "grid", gap: 32 }}>
        <RadioGroup
          legend="Player type"
          orientation="horizontal"
          defaultValue={PLAYERS[0].id}
          options={PLAYERS.map((p) => ({ value: p.id, label: p.title }))}
        />
        <RadioGroup
          legend="First job"
          variant="card"
          defaultValue={JOBS[1].id}
          options={JOBS.map((j) => ({ value: j.id, label: j.title, description: j.body }))}
        />
      </div>
    </div>
  );
}
