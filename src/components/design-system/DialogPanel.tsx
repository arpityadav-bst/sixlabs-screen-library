"use client";

// The dialog's panel, shared by the modal and the inline picture: the header (title, description, the close
// at top 16 right 16), a body that scrolls inside the panel, and the footer row with the primary last. As a
// sheet it gains the drag handle, and its footer stacks at full width with the primary on top. The footer
// sits inside DialogBusyContext, so a DialogAction there holds or spins while the dialog is busy.
import { X } from "lucide-react";
import { motion, type HTMLMotionProps } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import {
  BODY,
  DESCRIPTION,
  DIALOG_WIDTH,
  FOOTER,
  HANDLE,
  HANDLE_ZONE,
  PANEL,
  PANEL_DIALOG,
  PANEL_SHEET,
  TITLE,
  type DialogSize,
} from "./dialog-styles";
import { DialogBusyContext } from "./DialogAction";
import { IconButton } from "./IconButton";

export type DialogPanelProps = Omit<HTMLMotionProps<"div">, "title" | "children" | "role"> & {
  titleId: string;
  descId: string;
  title: string;
  description?: ReactNode;
  size: DialogSize;
  /** the inline picture names itself as a group, the modal leaves its role to the native dialog */
  role?: "group";
  /** the title is the dialog's h2 in the modal, plain text in the inline picture */
  heading: boolean;
  sheet: boolean;
  busy: boolean;
  dragging?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  onHandleDown?: (e: PointerEvent<HTMLDivElement>) => void;
};

export function DialogPanel({
  titleId,
  descId,
  title,
  description,
  size,
  role,
  heading,
  sheet,
  busy,
  dragging,
  footer,
  children,
  onClose,
  onHandleDown,
  className = "",
  ...motionProps
}: DialogPanelProps) {
  const Title = heading ? "h2" : "p";
  return (
    <motion.div
      role={role}
      aria-labelledby={role ? titleId : undefined}
      aria-describedby={role && description ? descId : undefined}
      aria-busy={busy || undefined}
      data-part="panel"
      data-presentation={sheet ? "sheet" : "dialog"}
      className={`${PANEL} ${sheet ? PANEL_SHEET : `${PANEL_DIALOG} ${DIALOG_WIDTH[size]}`} ${className}`}
      {...motionProps}
    >
      {sheet && (
        <div data-part="handle-zone" className={HANDLE_ZONE} onPointerDown={onHandleDown}>
          <span data-part="handle" data-dragging={dragging || undefined} className={HANDLE} />
        </div>
      )}
      <div data-part="header" className="shrink-0 pr-12">
        <Title id={titleId} data-part="title" className={TITLE}>
          {title}
        </Title>
        {description && (
          <p id={descId} data-part="description" className={DESCRIPTION}>
            {description}
          </p>
        )}
      </div>
      <div data-part="close" className={`absolute right-4 ${sheet ? "top-6" : "top-4"}`}>
        <IconButton icon={X} label="Close" size="md" variant="ghost" disabled={busy} onClick={onClose} />
      </div>
      {children && (
        <div data-part="body" className={BODY}>
          {children}
        </div>
      )}
      {footer && (
        <div data-part="footer" data-dialog-footer="" className={sheet ? FOOTER.sheet : FOOTER.dialog}>
          <DialogBusyContext.Provider value={busy}>{footer}</DialogBusyContext.Provider>
        </div>
      )}
    </motion.div>
  );
}
