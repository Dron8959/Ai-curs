#!/usr/bin/env node
// Renders the Instagram concept: 10 covers, one sample carousel, reel frames, highlight covers, Facebook cover.
//   node social/concept/build.mjs [only-prefix]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { A, C, LOGO, css, star, arrow, card, ring, pill, tape, top, icon } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const M = 'social/media';
const only = process.argv[2];

const char = (who, l, t, w, style = '') =>
  `<img class="char" src="${A(`${LOGO}/logo/char-${who}.svg`)}" style="left:${l}px;top:${t}px;width:${w}px;${style}" alt="">`;
// footer: the wordmark in one colour (the tile's ink), inlined because file:// masks are blocked
const monoWordmark = readFileSync(resolve(here, '../brand/logo/logo/wordmark-light.svg'), 'utf8')
  .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="currentColor"').replace(/ width="[\d.]+" height="[\d.]+"/, ' style="height:34px;width:auto;display:block;color:var(--ink)"');
const foot = (site = true) =>
  `<div style="position:absolute;z-index:9;left:64px;right:64px;bottom:54px;display:flex;justify-content:space-between;align-items:center">
     ${monoWordmark}${site ? '<span style="font:800 28px Urbanist;letter-spacing:.08em;color:var(--ink2)">makeshowlab.com</span>' : ''}</div>`;

