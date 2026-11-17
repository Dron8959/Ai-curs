---
name: "make-show-lab-editing"
description: "Use when editing or assembling Make Show Lab video: Instagram reels and trial reels, TikTok, Facebook reels, YouTube Shorts, Meta ad creatives, lesson-clip shorts. Brand rules, the plan-first workflow, cuts, sound, voice, revisions and the checks before a file is handed over."
---

# Make Show Lab video editing

One video goes to four places: Instagram (trial reel or grid), TikTok, Facebook and YouTube Shorts, at the same time.
Texts and facts follow the `human-content-no-ai-slop` skill.

## Brand rules (always)
- No opening bumper. Frame one is the hook, and the first frame of a reel is its cover, the same tile people see in the grid.
- No rubric word (show, make, lab, start) on the picture. The top keeps only the small logo. (owner, 17 Nov)
- Same small logo lockup on every creative; add nothing to it.
- Flat graphics sit on a frame of Kamilla's cartoon tinted in the series colour; reels about the cartoon play the cartoon full screen. (owner, 17 Nov)
- The comment word is always in quotes: on the picture `Comment “CARTOON”`, in the caption `Comment "CARTOON"`. One word per post, chosen by topic; each word has a DM answer ready (`social/concept/DM.md`). On TikTok and YouTube there is no reply to a word, so their captions do not ask for one. (owner, 17 Nov)
- Labels never cover faces; move the label or pick another frame. (owner, 17 Nov)
- Subtitles are not burned in: short on-screen lines are part of the design, auto-captions are added in the app if wanted.
- Sizes: reels and Shorts 1080x1920; grid tile 3:4; carousel slides 4:5; Meta creatives in 9:16 and 4:5. YouTube long videos 16:9 with their own safe zones.
- Ad creatives: "Creative N" means the approved list of 12. Offer several hook titles per creative.
- Lesson-clip shorts: flat brand background, the montage untouched, logo, one comment-word line at the bottom.

## Numbers we hold (high quality by default)
- On-screen line: six words or fewer, inside x 64-850 and y 250-1440 on 1080x1920, so the app's buttons never cover it.
- One scene, one beat of the story, about 4 seconds at most. Cut to the music: 130 BPM, scenes counted in beats, the main reveal and the logo on bar lines.
- Voice: about 2.5 words a second at most; a line that does not fit gets a longer scene (a whole bar inside the reel, or a longer closing card), never a faster voice.
- Voice at least 10 dB over the music; music held lower under each line.
- Cuts: about 30 ms of padding, checked on the waveform, not only on the transcript.

## Workflow
1. Plan first: script on one side, scene type for each line on the other. The owner picks. Planning is cheaper than revising.
2. Stage by stage, each shown before the next: topics -> pictures -> assembly -> approval -> release. Never everything at once.
3. When a speaker announces a point, stay on the face; when they describe something, show it.
4. Build from one template per week so the pack keeps one look; per-post data (lines, pictures) lives apart from the template.
5. The first render is 60-70% done. Revisions come as one numbered list and are applied in one pass.
6. Sound and music last, after the picture is approved. Few effects.
7. Self-review before showing anyone: watch every scene, fix the boring and the broken, then hand over.

## Checks before a file is handed over
- Open the final file, not the build log: it plays, its length is right, it has sound.
- The voice is really in it: a speech model transcribes the finished file and every line comes back word for word (numbers like "20" for "twenty" are fine). Kamilla's reels are checked as Kamilla's.
- A pipeline step that "failed" may have written a good file, and one that "passed" may not have: check the files.
- Contact sheet of frames from every scene: lines readable, nothing cut, faces clear.
- Do not stash or move files while a render is writing them.
- Media for a post is published by public URL; the AI label is set where AI made the picture or the voice.

## Safety
- Kamilla is a minor. Her face or voice goes into a generative tool only with her mother's explicit consent (given for the voice clone) and after checking the tool's terms for minors. Her recordings and clones stay out of public repositories; the finished, labelled reels may be published.

## AI video generation (Higgsfield, Seedance, Kling)
- Draft in 480p, regenerate only approved shots in 1080p. Decide what to change before each retry.
- Character sheet: face left, body right, plain grey background; save as a named element and reuse the name. Outfits separate.
- Fix details with an edit that says what must stay; do not regenerate the whole shot.
- Faces drift on wide shots: shoot closer, 50-75 mm in the prompt, camera on a tripod.
- Give a reference for every product or object.
- Generation through MCP or CLI costs credits even for models free in the web app. Check the price first; sponsor videos' prices are not proof.
- Dialogue word for word in the prompt; camera rules, not a shot-by-shot storyboard.
