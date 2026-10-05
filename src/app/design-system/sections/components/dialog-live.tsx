"use client";

// The live dialogs: a trigger that runs the real modal (a native dialog with showModal). Confirming turns the
// dialog busy for 1.2s, which holds every way out (the footer follows through DialogAction), then closes.
// The outcome is held until onClosed, once the exit is done and the modal has left the top layer, since
// the rest of the page (the Toaster's live regions with it) stays inert while the dialog is modal.
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/design-system/Button";
import { Dialog } from "@/components/design-system/Dialog";
import { DialogAction } from "@/components/design-system/DialogAction";
import { TextInput } from "@/components/design-system/TextInput";
import { toast } from "@/components/design-system/toast-store";
import { REMOVE, REQUEST } from "./dialog-data";

const WORK_MS = 1200;

export type DialogDemoKind = "form" | "alert" | "sheet";

export function DialogDemo({ kind, label }: { kind: DialogDemoKind; label?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  // the outcome to toast once the dialog is gone, empty after a cancel
  const outcome = useRef("");
  useEffect(() => {
    const t = timer;
    return () => window.clearTimeout(t.current);
  }, []);

  const alert = kind === "alert";
  const copy = alert ? REMOVE : REQUEST;
  const confirm = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      outcome.current = alert ? "Player removed" : "Request sent";
      setOpen(false);
    }, WORK_MS);
  };
  const closed = () => {
    if (outcome.current) toast({ tone: "success", title: outcome.current });
    outcome.current = "";
  };

  return (
    <>
      <Button variant={alert ? "destructive" : "primary"} onClick={() => setOpen(true)}>
        {label ?? (alert ? copy.confirm : kind === "sheet" ? "Open sheet" : "Open dialog")}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        onClosed={closed}
        title={copy.title}
        description={copy.description}
        size={alert ? "sm" : "md"}
        role={alert ? "alertdialog" : "dialog"}
        presentation={kind === "sheet" ? "sheet" : "auto"}
        busy={busy}
        footer={
          <>
            <DialogAction variant="secondary" onClick={() => setOpen(false)}>
              {copy.cancel}
            </DialogAction>
            <DialogAction primary variant={alert ? "destructivePrimary" : "primary"} onClick={confirm}>
              {copy.confirm}
            </DialogAction>
          </>
        }
      >
        {!alert && <TextInput label="Work email" type="email" autoComplete="email" placeholder="you@studio.com" />}
      </Dialog>
    </>
  );
}
