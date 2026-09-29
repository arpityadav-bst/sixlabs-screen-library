"""Builds the hero loader image (public/brand/sixlabs-mark-floor.webp): the white glass logo render at the
tile camera angle, contrast-boosted against a render of the bare floor (so the faint glass reads without
changing the floor tone), then straightened into a front view on a fixed square. The site tilts it back
onto the floor in CSS (.floor-spin), which restores the original view.
Usage: python tools/tiles/floor_logo.py <logo.png> <bare-floor.png> '<corners json>' <out.webp> [boost]"""
import json, sys
import numpy as np
from PIL import Image

logo, bare, corners, out = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]), sys.argv[4]
boost = float(sys.argv[5]) if len(sys.argv) > 5 else 3.0
a = np.asarray(Image.open(logo).convert("RGB"), float)
f = np.asarray(Image.open(bare).convert("RGB"), float)
im = Image.fromarray(np.clip(f + boost * (a - f), 0, 255).astype(np.uint8)).convert("RGBA")
S, pad = 1000, 260
C = S + 2 * pad
dst = [(pad, pad), (pad + S, pad), (pad + S, pad + S), (pad, pad + S)]
A, b = [], []
for (x, y), (u, v) in zip(dst, corners):
    A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
    b += [u, v]
coef = tuple(np.linalg.solve(np.array(A, float), np.array(b, float)))
im.transform((C, C), Image.PERSPECTIVE, coef, Image.BICUBIC).resize((1200, 1200), Image.LANCZOS).save(out, quality=85, method=6)
print("saved", out)
