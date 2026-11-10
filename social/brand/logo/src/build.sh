#!/usr/bin/env bash
# Rebuilds every logo file from the sources in this folder.
#   ./build.sh <fonts-dir>     fonts-dir: any folder after `npm i opentype.js @fontsource/sora @fontsource/urbanist`
set -euo pipefail
cd "$(dirname "$0")"
python3 make_icon.py
node build.mjs "$1" >/dev/null
r() { node render.cjs "$1" "$2" ${3:-}; }
# 1. avatar: profile picture for Instagram, Facebook and Threads
cp avatar.svg ../avatar/avatar.svg;                 r avatar.svg ../avatar/avatar-1080.png
# 2. reels: the plate that sits on every reel, and the stacked logo that closes it
cp plate.svg ../reels/plate.svg;                    r plate.svg ../reels/plate.png; r plate.svg ../reels/plate@2x.png 1104
cp logo-stacked-dark.svg ../reels/end-logo.svg;     r logo-stacked-dark.svg ../reels/end-logo.png 1600
# 3. logo: lock-ups and parts
for n in horizontal-dark horizontal-light stacked-dark stacked-light; do
  cp logo-$n.svg ../logo/logo-$n.svg; r logo-$n.svg ../logo/logo-$n.png $([[ $n == horizontal* ]] && echo 2400 || echo 1600)
done
cp wordmark-dark.svg wordmark-light.svg icon.svg icon-plain.svg icon-small.svg char-anna.svg char-kamilla.svg ../logo/
r icon.svg ../logo/icon.png; r icon-small.svg ../logo/icon-small.png
# generated intermediates stay out of git
rm -f avatar.svg plate.svg logo-*.svg wordmark-*.svg icon*.svg char-*.svg icons.json
