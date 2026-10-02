"use client";

// The one toast region. Mount it once near the root, before any toast, so its live regions exist when the
// first message lands. It renders into the body, because a transformed ancestor would trap a fixed child.
// Bottom centre at 24px, and under md 64px up: there the stack spans the width, and BackToTop's 40px disc
// sits at bottom 16 right 16, so the stack clears it by 8. Two hidden live regions carry the words, polite
// for most tones and assertive for errors, and neither steals focus. While a modal dialog is open the
// stack sits under the dialog's top layer, so a dialog's outcome is toasted once it has closed. A second
// Toaster renders nothing, so a layout and a page can both mount one safely. Alt+T moves focus to the front
// toast's first control, which is how a keyboard reaches an action: that control carries aria-keyshortcuts
// and an action toast's announcement names the key. Alt+T in a text field stays the field's (Option+T types
// a character on a Mac).
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ToastStack } from "./ToastStack";
import { TOAST_HOTKEY, toast, toastStore } from "./toast-store";

export { TOAST_HOTKEY } from "./toast-store";

const owners: symbol[] = [];
const ownerListeners = new Set<() => void>();

function subscribeOwners(listener: () => void) {
  ownerListeners.add(listener);
  return () => {
    ownerListeners.delete(listener);
  };
}

const REGION =
  "fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom,0px))] z-(--ds-z-toast) mx-auto " +
  "w-[min(420px,calc(100vw-32px))] md:bottom-6";

const dismiss = (id: string) => toast.dismiss(id);

export function Toaster({ className = "" }: { className?: string }) {
  const [me] = useState(() => Symbol("toaster"));
  const region = useRef<HTMLElement>(null);
  useEffect(() => {
    owners.push(me);
    ownerListeners.forEach((l) => l());
    return () => {
      owners.splice(owners.indexOf(me), 1);
      ownerListeners.forEach((l) => l());
    };
  }, [me]);
  const first = useSyncExternalStore(
    subscribeOwners,
    () => owners[0] === me,
    () => false,
  );
  const { items, said } = useSyncExternalStore(toastStore.subscribe, toastStore.get, toastStore.server);

  useEffect(() => {
    if (!first) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.code !== "KeyT") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const front = region.current?.querySelector<HTMLElement>("[data-toast] button");
      if (!front) return;
      e.preventDefault();
      front.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [first]);

  if (!first) return null;
  return createPortal(
    <section ref={region} aria-label="Notifications" className={`${REGION} ${className}`}>
      <ToastStack items={items} onDismiss={dismiss} hotkey={TOAST_HOTKEY} />
      <div role="status" aria-live="polite" className="sr-only">
        {!said.urgent && said.text && <p key={said.n}>{said.text}</p>}
      </div>
      <div role="alert" className="sr-only">
        {said.urgent && <p key={said.n}>{said.text}</p>}
      </div>
    </section>,
    document.body,
  );
}
