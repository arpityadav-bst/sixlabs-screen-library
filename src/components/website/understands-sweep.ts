// The laser's geometry for the rewriting sentence (Understands.tsx), in the text block's own pixels: a flat
// scan line (text is flat, so no dome: it reads as a scanner re-printing the line) that rises from under
// the block to above it as `s` runs 0..1, with a band BAND deep centred on it. For each version of a row it
// gives the clip-path that shows it above the line, below it, or within the band, and the line's height in
// that row's own box, for the laser that lights only the letters it crosses.

const BAND = 0.5; // the band's depth, a share of the block's height (at least MIN_BAND px)
const MIN_BAND = 70;

export function sweepGeometry(box: HTMLElement, s: number) {
  const H = box.offsetHeight;
  const band = Math.max(MIN_BAND, BAND * H);
  // the line: from the whole band under the block to the whole band above it
  const line = H + band / 2 - s * (H + band);
  // a height in the block, as a share of `el`'s own box, in %
  const at = (el: HTMLElement, y: number) =>
    ((y - el.offsetTop) / el.offsetHeight) * 100;
  return {
    above: (el: HTMLElement) =>
      `inset(0 0 ${Math.max(0, 100 - at(el, line))}% 0)`,
    below: (el: HTMLElement) => `inset(${Math.max(0, at(el, line))}% 0 0 0)`,
    band: (el: HTMLElement) =>
      `inset(${Math.max(0, at(el, line - band / 2))}% 0 ${Math.max(0, 100 - at(el, line + band / 2))}% 0)`,
    // the line's height inside `el`, px
    y: (el: HTMLElement) => line - el.offsetTop,
  };
}
