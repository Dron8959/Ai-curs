"""Transcribe an audio/video file into word-level timestamps (JSON).

Usage:
  .venv/bin/python scripts/transcribe.py <input> [--model small] [--lang ru] [--out out.json]

Uses whisperx (with word alignment) when it is installed, otherwise faster-whisper.
CPU only, int8; models download from HuggingFace on first run.
"""
import argparse
import json
import sys


def run_whisperx(path, model_name, lang):
    import whisperx

    audio = whisperx.load_audio(path)
    model = whisperx.load_model(model_name, "cpu", compute_type="int8", language=lang)
    result = model.transcribe(audio, batch_size=8)
    language = result["language"]
    try:
        align_model, meta = whisperx.load_align_model(language_code=language, device="cpu")
        result = whisperx.align(result["segments"], align_model, meta, audio, "cpu")
    except Exception as e:  # alignment model missing for language, network, etc.
        print(f"[warn] alignment skipped: {e}", file=sys.stderr)
    words = [
        {"word": w["word"], "start": w.get("start"), "end": w.get("end")}
        for s in result["segments"]
        for w in s.get("words", [])
    ]
    return {"engine": "whisperx", "language": language,
            "segments": [{"start": s["start"], "end": s["end"], "text": s["text"]} for s in result["segments"]],
            "words": words}


def run_faster_whisper(path, model_name, lang):
    from faster_whisper import WhisperModel

    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, info = model.transcribe(path, language=lang, word_timestamps=True)
    segs, words = [], []
    for s in segments:
        segs.append({"start": s.start, "end": s.end, "text": s.text})
        words += [{"word": w.word, "start": w.start, "end": w.end} for w in (s.words or [])]
    return {"engine": "faster-whisper", "language": info.language, "segments": segs, "words": words}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("input")
    p.add_argument("--model", default="small")
    p.add_argument("--lang", default=None)
    p.add_argument("--out", default=None)
    a = p.parse_args()
    try:
        import whisperx  # noqa: F401
        res = run_whisperx(a.input, a.model, a.lang)
    except ImportError:
        res = run_faster_whisper(a.input, a.model, a.lang)
    text = json.dumps(res, ensure_ascii=False, indent=2)
    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            f.write(text)
    print(text)


if __name__ == "__main__":
    main()
