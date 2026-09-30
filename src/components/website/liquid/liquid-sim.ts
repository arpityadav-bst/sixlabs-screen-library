// The liquid over a flat picture (LiquidLine.tsx), after Canvas UI's Liquid Object: the cursor stirs a small
// fluid simulation, and its flow drags the picture, splits its colours in a lens round the cursor, and lights
// it with a sheen and a rainbow shimmer where it runs; a click splashes. The picture is a canvas the caller
// draws (the sentence); frame() is called before every frame, returning true when it has redrawn it.
// Settings start from the Liquid Object demo's (distortion 2, aberration 0.75, grain 1, sheen 1.6, cursor size
// 1, persistence 0.6, swirl 0.5, iridescence 1.5, splash 1.2, ambient 1), then: no idle drift (ambient 0) and
// no grain away from the cursor, so the words hold still until the cursor comes; and what the cursor does is
// HOVER (0.3) of the demo's, 70% less: its drag, colour split, sheen, shimmer, grain and splash.
import * as THREE from "three";
import * as S from "./shaders";

const HOVER = 0.3;
const OPT = { distortion: 2 * HOVER, aberration: 0.75 * HOVER, grain: 1 * HOVER, sheen: 1.6 * HOVER, cursorSize: 1, cursorForce: 1, persistence: 0.6, swirl: 0.5, iridescence: 1.5 * HOVER, splash: 1.2 * HOVER, ambient: 0 };
const SIM_RES = 128, FIELD_RES = 256, PRESSURE_STEPS = 4, SIM_STEP = 1 / 60;

