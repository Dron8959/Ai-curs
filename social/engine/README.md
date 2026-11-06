# Post renderer

```bash
node social/engine/render.mjs social/posts/<folder>
```

Reads `<folder>/post.json`, writes `slide-01.jpg`, `slide-02.jpg`, … (1080×1350 for `post`,
1080×1080 for `square`, 1080×1920 for `story`). Fonts, colours and the highlighter swipe come from the landing page.
Prints `OVERFLOW` next to a slide whose text runs into the header or footer: shorten it and render again.

## post.json

```json
{
  "id": "2026-11-07-paper-to-screen",
  "pillar": "P1",
  "format": "post",
  "slides": [ { "type": "cover", "...": "..." } ]
}
```

Text fields understand `**word**` (yellow highlighter), `_word_` (gold) and `\n` (line break).
Every slide takes `theme`: `light` (default), `sand`, `yellow` or `dark`, and `align`: `center` (default) or `flex-start`.
Images are repo paths, e.g. `assets/img/meet-kamilla.webp` or `social/media/xyz.jpg`.

| type | fields |
|------|--------|
| `cover` | `kicker`, `title`, `sub`, `image`, `ratio` (e.g. `"2/3"`), `tab`, `swipe` |
| `split` | `kicker`, `title`, `left {image,label}`, `right {image,label}`, `sub` |
| `step` | `num`, `title`, `body`, `example`, `image` |
| `prompt` | `kicker`, `title`, `turns [{role: kid/check/win, label, text}]` |
| `stat` | `kicker`, `value`, `title`, `body`, `source` |
| `myth` | `kicker`, `myth`, `truth`, `body` |
| `list` | `kicker`, `title`, `items []` |
| `quote` | `quote`, `by`, `image` |
| `photo` | `kicker`, `title`, `image`, `tab`, `sub` |
| `cta` | `title`, `body`, `buttons []` |

Example: `social/posts/01-paper-to-screen/post.json`.
