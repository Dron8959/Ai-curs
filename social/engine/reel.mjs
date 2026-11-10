#!/usr/bin/env node
// Renders a motion-graphics reel (reel.json) to a 1080×1920 MP4.
//
//   node social/engine/reel.mjs social/reels/01-paper-to-screen
//
// Each scene is HTML animated with a paused GSAP timeline. Playwright seeks the
// timeline frame by frame and pipes JPEG frames into ffmpeg, so the result is
// frame-exact and repeatable. Scene types and fields: social/engine/README.md.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { asset, esc, rich, sticker, sparkle, arrow, robo, astro, photo, baseCss, logoSrc, brandChip } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1920;

// Split a rich title into word spans so words can pop in one by one.
const words = (s) =>
  rich(s)
    .split(/(<br>)/)
    .map((part) => (part === '<br>' ? part : part.replace(/(<span class="[^"]+">)([\s\S]*?)(<\/span>)|([^\s<]+)/g, (m, o, inner, c, plain) =>
      o ? `${o}${inner.split(' ').map((w) => `<i class="w">${w}</i>`).join(' ')}${c}` : `<i class="w">${plain}</i>`)))
    .join('');

function scene(s, i) {
  const id = `s${i}`;
  const theme = s.theme === 'navy' ? 'navy' : 'paper';
  let inner = '';
  switch (s.type) {
    case 'hook':
      inner = `<div class="mid"><div class="kick-wrap">${s.kicker ? `<span class="kick">${esc(s.kicker)}</span>` : ''}</div>
        <h1 class="title big-t">${words(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>
        ${s.robo ? robo('pop', 'left:740px;top:1360px;width:240px') : ''}
        ${s.bubble ? `<span class="bubble r pop" style="left:560px;top:1220px">${rich(s.bubble)}</span>` : ''}`;
      break;
    case 'reveal':
      inner = `<div class="top-text">${s.title ? `<h2 class="title mid-t">${words(s.title)}</h2>` : ''}</div>
        <div class="stage">
          <div class="card a">${photo(s.before, { cls: 'fill' })}</div>
          <div class="card b">${photo(s.after, { cls: 'fill', tape: false })}</div>
          <span class="note lab-a" style="left:96px;top:440px;transform:rotate(-4deg)">${rich(s.beforeLabel || '')}</span>
          <span class="note y lab-b" style="left:560px;top:1440px;transform:rotate(3deg)">${rich(s.afterLabel || '')}</span>
          ${sparkle('burst', 'left:180px;top:500px')}${sparkle('burst sm', 'left:900px;top:560px')}${sparkle('burst', 'left:880px;top:1250px')}${sparkle('burst sm', 'left:140px;top:1260px')}
        </div>`;
      break;
    case 'photo':
      inner = `<div class="top-text">${s.kicker ? `<span class="kick">${esc(s.kicker)}</span>` : ''}${s.title ? `<h2 class="title mid-t">${words(s.title)}</h2>` : ''}</div>
        <div class="kb" style="${s.box || 'left:90px;right:90px;top:620px;height:980px'}">${photo(s.image, { cls: 'fill', pos: s.pos })}</div>
        ${(s.notes || [])
          .map((n) => `<span class="note ${n.gold ? 'y' : ''} draw-note" style="left:${n.x}px;top:${n.y}px;transform:rotate(${n.rot || -4}deg)">${rich(n.text)}</span>${n.arrow ? arrow(n.arrow.dir, n.gold ? 'y draw' : 'draw', `left:${n.arrow.x}px;top:${n.arrow.y}px;width:${n.arrow.w || 150}px;height:${(n.arrow.w || 150) * 0.87}px`) : ''}`)
          .join('')}
        ${(s.stickers || []).map((t) => sticker(t.name, 'pop', `left:${t.x}px;top:${t.y}px`)).join('')}`;
      break;
    case 'clip':
      inner = `<div class="top-text">${s.kicker ? `<span class="kick">${esc(s.kicker)}</span>` : ''}${s.title ? `<h2 class="title mid-t">${words(s.title)}</h2>` : ''}</div>
        <div class="kb" style="${s.box || 'left:90px;right:90px;top:620px;height:980px'}"><figure class="pic fill"><video class="clipv" muted playsinline preload="auto" src="${s._webm}" data-from="${s.from || 0}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${s.pos || 'center'}"></video></figure></div>
        ${(s.notes || [])
          .map((n) => `<span class="note ${n.gold ? 'y' : ''} draw-note" style="left:${n.x}px;top:${n.y}px;transform:rotate(${n.rot || -4}deg)">${rich(n.text)}</span>`)
          .join('')}
        ${(s.stickers || []).map((t) => sticker(t.name, 'pop', `left:${t.x}px;top:${t.y}px`)).join('')}`;
      break;
    case 'list':
      inner = `<div class="top-text">${s.kicker ? `<span class="kick">${esc(s.kicker)}</span>` : ''}<h2 class="title mid-t">${words(s.title)}</h2></div>
        <ol class="items">${s.items.map((it) => `<li class="item">${sticker(it.icon, 'inline')}<span>${rich(it.text)}</span></li>`).join('')}</ol>
        ${s.robo ? robo('pop', 'left:800px;top:1440px;width:200px') : ''}`;
      break;
    case 'stat':
      inner = `<div class="mid">${s.kicker ? `<div class="kick-wrap"><span class="kick">${esc(s.kicker)}</span></div>` : ''}
        <div class="count" data-to="${s.to}">${esc(s.value)}</div><h2 class="title mid-t">${words(s.title)}</h2>${s.source ? `<p class="source">${esc(s.source)}</p>` : ''}</div>`;
      break;
    case 'cta':
      inner = `
        <div class="mid up"><h2 class="title mid-t">${words(s.title)}</h2>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}
        <div class="btns">${(s.buttons || []).map((b) => `<span class="btn pop">${esc(b)}</span>`).join('')}</div>
        <div class="handle pop"><img src="${asset(logoSrc())}" alt="">makeshowlab.com</div><div class="site pop">@make_showlab</div></div>
        ${robo('pop', 'left:390px;top:1200px;width:300px')}`;
      break;
    default:
      throw new Error(`Unknown scene type: ${s.type}`);
  }
  return `<section class="scene ${theme} planet t-${s.type}" id="${id}">${s.astro ? astro('pop', s.astro) : ''}${inner}
    ${(s.deco || []).map((d) => (d.kind === 'sparkle' ? sparkle(`tw ${d.white ? 'w' : ''}`, `left:${d.x}px;top:${d.y}px`) : sticker(d.name, 'pop float', `left:${d.x}px;top:${d.y}px`))).join('')}
  </section>`;
}

