#!/usr/bin/env python3
"""Puts a reel's voice lines on its soundtrack as a separate, voiced version. The published reel is not touched.

    python3 tools/voice_film.py 05            writes out/voice/<id>/design.json and film.json, prints the placement
    $SOUND_PY tools/voice_film.py 05 --fit    after a first mix: how low the music must sit under each line (hold.json)
    $SOUND_PY tools/voice_film.py 05 --check  after the mix: how far the voice stands over music and effects, per line
voice.sh runs them in order: place, mix, fit, place again, mix, check.

The lines are out/voice/<id>/<scene>.wav with lines.json next to them (tools/voice_clone.py writes both).
Where a line starts:
  - 0.35 s after its scene begins;
  - if a word of the line is in *stars* in VOICEOVER.md, that word lands on the first thing that lands in the scene;
  - on the closing card, 0.4 s after the logo, so the logo's hit and the chord under it ring before the first word;
  - a line that would run into the next scene is pulled earlier, never cut short.

The music: under a line it is held UNDER dB below its full level (0.2 s down, 0.45 s back up to its own ride), and
lower still where a line needs it. "Needs" is measured, not heard: the voice has to stand MARGIN dB over music and
effects, and MARGIN_C dB over them between 1 and 4 kHz, where consonants live and a phone speaker does its work.
A line that opens the reel has the music held from the first frame, so it does not start loud and drop at once.
Effects stay as they are.

The voice sits on the mixer's spare bus (amb), centred. Its tone: rumble under 100 Hz out, a little less weight at
200 Hz, 3 dB more around 2.5 kHz. Anna's recording is 3-4 dB darker there than average speech.
"""
import json, os, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V = os.environ.get('VOICE_DIR', 'out/voice')   # where the lines are (a folder per reel), relative to sound/ or absolute
LEAD, AFTER_LOGO, GAP, TAIL = 0.35, 0.40, 0.12, 0.3
UNDER, FLOOR, DOWN, UP = -13.0, -20.0, 0.20, 0.45
MARGIN, MARGIN_C = 10.0, 8.0
VOICE_EQ, VOICE_GAIN = {'hp': 100, 'lowshelf': [200, -2], 'peq': [[2500, 0.7, 3.0]]}, 2.0


def load(rid):
    film = json.loads((ROOT / f'audio/films/{rid}.json').read_text())
    cues = json.loads((ROOT / f'cues/{rid}.json').read_text())
    take = json.loads((ROOT / V / rid / 'lines.json').read_text())
    hold = ROOT / V / rid / 'hold.json'
    return film, cues, take, (json.loads(hold.read_text()) if hold.exists() else {})


