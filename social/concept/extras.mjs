#!/usr/bin/env node
// Profile extras in the same system: six highlights (a themed cover and a title story each), the Facebook cover,
// the X header and the YouTube banner.
//   node social/concept/extras.mjs      -> social/concept/out/
import { createRequire } from 'node:module';
import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { A, C, LOGO, M, css, here, star, card, ring, pill, icon, plate } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

// Six highlights. Each gets a themed cover (what the round button shows) and a title story (the "заставка" that
// opens the highlight). The cover keeps one bold thing in the middle: Instagram shows it 64 px wide.
const small = 'height:54px;font-size:24px;padding:0 20px;box-shadow:4px 4px 0 #141A33';
const HL = [
  { id: 'free-lesson', theme: 'm', title: 'Free<br><mark>first lesson</mark>', sub: 'Your kid builds a game tonight.',
    cover: `${card({ l: 62, t: 104, w: 276, h: 172, rot: -4, src: `${M}/landing/game.jpg`, cls: 'screen' })}${pill('free', 150, 250, 5, '', small)}`,
    art: `${card({ l: 64, t: 1010, w: 786, h: 477, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen' })}${pill('10–20 minutes', 96, 1440, -4)}${pill('no card', 560, 1470, 4)}` },
  { id: 'how-it-works', theme: 'n', title: 'How it<br><mark>works</mark>', sub: 'Watch. Make. Show.<br>6 to 20 minutes.',
    cover: [C.cream, C.yellow, C.coral].map((c, i) => `<span class="num" style="left:${46 + i * 106}px;top:152px;width:96px;height:96px;font-size:56px;background:${c};box-shadow:5px 5px 0 #070A1F">${i + 1}</span>`).join(''),
    art: [['Watch', C.cream], ['Make', C.yellow], ['Show', C.coral]].map(([w, c], i) => `<span class="num" style="left:${64 + i * 262}px;top:1040px;width:220px;height:220px;font-size:128px;background:${c};box-shadow:10px 10px 0 #070A1F">${i + 1}</span>${pill(w, 92 + i * 262, 1300, i % 2 ? 3 : -3)}`).join('') },
  { id: 'kid-made', theme: 'y', title: 'Made<br>by <mark>kids</mark>', sub: 'Real work from real lessons.',
    cover: `${card({ l: 108, t: 74, w: 184, h: 250, rot: -5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%' })}${star(60, '#fff', 'left:286px;top:86px')}`,
    art: `${card({ l: 64, t: 980, w: 330, h: 440, rot: -5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%' })}${card({ l: 360, t: 1010, w: 490, h: 300, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}${card({ l: 300, t: 1290, w: 500, h: 320, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330, z: 5 })}` },
  { id: 'is-it-safe', theme: 'c', title: 'Is it<br><mark>safe?</mark>', sub: 'The account is yours.<br>No chats with strangers.',
    cover: `<i class="badge" style="left:92px;top:92px;width:216px;height:216px;background:#FFF4DC;box-shadow:8px 8px 0 #141A33">${icon('shield-check', 124, '#141A33', 2.2)}</i>`,
    art: `<i class="badge" style="left:200px;top:1060px;width:440px;height:440px;background:#FFF4DC;transform:rotate(-5deg)">${icon('shield-check', 240, '#141A33', 2.2)}</i>` },
  { id: 'pricing', theme: 'k', title: 'One<br><mark>price</mark>', sub: 'No subscription. No sales calls.',
    cover: `<h1 class="t" style="left:0;right:0;top:136px;text-align:center;font-size:100px"><mark>$197</mark></h1>`,
    art: [['$197', 'Creator', 'the full course, every lesson and project'], ['$297', 'Creator + Homework', 'Anna checks homework the same day']].map(([p, n, d], i) =>
      card({ l: 64, t: 1000 + i * 250, w: 786, h: 210, rot: i ? 1.5 : -1.5, inner: `<div style="display:flex;align-items:center;gap:30px;height:100%;padding:0 36px"><b style="font:800 86px Sora;letter-spacing:-.05em;color:#141A33">${p}</b><span style="font:800 40px/1.1 Urbanist;color:#141A33">${n}<br><span style="font:700 30px Urbanist;color:#4B5070">${d}</span></span></div>` })).join('') },
  { id: 'about-us', theme: 'n', title: 'About<br><mark>us</mark>', sub: 'A mom and a daughter.<br>Not a corporation.',
    cover: `${ring({ l: 44, t: 84, d: 200, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250, pad: 10 })}${ring({ l: 186, t: 150, d: 172, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5, pad: 9 })}`,
    art: `${ring({ l: 64, t: 990, d: 460, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}${ring({ l: 440, t: 1150, d: 410, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}${pill('Anna, mom', 80, 1440, -5, '', `background:${C.coral}`)}${pill('Kamilla, 10', 560, 1560, 4, '', `background:${C.mint}`)}` },
];
const pages = [];
for (const h of HL) {
  pages.push({ file: `highlight-${h.id}.jpg`, w: 400, h: 400, html: `<div class="tile ${h.theme}" style="width:400px;height:400px">${h.cover}</div>` });
  pages.push({ file: `story-${h.id}.jpg`, w: 1080, h: 1920, html: `<div class="tile reel ${h.theme}" style="width:1080px">${plate()}
    <h1 class="t" style="top:440px;right:64px;font-size:156px">${h.title}</h1><p class="sub" style="top:800px;right:64px;font-size:56px">${h.sub}</p>${h.art}</div>` });
}
// Facebook cover, 1640×624: everything that matters sits in the middle 1100 px that phones keep
pages.push({ file: 'facebook-cover.jpg', w: 1640, h: 624, html: `
  <div class="tile k" style="width:1640px;height:624px">
    <i style="position:absolute;left:930px;top:-130px;width:800px;height:800px;border-radius:50%;background:${C.yellow}"></i>
    <img src="${A(`${LOGO}/logo/logo-horizontal-light.svg`)}" style="position:absolute;left:286px;top:150px;width:590px" alt="">
    <span class="pill dark" style="left:300px;top:392px;height:76px;font-size:28px;box-shadow:6px 6px 0 ${C.yellow}">First lesson free · makeshowlab.com</span>
    ${card({ l: 1000, t: 160, w: 216, h: 324, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 1168, t: 118, w: 240, h: 360, rot: 5, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${star(60, C.coral, 'left:1420px;top:80px')}${star(30, C.coral, 'left:1470px;top:150px')}${star(44, C.mint, 'left:210px;top:90px')}
  </div>` });

