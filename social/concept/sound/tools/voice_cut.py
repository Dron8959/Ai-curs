#!/usr/bin/env python3
"""Cuts live recordings of Anna and Kamilla into lines, in the format voice_film.py and voice.sh already use.

    $VOICE_PY tools/voice_cut.py                         every recording in social/media/voice/ (any name, any format)
    $VOICE_PY tools/voice_cut.py memo1.m4a memo2.m4a     only these
    $VOICE_PY tools/voice_cut.py --reel 05               only the lines of one reel
    $VOICE_PY tools/voice_cut.py --use 05:3=2            reel 05, line 3: take 2 instead of the automatic choice

A recording follows the brief (out/voice-brief-*.pdf): 5 s of silence, then every line twice with a pause between.
  1. The phrases are found: stretches of sound separated by pauses. The room noise is the level of the quietest moments.
  2. An open speech model (Whisper small, runs here, nothing is uploaded) writes down every phrase with the time of
     every word.
  3. Those words are matched against the lines in VOICEOVER.md. Any reel, any speaker, any order: a line said twice gives
     two takes, a line said in two pieces is joined, a false start is skipped, and a recording needs no name or number.
  4. Every take is cut out (a little air before and after), brought to a common level and written to
     out/voice/<reel>/takes/<scene>-<take>.wav. The automatic choice goes to out/voice/<reel>/<scene>.wav with lines.json:
     the best take is the one the model heard word for word, then not clipped, then the cleaner, then the later one.
  5. The report lists what was found, what is missing and how clean each take is. Which take sounds best is for ears:
     listen to the voiced reel, then swap a take with --use.

Heavy parts (torch, transformers) are imported only when they are needed. Recordings and everything cut from them stay
out of git (the repository is public): social/media/voice/ and sound/out/ are both ignored.
"""
import argparse, difflib, hashlib, json, logging, re, subprocess, sys, warnings
from pathlib import Path

warnings.filterwarnings('ignore')
logging.disable(logging.WARNING)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from voice_clone import script, VOICE, LEVEL_DB, PEAK_DB, PRE, POST  # noqa: E402  (no heavy imports at its module level)

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
EXTS = {'.m4a', '.mp3', '.wav', '.aac', '.ogg', '.opus', '.flac', '.mp4', '.mov', '.caf', '.amr', '.3gp', '.webm', '.wma'}
HOP = 0.01                      # seconds per energy frame
GAP_CLOSE, MIN_SEG = 0.35, 0.20  # pauses shorter than this do not split a phrase; sounds shorter than this are not phrases
MIN_RATIO = 0.85                # a heard phrase this close to a line (1 = word for word) counts as a take
HEAD_BREATH, TAIL_AIR = 0.30, 0.45  # leading sound before the first word that is trimmed as a breath; air kept after the last

ONES = ('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen '
        'seventeen eighteen nineteen').split()
TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']


