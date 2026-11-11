# Sound brief: Make Show Lab reels

The contract for the soundtrack of every reel in `social/concept`. Built with the `real-sound` skill:
real recordings only, one licensed music track, nothing synthesized, every sound on a frame the picture
code computes.

## Concept
- **Personality:** bright and friendly, warm, made at a kitchen table. Not corporate, not cartoon-silly.
- **Palette:** paper and soft pops. The picture is sticker cards, tape and handwritten notes, so things
  sound like paper landing, paper sliding, a pencil, and a soft mouth pop for labels. One air swish.
- **Music:** one track for the whole series, so the account has a sound of its own: "Playground Fun" by
  Ahjay Stelino (Mixkit), 130 BPM, C major, mallets and double bass. Each reel is a different cut of it.
- **Arc of every reel:** the track's soft opening under the hook, its big entrance on the reveal, its own
  last chord on the logo, then a tail into silence so the loop lands clean.

## Picture map (cue kinds written by `render.mjs`)
| cue | on screen | sound | sits on |
|---|---|---|---|
| `land` | a card, a photo or a character lands | paper landing + a soft low thud under it | its loudest moment 20 ms after contact |
| `pop` | a label, number, badge, portrait or the button pops in | one of five takes of a soft pop; big things three semitones lower with a short low body | 50 % of its travel |
| `slide` | a row slides in | a sheet sliding to a stop | its end on the frame the row stops |
| `write` | a handwritten note is written | a pencil on paper, 0.6 s | the first stroke |
| `whoosh` | the two transitions per reel that matter (into the reveal, into the closing card) | one air swish | its peak on the fastest moment of the wipe |
| `cut` | every other transition | nothing: the music carries it | |
| `logo` | the stacked logo on the closing card | nothing of its own: the music's last chord lands here | a bar line |
| stars, tape, text rising, Ken Burns, the scrolling phone | decoration and continuous motion | nothing | |

## Timing
The reels are cut to the track: every scene lasts a whole number of beats at 130 BPM, entrances that make
a sound are read on a beat, the reveal and the logo fall on bar lines.

## Licences
Mixkit Sound Effects Free License and Mixkit Stock Music Free License only (texts in `LICENCES_READ.md`).
Both allow commercial social video and edits and need no credit. Never publish the raw files, never
register a reel with Content ID or another rights service.

## Quality bar
-14 LUFS integrated, true peak at most -1 dBTP after AAC, LRA 5-9 LU, the loudest moment on the reveal,
about 5-7 effects per 10 s, effects mono and near the centre, no click, no chopped tail, every effect
audible over the music. `qa.py` has to pass with no warning.

## What nobody has done yet
Nobody has listened. The agent that built this cannot hear: recordings were chosen by title, measurement
and spectrogram, the mix by the checks above. A person has to listen before the reels go out.