// ------------------------------------------------------------------ the ten covers (1080×1440, the grid's 3:4)
const covers = [
  ['01-crayon-to-cartoon', 'y', `
    ${top('show', '01')}
    <h1 class="t">From crayon<br>to <mark>cartoon.</mark></h1>
    ${card({ l: 74, t: 600, w: 420, h: 630, rot: -6, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${tape(206, 574, -12)}
    ${card({ l: 524, t: 668, w: 466, h: 699, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    <span class="note" style="left:548px;top:500px;transform:rotate(-4deg)">one lesson later</span>
    ${arrow(120, 110, 'M14 8 C 60 18, 96 46, 100 96', 'M70 78 L101 98 L112 62', 'left:846px;top:566px')}
    ${pill('drawn by a 6-year-old', 66, 1284, -4)}
    ${star(84, '#fff', 'left:946px;top:1290px')}${star(40, '#fff', 'left:900px;top:1262px')}`],

  ['02-meet-anna-kamilla', 'n', `
    ${top('make', '01')}
    <h1 class="t">Meet Anna<br>&amp; <mark>Kamilla.</mark></h1>
    <p class="sub" style="top:468px">A mom and a daughter.<br>Not a corporation.</p>
    ${ring({ l: 52, t: 650, d: 590, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}
    ${ring({ l: 548, t: 902, d: 478, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}
    ${pill('Anna, mom', 96, 1190, -6, '', `background:${C.coral}`)}
    ${pill('Kamilla, 10', 700, 1326, 4, '', `background:${C.mint}`)}
    ${star(80, C.yellow, 'left:900px;top:700px')}${star(40, C.yellow, 'left:850px;top:660px')}${star(34, C.yellow, 'left:980px;top:800px')}`],

  ['03-ai-house-rules', 'c', `
    ${top('lab', '01')}
    <h1 class="t">5 AI<br><mark>house rules.</mark></h1>
    <span class="note" style="left:500px;top:462px;transform:rotate(-3deg)">save it for the fridge</span>
    ${arrow(120, 90, 'M112 8 C 80 14, 44 30, 18 74', 'M10 38 L16 78 L52 62', 'left:372px;top:490px')}
    ${card({ l: 84, t: 580, w: 912, h: 940, rot: -2.5, inner: `<div style="padding:86px 56px 0;display:grid;gap:42px">${
      ['The account is yours, not theirs', 'No chats with strangers', 'Some things AI never hears', 'Links get a second look', 'Too perfect? Check it']
        .map((r, i) => `<div style="display:flex;align-items:center;gap:30px"><b style="flex:none;display:grid;place-items:center;width:88px;height:88px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 46px Sora">${i + 1}</b><span style="font:800 50px/1.08 Urbanist;color:#141A33">${r}</span></div>`).join('')}</div>` })}
    <i style="position:absolute;z-index:6;left:492px;top:542px;width:92px;height:92px;border-radius:50%;background:${C.mint};border:6px solid #141A33;box-shadow:6px 6px 0 #141A33"></i>`],

  ['04-idea-to-game', 'y', `
    ${top('show', '02')}
    <h1 class="t" style="font-size:118px">Idea at 7:02.<br>Game by <mark>7:41.</mark></h1>
    ${card({ l: 60, t: 478, w: 950, h: 568, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 548, t: 1010, w: 470, h: 330, rot: 5, src: `${M}/landing/together-game.jpg`, z: 5 })}
    ${tape(700, 986, 6)}
    ${pill('made by Kamilla, 10', 66, 1104, -4)}
    <span class="note" style="left:78px;top:1262px;transform:rotate(-3deg);font-size:60px">39 minutes later</span>
    ${arrow(90, 60, 'M6 36 C 28 12, 54 10, 80 28', 'M56 6 L82 30 L50 46', 'left:436px;top:1262px')}`],

  ['05-reason-to-show', 'c', `
    ${top('lab', '02')}
    <p class="kick" style="top:182px">Not more screen time.</p>
    <h1 class="t" style="top:248px;font-size:130px">A reason to<br><mark>show you.</mark></h1>
    ${card({ l: 92, t: 620, w: 896, h: 750, rot: 2.5, src: `${M}/landing/step-show.jpg`, pos: '82% 30%' })}
    ${tape(450, 594, -5)}
    <span class="note" style="left:70px;top:516px;transform:rotate(-3deg);font-size:60px">the “look what I made” face</span>
    ${arrow(100, 120, 'M20 6 C 6 50, 30 86, 76 104', 'M44 110 L80 106 L66 72', 'left:760px;top:540px')}`],

  ['06-watch-make-show', 'n', `
    ${top('make', '02')}
    <h1 class="t">Watch.<br><span style="color:${C.yellow}">Make.</span><br><span style="color:${C.coral}">Show.</span></h1>
    <p class="sub" style="top:598px">One lesson. 6 to 20 minutes.</p>
    ${card({ l: 56, t: 720, w: 440, h: 330, rot: -4, src: `${M}/landing/step-watch.jpg` })}
    ${card({ l: 322, t: 900, w: 440, h: 330, rot: 3, src: `${M}/landing/step-make.jpg`, z: 4 })}
    ${card({ l: 590, t: 1066, w: 440, h: 330, rot: -3, src: `${M}/landing/step-show.jpg`, pos: '70% 30%', z: 5 })}
    ${[[30, 690], [300, 874], [566, 1040]].map(([l, t], i) => `<span class="num" style="left:${l}px;top:${t}px;width:98px;height:98px;z-index:8;box-shadow:6px 6px 0 #070A1F">${i + 1}</span>`).join('')}
    ${star(70, C.yellow, 'left:920px;top:760px')}${star(36, C.yellow, 'left:870px;top:720px')}`],

  ['07-made-by-10-year-old', 'y', `
    ${top('show', '03')}
    <h1 class="t" style="font-size:122px">Made by a<br><mark>10-year-old.</mark></h1>
    ${pill('no code', 770, 196, 7, 'dark')}
    ${card({ l: 56, t: 520, w: 390, h: 540, rot: -5, src: `${M}/landing/cartoon-friends.jpg`, pos: '50% 30%' })}
    ${card({ l: 410, t: 560, w: 610, h: 380, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}
    ${card({ l: 110, t: 1020, w: 320, h: 340, rot: 5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%', z: 5 })}
    ${card({ l: 452, t: 1010, w: 570, h: 276, rot: -3, src: `${M}/landing/website-canva.jpg`, cls: 'screen', z: 5 })}
    ${pill('cartoon', 40, 1010, -6, '', 'height:58px;font-size:26px;padding:0 22px')}
    ${pill('game', 850, 520, 5, '', 'height:58px;font-size:26px;padding:0 22px')}
    ${pill('website', 800, 1296, -3, '', 'height:58px;font-size:26px;padding:0 22px')}`],

  ['08-will-ai-think', 'c', `
    ${top('lab', '03')}
    <h1 class="t" style="font-size:124px">Will AI think<br>for <mark>my kid?</mark></h1>
    ${char('kamilla', -50, 752, 660)}
    ${['She decides', 'She tells the AI', 'She checks it', 'She fixes it'].map((s, i) => `
      <span class="pill" style="left:${i % 2 ? 560 : 500}px;top:${506 + i * 150}px;height:112px;padding:0 38px 0 18px;gap:22px;font:800 42px Sora;letter-spacing:-.03em;text-transform:none;transform:rotate(${[-3, 2, -2, 3][i]}deg);background:#FFF4DC">
        <b style="display:grid;place-items:center;width:74px;height:74px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 38px Sora">${i + 1}</b>${s}</span>`).join('')}
    <span class="note" style="left:618px;top:1150px;transform:rotate(-3deg);font-size:60px">the thinking</span>
    <span class="note" style="left:618px;top:1214px;transform:rotate(-3deg);font-size:60px">stays with her</span>
    ${arrow(110, 80, 'M104 10 C 76 50, 46 62, 10 58', 'M36 34 L8 58 L40 76', 'left:640px;top:1290px')}`],

  ['09-first-families', 'y', `
    ${top('show', '04')}
    <h1 class="t" style="font-size:120px">8 families<br>tried it <mark>first.</mark></h1>
    ${card({ l: 60, t: 520, w: 960, h: 520, rot: -1.5, inner: `<div style="padding:70px 62px 0">
      <p style="font:700 52px/1.22 Urbanist;color:#141A33">“We made our own little cartoon together, and he was so excited to show it to his dad.”</p>
      <p style="margin-top:34px;font:800 30px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">Emily, mom of a 9-year-old</p></div>` })}
    ${ring({ l: 800, t: 930, d: 200, src: `${M}/landing/reviews/emily.jpg`, pos: '62% 30%', zoom: 190, z: 6, pad: 12 })}
    ${['margaret', 'susan', 'linda', 'patricia', 'jessica', 'amanda', 'rachel'].map((n, i) =>
      ring({ l: 56 + i * 114, t: 1128, d: 168, src: `${M}/landing/reviews/${n}.jpg`, pos: { margaret: '50% 30%', susan: '55% 30%', linda: '50% 25%', patricia: '55% 25%', jessica: '40% 20%', amanda: '35% 35%', rachel: '60% 20%' }[n], zoom: 170, z: 5 + i, pad: 9 })).join('')}
    <p class="fine" style="top:1336px">Early-access families. They got the course free<br>and told us what happened at their table.</p>`],

  ['10-free-first-lesson', 'm', `
    ${top('start')}
    <h1 class="t"><mark>Free</mark> first<br>lesson.</h1>
    <p class="kick" style="top:462px">Your kid builds a game tonight.</p>
    ${card({ l: 86, t: 580, w: 908, h: 544, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    <span class="btn" style="left:96px;top:1090px;transform:rotate(-3deg)">Build it tonight ${icon('arrow-right', 58, '#FFF4DC', 3)}</span>
    ${pill('10–20 min', 760, 1150, 6)}
    ${pill('no card, just email', 104, 1290, -2)}
    ${star(80, '#fff', 'left:900px;top:1270px')}${star(38, '#fff', 'left:850px;top:1240px')}${star(46, '#fff', 'left:960px;top:1210px')}`],
];

