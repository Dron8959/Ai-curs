#!/usr/bin/env python3
"""Lists the separate sounds inside a recording: start, peak, end (seconds), level, brightness and, when the sound
is tonal, its pitch. We cannot listen, so trims are chosen from these numbers.   python tools/events.py FILE [...]"""
import sys, numpy as np, soundfile as sf

NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

def note(f):
    if f <= 0: return ''
    m = 69 + 12 * np.log2(f / 440.0); k = int(round(m))
    return f"{NOTES[k % 12]}{k // 12 - 1}{(m - k) * 100:+.0f}c"

def events(path, gap=0.03, floor_db=-38):
    x, sr = sf.read(path, always_2d=True); m = x.mean(axis=1)
    win = max(1, int(sr * 0.002)); env = np.sqrt(np.convolve(m ** 2, np.ones(win) / win, 'same'))
    peak = env.max(); thr = peak * 10 ** (floor_db / 20)
    on = env > thr; out = []; i = 0; n = len(m)
    while i < n:
        if on[i]:
            j = i; last = i
            while j < n and (on[j] or j - last < gap * sr):
                if on[j]: last = j
                j += 1
            seg = m[i:last + 1]; pk = i + int(np.argmax(env[i:last + 1]))
            sp = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), 1 << max(12, int(np.ceil(np.log2(len(seg)))))))
            fr = np.fft.rfftfreq((len(sp) - 1) * 2, 1 / sr)
            cent = float((sp * fr).sum() / max(sp.sum(), 1e-12))
            lo = (fr > 60) & (fr < 6000); f0 = float(fr[lo][np.argmax(sp[lo])])
            tonal = float(sp[lo].max() / (np.sort(sp[lo])[-len(sp[lo]) // 20:].mean() + 1e-12))
            out.append(dict(start=i / sr, peak=pk / sr, end=(last + 1) / sr, db=20 * np.log10(env[pk] + 1e-12), cent=cent, f0=f0, tonal=tonal))
            i = j
        else:
            i += 1
    return out, len(m) / sr

for p in sys.argv[1:]:
    ev, dur = events(p)
    print(f"{p.split('/')[-1]}  ({dur:.3f} s, {len(ev)} sound(s))")
    for k, e in enumerate(ev):
        print(f"  #{k}  {e['start']:.3f}-{e['end']:.3f} s  peak at {e['peak']:.3f}  {e['db']:6.1f} dB  centroid {e['cent']:6.0f} Hz  strongest {e['f0']:6.0f} Hz {note(e['f0']):>8}  peakiness {e['tonal']:.1f}")
