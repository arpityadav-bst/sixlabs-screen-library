// Draws one frame of a "stacked alpha" clip (PlayerPortrait.tsx): the frame holds the colour picture, already
// premultiplied by its transparency (tools/stack-alpha.sh), in its top half and the transparency, as grey,
// in its bottom half; WebGL puts the two back together as
// one see-through image on the canvas. This is how the players' clips play in Safari and on iPhones, which
// show a WebM clip's transparency as black (useClipFormat.ts), and wherever the clip's frames are decoded
// directly (clip-frames.ts). The drawing buffer is kept between frames so the portrait swap's sweep
// (PortraitSwap.tsx) can read the canvas like a video. Null without WebGL.

const VERTEX = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = vec2((p.x + 1.0) * 0.5, 1.0 - (p.y + 1.0) * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// colour from the top half (premultiplied, held to the transparency so compression cannot push an edge
// brighter than it is), transparency from the bottom half's grey
const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
varying vec2 uv;
void main() {
  vec3 colour = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(frame, vec2(uv.x, 0.5 + uv.y * 0.5)).r;
  gl_FragColor = vec4(min(colour, vec3(alpha)), alpha);
}`;

export function stackedAlpha(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    antialias: false,
  });
  if (!gl) return null;
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  // one quad over the whole canvas
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const at = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // A decoded frame goes up as it is where WebGL takes one; where it does not (an older WebKit), through a 2D
  // canvas, which every browser with WebCodecs draws one into.
  let flat: CanvasRenderingContext2D | null = null;
  const upload = (src: HTMLVideoElement | VideoFrame) => {
    if (src instanceof HTMLVideoElement || !flat) {
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        return;
      } catch {
        if (src instanceof HTMLVideoElement) return;
      }
      flat = document.createElement("canvas").getContext("2d");
      if (!flat) return;
    }
    if (flat.canvas.width !== src.displayWidth) flat.canvas.width = src.displayWidth;
    if (flat.canvas.height !== src.displayHeight) flat.canvas.height = src.displayHeight;
    flat.drawImage(src, 0, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, flat.canvas);
  };

  // the video's current frame, or a decoded frame, onto the canvas
  return (src: HTMLVideoElement | VideoFrame) => {
    if (src instanceof HTMLVideoElement && src.readyState < 2) return; // no frame yet
    gl.viewport(0, 0, canvas.width, canvas.height);
    upload(src);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
