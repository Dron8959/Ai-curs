#!/usr/bin/env bash
# A voiced version of one reel, next to the published one (posts/<id>/reel.mp4 is not touched):
#   sound/voice.sh 05        ->  social/concept/out/voice-sample-05.mp4
# The result is not committed: it carries a real person's voice, and this repository is public.
# Needs what build.sh needs (REAL_SOUND, SOUND_PY) and the lines in out/voice/<id>/ (tools/voice_clone.py).
# With VOICE_PY set (the Python of voice_clone.py) the finished file is also transcribed and compared with the lines.
set -euo pipefail
cd "$(dirname "$0")"
PY=${SOUND_PY:-python3}
SK=${REAL_SOUND:-$HOME/.claude/skills/real-sound}
[ -f "$SK/scripts/mix.py" ] || { echo "set REAL_SOUND to the real-sound skill folder (it holds scripts/mix.py)"; exit 1; }
f=$(ls audio/films/"${1:?reel id, e.g. 05}"*.json | head -1)
id=$(basename "$f" .json); O=out/voice/$id
[ -f "$O/lines.json" ] || { echo "no voice lines in $O: run tools/voice_clone.py ${id%%-*} first"; exit 1; }
mix() { $PY -I "$SK/scripts/mix.py" --root . --design "$O/film.json" --out "$O/soundtrack.wav" --stems "$O/stems" \
    --report "$O/mix_report.json" --cues-out "$O/cues_sounded.json" --trace "$O/adds.json"; }

rm -f "$O/hold.json"
python3 tools/voice_film.py "$id" > /dev/null          # place the lines, music at the standard level under them
mix > /dev/null
$PY tools/voice_film.py "$id" --fit | sed "s/^/$id  /"  # measure, and hold the music lower where a line needs it
python3 tools/voice_film.py "$id" | sed "s/^/$id  /"
mix | grep -E "PASS|FAIL|gate" | sed "s/^/$id  /"
$PY -I "$SK/scripts/qa.py" --root . --design "$O/film.json" --report "$O/mix_report.json" --trace "$O/adds.json" --stems "$O/stems" \
    --master "$O/soundtrack.wav" --cues "cues/$id.json" --cues-sounded "$O/cues_sounded.json" --out "$O/qa.json" --layers | grep -E "^QA|WARN|FAIL" | sed "s/^/$id  /" || true
$PY tools/voice_film.py "$id" --check | sed "s/^/$id  /" || true
node "$SK/scripts/mux.mjs" --video "../posts/$id/reel.mp4" --audio "$O/soundtrack.wav" --out "../out/voice-sample-${id%%-*}.mp4" | sed "s/^/$id  /"
# last check, if the voice Python is around: the speech model listens to the finished file, music included
[ -z "${VOICE_PY:-}" ] || $VOICE_PY tools/voice_clone.py "$id" --heard "../out/voice-sample-${id%%-*}.mp4" 2>/dev/null | sed "s/^/$id  /"
