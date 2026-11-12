# Voice-over: lines and timing

The published reels have music and effects and no voice yet. The voice will be two real people: Anna and
Kamilla record the lines themselves (the owner's decision, 12 November 2026). This file holds the lines, the
history of that decision and what turns a phone recording into a voiced reel.

## How the decision was made
- **11 Nov:** one sample, reel 05 with Anna's voice cloned from her recording by an open model (Chatterbox,
  MIT, run on this machine). By measurement it was fine: every line heard word for word, resemblance 0.86-0.90
  to her recording (two halves of her own recording score 0.97, a stranger's voice 0.54), the voice 12-25 dB
  over the music.
- **12 Nov:** the owner listened: weak, not how a person speaks, no life in it. Rejected. Measurements say
  nothing about life, which is exactly what was missing. The cloned voice is not used for any published reel.
  The tools stay (`tools/voice_clone.py`) as a scratch voice for trying a line's length, never for publishing.
- **12 Nov:** Anna and Kamilla record every line live, with expression. A real voice also needs no AI label
  (the pictures that are AI-made keep theirs).
- **12 Nov, the owner's plan:** if they speak with real emotion, the cloned voice made from that recording may come
  out alive too, and then new reels can be voiced without them. That is what scales; live recording does not.
  See "A voice that does not depend on them" below.

## What each of them records
Two briefs, one PDF each: `social/concept/out/voice-brief-anna.pdf` and `voice-brief-kamilla.pdf`
(`node social/concept/sound/tools/voice_brief.mjs` builds them from this file; it stops if a line here and in
the brief differ). First page: how to record on a phone. Then a page per reel: every line, what it means in
Russian, how to say it, boxes for the takes.
- **Anna:** reels 02, 05, 08. **Kamilla:** reels 02, 06, 07. The last line of 02 they say together, into one phone.
- **Reels 01 and 04 wait.** They stand on two facts the owner has not confirmed (the 6-year-old's drawing, the
  7:02 to 7:41 story). Recording before that risks recording twice.
- One recording per reel, any phone voice-memo app (not a messenger's voice message: it is squeezed), 5 s of
  silence first, every line twice with a pause between. No names or numbers need to be said.

## From recording to voiced reel
```
# 1. the recordings go to social/media/voice/ (any names, any format; that folder never reaches git)
# 2. cut them into lines: needs a Python with torch, transformers, librosa, soundfile, scipy (VOICE_PY)
$VOICE_PY social/concept/sound/tools/voice_cut.py            # or: ... voice_cut.py --reel 05
# 3. place the lines on the reel, hold the music down under them, mix, check, mux
REAL_SOUND=<skill folder> SOUND_PY=<as for build.sh> VOICE_PY=<as above> social/concept/sound/voice.sh 05
# 4. a take sounds better than the automatic choice? swap it and repeat 3
$VOICE_PY social/concept/sound/tools/voice_cut.py --use 05:3=2
```
`voice_cut.py` finds the phrases, has an open speech model (Whisper small, local, nothing uploaded) write each
down with word times, and matches them against the lines below, so recordings need no names. A line said twice
gives two takes, a false start is skipped, a breath before a line is dropped. The cuts go to
`out/voice/<reel>/<scene>.wav` (takes in `takes/`). The automatic choice: heard word for word, then not clipped,
then cleaner, then the later one. Which take sounds best is for ears. Anything doubtful is printed: a line not
found, noise, clipping, an edge cut by guess. `--model openai/whisper-medium` hears kids and accents better.

**The picture follows the voice.** A person says a line slower than a scene allows. When a line is longer than
its scene, `voice.sh` stops and says how many beats the scene needs; add them in `reels.mjs`, re-render the reel
(`node social/concept/render.mjs reel 05`) and run it again. The music cut of the reel (`music-edits.json`)
follows the length, so a longer reel means rebuilding that reel's sound. This is manual for now.

Where a line starts: 0.35 s after its scene begins. A word in *stars* lands on the picture: the line is placed so
that this word arrives with the first thing that lands in the scene. On the closing card the line waits 0.4 s
after the logo. Under a line the music is held 13 dB below its full level, lower if the measurement asks for it
(`tools/voice_film.py` explains the rules). The published `reel.mp4` is never touched: the voiced reel is written
next to it (`social/concept/out/voice-sample-NN.mp4`, not committed) until the owner approves it.

## A voice that does not depend on them
The goal: a generated voice that can read lines Anna and Kamilla never recorded. The first sample failed, and the
measurements say why it is worth another try rather than giving up:
- The voice model takes the **manner of speaking** from the first 6 s of its reference (its style prompt), the
  timbre from the first 10 s, the speaker's identity from the whole file (read from its source, `chatterbox/tts.py`).
- The first reference opened with a flat script reading. Anna's voice moved **6.6 semitones** in it (10th to 90th
  percentile of pitch, spread 2.5). The cloned lines moved 7.0-7.5: as much as the reference, no more. The sample
  copied a flat reading.
- Turning the model's own knobs up (exaggeration .8-1.1, cfg .3, temperature .8-.9) on the same recording gave no
  steady gain (6 lines: range 5.2-10.6 semitones, run-to-run spread as big as the effect) and two lines with wrong
  words ("reading" for "reason"). The lever is the reference, not the knobs.

So when the live recordings arrive:
1. **Measure whether they acted:** `$VOICE_PY tools/voice_ref.py <recording>` prints how far the voice moves against
   the 6.6 of the first recording. Much higher means expression; about the same means a second reading. This is
   pitch only, not taste.
2. **Cut the live version** (above).
3. **Clone from the most lively 10 s** of the same recordings: `$VOICE_PY tools/voice_clone.py 05` (`--who Kamilla
   --ref <her recording>` for her). It writes the reference itself (`voice_ref.py` picks it) and checks every take
   word for word.
4. **Compare by ear:** the live reel and the cloned one, same reel. Only ears say whether it is alive.

Extra for the recording, optional: 1-2 minutes of **free speech** at the end (Anna: what the course is, as to a
friend; Kamilla: the game she made), emotions and laughter allowed. Free speech has the manner a reading lacks, and
it is the best reference there is.

If a 10-second reference is not enough, the usual next step is one longer recording session (30-60 minutes of
varied speech) to train a proper voice, with an open model or a paid service. It is one session instead of one per
reel. A paid service means Anna's voice leaves this machine: only with the owner's go-ahead and Anna's consent.

**Kamilla is a child.** Her voice is cloned only with her mother's explicit consent. The recording and the voice
made from it stay private, never in git, never given to a service without that consent. Anything with a cloned
voice carries the platform's AI label.

Not built yet: noise removal (add it only if the real recordings need it), and the voice for reel 02's joint
line is cut from whichever recording holds it.

## Lines
Every fact is the same as in the captions (`social/brand/facts.md`). Anna speaks reels 01, 04, 05 and 08,
Kamilla 06 and 07, both of them 02. The seconds are the scene lengths of the reels today. A person with
expression is slower than a scene made for a machine voice (lines marked (tight) are over 3 words a second),
and the picture follows the voice, so these numbers are a starting point, not a limit.


### 01-crayon-to-cartoon · Anna · 13.8 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | A six-year-old drew this. | 1.8 |
| 2 | 2.8-6.5 | One lesson later, it's a cartoon. | 1.9 |
| 3 | 6.5-10.6 | The kid draws it, the AI follows it, and you're right there. | 2.9 |
| 4 | 10.6-13.8 | What will yours draw? | 1.5 |

### 02-meet-anna-kamilla · Anna and Kamilla · 19.4 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | Anna: We're a mom and a daughter. | 2.6 |
| 2 | 2.8-5.1 | Kamilla: My mom and me. | 1.7 |
| 3 | 5.1-8.8 | Anna: I'm Anna. I built every lesson myself. | 2.2 |
| 4 | 8.8-12.0 | Kamilla: I'm Kamilla, I'm ten, and I go first. | 2.9 |
| 5 | 12.0-16.2 | Anna: We tested every lesson at our kitchen table. | 1.9 |
| 6 | 16.2-19.4 | Both: A mom, a daughter, and you. | 2.2 |

### 04-idea-to-game · Anna · 17.5 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | Seven oh two. She has an idea. | 3.1 (tight) |
| 2 | 2.8-6.5 | Seven forty-one. We're playing it. | 1.6 |
| 3 | 6.5-10.2 | Against each other, at the same table. | 2.2 |
| 4 | 10.2-14.3 | She decided, told the AI, checked, and fixed it. | 2.5 |
| 5 | 14.3-17.5 | Your kid's idea. Tonight? | 1.5 |

### 05-reason-to-show · Anna · 15.7 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-3.7 | Kids don't need more screen time. | 1.9 |
| 2 | 3.7-8.3 | They need a reason to *show* you something. | 1.9 |
| 3 | 8.3-12.5 | A screen she makes on is not a screen she scrolls. | 3.0 (tight) |
| 4 | 12.5-15.7 | Make the screen worth it. | 1.8 |

### 06-watch-make-show · Kamilla · 17.5 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | One lesson has three steps. | 1.8 |
| 2 | 2.8-6.5 | First you watch. I show you the finished thing. | 2.4 |
| 3 | 6.5-10.2 | Then you make yours, with a parent next to you. | 2.7 |
| 4 | 10.2-14.3 | Then you show it. Play it, send it to grandma. | 2.4 |
| 5 | 14.3-17.5 | One lesson, and you made a real thing. | 2.5 |

### 07-made-by-10-year-old · Kamilla · 17.5 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | I'm ten, and I made all of this. | 3.5 (tight) |
| 2 | 2.8-6.5 | A cartoon. My story, my characters. | 1.9 |
| 3 | 6.5-10.2 | A game I made. | 1.1 |
| 4 | 10.2-14.3 | And stickers of my own character. | 1.6 |
| 5 | 14.3-17.5 | What would you make? | 1.5 |

### 08-will-ai-think · Anna · 19.4 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-4.2 | Will AI think for my kid? | 1.7 |
| 2 | 4.2-8.3 | Only if the AI has the ideas. | 1.9 |
| 3 | 8.3-12.5 | She decides, tells the AI, checks it and fixes it. | 2.4 |
| 4 | 12.5-16.2 | Don't let AI think for your child. | 1.9 |
| 5 | 16.2-19.4 | Teach them to think with it. | 2.0 |

Reel 04 is built on the 7:02 to 7:41 story, which still needs Anna's confirmation (see `social/brand/facts.md`).
