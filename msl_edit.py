#!/usr/bin/env python3
"""
msl_edit.py — сборка рекламных роликов Make Show Lab из JSON-спеки.

Один файл edit.json -> N роликов (хук x формат) с субтитрами,
экранными карточками, переходами, динамикой и нормализованным звуком.

Запуск:
    python3 msl_edit.py build edit.json --out ./render
    python3 msl_edit.py probe ./footage           # что за файлы, длительности
    python3 msl_edit.py contact render/a1_hook1_9x16.mp4   # лист кадров для ревью
    python3 msl_edit.py sfx                       # пересоздать звуки-акценты

Динамика (поля клипа в edit.json):
    "focus": [0.49, 0.37]   точка интереса (обычно лицо) в долях кадра исходника
    "face_at": 0.4          где эта точка окажется по высоте готового кадра
    "zoom": 1.6             приближение; [1.5, 1.65] — плавный наезд за клип
    "volume": 0.3           громкость звука клипа
    "words": "subs/x.words.json"   пословные тайминги (transcribe.py --json)
                            -> субтитры по словам с подсветкой текущего

Джамп-кат с зумом = один дубль, разрезанный на два клипа с разным "zoom".

Требуется: ffmpeg/ffprobe (libass, xfade). Субтитры — transcribe.py
"""

import argparse
import json
import os
import shlex
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SFX_DIR = os.path.join(HERE, "sfx")

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


def display_size(path):
    """Размер кадра с учётом поворота (вертикальное видео с телефона)."""
    v = next(s for s in probe(path)["streams"] if s["codec_type"] == "video")
    w, h = int(v["width"]), int(v["height"])
    rot = 0
    for sd in v.get("side_data_list", []):
        if "rotation" in sd:
            rot = int(float(sd["rotation"]))
    rot = int(v.get("tags", {}).get("rotate", rot))
    if abs(rot) % 180 == 90:
        w, h = h, w
    return w, h


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
    return (
        f"crop='if(gt(iw/ih,{ar}),ih*{ar},iw)':'if(gt(iw/ih,{ar}),ih,iw/{ar})',"
        f"scale={w}:{h}:flags=lanczos,setsar=1"
    )


