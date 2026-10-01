// The accent water (AccentWave.tsx) drawn on the GPU, in one pass of one shader, from the same numbers the 2D
// canvas used and in the same sRGB values it worked in: the solid blue up to a little short of the edge, the
// halftone on the far side of the edge (on the same PITCH grid, the same rows, each dot's size and opacity
// from its own place in the band, the dots that overlap their neighbours adding up as they did), and the
// film grain over the blue (the same kind of tile, smoothed as the canvas smoothed it at 2x). On the 2D
// canvas a frame of the halftone was some twenty thousand dots filled one by one, which Safari replays on the
// processor, and the move between the players and the next section ran at a few frames a second there.
export type WaveFrame = { w: number; h: number; level: number; dir: 1 | -1; dots: boolean };
type Consts = { accent: number[]; arc: number; band: number; pitch: number; grain: number };

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes, uSize; uniform float uDpr, uLevel, uDir, uArc, uBand, uPitch, uGrain, uDots;
uniform vec3 uAccent; uniform sampler2D tGrain;
float edgeY(float x) { float u = 2.0 * x / uSize.x - 1.0; return uLevel + uDir * uArc * u * u; }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr; // css px, down
  float e = edgeY(p.x);
  // the solid: from the view's own edge (the foot on the way in, the top on the way out) to PITCH * 2 short
  float lim = e + uDir * uPitch * 2.0;
  float clearAll = 1.0 - clamp((uDir > 0.0 ? p.y - lim : lim - p.y) * uDpr + 0.5, 0.0, 1.0);
  // the halftone, only near the band (the dots grow past a cell, so the cells round this one count too)
  float into = uDir * (e - p.y);
  if (uDots > 0.5 && into > -uPitch * 5.0 && into < uBand + uPitch * 2.0) {
    vec2 c0 = floor(p / uPitch);
    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 g = (c0 + vec2(float(i), float(j)) + 0.5) * uPitch;
        float ge = edgeY(g.x);
        float a = ge - uDir * uBand, b = ge + uDir * uPitch * 3.0;
        if (floor(g.y / uPitch) < floor(min(a, b) / uPitch) || g.y >= max(a, b)) continue;
        if (g.y < -uPitch || g.y > uSize.y + uPitch || g.x >= uSize.x) continue;
        float s = min(1.0, 1.0 - uDir * (ge - g.y) / uBand);
        if (s <= 0.0) continue;
        float r = 0.35 + (uPitch * 0.72 - 0.35) * pow(s, 1.4);
        float cover = clamp((r - length(p - g)) * uDpr + 0.5, 0.0, 1.0);
        clearAll *= 1.0 - min(1.0, 0.15 + s * 0.95) * cover;
      }
    }
  }
  float alpha = 1.0 - clearAll;
  if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }
  float grain = texture2D(tGrain, fract(p / 160.0)).r;
  gl_FragColor = vec4(mix(uAccent, vec3(grain), uGrain) * alpha, alpha);
}`;

export function accentWaveGL(canvas: HTMLCanvasElement, k: Consts) {
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const where = new Map<string, WebGLUniformLocation | null>();
  const u = (n: string) => {
    if (!where.has(n)) where.set(n, gl.getUniformLocation(prog, n));
    return where.get(n)!;
  };
  // the grain: one 160 px tile of random greys, as the canvas made it, smoothed when the view is drawn larger
  const tile = new Uint8Array(160 * 160);
  for (let i = 0; i < tile.length; i++) tile[i] = Math.random() * 256;
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 160, 160, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, tile);
  for (const [p, v] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]])
    gl.texParameteri(gl.TEXTURE_2D, p, v);
  gl.uniform1i(u("tGrain"), 0);
  gl.uniform3f(u("uAccent"), k.accent[0] / 255, k.accent[1] / 255, k.accent[2] / 255);
  gl.uniform1f(u("uArc"), k.arc);
  gl.uniform1f(u("uBand"), k.band);
  gl.uniform1f(u("uPitch"), k.pitch);
  gl.uniform1f(u("uGrain"), k.grain);
  let drawn = ""; // what the canvas shows now: unchanged, nothing is drawn

  return {
    // null: nothing of the water in view
    draw(f: WaveFrame | null, dpr: number) {
      const key = f ? `${f.w}|${f.h}|${f.level}|${f.dir}|${f.dots}|${dpr}|${canvas.width}` : "";
      if (key === drawn) return;
      drawn = key;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!f) return;
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform2f(u("uSize"), f.w, f.h);
      gl.uniform1f(u("uDpr"), dpr);
      gl.uniform1f(u("uLevel"), f.level);
      gl.uniform1f(u("uDir"), f.dir);
      gl.uniform1f(u("uDots"), f.dots ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
