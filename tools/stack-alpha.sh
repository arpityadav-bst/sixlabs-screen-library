#!/usr/bin/env bash
# Builds the players' Safari clips (public/players/*-stacked.mp4) from their WebMs: the colour, premultiplied
# by its transparency, in the top half and the transparency as grey in the bottom half (stacked-alpha.ts
# puts them back together). Every frame is a keyframe, as in the WebMs, so a scrub lands on its frame at
# once instead of decoding its way there from the last keyframe; that is what kept Safari's turn jerky.
# Run from the project root: bash tools/stack-alpha.sh
set -e
cd public/players
for f in explorer explorer-ai grinder grinder-ai spender spender-ai lost lost-ai; do
  ffmpeg -hide_banner -loglevel error -y -c:v libvpx-vp9 -i "$f.webm" \
    -filter_complex "[0:v]format=rgba,split[c][a];[a]alphaextract,format=rgb24[al];[c]premultiply=inplace=1,format=rgb24[cc];[cc][al]vstack,format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -profile:v high -preset slow -crf 23 -g 1 -keyint_min 1 -bf 0 \
    -movflags +faststart "$f-stacked.mp4"
  echo "$f-stacked.mp4 $(stat -c %s "$f-stacked.mp4")"
done
