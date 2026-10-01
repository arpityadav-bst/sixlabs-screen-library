// Headless render entry: a static frame of the floor (see render.cjs). Settings come from the params file
// passed to the renderer, else from the site's own floor-params.json.
import { createFloor } from '/src/tiles/floor.js';

const given = window.PARAMS && Object.keys(window.PARAMS).length ? window.PARAMS : null;
const params = given ?? await fetch('/tiles/floor-params.json').then((r) => r.json());
createFloor(document.body, { params, base: '/tiles', aiBase: '/tiles-holo', isStatic: true, expose: true }); // the AI copies are the holograms
