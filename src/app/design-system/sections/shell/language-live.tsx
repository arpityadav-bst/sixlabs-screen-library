"use client";

// A live LanguageMenu inside a LayoutGroup of its own, so its gliding highlight (layoutId "lang-highlight")
// never jumps to another mounted menu. Each section that mounts one passes its own group id. The guide
// mounts three, and Tab leaves a panel open (a recorded gap), so focus coming into one copy closes any
// other copy still open, through that menu's own Escape. Two open lists would both write ids lang-0 to
// lang-3, and each aria-activedescendant would then resolve to the first.
import { useEffect, useRef } from "react";
import { LayoutGroup } from "motion/react";
import { LanguageMenu } from "@/components/website/LanguageMenu";

const copies = new Set<HTMLElement>();

/** Closes every other mounted copy whose trigger is expanded. The Escape is dispatched on that trigger, so
 *  only its menu's onKeyDown reads it, and the isolateKeys canvas round it keeps it from window listeners. */
function closeOthers(own: HTMLElement) {
  copies.forEach((box) => {
    if (box === own) return;
    const open = box.querySelector('[aria-expanded="true"]');
    open?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });
}

export function LanguageLive({ group = "ds-lang" }: { group?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    copies.add(el);
    const onFocus = () => closeOthers(el);
    el.addEventListener("focusin", onFocus);
    return () => {
      el.removeEventListener("focusin", onFocus);
      copies.delete(el);
    };
  }, []);
  return (
    // display: contents, so the wrapper adds no box and the menu lays out as it did unwrapped
    <div ref={box} style={{ display: "contents" }}>
      <LayoutGroup id={group}>
        <LanguageMenu />
      </LayoutGroup>
    </div>
  );
}
