#!/usr/bin/env python3
"""
transcribe.py — субтитры из речи, локально, без облака.

    pip install faster-whisper
    python3 transcribe.py footage/anna_body.mp4 --out body.srt --lang en

Первый запуск скачает модель (~1.5 GB для large-v3, ~500 MB для medium).
Дальше работает офлайн. На ноутбуке 30-секундный ролик — секунды.

--words разбивает на короткие фразы по 3-5 слов: так субтитры читаются
в ленте и не закрывают пол-экрана. Это и есть тот самый "как у всех" вид.
"""

import argparse
import json
import os


def fmt(t):
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--out", default=None)
    ap.add_argument("--lang", default="en", help="en или ru")
    ap.add_argument("--model", default="medium", help="tiny/base/small/medium/large-v3")
    ap.add_argument("--words", type=int, default=4,
                    help="слов в одной реплике субтитра (0 = как есть)")
    ap.add_argument("--json", default=None,
                    help="ещё сохранить пословные тайминги [[start, end, word], ...] "
                         "для субтитров по словам в msl_edit.py (поле клипа \"words\")")
    args = ap.parse_args()

    from faster_whisper import WhisperModel

    model = WhisperModel(args.model, device="auto", compute_type="int8")
    segments, info = model.transcribe(
        args.video, language=args.lang,
        word_timestamps=bool(args.words) or bool(args.json),
        vad_filter=True,
    )

    out = args.out or (os.path.splitext(args.video)[0] + ".srt")
    cues = []
    all_words = []

    for seg in segments:
        all_words += [[round(w.start, 3), round(w.end, 3), w.word.strip()]
                      for w in (seg.words or [])]
        if args.words and seg.words:
            chunk = []
            for w in seg.words:
                chunk.append(w)
                if len(chunk) >= args.words:
                    cues.append((chunk[0].start, chunk[-1].end,
                                 "".join(c.word for c in chunk).strip()))
                    chunk = []
            if chunk:
                cues.append((chunk[0].start, chunk[-1].end,
                             "".join(c.word for c in chunk).strip()))
        else:
            cues.append((seg.start, seg.end, seg.text.strip()))

    with open(out, "w", encoding="utf-8") as f:
        for i, (a, b, text) in enumerate(cues, 1):
            f.write(f"{i}\n{fmt(a)} --> {fmt(b)}\n{text}\n\n")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(all_words, f, ensure_ascii=False, indent=0)
        print(f"{args.json}: {len(all_words)} слов с таймингами")

    print(f"{out}: {len(cues)} реплик, язык {info.language} "
          f"(уверенность {info.language_probability:.2f})")
    print("Дальше: впиши путь к этому .srt в edit.json (hooks[].srt или body_srt)")


if __name__ == "__main__":
    main()
