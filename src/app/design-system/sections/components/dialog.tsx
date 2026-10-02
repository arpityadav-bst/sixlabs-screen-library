// Dialog and sheet: the panel in place at its three widths, the confirm, the sheet, each state, the motion
// and the real modal, then the auto presentation framed at true widths. The reasons live in DESIGN.md 7.25.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { EaseDemo } from "@/app/design-system/_kit/EaseDemo";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Button } from "@/components/design-system/Button";
import { Dialog, type DialogPresentation, type DialogSize, type DialogState } from "@/components/design-system/Dialog";
import { DialogAction } from "@/components/design-system/DialogAction";
import { EASE } from "@/components/design-system/motion";
import { TextInput } from "@/components/design-system/TextInput";
import {
  DIALOG_CODE,
  DIALOG_PINS,
  DIALOG_PROPS,
  DIALOG_STATES,
  DIALOG_VALUES,
  POP,
  REMOVE,
  REQUEST,
  SHEET,
  SHEET_PINS,
  SHEET_STATES,
  SIZES,
} from "./dialog-data";
import { DialogDemo } from "./dialog-live";
import styles from "./overlays.module.css";

const SOURCE = { from: "@/components/design-system/Dialog", name: "Dialog" };

function Request({
  size = "md",
  state,
  presentation = "dialog",
  field = false,
}: {
  size?: DialogSize;
  state?: DialogState;
  presentation?: DialogPresentation;
  field?: boolean;
}) {
  return (
    <Dialog
      inline
      size={size}
      presentation={presentation}
      forceState={state}
      title={REQUEST.title}
      description={REQUEST.description}
      footer={
        <>
          <DialogAction variant="secondary">{REQUEST.cancel}</DialogAction>
          <DialogAction primary>{REQUEST.confirm}</DialogAction>
        </>
      }
    >
      {field && <TextInput label="Work email" type="email" placeholder="you@studio.com" />}
    </Dialog>
  );
}

function Remove({ yesNo = false }: { yesNo?: boolean }) {
  return (
    <Dialog
      inline
      size="sm"
      role="alertdialog"
      title={yesNo ? "Are you sure?" : REMOVE.title}
      description={yesNo ? undefined : REMOVE.description}
      footer={
        <>
          <Button variant="secondary">{yesNo ? "No" : REMOVE.cancel}</Button>
          <Button variant="destructivePrimary">{yesNo ? "Yes" : REMOVE.confirm}</Button>
        </>
      }
    />
  );
}

export function DialogSection() {
  return (
    <Section
      id="dialog"
      lead="A blocking task or a confirm in a white panel over a solid veil, and the bottom sheet it becomes on a phone."
    >
      <Sub title="Dialog">
        <Spec
          level={4}
          title="Dialog"
          source={SOURCE}
          props="title description footer children"
          role="Title, reason, the task, then the actions with the primary last on the right, where a left-to-right read ends."
          drawer={{ values: DIALOG_VALUES, props: DIALOG_PROPS, code: DIALOG_CODE }}
        >
          <Anatomy pins={DIALOG_PINS} ground="page" layout="stack" label="Dialog anatomy">
            <Request field />
          </Anatomy>
        </Spec>
        <Spec
          level={4}
          title="Sizes"
          source={SOURCE}
          props="size"
          role="Width follows the job, a confirm, a form or reading, so a short question never floats in a wide empty panel."
        >
          <SizeLadder
            axis="width"
            label="Dialog widths"
            sizes={SIZES.map((s) => ({
              name: `${s.size} · ${s.use}`,
              spec: s.px,
              node: (
                <div style={{ width: s.px }} className="max-w-full">
                  <Request size={s.size} />
                </div>
              ),
              select: "[data-part=panel]",
            }))}
          />
        </Spec>
        <Spec
          level={4}
          title="Alert dialog"
          source={SOURCE}
          props="role"
          role="A confirm names its action on both buttons and takes focus on the safe one, so Enter never removes anything by accident."
          caption="role alertdialog · the veil does not close it · try it live"
        >
          <Canvas ground="page" label="Alert dialog in place">
            <Remove />
          </Canvas>
          <Canvas ground="page" label="Live alert dialog">
            <DialogDemo kind="alert" />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="States"
          source={SOURCE}
          props="open busy"
          role="While the work runs the primary spins and every way out is held, so a half-sent request cannot be dropped."
        >
          <StateGrid
            label="Dialog states"
            states={DIALOG_STATES}
            minCell={340}
            liveCaption="opens the real modal"
            render={({ force }) =>
              force === undefined ? (
                <DialogDemo kind="form" />
              ) : force === "closed" ? (
                <Button>Open dialog</Button>
              ) : (
                <Request size="sm" state={force} />
              )
            }
          />
        </Spec>
        <Spec
          level={4}
          title="Motion"
          source={SOURCE}
          role="The veil fades on the mobile menu's timing while the panel pops on the shared spring, and leaving is always quicker than arriving."
        >
          <Canvas ground="page" layout="grid" label="Dialog motion">
            <EaseDemo label="Veil" ease={EASE} duration={0.25} />
            <EaseDemo label="Panel pop" ease={POP} />
            <EaseDemo label="Sheet rise" ease={SHEET} />
          </Canvas>
        </Spec>
      </Sub>
      <Sub title="Sheet">
        <Spec
          level={4}
          title="Sheet"
          source={SOURCE}
          props="presentation"
          role="On a phone the panel docks to the bottom edge, in reach of the thumb, with its primary on top of a full-width stack."
        >
          <Anatomy pins={SHEET_PINS} ground="page" label="Sheet anatomy">
            <div className={`${styles["ds-sheet-box"]} ${styles["ds-phone"]}`}>
              <Request presentation="sheet" />
            </div>
          </Anatomy>
        </Spec>
        <Spec
          level={4}
          title="Sheet states"
          source={SOURCE}
          role="The handle darkens under the thumb and the sheet follows it down, closing once it is pulled well down or flicked."
        >
          <StateGrid
            label="Sheet states"
            states={SHEET_STATES}
            minCell={380}
            liveCaption="opens the real sheet"
            render={({ force }) =>
              force === undefined ? (
                <DialogDemo kind="sheet" />
              ) : force === "closed" ? (
                <Button>Open sheet</Button>
              ) : (
                <div className={`${styles["ds-sheet-box"]} ${styles["ds-phone"]}`}>
                  <Request presentation="sheet" state={force === "dragging" ? "dragging" : undefined} />
                </div>
              )
            }
          />
        </Spec>
        <Spec
          level={4}
          title="Across widths"
          source={SOURCE}
          props="presentation"
          role="With presentation auto the same dialog centres from md and docks as a sheet below it, read here in a frame."
          caption="375 · 768 · 1280 · the frame's own media query picks the presentation"
        >
          <Canvas ground="container" layout="stack">
            <ViewportPreview part="dialog-auto" title="Dialog with presentation auto" height={640} widths={[375, 768, 1280]} />
          </Canvas>
        </Spec>
      </Sub>
      <DoDont>
        <Do reason="A verb on each button says what each press does, so the visitor can act without rereading the question." ground="page">
          <Remove />
        </Do>
        <Dont reason="Yes and No send the visitor back to the title to learn what they agree to, and Yes then removes a player.">
          <Remove yesNo />
        </Dont>
      </DoDont>
    </Section>
  );
}
