#!/usr/bin/env python3
"""Anna's lines for one reel in her own voice, cloned from her recording (open model Chatterbox, MIT, runs on a CPU).

    $VOICE_PY tools/voice_clone.py 05 [--ref ../../media/voice/anna-sample.mp3] [--tries 4]
    $VOICE_PY tools/voice_clone.py 05 --heard ../out/voice-sample-05.mp4     the finished mix, transcribed again

VOICE_PY is a Python with chatterbox-tts, transformers and librosa (about 2 GB, plus 4 GB of models on the first run).
The lines come from VOICEOVER.md. A take is kept only if an open speech model (Whisper small) hears the line word for
word; how close a take is to the recording is measured with the voice model's own speaker encoder. Those are
measurements, not ears: the owner listens and decides. Output, never committed: out/voice/<id>/<scene>.wav, lines.json.

--heard is the last check of a voiced reel: the same speech model listens to the finished file, music and effects
included, and every line has to come back word for word.

Only Anna's lines are made here. Kamilla is a child: her voice is not cloned, she records her lines herself.
The recording and everything made from it stay out of git (the repository is public).
"""
import argparse, difflib, json, logging, os, re, subprocess, sys, time, warnings
from pathlib import Path

warnings.filterwarnings('ignore')
logging.disable(logging.WARNING)
ROOT = Path(__file__).resolve().parent.parent
VOICE = ROOT / os.environ.get('VOICE_DIR', 'out/voice')   # where the lines go (a folder per reel); VOICE_DIR overrides it, e.g. for tests
SEEDS = [7, 11, 23, 42, 5, 19, 31, 3]
SET = {'exaggeration': 0.45, 'cfg_weight': 0.5, 'temperature': 0.7}
# the reference: rumble out, pauses over 0.45 s closed, level evened, first 28 s (the model reads the first 10)
REF_AF = ('highpass=f=70,silenceremove=start_periods=1:start_threshold=-40dB:stop_periods=-1:stop_duration=0.45:'
          'stop_threshold=-40dB,loudnorm=I=-18:TP=-2')
LEVEL_DB, PEAK_DB = -20.0, -1.5          # every line: speech at -20 dBFS RMS, peaks under -1.5 dBFS
PRE, POST = 0.03, 0.12                   # seconds kept before the first and after the last sound of a take


def script():
    """VOICEOVER.md -> {reel id: {who, lines: [{scene, from, to, who, text, sync}]}}"""
    reels, cur = {}, None
    for l in (ROOT / 'VOICEOVER.md').read_text().splitlines():
        m = re.match(r'### (\S+) · (.+?) · [\d.]+ s', l)
        if m:
            cur = reels.setdefault(m[1], {'who': m[2], 'lines': []})
            continue
        m = re.match(r'\| (\d+) \| ([\d.]+)-([\d.]+) \| (.+?) \| ', l)
        if m and cur is not None:
            who, text = cur['who'], m[4].strip()
            sp = re.match(r'(Anna|Kamilla|Both): (.*)', text)
            if sp:
                who, text = sp[1], sp[2]
            star = re.search(r'\*([^*]+)\*', text)
            cur['lines'].append({'scene': int(m[1]), 'from': float(m[2]), 'to': float(m[3]), 'who': who,
                                 'text': text.replace('*', ''), 'sync': star[1] if star else None})
    return reels


def norm(s):
    return re.sub(r"[^a-z0-9' ]+", ' ', s.lower().replace('’', "'")).split()


