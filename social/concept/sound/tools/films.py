#!/usr/bin/env python3
"""Writes the per-reel design files from the cue files and audio/music-edits.json:
   audio/design/music-<id>.json  the music block (segments at bar lines)
   audio/films/<id>.json         the top level the mixer reads (duration, cues, fragments, buses, master)
Run after render.mjs has written sound/cues/<id>.json:   python3 tools/films.py"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = json.load(open(os.path.join(ROOT, 'audio/music-edits.json')))
T = E['track']
FILM_BAR = 4 * 60 / T['bpm']
LEAD = 0.035
INTRO_DB = -3.5      # the opening sits under the body, then lifts into the reveal
FRAGMENTS = ['audio/design/ui.json', 'audio/design/paper.json', 'audio/design/writing.json', 'audio/design/motion.json']

for fid, parts in E['films'].items():
    cues = json.load(open(os.path.join(ROOT, 'cues', fid + '.json')))
    dur = cues['total'] / cues['fps']
    segs, bar = [], 0
    for k, (a, b, why) in enumerate(parts):
        last = k == len(parts) - 1
        seg = {'label': f"film bars {bar + 1}-{bar + b - a + 1} = track bars {a}-{b} ({why})",
               'src_from': round(T['t0'] + a * T['bar'], 4), 'src_to': round(T['t0'] + (b + 1) * T['bar'], 4),
               'at': round(bar * FILM_BAR, 4), 'fade_in': 0.008, 'fade_out': 0.06}
        if k == 0:
            # the track's first note swells in over about 40 ms. The mixer plays `fade_in` seconds of pre-roll before
            # `at`, so the opening sits LEAD late: the film starts on silence and the note keeps its own attack.
            seg['at'] = LEAD; seg['fade_in'] = LEAD
        if last:
            seg['tail_fade'] = 1.2
        segs.append(seg); bar += b - a + 1
    reveal, logo = cues['cue'].get('reveal'), cues['cue'].get('logo')
    rv, lg = reveal / cues['fps'], logo / cues['fps']
    assert abs(bar * FILM_BAR - dur) < FILM_BAR, (fid, bar, dur)
    music = {'_doc': f"Music edit for {fid}: see audio/music-edits.json. Written by tools/films.py.",
             'music': {'file': T['file'], 'src_bpm': T['bpm'], 'target_bpm': T['bpm'], 'stretch': 'none', 'gain_db': -5.0,
                       'eq': {'hp': 30}, 'segments': segs}}
    json.dump(music, open(os.path.join(ROOT, f'audio/design/music-{fid}.json'), 'w'), indent=1)
    film = {'_doc': f"Soundtrack of the reel {fid} (real-sound skill: recordings only, credited in CREDITS.md). Written by tools/films.py from the cue file and audio/music-edits.json; the sound palette is shared by every reel (audio/design/*.json).",
            'duration': round(dur, 4), 'cues': f'cues/{fid}.json',
            'include': [f'audio/design/music-{fid}.json'] + FRAGMENTS,
            '_buses_doc': f"Two rides. Music: the opening sits {-INTRO_DB} dB under the body and lifts over the last 0.3 s before the reveal ({rv:.2f} s), where the track's big entrance lands; its last chord is on the logo ({lg:.2f} s). Effects: 4 dB down from the logo on, so the button's pop does not stand over the chord that is ringing out.",
            'buses': {'music': {'gain_db': 0.0, 'auto': [[0, INTRO_DB], [round(rv - 0.30, 3), INTRO_DB], [round(rv - 0.02, 3), 0.0], [round(dur, 3), 0.0]]},
                      'amb': {'gain_db': 0.0},
                      'sfx': {'gain_db': 0.0, 'eq': {'hp': 40}, 'auto': [[0, 0.0], [round(lg - 0.05, 3), 0.0], [round(lg + 0.15, 3), -4.0], [round(dur, 3), -4.0]]}},
            '_master_doc': '-14 LUFS for social video; ceiling 0.77 leaves room for the AAC encode (about -1 dBTP after the mux).',
            'master': {'lufs': -14, 'ceiling': 0.77, 'no_glue': True}}
    json.dump(film, open(os.path.join(ROOT, f'audio/films/{fid}.json'), 'w'), indent=1)
    print(f"{fid}: {dur:.3f} s, {bar} film bars, reveal {reveal / cues['fps']:.2f} s, logo {logo / cues['fps']:.2f} s, {len(segs)} music segments")
