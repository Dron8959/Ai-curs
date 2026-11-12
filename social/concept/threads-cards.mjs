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
    ['v2-r2-strangers', 'user-x', `Nobody new<br><mark>gets in.</mark>`, 'No chat with strangers'],
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

  // 4. kids just say what they want. grown ups write three paragraphs first.
  'v2-04-who-asks-better': { theme: 'y', chip: 'You decide',
    hl: `Who asks AI<br><mark>better?</mark>`,
    stage: `
      <div class="box" style="left:0;top:0;width:400px;height:600px;padding:30px">
        <div class="lab">Kid, 10</div>
        <div class="bub" id="kq" style="position:relative;margin-top:24px;white-space:normal;background:#FFF4DC;font:700 36px/1.2 Urbanist">Make a game where my cat is the boss</div>
        <div class="bub" id="kt" style="left:30px;bottom:30px;font:800 34px Sora;background:#5FE0A8">1 line</div>
      </div>
      <div class="box" style="left:440px;top:0;width:512px;height:600px;padding:30px">
        <div class="lab">Grown up</div>
        ${[0, 1, 2].map((g) => `<div style="margin-top:${g ? 26 : 24}px">${[1, .92, .97, .6].map((w) => `<div class="ln" style="height:18px;border-radius:9px;background:#C9C3B2;margin-top:12px;width:${w * 100}%"></div>`).join('')}</div>`).join('')}
        <div class="bub" id="gt" style="right:30px;bottom:30px;font:800 34px Sora;background:#FF6F4A">3 paragraphs</div>
      </div>`,
    tl: `
      tl.from('.hl',{y:40,opacity:0,duration:.5,ease:'back.out(2)'},0)
        .from('.hl mark',{scale:0,duration:.4,ease:'back.out(3)'},.45)
        .from('#kq',{scale:0,transformOrigin:'0 0',duration:.4,ease:'back.out(2.4)'},1.0)
        .from('#kt',{scale:0,duration:.35,ease:'back.out(2.6)'},1.6)
        .from('.ln',{width:0,duration:.22,ease:'none',stagger:.18},1.4)
        .from('#gt',{scale:0,duration:.35,ease:'back.out(2.6)'},4.0);` },

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
cards['v2-12-age'] = cards['07-by-age'];
cards['v2-03-did-she-make-it'] = cards['10-is-it-cheating'];
cards['v2-13-two-kids'] = { ...cards['02-answer-machine'], hl: `Same chatbot.<br>Which kid would<br>you <mark>stop?</mark>` };


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
