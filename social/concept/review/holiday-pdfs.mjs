// Holiday offers (owner, 26 Nov): "Gift a skill" certificate and the free "Winter Break Challenge" checklist.
//   node social/concept/review/holiday-pdfs.mjs  ->  social/concept/out/holiday/{gift-certificate,winter-break-challenge}.{pdf,png}
// Facts: social/brand/facts.md (projects, 6-20 min lessons, parent's account, login by email). The challenge is free
// and done at home with any AI tool on the parent's account; no kid's face or voice goes into an AI tool.
import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { css, here, char, C } from '../kit.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = join(here, 'out', 'holiday'); mkdirSync(out, { recursive: true });

export const CHALLENGE = [
  ['A game', 'Your kid describes a game, you type, AI builds it. Play it against each other.'],
  ['A holiday card', 'Your kid draws on paper. AI turns the drawing into a card for the family.'],
  ['A song for grandma', 'Your kid writes the words. AI makes the music. Send it to grandma.'],
  ['A bedtime story', 'Your kid picks what happens next, AI writes the next part. Read it in bed.'],
  ['Their own character', 'Your kid invents a character and its name. AI draws it in three moods.'],
  ['A comic about the pet', 'Four boxes, one funny day of your pet. Your kid writes what happens.'],
  ['One question, three ways', 'Ask AI to explain snow like I\'m 6, like I\'m 12, like grandma. Vote.'],
  ['A wish list poster', 'Your kid lists 5 wishes for the new year. AI turns it into a poster.'],
  ['A cookie recipe card', 'Bake together, then your kid writes the recipe and AI makes the card.'],
  ['Show night', 'The family watches everything your kid made. They present, you clap.'],
];

const page = (w, h, body) => `<!doctype html><meta charset="utf-8"><style>${css()}
  @page{size:${w}px ${h}px;margin:0} html,body{width:${w}px;height:${h}px;margin:0;overflow:hidden}</style>${body}`;

const logo = `<p style="position:absolute;left:70px;top:56px;font:800 40px Sora;letter-spacing:-.04em;color:${C.navy}">make<span style="color:${C.coral}">show</span>lab</p>`;
const cert = `<div style="position:relative;width:1650px;height:1275px;background:${C.cream};overflow:hidden">
  <i style="position:absolute;inset:34px;border:8px solid ${C.navy};border-radius:44px"></i>
  <i style="position:absolute;inset:58px;border:3px dashed ${C.navy};border-radius:30px;opacity:.35"></i>
  <i style="position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;background:${C.yellow}"></i>
  <i style="position:absolute;left:-220px;bottom:-300px;width:480px;height:480px;border-radius:50%;background:${C.mint};opacity:.8"></i>
  ${logo.replace('left:70px;top:56px', 'left:110px;top:100px')}
  <p style="position:absolute;left:110px;top:200px;font:400 64px 'Caveat Brush';color:${C.coral};transform:rotate(-2deg)">A gift for</p>
  <i style="position:absolute;left:110px;top:330px;width:820px;border-bottom:5px solid ${C.navy}"></i>
  <h1 style="position:absolute;left:110px;top:380px;margin:0;font:800 104px/1 Sora;letter-spacing:-.05em;color:${C.navy}">This gift<br>is a <mark style="background:${C.yellow};padding:0 14px;border-radius:14px">skill.</mark></h1>
  <p style="position:absolute;left:110px;top:620px;width:900px;font:700 40px/1.3 Urbanist;color:${C.navy}">An AI creativity course you make together, with mom or dad right next to you.</p>
  <div style="position:absolute;left:110px;top:760px;width:900px;display:flex;flex-wrap:wrap;gap:14px">
    ${['a game', 'a cartoon', 'a song', 'a website', 'a sticker pack', 'a voiceover'].map((t) => `<span style="font:800 32px Urbanist;color:${C.navy};background:#fff;border:4px solid ${C.navy};border-radius:999px;padding:8px 24px">${t}</span>`).join('')}
  </div>
  <p style="position:absolute;left:110px;top:930px;width:900px;font:600 30px/1.35 Urbanist;color:#4B5070">Lessons of 6 to 20 minutes. Each one ends with something finished to show the family.</p>
  <div style="position:absolute;left:110px;top:1050px;display:flex;gap:60px;font:700 32px Urbanist;color:${C.navy}">
    <span>From:<i style="display:inline-block;width:360px;border-bottom:4px solid ${C.navy};margin-left:14px"></i></span>
    <span>Plan: ☐ Creator ☐ Creator + Homework</span>
  </div>
  <div style="position:absolute;right:120px;top:300px;width:420px;height:560px">${char('kamilla', 0, 0, 420)}</div>
  <p style="position:absolute;right:110px;top:880px;width:480px;text-align:right;font:700 26px/1.35 Urbanist;color:${C.navy}">How to start: open the email with your login and pick lesson 1.<br><b>makeshowlab.com</b></p>
</div>`;

const list = `<div style="position:relative;width:1275px;height:1650px;background:${C.cream};overflow:hidden">
  <i style="position:absolute;right:-140px;top:-140px;width:460px;height:460px;border-radius:50%;background:${C.mint}"></i>
  ${logo}
  <p style="position:absolute;left:70px;top:150px;font:400 56px 'Caveat Brush';color:${C.coral};transform:rotate(-2deg)">free, for the whole break</p>
  <h1 style="position:absolute;left:70px;top:230px;margin:0;font:800 92px/1 Sora;letter-spacing:-.05em;color:${C.navy}">Winter Break<br><mark style="background:${C.yellow};padding:0 12px;border-radius:12px">Challenge</mark></h1>
  <p style="position:absolute;left:70px;top:450px;width:1000px;font:700 34px/1.3 Urbanist;color:${C.navy}">10 projects, about 20 minutes each, made together. Use any AI tool on your own account. Tick one off a day.</p>
  <div style="position:absolute;left:70px;right:70px;top:530px;display:grid;gap:8px">
    ${CHALLENGE.map(([h, t], i) => `<div style="display:flex;gap:22px;align-items:center;background:#fff;border:4px solid ${C.navy};border-radius:22px;padding:0 22px;height:92px;box-sizing:border-box">
      <b style="flex:none;width:56px;height:56px;border:4px solid ${C.navy};border-radius:14px"></b>
      <div><p style="margin:0;font:800 31px/1.05 Sora;letter-spacing:-.03em;color:${C.navy}">${i + 1}. ${h}</p><p style="margin:6px 0 0;font:600 23px/1.3 Urbanist;color:#4B5070">${t}</p></div></div>`).join('')}
  </div>
  <p style="position:absolute;left:70px;right:70px;bottom:40px;font:700 24px/1.35 Urbanist;color:${C.navy}">Want lessons that walk you through it? The first lesson of our course is free, no card: <b>makeshowlab.com</b></p>
</div>`;

const b = await chromium.launch();
for (const [name, w, h, body] of [['gift-certificate', 1650, 1275, cert], ['winter-break-challenge', 1275, 1650, list]]) {
  const tmp = join(out, `${name}.html`); writeFileSync(tmp, page(w, h, body));
  const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await pg.goto(pathToFileURL(tmp).href); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(200);
  await pg.screenshot({ path: join(out, `${name}.png`) });
  await pg.pdf({ path: join(out, `${name}.pdf`), width: `${w}px`, height: `${h}px`, printBackground: true });
  unlinkSync(tmp); console.log('wrote', name);
}
await b.close();