def reframe_filter(clip, fmt, src, dur, fps):
    """Кроп + приближение к точке интереса + плавный наезд."""
    W, H, _, _ = FORMATS[fmt]
    zoom = clip.get("zoom", 1.0)
    z0, z1 = (zoom, zoom) if isinstance(zoom, (int, float)) else zoom
    focus = clip.get("focus")
    if focus is None and z0 == 1 and z1 == 1:
        return crop_filter(fmt) + f",fps={fps}"

    fx, fy = focus or (0.5, 0.5)
    face_at = clip.get("face_at", 0.4)
    iw, ih = display_size(src)
    ar = W / H
    bw, bh = (ih * ar, ih) if iw / ih > ar else (iw, iw / ar)
    bw, bh = int(bw) // 2 * 2, int(bh) // 2 * 2
    # базовый прямоугольник нужного аспекта вокруг точки интереса
    x = min(max(fx * iw - bw / 2, 0), iw - bw)
    y = min(max(fy * ih - face_at * bh, 0), ih - bh)
    rfx = (fx * iw - x) / bw
    rfy = (fy * ih - y) / bh
    n = max(1, round(dur * fps) - 1)
    z = f"{z0}+({z1}-{z0})*on/{n}"
    return (
        f"crop={bw}:{bh}:{int(x)}:{int(y)},"
        f"scale={W * 2}:{H * 2}:flags=lanczos,fps={fps},"
        f"zoompan=z='{z}':d=1:s={W}x{H}:fps={fps}:"
        f"x='max(0,min(iw-iw/zoom,{rfx:.4f}*iw-iw/zoom/2))':"
        f"y='max(0,min(ih-ih/zoom,{rfy:.4f}*ih-ih/zoom*{face_at}))',"
        f"setsar=1"
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
Style: SUB,{font},{sub_size},&H00FFFFFF,&H00141414,&H80000000,-1,0,1,{sub_outline},2,2,90,90,{sub_mv},1
Style: CARD,{font},{card_size},&H0000D7FF,&H26000000,&H00000000,-1,0,3,{card_pad},0,8,90,90,{card_mv},1
Style: ARROW,{font},{card_size},&H0000D7FF,&H00101010,&H00000000,0,0,1,5,0,8,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

GAP = r" \h"                   # у Poppins узкий пробел — обводка его съедает
ACTIVE = r"{\c&H0000D7FF&}"   # текущее слово — жёлтое
IDLE = r"{\c&H00FFFFFF&}"


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


def phrase_to_words(a, b, text):
    """Фраза без пословных таймингов -> слова, время делим по длине слов."""
    ws = text.split()
    total = sum(len(w) + 1 for w in ws)
    out, t = [], a
    for i, w in enumerate(ws):
        d = (b - a) * (len(w) + 1) / total
        out.append({"s": t, "e": t + d, "w": w, "brk": i == 0})
        t += d
    return out


def karaoke_events(words, max_words=3, max_gap=0.35, hold=0.25):
    """Слова -> строки субтитров по 2-3 слова, текущее слово подсвечено."""
    words = sorted(words, key=lambda w: w["s"])
    chunks = []
    for w in words:
        if (not chunks or w.get("brk") or len(chunks[-1]) >= max_words
                or w["s"] - chunks[-1][-1]["e"] > max_gap
                or chunks[-1][-1]["w"][-1:] in ".?!,"):
            chunks.append([])
        chunks[-1].append(w)

    lines = []
    for ci, ch in enumerate(chunks):
        end = ch[-1]["e"] + hold
        if ci + 1 < len(chunks):
            end = min(end, chunks[ci + 1][0]["s"])
        for i, w in enumerate(ch):
            a = ch[0]["s"] if i == 0 else w["s"]
            b = ch[i + 1]["s"] if i + 1 < len(ch) else end
            if b - a < 0.02:
                continue
            text = GAP.join(
                (ACTIVE + x["w"] + IDLE) if j == i else x["w"]
                for j, x in enumerate(ch))
            pop = r"{\fscx88\fscy88\t(0,90,\fscx100\fscy100)}" if i == 0 else ""
            lines.append(f"Dialogue: 0,{ts(a)},{ts(b)},SUB,,0,0,0,,{pop}{text}")
    return lines


ARROW = r"m -26 0 l 26 0 l 26 56 l 66 56 l 0 124 l -66 56 l -26 56"


def build_ass(fmt, subs=None, cards=None, style=None, words=None):
    """Собрать .ass: субтитры внизу (выше safe-зоны) + карточки сверху."""
    w, h, safe_top, safe_bottom = FORMATS[fmt]
    st = {
        "font": "Poppins",
        "sub_size": int(min(w, h) * 0.105),
        "card_size": int(min(w, h) * 0.115),
        "sub_outline": max(4, int(w * 0.007)),
        "card_pad": max(12, int(w * 0.016)),
    }
    if style:
        st.update({k: v for k, v in style.items() if k in st})

    card_mv = safe_top + int(h * 0.02)
    header = ASS_HEADER.format(
        w=w, h=h,
        font=st["font"],
        sub_size=st["sub_size"], card_size=st["card_size"],
        sub_outline=st["sub_outline"], card_pad=st["card_pad"],
        sub_mv=safe_bottom + int(h * 0.02),
        card_mv=card_mv,
    )

    lines = []
    for (a, b, text) in (subs or []):
        text = text.replace("\n", "\\N")
        lines.append(f"Dialogue: 0,{ts(a)},{ts(b)},SUB,,0,0,0,,{text}")
    lines += karaoke_events(words or [])

    for c in (cards or []):
        text = c["text"].upper().replace("\n", "\\N")
        if c.get("pop", True):
            anim = (r"{\fad(60,120)\fscx60\fscy60"
                    r"\t(0,120,\fscx110\fscy110)\t(120,210,\fscx100\fscy100)}")
        else:
            anim = r"{\fad(0,120)}"
        lines.append(
            f"Dialogue: 1,{ts(c['start'])},{ts(c['end'])},CARD,,0,0,0,,{anim}{text}")
        if c.get("arrow"):
            # прыгающая стрелка вниз — в зоне субтитров, к кнопке под роликом
            y0 = h - safe_bottom - int(h * 0.02) - 150
            t, i = c["arrow_start"] if "arrow_start" in c else c["start"], 0
            while t < c["end"]:
                t2 = min(t + 0.35, c["end"])
                ya, yb = (y0, y0 + 28) if i % 2 == 0 else (y0 + 28, y0)
                lines.append(
                    f"Dialogue: 1,{ts(t)},{ts(t2)},ARROW,,0,0,0,,"
                    rf"{{\an8\move({w // 2},{ya:.0f},{w // 2},{yb:.0f})\p1}}{ARROW}")
                t, i = t2, i + 1
    return header + "\n".join(lines) + "\n"


# ---------------------------------------------------------------- звуки

SFX_RECIPES = {
    # короткий «вжух» на смену сцены
    "whoosh": "anoisesrc=d=0.45:c=pink:r=48000:a=0.7,highpass=f=350,lowpass=f=5000,"
              "afade=t=in:d=0.3:curve=exp,afade=t=out:st=0.3:d=0.15",
    # «поп» на появление карточки
    "pop": "aevalsrc='0.8*sin(2*PI*(420+900*exp(-35*t))*t)*exp(-28*t)':d=0.16:s=48000",
    # «тик-так» на смену времени
    "tick": "aevalsrc='0.9*sin(2*PI*3100*t)*exp(-140*t)"
            "+0.7*gte(t,0.14)*sin(2*PI*2200*(t-0.14))*exp(-140*(t-0.14))':d=0.3:s=48000",
    # «дзинь» на оффер
    "ding": "aevalsrc='0.45*(sin(2*PI*1318*t)+0.5*sin(2*PI*2637*t)"
            "+0.25*sin(2*PI*3955*t))*exp(-4.5*t)':d=1.1:s=48000",
}


def make_sfx(force=False):
    os.makedirs(SFX_DIR, exist_ok=True)
    for name, recipe in SFX_RECIPES.items():
        out = os.path.join(SFX_DIR, f"{name}.wav")
        if force or not os.path.exists(out):
            run(["ffmpeg", "-y", "-f", "lavfi", "-i", recipe, "-ac", "1", out])


def sfx_path(name, resolve):
    if os.path.splitext(name)[1]:
        return resolve(name)
    return os.path.join(SFX_DIR, f"{name}.wav")


# ---------------------------------------------------------------- сборка

def clip_len(clip, fps):
    """Длина клипа, округлённая до целого числа кадров."""
    return round((clip["out"] - clip["in"]) * fps) / fps


def cut_clip(src, clip, fmt, out, fps=30):
    """Вырезать кусок и привести к формату. Перекодируем — склейка должна быть точной."""
    dur = clip_len(clip, fps)
    vf = reframe_filter(clip, fmt, src, dur, fps) + ",format=yuv420p"
    cmd = ["ffmpeg", "-y", "-ss", str(clip["in"]), "-t", f"{dur:.4f}", "-i", src]
    if not has_audio(src):
        cmd += ["-f", "lavfi", "-t", f"{dur:.4f}", "-i", "anullsrc=r=48000:cl=stereo"]
    vol = clip.get("volume", 1.0)
    af = (f"volume={vol},afade=t=in:d=0.02,"
          f"afade=t=out:st={max(0, dur - 0.03):.3f}:d=0.03")
    cmd += ["-vf", vf, "-af", af, "-r", str(fps), "-t", f"{dur:.4f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", out]
    run(cmd)
    return out


def concat_with_transitions(parts, out, transitions=None, fps=30):
    """Склеить куски. transitions: список словарей {type, duration} между парами."""
    if len(parts) == 1:
        run(["ffmpeg", "-y", "-i", parts[0], "-c", "copy", out])
        return out

    transitions = transitions or []
    inputs = []
    for p in parts:
        inputs += ["-i", p]

    if not any(transitions):
        # жёсткие склейки — concat-фильтр, без рассинхрона звука
        streams = "".join(f"[{i}:v][{i}:a]" for i in range(len(parts)))
        fc = f"{streams}concat=n={len(parts)}:v=1:a=1[v][a]"
        run(["ffmpeg", "-y"] + inputs + [
            "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out])
        return out

    # xfade-цепочка
    durs = [duration(p) for p in parts]
    vchain, achain = "[0:v]", "[0:a]"
    offset = 0.0
    filters = []
    for i in range(1, len(parts)):
        tr = transitions[i - 1] if i - 1 < len(transitions) else None
        d = float(tr["duration"]) if tr else 0.0
        kind = tr["type"] if tr else "fade"
        offset += durs[i - 1] - d
        vout, aout = f"[v{i}]", f"[a{i}]"
        if d > 0:
            filters.append(
                f"{vchain}[{i}:v]xfade=transition={kind}:duration={d}:offset={offset:.3f}{vout}")
            filters.append(f"{achain}[{i}:a]acrossfade=d={d}{aout}")
        else:
            # жёсткая склейка внутри xfade-цепочки — переход в один кадр
            d = 1 / fps
            offset -= d
            filters.append(
                f"{vchain}[{i}:v]xfade=transition=fade:duration={d:.4f}:offset={offset:.3f}{vout}")
            filters.append(f"{achain}[{i}:a]acrossfade=d={d:.4f}{aout}")
        vchain, achain = vout, aout

    run(["ffmpeg", "-y"] + inputs + [
        "-filter_complex", ";".join(filters),
        "-map", vchain, "-map", achain,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", out])
    return out


def burn(src, ass_path, out, sfx=None, loudnorm=True):
    """Вшить ASS, подмешать звуки-акценты, нормализовать до -14 LUFS."""
    inputs = ["-i", src]
    afil = ["[0:a]anull[a0]"]
    mix = ["[a0]"]
    for k, s in enumerate(sfx or [], start=1):
        inputs += ["-i", s["file"]]
        ms = max(0, int(s["at"] * 1000))
        afil.append(f"[{k}:a]aformat=channel_layouts=stereo,adelay={ms}:all=1,"
                    f"volume={s.get('gain', 0.6)}[s{k}]")
        mix.append(f"[s{k}]")
    chain = f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first"
    if loudnorm:
        chain += ",loudnorm=I=-14:TP=-1.5:LRA=11"
    afil.append(chain + "[a]")
    fc = f"[0:v]ass=filename={ass_path}[v];" + ";".join(afil)
    run(["ffmpeg", "-y"] + inputs + [
        "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", out])
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


def place(clips, fps, start=0.0, first_transition=None):
    """Тайминг клипов на итоговой шкале: [(clip, начало)], конец."""
    t, out = start, []
    for i, c in enumerate(clips):
        tr = first_transition if i == 0 else c.get("transition")
        if tr and (i > 0 or start > 0):
            t -= float(tr["duration"])
        out.append((c, t))
        t += clip_len(c, fps)
    return out, t


def clip_words(placed, resolve):
    """Пословные тайминги исходников -> слова на итоговой шкале."""
    words = []
    for c, t0 in placed:
        if not c.get("words"):
            continue
        with open(resolve(c["words"]), encoding="utf-8") as f:
            src_words = json.load(f)
        first = True
        for s, e, w in src_words:
            if s >= c["out"] or e <= c["in"]:
                continue
            s, e = max(s, c["in"]), min(e, c["out"])
            words.append({"s": t0 + s - c["in"], "e": t0 + e - c["in"],
                          "w": w.strip(), "brk": first})
            first = False
    return words


# ---------------------------------------------------------------- команды

def cmd_build(args):
    spec = json.load(open(args.spec, encoding="utf-8"))
    spec_dir = os.path.dirname(os.path.abspath(args.spec))
    root = os.path.join(spec_dir, spec.get("footage_dir", "."))
    os.makedirs(args.out, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="msl_")
    fps = spec.get("fps", 30)
    style = spec.get("style", {})
    made = []
    make_sfx()

    def resolve(p):
        if os.path.isabs(p):
            return p
        for base in (root, spec_dir):
            if os.path.exists(os.path.join(base, p)):
                return os.path.join(base, p)
        return os.path.join(root, p)

    only = set(args.hook or [])
    for fmt in args.formats or spec.get("formats", ["9x16"]):
        if fmt not in FORMATS:
            print(f"  ! неизвестный формат {fmt}, пропускаю")
            continue

        # тело ролика собирается один раз на формат
        body_parts, body_trans = [], []
        for i, clip in enumerate(spec["body"]):
            part = os.path.join(tmp, f"body_{fmt}_{i}.mp4")
            cut_clip(resolve(clip["file"]), clip, fmt, part, fps)
            body_parts.append(part)
            if i > 0:
                body_trans.append(clip.get("transition"))
        body = os.path.join(tmp, f"body_{fmt}.mp4")
        concat_with_transitions(body_parts, body, body_trans, fps)

        for hook in spec["hooks"]:
            if only and hook["id"] not in only:
                continue
            name = f"{spec['name']}_{hook['id']}_{fmt}"
            parts, trans = [], []
            for j, clip in enumerate(hook["clips"]):
                part = os.path.join(tmp, f"{name}_h{j}.mp4")
                cut_clip(resolve(clip["file"]), clip, fmt, part, fps)
                parts.append(part)
                if j > 0:
                    trans.append(clip.get("transition"))
            parts.append(body)
            trans.append(hook.get("transition_to_body"))

            hook_placed, hook_end = place(hook["clips"], fps)
            body_placed, _ = place(spec["body"], fps, hook_end,
                                   hook.get("transition_to_body"))
            body_start = body_placed[0][1]

            raw = os.path.join(tmp, f"{name}_raw.mp4")
            concat_with_transitions(parts, raw, trans, fps)

            raw = overlay_broll(raw, [
                dict(i, file=resolve(i["file"]), start=i["start"] + body_start,
                     end=i["end"] + body_start)
                for i in spec.get("broll", [])
            ], os.path.join(tmp, f"{name}_ov.mp4"), fmt)

            # субтитры: пословные из клипов + фразы хука + SRT
            words = clip_words(hook_placed + body_placed, resolve)
            for a, b, text in hook.get("subs_events", []):
                words += phrase_to_words(a, b, text)
            for a, b, text in spec.get("body_subs_events", []):
                words += phrase_to_words(a + body_start, b + body_start, text)
            subs = []
            if hook.get("srt"):
                subs += srt_to_events(resolve(hook["srt"]))
            if spec.get("body_srt"):
                subs += srt_to_events(resolve(spec["body_srt"]), offset=body_start)

            cards = [dict(c) for c in hook.get("cards", [])]
            for c in spec.get("body_cards", []):
                c = dict(c)
                for k in ("start", "end", "arrow_start"):
                    if k in c:
                        c[k] += body_start
                cards.append(c)

            # звуки: явные + авто-«поп» на каждую карточку
            sfx = [dict(s) for s in hook.get("sfx", [])]
            sfx += [dict(s, at=s["at"] + body_start) for s in spec.get("body_sfx", [])]
            default_card = style.get("card_sfx")
            for c in cards:
                snd = c.get("sfx", default_card if c.get("pop", True) else None)
                if snd:
                    sfx.append({"file": snd, "at": c["start"],
                                "gain": c.get("sfx_gain", style.get("card_sfx_gain", 0.5))})
            for s in sfx:
                s["file"] = sfx_path(s["file"], resolve)

            ass_path = os.path.join(tmp, f"{name}.ass")
            with open(ass_path, "w", encoding="utf-8") as f:
                f.write(build_ass(fmt, subs, cards, style, words))

            final = os.path.join(args.out, f"{name}.mp4")
            burn(raw, ass_path, final, sfx)
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
            w, h = display_size(f)
            print(f"{os.path.basename(f)[:45]:45s} {float(info['format']['duration']):6.1f}s "
                  f"{w}x{h:<5} {fps:5.1f}  {a}")
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


def cmd_sfx(args):
    make_sfx(force=True)
    print(f"Звуки: {SFX_DIR}  ({', '.join(SFX_RECIPES)})")


def main():
    ap = argparse.ArgumentParser(description="Сборка рекламных роликов Make Show Lab")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("build", help="собрать ролики из edit.json")
    b.add_argument("spec")
    b.add_argument("--out", default="./render")
    b.add_argument("--hook", action="append", help="собрать только этот хук (можно несколько)")
    b.add_argument("--format", dest="formats", action="append", help="только этот формат")
    b.set_defaults(func=cmd_build)

    p = sub.add_parser("probe", help="что лежит в папке с материалом")
    p.add_argument("path")
    p.set_defaults(func=cmd_probe)

    c = sub.add_parser("contact", help="лист кадров для ревью")
    c.add_argument("video")
    c.add_argument("--every", type=float, default=2.0)
    c.add_argument("--out")
    c.set_defaults(func=cmd_contact)

    s = sub.add_parser("sfx", help="пересоздать звуки-акценты в ./sfx")
    s.set_defaults(func=cmd_sfx)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
