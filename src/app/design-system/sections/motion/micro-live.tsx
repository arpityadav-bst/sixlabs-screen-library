"use client";

// The micro-interaction table's live parts. Each is the real component: the wave button with a no-op
// press (the floor is not on this page) and the Human / AI switch with its own thumb id. The language
// menu is the shell's LanguageLive, mounted by micro.tsx in a group of its own.
import { Waves } from "lucide-react";
import { useState } from "react";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { IconButton } from "@/components/design-system/IconButton";
import { WaveButton } from "@/components/website/HeroBits";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";

export function WaveLive() {
  return <WaveButton full onClick={noop} />;
}

export function ModeLive() {
  const [mode, setMode] = useState<Mode>("human");
  return <ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-micro" />;
}

/** Do: the system icon button widens its label on hover and on keyboard focus alike. */
export function WaveLabelDo() {
  return <IconButton icon={Waves} label="Next wave" variant="outline" showLabelOnHover onClick={noop} />;
}
