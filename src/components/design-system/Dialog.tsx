"use client";

// Blocking tasks and confirms. A native dialog opened with showModal, so the page behind is inert, Escape is
// a close request and focus stays inside with no hand-written trap. The veil is ink at 40% and never blurred.
// Focus lands on the first field, or on the least destructive action of an alertdialog (the first footer
// button, since the primary goes last), or on the primary, and goes back to the trigger on close. The page
// holds still while it is open, as MobileMenu holds it. Under md (or with presentation sheet) the panel is a
// bottom sheet that drags down to close. inline renders the panel alone in the flow, with no dialog, veil,
// trap or scroll hold, as a picture for the guide. busy holds the close, Escape, the veil and the drag, and
// reaches the footer through DialogAction (the primary spins, the rest hold). A close the browser makes on
// its own (a second Escape, which is not cancelable) is undone: the dialog opens again with focus where it
// was, and then closes through onOpenChange and its exit, or stays while busy.
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { DialogPanel, type DialogPanelProps } from "./DialogPanel";
import { NATIVE, type DialogSize } from "./dialog-styles";
import { EASE, SCALE, SPRING } from "./motion";
import { EASE_IN, OVERLAY, SHEET_SPRING } from "./overlay-motion";
import { MEDIA } from "./token-space";
import { useMedia } from "./use-media";

export type { DialogSize } from "./dialog-styles";
export type DialogRole = "dialog" | "alertdialog";
export type DialogPresentation = "auto" | "dialog" | "sheet";
export type DialogState = "closed" | "opening" | "open" | "busy" | "closing" | "dragging";

export type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  size?: DialogSize;
  /** alertdialog: a confirm. The veil does not close it. */
  role?: DialogRole;
  /** auto is a dialog from md and a sheet below */
  presentation?: DialogPresentation;
  /** the actions in reading order, the primary last. DialogAction parts follow busy on their own */
  footer?: ReactNode;
  /** the work is running: the close, Escape, the veil and the drag are held, and DialogAction parts follow */
  busy?: boolean;
  /** the element to focus on open, in place of the rule above */
  initialFocus?: RefObject<HTMLElement | null>;
  /** docs: the panel alone in the flow */
  inline?: boolean;
  /** docs, inline: one frame of a state */
  forceState?: DialogState;
  className?: string;
  children?: ReactNode;
};

const PHONE = MEDIA["max-md"];
/** a drag past this many px, or a flick, closes the sheet */
const DRAG_CLOSE = 96;
const FLICK = 600;

const hold = (on: boolean) => {
  document.documentElement.style.overflow = on ? "clip" : "";
};

