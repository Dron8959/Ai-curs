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
const posts = [...shared.map((p) => ({ id: p.id })), ...threadsOnly.map((p) => ({ id: p.id }))];

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
      ${[['Idea', 'hers', 1], ['Words', 'hers', 1], ['Music', 'AI', 0], ['Sang it for grandma', 'hers', 1]].map(([t, who, mine], i) => `
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
  'threads-06-tuesday-night': { theme: 'y', chip: 'Unpopular opinion',
    hl: `Watch.<br><mark>Make.</mark><br>Show.`,
    stage: `
      ${[['play', 'Watch', 'a finished thing', '#FFF9EC'], ['pencil', 'Make', 'your own', '#FF6F4A'], ['send', 'Show', 'someone', '#5FE0A8']].map(([n, t, d, c], i) => `
      <div class="box lp" style="left:${i * 326}px;top:30px;width:300px;height:360px;background:${c};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
        ${icon(n, 100, 2.4)}<div class="big" style="font-size:58px">${t}</div><div class="lab" style="font-size:24px;letter-spacing:.04em;text-transform:none;font-weight:700">${d}</div>
      </div>`).join('')}
      <div class="bub" id="mn" style="left:250px;top:470px;font:800 40px Sora;padding:20px 34px">6 to 20 min</div>
      <div class="bub" id="nq" style="left:100px;top:570px;font:700 32px Urbanist;background:#141A33;color:#FFF4DC;box-shadow:6px 6px 0 #FFFFFF">no quiz at the end</div>`,
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
