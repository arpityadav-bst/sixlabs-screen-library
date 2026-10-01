// The resting tiles without their see-through glass (?off=glass, governor.js): opaque, and coloured to read
// as the glass did, matched against screenshots of the two side by side (2026-10-01). Through the glass the
// tops showed mostly the floor (about RGB 218-221-226) and the walls an even light grey (206-220) whichever
// way they faced, since what showed there was the lit floor behind them. Opaque, the tops came out about 4%
// brighter (the glass's own colour mixed toward the floor by its 82%) and the walls a dark band (135-142),
// lit as solid walls facing away from the light with the walls' own shading on top. So the tops take the
// floor's colour by the share the glass let through and lose that 4% (x0.88 in linear), and the walls glow
// most of a floor tone themselves (0.8 of it) with only a little of it lit (0.25), which keeps them even;
// the rim shine is drawn over them and comes back up with them. The neighbours' contact shadow and blue
// spill are drawn on the tops separately and stay.
export function opaqueGlass(scene, floorColor) {
  scene?.traverse((o) => [o.material].flat().forEach((m) => {
    if (!(m?.transmission > 0) || !m.color) return;
    const floor = m.color.clone().set(floorColor);
    if (m.transmission >= 0.99) {
      m.color.copy(floor).multiplyScalar(0.25);
      m.emissive?.copy(floor).multiplyScalar(0.8);
    } else {
      m.color.lerp(floor, m.transmission).multiplyScalar(0.88);
    }
    m.transmission = 0;
    m.needsUpdate = true;
  }));
}
