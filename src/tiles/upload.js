// Pictures up to the GPU one per idle moment, each decoded off the main thread first, so a stream of them
// arriving never lands on one frame (a burst of uploads was a jerk in the auto-play's first activation).
// warm(texture) resolves with the texture once it is up; a texture asked for twice goes up once.
export const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 16)));

export function idleUploader(renderer, gone = () => false) {
  const up = new Map();
  let chain = Promise.resolve();
  return (t) => {
    if (!up.has(t)) {
      chain = chain.then(async () => {
        try {
          await t.image?.decode?.().catch(() => {});
          await idle();
          if (!gone()) renderer.initTexture(t);
        } catch { /* it goes up on its first draw instead */ }
        return t;
      });
      up.set(t, chain);
    }
    return up.get(t);
  };
}
