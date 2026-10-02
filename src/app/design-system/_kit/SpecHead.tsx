// The spec panel's head: the title, one identity chip that says what the part is and where it lives
// ("TileFloor · tiles/TileFloor.tsx:21", a click copies the import line), at most one more chip for a
// behaviour flag that changes how the specimen behaves (WebGL, pointer only, live, frame, read at build, never
// a token, class or file:line, which Spec sends to the drawer), and the role line that says why. Shipped and new parts
// read the same, told apart only by their path. The props a spec varies and any further names go in the
// drawer (Spec hands them there), so the first glance is the title and the reason.
import type { ReactNode } from "react";
import { Chip } from "./Chip";
import { IdentityChip } from "./ExportLines";
import { RoleLine } from "./RoleLine";
import type { SpecSource } from "./spec-source";

export type { SpecSource } from "./spec-source";

export type SpecHeadProps = {
  title: string;
  source?: SpecSource;
  /** one further chip, a behaviour flag ("WebGL", "pointer only", "read at build") */
  chip?: string;
  role?: ReactNode;
  /** heading level of the title: 3 by default, 4 inside a Sub */
  level?: 3 | 4;
};

export function SpecHead({ title, source, chip, role, level = 3 }: SpecHeadProps) {
  const H = level === 4 ? "h4" : "h3";
  return (
    <div className="ds-spec-head">
      <div className="ds-spec-row">
        <H className="ds-spec-title">{title}</H>
        {source && <IdentityChip source={source} />}
        {chip && <Chip>{chip}</Chip>}
      </div>
      {role && <RoleLine>{role}</RoleLine>}
    </div>
  );
}
