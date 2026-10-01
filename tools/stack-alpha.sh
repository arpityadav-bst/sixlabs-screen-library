#!/usr/bin/env bash
# Builds the players' Safari clips (public/players/*-stacked.mp4) from their WebMs: the colour, premultiplied
# by its transparency, in the top half and the transparency as grey in the bottom half (stacked-alpha.ts
# puts them back together). A keyframe every 3 frames, so a scrub lands on its frame decoding at most 3, and
# 2 reference frames (no more are needed); each frame in 8 slices, so a software decoder (Chrome's, for the
# page's own decoding, clip-frames.ts) spreads a frame over its cores: 2 to 3 times faster a frame, for 2-4%
# more file. (The site's files were last made from lossless references at crf 23, veryslow, these settings.)
# Run from the project root: bash tools/stack-alpha.sh [folder under public] [clip names...]
# (the hologram set: bash tools/stack-alpha.sh players-holo explorer-ai grinder-ai spender-ai lost-ai)
set -e
cd "public/${1:-players}"
shift || true
for f in ${@:-explorer explorer-ai grinder grinder-ai spender spender-ai lost lost-ai}; do
  ffmpeg -hide_banner -loglevel error -y -c:v libvpx-vp9 -i "$f.webm" \
    -filter_complex "[0:v]format=rgba,split[c][a];[a]alphaextract,format=rgb24[al];[c]premultiply=inplace=1,format=rgb24[cc];[cc][al]vstack,format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -profile:v high -preset veryslow -crf 23 -g 3 -keyint_min 1 -bf 0 -refs 2 -slices 8 \
    -movflags +faststart "$f-stacked.mp4"
  echo "$f-stacked.mp4 $(stat -c %s "$f-stacked.mp4")"
done
