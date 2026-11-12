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
  (the pictures that are AI-made keep theirs). Kamilla is a child and her voice is never cloned.

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
| 3 | 6.5-10.6 | Kid's idea. AI follows the drawing. And you're right there. | 2.7 |
| 4 | 10.6-13.8 | What will yours draw? | 1.5 |

### 02-meet-anna-kamilla · Anna and Kamilla · 19.4 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | Anna: We're a mom and a daughter. | 2.6 |
| 2 | 2.8-5.1 | Kamilla: Not a corporation. | 1.7 |
| 3 | 5.1-8.8 | Anna: I'm Anna. I built every lesson myself. | 2.2 |
| 4 | 8.8-12.0 | Kamilla: I'm Kamilla, I'm ten, and I go first. | 2.9 |
| 5 | 12.0-16.2 | Anna: We tested it all at our kitchen table. What lost her attention got cut. | 3.8 (tight) |
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
| 1 | 0.0-2.8 | One lesson. Three steps. | 1.8 |
| 2 | 2.8-6.5 | Watch: I show you the finished thing. | 1.9 |
| 3 | 6.5-10.2 | Make: you build yours, with a parent next to you. | 2.8 |
| 4 | 10.2-14.3 | Show: play it, and send it to grandma. | 1.9 |
| 5 | 14.3-17.5 | One lesson. One real thing. | 1.8 |

### 07-made-by-10-year-old · Kamilla · 17.5 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | I'm ten, and I made all of this. | 3.5 (tight) |
| 2 | 2.8-6.5 | A cartoon. My story, my characters. | 1.9 |
| 3 | 6.5-10.2 | A game you can play. | 1.6 |
| 4 | 10.2-14.3 | And stickers of my own character. | 1.6 |
| 5 | 14.3-17.5 | What would you make? | 1.5 |

### 08-will-ai-think · Anna · 17.5 s
| scene | seconds | line | words/s |
|---|---|---|---|
| 1 | 0.0-2.8 | Will AI think for my kid? | 2.6 |
| 2 | 2.8-6.5 | Only if the AI has the ideas. | 2.2 |
| 3 | 6.5-10.6 | In every lesson she decides, tells the AI, checks it, fixes it. | 3.3 (tight) |
| 4 | 10.6-14.3 | Don't let AI think for your child. Teach them to think with it. | 4.1 (tight) |
| 5 | 14.3-17.5 | Let them do the thinking. | 1.8 |

Reel 04 is built on the 7:02 to 7:41 story, which still needs Anna's confirmation (see `social/brand/facts.md`).
