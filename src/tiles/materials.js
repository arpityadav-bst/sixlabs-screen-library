// Studio environment and the glass materials for inactive and active tiles.
import * as THREE from 'three';
import { activeGradient, frostTexture } from './textures.js';

// Studio lightformers baked into a PMREM environment. They create the white edge lines on the glass.
// leftStrip: false gives a variant lit from behind only, used so the active slab shines on one rim.
export function studioEnvironment(renderer, P, { leftStrip = true, strip = P.envStrip } = {}) {
  const env = new THREE.Scene();
  env.background = new THREE.Color(P.envBase);
  const panel = (w, h, intensity, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(14, 14, P.envTop, [0, 9, 0]);             // large overhead softbox
  panel(240, 240, P.envGround, [0, -4, 0]);       // bright ground to the horizon, so low-facing glass reflects light, not gray
  // Low wide strips, 0 to 25 degrees up. Only the far bevels see this band (flat tops reflect higher),
  // so they draw a crisp white line on each rim without brightening the tile tops.
  panel(30, 4.5, strip, [-3, 2.3, -10]);          // behind: rims of edges facing -z (upper right on screen)
  if (leftStrip) panel(30, 4.5, strip, [-10, 2.3, -2]); // left: rims of edges facing -x
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.035).texture;
  pmrem.dispose();
  return tex;
}

const thick = (P) => P.core + 2 * P.bevelT;

// Adds object-space normal and height varyings, then lets `frag` adjust outgoingLight at the very end.
function patchSide(mat, uniforms, frag) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjN;\nvarying float vLocalY;\nvarying vec2 vLocalXZ;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvObjN = objectNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocalY = position.y;\nvLocalXZ = position.xz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vObjN;\nvarying float vLocalY;\nvarying vec2 vLocalXZ;\n${Object.keys(uniforms).map((k) => `uniform ${typeof uniforms[k].value === 'number' ? 'float' : 'vec3'} ${k};`).join('\n')}`)
      .replace('#include <opaque_fragment>', `${frag}\n#include <opaque_fragment>`);
  };
}

export function glassMaterials(P, frostOpts) {
  const top = new THREE.MeshPhysicalMaterial({
    color: P.topColor, map: frostTexture(P, frostOpts), roughness: P.topRough, transmission: P.topTrans, thickness: thick(P), ior: 1.5,
    attenuationColor: P.topAtten, attenuationDistance: P.topAttenDist,
    specularIntensity: 0.7, clearcoat: P.topCoat, clearcoatRoughness: 0.12, dithering: true,
  });
  const side = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', roughness: P.sideRough, transmission: 1, thickness: thick(P), ior: 1.5,
    specularIntensity: 1, envMapIntensity: P.sideEnv, clearcoat: 1, clearcoatRoughness: P.sideRough, dithering: true,
  });
  // Rim treatment. Edges are named as seen with the grid's columns upright and the empty floor on the
  // left: left = -x (upper left on screen), right = +x (lower right), top = -z (upper right),
  // bottom = +z (lower left). Left and right rims carry the thin white shine. Top and bottom rims get
  // only a trace of it, because they read through shadow instead: the seen-through band at the top and
  // a faint wall shadow at the bottom, strongest mid-edge and fading out toward both corners.
  patchSide(side, {
    uRim: { value: P.rimLine }, uRimTB: { value: P.rimTopBottom }, uShadow: { value: P.sideShadow },
    uBand: { value: P.sideShadowBand }, uCornerShade: { value: P.cornerShade },
    uFadeStart: { value: P.ghostFadeStart }, uFadeEnd: { value: P.ghostFadeEnd },
  }, `
    float tilt = length(vObjN.xz);                                   // 0 facing up, 1 on the vertical wall
    vec2 hd = vObjN.xz / max(tilt, 1e-4);
    float line = smoothstep(0.25, 0.45, tilt) * (1.0 - smoothstep(0.7, 0.9, tilt));
    float leftRight = smoothstep(0.5, 0.9, abs(hd.x)), topBottom = smoothstep(0.5, 0.9, abs(hd.y));
    outgoingLight += vec3(uRim * line * (leftRight + uRimTB * topBottom));
    float bottom = smoothstep(0.6, 0.95, hd.y) * smoothstep(0.6, 0.9, tilt)
      * (1.0 - smoothstep(uFadeStart, uFadeEnd, abs(vLocalXZ.x)));
    float foot = 1.0 - smoothstep(0.0, uBand, vLocalY);
    outgoingLight *= 1.0 - uShadow * bottom * mix(0.35, 1.0, foot);
    float topLeftCorner = smoothstep(0.88, 0.99, dot(hd, vec2(-0.70711)));
    outgoingLight *= 1.0 - uCornerShade * topLeftCorner * smoothstep(0.3, 0.9, tilt);`);
  return [top, side];
}

