#!/usr/bin/env python3
"""Downloads the Mixkit recordings listed in audio/assets/sources.json into audio/assets/<category>/.

The raw recordings are never committed (the Mixkit licences forbid redistributing the items on their own),
so this script is how a fresh checkout gets them back:  python3 tools/fetch.py
Polite: sequential, 1.5 s between requests, skips files that are already there.
"""
import json, os, re, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'Mozilla/5.0 (compatible; makeshowlab-sound-sourcing)'

def slug(title):
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')

def url_of(it):
    if it['kind'] == 'music':
        return f"https://assets.mixkit.co/music/{it['id']}/{it['id']}.mp3"
    return f"https://assets.mixkit.co/active_storage/sfx/{it['id']}/{it['id']}.wav"

def path_of(it):
    ext = 'mp3' if it['kind'] == 'music' else 'wav'
    return f"audio/assets/{it['category']}/mk-{it['id']}_{slug(it['title'])}.{ext}"

def main():
    items = json.load(open(os.path.join(ROOT, 'audio/assets/sources.json')))['items']
    got = 0
    for it in items:
        dst = os.path.join(ROOT, path_of(it))
        if os.path.exists(dst) and os.path.getsize(dst) > 1000:
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        req = urllib.request.Request(url_of(it), headers={'User-Agent': UA})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
        except Exception as e:  # noqa: BLE001
            print('FAILED', it['id'], it['title'], e, file=sys.stderr)
            continue
        open(dst, 'wb').write(data)
        got += 1
        print(f"{len(data) // 1024:>6} KB  {path_of(it)}")
        time.sleep(1.5)
    print(f'{got} downloaded, {len(items) - got} already present or failed')

if __name__ == '__main__':
    main()
