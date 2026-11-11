#!/usr/bin/env node
// Threads visuals: motion-graphics cards drawn in code. No photos of Anna or Kamilla, nothing from inside
// the course: only brand colours, type and shapes.
//
//   node social/concept/threads-cards.mjs [id]   -> text/threads/<id>.mp4 (7 s, 1080x1350, silent) + <id>.jpg (last frame)
//
// Each card is an HTML scene driven by a paused GSAP timeline. Every frame is seeked, screenshotted and
// piped into ffmpeg, so the video is frame-exact and repeatable. The still is the final frame.

import { createRequire } from 'node:module';
import { writeFileSync, unlinkSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { css, here, repo } from './kit.mjs';
import { posts } from './text.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const W = 1080, H = 1350, FPS = 30, DUR = 7;
const OUT = join(here, 'text', 'threads');
const icon = (n, size = 64, stroke = 2.4) => readFileSync(join(here, 'node_modules/lucide-static/icons', `${n}.svg`), 'utf8')
  .replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`).replace(/stroke-width="2"/, `stroke-width="${stroke}"`);
const LOGO = pathToFileURL(resolve(repo, 'social/brand/logo/logo/icon-small.svg')).href;
const GSAP = pathToFileURL(resolve(repo, 'social/engine/node_modules/gsap/dist/gsap.min.js')).href;

const style = `
html,body{width:${W}px;height:${H}px;overflow:hidden}
.tile{height:${H}px}
.chip{font-size:34px;height:72px;line-height:60px}
.hl{position:absolute;z-index:8;left:64px;right:64px;top:170px;font:800 104px/.98 Sora;letter-spacing:-.05em;color:var(--ink)}
.hl mark{display:inline-block;background:var(--mark);color:var(--markink);border-radius:20px;padding:.02em .14em .08em;transform:rotate(-1.4deg)}
.stage{position:absolute;left:64px;right:64px;top:560px;height:620px}
.box{position:absolute;border:6px solid var(--line);border-radius:32px;background:var(--card);box-shadow:12px 12px 0 var(--sh);color:#141A33;overflow:hidden}
.lab{font:800 30px Urbanist;letter-spacing:.12em;text-transform:uppercase}
.big{font:800 64px Sora;letter-spacing:-.04em}
.bub{position:absolute;padding:18px 26px;border:5px solid #141A33;border-radius:28px;font:700 34px/1.15 Urbanist;background:#fff;color:#141A33;white-space:nowrap}
.foot{bottom:50px}
.foot img{width:64px;height:64px}
.foot b{font:800 32px Sora;letter-spacing:-.03em;color:var(--ink)}
svg{display:block}
`;

const chip = (t) => `<div class="top"><span class="chip">${t}</span></div>`;
const foot = `<div class="foot"><img src="${LOGO}"><b>makeshowlab.com</b></div>`;

// ------------------------------------------------------------------------------------------ the cards
const cards = {
  // Same minutes, two screens: one scrolls forever, one builds something.
  '01-reason-to-show': { theme: 'y', chip: 'Unpopular opinion',
    hl: `Same minutes.<br><mark>Not the same</mark><br>screen.`,
    stage: `
      <div class="box" id="clock" style="left:316px;top:0;width:320px;height:110px;display:flex;align-items:center;justify-content:center;gap:14px;background:#141A33;color:#FFF4DC">${icon('timer', 52).replace('currentColor', '#FFC533')}<span class="big" id="min" style="color:#FFF4DC">0 min</span></div>
      <div class="box" id="s1" style="left:0;top:160px;width:430px;height:440px">
        <div class="lab" style="position:absolute;left:28px;top:22px">Scrolled</div>
        <div style="position:absolute;left:28px;right:28px;top:80px;bottom:24px;overflow:hidden"><div id="feed">${Array.from({ length: 14 }, (_, i) => `<div style="height:58px;margin-bottom:18px;border-radius:14px;background:${['#FFD98A', '#E9E2CF', '#FFB8A6'][i % 3]}"></div>`).join('')}</div></div>
      </div>
      <div class="box" id="s2" style="left:522px;top:160px;width:430px;height:440px">
        <div class="lab" style="position:absolute;left:28px;top:22px">Made</div>
        <div style="position:absolute;left:65px;top:110px;width:300px;height:300px">
          ${[[0, 200, '#FF6F4A'], [100, 200, '#5FE0A8'], [200, 200, '#FFC533'], [0, 100, '#5FE0A8'], [100, 100, '#141A33'], [200, 100, '#FF6F4A'], [100, 0, '#FFC533']]
            .map(([x, y, c], i) => `<div class="blk" style="position:absolute;left:${x}px;top:${y}px;width:96px;height:96px;border:5px solid #141A33;border-radius:16px;background:${c}" data-i="${i}"></div>`).join('')}
        </div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('#clock',{scale:.4,opacity:0,duration:.45,ease:'back.out(2.4)'},.4)
        .from('#s1',{x:-80,opacity:0,duration:.5,ease:'power3.out'},.6)
        .from('#s2',{x:80,opacity:0,duration:.5,ease:'power3.out'},.75)
        .to('#feed',{y:-560,duration:5.4,ease:'none'},1.1)
        .from('.blk',{y:-420,opacity:0,duration:.5,ease:'bounce.out',stagger:.55},1.3);
      const m={v:0};
      tl.to(m,{v:45,duration:4.6,ease:'none',onUpdate(){document.getElementById('min').textContent=Math.round(m.v)+' min'}},1.1);
      tl.from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45);` },

  // Kid A gets an answer. Kid B gets a game. Which one would you stop?
  '02-answer-machine': { theme: 'c', chip: 'You decide',
    hl: `Same app.<br>Which kid would<br><mark>you stop?</mark>`,
    stage: `
      <div class="box" id="a" style="left:0;top:0;width:430px;height:600px">
        <div class="lab" style="position:absolute;left:28px;top:22px">Kid A</div>
        <div class="bub" id="a1" style="left:24px;top:90px;background:#FFF4DC">What's the<br>answer to #4?</div>
        <div class="bub" id="a2" style="right:24px;top:270px;background:#141A33;color:#FFF4DC;font:800 64px Sora">42</div>
        <div class="lab" id="a3" style="position:absolute;left:28px;bottom:28px;opacity:.55">done. next.</div>
      </div>
      <div class="box" id="b" style="left:522px;top:0;width:430px;height:600px">
        <div class="lab" style="position:absolute;left:28px;top:22px">Kid B</div>
        <div class="bub" id="b1" style="left:24px;top:90px;background:#FFF4DC">My game:<br>a dog who flies</div>
        <div id="b2" style="position:absolute;left:40px;right:40px;top:260px;height:220px;border:5px solid #141A33;border-radius:20px;background:#BFE9FF;overflow:hidden">
          <div style="position:absolute;left:0;right:0;bottom:0;height:46px;background:#5FE0A8;border-top:5px solid #141A33"></div>
          <div id="dog" style="position:absolute;left:30px;top:80px;width:84px;height:56px;border:5px solid #141A33;border-radius:22px;background:#FFC533"><div style="position:absolute;right:-26px;top:-18px;width:40px;height:40px;border:5px solid #141A33;border-radius:50%;background:#FFC533"></div></div>
          ${[0, 1, 2].map((i) => `<div class="coin" style="position:absolute;left:${150 + i * 70}px;top:${50 + (i % 2) * 40}px;width:34px;height:34px;border:5px solid #141A33;border-radius:50%;background:#FF6F4A"></div>`).join('')}
        </div>
        <div class="lab" id="b3" style="position:absolute;left:28px;bottom:28px">her idea. playable.</div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('#a',{y:80,opacity:0,duration:.5,ease:'power3.out'},.4)
        .from('#b',{y:80,opacity:0,duration:.5,ease:'power3.out'},.55)
        .from('#a1',{scale:0,transformOrigin:'0 0',duration:.35,ease:'back.out(2.5)'},1.1)
        .from('#b1',{scale:0,transformOrigin:'0 0',duration:.35,ease:'back.out(2.5)'},1.4)
        .from('#a2',{scale:0,transformOrigin:'100% 0',duration:.35,ease:'back.out(2.5)'},2.0)
        .from('#a3',{opacity:0,duration:.3},2.5)
        .from('#b2',{scaleY:0,transformOrigin:'50% 0',duration:.45,ease:'power3.out'},2.2)
        .to('#dog',{x:230,y:-40,duration:2.4,ease:'sine.inOut'},2.8)
        .to('.coin',{scale:0,duration:.2,stagger:.6},3.4)
        .from('#b3',{opacity:0,duration:.3},3.2)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45);` },

  // Three switches flip off. The account card does not.
  '03-rule-one': { theme: 'n', chip: 'Unpopular opinion',
    hl: `Settings <mark>switch off.</mark><br>Ownership<br>doesn't.`, hlSize: 90,
    stage: `
      ${['Time limit', 'Safe search', 'Content filter'].map((t, i) => `
      <div class="box sw" style="left:0;top:${i * 150}px;width:560px;height:120px;display:flex;align-items:center;justify-content:space-between;padding:0 30px">
        <span class="lab" style="letter-spacing:.06em">${t}</span>
        <div style="position:relative;width:120px;height:64px;border:5px solid #141A33;border-radius:999px;background:#5FE0A8" class="tr" data-i="${i}">
          <div class="knob" style="position:absolute;top:4px;left:60px;width:46px;height:46px;border:5px solid #141A33;border-radius:50%;background:#fff"></div>
        </div>
      </div>`).join('')}
      <div class="box" id="own" style="left:600px;top:40px;width:352px;height:440px;background:#FFC533;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;transform:rotate(3deg)">
        ${icon('key-round', 130, 2.6).replace('currentColor', '#141A33')}
        <div class="lab" style="text-align:center;line-height:1.3">Account<br>owner</div>
        <div class="big" style="font-size:58px">Parent</div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.sw',{x:-100,opacity:0,duration:.45,ease:'power3.out',stagger:.15},.4);
      document.querySelectorAll('.tr').forEach((el,i)=>{
        tl.to(el.querySelector('.knob'),{left:4,duration:.22,ease:'power2.in'},1.8+i*.7)
          .to(el,{backgroundColor:'#B9C0DE',duration:.22},1.8+i*.7);
      });
      tl.from('#own',{x:520,rotation:14,duration:.55,ease:'back.out(1.6)'},4.1)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45);` },

  // Lesson drafts on a strip. Attention drops on two of them and they get cut.
  '04-kitchen-table': { theme: 'm', chip: 'Unpopular opinion',
    hl: `If it loses a<br>10-year-old,<br><mark>cut it.</mark>`,
    stage: `
      <div class="box" style="left:0;top:0;width:952px;height:600px;padding:40px 40px 0">
        <div class="lab" style="margin-bottom:24px">Attention, 10-year-old test</div>
        ${[0.9, 0.35, 0.8, 0.95, 0.25].map((v, i) => `
        <div class="row" data-v="${v}" style="position:relative;display:flex;align-items:center;gap:24px;height:80px;margin-bottom:16px">
          <div style="width:150px;font:800 30px Urbanist">Draft ${i + 1}</div>
          <div style="flex:1;height:44px;border:5px solid #141A33;border-radius:999px;background:#F1F5F2;overflow:hidden"><div class="bar" style="height:100%;width:${v * 100}%;background:${v > .5 ? '#5FE0A8' : '#FF6F4A'};border-right:5px solid #141A33"></div></div>
          ${v < .5 ? `<div class="cut" style="position:absolute;left:-20px;right:-20px;top:36px;border-top:6px dashed #141A33"></div><div class="sc" style="position:absolute;left:-30px;top:6px">${icon('scissors', 64, 2.6)}</div>` : ''}
        </div>`).join('')}
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.row',{opacity:0,x:-40,duration:.35,stagger:.12},.5)
        .from('.bar',{width:0,duration:1.1,ease:'power2.out',stagger:.15},1.0);
      const bad=[...document.querySelectorAll('.row')].filter(r=>+r.dataset.v<.5);
      bad.forEach((r,i)=>{const t=3.0+i*1.0;
        tl.from(r.querySelector('.cut'),{scaleX:0,transformOrigin:'0 50%',duration:.5,ease:'none'},t)
          .fromTo(r.querySelector('.sc'),{x:0,opacity:0},{x:900,opacity:1,duration:.5,ease:'none',immediateRender:true},t)
          .to(r,{y:180,rotation:i?-8:8,opacity:0,duration:.5,ease:'power2.in'},t+.55).to(r,{height:0,marginBottom:0,duration:.35,ease:'power2.inOut'},t+1.0);});
      tl.from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45);` },

  // The loop that keeps the thinking with the child: decide, tell, check, fix.
  '05-will-ai-think': { theme: 'k', chip: 'Unpopular opinion',
    hl: `The thinking<br><mark>stays</mark> with<br>the child.`,
    stage: `
      <svg id="ring" style="position:absolute;left:186px;top:0" width="580" height="580" viewBox="0 0 580 580"><circle id="arc" cx="290" cy="290" r="230" fill="none" stroke="#141A33" stroke-width="8" stroke-dasharray="1445" stroke-dashoffset="1445" stroke-linecap="round"/></svg>
      <div class="box" id="kid" style="left:346px;top:160px;width:260px;height:260px;border-radius:50%;background:#FFC533;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px">${icon('lightbulb', 96, 2.6)}<span class="lab">the kid</span></div>
      ${[['Decides', 476, -50, '#FF6F4A'], ['Tells the AI', 780, 245, '#5FE0A8'], ['Checks', 476, 540, '#FFFFFF'], ['Fixes', 172, 245, '#5FE0A8']].map(([t, x, y, c]) =>
        `<div class="step bub" style="left:${x}px;top:${y}px;transform:translate(-50%,0);background:${c};font:800 36px Urbanist;box-shadow:8px 8px 0 #141A33">${t}</div>`).join('')}
      <div id="dot" style="position:absolute;left:452px;top:-26px;width:48px;height:48px;border:6px solid #141A33;border-radius:50%;background:#FF6F4A"></div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('#kid',{scale:0,duration:.5,ease:'back.out(2.2)'},.4)
        .from('.step',{scale:0,duration:.35,ease:'back.out(2.6)',stagger:.75},1.0)
        .to('#arc',{strokeDashoffset:0,duration:3.2,ease:'none'},1.0);
      const d={a:0};
      tl.to(d,{a:Math.PI*2*1.4,duration:5.2,ease:'none',onUpdate(){const a=d.a-Math.PI/2;
        const el=document.getElementById('dot');el.style.left=(186+290+230*Math.cos(a)-24)+'px';el.style.top=(290+230*Math.sin(a)-24)+'px';}},1.0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45);` },
};