def heard_in_mix(rid, film):
    """the finished mix through the speech model: is every line still there, word for word, over the music?"""
    import librosa
    from transformers import pipeline
    take = json.loads((VOICE / rid / 'lines.json').read_text())
    wav = VOICE / rid / 'heard.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(film), '-vn', '-ar', '16000', '-ac', '1', str(wav)], check=True)
    y, _ = librosa.load(wav, sr=16000, mono=True)
    asr = pipeline('automatic-speech-recognition', model='openai/whisper-small', device='cpu')
    got = norm(asr({'raw': y, 'sampling_rate': 16000}, chunk_length_s=30)['text'])
    ok = True
    for ln in take['lines']:
        want = norm(ln['text'])
        there = any(got[i:i + len(want)] == want for i in range(len(got) - len(want) + 1))
        ok &= there
        print(f"scene {ln['scene']}  {'heard word for word' if there else 'NOT heard as written'}  | {ln['text']}")
    print(f"{film.name}: the speech model hears \"{' '.join(got)}\"")
    sys.exit(0 if ok else 1)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('reel', help='reel id or its first digits, e.g. 05')
    ap.add_argument('--ref', default=str(ROOT / '../../media/voice/anna-sample.mp3'), help="Anna's recording")
    ap.add_argument('--tries', type=int, default=4, help='takes per line before the closest one is kept and flagged')
    ap.add_argument('--heard', metavar='FILE', help='transcribe a finished voiced reel and compare it with the lines')
    a = ap.parse_args()

    reels = script()
    ids = [k for k in reels if k.startswith(a.reel)]
    if len(ids) != 1:
        sys.exit(f'"{a.reel}" matches {ids or "no reel"} in VOICEOVER.md')
    rid = ids[0]
    lines = [l for l in reels[rid]['lines'] if l['who'] == 'Anna']
    others = [l for l in reels[rid]['lines'] if l['who'] != 'Anna']
    if not lines:
        sys.exit(f'{rid}: no line is Anna\'s. Kamilla records her own lines; her voice is not cloned.')
    if a.heard:
        return heard_in_mix(rid, Path(a.heard).resolve())
    ref = Path(a.ref).resolve()
    if not ref.exists():
        sys.exit(f'no recording at {ref}')
    out = VOICE / rid
    out.mkdir(parents=True, exist_ok=True)
    refwav = VOICE / 'ref.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(ref), '-af', REF_AF, '-ar', '24000', '-ac', '1',
                    '-t', '28', str(refwav)], check=True)

    import numpy as np, torch, librosa, soundfile as sf
    from chatterbox.tts import ChatterboxTTS
    from transformers import pipeline
    t0 = time.time()
    tts = ChatterboxTTS.from_pretrained(device='cpu')
    asr = pipeline('automatic-speech-recognition', model='openai/whisper-small', device='cpu')
    print(f'models loaded in {time.time() - t0:.0f} s', flush=True)

    def embed(y16):
        return tts.ve.embeds_from_wavs([y16], sample_rate=16000)[0]

    def cos(x, y):
        return float(np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y)))

    def to16(y):
        return librosa.resample(y, orig_sr=tts.sr, target_sr=16000)

    ref16, _ = librosa.load(refwav, sr=16000, mono=True)
    e_ref, half = embed(ref16), len(ref16) // 2
    scale = {'anna_vs_anna': round(cos(embed(ref16[:half]), embed(ref16[half:])), 3)}
    if tts.conds is not None:  # the model's stock voice says the first line: what "a different person" scores
        torch.manual_seed(SEEDS[0])
        scale['another_voice'] = round(cos(embed(to16(tts.generate(lines[0]['text'], **SET).squeeze(0).numpy())), e_ref), 3)
    tts.prepare_conditionals(str(refwav), exaggeration=SET['exaggeration'])
    print(f'resemblance scale: {scale}', flush=True)

    done = []
    for ln in lines:
        best = None
        for seed in SEEDS[:a.tries]:
            torch.manual_seed(seed)
            y = tts.generate(ln['text'], **SET).squeeze(0).numpy().astype(np.float32)
            _, (i0, i1) = librosa.effects.trim(y, top_db=45, frame_length=1024, hop_length=256)
            body = y[i0:i1]
            g = 10 ** (LEVEL_DB / 20) / max(float(np.sqrt(np.mean(body ** 2))), 1e-6)
            g = min(g, 10 ** (PEAK_DB / 20) / max(float(np.abs(body).max()), 1e-6))
            y = y[max(0, i0 - int(PRE * tts.sr)): min(len(y), i1 + int(POST * tts.sr))] * g
            y16 = to16(y)
            r = asr({'raw': y16, 'sampling_rate': 16000}, return_timestamps='word')
            dur = len(y) / tts.sr
            words = [[' '.join(norm(c['text'])), round(c['timestamp'][0] or 0.0, 2), round(c['timestamp'][1] or dur, 2)]
                     for c in r['chunks']]
            heard = r['text'].strip()
            take = {'scene': ln['scene'], 'who': ln['who'], 'text': ln['text'], 'sync': ln['sync'], 'file': f"{ln['scene']}.wav",
                    'dur': round(dur, 3), 'seed': seed, 'heard': heard, 'exact': norm(heard) == norm(ln['text']),
                    'closeness': round(difflib.SequenceMatcher(None, norm(heard), norm(ln['text'])).ratio(), 3),
                    'resemblance': round(cos(embed(y16), e_ref), 3), 'words': words}
            if best is None or (take['exact'], take['closeness']) > (best[0]['exact'], best[0]['closeness']):
                best = (take, y)
            if take['exact']:
                break
        take, y = best
        sf.write(out / take['file'], y, tts.sr, subtype='PCM_16')
        done.append(take)
        flag = 'word for word' if take['exact'] else f'NOT word for word, heard: "{take["heard"]}"'
        print(f"scene {take['scene']}  {take['dur']:.2f} s  seed {take['seed']}  resemblance {take['resemblance']:.2f}  "
              f"{flag}  | {take['text']}", flush=True)

    (out / 'lines.json').write_text(json.dumps({
        '_doc': "Anna's voice cloned from her own recording, for the owner to judge. Personal data: never committed, "
                'never published without her consent and the AI label.',
        'reel': rid, 'model': 'ResembleAI/chatterbox', 'settings': SET, 'checked_with': 'openai/whisper-small',
        'resemblance_scale': scale, 'lines': done,
        'not_made': [{'scene': l['scene'], 'who': l['who'], 'text': l['text']} for l in others]}, indent=1))
    for l in others:
        print(f"scene {l['scene']}  not made ({l['who']} records it)  | {l['text']}")
    bad = [t['scene'] for t in done if not t['exact']]
    print(f"{rid}: {len(done)} lines in {out}" + (f', check scenes {bad} by ear' if bad else ', all heard word for word'))


if __name__ == '__main__':
    main()
