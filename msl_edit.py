#!/usr/bin/env python3
"""
msl_edit.py — сборка рекламных роликов Make Show Lab из JSON-спеки.

Один файл edit.json -> N роликов (хук x формат) с субтитрами,
экранными карточками, переходами и нормализованным звуком.

Запуск:
    python3 msl_edit.py build edit.json --out ./render
    python3 msl_edit.py probe ./footage           # что за файлы, длительности
    python3 msl_edit.py contact render/a1_hook1_9x16.mp4   # лист кадров для ревью

Требуется: ffmpeg/ffprobe (libass, xfade). Субтитры — отдельно, см. transcribe.sh
"""

import argparse
import json
import os
import shlex
import subprocess
import sys
import tempfile

# ---------------------------------------------------------------- utils

def run(cmd, quiet=True):
    """Выполнить команду, упасть с понятной ошибкой."""
    if not quiet:
        print("  $ " + " ".join(shlex.quote(c) for c in cmd))
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        tail = "\n".join(p.stderr.strip().splitlines()[-15:])
        raise RuntimeError(f"ffmpeg упал:\n{tail}")
    return p.stdout


def probe(path):
    out = run([
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", path,
    ])
    return json.loads(out)


def duration(path):
    return float(probe(path)["format"]["duration"])


def has_audio(path):
    return any(s["codec_type"] == "audio" for s in probe(path)["streams"])


# ---------------------------------------------------------------- формат

FORMATS = {
    # имя: (ширина, высота, safe_top, safe_bottom) — safe в пикселях
    "9x16": (1080, 1920, 230, 480),   # Reels/Stories: верх под интерфейс, низ под CTA
    "4x5":  (1080, 1350, 120, 200),   # лента
    "1x1":  (1080, 1080, 100, 150),
}


def crop_filter(fmt):
    """Кроп по центру из любого исходника в нужный аспект, затем скейл."""
    w, h, _, _ = FORMATS[fmt]
    ar = w / h
    # берём максимальный прямоугольник нужного аспекта, центр кадра
    return (
        f"crop='if(gt(iw/ih,{ar}),ih*{ar},iw)':'if(gt(iw/ih,{ar}),ih,iw/{ar})',"
        f"scale={w}:{h}:flags=lanczos,setsar=1"
    )


# ---------------------------------------------------------------- ASS

ASS_HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: SUB,{font},{sub_size},&H00FFFFFF,&H00202020,&H90000000,-1,0,1,{sub_outline},0,2,80,80,{sub_mv},1
Style: CARD,{font},{card_size},&H0000D7FF,&H00101010,&HA0000000,-1,0,1,{card_outline},0,8,80,80,{card_mv},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def ts(sec):
    """Секунды -> 0:00:00.00 для ASS."""
    sec = max(0.0, float(sec))
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = sec % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def srt_to_events(srt_path, offset=0.0):
    """Разобрать SRT в список (start, end, text)."""
    def parse_ts(x):
        x = x.strip().replace(",", ".")
        hh, mm, rest = x.split(":")
        return int(hh) * 3600 + int(mm) * 60 + float(rest)

    events = []
    with open(srt_path, encoding="utf-8-sig") as f:
        blocks = f.read().strip().split("\n\n")
    for b in blocks:
        lines = [l for l in b.splitlines() if l.strip()]
        if len(lines) < 2:
            continue
        tl = next((l for l in lines if "-->" in l), None)
        if not tl:
            continue
        a, b2 = tl.split("-->")
        text = " ".join(lines[lines.index(tl) + 1:]).strip()
        if text:
            events.append((parse_ts(a) + offset, parse_ts(b2) + offset, text))
    return events


def build_ass(fmt, subs=None, cards=None, style=None):
    """Собрать .ass: субтитры внизу (но выше safe-зоны) + карточки сверху."""
    w, h, safe_top, safe_bottom = FORMATS[fmt]
    st = {
        "font": "Poppins",
        "sub_size": int(h * 0.040),
        "card_size": int(h * 0.055),
        "sub_outline": max(2, int(h * 0.0035)),
        "card_outline": max(2, int(h * 0.0035)),
    }
    if style:
        st.update(style)

    header = ASS_HEADER.format(
        w=w, h=h,
        font=st["font"],
        sub_size=st["sub_size"], card_size=st["card_size"],
        sub_outline=st["sub_outline"], card_outline=st["card_outline"],
        sub_mv=safe_bottom + int(h * 0.02),
        card_mv=safe_top + int(h * 0.02),
    )

    lines = []
    for (a, b, text) in (subs or []):
        text = text.replace("\n", "\\N")
        lines.append(f"Dialogue: 0,{ts(a)},{ts(b)},SUB,,0,0,0,,{text}")
    for c in (cards or []):
        text = c["text"].upper().replace("\n", "\\N")
        fade = r"{\fad(150,150)}"
        lines.append(
            f"Dialogue: 1,{ts(c['start'])},{ts(c['end'])},CARD,,0,0,0,,{fade}{text}"
        )
    return header + "\n".join(lines) + "\n"


