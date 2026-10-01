// The blue light an activated tile throws around itself: a soft blue tint on a plane at the height
// of the neighbouring tile tops, so it lights their tops and the gaps between them alike, and is hidden
// under the raised tile itself. It falls off with distance from the tile's rounded outline, is weighted
// per side ([left, right, top, bottom] = upper left, lower right, upper right, lower left on screen) and
// spreads outward from the front with the activation sweep (uHead).
import * as THREE from 'three';

export function createHalo(P, tileH) {
  const U = {
    uC: { value: new THREE.Vector2() }, uAmt: { value: 0 }, uHead: { value: -9 },
    uW: { value: P.haloW }, uDir: { value: new THREE.Vector4(...P.haloDir) }, uCol: { value: new THREE.Color(P.haloCol) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, // tints toward blue, like the reference, rather than adding light
    vertexShader: 'varying vec2 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `varying vec2 vW; uniform vec2 uC; uniform float uAmt, uHead, uW; uniform vec4 uDir; uniform vec3 uCol;
float sdRS(vec2 p, float b, float r) { vec2 q = abs(p) - vec2(b) + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  vec2 rel = vW - uC; float d = max(sdRS(rel, ${(P.tile / 2).toFixed(4)}, ${(P.tile * P.radius).toFixed(4)}), 0.0);
  vec2 n = normalize(rel + 1e-5), s = n * n;
  float side = (n.x < 0.0 ? uDir.x : uDir.y) * s.x + (n.y < 0.0 ? uDir.z : uDir.w) * s.y;
  float sweep = smoothstep(uHead - 0.6, uHead + 0.6, dot(n, vec2(0.70711)));
  float g = uAmt * side * sweep * exp(-d / uW);
  gl_FragColor = vec4(uCol, clamp(g, 0.0, 1.0));
  #include <tonemapping_fragment>
}`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(P.tile * 3, P.tile * 3), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = tileH + 0.003;
  mesh.renderOrder = 0.8; // after the glass tiles, before the raised slab and the characters
  mesh.visible = false;
  return {
    mesh,
    set(x, z, amt, head) {
      mesh.position.x = x; mesh.position.z = z;
      U.uC.value.set(x, z); U.uAmt.value = amt; U.uHead.value = head;
      mesh.visible = amt > 0.001;
    },
  };
}
