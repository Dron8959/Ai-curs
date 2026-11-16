# YouTube Shorts has no carousels: each carousel becomes a Short made from its 9:16 TikTok slides.
# Two bars of Playground Fun (130 BPM) per slide, cuts on the bar, the track's ending under the last slide, -14 LUFS.
# Music first: python3 social/concept/sound/tools/fetch.py
# Usage: python3 social/concept/youtube/carousels.py 03-ai-house-rules 09-first-families 10-free-first-lesson
# Writes posts/<id>/youtube.mp4.
import subprocess, sys, glob, os
HERE = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(HERE, '..', 'posts')
MUSIC = os.path.join(HERE, '..', 'sound', 'audio', 'assets', 'music', 'mk-12_playground-fun.mp3')
T0, BAR, FPS = 0.4543, 1.846211, 30   # from sound/audio/music-edits.json
def run(c): subprocess.run(c, check=True)
for pid in sys.argv[1:]:
    slides = sorted(glob.glob(f'{P}/{pid}/tiktok/slide-*.jpg')); n = len(slides)
    bars = 2 * n; head = bars - 4
    segs = [(0, head), (93, 98)]   # the opening bars, then the track's ending (last chord on bar 96) and one bar of tail
    a = []
    for i, (b0, b1) in enumerate(segs):
        st = T0 + b0 * BAR if b0 else 0; en = T0 + b1 * BAR
        a.append(f'[1:a]atrim={st:.4f}:{en:.4f},asetpts=PTS-STARTPTS[a{i}]')
    tail = BAR; dur = bars * BAR + tail
    af = ';'.join(a) + f';[a0][a1]acrossfade=d=0.03[am];[am]atrim=0:{dur:.4f},afade=t=out:st={dur-1.2:.4f}:d=1.2,loudnorm=I=-14:TP=-1.5:LRA=7[aout]'
    v = []; ins = []
    for i, s in enumerate(slides):   # slide i holds 2 bars; the first also covers the lead-in, the last the tail
        d = 2 * BAR + (T0 if i == 0 else 0) + (tail - T0 if i == n - 1 else 0)
        fr = round(d * FPS); ins += ['-loop', '1', '-framerate', str(FPS), '-t', f'{d:.4f}', '-i', s]
        v.append(f"[{i+2}:v]scale=1188:2112,zoompan=z='1+0.03*on/{fr}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps={FPS},trim=end_frame={fr},setsar=1[v{i}]")
    vf = ';'.join(v) + ';' + ''.join(f'[v{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0,format=yuv420p[vout]'
    out = f'{P}/{pid}/youtube.mp4'
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc', '-i', MUSIC, *ins, '-filter_complex', vf + ';' + af,
         '-map', '[vout]', '-map', '[aout]', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out])
    print(pid, subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip())
