// The players' portrait where the browser shows the stacked clips (StackedSwap.tsx): one WebGL canvas holding
// both copies' frames (the human's and the AI's, each a stacked-alpha frame: the colour, premultiplied by its
// transparency, above, and the transparency as grey below, tools/stack-alpha.sh) and drawing whichever shows.
// The Human / AI switch's sweep is drawn here too, by the same shader, from the frames already on the GPU: a
// tall dome rising up the portrait, below its line the new copy and above it the old, across it the new copy
// as a halftone (dots from specks at the band's edges to solid on the line) with its colour channels pulled
// apart sideways, and a thin glowing laser along the line where it crosses her. It used to be drawn on a 2D
// canvas from the copies' own canvases, which in Safari cost a copy of the frame for every read and ten
// thousand dots drawn one by one, and held the switch to a few frames a second there; the reveal was a CSS
// clip-path reshaped every frame on both copies. The look is the same: each channel built as the 2D sweep
// built it (tinted, held to its own outline, the three added), the laser's glow as its 16px canvas shadow.
const VERT = `attribute vec2 p; varying vec2 uv;
void main() { uv = vec2((p.x + 1.0) * 0.5, 1.0 - (p.y + 1.0) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float; // frame px to the half pixel: the dots and the dome's line need it
#else
precision mediump float;
#endif
uniform sampler2D tA, tB; // the human's frame, the AI's
uniform float uShow, uIn, uSweep, uMid, uBand, uRise, uPitch, uChroma;
uniform vec2 uSize;
uniform vec3 uGlow;
varying vec2 uv;
// a copy's frame at q: colour (premultiplied, held to its transparency so compression cannot brighten an
// edge) from the top half, transparency from the bottom half's grey
vec4 grab(sampler2D t, vec2 q) {
  q = clamp(q, 0.0, 1.0);
  vec3 c = texture2D(t, vec2(q.x, q.y * 0.5)).rgb;
  float a = texture2D(t, vec2(q.x, 0.5 + q.y * 0.5)).r;
  return vec4(min(c, vec3(a)), a);
}
vec4 copyAt(float which, vec2 q) { return which < 0.5 ? grab(tA, q) : grab(tB, q); }
// the dome's drop below its middle at x: an ellipse, flat on top and steep at the sides
float drop(float x) { float u = min(1.0, abs(2.0 * x / uSize.x - 1.0)); return uRise * (1.0 - sqrt(1.0 - u * u)); }
void main() {
  if (uSweep < 0.5) { gl_FragColor = copyAt(uShow, uv); return; }
  vec2 px = uv * uSize; // frame px, down
  float line = uMid + drop(px.x);
  vec4 inC = copyAt(uIn, uv);
  vec4 col = mix(copyAt(1.0 - uIn, uv), inC, smoothstep(-0.5, 0.5, px.y - line));
  // the halftone, on the frame's own PITCH grid
  vec2 cell = (floor(px / uPitch) + 0.5) * uPitch;
  float s = 1.0 - abs(cell.y - uMid - drop(cell.x)) / (uBand * 0.5);
  float r = uPitch * 0.72 * pow(max(s, 0.0), 1.3);
  float dotA = r < 0.3 ? 0.0 : clamp(r - length(px - cell) + 0.5, 0.0, 1.0);
  if (dotA > 0.0) {
    vec2 sh = vec2(uChroma / uSize.x, 0.0);
    vec4 cr = copyAt(uIn, uv + sh), cb = copyAt(uIn, uv - sh);
    vec3 ch = vec3((1.0 - cr.a) * cr.a + cr.a * cr.r, (1.0 - inC.a) * inC.a + inC.a * inC.g, (1.0 - cb.a) * cb.a + cb.a * cb.b);
    vec4 ht = vec4(ch, min(1.0, cr.a + inC.a + cb.a)) * dotA;
    col = ht + col * (1.0 - ht.a);
  }
  // the laser: a 3px white line along the dome's line in a soft blue glow, only where it passes through her
  float d = abs(px.y - line);
  float core = 1.0 - smoothstep(1.0, 2.0, d), glow = 0.142 * exp(-d * d / 128.0);
  vec4 laser = vec4(vec3(core) + uGlow * glow * (1.0 - core), core + glow * (1.0 - core)) * inC.a;
  gl_FragColor = laser + col * (1.0 - laser.a);
}`;

export type SwapGL = {
  upload(slot: 0 | 1, src: HTMLVideoElement | VideoFrame): void;
  has(slot: 0 | 1): boolean;
  // show: the copy on screen; sweep: the sweep under way (the dome's top, frame px), or null
  draw(show: 0 | 1, sweep: { into: 0 | 1; mid: number } | null): void;
};

export const SIZE = { w: 810, h: 1080 };
const BAND = 0.6, // the band's depth, a share of the portrait's height
  DOME = 0.35, // how far the dome's middle stands above its ends, a share of the portrait's height
  PITCH = 7, // halftone grid, frame px
  CHROMA = 10, // how far the red and blue channels are pulled out to either side, frame px
  GLOW = [120 / 255, 175 / 255, 1]; // the laser's glow; its core is white
export const SWEEP = { band: BAND * SIZE.h, rise: DOME * SIZE.h };

export function swapGL(canvas: HTMLCanvasElement): SwapGL | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const where = new Map<string, WebGLUniformLocation | null>();
  const u = (n: string) => {
    if (!where.has(n)) where.set(n, gl.getUniformLocation(prog, n));
    return where.get(n)!;
  };
  const tex = [0, 1].map((i) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, v] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  });
  gl.uniform1i(u("tA"), 0);
  gl.uniform1i(u("tB"), 1);
  gl.uniform2f(u("uSize"), SIZE.w, SIZE.h);
  gl.uniform1f(u("uBand"), SWEEP.band);
  gl.uniform1f(u("uRise"), SWEEP.rise);
  gl.uniform1f(u("uPitch"), PITCH);
  gl.uniform1f(u("uChroma"), CHROMA);
  gl.uniform3f(u("uGlow"), GLOW[0], GLOW[1], GLOW[2]);
  const has = [false, false];

  // A decoded frame goes up as it is where WebGL takes one; where it does not (an older WebKit), through a
  // 2D canvas, which every browser with WebCodecs draws one into.
  let flat: CanvasRenderingContext2D | null = null;
  const put = (src: HTMLVideoElement | VideoFrame) => {
    if (src instanceof HTMLVideoElement || !flat) {
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        return true;
      } catch {
        if (src instanceof HTMLVideoElement) return false;
      }
      flat = document.createElement("canvas").getContext("2d");
      if (!flat) return false;
    }
    if (flat.canvas.width !== src.displayWidth) flat.canvas.width = src.displayWidth;
    if (flat.canvas.height !== src.displayHeight) flat.canvas.height = src.displayHeight;
    flat.drawImage(src, 0, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, flat.canvas);
    return true;
  };

  return {
    upload(slot, src) {
      if (src instanceof HTMLVideoElement && src.readyState < 2) return; // no frame yet
      gl.activeTexture(gl.TEXTURE0 + slot);
      gl.bindTexture(gl.TEXTURE_2D, tex[slot]);
      if (put(src)) has[slot] = true;
    },
    has: (slot) => has[slot],
    draw(show, sweep) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u("uShow"), show);
      gl.uniform1f(u("uSweep"), sweep ? 1 : 0);
      if (sweep) {
        gl.uniform1f(u("uIn"), sweep.into);
        gl.uniform1f(u("uMid"), sweep.mid);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}
