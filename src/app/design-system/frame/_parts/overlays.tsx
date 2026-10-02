"use client";

// Frame parts for the overlays, each on its own page so the frame's width is the viewport they answer to.
// toast-stack: the real Toaster with two toasts held on screen, beside the real BackToTop (shown by a scroll
// down and back up past a stand-in scroll line), so the stack's clearance can be read at every width.
// dialog-auto: the Dialog in place with presentation auto over the veil's colour, a centred panel from md
// and a bottom sheet below. It renders inline, because a modal opened inside a frame would pull focus out of
// the guide.
import { useEffect } from "react";
import { BackToTop } from "@/components/website/BackToTop";
import { Button } from "@/components/design-system/Button";
import { Dialog } from "@/components/design-system/Dialog";
import { Toaster } from "@/components/design-system/Toaster";
import { toast } from "@/components/design-system/toast-store";
import { ScrollTo, Spacer } from "./shell-signals";

export function ToastStackPart() {
  useEffect(() => {
    const ids = [
      toast({ tone: "success", title: "Run saved", duration: Infinity }),
      toast({
        tone: "info",
        title: "New run ready",
        body: "The model finished reading 2,163 sessions.",
        action: { label: "View" },
        duration: Infinity,
      }),
    ];
    return () => ids.forEach((id) => toast.dismiss(id));
  }, []);
  return (
    <>
      <div id="model-line" style={{ height: "150vh" }} />
      <Spacer vh={300} />
      <BackToTop />
      <Toaster />
      <ScrollTo y={[1400, 1360]} />
    </>
  );
}

export function DialogAutoPart() {
  return (
    <div style={{ height: "100svh", background: "var(--ds-color-veil-modal)" }}>
      <Dialog
        inline
        presentation="auto"
        size="md"
        title="Request access"
        description="Every studio that joins makes the model better for every studio after it."
        footer={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button>Request access</Button>
          </>
        }
      />
    </div>
  );
}
