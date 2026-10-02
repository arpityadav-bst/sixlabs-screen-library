"use client";

// A live LanguageMenu inside a LayoutGroup of its own, so its gliding highlight (layoutId "lang-highlight")
// never jumps to another mounted menu. Each section that mounts one passes its own group id.
import { LayoutGroup } from "motion/react";
import { LanguageMenu } from "@/components/website/LanguageMenu";

export function LanguageLive({ group = "ds-lang" }: { group?: string }) {
  return (
    <LayoutGroup id={group}>
      <LanguageMenu />
    </LayoutGroup>
  );
}
