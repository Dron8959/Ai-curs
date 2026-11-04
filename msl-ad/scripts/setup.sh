#!/usr/bin/env bash
# Restore the msl-ad toolchain in a fresh session (cloud or local Linux/macOS).
# Usage: bash scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

npm install

if [ ! -x .venv/bin/python ]; then
  python3 -m venv .venv
fi
.venv/bin/pip install --upgrade pip
# whisperx pulls torch from PyPI (several GB). If it fails, faster-whisper alone is enough:
.venv/bin/pip install whisperx || .venv/bin/pip install faster-whisper

# NLTK sentence splitter used by whisperx alignment. nltk.download() fails behind the
# cloud proxy, so fetch the zip directly.
if [ ! -d "$HOME/nltk_data/tokenizers/punkt_tab" ]; then
  mkdir -p "$HOME/nltk_data/tokenizers"
  curl -sSL -o "$HOME/nltk_data/tokenizers/punkt_tab.zip" \
    https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/tokenizers/punkt_tab.zip
  (cd "$HOME/nltk_data/tokenizers" && unzip -q -o punkt_tab.zip)
fi

npx remotion compositions
echo "Setup done."
