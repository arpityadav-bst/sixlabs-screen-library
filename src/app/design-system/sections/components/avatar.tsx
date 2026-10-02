import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Avatar } from "@/components/design-system/Avatar";
import { AvatarGroup } from "@/components/design-system/AvatarGroup";
import { AVATAR_CODE, AVATAR_PINS, AVATAR_PROPS, AVATAR_SIZE_ROWS, AVATAR_VALUES, GROUP_PINS, MISSING, MODELS, PEOPLE } from "./avatar-data";
import { ClickableAvatar } from "./avatar-live";

const SRC = { from: "@/components/design-system/Avatar", name: "Avatar" };
const GROUP = { from: "@/components/design-system/AvatarGroup", name: "AvatarGroup" };
const STATES = ["rest", "hover", "pressed", "focus-visible", "disabled"] as const;
const [model] = MODELS;
const [person] = PEOPLE;

function Faces() {
  return (
    <Sub title="Avatar">
      <Spec
        title="Anatomy"
        level={4}
        source={SRC}
        props="shape fill status"
        role="Person, player model and AI copy side by side, so the shape difference is judged at one size."
        drawer={{ values: AVATAR_VALUES, props: AVATAR_PROPS, code: AVATAR_CODE }}
      >
        <Anatomy ground="page" pins={AVATAR_PINS} label="Avatar anatomy">
          <span className="ds-a-person inline-flex">
            <Avatar name={person.name} size={64} status="online" />
          </span>
          <span className="ds-a-model inline-flex">
            <Avatar name={model.name} src={model.human} shape="model" size={64} />
          </span>
          <span className="ds-a-ai inline-flex">
            <Avatar name={`${model.name}, AI copy`} src={model.ai} shape="model" fill="navy" size={64} />
          </span>
        </Anatomy>
      </Spec>
      <Spec
        title="Sizes"
        level={4}
        source={SRC}
        props="size"
        role="One ladder from a dense row to a profile, the initials scaling with the disc, so a person reads the same at any size."
        caption="20 · 24 · 32 · 40 · 48 · 64 · 96 · initials on the type scale, none at 20"
      >
        <SizeLadder label="Person sizes" sizes={AVATAR_SIZE_ROWS.map((s) => ({ name: String(s), spec: s, node: <Avatar name={person.name} size={s} /> }))} />
        <SizeLadder
          label="Player model sizes"
          sizes={AVATAR_SIZE_ROWS.map((s) => ({ name: String(s), spec: s, node: <Avatar name={model.name} src={model.human} shape="model" size={s} /> }))}
        />
      </Spec>
      <Spec title="Fallbacks and status" level={4} source={SRC} props="src name status" role="Each fallback and each status at 48, so a missing picture or name is judged before it ships.">
        <Canvas ground="page" layout="flow" label="Fallbacks">
          <Item label="picture">
            <Avatar name={MODELS[1].name} src={MODELS[1].human} size={48} />
          </Item>
          <Item label="initials · picture missing">
            <Avatar name={PEOPLE[1].name} src={MISSING} size={48} />
          </Item>
          <Item label="icon · no name">
            <Avatar size={48} />
          </Item>
        </Canvas>
        <Canvas ground="page" layout="flow" label="Status">
          <Item label="live · accent">
            <Avatar name={PEOPLE[2].name} size={48} status="live" />
          </Item>
          <Item label="online · success">
            <Avatar name={PEOPLE[3].name} size={48} status="online" />
          </Item>
          <Item label="idle · slate">
            <Avatar name={PEOPLE[4].name} size={48} status="idle" />
          </Item>
        </Canvas>
      </Spec>
      <Spec title="States" level={4} source={SRC} props="onClick forceState" role="The avatar as a button in every state, so a profile link never needs its own control.">
        <StateGrid
          label="Avatar button states"
          states={STATES}
          variants={["circle", "model"] as const}
          render={({ variant, force }) =>
            variant === "circle" ? (
              <ClickableAvatar name={person.name} forceState={force} />
            ) : (
              <ClickableAvatar name={model.name} src={model.human} shape="model" forceState={force} />
            )
          }
        />
      </Spec>
    </Sub>
  );
}

function Groups() {
  return (
    <Sub title="Avatar group">
      <Spec
        title="Overlap and more"
        level={4}
        source={GROUP}
        props="people max"
        role="Six people and six models, so a long list is seen to keep one row length."
      >
        <Anatomy ground="page" pins={GROUP_PINS} label="Avatar group anatomy">
          <div className="ds-a-group flex flex-wrap items-center gap-10">
            <AvatarGroup people={PEOPLE} size={40} label="6 people" />
            <AvatarGroup people={MODELS.map((m) => ({ name: m.name, src: m.human }))} size={40} shape="model" label="6 player models" />
          </div>
        </Anatomy>
      </Spec>
      <Spec title="Across widths" level={4} source={GROUP} role="On a phone the group shows three and the disc counts one more, so the row keeps its length.">
        <Canvas ground="container" layout="stack">
          <ViewportPreview part="avatar-group" title="Avatar groups at true widths" height={120} widths={[375, 1280]} width={375} />
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="Give a player model the rounded square, so it never passes for a person.">
          <Avatar name={model.name} src={model.human} shape="model" size={64} />
          <Avatar name={`${model.name}, AI copy`} src={model.ai} shape="model" fill="navy" size={64} />
        </Do>
        <Dont reason="A model in a circle reads as a person, and Human / AI loses its tell.">
          <Avatar name={model.name} src={model.human} size={64} />
          <Avatar name={`${model.name}, AI copy`} src={model.ai} fill="navy" size={64} />
        </Dont>
      </DoDont>
    </Sub>
  );
}

export function AvatarSection() {
  return (
    <Section id="avatar" lead="People and player models in small form, with a status, a fallback and a group.">
      <Faces />
      <Groups />
    </Section>
  );
}
