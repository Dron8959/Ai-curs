#!/usr/bin/env node
// Pinterest: the first twelve pins, their words and the boards they go to.
//
//   node social/concept/pins.mjs        renders pins/<file>.jpg (1000×1500) and writes pins/<file>.md
//
// Pinterest is a search engine, so a pin is built like a search result (pinterest-growth, pinterest-seo and
// pinterest-pin-design skills):
//   - 2:3, 1000×1500. The search phrase is on the picture (six words or fewer, readable at feed size,
//     in the top third) AND opens the title. The logo and the address never sit bottom-right:
//     Pinterest puts its own buttons there.
//   - title: [search phrase] | [what you get] | [context], 100 characters at most
//   - description: one or two natural sentences with the phrase, no tag piles
//   - board: named with the words people search, precise rather than cute
//   - link: the part of the site that delivers what the picture promises
//   - every destination gets several pins that really differ (a hero photo, a list, a before/after,
//     a text card, a quote), at least 72 hours apart
// The search phrases are starting points written from how parents talk about this. Nobody has checked them
// in Pinterest search yet: type each into the Pinterest search bar, read the suggestions and adjust.

import { createRequire } from 'node:module';
import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { A, C, LOGO, M, css, here, star, card, ring, pill, char, icon } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const SITE = 'https://www.makeshowlab.com/';
const link = (campaign, anchor) => `${SITE}?utm_source=pinterest&utm_medium=social&utm_campaign=${campaign}#${anchor}`;

export const boards = {
  activities: { name: 'AI Activities for Kids', about: 'AI activities and projects for kids ages 6 to 14: make a cartoon, a game, a song or a sticker pack with a parent, no coding. Ideas from Make Show Lab.' },
  safety: { name: 'AI Safety for Kids', about: 'AI safety rules for kids and families: house rules for AI tools, what never to share, how to spot a fake. Simple enough for the fridge.' },
  screen: { name: 'Screen Time Ideas for Kids', about: 'Creative screen time ideas for kids: screens they make on instead of scroll on. Short projects a parent and child finish together.' },
  gifts: { name: 'Non-Toy Gift Ideas for Kids', about: 'Non-toy gift ideas for kids and grandkids: gifts you do together. A creative AI course for ages 6 to 14 that ends with things they made.' },
  homeschool: { name: 'Homeschool Technology Ideas', about: 'Homeschool technology and AI lesson ideas for ages 6 to 14: short lessons that end with a finished project, done side by side with a parent.' },
};

// ------------------------------------------------------------------------------------------- templates
const brand = () => `<img src="${A(`${LOGO}/logo/icon-small.svg`)}" style="position:absolute;z-index:9;left:56px;top:48px;width:84px;height:84px" alt="">`;
const site = (dark = false) => `<span class="pill${dark ? '' : ' dark'}" style="left:56px;bottom:52px;height:66px;font-size:28px;letter-spacing:.04em;text-transform:none;box-shadow:none">makeshowlab.com</span>`;
const h = (html, { top = 160, size = 118, style = '' } = {}) => `<h1 class="t" style="left:56px;right:56px;top:${top}px;font-size:${size}px;line-height:.96;${style}">${html}</h1>`;
const p = (html, top, size = 44, style = '') => `<p class="sub" style="left:60px;right:60px;top:${top}px;font-size:${size}px;${style}">${html}</p>`;
const rowsCard = (items, t, hgt, numBg = '#141A33') => card({ l: 56, t, w: 888, h: hgt, rot: -1.5, inner: `<div style="padding:54px 46px 0;display:grid;gap:38px">${
  items.map((r, i) => `<div style="display:flex;align-items:center;gap:28px"><b style="flex:none;display:grid;place-items:center;width:92px;height:92px;border-radius:50%;background:${numBg};color:#FFF4DC;font:800 50px Sora">${i + 1}</b><span style="font:800 52px/1.06 Urbanist;color:#141A33">${r}</span></div>`).join('')}</div>` });

