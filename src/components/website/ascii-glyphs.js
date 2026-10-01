// The ASCII field's glyphs (ascii-field.js) drawn once each, as small pictures in the field's own font at the
// canvas's own scale, and stamped (drawImage) where the field set them as text (fillText) on every paint.
// Text set one glyph at a time is costly in Safari, which records every call and rasterises it on the
// processor; the field set some five hundred a paint. A glyph is drawn once per colour (each channel held to
// steps of 4 of 255, well under a visible step), centred as the field centred its text, and stamped at the
// same place, its opacity as globalAlpha (the same as text in a colour with that opacity).
const PAD = 4; // px round each glyph in its picture

export function glyphAtlas(chars, font, cell, dpr) {
  const S = Math.ceil(cell * dpr) + PAD * 2, // one glyph's picture, device px a side
    half = S / dpr / 2;
  const sheets = new Map();
  const sheet = (r, g, b) => {
    const key = (r << 16) | (g << 8) | b;
    let c = sheets.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = S * chars.length;
    c.height = S;
    const x = c.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.font = font;
    x.textBaseline = 'middle';
    x.textAlign = 'center';
    x.fillStyle = `rgb(${r},${g},${b})`;
    for (let i = 0; i < chars.length; i++) x.fillText(chars[i], (i * S) / dpr + half, half);
    sheets.set(key, c);
    return c;
  };
  const step = (v) => Math.min(255, Math.round(v / 4) * 4);
  // the glyph `ch` centred at (x, y) css px, in rgb at `alpha`
  return (ctx, ch, r, g, b, alpha, x, y) => {
    const i = chars.indexOf(ch);
    if (i < 0 || ch === ' ' || alpha <= 0) return;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.drawImage(sheet(step(r), step(g), step(b)), i * S, 0, S, S, x - half, y - half, S / dpr, S / dpr);
  };
}
