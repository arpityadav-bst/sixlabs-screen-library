// Forms: how the system's fields, choices and buttons compose into the forms the site needs first, the
// waitlist line, sign in and contact, with the validation flow step by step. The reasons live in
// DESIGN.md 9.7.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Card } from "@/components/design-system/Card";
import { TextInput } from "@/components/design-system/TextInput";
import { CONTACT_PINS, ERRORS, FORM_CODE, FORM_PROPS, FORM_VALUES, SIGN_IN_PINS, WAITLIST, WAITLIST_PINS } from "./forms-data";
import { Contact, SignIn, Waitlist, WaitlistFlow } from "./forms-live";
import s from "./forms.module.css";

const FIELD = { from: "@/components/design-system/TextInput", name: "TextInput" };
const DIALOG = { from: "@/components/design-system/Dialog", name: "Dialog" };

function Email({ error }: { error?: string }) {
  return (
    <TextInput
      label={WAITLIST.label}
      type="email"
      placeholder={WAITLIST.placeholder}
      defaultValue={error ? ERRORS.value : undefined}
      error={error}
    />
  );
}

export function FormsSection() {
  return (
    <Section
      id="forms"
      lead="The first forms the site needs, built from the system's fields and buttons: the waitlist line, sign in and contact. Each one checks a field once it is left and submits with a busy button."
    >
      <Spec
        title="Waitlist line"
        source={FIELD}
        props="size error loading"
        role="One field and one primary in a white card, so on the grey the field still reads as a place to type."
        caption="live · leave it wrong to see the error, submit to see the busy state and the toast"
        drawer={{ values: FORM_VALUES, props: FORM_PROPS, code: FORM_CODE }}
      >
        <Anatomy ground="container" layout="stack" pins={WAITLIST_PINS} label="Waitlist line anatomy" isolateKeys>
          <Waitlist />
        </Anatomy>
      </Spec>

      <Spec
        title="Validation flow"
        source={FIELD}
        props="error"
        role="An error waits for the visitor to leave the field and clears as soon as the value is right, so typing is never scolded."
      >
        <Canvas ground="container" layout="stack" label="Validation steps">
          <WaitlistFlow />
        </Canvas>
      </Spec>

      <Spec
        title="Sign in"
        source={DIALOG}
        props="title footer children"
        role="Two fields, the remember choice beside its way out, and one full-width action, because signing in is a single task."
        caption="Dialog inline · Show changes the field's type and its own name"
      >
        <Anatomy ground="page" layout="stack" pins={SIGN_IN_PINS} label="Sign in anatomy" isolateKeys>
          <SignIn />
        </Anatomy>
      </Spec>

      <Spec
        title="Contact"
        source={{ from: "@/components/design-system/Select", name: "Select" }}
        props="options maxLength"
        role="Labels above, 20 between fields and 32 before the actions, so every form on the site reads down the same way."
        caption="the topics are the three jobs · the counter shows from the first keystroke"
      >
        <Anatomy ground="page" layout="stack" pins={CONTACT_PINS} label="Contact form anatomy" minHeight={520} isolateKeys>
          <Contact />
        </Anatomy>
      </Spec>

      <DoDont>
        <Do ground="container" reason="On the grey a white card gives the field its own ground, so its white reads as a field.">
          <div className={s["ds-fm-bare"]}>
            <Card tone="surface">
              <Email />
            </Card>
          </div>
        </Do>
        <Dont ground="container" reason="Straight on the grey the white field reads as a hole in the section rather than a place to type.">
          <div className={s["ds-fm-bare"]}>
            <Email />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The error says what to type, so the fix is in the message.">
          <div className={s["ds-fm-bare"]}>
            <Email error={ERRORS.helpful} />
          </div>
        </Do>
        <Dont reason="An error that only says no leaves the visitor to guess what the field wanted.">
          <div className={s["ds-fm-bare"]}>
            <Email error={ERRORS.bare} />
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
