// The laser's geometry for the rewriting sentence (Understands.tsx), in the text block's own pixels: a line
// shaped as a low dome (its middle ahead of its ends, as in the portrait swap, PortraitSwap.tsx) that rises
// from under the block to above it as `s` runs 0..1, with a band BAND deep centred on it. For each version
// of a row it gives the clip-path that shows it above the line, below it, or within the band, and the
// laser's own path.

const BAND = 0.5; // the band's depth, a share of the block's height (at least MIN_BAND px)
const MIN_BAND = 70;
const RISE = 0.3; // how far the dome's middle stands above its ends, a share of the block's height
const STEPS = 40; // points along the line
const OVERHANG = 24; // px the laser runs past the block's sides

export function sweepGeometry(box: HTMLElement, s: number) {
  const W = box.offsetWidth,
    H = box.offsetHeight;
  const band = Math.max(MIN_BAND, BAND * H),
    rise = RISE * H;
  // the dome's top: from the whole band under the block to the whole band above it
  const mid = H + band / 2 - s * (H + band + rise);
  // the line's height at x: an ellipse, flat on top and steep at the sides
  const lineY = (x: number) => {
    const u = Math.min(1, Math.abs((2 * x) / W - 1));
    return mid + rise * (1 - Math.sqrt(1 - u * u));
  };
  // the line, `off` px lower, as clip-path points in `el`'s own box, left to right
  const points = (el: HTMLElement, off: number) =>
    Array.from({ length: STEPS + 1 }, (_, i) => {
      const x = (i / STEPS) * el.offsetWidth;
      const y = ((lineY(x) + off - el.offsetTop) / el.offsetHeight) * 100;
      return `${(i / STEPS) * 100}% ${y}%`;
    });
  let line = "";
  for (let i = 0; i <= STEPS; i++) {
    const x = -OVERHANG + (i / STEPS) * (W + 2 * OVERHANG);
    line += `${i ? "L" : "M"} ${x} ${lineY(x)} `;
  }
  return {
    above: (el: HTMLElement) =>
      `polygon(0% 0%, 100% 0%, ${points(el, 0).reverse().join(", ")})`,
    below: (el: HTMLElement) =>
      `polygon(${points(el, 0).join(", ")}, 100% 100%, 0% 100%)`,
    band: (el: HTMLElement) =>
      `polygon(${points(el, -band / 2).join(", ")}, ${points(el, band / 2)
        .reverse()
        .join(", ")})`,
    line,
  };
}