// X header, 1500×500. The round profile photo covers the lower left, so everything starts at x 330.
pages.push({ file: 'x-header.jpg', w: 1500, h: 500, html: `
  <div class="tile k" style="width:1500px;height:500px">
    <i style="position:absolute;left:1000px;top:-170px;width:760px;height:760px;border-radius:50%;background:${C.yellow}"></i>
    <img src="${A(`${LOGO}/logo/logo-horizontal-light.svg`)}" style="position:absolute;left:330px;top:92px;width:500px" alt="">
    <p style="position:absolute;left:336px;top:262px;width:620px;font:800 36px/1.18 Urbanist;color:#141A33">Don’t let AI think for your child.<br>Teach them to think with it.</p>
    <span class="pill dark" style="left:336px;top:382px;height:64px;font-size:25px;box-shadow:5px 5px 0 ${C.yellow}">First lesson free · makeshowlab.com</span>
    ${card({ l: 1040, t: 150, w: 330, h: 198, rot: -5, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 1250, t: 96, w: 190, h: 290, rot: 6, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%', z: 4 })}
    ${star(46, C.coral, 'left:960px;top:60px')}${star(26, C.coral, 'left:1010px;top:110px')}
  </div>` });
// YouTube banner, 2560×1440. Phones show only the middle 1546×423; desktops the full width of that strip; TVs all of it.
pages.push({ file: 'youtube-banner.jpg', w: 2560, h: 1440, html: `
  <div class="tile n" style="width:2560px;height:1440px">
    <i style="position:absolute;left:-200px;top:1010px;width:2960px;height:1500px;border-radius:50%;background:#1F2A52"></i>
    <img src="${A(`${LOGO}/logo/logo-horizontal-dark.svg`)}" style="position:absolute;left:560px;top:548px;width:760px" alt="">
    <p style="position:absolute;left:1390px;top:560px;width:620px;font:800 46px/1.16 Urbanist;color:#FFF4DC">Your kid makes a cartoon, a game, a song with AI. You sit next to them.</p>
    <span class="pill" style="left:1390px;top:800px;height:76px;font-size:29px;background:${C.yellow};box-shadow:6px 6px 0 #070A1F">First lesson free · makeshowlab.com</span>
    ${card({ l: 70, t: 470, w: 380, h: 228, rot: -5, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 2130, t: 500, w: 250, h: 380, rot: 5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%' })}
    ${card({ l: 700, t: 130, w: 560, h: 330, rot: -3, src: `${M}/landing/together-game.jpg` })}
    ${card({ l: 1400, t: 1010, w: 520, h: 340, rot: 3, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330 })}
    ${star(90, C.yellow, 'left:2010px;top:300px')}${star(50, C.yellow, 'left:1950px;top:250px')}${star(70, C.coral, 'left:420px;top:1050px')}
  </div>` });

const browser = await chromium.launch();
for (const p of pages) {
  const pg = await (await browser.newContext({ viewport: { width: p.w, height: p.h } })).newPage();
  const tmp = join(out, '.tmp.html');
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style>${p.html}`);
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: join(out, p.file), type: 'jpeg', quality: 92 });
  await pg.context().close();
  unlinkSync(tmp);
  console.log(p.file);
}
await browser.close();
