# msl-ad: Reels ad project setup

Remotion 4.0.540 project (blank template) plus local transcription for captions.

## Restore after a fresh clone / new cloud session

```bash
cd msl-ad
npm install                       # node_modules is not in git
python3 -m venv .venv             # .venv is not in git
.venv/bin/pip install whisperx    # pulls torch (~several GB); fallback: pip install faster-whisper
```

Remotion skills for Claude Code live in `.agents/skills/` (symlinked from `.claude/skills/`)
and are committed, so they need no reinstall. To refresh them: `npx remotion skills add`.

## Browser for rendering

Cloud sessions can't download Remotion's Chrome (`remotion.media` is blocked by the network
policy). `remotion.config.ts` points at the preinstalled
`/opt/pw-browsers/chromium_headless_shell-1243/...` when that path exists. On a local machine it
isn't there, so Remotion downloads its own browser as usual. Override with
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome`.

## Folders

| Folder          | Contents                      | In git? |
|-----------------|-------------------------------|---------|
| `public/clips`  | source footage                | no (media ignored) |
| `public/sfx`    | sound effects                 | no |
| `public/music`  | music beds                    | no |
| `public/fonts`  | font files                    | yes (small) |
| `refs`          | reference reels / screenshots | no |

Media is kept out of git on purpose: re-upload it in each new cloud session, or keep it in
external storage.

## Transcription

```bash
.venv/bin/python scripts/transcribe.py public/clips/voice.wav --model small --lang ru --out refs/voice.json
```

Outputs segments + word-level timestamps (for captions). Models download from HuggingFace on first
run into `~/.cache/huggingface`, which does **not** survive a new cloud session.
