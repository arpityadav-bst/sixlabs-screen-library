// Renders a static frame of the SixLabs tile floor headlessly and saves the canvas as PNG.
// Usage (from the sixlabs folder): node tools/tiles/render.cjs <out.png> [params.json]
// Without a params file it renders the site's own public/tiles/floor-params.json.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const APP = path.resolve(__dirname, '..', '..');
const out = path.resolve(process.argv[2] || 'floor.png');
const params = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {};
// URL prefix -> folder: three.js from node_modules, the engine from src, the assets from public.
const ROUTES = [['/three/', path.join(APP, 'node_modules', 'three')], ['/src/', path.join(APP, 'src')],
  ['/tiles/', path.join(APP, 'public', 'tiles')], ['/tools/', __dirname]];

const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.png': 'image/png', '.json': 'application/json' };

(async () => {
  const browser = await chromium.launch({
    args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: params.vw || 1920, height: params.vh || 1080 }, deviceScaleFactor: params.dpr || 2 });
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.route('http://sixlabs.local/**', (route) => {
    const p = decodeURIComponent(new URL(route.request().url()).pathname);
    const hit = ROUTES.find(([prefix]) => p.startsWith(prefix));
    const file = p === '/' ? path.join(__dirname, 'floor.html') : hit ? path.join(hit[1], p.slice(hit[0].length)) : '';
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
    route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  await page.addInitScript((p) => { window.PARAMS = p; }, params);
  const t0 = Date.now();
  await page.goto('http://sixlabs.local/');
  await page.waitForFunction(() => window.__done === true, null, { timeout: 60000 });
  console.log(JSON.stringify(await page.evaluate(() => window.__info)));
  await page.locator('canvas').screenshot({ path: out });
  console.log('saved', out, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  await browser.close();
})();
