"use client";

// Moving the reader to a section, and saying a result out loud, shared by the jump field, the drawer and the
// copy controls.

/** Scrolls to a section through its hash (again, when the hash already names it). */
export function scrollToSection(id: string) {
  if (window.location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView({ block: "start" });
  else window.location.hash = id;
}

/** Scrolls to a section, then focuses its h2, so focus moves with the reader. */
export function goTo(id: string) {
  scrollToSection(id);
  focusHeading(id);
}

/** Focuses a section's h2 (tabIndex -1, Section.tsx) two frames on, after a closing drawer has handed focus
 *  back, without scrolling it again. */
export function focusHeading(id: string) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.getElementById(`${id}-h`)?.focus({ preventScroll: true })),
  );
}

/** The id of the guide's one polite status region (GuideShell), always mounted, so a message is announced. */
export const ANNOUNCER_ID = "ds-announce";

/** Says a short message through the guide's status region ("Copied", "Copy failed"). The region is cleared
 *  first, so the same message twice is announced twice. */
export function announce(message: string) {
  const el = document.getElementById(ANNOUNCER_ID);
  if (!el) return;
  el.textContent = "";
  window.setTimeout(() => {
    el.textContent = message;
  }, 60);
}