def num_words(n):
    return ONES[n] if n < 20 else TENS[n // 10] + (' ' + ONES[n % 10] if n % 10 else '')


def tokens(text):
    """lower-case words; '7:02' -> 'seven oh two', '10' -> 'ten', punctuation gone"""
    t = text.lower().replace('’', "'").replace('‘', "'").replace('*', '')
    t = re.sub(r'\b(\d{1,2})[:.](\d{2})\b',
               lambda m: f"{num_words(int(m[1]))} {'oh ' + ONES[int(m[2])] if int(m[2]) < 10 else num_words(int(m[2]))}", t)
    t = re.sub(r'\b\d{1,2}\b', lambda m: num_words(int(m[0])), t)
    return [w.strip("'") for w in re.sub(r"[^a-z' ]+", ' ', t).split() if w.strip("'")]


def decode(path, sr):
    import numpy as np
    p = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', str(path), '-vn', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                       capture_output=True)
    if p.returncode or not p.stdout:
        sys.exit(f'ffmpeg could not read {path}: {p.stderr.decode()[:300]}')
    return np.frombuffer(p.stdout, dtype=np.float32).copy()


def energy(y):
    import numpy as np, librosa
    rms = librosa.feature.rms(y=y, frame_length=int(0.02 * SR), hop_length=int(HOP * SR))[0]
    return 20 * np.log10(rms + 1e-9)


def phrases(db):
    """stretches of sound as (start s, end s); also the noise floor and the speech level in dB"""
    import numpy as np
    noise, speech = float(np.percentile(db, 8)), float(np.percentile(db, 95))
    v = (db > max(noise + 10, speech - 26)).astype(np.int8)
    edge = np.flatnonzero(np.diff(np.concatenate([[0], v, [0]])))
    runs = []
    for a, b in zip(edge[::2], edge[1::2]):
        if runs and (a - runs[-1][1]) * HOP < GAP_CLOSE:
            runs[-1][1] = b
        else:
            runs.append([a, b])
    return [(a * HOP, b * HOP) for a, b in runs if (b - a) * HOP >= MIN_SEG], noise, speech


_ASR = {}


def speech_model(model):
    if model not in _ASR:
        from transformers import pipeline
        _ASR[model] = pipeline('automatic-speech-recognition', model=model, device='cpu')
    return _ASR[model]


def listen(memo, model):
    """-> {'noise', 'speech', 'segs': [(t0, t1)], 'words': [(token, t0, t1, seg)]}, cached per recording and model"""
    cache = VOICE / 'cache'
    cache.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha1(memo.read_bytes() + model.encode()).hexdigest()[:16]
    f = cache / f'{key}.json'
    if f.exists():
        return json.loads(f.read_text())
    y48 = decode(memo, SR)
    db = energy(y48)
    segs, noise, speech = phrases(db)
    if not segs:
        sys.exit(f'{memo.name}: no speech found (noise {noise:.0f} dB, loudest {speech:.0f} dB). Is the recording silent?')
    y16 = decode(memo, 16000)
    asr = speech_model(model)
    words = []
    for k, (a, b) in enumerate(segs):
        pad = 0.25
        a0, b0 = max(0.0, a - pad), min(len(y16) / 16000, b + pad)
        r = asr({'raw': y16[int(a0 * 16000): int(b0 * 16000)], 'sampling_rate': 16000}, return_timestamps='word', chunk_length_s=30)
        for c in r.get('chunks', []):
            s0, s1 = c['timestamp']
            s0 = 0.0 if s0 is None else s0
            s1 = (b0 - a0) if s1 is None else s1
            for tok in tokens(c['text']):
                words.append((tok, round(a0 + s0, 3), round(a0 + s1, 3), k))
        print(f'  {memo.name}  {a:6.1f}-{b:6.1f} s  {r["text"].strip()[:90]}', flush=True)
    out = {'noise': noise, 'speech': speech, 'segs': segs, 'words': words}
    f.write_text(json.dumps(out))
    return out


def find_takes(heard, lines):
    """every place in the heard words where a line was said: [(line, first token, end token, ratio, exact)]"""
    T = heard['words']
    cands = []
    for ln in lines:
        W = tokens(ln['text'])
        L = len(W)
        for i in range(len(T)):
            for n in range(max(1, L - 2), L + 3):
                if i + n > len(T):
                    break
                got = [t[0] for t in T[i: i + n]]
                r = difflib.SequenceMatcher(None, got, W, autojunk=False).ratio()
                if r >= MIN_RATIO:
                    cands.append((got == W, r, -abs(n - L), ln, i, i + n))
    cands.sort(key=lambda c: (c[0], c[1], c[2]), reverse=True)
    used, picks = set(), []
    for exact, r, _, ln, i, j in cands:
        if any(k in used for k in range(i, j)):
            continue
        used.update(range(i, j))
        picks.append((ln, i, j, r, exact))
    return sorted(picks, key=lambda p: p[1])


def valleys(db, a, b, floor, min_len):
    """quiet gaps (start s, end s) inside [a, b]: runs of frames under floor that last at least min_len seconds"""
    runs, s0 = [], None
    lo, hi = max(0, int(a / HOP)), min(len(db), int(b / HOP) + 1)
    for k in range(lo, hi + 1):
        low = k < hi and db[k] < floor
        if low and s0 is None:
            s0 = k
        elif not low and s0 is not None:
            if (k - s0) * HOP >= min_len:
                runs.append((s0 * HOP, k * HOP))
            s0 = None
    return runs


def strong(db, a, b, level, last=False):
    """time of the first (or last) frame in [a, b] louder than level; None when there is none"""
    import numpy as np
    lo, hi = max(0, int(a / HOP)), min(len(db), int(b / HOP) + 1)
    hit = np.flatnonzero(db[lo:hi] > level)
    return None if not len(hit) else (lo + int(hit[-1] if last else hit[0])) * HOP


def edge_near(db, t, floor, kind):
    """a line that starts or ends inside a phrase: the nearest quiet gap to the word time t (the speech model's word
    times are rough), cut just inside it. None when there is no gap near."""
    gaps = valleys(db, t - 0.45, t + 0.45, floor, 0.06)
    if not gaps:
        return None
    v0, v1 = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - t))
    return max(v0, v1 - 0.12) if kind == 'start' else min(v1, v0 + 0.15)


