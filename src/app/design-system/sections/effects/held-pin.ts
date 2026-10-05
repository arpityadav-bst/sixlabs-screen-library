// The effect sections' Anatomy pins: display-values' Pin with its `expect` required, so a pin written
// without the text its cited lines hold is a type error here, not a red Coverage row after the build.
import type { Pin } from "@/app/design-system/sections/components/display-values";

/** An Anatomy pin with the text its cited lines must still write (one needle, or one per cite). */
export type HeldPin = Pin & { readonly expect: string | readonly string[] };
