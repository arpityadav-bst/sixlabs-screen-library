"""Builds the loading spinner: turntable frames of the logo (logo-boot.js with spin, transparent), each
straightened into a front view on one fixed canvas so the mark turns about its centre, saved as a looping
animated WebP. Usage: python tools/tiles/turntable.py <frames dir> '<corners json>' <out.webp> [size] [ms]"""
import glob, json, sys
import numpy as np
from PIL import Image

frames_dir, corners, out = sys.argv[1], json.loads(sys.argv[2]), sys.argv[3]
size = int(sys.argv[4]) if len(sys.argv) > 4 else 240
ms = int(sys.argv[5]) if len(sys.argv) > 5 else 100
S, pad = 1000, 200  # the top-face square spans S; pad leaves room for the turning corners and the slab edge
C = S + 2 * pad
dst = [(pad, pad), (pad + S, pad), (pad + S, pad + S), (pad, pad + S)]
A, b = [], []
for (x, y), (u, v) in zip(dst, corners):
    A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
    b += [u, v]
coef = tuple(np.linalg.solve(np.array(A, float), np.array(b, float)))
frames = [Image.open(f).convert("RGBA").transform((C, C), Image.PERSPECTIVE, coef, Image.BICUBIC).resize((size, size), Image.LANCZOS)
          for f in sorted(glob.glob(f"{frames_dir}/f*.png"))]
frames[0].save(out, save_all=True, append_images=frames[1:], duration=ms, loop=0, lossless=False, quality=80, method=6)
print("saved", out, len(frames), "frames")
