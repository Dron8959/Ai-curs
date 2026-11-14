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
import { posts as shared } from './text.mjs';
import { posts as threadsOnly } from './threads.mjs';
import { posts as v2 } from './threads-v2.mjs';
const posts = [...shared.map((p) => ({ id: p.id })), ...threadsOnly.map((p) => ({ id: p.id })), ...v2.map((p) => ({ id: p.id }))];

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
  // Three ages, three jobs for the parent. The kid's share of the keyboard grows with age.
  '07-by-age': { theme: 'y', chip: 'You decide',
    hl: `How young is<br><mark>too young</mark><br>for AI?`,
    stage: `
      ${[['6', 'They talk, you type.', .3], ['10', 'They do most of it.', .85], ['Teen', 'You stay in the room.', 1]].map(([age, t, v]) => `
      <div class="box row" style="position:relative;height:180px;margin-bottom:30px;display:flex;align-items:center;gap:30px;padding:0 34px">
        <div class="age" style="flex:none;width:126px;height:126px;border:6px solid #141A33;border-radius:50%;background:#FF6F4A;display:flex;align-items:center;justify-content:center;font:800 ${age.length > 2 ? 40 : 60}px Sora;letter-spacing:-.04em">${age}</div>
        <div style="flex:1">
          <div class="big lbl" style="font-size:44px;margin-bottom:16px">${t}</div>
          <div style="height:30px;border:5px solid #141A33;border-radius:999px;background:#F1EBDA;overflow:hidden"><div class="bar" data-v="${v}" style="height:100%;width:${v * 100}%;background:#5FE0A8;border-right:5px solid #141A33"></div></div>
          <div class="lab" style="font-size:20px;margin-top:10px;opacity:.6">kid at the keyboard</div>
        </div>
      </div>`).join('')}`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.row',{x:-120,opacity:0,duration:.45,ease:'power3.out',stagger:.9},1.0)
        .from('.age',{scale:0,duration:.4,ease:'back.out(2.6)',stagger:.9},1.15)
        .from('.bar',{width:0,duration:.8,ease:'power2.out',stagger:.9},1.4)
        .from('.lbl',{opacity:0,y:14,duration:.35,stagger:.9},1.3);` },

  // Quiz measures memory, a made thing measures skill.
  '09-ends-with-a-thing': { theme: 'm', chip: 'Unpopular opinion',
    hl: `Remembers<br>vs <mark>can do.</mark>`,
    stage: `
      <div class="box" id="q" style="left:0;top:0;width:440px;height:600px;padding:34px">
        <div class="lab">A quiz</div>
        ${[1, 2, 3, 4].map((i) => `<div class="qr" style="display:flex;align-items:center;gap:16px;margin-top:34px"><div style="width:38px;height:38px;border:5px solid #141A33;border-radius:10px;background:#fff"></div><div style="flex:1;height:18px;border-radius:9px;background:#D9E7DF"></div></div>`).join('')}
        <div class="big" id="qt" style="position:absolute;left:34px;bottom:34px;right:34px;font-size:40px;line-height:1.05">what a kid<br>remembers</div>
      </div>
      <div class="box" id="t" style="left:512px;top:0;width:440px;height:600px;padding:34px;background:#FFF9EC">
        <div class="lab">A thing they made</div>
        ${[['gamepad-2', 'Game', '#FF6F4A'], ['clapperboard', 'Cartoon', '#FFC533'], ['music', 'Song', '#B9A5FF']].map(([n, t, c]) => `<div class="chp" style="display:flex;align-items:center;gap:16px;margin-top:26px;border:5px solid #141A33;border-radius:22px;background:${c};padding:14px 20px">${icon(n, 46, 2.4)}<span class="big" style="font-size:40px">${t}</span></div>`).join('')}
        <div class="big" id="tt" style="position:absolute;left:34px;bottom:34px;right:34px;font-size:40px;line-height:1.05">what a kid<br>can do</div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('#q',{x:-90,opacity:0,duration:.5,ease:'power3.out'},.9)
        .from('.qr',{opacity:0,x:-30,duration:.3,stagger:.2},1.3)
        .from('#qt',{opacity:0,y:14,duration:.4},2.3)
        .from('#t',{x:90,opacity:0,duration:.5,ease:'power3.out'},2.8)
        .from('.chp',{scale:.4,opacity:0,duration:.4,ease:'back.out(2.4)',stagger:.35},3.3)
        .from('#tt',{opacity:0,y:14,duration:.4},4.5);` },

  // Who did what: the idea and the words are hers, the AI makes the music.
  '10-is-it-cheating': { theme: 'c', chip: 'You decide',
    hl: `Did she<br><mark>make it?</mark>`,
    stage: `
      ${[['Idea', 'Hers', 1], ['Words', 'Hers', 1], ['Music', 'AI', 0], ['Sang it for grandma', 'Hers', 1]].map(([t, who, mine], i) => `
      <div class="box wr" style="position:relative;height:122px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;padding:0 34px">
        <span class="big" style="font-size:${t.length > 10 ? 38 : 50}px">${t}</span>
        <span class="tag" style="border:5px solid #141A33;border-radius:999px;padding:8px 28px;font:800 36px Sora;letter-spacing:-.03em;background:${mine ? '#5FE0A8' : '#141A33'};color:${mine ? '#141A33' : '#FFF4DC'}">${who}</span>
      </div>`).join('')}`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.wr',{x:-120,opacity:0,duration:.45,ease:'power3.out',stagger:.5},1.0)
        .from('.tag',{scale:0,duration:.35,ease:'back.out(2.6)',stagger:.5},1.6);` },

  // The four levels of a family with AI, as stairs.
  'threads-04-ai-level': { theme: 'y', chip: 'You decide',
    hl: `What's your<br><mark>AI level?</mark>`,
    stage: `
      ${[['1', 'Never tried it', 215], ['2', 'Homework answers', 325], ['3', 'Made something', 435], ['4', 'Showed someone', 545]].map(([n, t, h], i) => `
      <div class="box st" style="left:${i * 242}px;bottom:0;width:224px;height:${h}px;padding:22px 20px;border-radius:28px;background:${['#FFF9EC', '#FFF9EC', '#FFF9EC', '#5FE0A8'][i]}">
        <div style="width:72px;height:72px;border:5px solid #141A33;border-radius:50%;background:#FF6F4A;display:flex;align-items:center;justify-content:center;font:800 40px Sora">${n}</div>
        <div class="big" style="font-size:31px;line-height:1.05;margin-top:16px;letter-spacing:-.03em">${t}</div>
      </div>`).join('')}`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.st',{y:300,opacity:0,duration:.5,ease:'back.out(1.5)',stagger:.55},1.0);` },

  // Three things that can be fake. Each one gets checked.
  'threads-05-fake-check': { theme: 'n', chip: 'Unpopular opinion',
    hl: `Too perfect?<br><mark>Check it.</mark>`,
    stage: `
      ${[['image', 'Picture'], ['video', 'Video'], ['file-text', 'Text']].map(([n, t], i) => `
      <div class="box fk" style="left:${i * 326}px;top:40px;width:300px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px">
        ${icon(n, 110, 2.2)}
        <div class="big" style="font-size:44px">${t}</div>
        <div class="chk" style="border:5px solid #141A33;border-radius:999px;padding:8px 24px;font:800 32px Urbanist;background:#FFC533;display:flex;align-items:center;gap:10px"><span class="q">fake?</span></div>
      </div>`).join('')}`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.fk',{y:90,opacity:0,duration:.45,ease:'power3.out',stagger:.3},1.0)
        .from('.chk',{scale:0,duration:.35,ease:'back.out(2.6)',stagger:.3},1.6);
      document.querySelectorAll('.chk').forEach((el,i)=>{
        tl.to(el,{backgroundColor:'#5FE0A8',duration:.25},3.2+i*.6)
          .call(()=>{el.innerHTML='checked'},null,3.3+i*.6);
        tl.fromTo(el,{scale:1.25},{scale:1,duration:.3,ease:'back.out(3)'},3.3+i*.6);
      });` },

  // Watch, make, show: the loop every lesson runs on.
  'threads-06-tuesday-night': { theme: 'y', chip: 'First lesson free',
    hl: `Watch.<br><mark>Make.</mark><br>Show.`,
    stage: `
      ${[['play', 'Watch', 'a finished thing', '#FFF9EC'], ['pencil', 'Make', 'your own', '#FF6F4A'], ['send', 'Show', 'someone', '#5FE0A8']].map(([n, t, d, c], i) => `
      <div class="box lp" style="left:${i * 326}px;top:30px;width:300px;height:360px;background:${c};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
        ${icon(n, 100, 2.4)}<div class="big" style="font-size:58px">${t}</div><div class="lab" style="font-size:24px;letter-spacing:.04em;text-transform:none;font-weight:700">${d}</div>
      </div>`).join('')}
      <div class="bub" id="mn" style="left:250px;top:470px;font:800 40px Sora;padding:20px 34px">6 to 20 min</div>
      <div class="bub" id="nq" style="left:100px;top:570px;font:700 32px Urbanist;background:#141A33;color:#FFF4DC;box-shadow:6px 6px 0 #FFFFFF">No quiz at the end</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.lp',{scale:.3,opacity:0,duration:.45,ease:'back.out(2.2)',stagger:.55},.8)
        .from('#mn',{scale:0,duration:.4,ease:'back.out(3)'},2.8)
        .from('#nq',{scale:0,duration:.4,ease:'back.out(3)'},3.4);` },

  // Say it, check it, ask again: a loop that returns to the start.
  'threads-07-describe-check': { theme: 'k', chip: 'Unpopular opinion',
    hl: `Say it.<br><mark>Check it.</mark><br>Ask again.`,
    stage: `
      ${[['Say what you want', '#FFC533'], ['Check what came back', '#FFFFFF'], ['Ask again', '#5FE0A8']].map(([t, c], i) => `
      <div class="box ds" style="left:${i * 326}px;top:40px;width:300px;height:210px;background:${c};display:flex;align-items:center;justify-content:center;text-align:center;padding:0 22px">
        <div class="big" style="font-size:40px;line-height:1.05">${t}</div></div>`).join('')}
      <svg style="position:absolute;left:0;top:250px" width="952" height="330" viewBox="0 0 952 330"><path id="ret" d="M 800 0 C 800 260, 150 260, 150 14" fill="none" stroke="#141A33" stroke-width="8" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400"/><path id="head" d="M 120 44 L 150 6 L 180 44" fill="none" stroke="#141A33" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>
      <div class="bub" id="rp" style="left:370px;top:455px;font:800 38px Sora;padding:18px 34px">repeat</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.ds',{y:70,opacity:0,duration:.45,ease:'power3.out',stagger:.6},1.0)
        .to('#ret',{strokeDashoffset:0,duration:1.6,ease:'power1.inOut'},3.0)
        .to('#head',{opacity:1,duration:.2},4.5)
        .from('#rp',{scale:0,duration:.4,ease:'back.out(3)'},3.6);` },

  // AI house rules, a five-day series: one rule a day at noon, the same layout every time so people know it.
  ...Object.fromEntries([
    ['v2-r1-account', 'key-round', `The account<br>is <mark>yours.</mark>`, 'Your kid never signs up alone'],
    ['v2-r2-strangers', 'user-x', `Who can <mark>DM</mark><br>your kid?`, 'Check their favorite app tonight'],
    ['v2-r3-never-hears', 'lock', `Some things AI<br><mark>never hears.</mark>`, 'Decide the list together'],
    ['v2-r4-links', 'link', `Links get a<br><mark>second look.</mark>`, 'Spot it before you click'],
    ['v2-r5-too-perfect', 'search', `Too perfect?<br><mark>Check it.</mark>`, 'Pictures, videos, texts can be fake'],
  ].map(([id, ic, hl, sub], k) => [id, { theme: 'n', chip: `AI house rules · ${k + 1}/5`,
    hl,
    stage: `
      <div class="box" id="rc" style="left:0;top:0;width:952px;height:400px;background:#FFC533;display:flex;align-items:center;gap:50px;padding:0 60px">
        <div id="ri" style="flex:none;width:230px;height:230px;border:6px solid #141A33;border-radius:50%;background:#FFF4DC;display:flex;align-items:center;justify-content:center">${icon(ic, 130, 2.4)}</div>
        <div><div class="lab" style="font-size:28px">Rule ${k + 1}</div><div class="big" id="rs" style="font-size:54px;line-height:1.05;margin-top:12px">${sub}</div></div>
      </div>
      <div style="position:absolute;left:0;right:0;top:470px;display:flex;gap:26px;justify-content:center">
        ${[0, 1, 2, 3, 4].map((j) => `<div class="dot${j === k ? ' cur' : ''}" style="width:96px;height:96px;border:6px solid #FFF4DC;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 42px Sora;color:${j < k ? '#141A33' : j === k ? '#141A33' : '#FFF4DC'};background:${j < k ? '#5FE0A8' : j === k ? '#FFC533' : 'transparent'}">${j + 1}</div>`).join('')}
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('#rc',{y:120,opacity:0,duration:.5,ease:'power3.out'},1.0)
        .from('#ri',{scale:0,rotation:-40,duration:.5,ease:'back.out(2.2)'},1.4)
        .from('#rs',{opacity:0,x:30,duration:.4},1.8)
        .from('.dot',{scale:0,duration:.3,ease:'back.out(2.6)',stagger:.15},2.4)
        .fromTo('.dot.cur',{scale:1},{scale:1.25,duration:.25,yoyo:true,repeat:3,ease:'sine.inOut'},3.6);` }])),

  // ===================================================== v2 plan: one card per post, worded from that post
  // 1. the guilt about screen time is louder than the screen time
  'v2-01-guilt': { theme: 'k', chip: 'Unpopular opinion',
    hl: `The guilt is<br><mark>louder</mark> than<br>the screen.`,
    stage: `
      ${[['20 min', 'making a game', .17], ['2 hours', 'watching videos', 1]].map(([t, d, v], i) => `
      <div class="box gr" style="left:0;top:${i * 276}px;width:952px;height:250px;padding:22px 34px">
        <div style="display:flex;align-items:baseline;gap:18px"><span class="big" style="font-size:54px">${t}</span><span class="lab" style="font-size:24px;letter-spacing:.06em">${d}</span></div>
        ${[['time', v, '#5FE0A8'], ['guilt', .93, '#FF6F4A']].map(([l, w, c]) => `
        <div style="display:flex;align-items:center;gap:20px;margin-top:20px"><span class="lab" style="width:90px;font-size:22px">${l}</span>
          <div style="flex:1;height:40px;border:5px solid #141A33;border-radius:999px;background:#F1EBDA;overflow:hidden"><div class="${l}" style="height:100%;width:${w * 100}%;background:${c};border-right:5px solid #141A33"></div></div></div>`).join('')}
      </div>`).join('')}
      <div class="bub" id="why" style="left:770px;top:562px;font:800 46px Sora;padding:14px 34px;background:#141A33;color:#FFF4DC">Why?</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.gr',{x:-100,opacity:0,duration:.45,ease:'power3.out',stagger:.35},.9)
        .from('.time',{width:0,duration:1.1,ease:'power2.out',stagger:.5},1.7)
        .from('.guilt',{width:0,duration:1.1,ease:'power2.out',stagger:.25},3.2)
        .from('#why',{scale:0,duration:.4,ease:'back.out(3)'},4.6);` },

  // 4. what do you ask an AI? something useful. now ask your kid: a flying dog that runs a pizza shop
  'v2-04-who-asks-better': { theme: 'y', chip: 'You decide',
    hl: `What would<br>your <mark>kid</mark> ask?`,
    stage: `
      <div class="box" id="you" style="left:0;top:0;width:420px;height:600px;padding:30px">
        <div class="lab">You ask</div>
        <div class="bub yb" style="position:relative;margin-top:30px;white-space:normal;background:#EFEAD8;font:700 34px/1.2 Urbanist">A meal plan for the week</div>
        <div class="bub yb" style="position:relative;margin-top:22px;white-space:normal;background:#EFEAD8;font:700 34px/1.2 Urbanist">Fix this email</div>
        <div class="lab" id="yl" style="position:absolute;left:30px;bottom:30px;opacity:.55">useful. fine.</div>
      </div>
      <div class="box" id="kd" style="left:460px;top:0;width:492px;height:600px;padding:30px;background:#FFF9EC">
        <div class="lab">Your kid asks</div>
        <div class="bub" id="kb" style="position:relative;margin-top:30px;white-space:normal;background:#FF6F4A;font:800 42px/1.12 Sora;padding:22px 26px">A flying dog that runs a pizza shop</div>
        <div id="ki" style="display:flex;gap:26px;margin-top:34px">
          <div class="kic" style="width:120px;height:120px;border:5px solid #141A33;border-radius:50%;background:#FFC533;display:flex;align-items:center;justify-content:center">${icon('dog', 70, 2.4)}</div>
          <div class="kic" style="width:120px;height:120px;border:5px solid #141A33;border-radius:50%;background:#5FE0A8;display:flex;align-items:center;justify-content:center">${icon('pizza', 70, 2.4)}</div>
        </div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('#you',{x:-90,opacity:0,duration:.5,ease:'power3.out'},.9)
        .from('.yb',{scale:0,transformOrigin:'0 0',duration:.35,ease:'back.out(2.4)',stagger:.4},1.5)
        .from('#yl',{opacity:0,duration:.3},2.6)
        .from('#kd',{x:90,opacity:0,duration:.5,ease:'power3.out'},3.0)
        .from('#kb',{scale:0,transformOrigin:'0 0',duration:.45,ease:'back.out(2.4)'},3.6)
        .from('.kic',{scale:0,duration:.4,ease:'back.out(2.6)',stagger:.3},4.3);` },

  // 7. school says cheating, plenty of others say a skill, your kid sits in the middle
  'v2-02-school-vs-world': { theme: 'm', chip: 'You decide',
    hl: `Cheating<br>or a <mark>skill?</mark>`,
    stage: `
      <svg style="position:absolute;left:0;top:0" width="952" height="620" viewBox="0 0 952 620">
        <path class="pull" d="M 300 190 L 400 380" stroke="#141A33" stroke-width="8" stroke-linecap="round" stroke-dasharray="230" stroke-dashoffset="230"/>
        <path class="pull" d="M 652 190 L 552 380" stroke="#141A33" stroke-width="8" stroke-linecap="round" stroke-dasharray="230" stroke-dashoffset="230"/></svg>
      <div class="box side" style="left:0;top:0;width:300px;height:250px;background:#FF6F4A;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">${icon('x', 80, 3)}<div class="big" style="font-size:48px">Cheating</div><div class="lab" style="font-size:22px">school says</div></div>
      <div class="box side" style="left:652px;top:0;width:300px;height:250px;background:#FFF4DC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">${icon('check', 80, 3)}<div class="big" style="font-size:48px">A skill</div><div class="lab" style="font-size:22px">others say</div></div>
      <div id="kid" style="position:absolute;left:376px;top:330px;width:200px;height:200px;border:6px solid #141A33;border-radius:50%;background:#FFC533;display:flex;align-items:center;justify-content:center;box-shadow:10px 10px 0 #141A33">${icon('user-round', 110, 2.4)}</div>
      <div class="lab" id="kl" style="position:absolute;left:376px;width:200px;top:552px;text-align:center">your kid</div>
      <div class="bub" id="q" style="left:528px;top:300px;font:800 48px Sora;padding:6px 24px;background:#141A33;color:#FFF4DC">?</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.side',{y:-80,opacity:0,duration:.45,ease:'back.out(1.8)',stagger:.4},.9)
        .from('#kid',{scale:0,duration:.45,ease:'back.out(2.4)'},1.9)
        .from('#kl',{opacity:0,duration:.3},2.2)
        .to('.pull',{strokeDashoffset:0,duration:.5,ease:'power2.out',stagger:.2},2.4)
        .to('#kid',{x:-34,duration:.5,ease:'sine.inOut'},3.1)
        .to('#kid',{x:34,duration:.9,ease:'sine.inOut'},3.6)
        .to('#kid',{x:0,duration:.6,ease:'sine.inOut'},4.5)
        .from('#q',{scale:0,duration:.4,ease:'back.out(3)'},4.9);` },

  // 10. almost 9 in 10 US kids aged 9 to 17 already use it; a ban decides with you or without you
  'v2-06-ban': { theme: 'n', chip: 'Unpopular opinion',
    hl: `Almost <mark>9 in 10</mark><br>already use it.`,
    stage: `
      <div class="box" style="left:0;top:0;width:952px;height:380px;background:#FFF4DC;display:grid;grid-template-columns:repeat(5,1fr);gap:22px;padding:34px 60px">
        ${Array.from({ length: 10 }, (_, i) => `<div class="kd${i < 9 ? ' on' : ''}" style="width:130px;height:130px;margin:auto;border:6px solid #141A33;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FFF4DC">${icon('user-round', 70, 2.4)}</div>`).join('')}
      </div>
      <div class="lab" id="src" style="position:absolute;left:0;top:402px;color:#B9C0DE;font-size:22px;letter-spacing:.06em">US kids aged 9 to 17 · Common Sense Media, 2026</div>
      <div class="big" id="bd" style="position:absolute;left:0;top:460px;font-size:44px;color:#FFF4DC">A ban only decides:</div>
      <div class="bub ch" style="left:0;top:530px;font:800 38px Sora;background:#5FE0A8">With you</div>
      <div class="bub ch" style="left:300px;top:530px;font:800 38px Sora;background:transparent;color:#FFF4DC;border-color:#FFF4DC">Or without you</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.kd',{scale:0,duration:.3,ease:'back.out(2.4)',stagger:.08},.9)
        .to('.kd.on',{backgroundColor:'#FFC533',duration:.2,stagger:.22},1.9)
        .from('#src',{opacity:0,duration:.3},3.9)
        .from('#bd',{opacity:0,y:16,duration:.35},4.4)
        .from('.ch',{scale:0,duration:.35,ease:'back.out(2.6)',stagger:.35},4.8);` },

  // 12. i tested every lesson on my 10-year-old at the kitchen table. If it lost her, it got cut.
  'v2-09-kitchen-table': { theme: 'm', chip: 'Behind the scenes',
    hl: `Tested on a<br><mark>10-year-old.</mark>`,
    stage: `
      <div class="box" style="left:0;top:0;width:952px;height:600px;padding:30px 40px;background:#FFFEF8">
        <div class="lab">Every lesson · kitchen table test</div>
        ${[0, 1, 2, 3, 4, 5].map((i) => `
        <div class="ls${i === 1 || i === 4 ? ' cut' : ' keep'}" style="position:relative;display:flex;align-items:center;gap:22px;height:54px;margin-top:10px">
          <span class="big" style="width:56px;font-size:34px">${i + 1}</span>
          <div style="flex:1;height:22px;border-radius:11px;background:#C9D9CF"></div>
          <div class="mk" style="width:110px;text-align:center;font:800 28px Sora;border:5px solid #141A33;border-radius:999px;padding:4px 0;background:${i === 1 || i === 4 ? '#FF6F4A' : '#5FE0A8'}">${i === 1 || i === 4 ? 'Cut' : 'Kept'}</div>
          ${i === 1 || i === 4 ? `<div class="st" style="position:absolute;left:70px;right:140px;top:24px;height:6px;background:#FF6F4A;border-radius:3px"></div>` : ''}
        </div>`).join('')}
      </div>
      <div class="bub" id="stamp" style="left:420px;top:500px;font:800 32px Sora;padding:14px 26px;background:#141A33;color:#FFF4DC;transform:rotate(-6deg)">If it lost her, it got cut</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.ls',{opacity:0,x:-40,duration:.3,stagger:.15},.9)
        .from('.keep .mk',{scale:0,duration:.3,ease:'back.out(2.6)',stagger:.25},2.1)
        .from('.cut .st',{scaleX:0,transformOrigin:'0 50%',duration:.4,stagger:.5},3.2)
        .from('.cut .mk',{scale:0,duration:.3,ease:'back.out(2.6)',stagger:.5},3.5)
        .to('.cut',{opacity:.45,duration:.3,stagger:.5},3.7)
        .from('#stamp',{scale:2,opacity:0,duration:.35,ease:'power3.in'},4.8);` },

  // 13. ask your kid at dinner what game they'd make; tell me what they said
  'v2-16-dinner-prompt': { theme: 'c', chip: 'Try this tonight',
    hl: `Ask at dinner<br><mark>tonight.</mark>`,
    stage: `
      <div class="box" id="qb" style="left:0;top:0;width:952px;height:270px;padding:34px 44px;display:flex;align-items:center;gap:34px">
        <div style="flex:none">${icon('utensils', 100, 2.4)}</div>
        <div class="big" style="font-size:50px;line-height:1.08">If you could make any game at all, what would it be?</div>
      </div>
      <div id="ab" style="position:absolute;left:120px;top:320px;width:832px;height:180px;border:6px dashed #141A33;border-radius:32px;background:rgba(255,244,220,.55);padding:28px 36px">
        <div class="lab">their answer</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:20px"><div style="width:420px;height:8px;background:#141A33;border-radius:4px;opacity:.25"></div><div id="cur" style="width:8px;height:56px;background:#141A33"></div></div>
      </div>
      <div class="bub" id="tm" style="left:330px;top:535px;font:800 32px Sora;background:#141A33;color:#FFF4DC">Then tell me what they said</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('#qb',{y:80,opacity:0,duration:.5,ease:'power3.out'},.9)
        .from('#ab',{opacity:0,y:40,duration:.45},2.0)
        .to('#cur',{opacity:0,duration:.01,repeat:9,yoyo:true,repeatDelay:.25},2.6)
        .from('#tm',{scale:0,duration:.4,ease:'back.out(3)'},4.6);` },

  // 15. first lesson free: one email, your kid builds a game in 10 to 20 minutes, you play it on the couch
  'v2-15-offer': { theme: 'y', chip: 'First lesson free',
    hl: `First lesson.<br><mark>Free.</mark>`,
    stage: `
      ${[['mail', 'One email', 'no card', '#FFF9EC'], ['gamepad-2', 'They build a game', '10 to 20 min', '#FF6F4A'], ['sofa', 'You play it', 'same couch', '#5FE0A8']].map(([n, t, d, c], i) => `
      <div class="box of" style="left:${i * 326}px;top:20px;width:300px;height:400px;background:${c};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:0 18px">
        <div style="width:54px;height:54px;border:5px solid #141A33;border-radius:50%;background:#fff;font:800 30px Sora;display:flex;align-items:center;justify-content:center">${i + 1}</div>
        ${icon(n, 96, 2.4)}<div class="big" style="font-size:42px;line-height:1.05">${t}</div><div class="lab" style="font-size:22px">${d}</div>
      </div>`).join('')}
      <div class="bub" id="lk" style="left:250px;top:480px;font:800 40px Sora;padding:16px 34px;background:#141A33;color:#FFF4DC">makeshowlab.com</div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('.of',{y:120,opacity:0,duration:.5,ease:'back.out(1.6)',stagger:.6},1.0)
        .from('#lk',{scale:0,duration:.4,ease:'back.out(3)'},3.4);` },

};
// v2 posts that reuse a card: same drawing, headline worded from the v2 text
cards['v2-12-age'] = { ...cards['07-by-age'], hl: `At what age can<br>your <mark>kid</mark> try AI?` };
cards['v2-03-did-she-make-it'] = cards['10-is-it-cheating'];
cards['v2-13-two-kids'] = { ...cards['02-answer-machine'], hl: `Same chatbot.<br>Which kid would<br>you <mark>stop?</mark>` };

// ---------------------------------------------------- week pack: cards for posts 16, 17, 19, 20, 21
cards['wk-16-lets-find-out'] = { theme: 'k', chip: 'You decide',
  hl: `What do you<br><mark>reach for?</mark>`,
  stage: `
    ${[['search', 'Google it quietly', '#FFF9EC', ''], ['bot', 'Ask an AI', '#FFF9EC', ''], ['users', '"I don\'t know, let\'s find out together"', '#5FE0A8', 'our pick']].map(([ic, t, bg, tag], i) => `
    <div class="box op" style="left:0;top:${i * 200}px;width:952px;height:170px;background:${bg};display:flex;align-items:center;gap:34px;padding:0 40px">
      <div style="flex:none;width:96px;height:96px;border:5px solid #141A33;border-radius:50%;background:#FFC533;display:flex;align-items:center;justify-content:center">${icon(ic, 54, 2.4)}</div>
      <div class="big" style="font-size:${t.length > 24 ? 38 : 46}px;line-height:1.1">${t}</div>
      ${tag ? `<div class="bub pk" style="position:absolute;right:30px;top:-24px;font:800 30px Sora;background:#141A33;color:#FFF4DC">${tag}</div>` : ''}
    </div>`).join('')}`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.op',{x:-110,opacity:0,duration:.45,ease:'power3.out',stagger:.55},.9)
      .from('.pk',{scale:0,duration:.4,ease:'back.out(3)'},3.2)
      .fromTo('.op:nth-child(3)',{scale:1},{scale:1.03,duration:.3,yoyo:true,repeat:3,ease:'sine.inOut'},3.8);` };

cards['wk-17-song-for-grandma'] = { theme: 'c', chip: 'One lesson, 6 to 20 min',
  hl: `Her words.<br>Now it's a <mark>song.</mark>`,
  stage: `
    <div class="box" id="ph" style="left:176px;top:0;width:600px;height:560px;background:#141A33;border-radius:44px;padding:40px 40px 0">
      <div class="lab" style="color:#B9C0DE">Grandma's phone</div>
      <div style="margin-top:36px;border:5px solid #FFF4DC;border-radius:28px;background:#FFF9EC;padding:30px">
        <div style="display:flex;align-items:center;gap:22px">
          <div id="pl" style="flex:none;width:84px;height:84px;border:5px solid #141A33;border-radius:50%;background:#FF6F4A;display:flex;align-items:center;justify-content:center">${icon('play', 42, 2.6)}</div>
          <div><div class="big" style="font-size:36px">A song by your kid</div><div class="lab" style="font-size:20px;margin-top:6px">from her own words</div></div>
        </div>
        <div style="margin-top:28px;height:18px;border:4px solid #141A33;border-radius:9px;background:#F1EBDA;overflow:hidden"><div id="pr" style="height:100%;width:62%;background:#5FE0A8;border-right:4px solid #141A33"></div></div>
      </div>
      ${[0, 1, 2].map((i) => `<div class="nt" style="position:absolute;right:${60 + i * 90}px;top:${-10 + (i % 2) * 30}px;color:#FFC533">${icon('music', 44 + i * 8, 2.4).replace('currentColor', '#FFC533')}</div>`).join('')}
    </div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#ph',{y:140,opacity:0,duration:.55,ease:'back.out(1.5)'},.9)
      .from('#pl',{scale:0,duration:.4,ease:'back.out(2.6)'},1.6)
      .from('#pr',{width:0,duration:3.4,ease:'none'},1.9)
      .from('.nt',{y:40,opacity:0,duration:.5,ease:'back.out(2)',stagger:.4},2.2);` };

cards['wk-19-two-evenings'] = { theme: 'n', chip: 'You decide',
  hl: `Same AI. Two<br>different <mark>evenings.</mark>`,
  stage: `
    <div class="box ev" style="left:0;top:0;width:460px;height:480px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;padding:0 30px">
      <div class="lab">Evening 1</div>${icon('messages-square', 90, 2.2)}
      <div class="big" style="font-size:40px;line-height:1.1">Homework answers, pulled out</div>
    </div>
    <div class="box ev" style="left:492px;top:0;width:460px;height:480px;background:#FFC533;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;padding:0 30px">
      <div class="lab">Evening 2</div>${icon('clapperboard', 90, 2.2)}
      <div class="big" style="font-size:40px;line-height:1.1">A cartoon, built</div>
    </div>
    <div class="bub" id="tn" style="left:300px;top:530px;font:800 36px Sora;background:#5FE0A8">Which one is tonight?</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.ev',{y:110,opacity:0,duration:.5,ease:'back.out(1.6)',stagger:.5},.9)
      .from('#tn',{scale:0,duration:.4,ease:'back.out(3)'},2.6);` };

cards['wk-20-gift'] = { theme: 'y', chip: 'Gift season',
  hl: `A box to open, or<br><mark>time together?</mark>`,
  stage: `
    <div class="box gf" style="left:0;top:0;width:460px;height:430px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px">${icon('gift', 110, 2.2)}<div class="big" style="font-size:44px">Another toy</div></div>
    <div class="box gf" style="left:492px;top:0;width:460px;height:430px;background:#5FE0A8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px">${icon('sofa', 110, 2.2)}<div class="big" style="font-size:44px">Time together</div></div>
    <div class="bub" id="ld" style="left:120px;top:490px;font:700 30px/1.2 Urbanist;white-space:normal;max-width:720px;background:#FFF9EC">"...something more meaningful than another toy." Linda, early-access grandma</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.gf',{y:110,opacity:0,duration:.5,ease:'back.out(1.6)',stagger:.5},.9)
      .from('#ld',{scale:0,transformOrigin:'20% 0',duration:.45,ease:'back.out(2)'},2.4);` };

cards['wk-21-fridge'] = { theme: 'm', chip: 'Why we exist',
  hl: `A reason to<br><mark>show you</mark><br>something.`,
  stage: `
    <div class="box" id="fr" style="left:40px;top:20px;width:400px;height:520px;background:#FFF9EC;padding:26px">
      <div class="lab">Paper drawings had</div>
      <div style="position:relative;margin:26px auto 0;width:280px;height:290px;border:6px solid #141A33;border-radius:18px;background:#EDEFF4">
        <div style="position:absolute;left:24px;top:52px;width:230px;height:160px;background:#FFFEF8;border:4px solid #141A33;border-radius:6px;transform:rotate(-3deg)">
          <div style="margin:18px;height:8px;border-radius:4px;background:#FF6F4A;width:70%"></div>
          <div style="margin:18px;height:8px;border-radius:4px;background:#5FE0A8;width:50%"></div>
          <div style="margin:18px;height:8px;border-radius:4px;background:#FFC533;width:60%"></div>
        </div>
        <div id="mg" style="position:absolute;left:128px;top:44px;width:28px;height:28px;border:4px solid #141A33;border-radius:50%;background:#FF6F4A"></div>
      </div>
      <div class="big" style="text-align:center;font-size:34px;margin-top:18px">the fridge door</div>
    </div>
    <div class="box" id="tv" style="left:512px;top:20px;width:400px;height:520px;background:#FFF9EC;padding:26px">
      <div class="lab">Screens can have</div>
      <div style="margin:26px auto 0;width:300px;height:220px;border:6px solid #141A33;border-radius:18px;background:#BFE9FF;position:relative;overflow:hidden">
        <div style="position:absolute;left:0;right:0;bottom:0;height:40px;background:#5FE0A8;border-top:5px solid #141A33"></div>
        ${[[30, 90, '#FFC533'], [120, 120, '#FF6F4A'], [210, 70, '#141A33']].map(([x, y, c]) => `<div class="bl" style="position:absolute;left:${x}px;top:${y}px;width:56px;height:56px;border:4px solid #141A33;border-radius:10px;background:${c}"></div>`).join('')}
      </div>
      <div class="bub" id="lk" style="position:relative;margin:30px auto 0;width:fit-content;font:800 26px Sora;background:#FFC533">"Look what I made!"</div>
    </div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#fr',{x:-120,opacity:0,duration:.5,ease:'power3.out'},.9)
      .from('#mg',{scale:0,duration:.3,ease:'back.out(3)'},1.5)
      .from('#tv',{x:120,opacity:0,duration:.5,ease:'power3.out'},2.0)
      .from('.bl',{y:-200,opacity:0,duration:.5,ease:'bounce.out',stagger:.35},2.6)
      .from('#lk',{scale:0,duration:.4,ease:'back.out(3)'},4.2);` };


// ---------------------------------------------------- useful layer (threads-extra.mjs): question + paradox + one visual
const HAND = (() => {
  const d = Math.PI / 180, pal = 310, py = 330;
  // thumb + five fingers: [base x, base y, angle deg, length, width]
  const F = [[300, 455, -58, 125, 66], [318, 352, -24, 150, 54], [372, 340, -10, 185, 54], [428, 336, 2, 198, 54], [484, 340, 14, 182, 54], [536, 356, 27, 150, 52]];
  const shape = (f, extra) => { const [x, y, a, L, w] = f; return `<rect x="${x - w / 2}" y="${y - L}" width="${w}" height="${L + 40}" rx="${w / 2}" transform="rotate(${a} ${x} ${y})" ${extra}/>`; };
  const tip = (f, k) => { const [x, y, a, L] = f; return [x + (L + k) * Math.sin(a * d), y - (L + k) * Math.cos(a * d)]; };
  const palm = (extra) => `<rect x="${pal - 40}" y="${py}" width="330" height="250" rx="110" ${extra}/>`;
  const skin = '#FFD2A6', ink = '#141A33';
  const outline = `<g fill="${ink}" stroke="${ink}" stroke-width="16" stroke-linejoin="round">${F.map((f) => shape(f, '')).join('')}${palm('')}</g>`;
  const fill = `<g fill="${skin}">${F.map((f) => shape(f, '')).join('')}${palm('')}</g>`;
  const nails = F.map((f) => { const [x, y] = tip(f, -30); return `<ellipse cx="${x}" cy="${y}" rx="${f[4] / 2 - 11}" ry="15" fill="#FFE9D6" stroke="#E8A87C" stroke-width="3" transform="rotate(${f[2]} ${x} ${y})"/>`; }).join('');
  const creases = `<path d="M372 470 Q425 500 470 460" fill="none" stroke="#E8A87C" stroke-width="6" stroke-linecap="round"/><path d="M350 420 Q400 440 420 420" fill="none" stroke="#E8A87C" stroke-width="5" stroke-linecap="round"/>`;
  const cuff = `<rect x="330" y="540" width="230" height="72" rx="18" fill="#6C8CFF" stroke="${ink}" stroke-width="8"/><rect x="330" y="540" width="230" height="22" rx="10" fill="#8FA8FF" stroke="${ink}" stroke-width="8"/>`;
  const badges = F.map((f, i) => { const [x, y] = tip(f, 46); return `<g class="nb" style="transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="27" fill="${i === 5 ? '#FF6F4A' : ink}" stroke="#FFF4DC" stroke-width="4"/><text x="${x}" y="${y + 10}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="28" fill="#FFF4DC">${i + 1}</text></g>`; }).join('');
  return `<svg style="position:absolute;left:0;top:0" width="952" height="620" viewBox="0 0 952 620">
    <g id="hand" style="transform-origin:445px 600px">${outline}${fill}${nails}${creases}${cuff}</g>${badges}</svg>`;
})();
cards['ex-6-fingers'] = { theme: 'y', chip: 'Ask your kid',
  hl: `It paints dragons.<br>It can't count <mark>fingers.</mark>`,
  stage: `${HAND}
    <div class="bub" id="ai" style="left:640px;top:40px;font:800 30px Sora;background:#FFF9EC;display:flex;align-items:center;gap:10px;white-space:nowrap">${icon('sparkles', 30, 2.4)} AI drew this</div>
    <div class="bub" id="q6" style="left:700px;top:250px;font:800 76px Sora;padding:6px 34px;background:#FF6F4A">6?</div>
    <div class="lab" id="cn" style="position:absolute;left:640px;top:410px;width:300px;font-size:22px;line-height:1.35">Count with your kid.<br>Catch any?</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#hand',{y:120,scale:.8,opacity:0,duration:.6,ease:'back.out(1.6)'},.8)
      .from('#ai',{scale:0,transformOrigin:'0 50%',duration:.4,ease:'back.out(2.4)'},1.3)
      .from('.nb',{scale:0,duration:.3,ease:'back.out(3)',stagger:.38},2.0)
      .from('#q6',{scale:0,rotation:-20,duration:.45,ease:'back.out(3)'},4.3)
      .from('#cn',{opacity:0,y:16,duration:.4},4.9);` };

const CAT_SCENE = `<svg width="208" height="208" viewBox="0 0 200 200" style="position:absolute;left:0;top:0">
  <rect width="200" height="200" fill="#9EDBFF"/>
  <ellipse cx="44" cy="40" rx="26" ry="11" fill="#FFFFFF"/><ellipse cx="62" cy="34" rx="16" ry="11" fill="#FFFFFF"/>
  <circle cx="168" cy="34" r="17" fill="#FFD84A" stroke="#141A33" stroke-width="3"/>
  <rect y="150" width="200" height="50" fill="#86DB8E"/>
  <g fill="#FF6F9A"><circle cx="22" cy="170" r="5"/><circle cx="182" cy="176" r="5"/><circle cx="38" cy="186" r="4"/></g>
  <path d="M140 160 Q182 150 168 108" fill="none" stroke="#141A33" stroke-width="15" stroke-linecap="round"/>
  <path d="M140 160 Q182 150 168 108" fill="none" stroke="#FF9A3C" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="104" cy="150" rx="44" ry="34" fill="#FF9A3C" stroke="#141A33" stroke-width="4"/>
  <ellipse cx="104" cy="158" rx="22" ry="18" fill="#FFE2C2"/>
  <ellipse cx="84" cy="182" rx="13" ry="8" fill="#FF9A3C" stroke="#141A33" stroke-width="4"/><ellipse cx="124" cy="182" rx="13" ry="8" fill="#FF9A3C" stroke="#141A33" stroke-width="4"/>
  <ellipse cx="146" cy="116" rx="10" ry="22" fill="#FF9A3C" stroke="#141A33" stroke-width="4" transform="rotate(32 146 116)"/>
  <circle cx="156" cy="98" r="10" fill="#FF9A3C" stroke="#141A33" stroke-width="4"/>
  <polygon points="66,80 60,46 88,66" fill="#FF9A3C" stroke="#141A33" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="134,80 140,46 112,66" fill="#FF9A3C" stroke="#141A33" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="100" cy="98" r="36" fill="#FF9A3C" stroke="#141A33" stroke-width="4"/>
  <path d="M92 70 l3 9 M100 68 v10 M108 70 l-3 9" stroke="#D86A1C" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="87" cy="114" rx="9" ry="6" fill="#FF8FA8" opacity=".55"/><ellipse cx="113" cy="114" rx="9" ry="6" fill="#FF8FA8" opacity=".55"/>
  <circle cx="87" cy="98" r="6.5" fill="#141A33"/><circle cx="113" cy="98" r="6.5" fill="#141A33"/><circle cx="89" cy="96" r="2" fill="#FFFFFF"/><circle cx="115" cy="96" r="2" fill="#FFFFFF"/>
  <polygon points="95,106 105,106 100,112" fill="#FF6F9A"/>
  <path d="M92 114 Q100 122 108 114" fill="none" stroke="#141A33" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M78 108 L50 103 M78 114 L50 117 M122 108 L150 103 M122 114 L150 117" stroke="#141A33" stroke-width="2.5" stroke-linecap="round"/>
  <g transform="rotate(-8 100 50)">
    <ellipse cx="100" cy="64" rx="42" ry="8" fill="#E8483A" stroke="#141A33" stroke-width="4"/>
    <rect x="77" y="22" width="46" height="42" rx="5" fill="#E8483A" stroke="#141A33" stroke-width="4"/>
    <rect x="77" y="48" width="46" height="9" fill="#141A33"/>
  </g>
</svg>`;
const noise = (n, seed, size, pal) => { let s = seed; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => `<div style="position:absolute;left:${(r() * 92).toFixed(1)}%;top:${(r() * 92).toFixed(1)}%;width:${size}px;height:${size}px;background:${pal[Math.floor(r() * pal.length)]}"></div>`).join(''); };
cards['ex-words-to-picture'] = { theme: 'n', chip: 'How it works',
  hl: `From static<br>to a <mark>picture.</mark>`,
  stage: `
    <div class="bub" id="pw" style="left:0;top:0;font:800 34px Sora;background:#FFC533">"an orange cat in a red hat, waving"</div>
    ${[0, 1, 2, 3].map((i) => `
    <div class="box fr" style="left:${i * 243}px;top:130px;width:220px;height:220px;padding:0;background:#FFF4DC;overflow:hidden">
      <div style="position:absolute;inset:0;filter:blur(${[14, 8, 2.5, 0][i]}px) saturate(${[0.4, 0.8, 1, 1][i]})">${CAT_SCENE}</div>
      ${i < 3 ? `<svg width="220" height="220" style="position:absolute;left:0;top:0;opacity:${[1, 0.62, 0.28][i]}"><filter id="tv${i}"><feTurbulence type="fractalNoise" baseFrequency="${[0.9, 0.75, 0.95][i]}" numOctaves="2" seed="${i * 7 + 3}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="2.4" intercept="-0.7"/><feFuncG type="linear" slope="2.4" intercept="-0.7"/><feFuncB type="linear" slope="2.4" intercept="-0.7"/><feFuncA type="linear" slope="0" intercept="1"/></feComponentTransfer></filter><rect width="220" height="220" filter="url(#tv${i})"/></svg>` : ''}
    </div>
    <div class="lab st" style="position:absolute;left:${i * 243}px;width:220px;top:372px;text-align:center;color:#FFF4DC">${['static', 'cleaning', 'almost', 'done'][i]}</div>`).join('')}
    <div class="big" id="nt" style="position:absolute;left:0;right:0;top:450px;font-size:40px;line-height:1.15;color:#FFF4DC">Each step nudged toward<br>your kid's words.</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#pw',{scale:0,transformOrigin:'0 50%',duration:.4,ease:'back.out(2.4)'},.9)
      .from('.fr',{scale:.5,opacity:0,duration:.45,ease:'back.out(2)',stagger:.7},1.5)
      .from('.st',{opacity:0,y:12,duration:.3,stagger:.7},1.8)
      .from('#nt',{opacity:0,y:20,duration:.45},4.6);` };