function html(spec) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss()}
html,body{width:${W}px;height:${H}px;background:#02040D}
.scene{position:absolute;inset:0;overflow:hidden;opacity:0;isolation:isolate}
.mid{position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:36px}
.mid.up{bottom:860px}
.t-hook .mid{bottom:520px}
.top-text{position:absolute;left:90px;right:90px;top:250px;display:flex;flex-direction:column;gap:26px;align-items:flex-start}
.big-t{font-size:118px;line-height:.95}.mid-t{font-size:92px;line-height:.96}
.title .w{display:inline-block;font-style:normal;transform-origin:50% 80%}
.title .w{white-space:nowrap}
.title .swipe{background:none;filter:none;color:inherit;padding:0}
.title .swipe .w{background:linear-gradient(180deg,#FFD08A 0%,#FF8A3D 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 .18em rgba(255,138,61,.55));padding-right:.06em}
.sub{font-size:44px;line-height:1.3;color:var(--muted);font-weight:500}
.kick-wrap{min-height:10px}
.stage{position:absolute;inset:0}
.card{position:absolute;width:560px;height:840px;top:540px}
.astro{z-index:1}
.card.a{left:90px;transform:rotate(-5deg)}
.card.b{left:430px;transform:rotate(4deg)}
.kb{position:absolute;overflow:visible}
.kb .pic{height:100%}
.items{position:absolute;left:90px;right:90px;top:680px;list-style:none;display:flex;flex-direction:column;gap:40px}
.item{display:flex;align-items:center;gap:30px;font-size:56px;line-height:1.15;font-weight:700;color:#fff;background:rgba(17,26,58,.9);border-radius:36px;padding:28px 36px 28px 28px;box-shadow:inset 0 0 0 1px var(--line)}
.sticker.inline{position:static;flex:none}
.count{font-family:Archivo;font-style:italic;font-weight:900;font-stretch:94%;font-size:300px;line-height:.85;background:linear-gradient(180deg,#FFD08A,#FF8A3D);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(255,138,61,.5))}
.source{font-size:30px;color:var(--muted2)}
.btns{display:flex;flex-direction:column;gap:20px;align-items:flex-start}
.btn{display:inline-flex;align-items:center;min-height:110px;padding:0 54px;border-radius:999px;color:#1A0A02;background:linear-gradient(180deg,#FFD08A,#FF8A3D);font-weight:800;font-size:40px;box-shadow:0 14px 44px rgba(255,138,61,.45)}
.handle{display:flex;align-items:center;gap:18px;font-weight:900;font-style:italic;font-size:48px;color:#fff;font-family:Archivo;text-transform:uppercase}
.handle img{width:84px;height:84px}
.site{font-size:36px;font-weight:600;color:var(--muted)}
.note{font-size:34px}
.arrow{stroke-width:8}
.bubble{font-size:44px}
.brandbar{position:absolute;z-index:20;top:110px;left:90px;opacity:.95}
</style><script src="${pathToFileURL(resolve(here, 'node_modules/gsap/dist/gsap.min.js')).href}"></script></head><body>
${spec.scenes.map(scene).join('')}
<div class="brandbar">${brandChip()}</div>
<script>
const scenes = ${JSON.stringify(spec.scenes.map((s) => ({ type: s.type, dur: s.dur })))};
const tl = gsap.timeline({ paused: true });
let t0 = 0;
const starts = [];
scenes.forEach((s, i) => {
  const el = document.getElementById('s' + i);
  const q = (sel) => el.querySelectorAll(sel);
  const at = (d) => t0 + d;
  tl.set(el, { opacity: 1 }, at(0));
  if (i > 0) tl.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(80% at 50% 50%)', duration: .45, ease: 'power2.inOut' }, at(0));
  // Words pop in, highlights swipe across after them.
  tl.from(q('.title .w'), { y: 70, opacity: 0, scale: .85, duration: .5, ease: 'back.out(2)', stagger: .07 }, at(.25));
  tl.from(q('.swipe .w'), { scale: 1.25, duration: .5, ease: 'back.out(3)', stagger: .05 }, at(.25 + q('.title .w').length * .07));
  tl.from(q('.kick'), { scale: 0, rotation: -14, duration: .4, ease: 'back.out(2.4)' }, at(.1));
  tl.from(q('.sub'), { y: 30, opacity: 0, duration: .45 }, at(.9));
  tl.from(q('.pop'), { scale: 0, opacity: 0, duration: .55, ease: 'back.out(2)', stagger: .12 }, at(.8));
  tl.from(q('.float'), { y: 30, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(s.dur / 1.6) - 1) }, at(.2));
  q('.sparkle.tw').forEach((sp, k) => tl.fromTo(sp, { scale: .3, rotation: 0 }, { scale: 1, rotation: 90, duration: .9, ease: 'sine.inOut', yoyo: true, repeat: Math.max(1, Math.floor(s.dur / .9) - 1) }, at(.1 * k)));
  // Logo badge: a little bounce and wiggle.
  q('.robo').forEach((r) => {
    tl.to(r, { rotation: 8, duration: .22, yoyo: true, repeat: 5, ease: 'sine.inOut' }, at(1.2));
    tl.to(r, { y: -24, duration: .3, yoyo: true, repeat: 1, ease: 'power1.out' }, at(Math.min(s.dur - .8, 2.4)));
  });
  if (s.type === 'reveal') {
    const a = el.querySelector('.card.a'), b = el.querySelector('.card.b');
    tl.from(a, { x: -700, rotation: -20, duration: .7, ease: 'power3.out' }, at(.2));
    tl.from(q('.lab-a'), { opacity: 0, y: 20, duration: .4 }, at(.8));
    tl.from(b, { scale: .2, opacity: 0, rotation: 20, duration: .8, ease: 'back.out(1.6)' }, at(s.dur * .45));
    tl.to(a, { x: -60, scale: .9, duration: .8, ease: 'power2.out' }, at(s.dur * .45));
    tl.from(q('.burst'), { scale: 0, rotation: -90, duration: .6, ease: 'back.out(3)', stagger: .08 }, at(s.dur * .45 + .4));
    tl.from(q('.lab-b'), { opacity: 0, y: 20, duration: .4 }, at(s.dur * .45 + .6));
  }
  if (s.type === 'photo') {
    tl.from(el.querySelector('.kb'), { y: 120, opacity: 0, rotation: -6, duration: .7, ease: 'power3.out' }, at(.3));
    tl.fromTo(el.querySelector('.kb img'), { scale: 1.0 }, { scale: 1.1, duration: s.dur, ease: 'none' }, at(0));
    q('.draw-note').forEach((n, k) => tl.from(n, { opacity: 0, scale: .6, duration: .4, ease: 'back.out(2)' }, at(1.2 + k * .7)));
    q('.arrow.draw path').forEach((p, k) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: .5, ease: 'power1.inOut' }, at(1.4 + Math.floor(k / 2) * .7 + (k % 2) * .4));
    });
  }
  if (s.type === 'clip') {
    tl.from(el.querySelector('.kb'), { y: 120, opacity: 0, rotation: -6, duration: .7, ease: 'power3.out' }, at(.3));
    q('.draw-note').forEach((n, k) => tl.from(n, { opacity: 0, scale: .6, duration: .4, ease: 'back.out(2)' }, at(1.2 + k * .7)));
  }
  if (s.type === 'list') {
    const items = q('.item');
    const gap = Math.max(.5, (s.dur - 1.8) / items.length);
    items.forEach((it, k) => {
      tl.from(it, { x: 600, opacity: 0, duration: .5, ease: 'back.out(1.6)' }, at(1 + k * gap));
      tl.from(it.querySelector('.sticker'), { scale: 0, rotation: -40, duration: .5, ease: 'back.out(3)' }, at(1.15 + k * gap));
    });
  }
  if (s.type === 'stat') {
    const c = el.querySelector('.count'); const to = +c.dataset.to; const fmt = c.textContent; const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: to, duration: 1.2, ease: 'power2.out', onUpdate: () => { c.textContent = fmt.replace(/\\d+/, Math.round(o.v)); } }, at(.2));
    tl.from(c, { scale: .6, duration: 1.2, ease: 'elastic.out(1,.5)' }, at(.2));
  }
  if (s.type === 'cta') {
    tl.to(q('.btn'), { scale: 1.06, duration: .45, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at(2));
  }
  starts.push(t0);
  t0 += s.dur;
});
window.TOTAL = t0;
window.seek = async (t) => {
  tl.seek(t, false);
  const waits = [];
  scenes.forEach((s, i) => {
    if (s.type !== 'clip') return;
    const local = t - starts[i];
    if (local < 0 || local > s.dur) return;
    const v = document.querySelector('#s' + i + ' video');
    const target = +v.dataset.from + local;
    if (Math.abs(v.currentTime - target) < 0.001 && v.readyState >= 2) return;
    waits.push(new Promise((r) => { v.addEventListener('seeked', r, { once: true }); v.currentTime = target; }));
  });
  await Promise.all(waits);
};
</script></body></html>`;
}

async function main() {
  const dir = resolve(process.argv[2] || '.');
  const spec = JSON.parse(readFileSync(join(dir, 'reel.json'), 'utf8'));
  const fps = spec.fps || 30;
  const tmpFiles = [];
  for (const [k, s] of spec.scenes.entries()) {
    if (s.type !== 'clip') continue;
    const src = resolve(here, '../..', s.video);
    const webm = join(dir, `.clip-${k}.webm`);
    await new Promise((res, rej) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(s.from || 0), '-t', String(s.dur + 1), '-i', src,
      '-an', '-vf', 'scale=1080:-2', '-c:v', 'libvpx-vp9', '-b:v', '4M', '-deadline', 'realtime', '-cpu-used', '8', '-g', '1', webm], { stdio: 'inherit' })
      .on('close', (c) => (c ? rej(new Error('clip transcode failed')) : res())));
    s._webm = pathToFileURL(webm).href; s.from = 0; tmpFiles.push(webm);
  }
  const tmp = join(dir, '.reel.html');
  writeFileSync(tmp, html(spec));
  const browser = await chromium.launch();
  const pg = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
  pg.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => (v.readyState >= 2 ? 0 : new Promise((r) => v.addEventListener('loadeddata', r, { once: true }))))));
  const total = await pg.evaluate(() => window.TOTAL);
  const frames = Math.round(total * fps);
  const out = join(dir, 'reel.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-crf', '19', '-preset', 'medium', '-r', String(fps),
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error(`ffmpeg exited ${c}`)) : res())));
  for (let f = 0; f < frames; f++) {
    await pg.evaluate(async (t) => { await window.seek(t); }, f / fps);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (spec.covers?.includes(f / fps) || f === Math.round((spec.coverAt ?? 2) * fps)) writeFileSync(join(dir, 'cover.jpg'), buf);
  }
  ff.stdin.end();
  await done;
  await browser.close();
  unlinkSync(tmp);
  tmpFiles.forEach((f) => unlinkSync(f));
  console.log(`${out} · ${frames} frames · ${total.toFixed(1)}s`);
}

main().catch((e) => { console.error(e); process.exit(1); });