export function createLiquid(canvas: HTMLCanvasElement, picture: HTMLCanvasElement, frame: () => boolean) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const tex = new THREE.CanvasTexture(picture);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.premultiplyAlpha = true;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;

  const quad = new THREE.BufferGeometry();
  quad.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  const passScene = new THREE.Scene(), passCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mesh = new THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>(quad, new THREE.ShaderMaterial());
  mesh.frustumCulled = false;
  passScene.add(mesh);
  const pass = (frag: string, uniforms: Record<string, THREE.IUniform>) =>
    new THREE.ShaderMaterial({ glslVersion: THREE.GLSL3, vertexShader: S.QUAD_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, blending: THREE.NoBlending });
  const target = (size: number) => {
    const t = new THREE.WebGLRenderTarget(size, size, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false });
    t.texture.generateMipmaps = false;
    return t;
  };
  const velocity = [target(SIM_RES), target(SIM_RES)], pressure = [target(SIM_RES), target(SIM_RES)];
  const field = [target(FIELD_RES), target(FIELD_RES)], divergence = target(SIM_RES), curl = target(SIM_RES);
  const all = [...velocity, ...pressure, ...field, divergence, curl];
  const simTexel = new THREE.Vector2(1 / SIM_RES, 1 / SIM_RES), fieldTexel = new THREE.Vector2(1 / FIELD_RES, 1 / FIELD_RES);
  const v = <T>(value: T) => ({ value });

  const splatP = pass(S.SPLAT_FRAG, { tTarget: v(null), uPoint: v(new THREE.Vector2()), uValue: v(new THREE.Vector3()), uRadius: v(0.01), uAspect: v(1) });
  const curlP = pass(S.CURL_FRAG, { tVelocity: v(null), uTexel: v(simTexel) });
  const vortP = pass(S.VORTICITY_FRAG, { tVelocity: v(null), tCurl: v(curl.texture), uTexel: v(simTexel), uCurl: v(OPT.swirl * 4), uDt: v(SIM_STEP) });
  const divP = pass(S.DIVERGENCE_FRAG, { tVelocity: v(null), uTexel: v(simTexel) });
  const presP = pass(S.PRESSURE_FRAG, { tPressure: v(null), tDivergence: v(divergence.texture), uTexel: v(simTexel) });
  const gradP = pass(S.GRADIENT_FRAG, { tPressure: v(null), tVelocity: v(null), uTexel: v(simTexel) });
  const advP = pass(S.ADVECT_FRAG, { tVelocity: v(null), tSource: v(null), uTexel: v(simTexel), uDt: v(SIM_STEP), uDissipation: v(0.98) });
  const fadeP = pass(S.FADE_FRAG, { tSource: v(null), uFade: v(0.8) });
  const comp = pass(S.COMPOSITE_FRAG, {
    tScene: v(tex), tField: v(field[0].texture), uFieldTexel: v(fieldTexel), uDistortion: v(OPT.distortion), uAberration: v(OPT.aberration),
    uGrain: v(OPT.grain), uCursor: v(new THREE.Vector2(0.5, 0.5)), uLensRadius: v(0.12 + OPT.cursorSize * 0.45), uGlow: v(0), uAspect: v(1),
    uSheen: v(OPT.sheen), uIridescence: v(OPT.iridescence), uAmbient: v(OPT.ambient), uTime: v(0),
  });
  const passes = [splatP, curlP, vortP, divP, presP, gradP, advP, fadeP, comp];

  const run = (m: THREE.ShaderMaterial, to: THREE.WebGLRenderTarget | null) => {
    mesh.material = m;
    renderer.setRenderTarget(to);
    renderer.render(passScene, passCamera);
  };
  for (const t of all) { renderer.setRenderTarget(t); renderer.clear(); }
  renderer.setRenderTarget(null);

  let aspect = 1, energy = 0, glow = 0, inside = false;
  const cursor = new THREE.Vector2(0.5, 0.5), queued: number[][] = [];
  let last: { x: number; y: number } | null = null;
  const uvOf = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height, r };
  };
  // the cursor is read on the window: the canvas lets the pointer through to whatever is under it
  const onMove = (e: PointerEvent) => {
    const { x, y, r } = uvOf(e);
    inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    if (!inside) { last = null; return; }
    cursor.set(x, y);
    const px = x * r.width, py = (1 - y) * r.height;
    if (last && queued.length < 64) {
      const dx = (px - last.x) * OPT.cursorForce * 1.1, dy = -(py - last.y) * OPT.cursorForce * 1.1;
      if (dx * dx + dy * dy > 1e-8) queued.push([x, y, dx, dy, 1]);
    }
    last = { x: px, y: py };
  };
  const onDown = (e: PointerEvent) => {
    const { x, y } = uvOf(e);
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    for (let i = 0; i < 8 && queued.length < 64; i++) {
      const a = (i / 8) * Math.PI * 2, cx = Math.cos(a), cy = Math.sin(a);
      queued.push([x + cx * 0.02, y + cy * 0.02, cx * 70 * OPT.splash, cy * 70 * OPT.splash, 2.2]);
    }
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });

  const splat = (pair: THREE.WebGLRenderTarget[], x: number, y: number, dx: number, dy: number, radius: number) => {
    splatP.uniforms.tTarget.value = pair[0].texture;
    splatP.uniforms.uPoint.value.set(x, y);
    splatP.uniforms.uValue.value.set(dx, dy, 0);
    splatP.uniforms.uRadius.value = radius;
    splatP.uniforms.uAspect.value = aspect;
    run(splatP, pair[1]);
    pair.reverse();
  };
  function step(dt: number) {
    if (queued.length) {
      const radius = OPT.cursorSize * 0.01;
      for (const [x, y, dx, dy, r] of queued) { splat(velocity, x, y, dx, dy, radius * r); splat(field, x, y, dx, dy, radius * r); }
      queued.length = 0;
      energy = 1;
    }
    curlP.uniforms.tVelocity.value = velocity[0].texture; run(curlP, curl);
    vortP.uniforms.tVelocity.value = velocity[0].texture; vortP.uniforms.uDt.value = dt; run(vortP, velocity[1]); velocity.reverse();
    divP.uniforms.tVelocity.value = velocity[0].texture; run(divP, divergence);
    fadeP.uniforms.tSource.value = pressure[0].texture; fadeP.uniforms.uFade.value = Math.pow(0.8, dt * 60); run(fadeP, pressure[1]); pressure.reverse();
    for (let i = 0; i < PRESSURE_STEPS; i++) { presP.uniforms.tPressure.value = pressure[0].texture; run(presP, pressure[1]); pressure.reverse(); }
    gradP.uniforms.tPressure.value = pressure[0].texture; gradP.uniforms.tVelocity.value = velocity[0].texture; run(gradP, velocity[1]); velocity.reverse();
    const frames = dt * 60, flowDecay = Math.pow(0.985 + OPT.persistence * 0.015, frames), fieldDecay = Math.pow(0.9 + OPT.persistence * 0.099, frames);
    advP.uniforms.uDt.value = dt;
    advP.uniforms.tVelocity.value = velocity[0].texture; advP.uniforms.tSource.value = velocity[0].texture;
    advP.uniforms.uTexel.value = simTexel; advP.uniforms.uDissipation.value = flowDecay; run(advP, velocity[1]); velocity.reverse();
    advP.uniforms.tVelocity.value = velocity[0].texture; advP.uniforms.tSource.value = field[0].texture;
    advP.uniforms.uTexel.value = fieldTexel; advP.uniforms.uDissipation.value = fieldDecay; run(advP, field[1]); field.reverse();
    energy *= fieldDecay;
    renderer.setRenderTarget(null);
  }

  function resize() {
    const w = Math.max(canvas.clientWidth, 1), h = Math.max(canvas.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    aspect = w / h;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let lastT = 0;
  function tick(time: number) {
    const dt = lastT ? Math.min((time - lastT) / 1000, 0.05) : 0;
    lastT = time;
    if (frame()) tex.needsUpdate = true;
    if (dt > 0 && (queued.length || energy > 0.002)) step(Math.min(dt, SIM_STEP * 2));
    glow += ((inside ? 1 : 0) - glow) * Math.min(dt * 6, 1);
    comp.uniforms.tField.value = field[0].texture;
    comp.uniforms.uTime.value = time * 0.001;
    comp.uniforms.uGlow.value = glow;
    comp.uniforms.uCursor.value.copy(cursor);
    comp.uniforms.uAspect.value = aspect;
    run(comp, null);
  }
  // runs only while the canvas is on screen
  const io = new IntersectionObserver(([e]) => {
    lastT = 0;
    renderer.setAnimationLoop(e.isIntersecting ? tick : null);
  });
  io.observe(canvas);

  return {
    destroy() {
      io.disconnect();
      ro.disconnect();
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      passes.forEach((p) => p.dispose());
      all.forEach((t) => t.dispose());
      quad.dispose();
      tex.dispose();
      renderer.dispose();
    },
  };
}
