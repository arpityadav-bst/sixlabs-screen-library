// Load-in: the empty floor shows first, then the tiles and their busts fade in while rising out of it.
// The fade is a screen-space crossfade from a captured frame of the bare floor, so only the tiles
// change; the floor, fog and grain stay exactly as they are. The crossfade is the floor's last pass's own
// (lean.js, setIntro).
import * as THREE from 'three';

const ease = (t) => 1 - Math.pow(1 - t, 3);

// field: the group holding every tile and bust. Resolves once the intro has finished (or was cut short
// by a resize or dispose, in which case the field snaps to its final place).
// delay: seconds the bare floor holds before the tiles start (room for a page loader to leave first).
export function playIntro({ renderer, composer, field, rise, seconds = 0.9, delay = 0 }) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const base = new THREE.FramebufferTexture(size.x, size.y);
  const blend = (amount) => composer.setIntro(base, amount);

  // capture the bare floor, exactly as it will look under the tiles
  field.visible = false;
  composer.render();
  renderer.copyFramebufferToTexture(base);
  field.visible = true;

  let raf = 0, start = 0, over = false, drawn = false, finish;
  const end = () => {
    if (over) return;
    over = true;
    cancelAnimationFrame(raf);
    field.position.y = 0;
    composer.setIntro(null);
    base.dispose();
    finish();
  };
  const frame = (now) => {
    start ||= now;
    // While the bare floor holds (the delay) nothing on screen changes: it is drawn once and then no frame
    // is, which keeps the page's main thread free for what comes in meanwhile (on a phone, drawing the
    // whole floor every frame here stuttered the full view's typed title word).
    if (drawn && (now - start) / 1000 < delay) { raf = requestAnimationFrame(frame); return; }
    drawn = true;
    const t = Math.min(1, Math.max(0, (now - start) / 1000 - delay) / seconds), e = ease(t);
    field.position.y = -rise * (1 - e);
    blend(e);
    composer.render();
    if (t < 1) raf = requestAnimationFrame(frame);
    else { end(); composer.render(); }
  };
  const done = new Promise((r) => { finish = r; });
  blend(0);
  field.position.y = -rise;
  raf = requestAnimationFrame(frame);
  return { done, cancel: end };
}
