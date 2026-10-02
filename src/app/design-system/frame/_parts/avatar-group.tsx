// Two avatar groups at true widths, for the Avatar spec's responsive preview: from md four show and the
// disc counts the rest, on a phone three show and the disc counts one more.
import { AvatarGroup } from "@/components/design-system/AvatarGroup";
import { MODELS, PEOPLE } from "../../_data/specimens";

export function AvatarGroupPart() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center", padding: "32px 16px" }}>
      <AvatarGroup people={PEOPLE} size={40} label="6 people" />
      <AvatarGroup people={MODELS.map((m) => ({ name: m.name, src: m.human }))} size={40} shape="model" label="6 player models" />
    </div>
  );
}
