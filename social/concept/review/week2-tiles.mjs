// Stage 2 of next week's pack: one key picture per post (the cover / first frame, 3:4 like the grid), built
// from the same kit as the first ten so every series keeps its frame. The reels take their first scene from it.
//   node social/concept/review/week2-tiles.mjs [n]   ->  social/concept/out/week2/NN.jpg
import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { css, here, C, M, A, top, card, ring, pill, tape, star, arrow, char, icon } from '../kit.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const W2 = 'social/concept/out/week2/assets';
const out = join(here, 'out', 'week2');
mkdirSync(out, { recursive: true });

const h1 = (html, top = 190, size = 120) => `<h1 class="t" style="top:${top}px;font-size:${size}px">${html}</h1>`;
const bubble = (html, l, t, w, { me = false, rot = 0, size = 46 } = {}) =>
  `<div style="position:absolute;z-index:6;left:${l}px;top:${t}px;width:${w}px;transform:rotate(${rot}deg);background:${me ? '#141A33' : '#FFFFFF'};color:${me ? '#FFF4DC' : '#141A33'};border:6px solid #141A33;border-radius:42px ${me ? '42px 10px' : '42px 42px 10px'} 42px;box-shadow:10px 10px 0 #141A33;padding:30px 38px;font:700 ${size}px/1.2 Urbanist">${html}</div>`;
const bar = (w, color = '#141A33') => `<i style="display:inline-block;height:34px;width:${w}px;border-radius:10px;background:${color};vertical-align:middle"></i>`;
const tick = (ok) => `<b style="flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:${ok ? C.mint : C.coral};border:5px solid #141A33;font:800 36px Sora;color:#141A33">${ok ? '✓' : '✕'}</b>`;
const listBox = (rows, l, t, w, gap = 26) => `<div class="card" style="left:${l}px;top:${t}px;width:${w}px;height:auto;padding:40px 44px;display:grid;gap:${gap}px;background:#FFF4DC">${rows}</div>`;
const row = (left, text, size = 44) => `<div style="display:flex;align-items:center;gap:24px">${left}<span style="font:800 ${size}px/1.1 Urbanist;color:#141A33">${text}</span></div>`;
const numDot = (n) => `<b style="flex:none;display:grid;place-items:center;width:70px;height:70px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 36px Sora">${n}</b>`;