export const pins = [
  { file: 'non-toy-gift-idea-for-kids', n: 1, board: 'gifts', anchor: 'families', variant: 'цитата', ai: false, theme: 'y',
    phrase: 'non-toy gift idea for kids',
    title: 'Non-Toy Gift Idea for Kids | An AI Course You Do Together | From Grandparents',
    text: 'A non-toy gift idea for kids 6 to 14: a short AI creativity course a grandparent or parent does side by side with them. They make a cartoon, a game, a song.',
    alt: 'Yellow pin that reads "Non-toy gift idea for kids" with a grandmother\'s photo and her words: I wanted to give my grandson something more meaningful than another toy.',
    why: 'Сезон подарков идёт сейчас. Отзыв бабушки дословный, с пометкой про бесплатный доступ в описании.',
    note: 'Linda is an early-access tester. She received the course free and shared honest feedback.',
    html: `${brand()}
    ${h('Non-toy<br><mark>gift idea</mark><br>for kids')}
    ${card({ l: 56, t: 620, w: 888, h: 520, rot: -1.5, inner: `<div style="padding:56px 50px 0"><p style="font:700 60px/1.16 Urbanist;color:#141A33">“I wanted to give my grandson something more meaningful than another toy.”</p>
      <p style="margin-top:30px;font:800 28px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">Linda, grandmother of a 10-year-old</p></div>` })}
    ${ring({ l: 700, t: 1050, d: 250, src: `${M}/landing/reviews/linda.jpg`, pos: '50% 25%', zoom: 175, z: 6, pad: 14 })}
    ${p('An AI course you do together.<br>Ages 6 to 14.', 1200, 42, 'right:330px;color:#141A33')}
    ${site()}` },

  { file: 'gift-ideas-for-grandkids', n: 2, board: 'gifts', anchor: 'families', variant: 'фото', ai: false, theme: 'n',
    phrase: 'gift ideas for grandkids',
    title: 'Gift Ideas for Grandkids | Make a Game or a Cartoon Together | Ages 6-14',
    text: 'Gift ideas for grandkids that are not another toy: an AI creativity course you do side by side. Short lessons, and each one ends with something they made.',
    alt: 'Dark blue pin that reads "Gift ideas for grandkids" above a photo of a mom and daughter playing a game the child built, at a kitchen table.',
    why: 'Второй пин про подарок, другой запрос и другая картинка: живое фото за столом.',
    html: `${brand()}
    ${h('Gift ideas for<br><mark>grandkids</mark>')}
    ${p('Make a game or a cartoon together.', 430, 46)}
    ${card({ l: 56, t: 560, w: 888, h: 610, rot: 2, src: `${M}/landing/together-game.jpg` })}
    ${pill('you do it side by side', 96, 1130, -3)}
    ${star(80, C.yellow, 'left:830px;top:1210px')}${star(40, C.yellow, 'left:780px;top:1180px')}
    ${site(true)}` },

  { file: 'ai-safety-rules-for-kids', n: 3, board: 'safety', anchor: 'safe', variant: 'список', ai: false, theme: 'c',
    phrase: 'AI safety rules for kids',
    title: 'AI Safety Rules for Kids | 5 House Rules to Set First | For the Fridge',
    text: 'Five AI safety rules for kids to set before they open any AI tool: the account is the parent\'s, no chats with strangers, and three more that fit on a fridge.',
    alt: 'Coral pin that reads "5 AI safety rules for kids" with a numbered list: the account is yours, no chats with strangers, some things AI never hears, links get a second look, too perfect, check it.',
    why: 'Список сохраняют чаще всего. Это главный вечнозелёный пин: пять правил целиком на картинке.',
    html: `${brand()}
    ${h('5 AI <mark>safety rules</mark><br>for kids', { size: 112 })}
    ${rowsCard(['The account is yours', 'No chats with strangers', 'Some things AI never hears', 'Links get a second look', 'Too perfect? Check it'], 500, 800)}
    <i style="position:absolute;z-index:6;left:454px;top:462px;width:92px;height:92px;border-radius:50%;background:${C.mint};border:6px solid #141A33;box-shadow:6px 6px 0 #141A33"></i>
    ${site()}` },

  { file: 'ai-house-rules-for-families', n: 4, board: 'safety', anchor: 'safe', variant: 'текст', ai: false, theme: 'k',
    phrase: 'AI house rules for families',
    title: 'AI House Rules for Families | Start With the Parent\'s Account | Kids and AI',
    text: 'AI house rules for families start with one thing: every tool runs on the parent\'s account, so your kid never signs up alone and you see everything they make.',
    alt: 'Cream pin that reads "AI house rules for families. Rule one: the account is yours" with a friendly drawn mom character.',
    why: 'Тот же раздел сайта, но другой запрос и другой макет: одно правило крупно, с персонажем.',
    html: `${brand()}
    ${h('AI <mark>house rules</mark><br>for families', { size: 116 })}
    <span class="num" style="left:56px;top:470px;width:150px;height:150px;font-size:92px;background:${C.coral}">1</span>
    ${p('The account is yours.<br>Your kid never signs up alone.', 498, 46, 'left:236px;color:#141A33')}
    ${char('anna', 190, 690, 640)}
    ${site()}` },

  { file: 'free-ai-lesson-for-kids', n: 5, board: 'activities', anchor: 'free', variant: 'фото', ai: true, theme: 'm',
    phrase: 'free AI lesson for kids',
    title: 'Free AI Lesson for Kids | Your Kid Builds a Game Tonight | No Coding',
    text: 'A free AI lesson for kids 6 to 14: your kid builds a playable game in 10 to 20 minutes with you next to them. No card, no coding, nothing to install.',
    alt: 'Mint pin that reads "Free AI lesson for kids" above a pixel-art game with a girl and a corgi in a park, made by a 10-year-old.',
    why: 'Прямая дверь на бесплатный урок. Игра на картинке сделана ребёнком на курсе.',
    html: `${brand()}
    ${h('<mark>Free</mark> AI lesson<br>for kids')}
    ${p('Your kid builds a game tonight.', 420, 46, 'color:#141A33')}
    ${card({ l: 56, t: 540, w: 888, h: 536, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${pill('10–20 minutes', 110, 1040, -4)}${pill('no card', 560, 1090, 4)}
    ${star(80, '#fff', 'left:820px;top:1180px')}${star(40, '#fff', 'left:770px;top:1150px')}
    ${site()}` },

  { file: 'turn-kids-drawings-into-cartoons', n: 6, board: 'activities', anchor: 'works', variant: 'было и стало', ai: true, theme: 'y', hold: 'ждёт подтверждения, что рисунок детский (как пост №1)',
    phrase: 'turn kids drawings into cartoons',
    title: 'Turn Kids Drawings Into Cartoons | With AI, in One Lesson | Kids Art Idea',
    text: 'Turn kids drawings into cartoons with AI: the child has the idea and makes the drawing, the AI follows it, and a parent sits next to them. A kids art idea for ages 6 to 14.',
    alt: 'Yellow pin that reads "Turn kids drawings into cartoons": a crayon rainbow drawing on the left and the same scene as a glowing cartoon on the right.',
    why: 'Формат «было и стало» ищут и сохраняют. Рисунок и идея детские, ИИ только идёт за ними.',
    html: `${brand()}
    ${h('Turn kids <mark>drawings</mark><br>into cartoons', { size: 112 })}
    ${card({ l: 56, t: 560, w: 400, h: 600, rot: -5, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 470, t: 620, w: 474, h: 711, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${pill('the drawing', 70, 1150, -4)}${pill('one lesson later', 560, 1290, 3)}
    ${site()}` },

  { file: 'ai-projects-for-kids', n: 7, board: 'activities', anchor: 'works', variant: 'коллаж', ai: true, theme: 'k',
    phrase: 'AI projects for kids',
    title: 'AI Projects for Kids | A Cartoon, a Game, a Sticker Pack | No Coding',
    text: 'AI projects for kids, made by a 10-year-old: a cartoon with her own characters, a game you can play and a sticker pack. No coding, with a parent next to her.',
    alt: 'Cream pin that reads "AI projects for kids" with three pictures made by a 10-year-old: a cartoon cat, a pixel-art game and a sheet of stickers.',
    why: 'Показывает сразу три результата. Всё на картинке сделала Камилла.',
    html: `${brand()}
    ${h('AI <mark>projects</mark><br>for kids')}
    ${card({ l: 56, t: 500, w: 400, h: 540, rot: -4, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%' })}
    ${card({ l: 430, t: 560, w: 514, h: 320, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}
    ${card({ l: 300, t: 930, w: 620, h: 400, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330, z: 5 })}
    ${pill('cartoon', 60, 1010, -5)}${pill('game', 790, 520, 5)}${pill('stickers', 730, 1290, 4)}
    ${pill('made by a 10-year-old', 56, 1300, -3, 'dark', 'height:64px;font-size:27px')}
    <span style="position:absolute;z-index:6;left:60px;bottom:66px;font:800 30px Urbanist;color:#141A33">makeshowlab.com</span>` },

  { file: 'how-to-teach-kids-ai', n: 8, board: 'homeschool', anchor: 'how', variant: 'шаги', ai: false, theme: 'n',
    phrase: 'how to teach kids AI',
    title: 'How to Teach Kids AI | Watch, Make, Show in 20 Minutes | Homeschool Idea',
    text: 'How to teach kids AI in short lessons: watch the finished thing, make your own with a parent next to you, show it to the family. 6 to 20 minutes each.',
    alt: 'Dark blue pin that reads "How to teach kids AI" with three numbered photos of a mom and daughter: watching a lesson, making a project, showing the result.',
    why: 'Объясняет, как устроен урок, на трёх живых фото. Для тех, кто ищет занятия на дом.',
    html: `${brand()}
    ${h('How to <mark>teach</mark><br>kids AI')}
    ${[['Watch', 'step-watch.jpg', 56, 500, -3], ['Make', 'step-make.jpg', 400, 750, 3], ['Show', 'step-show.jpg', 110, 1000, -2]].map(([w, f, l, t, r], i) =>
      `${card({ l, t, w: 540, h: 330, rot: r, src: `${M}/landing/${f}`, pos: i === 2 ? '70% 30%' : 'center', z: 3 + i })}
      <span class="num" style="left:${l - 26}px;top:${t - 30}px;width:100px;height:100px;font-size:58px;z-index:8;box-shadow:6px 6px 0 #070A1F">${i + 1}</span>
      ${pill(w, l + 26, t + 286, r, '', 'z-index:8')}`).join('')}
    ${site(true)}` },

  { file: 'creative-screen-time-ideas-for-kids', n: 9, board: 'screen', anchor: 'problem', variant: 'текст', ai: false, theme: 'c',
    phrase: 'creative screen time ideas for kids',
    title: 'Creative Screen Time Ideas for Kids | Make, Don\'t Scroll | Ages 6-14',
    text: 'Creative screen time ideas for kids: a screen they make on is not a screen they scroll. Short AI projects that end with a game or a cartoon to show you.',
    alt: 'Coral pin that reads "Creative screen time ideas for kids. A screen they make on is not a screen they scroll" with a happy drawn girl in headphones.',
    why: 'Запрос про экранное время: туда приходят родители с нашей главной болью.',
    html: `${brand()}
    ${h('Creative<br><mark>screen time</mark><br>ideas for kids', { size: 110 })}
    ${p('A screen they make on is not<br>a screen they scroll.', 540, 46, 'color:#141A33')}
    ${char('kamilla', 170, 720, 680)}
    ${site()}` },

  { file: 'kids-make-stickers-with-ai', n: 10, board: 'activities', anchor: 'works', variant: 'фото', ai: true, theme: 'y',
    phrase: 'kids make stickers with AI',
    title: 'Kids Make Stickers With AI | Their Own Character | Easy Project, No Coding',
    text: 'Kids make stickers with AI: a sticker pack of their own character, made in one short lesson with a parent next to them. No coding, ages 6 to 14.',
    alt: 'Yellow pin that reads "Kids make stickers with AI" above a photo of a surprised 10-year-old girl holding a laptop with a sheet of stickers of her own character.',
    why: 'Один конкретный результат и живая эмоция. Лицо ребёнка: это Камилла, лицо бренда.',
    html: `${brand()}
    ${h('Kids make<br><mark>stickers</mark> with AI')}
    ${card({ l: 56, t: 520, w: 888, h: 720, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '60% 100%' })}
    ${pill('her own character', 500, 1200, 4)}
    ${site()}` },

  { file: 'ai-for-kids-by-age', n: 11, board: 'homeschool', anchor: 'faq', variant: 'список', ai: false, theme: 'm',
    phrase: 'AI for kids by age',
    title: 'AI for Kids by Age | What a Parent Does at 6, 10 and With a Teen | Guide',
    text: 'AI for kids by age: a six-year-old talks and the parent types, a ten-year-old does most of it alone, a teenager just needs you in the room.',
    alt: 'Mint pin that reads "AI for kids by age" with three rows: age 6, they talk and you type; age 10, mostly on their own; teen, you are in the room.',
    why: 'Отвечает на вопрос «с какого возраста». Ведёт в раздел вопросов на сайте, где это написано.',
    html: `${brand()}
    ${h('AI for kids<br><mark>by age</mark>')}
    ${card({ l: 56, t: 480, w: 888, h: 560, rot: -1.5, inner: `<div style="padding:52px 46px 0;display:grid;gap:44px">${
      [['6', 'They talk, you type'], ['10', 'Mostly on their own'], ['Teen', 'You\'re in the room']].map(([a, t]) => `<div style="display:flex;align-items:center;gap:30px">
        <b style="flex:none;display:grid;place-items:center;min-width:150px;height:110px;padding:0 24px;border-radius:999px;background:#141A33;color:#FFF4DC;font:800 56px Sora;letter-spacing:-.04em">${a}</b>
        <span style="font:800 54px/1.06 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>` })}
    ${p('The idea is<br>always theirs.', 1130, 50, 'right:480px;color:#141A33;font-weight:800')}
    ${char('kamilla', 500, 1010, 470)}
    ${site()}` },

  { file: 'ai-course-for-kids-and-parents', n: 12, board: 'activities', anchor: 'team', variant: 'портреты', ai: false, theme: 'n',
    phrase: 'AI course for kids and parents',
    title: 'AI Course for Kids and Parents | By a Mom and Her Daughter | Ages 6-14',
    text: 'An AI course for kids and parents, built by a mom and tested on her 10-year-old daughter at their kitchen table. Short lessons you do side by side.',
    alt: 'Dark blue pin that reads "AI course for kids and parents" with round portraits of Anna, a mom, and Kamilla, her 10-year-old daughter.',
    why: 'Кто стоит за курсом. Для детского продукта это вопрос доверия.',
    html: `${brand()}
    ${h('AI course for<br><mark>kids and parents</mark>', { size: 104 })}
    ${p('By a mom and her daughter.', 420, 46)}
    ${ring({ l: 56, t: 560, d: 540, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}
    ${ring({ l: 500, t: 800, d: 440, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}
    ${pill('Anna, mom', 90, 1060, -5, '', `background:${C.coral}`)}${pill('Kamilla, 10', 640, 1200, 4, '', `background:${C.mint}`)}
    ${site(true)}` },
];

// ---------------------------------------------------------------------------------- checks, render, files
const BANNED = /[—‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof)\b|#\w/i;
function check(pin) {
  const bad = [], kw = pin.phrase.toLowerCase();
  if (!boards[pin.board]) bad.push(`unknown board ${pin.board}`);
  if (pin.title.length > 100) bad.push(`title is ${pin.title.length} characters, 100 at most`);
  if (!pin.title.toLowerCase().startsWith(kw)) bad.push('the title must open with the search phrase');
  if ((pin.title.match(/ \| /g) || []).length !== 2) bad.push('title shape: phrase | benefit | context');
  if (!pin.text.toLowerCase().includes(kw)) bad.push('the description must use the search phrase');
  if (pin.text.length < 100 || pin.text.length > 220) bad.push(`description is ${pin.text.length} characters, aim for 100 to 200`);
  if (pin.phrase.split(/\s+/).length > 6) bad.push('the phrase on the picture is over six words');
  for (const t of [pin.title, pin.text, pin.alt]) if (BANNED.test(t)) bad.push(`banned character, word or tag: ${t.match(BANNED)[0]}`);
  if (bad.length) throw new Error(`${pin.file}: ${bad.join('; ')}`);
}

if (process.argv[1] && process.argv[1].endsWith('pins.mjs')) {
  const out = join(here, 'pins');
  mkdirSync(out, { recursive: true });
  pins.forEach(check);
  const browser = await chromium.launch();
  for (const pin of pins) {
    const pg = await (await browser.newContext({ viewport: { width: 1000, height: 1500 } })).newPage();
    const tmp = join(out, '.tmp.html');
    writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}.tile.pin{width:1000px;height:1500px}</style><div class="tile pin ${pin.theme}">${pin.html}</div>`);
    await pg.goto(pathToFileURL(tmp).href);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(80);
    await pg.screenshot({ path: join(out, `${pin.file}.jpg`), type: 'jpeg', quality: 92 });
    await pg.context().close();
    unlinkSync(tmp);
    const b = boards[pin.board];
    writeFileSync(join(out, `${pin.file}.md`), `---
pin: ${pin.n}
network: pinterest
image: ${pin.file}.jpg (1000x1500)
search_phrase: "${pin.phrase}" (on the picture and first in the title; check it in Pinterest search suggestions)
board: "${b.name}"
link: ${link(pin.file, pin.anchor)}
variant: ${pin.variant}
ai_disclosure: ${pin.ai ? 'yes, the picture shows AI-made work: switch the AI label on' : 'no'}${pin.hold ? `\nhold: ${pin.hold}` : ''}
title_length: ${pin.title.length} of 100
description_length: ${pin.text.length}
---
## Title

${pin.title}

## Description

${pin.text}${pin.note ? `\n\n${pin.note}` : ''}

## Alt text

${pin.alt}
`);
    console.log(`${String(pin.n).padStart(2)}  ${pin.file.padEnd(38)} title ${pin.title.length}  text ${pin.text.length}  -> ${b.name}`);
  }
  await browser.close();
  writeFileSync(join(out, 'boards.md'), `# Pinterest boards\n\nCreate these five boards by hand (a scheduler cannot). The name carries the search words; the description says the same thing in a sentence.\n\n${
    Object.values(boards).map((b) => `## ${b.name}\n\n${b.about}\n\nPins: ${pins.filter((x) => boards[x.board] === b).map((x) => x.n).join(', ')}\n`).join('\n')}`);
}
