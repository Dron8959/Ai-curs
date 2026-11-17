---
name: "channel-motion-animation"
description: "Use when making animated 2D/2.5D/3D motion graphics in code with Claude (HTML, GSAP or Remotion) for the YouTube channels or for Make Show Lab reels and Shorts, from a script and a style reference."
---

# Motion graphics in code

Based on the method shown in two public videos (Vizavi, Painer; their skill files were not available, these rules are our version) and on what we learned building the Make Show Lab reels. Texts follow `human-content-no-ai-slop`, the edit and the checks follow `make-show-lab-editing`.

## Three rules
1. High quality by default. Write the numbers down before drawing: safe zones and text sizes for 9:16 and 16:9, scene length, tempo, blur, sound levels. Colours and fonts (with Cyrillic where needed) come from the plan, not from the tool.
2. Idea first, animation second. One directing idea ties the scenes together: the contradiction between what is said and what is shown, or a question, its paradox and its answer. Write 3-5 variants of each scene and keep the one where the idea works hardest.
3. The first result is a draft. Review every scene on a contact sheet, find the boring and the broken, fix them, and only then show it.

## Numbers
| | Reels / Shorts 1080x1920 | YouTube 1920x1080 |
|---|---|---|
| on-screen line | six words or fewer, inside x 64-850, y 250-1440 | one idea per card, title-safe 90% frame |
| scene | one story beat, about 4 s at most | one beat, longer allowed under voice |
| tempo | cut to the music (130 BPM in our reels), reveal and logo on bar lines | the same if music-led |
| voice | about 2.5 words/s; scene grows to fit the line | same |

## How we build (Make Show Lab reels)
- HTML scenes on a paused GSAP timeline; every frame is seeked and screenshotted, ffmpeg joins them. The timeline also writes the sound cues, so effects land on the frame the eye reads.
- One template for the week, per-post data apart: scene 1 is the cover tile, three scenes of one line each, a closing card.
- Real footage plays inside the scene (`<video data-clip>`), so the kid's cartoon can run full screen under a sticker line.
- Renders run in the background; after each one, check the file, not the log.

## Style and depth
One style per channel (pencil, paper, neon, comic, pixels) and one depth (2D flat, 2.5D layers, 3D objects). Do not mix them between channels, or five channels on one skill will look the same.

## Using a reference without copying
- About 30 seconds of a reference, broken down frame by frame: graphics, motion, transitions, delivery.
- Three different references mixed. Take the language (rhythm, transitions, palette logic), not the content.
- Own palette, own characters, own story. If a viewer names the source channel in five seconds, redo it.
- Check current YouTube monetisation rules on repetitive or mass-produced content before scaling.

## Assets
- Character: one character in five or more poses, made once and reused.
- 3D: free models (BlenderKit and similar), each licence checked. No real people, no other brands' marks.
- A child's likeness only with the parent's consent.

## Process
Topic with its contradiction -> script -> voice -> plan document (scenes, style, depth, colours) -> animation by scene with variants -> self-review -> render -> edit and sound -> title and cover by hand (a channel grows on niche, topic, title and cover, not on pretty animation).

## Cost
One minute of intro in an open test took about 670k tokens and 2h40m. Run one channel and three videos first, record time and tokens for each, then scale.
