// The foot of the shell in frames: the footer, back to top, the scroll cue and the language menu open.
// Each needs a true viewport (the footer's word is sized in vw and its picture switches at md), a real
// window scroll (back to top, the cue) or a real click (the language panel's open state is internal).
import { BackToTop } from "@/components/website/BackToTop";
import { ClickLock } from "@/components/website/ClickLock";
import { Footer } from "@/components/website/Footer";
import { LanguageMenu } from "@/components/website/LanguageMenu";
import { ScrollCue } from "@/components/website/ScrollCue";
import { GrainLead } from "./page-column";
import { ClickFirst, ScrollTo, Spacer } from "./shell-signals";

/** The real Footer on the noise ground, inside the page's own side padding, which its margins cancel. It ends
 *  the page's grained block, so its grain starts past its fade (GrainLead). */
export function FooterPart() {
  return (
    <GrainLead className="px-4 md:px-8">
      <Footer />
      <ClickLock />
    </GrainLead>
  );
}

/** A page with a stand-in scroll line (#model-line) and a footer far below, for BackToTop's rule. */
function LinePage() {
  return (
    <>
      <div id="model-line" style={{ height: "150vh" }} />
      <Spacer vh={300} />
      <footer style={{ height: "50vh" }} />
      <BackToTop />
    </>
  );
}

/** Scrolled past the line's end, so the button shows. ?y=0 gives the hidden state. */
export function BackToTopPart() {
  return (
    <>
      <LinePage />
      <ScrollTo y={[260, 240]} />
    </>
  );
}

/** A phone scrolled down and then a little up, the one moment it shows there. ?y=1400 (down only) hides it. */
export function BackToTopPhonePart() {
  return (
    <>
      <LinePage />
      <ScrollTo y={[1400, 1360]} />
    </>
  );
}

/** The cue held in the middle of the frame while the page under it scrolls. */
function CuePage() {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center" }}>
        <ScrollCue />
      </div>
      <Spacer vh={300} />
    </>
  );
}

/** At scroll 0: present. */
export function ScrollCuePart() {
  return <CuePage />;
}

/** Past 40px of scroll: away. */
export function ScrollCueAwayPart() {
  return (
    <>
      <CuePage />
      <ScrollTo y={41} />
    </>
  );
}

/** The language menu at a bar's right edge, opened by a real click. ?open=0 leaves it closed. */
export function LanguagePart() {
  return (
    <div className="page-grain" style={{ minHeight: "100vh", display: "flex", justifyContent: "flex-end", padding: 24 }}>
      <div>
        <LanguageMenu />
      </div>
      <ClickFirst selector='button[aria-haspopup="listbox"]' />
    </div>
  );
}