// a hand drawn close to a real one: skin shading, knuckles, nails; thumb plus five fingers, counted above the tips
const hand = (l, t) => {
  // [base x, base y, length, width, angle]
  const F = [[222, 470, 250, 70, -11], [296, 455, 290, 72, -4], [368, 458, 270, 70, 2], [436, 468, 245, 66, 8], [500, 488, 200, 60, 15]];
  const TH = [215, 660, 255, 88, -50];
  const g = ([x, y, L, w, r], body) => `<g transform="rotate(${r} ${x} ${y})">${body(x, y, L, w)}</g>`;
  const cap = (x, y, L, w) => `<rect x="${x - w / 2}" y="${y - L}" width="${w}" height="${L + 90}" rx="${w / 2}"/>`;
  const palm = 'M150 500 C150 450 185 430 230 432 L520 445 C565 450 585 480 580 525 L566 690 C556 790 495 840 420 850 L290 850 C205 840 165 780 158 700 Z';
  const detail = (x, y, L, w) => `
    <ellipse cx="${x}" cy="${y - L + w * 0.62}" rx="${w * 0.3}" ry="${w * 0.42}" fill="#F7D9C4" stroke="#C98D6E" stroke-width="2.5"/>
    <path d="M${x - w * 0.28} ${y - L * 0.62} q${w * 0.28} ${-w * 0.12} ${w * 0.56} 0" stroke="#C47E5C" stroke-width="3" fill="none" opacity=".7"/>
    <path d="M${x - w * 0.3} ${y - L * 0.32} q${w * 0.3} ${-w * 0.14} ${w * 0.6} 0" stroke="#C47E5C" stroke-width="3" fill="none" opacity=".7"/>
    <path d="M${x - w * 0.36} ${y - L + w * 0.5} L${x - w * 0.36} ${y - L * 0.18}" stroke="#FFF" stroke-width="6" opacity=".22" stroke-linecap="round"/>`;
  const tips = [...F.map(([x, y, L, , r]) => [x + Math.sin(r * Math.PI / 180) * (L + 46), y - Math.cos(r * Math.PI / 180) * (L + 46)]),
    [TH[0] + Math.sin(TH[4] * Math.PI / 180) * (TH[2] + 46), TH[1] - Math.cos(TH[4] * Math.PI / 180) * (TH[2] + 46)]];
  const order = [5, 0, 1, 2, 3, 4];  // count from the thumb
  return `<svg style="position:absolute;z-index:5;left:${l}px;top:${t}px;width:720px;height:880px;overflow:visible" viewBox="0 0 720 880">
  <defs><linearGradient id="skin" gradientUnits="userSpaceOnUse" x1="120" y1="150" x2="620" y2="860"><stop offset="0" stop-color="#F8CFB3"/><stop offset=".55" stop-color="#EDB08F"/><stop offset="1" stop-color="#D99576"/></linearGradient>
  <radialGradient id="palmshade" gradientUnits="userSpaceOnUse" cx="370" cy="640" r="260"><stop offset="0" stop-color="#FFE3CF" stop-opacity=".55"/><stop offset="1" stop-color="#FFE3CF" stop-opacity="0"/></radialGradient></defs>
  <g fill="#A8684A" stroke="#8E5539" stroke-width="10" stroke-linejoin="round">${F.map((f) => g(f, cap)).join('')}${g(TH, cap)}<path d="${palm}"/></g>
  <g fill="url(#skin)"><path d="${palm}"/>${F.map((f) => g(f, cap)).join('')}${g(TH, cap)}</g><path d="${palm}" fill="url(#palmshade)"/>
  ${F.map((f) => g(f, detail)).join('')}${g(TH, detail)}
  <path d="M215 560 C300 600 420 590 545 545" stroke="#C47E5C" stroke-width="4" fill="none" opacity=".55"/>
  <path d="M205 620 C290 660 380 670 470 650" stroke="#C47E5C" stroke-width="4" fill="none" opacity=".45"/>
  <path d="M300 820 C300 740 330 680 380 640" stroke="#C47E5C" stroke-width="4" fill="none" opacity=".4"/>
  ${order.map((k, i) => { const [x, y] = tips[k]; return `<circle cx="${x}" cy="${y}" r="34" fill="${i === 5 ? '#141A33' : '#FFF4DC'}" stroke="#141A33" stroke-width="6"/><text x="${x}" y="${y + 15}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="40" fill="${i === 5 ? '#FFC533' : '#141A33'}">${i + 1}</text>`; }).join('')}
  </svg>`;
};

export const TILES = {
  11: { theme: 'c', html: `${top('lab')}${h1('Why does AI draw<br><mark>six fingers?</mark>')}${hand(150, 520)}
    <span class="note" style="left:760px;top:520px;transform:rotate(6deg)">wait, 6?</span>${star(70, '#fff', 'left:900px;top:640px')}` },
  12: { theme: 'n', html: `${top('make')}${h1('How much AI at<br><mark>6, 10 and 14?</mark>', 190, 112)}
    ${[['6', 'they talk, you type', 90], ['10', 'they do most of it', 420], ['14', 'you stay in the room', 640]].map(([a, t, w], i) =>
      `<div style="position:absolute;z-index:6;left:64px;right:64px;top:${560 + i * 260}px;display:flex;align-items:center;gap:34px">
        <span class="num" style="position:relative;width:150px;height:150px;font-size:76px;flex:none">${a}</span>
        <div><p style="font:800 50px Sora;letter-spacing:-.03em;color:#FFF4DC">${t}</p><p style="margin-top:14px">${bar(w, C.yellow)}${bar(700 - w, '#2A3366')}</p></div></div>`).join('')}
    <p class="fine" style="top:1320px;color:#B9C0DE">yellow: the kid’s share of the keyboard</p>` },
  13: { theme: 'y', html: `${top('show')}${h1('A 10-year-old made<br><mark>this cartoon.</mark>', 190, 108)}
    ${card({ l: 90, t: 520, w: 900, h: 640, rot: -2, src: `${M}/landing/cartoon-friends.jpg`, pos: '50% 35%' })}
    ${pill('How?', 700, 470, 6, 'dark', 'height:110px;font-size:52px;text-transform:none;letter-spacing:-.02em')}
    ${pill('about 20 minutes', 90, 1200, -3)}${pill('2-3 tries a scene', 560, 1230, 3)}` },
  14: { theme: 'c', html: `${top('lab')}${h1('5 safe ways<br>to give your<br>kid <mark>AI</mark>', 190, 104)}
    ${listBox(['Your account, not theirs', 'You sit side by side', 'No chats with strangers', 'Some things stay out of AI', 'Too perfect? Check it'].map((t) => row(tick(true), t)).join(''), 84, 600, 912)}
    <span class="note" style="left:600px;top:1300px;transform:rotate(-4deg);font-size:58px">comment RULES</span>` },
  15: { theme: 'k', html: `${top('lab')}${h1('How does AI draw<br><mark>from words?</mark>', 190, 104)}
    ${[['noise', -5, 'step 1'], ['half', 2, 'step 20'], ['almost', -2, 'step 40']].map(([f, r, s], i) => card({ l: 60 + i * 330, t: 610 + (i % 2) * 40, w: 300, h: 450, rot: r, src: `${W2}/${f}.jpg`, z: 3 + i })).join('')}
    ${[['step 1', 90], ['step 20', 420], ['the end', 750]].map(([s, l]) => pill(s, l, 1130, -2)).join('')}
    <span class="note" style="left:90px;top:470px;transform:rotate(-3deg);font-size:56px">it starts with TV static</span>` },
  16: { theme: 'm', html: `${top('start')}${h1('Tonight: a game<br><mark>your kid made.</mark>', 190, 112)}
    ${card({ l: 86, t: 540, w: 908, h: 560, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${pill('10-20 min', 90, 1150, -4)}${pill('no card, just email', 450, 1180, 3)}
    <span class="btn" style="left:120px;top:1270px;transform:rotate(-2deg);height:100px;font-size:44px">Comment GAME</span>` },
  17: { theme: 'y', html: `${top('show')}${h1('What 4 grandmothers<br><mark>made</mark> with AI', 190, 104)}
    ${[['margaret', 'cartoon', '50% 30%'], ['susan', 'song', '55% 30%'], ['linda', 'gift', '50% 25%'], ['patricia', 'game', '55% 25%']].map(([w, m, p], i) =>
      `${ring({ l: 70 + (i % 2) * 480, t: 500 + Math.floor(i / 2) * 420, d: 340, src: `${M}/landing/reviews/${w}.jpg`, pos: p, zoom: 175, pad: 16 })}${pill(m, 250 + (i % 2) * 480, 780 + Math.floor(i / 2) * 420, i % 2 ? 4 : -4)}`).join('')}
    <p class="fine" style="top:1340px">Early-access families. They got the course free and told us what happened.</p>` },
  18: { theme: 'c', html: `${top('lab')}${h1('Why does AI sound<br>so sure when<br>it’s <mark>wrong?</mark>', 190, 104)}
    ${bubble('The answer is…', 90, 720, 560, { me: true })}
    <div style="position:absolute;z-index:6;left:90px;top:920px;display:flex;gap:18px">${['definitely', 'clearly', 'probably'].map((w, i) => `<span style="background:${i ? '#FFF4DC' : '#FFFFFF'};border:5px solid #141A33;border-radius:22px;padding:18px 30px;font:800 44px Urbanist;color:#141A33;box-shadow:6px 6px 0 #141A33">${w}</span>`).join('')}</div>
    <span class="note" style="left:110px;top:1080px;transform:rotate(-3deg);font-size:58px">it picks the likely word,</span>
    <span class="note" style="left:200px;top:1160px;transform:rotate(-3deg);font-size:58px">not the true one</span>` },
  19: { theme: 'n', html: `${top('make')}${h1('Your kid is 6.<br><mark>Can they do this?</mark>', 190, 108)}
    ${char('kamilla', 60, 820, 470)}${bubble('“a dragon who bakes cookies”', 470, 560, 520, { rot: 2, size: 44 })}
    ${card({ l: 520, t: 900, w: 470, h: 330, rot: -3, src: `${M}/landing/step-make.jpg` })}
    ${pill('they talk, you type', 540, 1270, -3)}` },
  20: { theme: 'k', html: `${top('lab')}${h1('Is this picture<br><mark>real?</mark>', 190, 124)}
    ${card({ l: 120, t: 520, w: 840, h: 760, rot: -1.5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 40%' })}
    ${[[260, 600], [720, 640], [300, 1080], [760, 1110]].map(([l, t], i) => `<span class="num" style="left:${l}px;top:${t}px;width:96px;height:96px;font-size:54px;background:${C.coral}">${i + 1}</span>`).join('')}
    ${pill('4 checks', 700, 470, 6, 'dark')}` },
  21: { theme: 'y', html: `${top('show')}${h1('Her own character,<br><mark>as stickers.</mark>', 190, 108)}
    ${card({ l: 70, t: 540, w: 940, h: 640, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.6%', zoom: 330 })}
    ${pill('sticker pack', 600, 500, 5)}${pill('made by Kamilla, 10', 90, 1220, -3)}` },
  22: { theme: 'c', html: `${top('lab')}${h1('Is AI <mark>alive?</mark>', 190, 138)}
    ${bubble('I’m so happy you’re here!', 90, 440, 720)}
    ${listBox([['eats', false], ['sleeps', false], ['misses you', false], ['learned from tons of text', true]].map(([t, ok]) => row(tick(ok), t, 46)).join(''), 84, 780, 912, 22)}` },
  23: { theme: 'm', html: `${top('start')}${h1('A cartoon for grandma<br><mark>this Thanksgiving.</mark>', 190, 100)}
    ${card({ l: 70, t: 560, w: 400, h: 600, rot: -6, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}${tape(190, 534, -10)}
    ${card({ l: 500, t: 600, w: 470, h: 700, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${pill('Thanksgiving gift', 90, 1230, -3)}${star(80, '#fff', 'left:900px;top:520px')}` },
  24: { theme: 'c', html: `${top('lab')}${h1('What your kid should<br>never <mark>tell an AI</mark>', 190, 106)}
    ${bubble(`Hi! I’m ${bar(220)} and I go to ${bar(260)}. My password is ${bar(240)}`, 84, 560, 900, { size: 50 })}
    ${pill('name + school', 90, 1060, -3)}${pill('address', 520, 1090, 3)}${pill('passwords', 120, 1190, 2)}${pill('photos of their face', 470, 1210, -2)}` },
  25: { theme: 'c', html: `${top('lab')}${h1('Same question.<br><mark>Two answers.</mark>', 190, 116)}
    ${bubble('Tell me a fact about octopuses', 360, 520, 640, { me: true, size: 42 })}
    ${bubble('Octopuses have three hearts.', 70, 760, 700, { size: 44, rot: -1.5 })}${bubble('An octopus can taste with its arms.', 220, 1000, 760, { size: 44, rot: 1.5 })}
    ${pill('answer 1', 640, 730, 5, 'dark')}${pill('answer 2', 90, 1210, -4, 'dark')}` },
  26: { theme: 'n', html: `${top('make')}${h1('Do I need to<br>know <mark>AI first?</mark>', 190, 108)}
    <i class="badge" style="left:90px;top:560px;width:420px;height:420px;background:${C.yellow};transform:rotate(-6deg)"><span style="font:800 190px Sora;letter-spacing:-.06em;color:#141A33">No.</span></i>
    ${pill('from zero, for both of you', 470, 640, 3)}${pill('a laptop or a tablet', 560, 780, -3)}${pill('nothing to install', 540, 920, 2)}
    ${char('anna', 600, 1010, 380)}` },
  27: { theme: 'y', html: `${top('show')}${h1('A song from<br><mark>her own words.</mark>', 190, 116)}
    ${card({ l: 70, t: 520, w: 940, h: 560, rot: -1.5, inner: `<div style="padding:60px 60px 0"><p style="font:700 56px/1.22 Urbanist;color:#141A33">“We made a song together, and she wanted to show it to everyone in the family!”</p><p style="margin-top:34px;font:800 30px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">Susan, grandmother of an 8-year-old</p></div>` })}
    ${ring({ l: 760, t: 960, d: 240, src: `${M}/landing/reviews/susan.jpg`, pos: '55% 30%', zoom: 175, z: 6, pad: 12 })}
    <i class="badge" style="left:90px;top:1140px;width:190px;height:190px;background:#fff;transform:rotate(8deg)">${icon('music', 96, '#141A33', 2.4)}</i>
    <p class="fine" style="top:1360px">Early-access family, got the course free.</p>` },
  28: { theme: 'c', html: `${top('lab')}${h1('Kamilla, or her<br><mark>AI version?</mark>', 190, 116)}
    ${ring({ l: 70, t: 560, d: 440, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215 })}
    ${char('kamilla', 560, 560, 440)}
    ${pill('real Kamilla', 110, 1040, -4)}${pill('AI version: always labeled', 470, 1060, 3, 'dark')}` },
  29: { theme: 'c', html: `${top('lab')}${h1('How does a crayon<br>drawing <mark>become a cartoon?</mark>', 190, 96)}
    ${card({ l: 70, t: 560, w: 400, h: 600, rot: -6, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 520, t: 600, w: 470, h: 700, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${arrow(120, 110, 'M14 8 C 60 18, 96 46, 100 96', 'M70 78 L101 98 L112 62', 'left:420px;top:500px')}
    ${pill('the truck stayed', 90, 1220, -3)}` },
  30: { theme: 'n', html: `${top('make')}${h1('What it costs.<br><mark>What you get.</mark>', 190, 116)}
    ${[['$197', 'Creator', 'the whole course, every lesson, your pace'], ['$297', 'Creator + Homework', 'all of that, and Anna checks homework the same day']].map(([p, n, t], i) =>
      card({ l: 70 + i * 480, t: 560 + i * 40, w: 450, h: 620, rot: i ? 2 : -2, inner: `<div style="padding:50px 44px"><p style="font:800 120px Sora;letter-spacing:-.05em;color:#141A33">${p}</p><p style="margin-top:10px;font:800 44px Sora;letter-spacing:-.03em;color:#141A33">${n}</p><p style="margin-top:24px;font:700 38px/1.2 Urbanist;color:#4B5070">${t}</p></div>` })).join('')}
    ${pill('one time · no subscription', 140, 1260, -2)}` },
  31: { theme: 'm', html: `${top('start')}${h1('Worst case:<br><mark>20 minutes</mark><br>on the couch.', 190, 112)}
    ${card({ l: 380, t: 760, w: 620, h: 400, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${char('anna', 40, 900, 420)}${pill('first lesson free', 430, 1220, -3)}` },
};

const only = process.argv[2] ? [+process.argv[2]] : Object.keys(TILES).map(Number);
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1080, height: 1440 } })).newPage();
for (const n of only) {
  const t = TILES[n];
  const tmp = join(out, `.${n}.html`);
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style><div class="tile ${t.theme}">${t.html}</div>`);
  await pg.goto(pathToFileURL(tmp).href); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(120);
  await pg.screenshot({ path: join(out, `${n}.jpg`), type: 'jpeg', quality: 90 }); unlinkSync(tmp);
}
await b.close();
console.log(`wrote ${only.length} tiles to ${out}`);
