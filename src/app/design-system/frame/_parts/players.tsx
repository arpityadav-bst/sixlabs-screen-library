// Frame part "players": the real players section on a solid accent ground, the way the page reaches it.
// The section is pulled up a screen over the scroll line (-mt-[100vh]), so a screen of room sits above it,
// and it waits for the water, so the "accentwave" event with filled true is sent once it is listening. The
// signal sits after the section, so its effect runs after the section's listener is on. The frame is its own
// document, so #players renders here and its snap magnet stays inside the frame.
import { ClickLock } from "@/components/website/ClickLock";
import { Players } from "@/components/website/Players";
import { Ground, Signal, Spacer } from "./shell-signals";
import s from "./pattern-frames.module.css";

export function PlayersPart() {
  return (
    <main className={s["ds-pf-page"]}>
      <Ground tone="accent" />
      <ClickLock />
      <Spacer vh={100} />
      <Players />
      <Signal name="accentwave" detail={{ filled: true }} />
    </main>
  );
}
