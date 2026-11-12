# Sound of the reels

Music and effects for the seven reels in `social/concept/posts`. Process and rules: the `real-sound`
skill (real recordings, one licensed track, a deterministic mixer, measured instead of listened to).

| file | what |
|---|---|
| `audio/SOUND_BRIEF.md` | the concept, the palette, which picture event gets which sound |
| `cues/<id>.json` | when every event happens, written by `render.mjs` from the reel timeline |
| `audio/design/*.json` | the palette: trimmed samples and the rules that place them on cues |
| `audio/music-edits.json` | how the track is cut for each reel, in bars |
| `audio/films/<id>.json`, `audio/design/music-<id>.json` | per-reel design, written by `tools/films.py` |
| `audio/assets/sources.json`, `audio/assets/manifests/` | every recording considered; the ones used, with licence audit |
| `audio/LICENCES_READ.md`, `CREDITS.md` | the licence texts as read, and the credits |
| `tools/fetch.py` | downloads the recordings (they are not in the repository) |
| `tools/events.py`, `tools/chords.py` | list the sounds inside a recording / the chord of every bar |
| `build.sh` | mix, check and attach the soundtrack |
| `VOICEOVER.md` | the voice: the options, the lines, the state of the one sample |
| `tools/voice_brief.mjs` | the recording briefs for Anna and Kamilla (PDF) |
| `tools/voice_cut.py`, `tools/voice_film.py`, `voice.sh` | live recordings -> lines -> a voiced version of a reel next to the published one |
| `tools/voice_clone.py` | a scratch voice cloned from a recording; rejected for publishing (see `VOICEOVER.md`) |

## Rebuild
```
python3 social/concept/sound/tools/fetch.py                 # once: the recordings
node social/concept/render.mjs reel 01                      # picture + cue file
REAL_SOUND=<real-sound skill folder> SOUND_PY=<python with numpy scipy soundfile librosa pyloudnorm soxr> \
  social/concept/sound/build.sh 01                          # mix, QA, attach to posts/01-.../reel.mp4
```
`build.sh` with no argument does all seven. It prints the master gate (loudness, true peak) and the QA verdict.

## Change something
- **Another track:** add it to `sources.json`, measure it (`analyze.py --music`, `arrange.py`), set `BPM`
  in `kit.mjs` to its tempo, write its bars into `music-edits.json`, re-render the reels and rebuild.
- **A voice-over:** see `VOICEOVER.md`. Voice recordings and anything made from them are never committed.
- **Levels:** the `gain_db` of a rule in `audio/design/*.json`.

## State on 11 November 2026
All seven reels pass: -14.0 LUFS, true peak -1.7 to -2.2 dBTP in the MP4, LRA 5.5-6.4 LU, no click, every
effect audible, every placement on its cue. Not done: listening by a person, and the skill's listening
tools (earshot) were not available, so "is it a real recording" and "does it sound right" rest on the
library's own description and on measurements.

The seven published reels have no voice. Anna and Kamilla record the lines themselves; a cloned sample
was tried and rejected as lifeless. Details in `VOICEOVER.md`.
