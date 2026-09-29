# SixLabs Screen Library

Design handoff for SixLabs, set up like the BlueAI screen library: the index at `/` lists every
surface and the design libraries they are built from.

| Route | What it is |
|---|---|
| `/` | The index |
| `/website` | The landing page: hero over the live tile floor, floating navbar, logo marquee |
| `/tiles` | SixLabs Tiles, the glass tile floor full screen (hover to focus, click to activate, R to reset) |

## Run

```bash
npm install
npm run dev
```

## Where things live

- `src/components/website/` the landing page sections (Hero, LogoMarquee)
- `src/components/tiles/TileFloor.tsx` mounts the floor into any box and tears it down on unmount
- `src/tiles/` the three.js floor engine (plain ES modules). `floor.js` builds the scene; the rest are
  its materials, characters, the raised-tile rig, the activation sweep and glow, and the interaction
- `public/tiles/floor-params.json` every look and timing setting; `states.default` is the focused tile,
  `states.shine` the activated one
- `public/tiles/chars/` and `chars-ai/` the 17 human gamers and their charcoal AI copies

## Static renders

`node tools/tiles/render.cjs out.png [params.json]` renders a still of the floor headlessly (needs
Playwright). Params may set `actState` (`default` or `shine`), `staticS` (seconds into the activation),
`vw`/`vh` (viewport) and `dpr`.
