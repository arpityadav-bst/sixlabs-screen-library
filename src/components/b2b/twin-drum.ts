// The stage's geometry and opening, apart from its running (twin-stage.ts).
// The panorama, after onBlue's businesses hero (onblue-vesper/brands.html, the sample ring): the stage is laid
// out flat, then seen on the inside of a cylinder, its middle the far point. A point s from the middle sits at
// angle s / R; the perspective divide (perspective PERSP x R) scales it by K(a), 1 at the far middle and
// growing toward the ends, which leave the screen EDGE_A round. A drum a little more than onBlue's ring (its 1.8
// and 63 degrees): the viewer nearer the drum, so the ends swell more and curve further round. Heights grow by
// K; widths are held back a little by the turn (TURN_BY), so the figures stand taller, turned toward you.
export const PERSP = 1.4;
export const EDGE_A = 1.15; // about 66 degrees
export const TURN_BY = 0.2;
export const K = (a: number) => (PERSP + 1) / (PERSP + Math.cos(a));
export const EDGE_K = K(EDGE_A); // the ends' scale, where the drum leaves the screen
// how wide a picture at angle a draws: the curve's own stretch, less its turn away from the viewer
export const TURN = (a: number) => ((PERSP + 1) * (PERSP * Math.cos(a) + 1)) / (PERSP + Math.cos(a)) ** 2 * (1 - TURN_BY + TURN_BY * Math.cos(a));

export const hash = (a: number, b: number, c = 0) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
export const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

// The opening, after onBlue's dark hero's hands (onblue-dark-v1: the art shown through a ring opening out from
// where the fingers meet): the stage shows through a ring opening out from the middle of the model's line,
// soft-edged (REVEAL_EDGE px), easing out over REVEAL_S, its front a faint blue wave.
export const REVEAL_DELAY = 0.1; // s after the stage is first drawn
export const REVEAL_S = 1.9;
export const REVEAL_EDGE = 160;
// the ring's radius, s seconds after the stage was first drawn
export const revealRadius = (s: number, w: number, h: number) => {
  const k = Math.min(1, Math.max(0, (s - REVEAL_DELAY) / REVEAL_S));
  return (1 - (1 - k) ** 3) * (Math.hypot(w / 2, h / 2) + REVEAL_EDGE);
};
// how far a point d px from the ring's middle is shown, with the ring at rr
export const revealed = (d: number, rr: number) => smooth(rr, rr - REVEAL_EDGE, d);
