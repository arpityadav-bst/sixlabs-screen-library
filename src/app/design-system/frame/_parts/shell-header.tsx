// The header's frame parts. The bar's states come from the window (its scroll, HERO_LOADED,
// "accentwave") and from viewport media queries, so each state is the real Header in a bare page of its
// own, reached the way the live page reaches it. ClickLock is mounted, as on both website pages, so the
// lockup and the tabs keep their hover and do not glide.
import type { CSSProperties } from "react";
import { ClickLock } from "@/components/website/ClickLock";
import { Header } from "@/components/website/Header";
import { src } from "@/components/website/floating-badges-data";
import { HERO_LOADED } from "@/components/website/hero-intro";
import { ClickFirst, Ground, ScrollTo, Signal, Spacer } from "./shell-signals";

/** At the top of the page: the page ground at 92%, the stroke transparent. */
export function HeaderRest() {
  return (
    <>
      <Header />
      <Spacer vh={300} />
      <ClickLock />
    </>
  );
}

/** Past 4px of scroll: the faint bottom stroke. */
export function HeaderScrolled() {
  return (
    <>
      <Header />
      <Spacer vh={300} />
      <ScrollTo y={8} />
      <ClickLock />
    </>
  );
}

/** The accent water has filled the view: a solid white bar, the stroke still following the scroll. */
export function HeaderOnBlue() {
  return (
    <>
      <Ground tone="accent" />
      <Header />
      <Spacer vh={300} />
      <ScrollTo y={8} />
      <Signal name="accentwave" detail={{ filled: true }} />
      <ClickLock />
    </>
  );
}

// two of the full view's float tiles, so the clear bar shows what runs under it. Their paths come from the
// site's own src(), cache key included, so a stale cached tile never shows.
const TILE: CSSProperties = { position: "absolute", top: 12, width: 120, height: 120, borderRadius: 24 };
const TILES = [
  { src: src("01-snapback"), left: "18%" },
  { src: src("11-blue-hair"), left: "64%" },
];

function FloorStill() {
  return (
    <Ground tone="container">
      {TILES.map((t) => (
        // eslint-disable-next-line @next/next/no-img-element -- a still under the bar, no optimisation needed
        <img key={t.src} src={t.src} alt="" style={{ ...TILE, left: t.left }} />
      ))}
    </Ground>
  );
}

/** The full view at its top once loading has ended: no ground, the floor reads edge to edge. */
export function HeaderClearTop() {
  return (
    <>
      <FloorStill />
      <Header clear />
      <Spacer vh={300} />
      <Signal name={HERO_LOADED} />
      <ClickLock />
    </>
  );
}

/** The full view while its loader shows: the bar is there but invisible, until HERO_LOADED. */
export function HeaderClearHeld() {
  return (
    <>
      <FloorStill />
      <Header clear />
      <Spacer vh={300} />
      <ClickLock />
    </>
  );
}

/** The bar as a phone draws it, at rest (the frame's width makes it the phone bar). */
export const HeaderPhone = HeaderRest;

/** The phone sheet, opened by a real click on the menu button. */
export function MenuOpen() {
  return (
    <>
      <Header />
      <Spacer vh={300} />
      <ClickFirst selector='[aria-label="Open menu"]' />
      <ClickLock />
    </>
  );
}
