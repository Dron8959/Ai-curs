#!/usr/bin/env python3
"""Names the most likely chord of every bar of a track (chroma against major/minor triads), so a splice can be
checked for harmony without hearing it.   python tools/chords.py TRACK T0 BAR_SECONDS [FROM_BAR TO_BAR ...]"""
import sys, numpy as np, librosa
path, t0, bar = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
ranges = [(int(a), int(b)) for a, b in zip(sys.argv[4::2], sys.argv[5::2])] or [(0, 15)]
y, sr = librosa.load(path, sr=22050, mono=True)
yh = librosa.effects.harmonic(y, margin=4)
C = librosa.feature.chroma_cqt(y=yh, sr=sr, hop_length=512, bins_per_octave=36)
N = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
tpl = {}
for r in range(12):
    for name, iv in (('', (0, 4, 7)), ('m', (0, 3, 7))):
        v = np.zeros(12); v[[(r + i) % 12 for i in iv]] = 1; tpl[N[r] + name] = v / np.linalg.norm(v)
def chord(a, b):
    i, j = int(a * sr / 512), int(b * sr / 512)
    c = C[:, i:j].mean(axis=1); c = c / (np.linalg.norm(c) + 1e-9)
    sc = sorted(((float(c @ v), k) for k, v in tpl.items()), reverse=True)
    top = ' '.join(N[k] for k in np.argsort(-c)[:4])
    return sc[0][1], sc[0][0], sc[1][1], sc[1][0], top
for a, b in ranges:
    print(f'bars {a}-{b}')
    for k in range(a, b + 1):
        s = t0 + k * bar
        h1 = chord(s, s + bar / 2); h2 = chord(s + bar / 2, s + bar)
        print(f"  bar {k:>3} {s:7.2f}s  {h1[0]:>4} ({h1[1]:.2f}, then {h1[2]} {h1[3]:.2f}) | {h2[0]:>4} ({h2[1]:.2f})   strongest notes {h1[4]} / {h2[4]}")