// ------------------------------------------------------------------ sample carousel: lab · 01, all slides
const rule = (n, title, body, ic, tint) => ['k', `
    ${top('lab', '01', `<span class="page">${n + 1} / 7</span>`)}
    <span class="num" style="left:64px;top:214px;width:200px;height:200px;font-size:124px;background:${C.coral}">${n}</span>
    <h1 class="t" style="top:478px;font-size:116px">${title}</h1>
    <p class="sub" style="top:780px;font-size:54px;right:120px">${body}</p>
    <i style="position:absolute;z-index:4;right:70px;bottom:150px;display:grid;place-items:center;width:300px;height:300px;border-radius:50%;background:${tint};border:6px solid #141A33;box-shadow:12px 12px 0 #141A33;transform:rotate(8deg)">${icon(ic, 150, '#141A33', 2.2)}</i>
    ${foot()}`];
const carousel = [
  ['c', covers[2][2]],
  rule(1, 'The account<br>is <mark>yours.</mark>', 'Every tool runs on the parent’s account. Your kid never signs up alone.', 'user-round-check', C.mint),
  rule(2, 'No chats with<br><mark>strangers.</mark>', 'No DMs. No comments.<br>Nobody your kid doesn’t know.', 'message-circle-off', C.yellow),
  rule(3, 'Some things AI<br><mark>never hears.</mark>', 'Kids learn what never to share with an AI. And why.', 'lock', C.mint),
  rule(4, 'Links get a<br><mark>second look.</mark>', 'Never click a suspicious link. Kids learn how to tell one.', 'link', C.yellow),
  rule(5, 'Too perfect?<br><mark>Check it.</mark>', 'A picture, a video, a text. Any of them can be fake.', 'eye', C.mint),
  ['c', `
    ${top('lab', '01', `<span class="page">7 / 7</span>`)}
    <h1 class="t" style="top:230px">Save it.<br>Send it to<br><mark>a parent.</mark></h1>
    <p class="sub" style="top:690px;font-size:52px;color:#141A33">This is how every lesson in Make Show Lab works. First one is free.</p>
    <span class="btn" style="left:64px;top:930px;transform:rotate(-2deg)">makeshowlab.com</span>
    ${char('anna', 540, 860, 600)}
    ${foot(false)}`],
];

