"use client";

// The live toasts, fired into the system Toaster that GuideShell mounts once for the whole guide: a success,
// an error that stays with its action, and a task that turns from loading to success in place.
import { Button } from "@/components/design-system/Button";
import { ButtonGroup } from "@/components/design-system/ButtonGroup";
import { toast } from "@/components/design-system/toast-store";

const RUN_MS = 1600;

const showSuccess = () => toast({ tone: "success", title: "Link copied" });

const showError = () =>
  toast({
    tone: "error",
    title: "The answer did not load",
    body: "Your question is saved.",
    action: { label: "Try again", onClick: showSuccess },
  });

const runTask = () => {
  void toast
    .promise(new Promise<void>((done) => window.setTimeout(done, RUN_MS)), {
      loading: "Saving the run",
      success: "Run saved",
      error: "The run did not save",
    })
    .catch(() => undefined);
};

export function ToastLive() {
  return (
    <ButtonGroup align="start">
      <Button variant="secondary" size="sm" onClick={showSuccess}>
        Show toast
      </Button>
      <Button variant="secondary" size="sm" onClick={showError}>
        Show an error
      </Button>
      <Button variant="secondary" size="sm" onClick={runTask}>
        Run a task
      </Button>
    </ButtonGroup>
  );
}