cards['ex-9yo-cartoon'] = { theme: 'c', chip: 'Early-access family',
  hl: `A 9-year-old made<br>a <mark>cartoon.</mark> How?`,
  stage: `
    ${[['play', 'Watch', 'Kamilla shows hers'], ['sparkles', 'Make', 'He makes his own'], ['heart', 'Show', 'He shows the family']].map(([ic, t, d], i) => `
    <div class="box sp" style="left:${i * 326}px;top:0;width:300px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center">
      <div style="width:44px;height:44px;border:4px solid #141A33;border-radius:50%;background:#FFC533;font:800 24px Sora;display:flex;align-items:center;justify-content:center">${i + 1}</div>
      ${icon(ic, 60, 2.4)}<div class="big" style="font-size:38px;line-height:1">${t}</div><div class="lab" style="font-size:19px">${d}</div></div>`).join('')}
    <div class="bub" id="qt" style="left:0;top:300px;max-width:952px;white-space:normal;font:700 34px/1.25 Urbanist;background:#FFF9EC;padding:26px 32px">"We made our own little cartoon together, and he was so excited to show it to his dad."<div class="lab" style="margin-top:14px;font-size:20px">Emily, mom of a 9-year-old · got the course free</div></div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.sp',{y:90,opacity:0,duration:.45,ease:'back.out(1.8)',stagger:.45},.9)
      .from('#qt',{scale:0,transformOrigin:'10% 0',duration:.5,ease:'back.out(2)'},3.0);` };