// ------------------------------------------------------------------------------------------ render
const run = (cmd, args) => new Promise((res, rej) => spawn(cmd, args, { stdio: 'inherit' }).on('close', (c) => (c ? rej(new Error(`${cmd} ${c}`)) : res())));

async function render(browser, id) {
  const c = cards[id];
  if (!posts.find((p) => p.id === id)) throw new Error(`${id}: not a post in text.mjs`);
  const html = `<!doctype html><meta charset="utf-8"><style>${css()}${style}</style>
    <div class="tile ${c.theme}">${chip(c.chip)}<div class="hl"${c.hlSize ? ` style="font-size:${c.hlSize}px"` : ''}>${c.hl}</div><div class="stage">${c.stage}</div>${foot}</div>
    <script src="${GSAP}"></script>
    <script>const tl=gsap.timeline({paused:true});${c.tl}
      tl.to({}, {duration:0}, ${DUR});
      window.seek=(t)=>{tl.seek(t,false)};</script>`;
  mkdirSync(OUT, { recursive: true });
  const tmp = join(OUT, `.${id}.html`);
  writeFileSync(tmp, html);
  const pg = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
  pg.on('pageerror', (e) => { console.error(`${id} page error:`, e.message); process.exitCode = 1; });
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  const mp4 = join(OUT, `${id}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-crf', '18', '-preset', 'medium', '-r', String(FPS), '-movflags', '+faststart', mp4],
  { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (k) => (k ? rej(new Error(`ffmpeg ${k}`)) : res())));
  const frames = DUR * FPS;
  for (let f = 0; f < frames; f++) {
    await pg.evaluate((t) => window.seek(t), f / FPS);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await pg.evaluate((t) => window.seek(t), DUR);
  await pg.screenshot({ path: join(OUT, `${id}.jpg`), type: 'jpeg', quality: 92 });
  await pg.context().close();
  unlinkSync(tmp);
  console.log(`${id} · ${frames} frames · ${DUR} s`);
}

const only = process.argv[2];
const ids = only ? [only] : Object.keys(cards);
const browser = await chromium.launch();
for (const id of ids) await render(browser, id);
await browser.close();
