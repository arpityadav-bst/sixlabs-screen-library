"use client";

// A dialog footer action that follows the dialog's busy state, so the caller passes busy once, to the
// Dialog, and the footer keeps step: while the work runs the primary spins (loading) and every other
// action holds (disabled), as the close, Escape, the veil and the drag do. Outside a Dialog it is a plain
// Button. A footer of plain Buttons stays the caller's to hold.
import { createContext, useContext } from "react";
import { Button, type ButtonProps } from "./Button";

/** The open dialog's busy state, provided round its footer by DialogPanel. */
export const DialogBusyContext = createContext(false);

/** True while the dialog round this part is busy. */
export function useDialogBusy(): boolean {
  return useContext(DialogBusyContext);
}

export type DialogActionProps = ButtonProps & {
  /** the dialog's primary: it spins while busy. Every other action holds. */
  primary?: boolean;
};

export function DialogAction({ primary = false, disabled, loading, ...rest }: DialogActionProps) {
  const busy = useDialogBusy();
  return <Button {...rest} disabled={disabled || (busy && !primary)} loading={loading || (busy && primary)} />;
}
