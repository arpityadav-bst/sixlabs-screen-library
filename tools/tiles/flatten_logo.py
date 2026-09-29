"""Straightens a logo render (logo-boot.js, transparent) into a front view: the mark's top-face square,
seen at the tile floor's camera angle, is mapped back to a square, then cropped and scaled for the site.
Usage: python tools/tiles/flatten_logo.py <render.png> '<corners json>' <out.png> [size]"""
import json, sys
import numpy as np
from PIL import Image

src, corners, out = sys.argv[1], json.loads(sys.argv[2]), sys.argv[3]
size = int(sys.argv[4]) if len(sys.argv) > 4 else 192
im = Image.open(src).convert("RGBA")
S = 2000  # working square: the top-face square fills it
dst = [(0, 0), (S, 0), (S, S), (0, S)]
# coefficients map each output pixel back to the render (PIL's perspective transform runs output -> input)
A, b = [], []
for (x, y), (u, v) in zip(dst, corners):
    A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
    b += [u, v]
coef = np.linalg.solve(np.array(A, float), np.array(b, float))
flat = im.transform((S, int(S * 1.15)), Image.PERSPECTIVE, tuple(coef), Image.BICUBIC)
flat = flat.crop(flat.getbbox())
w, h = flat.size
side = max(w, h)
sq = Image.new("RGBA", (side, side))
sq.paste(flat, ((side - w) // 2, (side - h) // 2))
sq.resize((size, size), Image.LANCZOS).save(out)
print("saved", out, flat.size)