# ---------------------------------------------------------------- сборка

def cut_clip(src, start, end, fmt, out, fps=30):
    """Вырезать кусок и привести к формату. Перекодируем — склейка должна быть точной."""
    vf = crop_filter(fmt) + f",fps={fps}"
    cmd = [
        "ffmpeg", "-y", "-ss", str(start), "-to", str(end), "-i", src,
        "-vf", vf, "-an" if not has_audio(src) else "-c:a", 
    ]
    # аккуратнее: собираем руками, чтобы -an/-c:a не конфликтовали
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-to", str(end), "-i", src,
           "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
           "-pix_fmt", "yuv420p"]
    if has_audio(src):
        cmd += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]
    else:
        cmd += ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
                "-shortest", "-c:a", "aac", "-b:a", "192k"]
    cmd += [out]
    run(cmd)
    return out


def concat_with_transitions(parts, out, transitions=None, fps=30):
    """Склеить куски. transitions: список словарей {type, duration} между парами."""
    if len(parts) == 1:
        run(["ffmpeg", "-y", "-i", parts[0], "-c", "copy", out])
        return out

    transitions = transitions or []
    # если переходов нет совсем — быстрый путь через concat demuxer
    if not any(transitions):
        lst = out + ".txt"
        with open(lst, "w") as f:
            for p in parts:
                f.write(f"file '{os.path.abspath(p)}'\n")
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
             "-c", "copy", out])
        os.remove(lst)
        return out

    # xfade-цепочка
    inputs = []
    for p in parts:
        inputs += ["-i", p]
    durs = [duration(p) for p in parts]

    vchain, achain = "[0:v]", "[0:a]"
    offset = 0.0
    filters = []
    for i in range(1, len(parts)):
        tr = transitions[i - 1] if i - 1 < len(transitions) else None
        d = float(tr["duration"]) if tr else 0.0
        kind = tr["type"] if tr else "cut"
        offset += durs[i - 1] - d
        vout = f"[v{i}]"
        aout = f"[a{i}]"
        if d > 0:
            filters.append(
                f"{vchain}[{i}:v]xfade=transition={kind}:duration={d}:offset={offset:.3f}{vout}"
            )
            filters.append(f"{achain}[{i}:a]acrossfade=d={d}{aout}")
        else:
            filters.append(f"{vchain}[{i}:v]concat=n=2:v=1:a=0{vout}")
            filters.append(f"{achain}[{i}:a]concat=n=2:v=0:a=1{aout}")
        vchain, achain = vout, aout

    run(["ffmpeg", "-y"] + inputs + [
        "-filter_complex", ";".join(filters),
        "-map", vchain, "-map", achain,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out])
    return out