function focusFirst(d: HTMLDialogElement, role: DialogRole, given?: HTMLElement | null) {
  const footer = d.querySelector("[data-dialog-footer]");
  const actions = footer ? Array.from(footer.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")) : [];
  const field = d.querySelector<HTMLElement>("[data-part=body] :is(input, select, textarea):not([disabled])");
  const target =
    given ??
    (role === "alertdialog" ? actions[0] : (field ?? actions[actions.length - 1])) ??
    d.querySelector<HTMLElement>("[data-part=panel]");
  target?.focus();
}

/** The panel's motion: a pop from 0.96 (SCALE.panel) and 8px down, a rise from the bottom edge as a sheet, a
 *  fade when reduced. */
function panelMotion(sheet: boolean, reduced: boolean): Partial<DialogPanelProps> {
  if (reduced) {
    const fade = { duration: OVERLAY.reducedFade };
    return { initial: { opacity: 0 }, animate: { opacity: 1, transition: fade }, exit: { opacity: 0, transition: fade } };
  }
  if (sheet) {
    return {
      initial: { y: "100%" },
      animate: { y: 0, transition: SHEET_SPRING },
      exit: { y: "100%", transition: { duration: OVERLAY.sheetOut, ease: EASE_IN } },
    };
  }
  return {
    initial: { opacity: 0, scale: SCALE.panel, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: SPRING.pop },
    exit: { opacity: 0, scale: SCALE.panel, transition: { duration: OVERLAY.dialogOut, ease: EASE_IN } },
  };
}

function useIds() {
  const id = useId();
  return { titleId: `${id}-title`, descId: `${id}-desc` };
}

export function Dialog(props: DialogProps) {
  return props.inline ? <InlineDialog {...props} /> : <ModalDialog {...props} />;
}

const FRAMES: Partial<Record<DialogState, { opacity?: number; scale?: number; y?: number }>> = {
  opening: { opacity: 0.6, scale: 0.98, y: 4 },
  closing: { opacity: 0.45, scale: 0.98 },
  dragging: { y: 48 },
};

function InlineDialog({ title, description, size = "md", presentation = "dialog", footer, busy = false, forceState, className = "", children }: DialogProps) {
  const ids = useIds();
  const phone = useMedia(PHONE);
  const sheet = presentation === "sheet" || (presentation === "auto" && phone);
  if (forceState === "closed") return null;
  return (
    // a picture, not a control: inert, so Tab never lands on its close or footer (the live specimens operate)
    <div inert data-part="stage" className={`flex h-full w-full justify-center ${sheet ? "items-end" : "items-center"} ${className}`}>
      <DialogPanel
        {...ids}
        title={title}
        description={description}
        size={size}
        role="group"
        heading={false}
        sheet={sheet}
        busy={busy || forceState === "busy"}
        dragging={forceState === "dragging"}
        footer={footer}
        initial={false}
        style={forceState ? FRAMES[forceState] : undefined}
      >
        {children}
      </DialogPanel>
    </div>
  );
}

function ModalDialog({
  open = false,
  onOpenChange,
  title,
  description,
  size = "md",
  role = "dialog",
  presentation = "auto",
  footer,
  busy = false,
  initialFocus,
  className = "",
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLElement | null>(null);
  // the last element focused inside, and whether the next close event is the dialog's own (finish)
  const inside = useRef<HTMLElement | null>(null);
  const ours = useRef(false);
  const ids = useIds();
  const reduced = !!useReducedMotion();
  const phone = useMedia(PHONE);
  const sheet = presentation === "sheet" || (presentation === "auto" && phone);
  const drag = useDragControls();
  const [dragging, setDragging] = useState(false);
  const close = () => {
    if (!busy) onOpenChange?.(false);
  };

  useLayoutEffect(() => {
    const d = ref.current;
    if (!d || !open || d.open) return;
    back.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    d.showModal();
    hold(true);
    focusFirst(d, role, initialFocus?.current);
  }, [open, role, initialFocus]);

  useEffect(() => {
    const d = ref.current;
    return () => {
      if (d?.open) {
        ours.current = true;
        d.close();
      }
      hold(false);
    };
  }, []);

  const finish = () => {
    const d = ref.current;
    if (d?.open) {
      ours.current = true;
      d.close();
    }
    hold(false);
    back.current?.focus();
    back.current = null;
  };

  const dragProps: Partial<DialogPanelProps> = sheet
    ? {
        drag: "y",
        dragControls: drag,
        dragListener: false,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 1 },
        onDragStart: () => setDragging(true),
        onDragEnd: (_, info) => {
          setDragging(false);
          if (info.offset.y > DRAG_CLOSE || info.velocity.y > FLICK) close();
        },
        onHandleDown: (e) => {
          if (!busy) drag.start(e);
        },
      }
    : {};

  return (
    <dialog
      ref={ref}
      role={role === "alertdialog" ? "alertdialog" : undefined}
      aria-labelledby={ids.titleId}
      aria-describedby={description ? ids.descId : undefined}
      aria-busy={busy || undefined}
      className={NATIVE}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onFocus={(e) => {
        inside.current = e.target as HTMLElement;
      }}
      onClose={() => {
        const d = ref.current;
        if (ours.current || !open || !d) {
          ours.current = false;
          return;
        }
        // the browser closed it past onCancel: open it again, then close the dialog's own way, unless busy
        d.showModal();
        if (inside.current?.isConnected) inside.current.focus();
        else focusFirst(d, role, initialFocus?.current);
        close();
      }}
    >
      <AnimatePresence onExitComplete={finish}>
        {open && (
          <div key="stage" className="absolute inset-0">
            <motion.div
              aria-hidden
              data-part="veil"
              className="absolute inset-0 bg-(--ds-color-veil-modal)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: OVERLAY.veil, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: OVERLAY.dialogOut, ease: EASE_IN } }}
              onClick={() => {
                if (role === "dialog") close();
              }}
            />
            <div className={`pointer-events-none absolute inset-0 flex justify-center ${sheet ? "items-end" : "items-center p-4"}`}>
              <DialogPanel
                {...ids}
                {...panelMotion(sheet, reduced)}
                {...dragProps}
                title={title}
                description={description}
                size={size}
                heading
                sheet={sheet}
                busy={busy}
                dragging={dragging}
                footer={footer}
                onClose={close}
                tabIndex={-1}
                className={className}
              >
                {children}
              </DialogPanel>
            </div>
          </div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
