#!/usr/bin/env node
// One post as it will look in the Threads feed on a phone, for the owner's one-by-one review.
// A mock-up drawn in code, not a screenshot of the real app.
//
//   node social/concept/threads-preview.mjs <number 1-15 | post id>
//     -> text/threads/review/NN-<id>.png  (the phone, card at its last frame)
//     -> text/threads/review/NN-<id>.mp4  (the phone with the card playing, 7 s)

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, unlinkSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { spawnSync, spawn } from 'node:child_process';
import { here, repo } from './kit.mjs';
import { posts, SLOTS } from './threads-v2.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const arg = process.argv[2];
const idx = /^\d+$/.test(arg || '') ? +arg - 1 : posts.findIndex((p) => p.id === arg);
const p = posts[idx];
if (!p) { console.error('usage: threads-preview.mjs <1-15 | post id>'); process.exit(1); }
const NN = String(idx + 1).padStart(2, '0');
const CARDS = join(here, 'text', 'threads');
const OUT = join(CARDS, 'review');
mkdirSync(OUT, { recursive: true });

const ic = (n, s = 22) => readFileSync(join(here, 'node_modules/lucide-static/icons', `${n}.svg`), 'utf8')
  .replace(/width="24"/, `width="${s}"`).replace(/height="24"/, `height="${s}"`).replace(/stroke-width="2"/, 'stroke-width="1.8"');
const AVATAR = pathToFileURL(join(repo, 'social/brand/logo/avatar/avatar-1080.png')).href;
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
const text = esc(p.text).replace(/(https:\/\/[^\s<]+)/, '<span class="url">makeshowlab.com</span>');

const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#E9E6DF;font-family:Helvetica,Arial,'Liberation Sans',sans-serif;color:#101010;padding:24px}
.phone{width:480px;background:#fff;border-radius:44px;border:10px solid #141A33;overflow:hidden;position:relative}
.status{height:34px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;font-size:14px;font-weight:700}
.top{display:flex;justify-content:center;padding:6px 0 0}
.feed{display:flex;border-bottom:1px solid #E6E6E6;margin-top:6px}.feed span{flex:1;text-align:center;padding:11px 0;font-size:15px;font-weight:700;color:#9A9A9A}.feed .on{color:#101010;border-bottom:2px solid #101010}
.post{display:flex;gap:12px;padding:16px 18px 6px;border-bottom:1px solid #E6E6E6}
.av{width:42px;height:42px;border-radius:50%;border:1px solid #E0E0E0;flex:none;object-fit:cover}
.body{flex:1;min-width:0}
.head{display:flex;align-items:center;gap:7px;font-size:15px}.head b{font-weight:700}.topic{color:#8A8A8A}.when{color:#9A9A9A;margin-left:auto}.dots{color:#6B6B6B;display:flex}
.txt{margin-top:5px;font-size:15.5px;line-height:1.38}.url{color:#2B6BE6}
#card{display:block;width:100%;margin-top:12px;border-radius:12px;border:1px solid #E0E0E0}
.acts{display:flex;gap:22px;padding:12px 2px 10px}
.ghost{padding:16px 18px;display:flex;gap:12px;opacity:.35}.ghost i{display:block;height:12px;border-radius:6px;background:#D9D9D9;margin-top:9px}
.nav{height:66px;border-top:1px solid #E6E6E6;display:flex;justify-content:space-around;align-items:center;color:#9A9A9A}
.nav .plus{background:#F2F2F2;border-radius:12px;width:54px;height:40px;display:flex;align-items:center;justify-content:center;color:#555}.nav .home{color:#101010}
</style>
<div class="phone">
  <div class="status"><span>9:41</span><span>5G</span></div>
  <div class="top">${ic('at-sign', 30)}</div>
  <div class="feed"><span class="on">For you</span><span>Following</span></div>
  <div class="post">
    <img class="av" src="${AVATAR}">
    <div class="body">
      <div class="head"><b>make_showlab</b><span class="topic">› ${p.topic}</span><span class="when">now</span><span class="dots">${ic('ellipsis', 20)}</span></div>
      <div class="txt">${text}</div>
      ${p.media ? `<img id="card" src="${pathToFileURL(join(CARDS, `${p.media}.jpg`)).href}">` : ''}
      <div class="acts"><span>${ic('heart')}</span><span>${ic('message-circle')}</span><span>${ic('repeat-2')}</span><span>${ic('send')}</span></div>
    </div>
  </div>
  <div class="ghost"><div style="width:42px;height:42px;border-radius:50%;background:#D9D9D9;flex:none"></div><div style="flex:1"><i style="width:40%"></i><i style="width:95%"></i><i style="width:70%"></i></div></div>
  <div class="nav"><span class="home">${ic('house', 26)}</span><span>${ic('search', 26)}</span><span class="plus">${ic('plus', 22)}</span><span>${ic('heart', 26)}</span><span>${ic('user-round', 26)}</span></div>
</div>`;

const tmp = join(OUT, `.${NN}.html`);
writeFileSync(tmp, html);
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 528, height: 1400 }, deviceScaleFactor: 2 })).newPage();
await pg.goto(pathToFileURL(tmp).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(200);
const phone = await pg.$('.phone');
const base = join(OUT, `${NN}-${p.id}`);
await phone.screenshot({ path: `${base}.png` });

if (p.media) {
  // the same phone, the card playing frame by frame
  const dir = mkdtempSync(join(tmpdir(), 'tp-'));
  spawnSync('ffmpeg', ['-loglevel', 'error', '-i', join(CARDS, `${p.media}.mp4`), '-q:v', '3', join(dir, '%04d.jpg')]);
  const frames = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
  const box = await phone.boundingBox();
  const w = Math.round(box.width * 2) & ~1, h = Math.round(box.height * 2) & ~1;
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-vf', `scale=${w}:${h}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', `${base}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res) => ff.on('close', res));
  for (const f of frames) {
    await pg.evaluate(async (src) => { const im = document.getElementById('card'); im.src = src; await im.decode(); }, pathToFileURL(join(dir, f)).href);
    const buf = await phone.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  rmSync(dir, { recursive: true, force: true });
}
await browser.close();
unlinkSync(tmp);
console.log(`${NN}-${p.id} · day ${p.day} ${SLOTS[p.slot]} · ${p.media ? 'png + mp4' : 'png'}`);
