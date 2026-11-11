#!/usr/bin/env node
// Renders the posts in content.mjs / reels.mjs.
//
//   node social/concept/render.mjs static [id]   tiles (3:4), carousel slides (4:5), reel covers (9:16), captions
//   node social/concept/render.mjs reel <id>     one reel -> posts/<id>/reel.mp4 (picture, silent track) + its cue file
//   node social/concept/render.mjs cues <id>     only the cue file -> sound/cues/<id>.json
//
// The cue file is the contract between picture and sound: the exact time of every entrance that makes a
// sound, read from the same timeline that draws the frames. sound/build.sh mixes the soundtrack from it.
// Slides are drawn on a 1152×1440 canvas and saved at 1080×1350: the 1080-wide composition sits in the
// middle, so the 3:4 crop of the profile grid shows exactly the tile. Reels are HTML scenes driven by a
// paused GSAP timeline; every frame is seeked, screenshotted and piped into ffmpeg, so the result is
// frame-exact and repeatable.

import { createRequire } from 'node:module';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { css, here, repo, RUBRIC, BPM, B, SYNC } from './kit.mjs';
import { posts, byId } from './content.mjs';
import { reels } from './reels.mjs';
import { packaging } from './platforms.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const [mode, only] = process.argv.slice(2);
const dirOf = (p) => { const d = join(here, 'posts', p.id); mkdirSync(d, { recursive: true }); return d; };
const doc = (body, extra = '') => `<!doctype html><meta charset="utf-8"><style>${css()}${extra}</style>${body}`;

async function shot(browser, html, file, w, h, dsf = 1) {
  const pg = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf })).newPage();
  const tmp = `${file}.html`;
  writeFileSync(tmp, html);
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(100);
  await pg.screenshot({ path: file, type: 'jpeg', quality: 92 });
  await pg.context().close();
  unlinkSync(tmp);
}

