// Page background ASCII glyph field, ported as-is from the onBlue creators page
// (blueai/public/experiments/onblue-vesper/ascii-field.js). Tints: --ascii-a / --ascii-b on the host.
/* mountAsciiField(spec): puts a canvas on spec.host (first child; the host needs a position).
     spec.cell     glyph grid in px (default 15)
     spec.reach    pointer pool radius in px (default 190)
     spec.lens     how much the pool brightens a cell (default 0.42)
     spec.ambient  resting alpha of the sparse cells (default 0.075)
     spec.fringe   red/cyan edge on the pool (default true)
     spec.track    what to listen to for the pointer when it is not the host (a host painted behind the
                   content never sees a pointermove over it)
     spec.pointer  false to leave the pointer pool unwired (touch screens have no hover)
     spec.expose   called with { sweep, wake } once the field is live (wake: draw again after being hidden)
     spec.pool     { x, y } in fractions of the host: a pool held there with no pointer (the idle terminals) */
import { glyphAtlas } from './ascii-glyphs.js';

export function mountAsciiField(spec) {
  {
    var host = spec.host;
    if (!host || !('requestAnimationFrame' in window)) { return; }

    var canvas = document.createElement('canvas');
    canvas.className = 'ascii-bg';
    canvas.setAttribute('aria-hidden', 'true');
    var ctx = canvas.getContext('2d');
    if (!ctx) { return; }
    host.insertBefore(canvas, host.firstChild);

    var RAMP = ' .,:;i1tfLCG08@';
    var CELL = spec.cell || 15;
    var REACH = spec.reach || 190;
    var LENS = spec.lens || 0.42;
    var AMB = spec.ambient || 0.075;
    var FRINGE = spec.fringe !== false;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var w = 0, h = 0, cols = 0, rows = 0, seed = null, stamp = null;
    var px = 0, py = 0, tracking = false;
    var onScreen = false, frame = 0, painted = 0;
    var sweepT = -1, sweepDur = 0, sweepBand = 0.34, sweepMid = null, sweepEnd = null;
    var sweepLast = 0, sweepClip = null, sweepStep = null;
    /* THE STRETCH OF CANVAS THE HEAD CROSSES, as a pair of fractions. The
       default is the whole width, which is what an ambient scan wants. A
       caller sweeping one column of content passes that column instead, so
       the band spends its whole duration crossing the thing being replaced
       rather than most of it crossing the empty page on either side. */
    var sweepX0 = 0, sweepX1 = 1;

    /* THE BAND'S OWN RANDOMNESS. The shader rerolls every swept cell off
       hash21(cell + floor(uTime * 14)); this is the same idea in two dimensions,
       and 14 rolls a second is what makes the band read as characters churning
       rather than as a gradient sliding. */
    function hash2(x, y) {
      var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }
    function sstep(a, b, x) {
      if (b === a) { return x < a ? 0 : 1; }
      var t = Math.min(Math.max((x - a) / (b - a), 0), 1);
      return t * t * (3 - 2 * t);
    }
    /* #2f6dff, the ink the hero passes its own sweep */
    var BAND_INK = [47, 109, 255];

    function measure() {
      var box = host.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(box.width));
      h = Math.max(1, Math.round(box.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      seed = new Float32Array(cols * rows);
      for (var i = 0; i < seed.length; i++) { seed[i] = Math.random(); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      stamp = glyphAtlas(RAMP, ctx.font, CELL, dpr); // the glyphs as pictures (ascii-glyphs.js)
      if (spec.pool) { px = spec.pool.x * w; py = spec.pool.y * h; tracking = true; }
    }

    /* resting tint and lens tint, both from the theme tokens: a canvas cannot
       blend with the page, so the glyphs have to be told which way to go. */
    var tintA = [255, 255, 255], tintB = [135, 185, 195];
    function readTint() {
      /* OFF THE HOST, NOT THE ROOT. These inherit, so for the two full-width
         bands this is the same value it always was; for a host that scopes its
         own palette it is the difference between the field being drawn in that
         box's ink and being drawn in the page's. */
      var cs = getComputedStyle(host);
      function trip(name, fallback) {
        var raw = cs.getPropertyValue(name).split(',');
        if (raw.length !== 3) { return fallback; }
        var out = [];
        for (var i = 0; i < 3; i++) {
          var n = parseFloat(raw[i]);
          if (isNaN(n)) { return fallback; }
          out.push(n);
        }
        return out;
      }
      tintA = trip('--ascii-a', tintA);
      tintB = trip('--ascii-b', tintB);
    }
    readTint();
    window.addEventListener('onblue:theme', readTint);

    function mix(i, lens) {
      return Math.round(tintA[i] + (tintB[i] - tintA[i]) * lens);
    }

    function paint(now) {
      ctx.clearRect(0, 0, w, h);
      var reach2 = REACH * REACH;
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var s = seed[y * cols + x];
          var cx = x * CELL + CELL * 0.5;
          var cy = y * CELL + CELL * 0.5;

          var ambient = s > 0.948 ? AMB + (still ? 0 : AMB * 0.47 * Math.sin(now * 0.0011 + s * 40)) : 0;
          var lens = 0;
          if (tracking) {
            var dx = cx - px, dy = cy - py, d2 = dx * dx + dy * dy;
            if (d2 < reach2) {
              var t = 1 - Math.sqrt(d2) / REACH;
              lens = t * t;
            }
          }
          /* THE BAND, LIFTED FROM THE SHADER RATHER THAN APPROXIMATED. Its
             falloff is the same two smoothsteps: up over the first 35 per cent
             of the band behind the head, then away between 55 and 100, so the
             leading edge is hard and the tail dissolves. It TRAILS the head,
             which is why the content is erased on the side it has passed.
             CONFINED TO THE CONTENT, for the reason the shader gives for
             confining itself to the model: a band across the whole frame reads
             as the viewport dissolving rather than as the thing being replaced. */
          var band = 0;
          if (sweepT >= 0 && (!sweepClip ||
              (cx >= sweepClip.x0 && cx <= sweepClip.x1 && cy >= sweepClip.y0 && cy <= sweepClip.y1))) {
            /* THE BAND NARROWS WITH THE TRAVEL. sweepBand is a fraction of
               what is being crossed, not of the canvas: held at 0.34 of the
               viewport while the head crosses a 400px column, one band would
               cover the column whole and there would be no edge to read. */
            var eBand = sweepBand * (sweepX1 - sweepX0);
            var behind = sweepHead() - cx / w;
            band = sstep(0, eBand * 0.35, behind) *
                   (1 - sstep(eBand * 0.55, eBand, behind));
          }

          /* AND IT SUPERSEDES THE CELL. In the shader the band is a max() over
             the resting mask, so a swept cell is the band's glyph and the band's
             ink, not the ambient one tinted. 82 per cent of cells light, which is
             the density that makes it a wall of characters. */
          if (band > 0.002) {
            var k = Math.floor(now * 0.014);
            if (hash2(x * 1.31 + 5.7, y * 1.31 + 2.3) < 0.82) {
              var roll2 = hash2(x * 0.73 + k, y * 0.73 + k * 0.37);
              var gi = (hash2(x + k * 0.37, y + k * 0.61) * RAMP.length) | 0;
              /* the brightest cells burn toward white, the way a phosphor tube does */
              var m = roll2 * 0.35;
              stamp(ctx, RAMP.charAt(gi),
                BAND_INK[0] + (255 - BAND_INK[0]) * m,
                BAND_INK[1] + (255 - BAND_INK[1]) * m,
                BAND_INK[2] + (255 - BAND_INK[2]) * m,
                Math.min(band * 1.2, 1), cx, cy);
            }
            continue;
          }

          var alpha = ambient + lens * LENS;
          if (alpha < 0.02) { continue; }

          var roll = (s + (still ? 0 : now * 0.00012) + lens * 0.35) % 1;
          var glyph = RAMP.charAt((roll * RAMP.length) | 0);

          var fringe = FRINGE ? lens * (1 - lens) * 4 : 0;
          if (fringe > 0.18) {
            var f = alpha * 0.14 * fringe;
            stamp(ctx, glyph, 255, 90, 90, f, cx - 1, cy);
            stamp(ctx, glyph, 90, 200, 255, f, cx + 1, cy);
          }

          stamp(ctx, glyph, mix(0, lens), mix(1, lens), mix(2, lens), alpha, cx, cy);
        }
      }
    }

    function tick(now) {
      frame = 0;
      /* hidden (visibility, AsciiBackdrop.tsx): nothing drawn, the canvas kept at its size; wake() resumes */
      if (!onScreen || host.style.visibility === 'hidden') { return; }

      /* THE THROTTLE COMES OFF WHILE THE BAND IS TRAVELLING. 14fps is what an
         ascii readout wants at rest and is visibly stepped on something crossing
         the screen in under a second. */
      var sweeping = sweepT >= 0;
      if (sweeping) {
        var delta = sweepLast ? Math.min((now - sweepLast) / 1000, 0.05) : 0;
        sweepLast = now;
        var before = sweepT;
        sweepT += delta / sweepDur;
        if (sweepStep) { sweepStep(sweepHead()); }
        if (before < 0.5 && sweepT >= 0.5 && sweepMid) { sweepMid(); sweepMid = null; }
        if (sweepT >= 1) {
          sweepT = -1;
          sweepLast = 0;
          sweepStep = null;
          sweepClip = null;
          sweepX0 = 0; sweepX1 = 1;
          if (sweepEnd) { var done = sweepEnd; sweepEnd = null; done(); }
        }
        paint(now);
        painted = now;
      } else if (now - painted >= 68) {
        painted = now;
        paint(now);
      }

      if (sweeping || !still || tracking) { frame = requestAnimationFrame(tick); }
    }
    function wake() { if (onScreen && !frame) { frame = requestAnimationFrame(tick); } }

    /* 0.85s, not the hero's 4: this one sits between a click and what it asked for. */
    /* ONE DEFINITION OF WHERE THE HEAD IS, in canvas fractions, read by the
       shader that paints the band and by the onStep that drives whatever the
       caller is masking. Two copies of this expression is how the glyphs and the
       content they are supposed to be dissolving drift apart. */
    function sweepHead() {
      var span = sweepX1 - sweepX0;
      var eBand = sweepBand * span;
      return sweepX0 - eBand + Math.min(sweepT, 1) * (span + 2 * eBand);
    }

    function runSweep(opts) {
      opts = opts || {};
      sweepDur = opts.duration || 0.85;
      sweepBand = opts.band || 0.34;
      sweepMid = opts.onMid || null;
      sweepEnd = opts.onEnd || null;
      sweepStep = opts.onStep || null;
      sweepClip = opts.clip || null;
      sweepX0 = typeof opts.x0 === 'number' ? opts.x0 : 0;
      sweepX1 = typeof opts.x1 === 'number' ? opts.x1 : 1;
      sweepLast = 0;
      sweepT = 0;
      if (still) {
        /* reduced motion gets the swap, not the scan */
        sweepT = -1;
        sweepStep = null;
        sweepClip = null;
        sweepX0 = 0; sweepX1 = 1;
        if (sweepMid) { sweepMid(); sweepMid = null; }
        if (sweepEnd) { var e = sweepEnd; sweepEnd = null; e(); }
        return;
      }
      wake();
    }
    if (spec.expose) { spec.expose({ sweep: runSweep, wake: function () { painted = 0; wake(); } }); }

    measure();

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { measure(); painted = 0; wake(); }).observe(host);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) { wake(); }
      }).observe(host);
    } else {
      onScreen = true;
    }

    /* DEFAULTED ON, so a caller that says nothing behaves exactly as before.
       paint() already gates the whole pool on `tracking`, so leaving these two
       unbound is all it takes: tracking never turns true and not one pool
       branch runs. */
    if (spec.pointer !== false) {
      var watcher = spec.track || host;
      watcher.addEventListener('pointermove', function (e) {
        var box = host.getBoundingClientRect();
        px = e.clientX - box.left;
        py = e.clientY - box.top;
        tracking = true;
        wake();
      }, { passive: true });
      watcher.addEventListener('pointerleave', function () {
        tracking = false;
        wake();
      }, { passive: true });
    }

    wake();
  }

}