def placement(film, cues, take, hold):
    fps = cues['fps']
    start = {int(k[1:]): v['from'] / fps for k, v in cues['acts'].items()}
    order = sorted(start)
    end = {n: (start[order[i + 1]] if i + 1 < len(order) else film['duration']) for i, n in enumerate(order)}
    logo = cues.get('cue', {}).get('logo')
    logo = logo / fps if logo is not None else None
    rows = []
    for ln in take['lines']:
        n, dur = ln['scene'], ln['dur']
        at, why = start[n] + LEAD, 'scene start'
        events = [e for e in cues['events'] if e['id'].startswith(f's{n}:')]
        hit = next((e for e in events if e['kind'] == 'land'), None) or next((e for e in events if e['kind'] == 'pop'), None)
        word = next((w for w in ln['words'] if ln.get('sync') and w[0] == ln['sync'].lower()), None)
        if word and hit:
            at, why = hit['f'] / fps - word[1], f'"{ln["sync"]}" on the {hit["kind"]} at {hit["f"] / fps:.2f} s'
        elif ln.get('sync'):
            why += f' (the word "{ln["sync"]}" was not found in the take)'
        elif logo is not None and start[n] <= logo < end[n]:
            at, why = logo + AFTER_LOGO, 'after the logo'
        by = end[n] - GAP if n != order[-1] else film['duration'] - TAIL
        if at + dur > by:
            at, why = max(start[n] + 0.05, by - dur), why + ', pulled earlier to fit'
        over = max(0.0, at + dur - by)
        rows.append({'scene': n, 'at': round(at, 3), 'dur': dur, 'why': why, 'fits': over < 1e-6,
                     'beats': -(-over // (60 / cues.get('bpm', 130))) if over else 0,
                     'file': ln['file'], 'text': ln['text'], 'under': float(hold.get(str(n), UNDER))})
    return rows


def ducked(base, rows, duration):
    """the music ride, held at each line's level while the line is spoken"""
    def ride(t):
        for (t0, v0), (t1, v1) in zip(base, base[1:]):
            if t0 <= t <= t1:
                return v0 + (v1 - v0) * (t - t0) / max(t1 - t0, 1e-9)
        return base[-1][1]

    def held(r, t):  # 0 away from the line, 1 under it, ramps in between
        a, b = r['at'], r['at'] + r['dur']
        if a <= t <= b or (t < a and a < DOWN + 0.4):
            return 1.0
        if a - DOWN <= t < a:
            return (t - (a - DOWN)) / DOWN
        if b < t <= b + UP:
            return 1 - (t - b) / UP
        return 0.0

    ts = {p[0] for p in base}
    for r in rows:
        a, b = r['at'], r['at'] + r['dur']
        ts |= {a - DOWN + DOWN * i / 4 for i in range(5)} | {b + UP * i / 4 for i in range(5)}
    out = []
    for t in sorted(x for x in ts if 0 <= x <= duration):
        v = ride(t)
        out.append([round(t, 3), round(min(v + held(r, t) * (min(v, r['under']) - v) for r in rows), 2)])
    return out


def margins(rid, rows):
    """per line: voice level, bed level, voice over the bed (whole band) and between 1 and 4 kHz"""
    import numpy as np, soundfile as sf
    from scipy import signal
    stems = ROOT / V / rid / 'stems'
    amb, sr = sf.read(stems / 'amb.wav')
    bed = sf.read(stems / 'music.wav')[0] + sf.read(stems / 'sfx.wav')[0]
    sos = signal.butter(4, [1000, 4000], btype='band', fs=sr, output='sos')
    amb_c, bed_c = signal.sosfilt(sos, amb, axis=0), signal.sosfilt(sos, bed, axis=0)
    db = lambda x: 20 * np.log10(max(float(np.sqrt(np.mean(x ** 2))), 1e-9))
    out = []
    for r in rows:
        a, b = int(r['at'] * sr), int((r['at'] + r['dur']) * sr)
        out.append((db(amb[a:b]), db(bed[a:b]), db(amb[a:b]) - db(bed[a:b]), db(amb_c[a:b]) - db(bed_c[a:b])))
    return out


def fit(rid, rows):
    hold = {}
    for r, (_, _, over, over_c) in zip(rows, margins(rid, rows)):
        need = max(0.0, MARGIN - over, MARGIN_C - over_c)
        hold[str(r['scene'])] = round(max(FLOOR, r['under'] - need), 1)
        if need:
            print(f"scene {r['scene']}  music held {need:.1f} dB lower, at {hold[str(r['scene'])]} dB "
                  f"(the voice stood {over:.1f} dB over it, {over_c:.1f} dB between 1 and 4 kHz)")
    (ROOT / V / rid / 'hold.json').write_text(json.dumps(hold))


def check(rid, rows):
    ok = True
    for r, (v, bed, over, over_c) in zip(rows, margins(rid, rows)):
        good = over >= MARGIN - 0.5 and over_c >= MARGIN_C - 0.5
        ok &= good
        print(f"scene {r['scene']}  voice {v:6.1f} dBFS  music+effects {bed:6.1f} dBFS  voice over them by {over:4.1f} dB, "
              f"between 1 and 4 kHz by {over_c:4.1f} dB  music held at {r['under']} dB{'' if good else '  LOW'}")
    print(f'voice margins: ' + (f'ok ({MARGIN:.0f} dB overall and {MARGIN_C:.0f} dB between 1 and 4 kHz, or more)' if ok
                                else 'LOW on a line: effects are in the way there, or the line needs another take'))
    return ok


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    ids = [p.stem for p in sorted((ROOT / 'audio/films').glob(f'{args[0] if args else ""}*.json'))]
    if len(ids) != 1:
        sys.exit(f'usage: voice_film.py <reel id> [--fit | --check]   (matched: {ids or "no reel"})')
    rid = ids[0]
    film, cues, take, hold = load(rid)
    rows = placement(film, cues, take, hold)
    if '--fit' in sys.argv:
        return fit(rid, rows)
    if '--check' in sys.argv:
        sys.exit(0 if check(rid, rows) else 1)

    D = f'{V}/{rid}'
    design = {
        '_doc': 'Voice lines of the voiced version. Not part of the real-recordings soundtrack and not committed: '
                "a real person's voice, published only with her consent and, if it is cloned, with the AI label.",
        'samples': {f"vo.{r['scene']}": {'file': f"{D}/{r['file']}", 'mono': True, 'eq': VOICE_EQ, 'fade_in': 0.005,
                                         'fade_out': 0.06} for r in rows},
        'place': [{'sample': f"vo.{r['scene']}", 'at': r['at'], 'align': 'start', 'gain_db': VOICE_GAIN, 'pan': 0,
                   'bus': 'amb'} for r in rows]}
    (ROOT / D / 'design.json').write_text(json.dumps(design, indent=1))
    film['_doc'] = 'VOICED VERSION (see tools/voice_film.py). ' + film['_doc']
    film['include'] = film['include'] + [f'{D}/design.json']
    film['buses']['music']['auto'] = ducked(film['buses']['music']['auto'], rows, film['duration'])
    (ROOT / D / 'film.json').write_text(json.dumps(film, indent=1))
    for r in rows:
        print(f"scene {r['scene']}  {r['at']:6.2f}-{r['at'] + r['dur']:5.2f} s  {r['why']}{'' if r['fits'] else '  DOES NOT FIT'}  | {r['text']}")
    if not all(r['fits'] for r in rows):
        for r in rows:
            if not r['fits']:
                print(f"scene {r['scene']}: the line is too long for the scene, give the scene {int(r['beats'])} more beat(s) in reels.mjs")
        sys.exit(f'{rid}: a line is longer than its scene. The picture follows the voice: add the beats, re-render the reel '
                 '(node render.mjs reel <id>) and run this again; or shorten the line in VOICEOVER.md.')


if __name__ == '__main__':
    main()