cards['ex-5-safe-ways'] = { theme: 'm', chip: 'Save this',
  hl: `5 safe ways to<br>start with <mark>AI.</mark>`,
  stage: `
    ${['Your account, you next to them', 'Make something first', 'A never-share list', 'Check every result together', 'No strangers can message'].map((t, i) => `
    <div class="box sw5" style="left:0;top:${i * 122}px;width:952px;height:104px;display:flex;align-items:center;gap:26px;padding:0 30px">
      <div style="flex:none;width:62px;height:62px;border:5px solid #141A33;border-radius:50%;background:${['#FFC533', '#FF6F4A', '#FFC533', '#FF6F4A', '#FFC533'][i]};font:800 32px Sora;display:flex;align-items:center;justify-content:center">${i + 1}</div>
      <div class="big" style="font-size:40px">${t}</div></div>`).join('')}`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.sw5',{x:-120,opacity:0,duration:.4,ease:'power3.out',stagger:.45},.9);` };

cards['ex-sure-and-wrong'] = { theme: 'k', chip: 'Teach this one',
  hl: `Sounds sure.<br><mark>Still check.</mark>`,
  stage: `
    <div class="box" style="left:0;top:0;width:952px;height:600px;padding:34px 40px;background:#FFFFFF">
      <div class="bub" id="uq" style="position:relative;margin-left:auto;width:fit-content;background:#FFC533;font:700 34px Urbanist">How many legs does a spider have?</div>
      <div class="bub" id="aa" style="position:relative;margin-top:30px;width:fit-content;background:#EFEAD8;font:700 36px Urbanist">Spiders have 6 legs.</div>
      <div style="display:flex;align-items:center;gap:18px;margin-top:34px"><span class="lab" style="font-size:22px">AI confidence</span>
        <div style="flex:1;height:34px;border:5px solid #141A33;border-radius:999px;background:#F1EBDA;overflow:hidden"><div id="cf" style="height:100%;width:100%;background:#5FE0A8;border-right:5px solid #141A33"></div></div><span class="big" style="font-size:34px">100%</span></div>
      <div class="bub" id="st" style="position:absolute;right:40px;bottom:40px;font:800 46px Sora;background:#FF6F4A;transform:rotate(-6deg)">Wrong. It's 8.</div>
    </div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#uq',{scale:0,transformOrigin:'100% 0',duration:.4,ease:'back.out(2.4)'},.9)
      .from('#aa',{scale:0,transformOrigin:'0 0',duration:.4,ease:'back.out(2.4)'},1.7)
      .from('#cf',{width:0,duration:1.0,ease:'power2.out'},2.3)
      .from('#st',{scale:2.2,opacity:0,duration:.35,ease:'power3.in'},3.9);` };

// ---------------------------------------------------- week 2 (threads-week2.mjs)
cards['w2-01-things-made'] = { theme: 'c', chip: 'House rules?',
  hl: `Count hours<br>or things <mark>made?</mark>`,
  stage: `
    <div class="box" id="hb" style="left:0;top:20px;width:400px;height:500px;display:flex;flex-direction:column;align-items:center;gap:22px;padding-top:40px">
      ${icon('clock', 90, 2.2)}<div class="big" style="font-size:44px">Hours</div>
      <div style="width:300px;height:44px;border:5px solid #141A33;border-radius:999px;background:#F1EBDA;overflow:hidden"><div id="hbar" style="height:100%;width:100%;background:#141A33"></div></div>
      <div class="big" id="hcount" style="font-size:56px">2:00</div></div>
    <div class="big" style="position:absolute;left:414px;top:240px;width:72px;text-align:center;font-size:40px">or</div>
    <div class="box" id="mb" style="left:500px;top:20px;width:452px;height:500px;padding:40px 36px;background:#FFF9EC">
      <div class="big" style="font-size:44px;margin-bottom:26px">Things made</div>
      ${[['gamepad-2', 'A game'], ['music', 'A song'], ['clapperboard', 'A cartoon']].map(([ic, t]) => `
      <div class="mk" style="display:flex;align-items:center;gap:20px;margin-bottom:22px">${icon(ic, 52, 2.4)}<span class="big" style="font-size:40px;flex:1">${t}</span>
        <span class="ck" style="width:52px;height:52px;border:5px solid #141A33;border-radius:12px;background:#5FE0A8;display:flex;align-items:center;justify-content:center">${icon('check', 34, 3.4)}</span></div>`).join('')}
      <div class="bub" id="off" style="position:relative;display:inline-block;margin-top:6px;font:800 34px Sora;background:#FFC533;transform:rotate(-4deg)">Then screens off</div></div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#hb',{x:-80,opacity:0,duration:.45,ease:'back.out(1.8)'},.9)
      .to('#hbar',{width:'8%',duration:2.2,ease:'none'},1.4)
      .from('#mb',{x:80,opacity:0,duration:.45,ease:'back.out(1.8)'},1.6)
      .from('.mk',{y:30,opacity:0,duration:.35,stagger:.45},2.1)
      .from('.ck',{scale:0,duration:.3,ease:'back.out(3)',stagger:.45},2.4)
      .from('#off',{scale:0,duration:.4,ease:'back.out(3)'},4.2);` };

// Kamilla's portrait (social/media/landing/kamilla.jpg) and her own sticker, cropped from step-show.jpg
const IMG = (f, mime) => `data:${mime};base64,${readFileSync(join(here, 'text/threads/src', f)).toString('base64')}`;
cards['w2-03-ai-kamilla'] = { theme: 'm', chip: 'Our rule',
  hl: `Real or <mark>AI?</mark><br>We always say.`,
  stage: `
    ${[[IMG('kamilla-photo.jpg', 'image/jpeg'), 'Kamilla, 10', 'REAL', '#5FE0A8', '#FFF9EC', '50% 30%'], [IMG('kamilla-sticker.png', 'image/png'), 'Kamilla, AI version', 'AI', '#FF6F4A', '#E9EDFF', '50% 40%']].map(([src, n, tag, tc, bg, pos], i) => `
    <div class="box pc" style="left:${i * 486}px;top:0;width:466px;height:420px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
      <div style="width:220px;height:240px;border:6px solid #141A33;border-radius:32px;overflow:hidden;background:#FFC533"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"></div>
      <div class="big" style="font-size:38px">${n}</div>
      <div class="tg" style="font:800 30px Sora;padding:6px 24px;border:5px solid #141A33;border-radius:999px;background:${tc}">${tag}</div></div>`).join('')}
    <div class="bub" id="say" style="left:0;top:460px;width:952px;text-align:center;font:800 38px Sora;background:#FFC533">Every time it's AI, we tell you.</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.pc',{y:80,opacity:0,duration:.45,ease:'back.out(1.8)',stagger:.6},.9)
      .from('.tg',{scale:0,duration:.35,ease:'back.out(3)',stagger:.6},1.6)
      .from('#say',{scale:0,duration:.45,ease:'back.out(2.4)'},3.2);` };

const BLUR = (w) => `<span style="display:inline-block;width:${w}px;height:30px;border-radius:8px;background:#9AA2C4;filter:blur(3px);vertical-align:middle"></span>`;
cards['w2-04-last-question'] = { theme: 'y', chip: 'Quick one',
  hl: `What did your kid<br><mark>ask</mark> AI this week?`,
  stage: `
    <div class="box" style="left:150px;top:0;width:652px;height:510px;padding:26px 34px;background:#FFFFFF;border-radius:44px">
      <div class="lab" style="text-align:center;font-size:20px;margin-bottom:24px">Your kid's chat · this week</div>
      ${[['how do I ', 170], ['is it normal to ', 150], ['write a song about ', 120], ['why does my mom ', 160]].map(([t, w]) => `
      <div class="bub kq" style="position:relative;margin:0 0 18px auto;width:fit-content;font:700 32px Urbanist;background:#FFC533">${t}${BLUR(w)}</div>`).join('')}
    </div>
    <div class="bub" id="dk" style="left:60px;top:530px;font:800 46px Sora;background:#FF6F4A;transform:rotate(-5deg)">Do you know?</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.kq',{scale:0,transformOrigin:'100% 50%',duration:.4,ease:'back.out(2.4)',stagger:.55},1.0)
      .from('#dk',{scale:2,opacity:0,duration:.35,ease:'power3.in'},3.8);` };

const CLUES = [
  ['Hands', `<g fill="#141A33" stroke="#141A33" stroke-width="10" stroke-linejoin="round">${[[62, -26], [80, -12], [98, 0], [116, 12], [134, 24], [50, -60]].map(([x, a], i) => `<rect x="${i === 5 ? 34 : x - 8}" y="${i === 5 ? 82 : 30}" width="16" height="${i === 5 ? 44 : 64}" rx="8" transform="rotate(${a} ${i === 5 ? 50 : x} ${i === 5 ? 110 : 90})"/>`).join('')}<rect x="44" y="76" width="96" height="70" rx="32"/></g>
    <g fill="#FFD2A6">${[[62, -26], [80, -12], [98, 0], [116, 12], [134, 24], [50, -60]].map(([x, a], i) => `<rect x="${i === 5 ? 34 : x - 8}" y="${i === 5 ? 82 : 30}" width="16" height="${i === 5 ? 44 : 64}" rx="8" transform="rotate(${a} ${i === 5 ? 50 : x} ${i === 5 ? 110 : 90})"/>`).join('')}<rect x="44" y="76" width="96" height="70" rx="32"/></g>`, [98, 40, 66]],
  ['Words on signs', `<rect x="20" y="40" width="160" height="70" rx="10" fill="#FFF9EC" stroke="#141A33" stroke-width="5"/><rect x="40" y="110" width="8" height="40" fill="#141A33"/><rect x="152" y="110" width="8" height="40" fill="#141A33"/>
    <text x="100" y="88" text-anchor="middle" font-family="Sora" font-weight="800" font-size="34" fill="#E8483A">PIZZZA</text>`, [112, 75, 38]],
  ['Earrings', `<path d="M50 70 Q50 20 100 20 Q150 20 150 70 L150 90 L50 90 Z" fill="#5A3A2A"/>
    <circle cx="52" cy="84" r="12" fill="#FFD2A6" stroke="#141A33" stroke-width="4"/><circle cx="148" cy="84" r="12" fill="#FFD2A6" stroke="#141A33" stroke-width="4"/>
    <circle cx="100" cy="80" r="46" fill="#FFD2A6" stroke="#141A33" stroke-width="5"/><path d="M58 64 Q100 30 142 64 Q130 40 100 36 Q70 40 58 64 Z" fill="#5A3A2A"/>
    <circle cx="84" cy="80" r="5" fill="#141A33"/><circle cx="116" cy="80" r="5" fill="#141A33"/><path d="M86 100 Q100 110 114 100" fill="none" stroke="#141A33" stroke-width="4" stroke-linecap="round"/>
    <circle cx="52" cy="110" r="11" fill="none" stroke="#E0A800" stroke-width="6"/><polygon points="148,98 160,124 136,124" fill="#6C8CFF" stroke="#141A33" stroke-width="4"/>`, [148, 113, 22]],
  ['Shadows', `<circle cx="36" cy="34" r="20" fill="#FFD84A" stroke="#141A33" stroke-width="4"/><rect x="0" y="120" width="200" height="40" fill="#86DB8E"/>
    <rect x="120" y="50" width="16" height="72" fill="#8A5A3C" stroke="#141A33" stroke-width="4"/><circle cx="128" cy="48" r="30" fill="#4CC38A" stroke="#141A33" stroke-width="4"/>
    <ellipse cx="78" cy="126" rx="52" ry="9" fill="#2E7A52" opacity=".75"/>`, [80, 126, 54]],
];
cards['w2-05-spot-the-fake'] = { theme: 'n', chip: 'Try tonight',
  hl: `Too perfect is<br>the first <mark>clue.</mark>`,
  stage: `
    ${CLUES.map(([t, art, [cx, cy, r]], i) => `
    <div class="box cl" style="left:${(i % 2) * 486}px;top:${Math.floor(i / 2) * 300}px;width:466px;height:280px;padding:0;background:#FFF4DC">
      <svg width="300" height="200" viewBox="0 0 200 160" style="position:absolute;left:20px;top:10px">${art}
        <circle class="ring" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#FF6F4A" stroke-width="6" style="transform-origin:${cx}px ${cy}px"/></svg>
      <div class="big" style="position:absolute;left:24px;bottom:18px;font-size:34px">${t}</div>
      <div class="fd" style="position:absolute;right:20px;top:20px;font:800 24px Sora;padding:4px 16px;border:4px solid #141A33;border-radius:999px;background:#FF6F4A">${['6 fingers', 'ZZZ', "don't match", 'wrong way'][i]}</div></div>`).join('')}`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.cl',{scale:.6,opacity:0,duration:.4,ease:'back.out(2)',stagger:.3},.9)
      .from('.ring',{scale:0,opacity:0,duration:.35,ease:'back.out(3)',stagger:.55},2.4)
      .from('.fd',{scale:0,duration:.3,ease:'back.out(3)',stagger:.55},2.6);` };

// ---------------------------------------------------- useful posts for 15, 16, 19.11 (threads-extra.mjs)
cards['ex-two-answers'] = { theme: 'c', chip: 'Try tonight',
  hl: `Same question.<br>Two <mark>answers.</mark>`,
  stage: `
    <div class="bub" id="oq" style="left:auto;right:0;top:0;font:700 36px Urbanist;background:#FFF9EC">"Tell me a fact about octopuses"</div>
    ${[['Answer 1', 'Octopuses have three hearts.', '#FFF9EC'], ['Answer 2', 'An octopus can taste with its arms.', '#E9EDFF']].map(([l, t, bg], i) => `
    <div class="box an" style="left:${i * 486}px;top:120px;width:466px;height:300px;background:${bg};padding:30px 32px;display:flex;flex-direction:column;gap:18px">
      <div style="display:flex;align-items:center;gap:14px">${icon('bot', 46, 2.4)}<span class="lab" style="font-size:22px">${l}</span></div>
      <div class="big" style="font-size:42px;line-height:1.12">${t}</div></div>`).join('')}
    <div class="big" id="vs" style="position:absolute;left:446px;top:240px;width:60px;height:60px;border:5px solid #141A33;border-radius:50%;background:#FFC533;font-size:30px;display:flex;align-items:center;justify-content:center">≠</div>
    <div class="bub" id="ck" style="left:0;top:470px;font:800 40px Sora;background:#FFC533;display:flex;align-items:center;gap:14px">${icon('search', 40, 3)} Check one together</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#oq',{scale:0,transformOrigin:'100% 50%',duration:.4,ease:'back.out(2.4)'},.9)
      .from('.an',{y:60,opacity:0,duration:.45,ease:'back.out(1.8)',stagger:.8},1.5)
      .from('#vs',{scale:0,rotation:-90,duration:.4,ease:'back.out(3)'},3.0)
      .from('#ck',{scale:0,transformOrigin:'0 50%',duration:.45,ease:'back.out(2.4)'},4.0);` };

cards['ex-is-it-alive'] = { theme: 'y', chip: 'Ask your kid',
  hl: `It talks like a friend.<br>Is it <mark>alive?</mark>`,
  stage: `
    <div class="bub" id="hi" style="left:0;top:0;font:700 38px Urbanist;background:#FFF9EC;display:flex;align-items:center;gap:16px">${icon('bot', 50, 2.4)} "I'm so happy you're here!"</div>
    <div class="box" style="left:0;top:120px;width:952px;height:360px;padding:26px 40px;background:#FFF9EC">
      ${[['Eats', 0], ['Sleeps', 0], ['Misses you', 0], ['Learned from lots of text', 1]].map(([t, ok]) => `
      <div class="rw" style="display:flex;align-items:center;gap:24px;height:77px;border-bottom:3px dashed #D9CDB0">
        <span class="mk" style="flex:none;width:54px;height:54px;border:5px solid #141A33;border-radius:12px;background:${ok ? '#5FE0A8' : '#FF6F4A'};display:flex;align-items:center;justify-content:center">${icon(ok ? 'check' : 'x', 34, 3.4)}</span>
        <span class="big" style="font-size:40px">${t}</span></div>`).join('')}
    </div>
    <div class="bub" id="na" style="left:auto;right:20px;top:500px;font:800 46px Sora;background:#141A33;color:#FFF4DC;transform:rotate(-4deg)">Not alive</div>`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('#hi',{scale:0,transformOrigin:'0 50%',duration:.4,ease:'back.out(2.4)'},.9)
      .from('.rw',{x:-60,opacity:0,duration:.35,stagger:.45},1.6)
      .from('.mk',{scale:0,duration:.3,ease:'back.out(3)',stagger:.45},1.8)
      .from('#na',{scale:2,opacity:0,duration:.35,ease:'power3.in'},4.2);` };

const DOG = (fur, ear2, sock) => `<svg width="300" height="260" viewBox="0 0 200 175">
  <ellipse cx="100" cy="150" rx="60" ry="22" fill="${fur}" stroke="#141A33" stroke-width="5"/>

  ${ear2 ? `<polygon points="144,62 150,18 118,44" fill="${fur}" stroke="#141A33" stroke-width="5" stroke-linejoin="round"/>` : ''}
  <circle cx="100" cy="86" r="50" fill="${fur}" stroke="#141A33" stroke-width="5"/>
  ${ear2 ? `<path d="M60 50 Q34 62 40 112 Q60 110 70 66 Z" fill="#6B3E22" stroke="#141A33" stroke-width="5" stroke-linejoin="round"/>` : `<path d="M60 50 Q34 62 40 112 Q60 110 70 66 Z" fill="#8E93A6" stroke="#141A33" stroke-width="5" stroke-linejoin="round"/><path d="M140 50 Q166 62 160 112 Q140 110 130 66 Z" fill="#8E93A6" stroke="#141A33" stroke-width="5" stroke-linejoin="round"/>`}
  ${ear2 ? `<circle cx="122" cy="76" r="16" fill="#FFF4DC" opacity=".9"/>` : ''}
  <circle cx="82" cy="78" r="6.5" fill="#141A33"/><circle cx="120" cy="78" r="6.5" fill="#141A33"/>
  <ellipse cx="100" cy="104" rx="26" ry="18" fill="#FFF4DC" stroke="#141A33" stroke-width="4"/>
  <ellipse cx="100" cy="96" rx="9" ry="6" fill="#141A33"/>
  ${sock ? `<g transform="rotate(-12 120 128)"><rect x="96" y="114" width="62" height="22" rx="10" fill="#FF6F9A" stroke="#141A33" stroke-width="4"/><rect x="140" y="114" width="18" height="34" rx="9" fill="#FF6F9A" stroke="#141A33" stroke-width="4"/><rect x="104" y="114" width="10" height="22" fill="#FFF4DC"/></g>` : `<path d="M90 114 Q100 122 110 114" fill="none" stroke="#141A33" stroke-width="4" stroke-linecap="round"/>`}
</svg>`;
cards['ex-our-dog'] = { theme: 'n', chip: 'Try tonight',
  hl: `Millions of dogs.<br>Not <mark>yours.</mark>`,
  stage: `
    ${[['"our dog"', DOG('#C9CCD6', false, false), 'A random dog', '#FFF4DC'], ['your kid describes it', DOG('#C98A4B', true, true), 'Your dog', '#FFF9EC']].map(([p, art, cap, bg], i) => `
    <div class="box dg" style="left:${i * 486}px;top:0;width:466px;height:540px;background:${bg};padding:24px;display:flex;flex-direction:column;align-items:center">
      <div class="bub" style="position:relative;font:700 28px Urbanist;background:${i ? '#FFC533' : '#E9EDFF'}">${p}</div>
      ${i ? `<div class="lab dd" style="margin-top:16px;font-size:19px;text-align:center;line-height:1.5">brown · one floppy ear<br>always holding a sock</div>` : '<div style="height:73px"></div>'}
      <div style="margin-top:6px">${art}</div>
      <div class="big" style="font-size:36px">${cap}</div></div>`).join('')}`,
  tl: `
    tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
      .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
      .from('.dg',{y:80,opacity:0,duration:.5,ease:'back.out(1.8)',stagger:1.4},.9)
      .from('.dd',{opacity:0,y:10,duration:.4},2.6);` };

// ------------------------------------------------------------------------------------------ render
const run = (cmd, args) => new Promise((res, rej) => spawn(cmd, args, { stdio: 'inherit' }).on('close', (c) => (c ? rej(new Error(`${cmd} ${c}`)) : res())));

async function render(browser, id) {
  const c = cards[id];
  if (!posts.find((p) => p.id === id) && !cards[id]) throw new Error(`${id}: unknown card`);
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
