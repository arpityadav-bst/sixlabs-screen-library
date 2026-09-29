// A prism's spread, shared by every chromatic sweep on the site (the Try now button, the floating
// character badges): the spectrum in order, red leading and violet trailing.
export const SPECTRUM = [
  "#ff3b3b",
  "#ff8a1f",
  "#ffe14d",
  "#46f08c",
  "#2fdcff",
  "#3d7bff",
  "#9b5cff",
];

// The same spectrum as hard-edged stripes for a CSS background, red on the right (leading a left-to-right
// sweep), violet on the left.
export const SPECTRUM_STRIPES = `linear-gradient(90deg, ${[...SPECTRUM]
  .reverse()
  .map(
    (c, k, a) => `${c} ${(k / a.length) * 100}% ${((k + 1) / a.length) * 100}%`,
  )
  .join(", ")})`;