// Both active materials are flagged transparent (at full opacity) so the renderer draws the slab after
// the glass pass: otherwise the neighbours' glass tops refract a blurred image of it, a dark blue band
// hugging the slab's far edges that the reference does not have.
// beamU: rim-beam uniforms shared by the focused and activated slabs, so the beam shows identically
// on whichever slab is visible under the activation sweep (see focus-rig.js).
export function activeMaterials(P, rearEnv, beamU = {}) {
  const top = new THREE.MeshPhysicalMaterial({
    color: P.actBody, emissive: '#ffffff', emissiveMap: activeGradient(P), emissiveIntensity: P.actEmis,
    roughness: 0.14, transmission: 0, ior: 1.5, transparent: true, polygonOffset: true, polygonOffsetFactor: -1, clearcoat: P.actCoat, clearcoatRoughness: 0.04, envMapIntensity: P.actEnv, dithering: true,
  });
  // Blue glass sidewall, dark at the foot and lighter toward the top, partly metallic so it mirrors the
  // floor. Per state: in the default state the top rim reads as a darker navy line and the lifted
  // slab's wall catches a light line along its foot on the camera-facing sides. In the shining state the
  // camera-facing top rim shines (bottom and right rims, brightest at the corner nearest the camera),
  // and the rear corner's rim, which wraps the glint, carries a small cyan line.
  const side = new THREE.MeshPhysicalMaterial({
    color: P.actSide, metalness: P.actSideMetal, roughness: 0.04, transmission: 0, ior: 1.5, transparent: true, polygonOffset: true, polygonOffsetFactor: -1, clearcoat: 1,
    clearcoatRoughness: 0.03, envMap: rearEnv, envMapIntensity: P.actSideEnv * P.envI, dithering: true,
  });
  const yMin = -P.bevelT, yMax = P.core + P.bevelT;
  const col = (c, k) => new THREE.Color(c).multiplyScalar(k);
  const inv = (1 / P.tile).toFixed(4), apex = (P.tile / 2 - P.tile * P.radius * (1 - Math.SQRT1_2)).toFixed(4);
  patchSide(side, {
    ...beamU,
    uDark: { value: new THREE.Color(P.actSideDark) }, uLight: { value: new THREE.Color(P.actSideLight) },
    uGlowI: { value: P.actSideGlowI },
    uCornerShine: { value: col(P.glintRimCol, P.glintRim) }, uLowRim: { value: col(P.actLowRimCol, P.actLowRim) },
    uRimDark: { value: P.actRimDark }, uCrease: { value: new THREE.Color(P.actCreaseCol) }, uWallShade: { value: P.actWallShade }, uLowBand: { value: P.actLowBand },
  }, `
    outgoingLight += mix(uDark, uLight, smoothstep(${yMin.toFixed(4)}, ${yMax.toFixed(4)}, vLocalY)) * uGlowI;
    float tilt = length(vObjN.xz);
    vec2 hd = vObjN.xz / max(tilt, 1e-4);
    float line = smoothstep(0.25, 0.45, tilt) * (1.0 - smoothstep(0.7, 0.9, tilt));
    float topRim = line * step(0.0, vObjN.y);
    // Foot line: the lowest strip of the vertical wall (the underside bevel faces away from the camera).
    float lowRim = smoothstep(0.9, 0.99, tilt) * (1.0 - smoothstep(0.0, uLowBand, vLocalY));
    float toCamera = dot(hd, vec2(0.70711));
    // Default state: the whole top bevel settles to a crease colour a touch darker than the top face,
    // and the wall darkens toward its foot so it runs light at the top to darker at the bottom.
    float topBevel = smoothstep(0.0, 0.08, tilt) * (1.0 - smoothstep(0.9, 0.99, tilt)) * step(0.0, vObjN.y);
    float wallFoot = smoothstep(0.9, 0.99, tilt) * (1.0 - smoothstep(${yMin.toFixed(4)}, ${yMax.toFixed(4)}, vLocalY));
    outgoingLight = mix(outgoingLight, uCrease, uRimDark * topBevel);
    outgoingLight *= 1.0 - uWallShade * wallFoot;
    // Rim beam. u runs along the rim: +0.92 at the front corner, 0 at both side corners, -0.92 at the rear.
    // The rim is lit where u is ahead of the beam head (uBeam), dimmer on the back edges (uBackRim), with
    // a white-hot spot at the front corner and a flare at the right corner once the beam has passed it.
    float u = (vLocalXZ.x + vLocalXZ.y) * ${inv};
    float rimZone = max(topRim, 0.85 * topBevel); // the rounded edge between the top face and the wall
    float lit = smoothstep(uBeam - 0.1, uBeam + 0.02, u) * mix(1.0, uBackRim, smoothstep(0.1, -0.7, u));
    vec2 dF = vLocalXZ - vec2(${apex}), dR = vLocalXZ - vec2(${apex}, -${apex});
    outgoingLight += (uShine * lit * (rimZone + 0.25 * lowRim) + uHotF * rimZone * exp(-dot(dF, dF) / 0.012)) * uBeamI;
    outgoingLight += uHotR * max(rimZone, 0.35 * smoothstep(0.9, 0.99, tilt)) * exp(-dot(dR, dR) / 0.012) * uFlare;
    outgoingLight += uCornerShine * topRim * smoothstep(0.9, 0.99, -toCamera);
    outgoingLight += uLowRim * lowRim * smoothstep(0.0, 0.8, toCamera);`);
  return [top, side];
}
