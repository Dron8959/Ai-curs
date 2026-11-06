# Make Show Lab content engine

```bash
cd social/engine && npm install      # once per machine: fonts (Caveat), GSAP, icons
node social/engine/render.mjs social/posts/<folder>   # post.json -> slide-01.jpg …
node social/engine/reel.mjs   social/reels/<folder>   # reel.json -> reel.mp4 + cover.jpg
```

Playwright and Chromium are already installed in the cloud environment; ffmpeg is used for MP4.

The look ("kitchen-table scrapbook") lives in `kit.mjs`: cream paper with grain, photos in white
frames with tape, Caveat handwritten notes and hand-drawn arrows, colored icon stickers (lucide),
sparkles, the navy card with the yellow sun, and the landing logo as a badge (`robo` in specs).
The badge uses `social/media/brand/logo.png` if present, else an upscale of `assets/img/logo.png`.

## Text markup
`**word**` yellow highlighter · `_word_` gold · `~word~` handwritten · `\n` line break.

## post.json (1080×1350)
`{ "id", "pillar", "format": "post", "slides": [ … ] }`. Each slide takes `theme` (`paper` default or
`navy`), `size` (`xl` / `lg` / `md` for the title) and `deco` (free-placed extras, see below).

| type | fields |
|------|--------|
| `cover` | `kicker`, `title`, `sub`, `image`, `pos`, `picStyle`, `swipe` |
| `hero` | navy card with the sun behind a photo: `kicker`, `title`, `sub`, `image`, `sunTop` |
| `split` | `kicker`, `title`, `left {image,label}`, `right {image,label}` |
| `step` | `num`, `title`, `body`, `example`, `image`, `picStyle` |
| `prompt` | chat window: `kicker`, `title`, `turns [{role: kid/check/ask/win, label, text}]` |
| `stat` | `kicker`, `value`, `title`, `body`, `source` |
| `myth` | `kicker`, `myth`, `truth`, `image` |
| `list` | `kicker`, `title`, `items [string | {icon, text}]` |
| `quote` | `quote`, `by` |
| `photo` | `kicker`, `title`, `image`, `pos`, `picStyle`, `sub` |
| `cta` | navy with the logo badge: `title`, `body`, `buttons []`, `bubble` |

`deco` items (`x`, `y` in px, optional `rot`): `photo {src,w,h,pos,tape}`, `sticker {name,size:'sm'}`,
`note {text,gold}`, `arrow {dir: down-left/down-right/left/right/up-right, w, gold}`, `robo {w}` (logo badge, max 280 px),
`bubble {text,right}`, `sparkle {white,size}`, `sun {w}`, `dot {w,gold}`.
Sticker names are lucide icons: gamepad-2, music, clapperboard, code-xml, shirt, sparkles, heart,
shield-check, globe, image, pencil, star, clock, palette, wand-sparkles.

## reel.json (1080×1920, 30 fps)
`{ "fps": 30, "coverAt": 1.8, "scenes": [ … ] }`. Every scene has `type`, `dur` (seconds), optional
`theme` and `deco` (stickers float, sparkles twinkle). Titles pop in word by word, highlighters swipe in,
scenes change with a circle wipe, the logo badge bounces and wiggles.

| type | fields |
|------|--------|
| `hook` | `kicker`, `title`, `sub`, `robo` (bool), `bubble` |
| `reveal` | before → after: `title`, `before`, `after`, `beforeLabel`, `afterLabel` |
| `photo` | Ken Burns photo with notes that draw on: `kicker`, `title`, `image`, `box`, `notes [{text,x,y,rot,gold,arrow{dir,x,y,w}}]`, `stickers` |
| `list` | items slide in one by one: `kicker`, `title`, `items [{icon,text}]`, `robo` |
| `stat` | number counts up: `kicker`, `value`, `to`, `title`, `source` |
| `cta` | navy, Robo waving in the sun: `title`, `sub`, `buttons` |

Keep the important text between y = 220 and y = 1500: Instagram covers the bottom ~350 px and the
right edge with its own buttons. Reels render with a silent audio track; add music from the Instagram
library when scheduling (Metricool `instagramData.audioConfiguration`) or in the app.
