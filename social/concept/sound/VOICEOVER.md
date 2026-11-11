# Voice-over: lines and timing

The published reels have music and effects and no voice. A voice is the owner's call. This file is what a
voice needs: the line for every scene and the seconds it has. One sample exists, reel 05 (see "State").

## Four ways to do it
1. **Anna and Kamilla record it.** The brand is a mom and a daughter, not a corporation, and their real
   voices say that better than any design. A real voice also needs no AI label. A phone is enough: a quiet
   room, the phone 15-20 cm from the mouth, one voice memo per reel, each line said twice with a breath
   between. The files go to `social/media/voice/` (any format; that folder never reaches git). They get cut
   to the scenes, the music is held down under each line, and the reel is mastered again.
2. **Anna's own voice, cloned from her recording.** On 11 November 2026 the owner sent a recording of Anna
   for this (85 s, English). An open model (Chatterbox, MIT licence) reads her lines in her voice on this
   machine; the recording is not uploaded to any service. Three conditions:
   - Anna agrees to it, and hears every reel before it goes out;
   - every reel with it carries the platform's AI label. That is the brand's own rule (AI is always
     labelled), and the platforms ask for it when a synthetic voice sounds real;
   - the recording and everything made from it stay out of git: this repository is public.

   Only Anna. Kamilla is a child and her voice is not cloned. Her lines (reels 02, 06, 07) she records
   herself, or those reels stay without a voice.
3. **A neutral AI narrator.** A stock voice saying "I'm Anna" would not be true, so it could only read
   lines that do not speak as Anna or Kamilla. The weakest option for this brand.
4. **No voice.** Text on screen, music and effects. This is what the reels are now.

Routes 1 and 2 work together: the clone is quick for trying a line and its timing, and Anna can record the
final take once the words are settled.

## State on 11 November 2026: one sample
Reel 05 has a voiced version for the owner to judge: `social/concept/out/voice-sample-05.mp4` (not in the
repository). Route 2, four lines by Anna. What was measured:
- **Words.** Every take, and then the finished file with music and effects, went through an open speech
  model (Whisper small). All four lines came back word for word both times.
- **Resemblance.** By the voice model's own speaker encoder, where 1.0 is the same voice: the four lines
  score 0.86-0.90 against Anna's recording. For scale, two halves of her own recording score 0.97 against
  each other, and the model's stock voice scores 0.54.
- **Levels.** The voice stands 12-25 dB over music and effects, and 8-20 dB over them between 1 and 4 kHz,
  where consonants live. The MP4 is at -14.0 LUFS, true peak -2.2 dBTP.
- **Not measured: whether it sounds like her, and alive rather than read out.** Nobody has listened. That is
  for Anna and the owner. Known limits: the model works at 24 kHz, so the voice is a little duller than a
  good recording; her recording is dark by itself (3-4 dB less than average speech between 1 and 5 kHz), so
  the voice gets 3 dB around 2.5 kHz in the mix.
- The voice model stamps its output with an inaudible watermark (Resemble Perth). Whether it survives the
  mix and the AAC encode was not tested.

Nothing else is voiced until the owner approves this one.

## Making a voiced version
```
python3 -m venv v && v/bin/pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu \
  && v/bin/pip install chatterbox-tts                           # once: VOICE_PY=v/bin/python, about 2 GB + 4 GB of models
$VOICE_PY social/concept/sound/tools/voice_clone.py 05          # Anna's lines of reel 05; each take checked word for word
REAL_SOUND=<skill folder> SOUND_PY=<as for build.sh> VOICE_PY=<as above> social/concept/sound/voice.sh 05
```
`voice.sh` places the lines, holds the music down under them, mixes, checks and writes
`social/concept/out/voice-sample-05.mp4`. The published `reel.mp4` is not touched. A reel takes a few minutes
on a CPU. Cutting a real recording into lines (route 1) is not built yet; placing and mixing are shared.

Where a line starts: 0.35 s after its scene begins. A word in *stars* lands on the picture: the line is
placed so that this word arrives with the first thing that lands in the scene. On the closing card the line
waits 0.4 s after the logo. Under a line the music is held 13 dB below its full level, lower if the
measurement asks for it (`tools/voice_film.py` explains the rules).

## Lines
Every fact is the same as in the captions (`social/brand/facts.md`). Aim for 2.5 words a second or fewer;
lines marked (tight) are over 3 and want a brisk read or a trim. Anna speaks reels 01, 04, 05 and 08,
Kamilla 06 and 07, both of them 02.


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
