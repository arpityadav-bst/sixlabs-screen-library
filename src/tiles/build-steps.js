// The floor built again on the way back to it (TileFloor.tsx) is built a step at a time: between its heavy
// steps (the GPU context, the lighting's environment, the side-wall reflection, the shaders, the first
// frames) the browser gets a frame, so none of them holds up the scroll or a glide for long. The first build,
// behind the page's loader, runs straight through as it always has. With ?perf, each step's time in ms goes
// to the log (website/perf.ts), so the step that still costs a hitch is named.
export function buildSteps(rebuild) {
  const times = [];
  let t = performance.now();
  return {
    async step(name) {
      times.push(`${name} ${Math.round(performance.now() - t)}`);
      if (rebuild) await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))); // after the next frame
      t = performance.now();
    },
    done() {
      if (window.__floorEvents) window.__floorEvents.build = `${rebuild ? 'rebuilt' : 'built'} (ms): ${times.join(', ')}`;
    },
  };
}
