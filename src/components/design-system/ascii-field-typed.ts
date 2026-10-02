// A typed door to the site's glyph field (website/ascii-field.js, plain JS the system must not edit), so
// system code calls it with checked options. The fields are the ones its header documents.
import { mountAsciiField as mount } from "@/components/website/ascii-field";

export type AsciiFieldSpec = {
  /** gets the canvas as its first child, and needs a position */
  host: HTMLElement;
  /** what to listen to for the pointer when it is not the host */
  track?: HTMLElement;
  /** glyph grid in px (15) */
  cell?: number;
  /** pointer pool radius in px (190) */
  reach?: number;
  /** how much the pool brightens a cell (0.42) */
  lens?: number;
  /** resting alpha of the sparse cells (0.075) */
  ambient?: number;
  /** the red and cyan edge on the pool (true) */
  fringe?: boolean;
  /** false leaves the pointer pool unwired */
  pointer?: boolean;
  /** called with the field's controls once it is live */
  expose?: (controls: { sweep: () => void; wake: () => void }) => void;
  /** a pool held at these fractions of the host, with no pointer */
  pool?: { x: number; y: number };
};

export const mountAsciiField: (spec: AsciiFieldSpec) => void = mount;
