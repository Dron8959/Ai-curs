#!/usr/bin/env bash
# Mixes, checks and attaches the soundtrack of one reel (or of all seven).
#   sound/build.sh 01            one reel (any prefix of its folder name)
#   sound/build.sh               all reels
# Needs: the recordings (python3 tools/fetch.py), the real-sound skill (REAL_SOUND = its folder) and a Python with
# numpy, scipy, soundfile, librosa, pyloudnorm and soxr (SOUND_PY). The picture (posts/<id>/reel.mp4) and the cue
# file (cues/<id>.json) come from `node social/concept/render.mjs reel <id>`.
set -euo pipefail
cd "$(dirname "$0")"
PY=${SOUND_PY:-python3}
SK=${REAL_SOUND:-$HOME/.claude/skills/real-sound}
[ -f "$SK/scripts/mix.py" ] || { echo "set REAL_SOUND to the real-sound skill folder (it holds scripts/mix.py)"; exit 1; }
$PY tools/films.py > /dev/null
for f in audio/films/${1:-}*.json; do
  id=$(basename "$f" .json); O=out/$id; mkdir -p "$O"
  $PY -I "$SK/scripts/mix.py" --root . --design "$f" --out "$O/soundtrack.wav" --stems "$O/stems" --report "$O/mix_report.json" \
      --cues-out "$O/cues_sounded.json" --trace "$O/adds.json" | grep -E "PASS|FAIL|gate" | sed "s/^/$id  /"
  $PY -I "$SK/scripts/qa.py" --root . --design "$f" --report "$O/mix_report.json" --trace "$O/adds.json" --stems "$O/stems" \
      --master "$O/soundtrack.wav" --cues "cues/$id.json" --cues-sounded "$O/cues_sounded.json" --out "$O/qa.json" --layers | grep -E "^QA|WARN|FAIL" | sed "s/^/$id  /" || true
  V=../posts/$id/reel.mp4
  if [ -f "$V" ] && [ -z "${NOMUX:-}" ]; then
    rm -f "$O/picture_prev.mp4"
    node "$SK/scripts/mux.mjs" --video "$V" --audio "$O/soundtrack.wav" --out "$V" --keep-old "$O/picture_prev.mp4" | grep -v "previous version" | sed "s/^/$id  /"
  fi
done
