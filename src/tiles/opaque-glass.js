// The live floor's resting tiles without their see-through glass (governor.js applies it; still renders keep
// the glass): opaque, and coloured to read as the glass did, matched against screenshots of the two side by
// side (2026-10-01), and approved as identical to the eye. With nothing see-through left in the scene,
// three.js skips the extra render of it each frame that the glass took (a full-resolution, 4x multisampled
// image). Through the glass the tops showed mostly the floor (about RGB 218-221-226) and the walls an even light grey (206-220) whichever
// way they faced, since what showed there was the lit floor behind them. Opaque, the tops came out about 4%
// brighter (the glass's own colour mixed toward the floor by its 82%) and the walls a dark band (135-142),
// lit as solid walls facing away from the light with the walls' own shading on top. So the tops take the
// floor's colour by the share the glass let through and lose that 4% (x0.88 in linear), and the walls glow
// most of a floor tone themselves (0.8 of it) with only a little of it lit (0.25), which keeps them even;
// the rim shine is drawn over them and comes back up with them. The neighbours' contact shadow and blue
// spill are drawn on the tops separately and stay.
// A played tile (spent) rests in its page's tint (the instance colour: a light grey, or on the digital AI
// pages a light blue). The glass passed that tint into everything seen through it, the walls included; a
// wall's own glow and the rim line drawn over it take no instance colour of their own, so they would stay
// at full white on a played tile. So the walls' glow takes the tint in full, as the glass walls did, and the
// rim line half of it, just a touch darker on a played tile.
export function opaqueGlass(scene, floorColor) {
  scene?.traverse((o) => [o.material].flat().forEach((m) => {
    if (!(m?.transmission > 0) || !m.color) return;
    const floor = m.color.clone().set(floorColor);
    if (m.transmission >= 0.99) {
      m.color.copy(floor).multiplyScalar(0.25);
      m.emissive?.copy(floor).multiplyScalar(0.8);
      tintEdges(m);
    } else {
      m.color.lerp(floor, m.transmission).multiplyScalar(0.88);
    }
    m.transmission = 0;
    m.needsUpdate = true;
  }));
}

// the wall material's glow, in full, and its rim line, by half, take the tile's instance colour (its tint):
// vColor, a vec4 in this three.js's fragment shader, declared under these two defines (color_pars_fragment)
function tintEdges(m) {
  const base = m.onBeforeCompile;
  m.onBeforeCompile = (sh, renderer) => {
    base?.call(m, sh, renderer);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
vec3 rimTint = vec3(1.0);
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
  totalEmissiveRadiance *= vColor.rgb;
  rimTint = mix(vec3(1.0), vColor.rgb, 0.5);
#endif`)
      .replace('outgoingLight += vec3(uRim', 'outgoingLight += rimTint * vec3(uRim');
  };
}