// ------------------------------------------------------------------------- words for the other platforms
const BANNED = /[\u2014\u2013\u2018\u2019\u201c\u201d]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof)\b|#fyp|#viral/i;
const tagsIn = (t) => t.match(/#\w+/g) || [];
function check(id, where, text, rules) {
  const bad = [];
  if (BANNED.test(text)) bad.push(`banned character or word: ${text.match(BANNED)[0]}`);
  for (const [ok, msg] of rules) if (!ok) bad.push(msg);
  if (bad.length) throw new Error(`${id} ${where}: ${bad.join('; ')}`);
}
const fm = (rows) => ['---', ...rows.filter(Boolean), '---'].join('\n');

function writePlatforms(p, d) {
  const k = packaging[p.id];
  if (!k) return;
  const kw = k.keyword.toLowerCase();
  const media = p.slides ? `slide-01.jpg to slide-${String(p.slides.length).padStart(2, '0')}.jpg` : 'reel.mp4';
  if (k.tiktok) {
    const c = k.tiktok.caption.trim();
    check(p.id, 'tiktok', c, [[c.slice(0, 110).toLowerCase().includes(kw), `the search phrase "${k.keyword}" must open the caption`],
      [tagsIn(c).length >= 1 && tagsIn(c).length <= 5, 'one to five tags'], [c.length <= 2200, 'caption over 2200 characters']]);
    writeFileSync(join(d, 'tiktok.md'), `${fm([`post: ${p.n}`, 'network: tiktok', `type: ${p.slides ? 'photo mode (9:16 slides in tiktok/)' : 'video'}`,
      `media: ${p.slides ? `tiktok/${media}` : media}`, `search_phrase: "${k.keyword}"`, p.slides ? 'music: pick a calm track in the app (photo posts need one)' : 'cover: cover.jpg',
      'comments: on', p.slides ? '' : 'duet: on', p.slides ? '' : 'stitch: on', 'privacy: public',
      'disclosure: "Your brand" on (it promotes our own course); "Branded content" off', `ai_label: ${p.ai ? 'on' : 'off'}`])}\n${c}\n`);
  }
  if (k.youtube) {
    const y = k.youtube;
    check(p.id, 'youtube', `${y.title}\n${y.description}`, [[y.title.length <= 100, 'title over 100 characters'],
      [y.title.toLowerCase().indexOf(kw) >= 0 && y.title.toLowerCase().indexOf(kw) + kw.length <= 45, `the search phrase "${k.keyword}" must sit in the first 40 characters of the title`],
      [y.description.toLowerCase().includes(kw), 'the description must use the search phrase'], [y.tags[0] === kw, 'the first tag must be the exact search phrase'],
      [tagsIn(y.description).length <= 3, 'at most three hashtags'], [!/https?:\/\//.test(y.description), 'no link in a Shorts description: it is not clickable, write the address as text']]);
    writeFileSync(join(d, 'youtube.md'), `${fm([`post: ${p.n}`, 'network: youtube shorts', `title: "${y.title}"`, `title_length: ${y.title.length}`, 'media: reel.mp4',
      'category: Education', 'privacy: public', 'made_for_kids: "No" (the videos speak to parents; the owner confirms this declaration)',
      `altered_content: ${p.ai ? 'not required (stylised cartoon, nothing realistic); the description says AI made it' : 'no'}`, `tags: [${y.tags.join(', ')}]`])}\n${y.description.trim()}\n`);
  }
  if (k.facebook) {
    const f = k.facebook;
    check(p.id, 'facebook', `${f.caption}\n${f.comment}`, [[!/https?:\/\/|makeshowlab\.com/.test(f.caption), 'the link belongs in the first comment, not in the post'],
      [/https:\/\/www\.makeshowlab\.com\//.test(f.comment), 'the first comment needs the link'], [tagsIn(f.caption).length <= 3, 'at most three tags']]);
    writeFileSync(join(d, 'facebook.md'), `${fm([`post: ${p.n}`, 'network: facebook', `type: ${p.slides ? 'photo post (the slides as an album)' : 'reel'}`, `media: ${media}`,
      `first_comment: "${f.comment}"`])}\n${f.caption.trim()}\n`);
  }
}

async function renderStatic() {
  const browser = await chromium.launch();
  for (const p of posts) {
    if (only && !p.id.startsWith(only)) continue;
    const d = dirOf(p);
    const theme = RUBRIC[p.rubric].theme;
    const cover = p.slides ? p.slides[0] : { theme, html: p.tile };
    // 3:4 tile: what the profile grid shows
    await shot(browser, doc(`<div class="tile ${cover.theme}">${cover.html}</div>`), join(d, 'tile.jpg'), 1080, 1440);
    if (p.slides) {
      for (const [i, s] of p.slides.entries()) {
        await shot(browser, doc(`<div class="frame ${s.theme}" style="width:1152px;height:1440px"><div class="tile ${s.theme}" style="left:36px;top:0">${s.html}</div></div>`),
          join(d, `slide-${String(i + 1).padStart(2, '0')}.jpg`), 1152, 1440, 0.9375);
      }
    } else {
      // 9:16 cover with the tile in the middle band the grid keeps
      await shot(browser, doc(`<div class="frame ${theme}" style="width:1080px;height:1920px"><div class="tile ${theme}" style="left:0;top:240px">${p.tile}</div></div>`),
        join(d, 'cover.jpg'), 1080, 1920);
    }
    const head = ['---', `post: ${p.n}`, `rubric: ${p.rubric}${p.no ? ` ${p.no}` : ''}`, `type: ${p.format}`, 'network: instagram', `ai_generated: ${p.ai}`,
      ...(p.alt ? [`alt: "${p.alt.replace(/"/g, '\\"')}"`] : []), '---'].join('\n');
    writeFileSync(join(d, 'caption.md'), `${head}\n${p.caption.trim()}\n`);
    writePlatforms(p, d);
    if (p.slides && packaging[p.id]?.tiktok?.photo) {
      // TikTok photo mode wants 9:16: the same composition on a tall frame of the slide's own colour
      mkdirSync(join(d, 'tiktok'), { recursive: true });
      for (const [i, s] of p.slides.entries()) {
        await shot(browser, doc(`<div class="frame ${s.theme}" style="width:1080px;height:1920px"><div class="tile ${s.theme}" style="left:0;top:200px">${s.html}</div></div>`),
          join(d, 'tiktok', `slide-${String(i + 1).padStart(2, '0')}.jpg`), 1080, 1920);
      }
    }
    console.log(p.id, p.slides ? `${p.slides.length} slides` : 'cover');
  }
  await browser.close();
}

// ------------------------------------------------------------------------------------------- reels
const W = 1080, H = 1920, FPS = 30;
const runtime = `
const SYNC = ${JSON.stringify(SYNC)};
const KIND = { pop: 'pop', slap: 'land', slide: 'slide', write: 'write' };   // entrance -> sound class
const tl = gsap.timeline({ paused: true });
const scenes = [...document.querySelectorAll('.scene')];
const clips = [], CUES = [], ACTS = {}, MARK = {};
function split(el) {
  const out = [];
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) n.textContent.split(/(\\s+)/).forEach((tok) => { if (!tok) return;
      if (/^\\s+$/.test(tok)) out.push(document.createTextNode(' '));
      else { const s = document.createElement('span'); s.className = 'w'; s.textContent = tok; out.push(s); } });
    else if (n.nodeName === 'BR') out.push(n.cloneNode());
    else { n.classList.add('w'); out.push(n); }
  });
  el.replaceChildren(...out);
}
const IN = {
  pop:    (el, at) => tl.from(el, { scale: 0, opacity: 0, duration: .5, ease: 'back.out(2.2)' }, at),
  slap:   (el, at) => tl.from(el, { y: 240, rotation: '+=14', scale: .82, opacity: 0, duration: .6, ease: 'back.out(1.5)' }, at),
  rise:   (el, at) => tl.from(el, { y: 50, opacity: 0, duration: .45, ease: 'power3.out' }, at),
  slide:  (el, at) => tl.from(el, { x: 420, opacity: 0, duration: .5, ease: 'back.out(1.4)' }, at),
  settle: (el, at) => tl.from(el, { scale: 1.07, duration: .55, ease: 'power2.out', transformOrigin: '0% 50%' }, at),
  write:  (el, at) => tl.fromTo(el, { clipPath: 'inset(-30% 105% -30% -5%)' }, { clipPath: 'inset(-30% -5% -30% -5%)', duration: .6, ease: 'power1.inOut' }, at),
  draw:   (el, at) => el.querySelectorAll('path').forEach((p, k) => { const L = p.getTotalLength(); p.style.strokeDasharray = L;
            tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: .35, ease: 'power1.inOut' }, at + k * .3); }),
  words:  (el, at) => { split(el); tl.from(el.querySelectorAll('.w'), { y: 70, opacity: 0, scale: .86, duration: .45, ease: 'back.out(2)', stagger: .08 }, at); },
  scroll: (el, at, dur) => tl.fromTo(el, { y: 0 }, { y: -(el.scrollHeight - el.parentElement.clientHeight) * .8, duration: dur, ease: 'none' }, at - (+el.dataset.at || 0)),
};
let t0 = 0;
scenes.forEach((sc, i) => {
  const dur = +sc.dataset.dur, name = 's' + (i + 1);
  ACTS[name] = { from: t0, dur };
  if (i > 0) tl.set(sc, { visibility: 'visible' }, t0);
  if (i > 0) { const [x, y] = (sc.dataset.wipe || '540,960').split(',');
    tl.fromTo(sc, { clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)' }, { clipPath: 'circle(2300px at ' + x + 'px ' + y + 'px)', duration: .55, ease: 'power2.inOut' }, t0);
    // the wipe is fastest halfway through: that is where an air sound peaks. Only scenes marked swish get one.
    CUES.push({ t: t0 + .275, kind: sc.dataset.swish ? 'whoosh' : 'cut', id: name + ':wipe', dur: .55, pan: +((x / 1080 - .5) * 2).toFixed(3), weight: 1 }); }
  let n = 0;
  sc.querySelectorAll('[data-in]').forEach((el) => {
    const type = el.dataset.in, at = +el.dataset.at || 0;
    const r = el.getBoundingClientRect();                      // measured before the entrance hides the element
    IN[type](el, t0 + at, dur);
    const kind = el.dataset.cue || KIND[type];
    if (!kind || kind === 'none') return;
    const t = t0 + at + (SYNC[type] || 0);                     // the frame the eye reads it
    const what = (el.getAttribute('class') || el.tagName.toLowerCase()).trim().split(/\\s+/).slice(0, 2).join('.');
    const e = { t, kind, id: name + ':' + kind + ':' + (n++) + ':' + what, pan: +(((r.left + r.width / 2) / 1080 - .5) * 2).toFixed(3),
      weight: +Math.min(1.6, Math.max(.6, Math.sqrt(r.width * r.height) / 450)).toFixed(2) };
    if (type === 'write') e.dur = .6;
    CUES.push(e);
    if (el.hasAttribute('data-reveal')) MARK.reveal = t;
    if (kind === 'logo') MARK.logo = t;
  });
  sc.querySelectorAll('[data-kb]').forEach((img) => tl.fromTo(img, { scale: 1 }, { scale: 1.1, duration: dur, ease: 'none' }, t0));
  sc.querySelectorAll('video[data-clip]').forEach((v) => clips.push({ v, start: t0 + (+v.dataset.at || 0), end: t0 + dur }));
  t0 += dur;
});
window.TOTAL = t0;
window.SOUND = { cues: CUES.sort((a, b) => a.t - b.t), acts: ACTS, mark: MARK };
window.seek = async (t) => {
  tl.seek(t, false);
  await Promise.all(clips.map(({ v, start, end }) => {
    if (t < start - 1 || t > end + .6) return 0;
    const target = Math.max(0, t - start);
    if (Math.abs(v.currentTime - target) < .001 && v.readyState >= 2) return 0;
    return new Promise((r) => { v.addEventListener('seeked', r, { once: true }); v.currentTime = target; });
  }));
};`;

const run = (cmd, args) => new Promise((res, rej) => spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] }).on('close', (c) => (c ? rej(new Error(`${cmd} exited ${c}`)) : res())));

async function renderReel(id, cuesOnly = false) {
  const p = byId(id);
  if (!p || !reels[p.id]) throw new Error(`no reel scenes for ${id}`);
  const scenes = reels[p.id].map((s) => ({ ...s, dur: s.dur ?? s.beats * B }));   // scenes are written in beats
  const d = dirOf(p);
  const tmpFiles = [];
  // Chromium here has no H.264: clips are cut to all-keyframe VP9 so every frame can be seeked exactly
  let k = 0;
  const prepared = [];
  for (const s of scenes) {
    let html = s.html;
    for (const m of [...html.matchAll(/<video data-clip data-src="([^"]+)" data-from="([\d.]+)"/g)]) {
      const webm = join(d, `.clip-${k++}.webm`);
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', m[2], '-t', String(s.dur + 1), '-i', resolve(repo, m[1]), '-an', '-vf', 'scale=720:-2',
        '-c:v', 'libvpx-vp9', '-b:v', '4M', '-deadline', 'realtime', '-cpu-used', '8', '-g', '1', webm]);
      html = html.replace(m[0], `<video data-clip src="${pathToFileURL(webm).href}"`);
      tmpFiles.push(webm);
    }
    prepared.push({ ...s, html });
  }
  const body = `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#141A33">${prepared.map((s) =>
    `<section class="tile reel scene ${s.theme}" data-dur="${s.dur}"${s.wipe ? ` data-wipe="${s.wipe}"` : ''}${s.swish ? ' data-swish="1"' : ''}>${s.html}</section>`).join('')}</div>
    <script src="${pathToFileURL(resolve(repo, 'social/engine/node_modules/gsap/dist/gsap.min.js')).href}"></script><script>${runtime}</script>`;
  const tmp = join(d, '.reel.html');
  writeFileSync(tmp, doc(body, `html,body{width:${W}px;height:${H}px;overflow:hidden;background:#141A33}.scene{height:${H}px}`));
  const browser = await chromium.launch();
  const pg = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
  pg.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => (v.readyState >= 2 ? 0 : new Promise((r) => v.addEventListener('loadeddata', r, { once: true }))))));
  const total = await pg.evaluate(() => window.TOTAL);
  const frames = Math.round(total * FPS);
  // the cue file (the real-sound skill's format): frames are fractional, exactly where the timeline puts them
  const snd = await pg.evaluate(() => window.SOUND);
  const fr = (t) => +(t * FPS).toFixed(3);
  const cueDir = join(here, 'sound', 'cues');
  mkdirSync(cueDir, { recursive: true });
  writeFileSync(join(cueDir, `${p.id}.json`), `${JSON.stringify({
    _doc: 'Written by render.mjs from the reel timeline. f = frame at 30 fps where the eye reads the event. Kinds: land (a card or character lands), pop (a label, badge or portrait pops in), slide (a row slides in), write (a handwritten note, dur frames), whoosh (a transition that gets an air sound), cut (a silent transition), logo (the stacked logo on the closing card).',
    fps: FPS, bpm: BPM, total: frames,
    acts: Object.fromEntries(Object.entries(snd.acts).map(([k, v]) => [k, { from: fr(v.from), dur: fr(v.dur) }])),
    cue: Object.fromEntries(Object.entries(snd.mark).map(([k, v]) => [k, fr(v)])),
    events: snd.cues.map(({ t, dur, ...e }) => ({ f: fr(t), ...e, ...(dur ? { dur: fr(dur) } : {}) })),
  }, null, 1)}\n`);
  if (cuesOnly) {
    await browser.close();
    unlinkSync(tmp);
    tmpFiles.forEach((f) => existsSync(f) && unlinkSync(f));
    console.log(`${p.id} · cues · ${snd.cues.length} events · ${total.toFixed(2)} s · ${(total / B).toFixed(0)} beats`);
    return;
  }
  const outFile = join(d, 'reel.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000', '-shortest',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-crf', '18', '-preset', 'medium', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error(`ffmpeg exited ${c}`)) : res())));
  for (let f = 0; f < frames; f++) {
    await pg.evaluate(async (t) => { await window.seek(t); }, f / FPS);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await browser.close();
  unlinkSync(tmp);
  tmpFiles.forEach((f) => existsSync(f) && unlinkSync(f));
  console.log(`${p.id} · ${frames} frames · ${total.toFixed(1)} s · ${scenes.length} scenes`);
}

if (mode === 'static') await renderStatic();
else if (mode === 'reel') await renderReel(only);
else if (mode === 'cues') await renderReel(only, true);
else { console.error('usage: render.mjs static [id] | reel <id> | cues <id>'); process.exit(1); }