// ------------------------------------------------------------------ reel frames for show · 01 (1080×1920)
const plate = `<img src="${A(`${LOGO}/reels/plate.svg`)}" style="position:absolute;z-index:9;left:36px;top:234px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.28))" alt="">`;
const reel = [
  ['y', `${plate}
    <h1 class="t" style="top:520px;font-size:150px">A 6-year-old<br>drew <mark>this.</mark></h1>
    ${card({ l: 280, t: 900, w: 520, h: 780, rot: -4, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}${tape(450, 874, -10)}`],
  ['y', `${plate}
    <h1 class="t" style="top:520px;font-size:150px">One lesson<br><mark>later.</mark></h1>
    ${card({ l: 50, t: 940, w: 400, h: 600, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 470, t: 900, w: 540, h: 810, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${star(110, '#fff', 'left:900px;top:820px')}${star(50, '#fff', 'left:850px;top:770px')}`],
  ['n', `${plate}
    <h1 class="t" style="top:520px;font-size:140px">Who did<br><mark>what.</mark></h1>
    ${[['The kid', 'the idea and the drawing'], ['The AI', 'follows the drawing'], ['You', 'right next to them']].map(([a, b], i) => `
      <div class="card" style="left:${64 + (i % 2) * 30}px;top:${900 + i * 226}px;width:930px;height:186px;transform:rotate(${[-2, 1.5, -1][i]}deg);display:flex;align-items:center;gap:30px;padding:0 40px">
        <b style="font:800 58px Sora;letter-spacing:-.04em;color:#141A33;white-space:nowrap">${a}:</b><span style="font:700 50px/1.05 Urbanist;color:#141A33">${b}</span></div>`).join('')}`],
  ['n', `
    <img src="${A(`${LOGO}/reels/end-logo.svg`)}" style="position:absolute;z-index:5;left:50%;top:470px;width:740px;transform:translateX(-50%)" alt="">
    <span class="btn" style="left:50%;top:1150px;transform:translateX(-50%);background:${C.yellow};color:#141A33;border-color:${C.yellow};box-shadow:12px 12px 0 #070A1F">First lesson free</span>
    <p class="sub" style="top:1330px;text-align:center;left:0;right:0;font-size:50px;color:#FFF4DC">makeshowlab.com</p>`],
];

// ------------------------------------------------------------------ highlight covers (circle crops) and the Facebook cover
const hl = [
  ['free-lesson', C.mint, icon('gift', 190, '#141A33', 2)],
  ['how-it-works', C.navy, icon('list-ordered', 190, C.yellow, 2)],
  ['kid-made', C.yellow, icon('star', 190, '#141A33', 2)],
  ['is-it-safe', C.coral, icon('shield-check', 190, '#141A33', 2)],
  ['pricing', C.cream, icon('tag', 190, '#141A33', 2)],
  ['about-us', C.navy, `<img src="${A(`${LOGO}/logo/icon-plain.svg`)}" style="width:300px" alt="">`],
];

const pages = [];
covers.forEach(([id, theme, html]) => pages.push({ file: `cover-${id}.jpg`, w: 1080, h: 1440, html: `<div class="tile ${theme}">${html}</div>` }));
carousel.forEach(([theme, html], i) => pages.push({ file: `carousel-lab01-${i + 1}.jpg`, w: 1080, h: 1440, html: `<div class="tile ${theme}">${html}</div>` }));
reel.forEach(([theme, html], i) => pages.push({ file: `reel-show01-${i + 1}.jpg`, w: 1080, h: 1920, html: `<div class="tile reel ${theme}">${html}</div>` }));
hl.forEach(([id, bg, inner]) => pages.push({ file: `highlight-${id}.jpg`, w: 400, h: 400, html: `<div style="width:400px;height:400px;background:${bg};display:grid;place-items:center">${inner}</div>` }));
pages.push({ file: 'facebook-cover.jpg', w: 1640, h: 624, html: `
  <div class="tile k" style="width:1640px;height:624px">
    <i style="position:absolute;left:930px;top:-130px;width:800px;height:800px;border-radius:50%;background:${C.yellow}"></i>
    <img src="${A(`${LOGO}/logo/logo-horizontal-light.svg`)}" style="position:absolute;left:286px;top:150px;width:590px" alt="">
    <span class="pill dark" style="left:300px;top:392px;height:76px;font-size:28px;box-shadow:6px 6px 0 ${C.yellow}">First lesson free · makeshowlab.com</span>
    ${card({ l: 1000, t: 160, w: 216, h: 324, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 1168, t: 118, w: 240, h: 360, rot: 5, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${star(60, C.coral, 'left:1420px;top:80px')}${star(30, C.coral, 'left:1470px;top:150px')}${star(44, C.mint, 'left:210px;top:90px')}
  </div>` });

const browser = await chromium.launch();
for (const p of pages) {
  if (only && !p.file.startsWith(only)) continue;
  const pg = await (await browser.newContext({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 })).newPage();
  const tmp = join(out, '.tmp.html');
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style>${p.html}`);
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(120);
  await pg.screenshot({ path: join(out, p.file), type: 'jpeg', quality: 92 });
  await pg.close();
  unlinkSync(tmp);
  console.log(p.file);
}
await browser.close();
