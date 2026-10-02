### Toast

**Purpose.** A short, passing word that something happened: a link copied, a run saved, an answer that failed to load. The site has none today, and its locked controls give no feedback at all. A toast confirms an outcome the visitor caused without taking them away from what they were doing. It is never the only record of an outcome that matters: a saved run also shows in the list, a failed answer also shows in its own view.

**Anatomy.** A navy #0a152d panel at radius 16, the terminal window's, with padding 14 by 16, a 52 minimum height and the float shadow. Left to right: an 18px status icon, the title (Inter 14/20 at 500, white), an optional body under it (13/18 at white 75%), an optional text action (13 at 500 in the lifted accent #6ea8ff, white on hover) and a 28px close.

**Variants.** Four tones. Success takes a CircleCheck in #5fd38d, error a CircleAlert in #ff8a80, info an Info in #6ea8ff, and loading a 16px spinner in white at 80%. The tones change only the icon and its colour, each lifted so it reads on navy, and never the panel. A colour that only works on white (the danger red #d92d20, the accent #1a6dff) would fail on navy.

**Sizes.** One. A toast stands at least 52 tall in its column and grows with a body line. The column's width is under Placement.

**Placement.** Bottom centre, 24 up, at min(420px, 100vw - 32px) wide. Under md the stack spans the width, and BackToTop sits at bottom 16 right 16 as a 40px disc, so the stack rises to 64 plus the safe area and clears it by 8. From md the 420 column is well clear of BackToTop at bottom right. Bottom centre keeps the stack away from the header and from the hero's top-left copy.

**Stacking.** Three at most on screen, the newest nearest the edge. The older ones tuck 8 up behind it, each step 0.04 smaller and 0.1 fainter, so a burst reads as one object. Hover or focus inside fans them out 8 apart. A fourth waits until one leaves.

**Timing.** 5s on screen. A toast with an action stays until it is dismissed, because its only keyboard path is the hotkey and no timer can know how long a visitor needs to reach it (WCAG 2.2.1). Errors and loading never leave on their own either: an error may need the visitor, and loading turns into success or error in place. Hover or focus inside the stack holds every clock, so a toast never leaves while it is being read.

**States.** Entering, visible, held (hover or focus), leaving, swiped and, for a task, loading turning into success or error in place. The action and the close each have rest, hover, focus-visible and pressed.

**Props.** `toast({ tone, title, body, action, duration })` returns an id. `toast.update(id, patch)` changes a toast in place and restarts its time, `toast.dismiss(id)` removes it, and `toast.promise(work, { loading, success, error })` runs the loading-to-result pattern. Mount `Toaster` once near the root, and `TOAST_HOTKEY` names its key. The `Toast` part itself takes `tone`, `title`, `body`, `action` and `onDismiss`. `ToastStack` draws the stack the Toaster holds: `items`, `onDismiss`, `live` (timers and swipe, off for a still stack in the guide), `expanded` (held fanned out), `hotkey` (written on the front toast's first control) and `className`. A page never mounts ToastStack itself.

**Motion.** In: 16px up, from scale 0.98, with opacity, on the pop spring (stiffness 460, damping 34, mass 0.7), the spring the site's menus open on. Out: 8px down and fading over 160ms on the ease in. The stack's shifts ride the same spring. Under reduced motion every change is a 140ms fade (`--ds-dur-exit`).

**Accessibility.** The Toaster mounts two hidden live regions before any toast exists: a polite status for success, info and loading, and an alert for errors. They carry the words, so a screen reader hears each outcome once whatever is on screen. A toast never takes focus. Its controls sit in the "Notifications" region at the end of the body, so Tab reaches them only after the rest of the page. Alt+T moves focus to the front toast's first control (the region carries `aria-keyshortcuts`), and a toast with an action names that route in the words it speaks ("Try again available, press Alt+T"), so a screen reader hears how to reach the button. Every toast action also exists on the page itself (a Try again on the failed part, the saved run in its list), and the toast is only the quick route. The action and the close take the dark ring #6ea8ff, because the accent ring would vanish on navy.

**With a dialog.** A toast fired while a modal dialog is open sits under it, for the reason in Dialog and sheet (7.25). Toast a dialog's outcome once the dialog has closed.

**Responsive.** The width and the lift change under md as above. On a coarse pointer the front toast swipes away down 40px, the gesture phone notifications already teach.

**Do / Don't.**
- Do confirm an outcome the visitor caused, in a few words.
- Do give an error an action (Try again) and let it stay until closed.
- Do keep one action at most, and give it a twin on the page.
- Don't use a toast for a step the visitor must take to go on, which belongs in a dialog.
- Don't fire a toast while a dialog is open.
- Don't let a toast be the only place an outcome is recorded.
