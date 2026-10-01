// Keeps the live floor smooth on a weaker GPU (an Intel Mac's built-in graphics, say). It times the floor's
// animated frames (the gaps between renders on consecutive frames) and, while their median over a stretch
// runs slower than SLOW_MS (about 45 fps), steps the work down: first the glass's see-through pass to half
// resolution (the frosted glass hides the difference), then the drawing resolution, x0.8 a step, down to
// MIN_RATIO. A fast GPU never trips it and keeps everything at full. It never steps back up: a sharpness that
// comes and goes reads worse than one that holds. onChange redraws the floor at the new resolution.
const SLOW_MS = 22, WINDOW = 36, MIN_RATIO = 0.8;

export function governFloor(renderer, composer, onChange) {
  let ratio = window.devicePixelRatio || 1, last = 0, gaps = [];
  const stepDown = () => {
    if (renderer.transmissionResolutionScale > 0.5) { renderer.transmissionResolutionScale = 0.5; return; }
    if (ratio <= MIN_RATIO) return;
    ratio = Math.max(MIN_RATIO, ratio * 0.8);
    onChange();
  };
  const render = composer.render.bind(composer);
  composer.render = (...args) => {
    const now = performance.now(), gap = now - last;
    last = now;
    if (gap >= 4 && gap < 120) gaps.push(gap); // consecutive frames only, not two renders in one frame
    if (gaps.length >= WINDOW) {
      const slow = gaps.sort((a, b) => a - b)[WINDOW >> 1] > SLOW_MS;
      gaps = [];
      if (slow) stepDown();
    }
    return render(...args);
  };
  return { get ratio() { return ratio; } };
}
