### Compositor-safe rule

**The rule.** Nothing on screen uses `backdrop-filter`, `mix-blend-mode`, a CSS `mask` or `mask-image`, or a CSS `filter`. With any one of them anywhere on screen, Chrome on a Mac stops handing a frame's canvases and layers to the system as they are and puts the whole frame together itself, which holds Intel and dual-GPU Macs at 30 fps. The rule is page-wide because the cost is: a small blurred pill in a corner slows the tile floor, the water and the liquid with it.

**What to draw instead.**
- A glow: stacked strokes, each wider and fainter (the AI doodles), or a picture drawn once (the terminal hint cursor's shadow).
- A multiply or a grain: alpha specks that darken by their own transparency (the page grain), or compositing inside a canvas (lighter, multiply, source-atop and destination-in in the sweep).
- A mask or a fade: a gradient in the ground's own colour laid over the edge (the page grain's top), or the fade drawn on a canvas (the footer's copy line picture).
- A frosted strip: a solid ground at 92% of the page colour (the header).
- A blur inside a texture: an offscreen `ctx.filter` baked once (`tiles/textures.js:63`), which is fine, because it never reaches the screen as CSS.

**Measuring switches.** `?off=` takes any of ascii, wave, liquid, tiles, doodles, grain and fx, comma separated, for one visit, and `<html data-off>` carries them for the CSS ones. `fx` strips every backdrop blur, blend mode, mask and filter on the page, so a before and an after on one machine show what they cost. `?perf` shows a readout (fps, slow frames, long tasks, the floor's ratio and anti-aliasing, the GPU, clip seeks) with a Copy log of the last three minutes, and `?perf=bench` adds the floor benchmark. `?gpu=low` puts the floor and the liquid on a two-GPU laptop's low-power GPU, `?gpu=high` the water and the portrait on the faster one. `?clips=` forces a portrait format. Without them nothing changes.

**WebGL budget.** At once the site holds the tile floor, the liquid (desktops), the water and one portrait (two during a player change), plus probe contexts from `useClipFormat` and, under `?perf`, `gpuName`, which are never released. Chrome loses the oldest context past about 16 a page, and the floor and the liquid do not recover from a loss. So a new WebGL effect needs a reason to be a new context. A page that mounts many, as the guide does, rations them: eight units, one floor and eight iframes live at once, each claimed as it nears the view and released, its contexts lost through `WEBGL_lose_context`, past one and a half viewports.

**Known violations.** These break the rule on or near the page today: the job cards' sheen (a drop-shadow filter and a mask on every card, even while the light is at opacity 0), FloorLogo's mask-image while the container hero loads, LanguageMenu's blur on open with its backdrop-blur-xl, the /tiles page's hint pill, and a dead PrimaryCta prism branch with mix-blend-screen and feGaussianBlur. Known gaps (10.2) lists them with their lines and severity.

**How to test a change.** Open the page with `?perf` on a Mac in Chrome and scroll its whole length, then again with `?off=fx`. If the two differ, something on screen breaks the rule. Before an effect ships, check its CSS for the four properties, including the ones a library writes for you: motion's `filter` animations and Tailwind's `blur-*`, `backdrop-blur-*` and `mix-blend-*` classes.