def bounds(heard, db, i, j, lo, hi):
    """seconds to cut for the words i..j-1 and how the ends were found ('phrase', 'gap' or 'words'). A line that is a whole
    phrase starts after the last quiet gap before its first strong sound (a breath before it is dropped) and ends at the
    next quiet gap after its last one; a line inside a phrase is cut at the quiet gaps nearest to its word times."""
    T, segs = heard['words'], heard['segs']
    floor, loud = heard['noise'] + 12, heard['speech'] - 12
    first, last = T[i], T[j - 1]
    sa, sb = first[3], last[3]
    how = []
    if i == next(k for k, t in enumerate(T) if t[3] == sa):
        a, b = segs[sa]
        k = strong(db, a, b, loud)
        gaps = valleys(db, a, k, floor, 0.10) if k else []
        start = gaps[-1][1] - 0.05 if gaps else a
        how.append('phrase')
    else:
        e = edge_near(db, first[1], floor, 'start')
        start = first[1] - 0.12 if e is None else e
        how.append('words' if e is None else 'gap')
    if j - 1 == max(k for k, t in enumerate(T) if t[3] == sb):
        a, b = segs[sb]
        k = strong(db, a, b, loud, last=True)
        gaps = valleys(db, k, b, floor, 0.10) if k else []
        end = min(b, (k or b) + 0.45, gaps[0][0] + 0.12 if gaps else b)
        how.append('phrase')
    else:
        e = edge_near(db, last[2], floor, 'end')
        end = last[2] + 0.15 if e is None else e
        how.append('words' if e is None else 'gap')
    return max(start - PRE, lo), min(end + POST, hi), how


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('memos', nargs='*', help='recordings (default: every audio file in --dir)')
    ap.add_argument('--dir', default=str(ROOT / '../../media/voice'), help='where the recordings are')
    ap.add_argument('--reel', help='only the lines of this reel (id or first digits)')
    ap.add_argument('--use', action='append', default=[], metavar='REEL:LINE=TAKE', help='choose a take by hand, e.g. 05:3=2')
    ap.add_argument('--model', default='openai/whisper-small', help='speech model; openai/whisper-medium hears kids and accents better, slower')
    ap.add_argument('--out', default=str(VOICE), help='where the lines go (a folder per reel)')
    a = ap.parse_args()

    reels = script()
    if a.reel:
        reels = {k: v for k, v in reels.items() if k.startswith(a.reel)}
        if not reels:
            sys.exit(f'no reel "{a.reel}" in VOICEOVER.md')
    lines = [dict(l, reel=rid) for rid, r in reels.items() for l in r['lines']]
    pick = {}
    for u in a.use:
        m = re.fullmatch(r'(\w+):(\d+)=(\d+)', u)
        if not m:
            sys.exit(f'--use wants REEL:LINE=TAKE, e.g. 05:3=2 (got "{u}")')
        pick[(next((k for k in reels if k.startswith(m[1])), m[1]), int(m[2]))] = int(m[3])

    folder = Path(a.dir).resolve()
    memos = [Path(m).resolve() for m in a.memos] or sorted(p for p in folder.glob('*') if p.suffix.lower() in EXTS and 'sample' not in p.name.lower())
    if not memos:
        sys.exit(f'no recordings in {folder}. Put the voice memos there (any name, any format).')

    import numpy as np, soundfile as sf
    from scipy import signal
    takes = {}      # (reel, scene) -> [take]
    stray = []
    for memo in memos:
        print(f'{memo.name}:', flush=True)
        heard = listen(memo, a.model)
        y = decode(memo, SR)
        db = energy(y)
        hp = signal.butter(2, 80, 'highpass', fs=SR, output='sos')
        picks = find_takes(heard, lines)
        covered = set()
        for n, (ln, i, j, ratio, exact) in enumerate(picks):
            covered.update(range(i, j))
            prev_end = max([heard['words'][p[2] - 1][2] for p in picks[:n]] + [0.0])
            nxt = [heard['words'][p[1]][1] for p in picks[n + 1:]]
            start, end, edges = bounds(heard, db, i, j, (prev_end + heard['words'][i][1]) / 2 if n else 0.0,
                                       (heard['words'][j - 1][2] + nxt[0]) / 2 if nxt else len(y) / SR)
            cut = signal.sosfiltfilt(hp, y[int(start * SR): int(end * SR)]).astype(np.float32)
            fr = int(0.02 * SR)
            loud = [float(np.sqrt(np.mean(cut[k: k + fr] ** 2))) for k in range(0, len(cut) - fr, fr // 2)]
            voiced = [v for v in loud if 20 * np.log10(v + 1e-9) > heard['speech'] - 26] or loud
            rms = float(np.sqrt(np.mean(np.square(voiced))))
            g = min(10 ** (LEVEL_DB / 20) / max(rms, 1e-6), 10 ** (PEAK_DB / 20) / max(float(np.abs(cut).max()), 1e-6))
            T = heard['words']
            takes.setdefault((ln['reel'], ln['scene']), []).append({
                'memo': memo.name, 'start': round(start, 3), 'end': round(end, 3), 'edges': edges, 'exact': exact, 'closeness': round(ratio, 3),
                'heard': ' '.join(t[0] for t in T[i:j]), 'audio': cut * g, 'gain_db': round(20 * np.log10(g), 1),
                'snr_db': round(20 * np.log10(rms + 1e-9) - heard['noise'], 1),
                'clipped': round(float(np.mean(np.abs(cut) >= 0.985)), 5),
                'words': [[t[0], round(t[1] - start, 3), round(t[2] - start, 3)] for t in T[i:j]]})
        words = heard['words']
        loose = [' '.join(w[0] for w in words if w[3] == k) for k in range(len(heard['segs']))
                 if not any(words[q][3] == k for q in covered)]
        stray += [(memo.name, s) for s in loose if s]

    out = Path(a.out)
    for rid, r in reels.items():
        got = {l['scene']: takes.get((rid, l['scene']), []) for l in r['lines']}
        if not any(got.values()):
            continue
        d = out / rid
        (d / 'takes').mkdir(parents=True, exist_ok=True)
        rows, missing = [], []
        for l in r['lines']:
            tk = got[l['scene']]
            if not tk:
                missing.append(l)
                continue
            for k, t in enumerate(tk, 1):
                sf.write(d / 'takes' / f"{l['scene']}-{k}.wav", t['audio'], SR, subtype='PCM_24')
            best = max(range(len(tk)), key=lambda k: (tk[k]['exact'], tk[k]['clipped'] < 0.001, round(tk[k]['snr_db'] / 3), k))
            best = pick.get((rid, l['scene']), best + 1) - 1
            if not 0 <= best < len(tk):
                sys.exit(f"{rid} line {l['scene']}: there are {len(tk)} takes, not {best + 1}")
            t = tk[best]
            sf.write(d / f"{l['scene']}.wav", t['audio'], SR, subtype='PCM_24')
            # the cut itself goes through the speech model once more: a clipped first or last word shows up here
            import librosa
            re_heard = speech_model(a.model)({'raw': librosa.resample(t['audio'], orig_sr=SR, target_sr=16000), 'sampling_rate': 16000},
                                             chunk_length_s=30)['text']
            t['cut_exact'], t['cut_heard'] = tokens(re_heard) == tokens(l['text']), re_heard.strip()
            rows.append({'scene': l['scene'], 'who': l['who'], 'text': l['text'], 'sync': l['sync'], 'file': f"{l['scene']}.wav",
                         'dur': round(len(t['audio']) / SR, 3), 'take': best + 1, 'heard': t['heard'], 'exact': t['exact'],
                         'closeness': t['closeness'], 'snr_db': t['snr_db'], 'clipped': t['clipped'], 'cut_exact': t['cut_exact'],
                         'cut_heard': t['cut_heard'], 'words': t['words'],
                         'takes': [{k: v for k, v in x.items() if k not in ('audio', 'words')} for x in tk]})
        (d / 'lines.json').write_text(json.dumps({
            '_doc': 'Live recordings cut into lines by tools/voice_cut.py. Personal data: never committed.',
            'reel': rid, 'source': 'recording', 'checked_with': a.model, 'lines': rows,
            'not_made': [{'scene': l['scene'], 'who': l['who'], 'text': l['text']} for l in missing]}, indent=1))
        print(f'\n{rid}: {len(rows)} of {len(r["lines"])} lines  ->  {d.relative_to(ROOT) if d.is_relative_to(ROOT) else d}')
        for row in rows:
            flags = []
            if not row['exact']:
                flags.append(f'heard "{row["heard"]}", close but not word for word')
            if not row['cut_exact']:
                flags.append(f'the finished cut is heard as "{row["cut_heard"]}": an edge may be clipped, listen to it')
            if 'words' in row['takes'][row['take'] - 1]['edges']:
                flags.append('an edge is cut by the speech model\'s rough word time: listen to it')
            if row['snr_db'] < 25:
                flags.append(f'noisy ({row["snr_db"]:.0f} dB over the room)')
            if row['clipped'] >= 0.001:
                flags.append('clipped: too loud, record again further from the phone')
            print(f"  line {row['scene']}  {len(row['takes'])} take(s), using {row['take']}  {row['dur']:.2f} s  "
                  f"{row['who']}: {row['text']}" + ('   ! ' + '; '.join(flags) if flags else ''))
        for l in missing:
            print(f"  line {l['scene']}  NOT FOUND  {l['who']}: {l['text']}")
    if stray:
        print('\nsounds that matched no line (if a line is NOT FOUND, its words may be here):')
        for name, s in stray[:12]:
            print(f'  {name}: {s[:100]}')
    if not takes:
        sys.exit('no line of VOICEOVER.md was found in the recordings. Hint: --model openai/whisper-medium')


if __name__ == '__main__':
    main()