def burn(src, ass_path, out, loudnorm=True):
    """Вшить ASS и нормализовать звук до -14 LUFS (норма для соцсетей)."""
    vf = f"ass={shlex.quote(ass_path)}"
    cmd = ["ffmpeg", "-y", "-i", src, "-vf", f"ass={ass_path}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "20",
           "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
    if loudnorm:
        cmd += ["-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k"]
    else:
        cmd += ["-c:a", "copy"]
    cmd += [out]
    run(cmd)
    return out


def overlay_broll(base, inserts, out, fmt):
    """Вставить b-roll/экран поверх основного видео на указанных отрезках."""
    if not inserts:
        return base
    w, h, _, _ = FORMATS[fmt]
    inputs = ["-i", base]
    filters = []
    last = "[0:v]"
    for i, ins in enumerate(inserts, start=1):
        inputs += ["-i", ins["file"]]
        scale = ins.get("scale", 1.0)
        iw, ih = int(w * scale), int(h * scale)
        x = ins.get("x", "(W-w)/2")
        y = ins.get("y", "(H-h)/2")
        filters.append(f"[{i}:v]{crop_filter(fmt)},scale={iw}:{ih},setpts=PTS-STARTPTS[ins{i}]")
        filters.append(
            f"{last}[ins{i}]overlay=x={x}:y={y}:"
            f"enable='between(t,{ins['start']},{ins['end']})'[ov{i}]"
        )
        last = f"[ov{i}]"
    run(["ffmpeg", "-y"] + inputs + [
        "-filter_complex", ";".join(filters), "-map", last, "-map", "0:a?",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-pix_fmt", "yuv420p", "-c:a", "aac", out])
    return out


# ---------------------------------------------------------------- команды

def cmd_build(args):
    spec = json.load(open(args.spec, encoding="utf-8"))
    root = spec.get("footage_dir", os.path.dirname(os.path.abspath(args.spec)))
    os.makedirs(args.out, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="msl_")
    fps = spec.get("fps", 30)
    made = []

    def resolve(p):
        return p if os.path.isabs(p) else os.path.join(root, p)

    for fmt in spec.get("formats", ["9x16"]):
        if fmt not in FORMATS:
            print(f"  ! неизвестный формат {fmt}, пропускаю")
            continue

        # тело ролика собирается один раз на формат
        body_parts, body_trans = [], []
        for i, clip in enumerate(spec["body"]):
            src = resolve(clip["file"])
            part = os.path.join(tmp, f"body_{fmt}_{i}.mp4")
            cut_clip(src, clip["in"], clip["out"], fmt, part, fps)
            body_parts.append(part)
            if i > 0:
                body_trans.append(spec["body"][i].get("transition"))
        body = os.path.join(tmp, f"body_{fmt}.mp4")
        concat_with_transitions(body_parts, body, body_trans, fps)

        for hook in spec["hooks"]:
            name = f"{spec['name']}_{hook['id']}_{fmt}"
            # хук = свои куски + тело
            parts, trans = [], []
            for j, clip in enumerate(hook["clips"]):
                src = resolve(clip["file"])
                part = os.path.join(tmp, f"{name}_h{j}.mp4")
                cut_clip(src, clip["in"], clip["out"], fmt, part, fps)
                parts.append(part)
                if j > 0:
                    trans.append(clip.get("transition"))
            hook_len = sum(duration(p) for p in parts) - sum(
                float(t["duration"]) for t in trans if t)
            parts.append(body)
            trans.append(hook.get("transition_to_body"))

            raw = os.path.join(tmp, f"{name}_raw.mp4")
            concat_with_transitions(parts, raw, trans, fps)

            raw = overlay_broll(raw, [
                dict(i, file=resolve(i["file"]), start=i["start"] + hook_len,
                     end=i["end"] + hook_len)
                for i in spec.get("broll", [])
            ], os.path.join(tmp, f"{name}_ov.mp4"), fmt)

            # субтитры и карточки: хук свой, тело общее со сдвигом
            subs = list(hook.get("subs_events", []))
            if hook.get("srt"):
                subs += srt_to_events(resolve(hook["srt"]))
            if spec.get("body_srt"):
                subs += srt_to_events(resolve(spec["body_srt"]), offset=hook_len)

            cards = [dict(c) for c in hook.get("cards", [])]
            for c in spec.get("body_cards", []):
                c = dict(c)
                c["start"] += hook_len
                c["end"] += hook_len
                cards.append(c)

            ass_path = os.path.join(tmp, f"{name}.ass")
            with open(ass_path, "w", encoding="utf-8") as f:
                f.write(build_ass(fmt, subs, cards, spec.get("style")))

            final = os.path.join(args.out, f"{name}.mp4")
            burn(raw, ass_path, final)
            made.append((final, duration(final)))
            print(f"  ✓ {os.path.basename(final)}  {duration(final):.1f}s")

    print(f"\nГотово: {len(made)} роликов в {args.out}")
    for f, d in made:
        size = os.path.getsize(f) / 1e6
        print(f"   {os.path.basename(f):42s} {d:5.1f}s  {size:5.1f} MB")


def cmd_probe(args):
    exts = (".mp4", ".mov", ".m4v", ".avi", ".mkv")
    files = []
    for dirpath, _, names in os.walk(args.path):
        for n in sorted(names):
            if n.lower().endswith(exts):
                files.append(os.path.join(dirpath, n))
    if not files:
        print("Видеофайлов не найдено.")
        return
    print(f"{'файл':45s} {'длит':>7s} {'разр':>10s} {'fps':>6s}  звук")
    for f in files:
        try:
            info = probe(f)
            v = next(s for s in info["streams"] if s["codec_type"] == "video")
            fr = v.get("r_frame_rate", "0/1")
            num, den = fr.split("/")
            fps = float(num) / float(den) if float(den) else 0
            a = "да" if any(s["codec_type"] == "audio" for s in info["streams"]) else "НЕТ"
            print(f"{os.path.basename(f)[:45]:45s} {float(info['format']['duration']):6.1f}s "
                  f"{v['width']}x{v['height']:<5} {fps:5.1f}  {a}")
        except Exception as e:
            print(f"{os.path.basename(f)[:45]:45s}  ошибка: {e}")


def cmd_contact(args):
    """Лист кадров: по кадру каждые N секунд в одну картинку — для ревью."""
    d = duration(args.video)
    step = args.every
    n = max(1, int(d // step))
    cols = 4
    out = args.out or (os.path.splitext(args.video)[0] + "_contact.jpg")
    run(["ffmpeg", "-y", "-i", args.video,
         "-vf", f"fps=1/{step},scale=360:-1,tile={cols}x{(n // cols) + 1}",
         "-frames:v", "1", "-q:v", "3", out])
    print(f"Лист кадров: {out}  ({n} кадров, каждые {step}s)")


def main():
    ap = argparse.ArgumentParser(description="Сборка рекламных роликов Make Show Lab")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("build", help="собрать ролики из edit.json")
    b.add_argument("spec")
    b.add_argument("--out", default="./render")
    b.set_defaults(func=cmd_build)

    p = sub.add_parser("probe", help="что лежит в папке с материалом")
    p.add_argument("path")
    p.set_defaults(func=cmd_probe)

    c = sub.add_parser("contact", help="лист кадров для ревью")
    c.add_argument("video")
    c.add_argument("--every", type=float, default=2.0)
    c.add_argument("--out")
    c.set_defaults(func=cmd_contact)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
