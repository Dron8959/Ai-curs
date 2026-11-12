#!/usr/bin/env python3
"""How alive is a recording, and which seconds of it should a cloned voice copy?

    $VOICE_PY tools/voice_ref.py recording.m4a [more recordings]        how far the voice moves, and the best seconds
    $VOICE_PY tools/voice_ref.py recording.m4a --write ref.wav          also write the 10 s reference for the voice model

Measured, not heard: the pitch of the speech in semitones, from the 10th to the 90th percentile (one squeak does not
count), and its spread; how much the loudness moves. A flat reading moves little, a person who acts moves a lot.
The yardstick is Anna's first recording, a script read flatly on 11 November 2026: 6.6 semitones, spread 2.5.
The number says whether the voice moves, not whether it moves well: ears decide that.

Why the best seconds matter: the voice model (Chatterbox) takes the manner of speaking, not only the timbre, from the
first 6 seconds of its reference (they are its style prompt; the first 10 s shape the sound, the whole file gives the
speaker's identity). A reference that opens with the most lively 6 seconds is the cheapest thing to try.
Pauses over 0.45 s are closed first, as the model wants one continuous stretch of speech.
"""
import argparse, subprocess, sys, tempfile, warnings, logging
from pathlib import Path

warnings.filterwarnings('ignore')
logging.disable(logging.WARNING)
AF = ('highpass=f=70,silenceremove=start_periods=1:start_threshold=-40dB:stop_periods=-1:stop_duration=0.45:'
      'stop_threshold=-40dB,loudnorm=I=-18:TP=-2')
SR, FPS = 24000, 100            # reference sample rate; pitch frames per second
STYLE, LENGTH = 6, 10           # seconds the model reads as style prompt, and in all
FIRST = {'range_st': 6.6, 'std_st': 2.5}   # Anna's first recording, read flatly


def compact(src, dst):
    """one continuous stretch of speech: rumble out, pauses closed, level even"""
    p = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(src), '-af', AF, '-ar', str(SR), '-ac', '1', str(dst)])
    if p.returncode:
        sys.exit(f'ffmpeg could not read {src}')


def track(y):
    """pitch (Hz, NaN where there is none) and loudness (dB), 100 frames a second"""
    import numpy as np, librosa
    y16 = librosa.resample(y, orig_sr=SR, target_sr=16000)
    f0, _, _ = librosa.pyin(y16, fmin=70, fmax=500, sr=16000, frame_length=1024, hop_length=160)
    rms = librosa.feature.rms(y=y16, frame_length=800, hop_length=160)[0]
    n = min(len(f0), len(rms))
    return f0[:n], 20 * np.log10(rms[:n] + 1e-6)


def metrics(f0, db, a=0, b=None):
    import numpy as np
    f, d = f0[a:b], db[a:b]
    v = ~np.isnan(f)
    if v.sum() < 30:
        return None
    st = 12 * np.log2(f[v] / np.nanmedian(f[v]))
    return {'range_st': float(np.percentile(st, 90) - np.percentile(st, 10)), 'std_st': float(st.std()),
            'loud_db': float(d[v].std()), 'voiced': float(v.mean())}


def best_window(f0, db, seconds=STYLE):
    """start (s) of the most lively stretch of that length: the widest pitch range, mostly voiced"""
    best = (0.0, None)
    for a in range(0, max(1, len(f0) - seconds * FPS + 1), FPS // 2):
        m = metrics(f0, db, a, a + seconds * FPS)
        if m and m['voiced'] > 0.5 and (best[1] is None or m['range_st'] > best[1]['range_st']):
            best = (a / FPS, m)
    return best


def analyse(src, write=None):
    import numpy as np, librosa, soundfile as sf
    with tempfile.TemporaryDirectory() as t:
        wav = Path(t) / 'compact.wav'
        compact(src, wav)
        y, _ = librosa.load(wav, sr=SR)
    if len(y) < 4 * SR:
        sys.exit(f'{Path(src).name}: under 4 s of speech, too little to measure')
    f0, db = track(y)
    whole = metrics(f0, db)
    start, win = best_window(f0, db)
    out = {'seconds': len(y) / SR, 'whole': whole, 'start': start, 'best': win}
    if write:
        ref = y[int(start * SR): int((start + LENGTH) * SR)]
        sf.write(write, ref, SR)
        out['reference'] = {'file': str(write), 'seconds': len(ref) / SR, 'style_prompt': metrics(*track(ref), 0, STYLE * FPS)}
    return out


def report(name, r):
    w, b = r['whole'], r['best']
    print(f"{name}: {r['seconds']:.0f} s of speech once the pauses are closed")
    print(f"  the voice moves: pitch range {w['range_st']:.1f} semitones, spread {w['std_st']:.1f}, loudness moves {w['loud_db']:.1f} dB")
    print(f"  against Anna's first recording (a flat reading): {w['range_st'] / FIRST['range_st']:.1f}x the range, "
          f"{w['std_st'] / FIRST['std_st']:.1f}x the spread")
    if b:
        print(f"  most lively {STYLE} s: from {r['start']:.0f} s, range {b['range_st']:.1f} semitones, spread {b['std_st']:.1f}")
    if 'reference' in r:
        ref = r['reference']
        sp = ref['style_prompt']
        print(f"  reference written: {ref['file']} ({ref['seconds']:.0f} s from {r['start']:.0f} s"
              + (f"; its first {STYLE} s, the style prompt, move {sp['range_st']:.1f} semitones)" if sp else ')'))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('recordings', nargs='+')
    ap.add_argument('--write', metavar='WAV', help='write the 10 s reference (one recording only)')
    a = ap.parse_args()
    if a.write and len(a.recordings) != 1:
        sys.exit('--write wants exactly one recording')
    for rec in a.recordings:
        if not Path(rec).exists():
            sys.exit(f'no file {rec}')
        report(Path(rec).name, analyse(rec, a.write))


if __name__ == '__main__':
    main()
