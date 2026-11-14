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
import { A, C, LOGO, M, css, here, star, card, ring, pill, char, icon, tape } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const SITE = 'https://www.makeshowlab.com/';
const link = (campaign, anchor) => `${SITE}?utm_source=pinterest&utm_medium=social&utm_campaign=${campaign}#${anchor}`;

export const boards = {
  activities: { name: 'AI Activities for Kids', about: 'AI activities and projects for kids ages 6 to 14: make a cartoon, a game, a song or a sticker pack with a parent, no coding. Ideas from Make Show Lab.' },
  safety: { name: 'AI Safety for Kids', about: 'AI safety rules for kids and families: house rules for AI tools, what never to share, how to spot a fake. Simple enough for the fridge.' },
  screen: { name: 'Screen Time Ideas for Kids', about: 'Creative screen time ideas for kids: screens they make on instead of scroll on. Short projects a parent and child finish together.' },
  gifts: { name: 'Non-Toy Gift Ideas for Kids', about: 'Non-toy gift ideas for kids and grandkids: gifts you do together. A creative AI course for ages 6 to 14 that ends with things they made.' },
  ai: { name: 'How AI Works for Kids', about: 'How AI works, explained for kids and parents: why AI draws six fingers, how it makes a picture from words, why it sounds sure when it is wrong. Short answers a parent can say out loud.' },
  homeschool: { name: 'Homeschool Technology Ideas', about: 'Homeschool technology and AI lesson ideas for ages 6 to 14: short lessons that end with a finished project, done side by side with a parent.' },
};

// ------------------------------------------------------------------------------------------- templates
// The small mark used to sit in the pin layout (left 56, top 48). The brand now has its own band on top of
// every pin (head() below): a big mark plus the Make Show Lab wordmark, and the layout is scaled into the rest.
const brand = () => '';
const HEAD = 190, S = 0.93;                     // band height; layout scale (its y=150 lands right under the band)
const SERIES = { ask: 'ASK AI', safe: 'SAFE AI', kid: 'BY A KID', how: 'HOW IT WORKS', free: 'FREE LESSON' };   // SERIES.md in this folder's parent
const head = (series) => `<div style="position:absolute;z-index:20;left:44px;top:34px;display:flex;align-items:center;gap:22px">
  <img src="${A(`${LOGO}/logo/icon.svg`)}" style="width:150px;height:150px;display:block" alt="">
  <span style="display:flex;align-items:center;height:90px;padding:0 30px;border:5px solid #141A33;border-radius:999px;background:#fff;box-shadow:6px 6px 0 #141A33">
  <img src="${A(`${LOGO}/logo/wordmark-light.svg`)}" style="height:42px;width:auto;display:block" alt="Make Show Lab"></span></div>
  <span style="position:absolute;z-index:20;right:44px;top:62px;display:flex;align-items:center;height:62px;padding:0 24px;border:5px solid #141A33;border-radius:999px;background:#FFC533;box-shadow:5px 5px 0 #141A33;font:800 25px Urbanist;letter-spacing:.08em;color:#141A33">${SERIES[series]}</span>`;
const body = (html) => `<div style="position:absolute;inset:0;transform-origin:50% 0;transform:translateY(${HEAD + 8 - 150 * S}px) scale(${S})">${html}</div>`;
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

  // ---- batch 2: pins that are useful on their own (a parent saves them even without clicking).
  // The course only sits in the link. Memo pins: 13-15. Christmas gift pins: 16-18 (season: up now).
  { file: 'ai-rules-for-kids-poster', n: 13, batch: 2, board: 'safety', anchor: 'safe', variant: 'памятка', ai: false, theme: 'k',
    phrase: 'AI rules for kids poster',
    title: 'AI Rules for Kids Poster | 5 Family Rules With Why | Save and Print for the Fridge',
    text: 'An AI rules for kids poster for the fridge: five family rules, each with one line on why. Save it, print it, read it together before the first AI project.',
    alt: 'Cream pin with a taped paper sheet titled "Our family AI rules": five numbered rules, each with a short reason, such as the account is yours and every tool runs on a parent\'s account.',
    why: 'Пин-польза: памятка целиком на картинке, её сохраняют и печатают. Правила те же, что в пине 3, добавлено «почему» в одну строку.',
    html: `${brand()}
    ${h('AI rules<br>for kids <mark>poster</mark>', { size: 112 })}
    ${p('Save it. Print it. Fridge.', 420, 44, 'color:#141A33')}
    ${card({ l: 56, t: 530, w: 888, h: 860, rot: -1.2, cls: 'paper', inner: `<div style="padding:48px 50px 0">
      <p style="font:800 30px Urbanist;letter-spacing:.1em;text-transform:uppercase;color:#4B5070">Our family AI rules</p>
      <div style="margin-top:34px;display:grid;gap:40px">${[
        ['The account is yours', 'Every tool runs on a parent\'s account.'],
        ['No chats with strangers', 'No messages, no comments.'],
        ['Some things AI never hears', 'Ask a grown-up before you share.'],
        ['Links get a second look', 'Not sure? Don\'t click. Ask.'],
        ['Too perfect? Check it', 'Pictures and videos can be fake.'],
      ].map(([r, y], i) => `<div style="display:flex;gap:24px;align-items:flex-start"><b style="flex:none;display:grid;place-items:center;width:74px;height:74px;border-radius:50%;background:${[C.coral, C.yellow, C.mint, C.coral, C.yellow][i]};border:4px solid #141A33;color:#141A33;font:800 40px Sora">${i + 1}</b>
        <span><b style="display:block;font:800 44px/1.05 Urbanist;color:#141A33">${r}</b><span style="display:block;margin-top:6px;font:600 32px/1.15 Urbanist;color:#4B5070">${y}</span></span></div>`).join('')}</div></div>` })}
    ${tape(420, 500, -4)}
    <span style="position:absolute;z-index:6;left:60px;bottom:40px;font:800 30px Urbanist;color:#141A33">makeshowlab.com</span>` },

  { file: 'what-kids-should-never-tell-ai', n: 14, batch: 2, board: 'safety', anchor: 'safe', variant: 'список', ai: false, theme: 'c',
    hold: 'список «чего не говорить AI» сверить с уроком Анны про безопасность и получить её «ок»',
    phrase: 'what kids should never tell AI',
    title: 'What Kids Should Never Tell AI | 4 Things That Stay Private | Kids and AI Safety',
    text: 'What kids should never tell AI: their full name, where they live or go to school, passwords, and where they are right now. Four things to go over before any AI tool.',
    alt: 'Coral pin that reads "What kids should never tell AI" with a numbered list: full name, home address or school, passwords, where they are right now.',
    why: 'Отвечает на конкретный страх родителя одним списком. Тема есть в курсе, но сам список нужно сверить с уроком.',
    html: `${brand()}
    ${h('What kids should<br><mark>never tell</mark> AI', { size: 104 })}
    ${rowsCard(['Their full name', 'Home address or school', 'Passwords', 'Where they are right now'], 500, 650)}
    ${p('Go over it once, together,<br>before the first AI tool.', 1210, 42, 'color:#141A33')}
    ${star(80, '#fff', 'left:850px;top:1230px')}${star(40, '#fff', 'left:800px;top:1200px')}
    ${site()}` },

  { file: 'ai-safety-checklist-for-parents', n: 15, batch: 2, board: 'safety', anchor: 'safe', variant: 'чек-лист', ai: false, theme: 'm',
    phrase: 'AI safety checklist for parents',
    title: 'AI Safety Checklist for Parents | 5 Checks Before Your Kid Opens AI | Ages 6-14',
    text: 'An AI safety checklist for parents: five quick checks before your kid opens any AI tool, from whose account it is to how to spot a fake picture.',
    alt: 'Mint pin that reads "AI safety checklist for parents" with five tick boxes: the account is mine, chats and comments are off, we agreed what stays private, they ask before a link, they know pictures can be fake.',
    why: 'Те же правила, но для родителя и в виде галочек: другой запрос, другой макет.',
    html: `${brand()}
    ${h('AI safety<br><mark>checklist</mark><br>for parents', { size: 110 })}
    ${p('Before your kid opens any AI tool:', 520, 42, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 610, w: 888, h: 720, rot: 1.2, inner: `<div style="padding:52px 48px 0;display:grid;gap:40px">${
      ['The account is mine', 'Chats and comments are off', 'We agreed what stays private', 'They ask before a link', 'They know pictures can be fake']
        .map((t) => `<div style="display:flex;align-items:center;gap:28px"><b style="flex:none;display:grid;place-items:center;width:78px;height:78px;border:5px solid #141A33;border-radius:16px;background:${C.mint};font:800 52px/1 Sora;color:#141A33">✓</b><span style="font:800 46px/1.06 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>` })}
    ${site()}` },

  { file: 'experience-gifts-for-kids', n: 16, batch: 2, board: 'gifts', anchor: 'works', variant: 'билет', ai: false, theme: 'y',
    phrase: 'experience gifts for kids',
    title: 'Experience Gifts for Kids | A Cartoon, a Game, a Song Made Together | Ages 6-14',
    text: 'Experience gifts for kids 6 to 14: an AI creativity course you do side by side. Short lessons, and each one ends with something they made, like a game or a song.',
    alt: 'Yellow pin that reads "Experience gifts for kids" with a gift ticket: good for one cartoon, one game, one song, made together.',
    why: 'Рождественский запрос «подарок-впечатление». Билет на картинке говорит, что подарок это совместное время и готовые вещи.',
    html: `${brand()}
    ${h('Experience<br><mark>gifts</mark> for kids')}
    ${p('Something you make together,<br>not another box.', 420, 44, 'color:#141A33')}
    ${card({ l: 56, t: 600, w: 888, h: 620, rot: -2, inner: `<div style="position:absolute;inset:26px;border:5px dashed #141A33;border-radius:22px;padding:44px 46px">
      <p style="font:800 34px Urbanist;letter-spacing:.14em;text-transform:uppercase;color:#4B5070">Good for</p>
      ${['one cartoon', 'one game', 'one song'].map((t, i) => `<p style="margin-top:${i ? 10 : 22}px;font:800 84px/1.02 Sora;letter-spacing:-.04em;color:#141A33">${t}</p>`).join('')}
      <p style="margin-top:30px;font:800 44px Urbanist;color:${C.coral}">made together</p></div>` })}
    ${pill('ages 6 to 14', 600, 1180, 4)}
    ${star(80, '#fff', 'left:830px;top:540px')}${star(40, '#fff', 'left:780px;top:600px')}
    ${site()}` },

  { file: 'christmas-gift-ideas-for-grandkids', n: 17, batch: 2, board: 'gifts', anchor: 'families', variant: 'цитата', ai: false, theme: 'n',
    phrase: 'Christmas gift ideas for grandkids',
    title: 'Christmas Gift Ideas for Grandkids | Make Something Together | Ages 6-14',
    text: 'Christmas gift ideas for grandkids that are not another toy: a short AI course a grandparent does with them. They make a little game, a cartoon or a song.',
    alt: 'Dark blue pin that reads "Christmas gift ideas for grandkids" with a grandmother\'s photo and her words: It was a gift we both enjoyed.',
    why: 'Сезонный запрос к Рождеству. Отзыв Патриции дословный, конец цитаты, пометка про бесплатный доступ в описании.',
    note: 'Patricia is an early-access tester. She received the course free and shared honest feedback.',
    html: `${brand()}
    ${h('Christmas<br><mark>gift ideas</mark><br>for grandkids', { size: 110 })}
    ${card({ l: 56, t: 590, w: 888, h: 520, rot: 1.5, inner: `<div style="padding:50px 50px 0"><p style="font:700 54px/1.14 Urbanist;color:#141A33">“We created a little game together, and seeing her excitement was priceless. It was a gift we both enjoyed.”</p>
      <p style="margin-top:30px;font:800 28px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">Patricia, grandmother of a 7-year-old</p></div>` })}
    ${ring({ l: 650, t: 1010, d: 290, src: `${M}/landing/reviews/patricia.jpg`, pos: '50% 25%', zoom: 175, z: 6, pad: 14 })}
    ${p('Make something together.<br>Ages 6 to 14.', 1130, 42, 'right:380px')}
    ${star(70, C.yellow, 'left:90px;top:1270px')}
    ${site(true)}` },

  { file: 'last-minute-gift-for-grandkids', n: 18, batch: 2, board: 'gifts', anchor: 'pricing', variant: 'шаги', ai: false, theme: 'm',
    phrase: 'last minute gift for grandkids',
    title: 'Last Minute Gift for Grandkids | Nothing to Ship, Starts Tonight | Ages 6-14',
    text: 'A last minute gift for grandkids with nothing to ship: pay once, the login comes by email and the first lesson opens right away. You make it together.',
    alt: 'Mint pin that reads "Last minute gift for grandkids. Nothing to ship, nothing to wrap" with three steps: pay once, the login comes by email, the first lesson opens right away.',
    why: 'Запрос последних дней перед праздником. Всё на картинке из фактов: оплата один раз, логин на почту, первый урок сразу.',
    html: `${brand()}
    ${h('Last minute gift<br>for <mark>grandkids</mark>', { size: 106 })}
    ${p('Nothing to ship. Nothing to wrap.', 420, 44, 'color:#141A33')}
    ${rowsCard(['Pay once, no subscription', 'The login comes by email', 'Lesson one opens at once'], 540, 520)}
    ${char('anna', 470, 1060, 420)}
    ${pill('you do it together', 70, 1150, -3)}
    ${site()}` },
];


// ---- batch 3: pins built on the Instagram series (SERIES.md): one question or promise, one picture that explains it,
// one idea per pin. Series colours: Ask AI + Safe AI coral, By a kid yellow, How it works navy, Free lesson mint.
const hand = () => {
  const cx = 350, cy = 470, ang = [-72, -43, -14, 14, 43, 72], len = [250, 300, 330, 330, 300, 250];
  const fing = ang.map((a, i) => {
    const r = a * Math.PI / 180, bx = cx + Math.sin(r) * 80, by = cy - Math.cos(r) * 80, tx = cx + Math.sin(r) * (len[i] + 60), ty = cy - Math.cos(r) * (len[i] + 60);
    return `<line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="#141A33" stroke-width="86" stroke-linecap="round"/>`;
  }).join('');
  const fill = ang.map((a, i) => {
    const r = a * Math.PI / 180, bx = cx + Math.sin(r) * 80, by = cy - Math.cos(r) * 80, tx = cx + Math.sin(r) * (len[i] + 60), ty = cy - Math.cos(r) * (len[i] + 60);
    return `<line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="${i === 5 ? '#FFC533' : '#FFF4DC'}" stroke-width="64" stroke-linecap="round"/>`;
  }).join('');
  const nums = ang.map((a, i) => {
    const r = a * Math.PI / 180, tx = cx + Math.sin(r) * (len[i] + 10), ty = cy - Math.cos(r) * (len[i] + 10);
    return `<circle cx="${tx}" cy="${ty}" r="25" fill="#141A33"/><text x="${tx}" y="${ty + 12}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="34" fill="#FFF4DC">${i + 1}</text>`;
  }).join('');
  return `<svg viewBox="0 0 700 700" style="position:absolute;left:130px;top:590px;width:740px;height:740px;z-index:3">${fing}<ellipse cx="${cx}" cy="${cy + 40}" rx="215" ry="190" fill="#141A33"/>${fill}<ellipse cx="${cx}" cy="${cy + 40}" rx="199" ry="174" fill="#FFF4DC"/>${nums}</svg>`;
};
const noiseFrame = (l, t, op, label, rot) => card({ l, t, w: 200, h: 300, rot, src: `${M}/works/rainbow-cartoon.jpg`, inner:
  `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:${op}"><filter id="nz${l}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#nz${l})"/></svg>
   <div style="position:absolute;inset:0;background:#7B8099;opacity:${op * 0.55}"></div>` }) + pill(label, l + 20, t + 262, rot, '', 'height:54px;font-size:24px;z-index:8');

pins.push(
  { file: 'why-does-ai-draw-six-fingers', n: 19, board: 'ai', anchor: 'how', variant: 'один визуал', ai: false,
    phrase: 'why does AI draw six fingers',
    title: 'Why Does AI Draw Six Fingers | It Learned How Hands Look, Not How to Count | Kids and AI',
    text: 'Why does AI draw six fingers? It learned what hands look like from millions of pictures, where hands are half hidden. It copies the look and never counts. Teach kids to check.',
    alt: 'Coral pin that reads "Why does AI draw six fingers?" with a drawn hand: five fingers in cream and a sixth in yellow, numbered one to six.',
    why: 'Серия Ask AI: вопрос, парадокс (рисует лицо как фото, но не считает пальцы) и одна картинка. Рука нарисована в коде, чужих картинок нет.',
    html: `${h('Why does AI draw <mark>six fingers</mark>?', { size: 104 })}
    ${p('It paints a face like a photo.<br>It can\'t count to five.', 500, 44, 'color:#141A33')}
    ${hand()}
    ${pill('check the hands', 600, 1290, 4, '', 'height:70px;font-size:30px;z-index:8')}
    ${site()}` },

  { file: 'how-ai-draws-pictures-for-kids', n: 20, board: 'ai', anchor: 'how', variant: 'один визуал', ai: true,
    phrase: 'how AI draws pictures for kids',
    title: 'How AI Draws Pictures for Kids | It Starts With TV Static, Not a Blank Page | Easy Explainer',
    text: 'How AI draws pictures for kids, in plain words: it starts from random noise like TV static, then cleans it up a little at a time until the picture matches the words.',
    alt: 'Navy pin that reads "How AI draws pictures for kids" with four frames of one rainbow cartoon, from grey static to a clear picture: static, cleaning, almost, done.',
    why: 'Серия Ask AI: как ИИ рисует из слов. Радуга из поста 1 проявляется из шума. Объяснение общее, без названий моделей.',
    html: `${h('How AI <mark>draws</mark> pictures<br>for kids', { size: 100 })}
    ${p('It starts as TV static.<br>Then it cleans up, a little at a time.', 500, 44)}
    ${noiseFrame(56, 720, 0.95, 'static', -3)}${noiseFrame(280, 750, 0.72, 'cleaning', 2)}${noiseFrame(504, 720, 0.38, 'almost', -2)}${noiseFrame(728, 750, 0, 'done', 3)}
    ${p('The words are your kid\'s idea.', 1150, 46, 'color:#FFC533;font-weight:800')}
    ${site(true)}` },

  { file: 'why-ai-sounds-sure-when-wrong', n: 21, board: 'ai', anchor: 'how', variant: 'чат', ai: false,
    phrase: 'why AI sounds sure when wrong',
    title: 'Why AI Sounds Sure When Wrong | It Guesses the Next Word, It Does Not Look It Up | Kids',
    text: 'Why AI sounds sure when wrong: a chatbot writes the most likely next words, and confident words are very likely. Teach your kid one habit: sounds sure, still check.',
    alt: 'Coral pin that reads "Why AI sounds sure when wrong" with a chat: how many legs does a spider have, the AI says 6 and that it is 100 percent sure, and a stamp says wrong, it is 8.',
    why: 'Серия Ask AI: парадокс (ИИ не ищет ответ, а угадывает следующее слово). Пример про паука общеизвестный.',
    html: `${h('Why AI <mark>sounds sure</mark><br>when wrong', { size: 92 })}
    ${p('It isn\'t looking it up.<br>It\'s guessing the next word.', 440, 44, 'color:#141A33')}
    ${card({ l: 56, t: 640, w: 700, h: 170, rot: -1.5, inner: `<p style="padding:34px 40px;font:700 46px/1.15 Urbanist;color:#141A33">How many legs does a spider have?</p>` })}
    ${card({ l: 244, t: 850, w: 700, h: 190, rot: 1.5, cls: '', inner: `<p style="padding:30px 40px;font:700 48px/1.15 Urbanist;color:#141A33"><b style="font-family:Sora;color:${C.coral}">AI</b> &nbsp;6. I\'m 100% sure.</p>` })}
    ${pill('WRONG. It\'s 8.', 430, 1090, -6, 'dark', 'height:96px;font-size:48px;padding:0 44px;z-index:8')}
    ${p('Sounds sure? Still check.', 1260, 46, 'color:#141A33;font-weight:800')}
    ${site()}` },

  { file: 'spot-a-fake-ai-picture', n: 22, board: 'safety', anchor: 'safe', variant: 'четыре проверки', ai: true,
    phrase: 'spot a fake AI picture',
    title: 'Spot a Fake AI Picture | 4 Checks to Teach Your Kid | Kids and AI Safety',
    text: 'Spot a fake AI picture with your kid: check hands and fingers, letters on signs, shadows that point different ways, and edges that melt into the background.',
    alt: 'Coral pin that reads "Spot a fake AI picture" with a glowing rainbow cartoon marked with four numbered circles, and a list: hands, letters on signs, shadows, edges.',
    why: 'Серия Safe AI: сохраняемая шпаргалка. В курсе есть урок про фейки (facts.md); сами приметы общие знания.',
    html: `${h('Spot a <mark>fake</mark> AI<br>picture', { size: 112 })}
    ${card({ l: 56, t: 500, w: 440, h: 660, rot: -3, src: `${M}/works/rainbow-cartoon.jpg`, inner: [[70, 90], [290, 210], [90, 420], [300, 520]].map(([x, y], i) =>
      `<b style="position:absolute;left:${x}px;top:${y}px;display:grid;place-items:center;width:72px;height:72px;border-radius:50%;border:6px solid #fff;background:#141A33;color:#fff;font:800 36px Sora;box-shadow:0 0 0 4px #141A33">${i + 1}</b>`).join('') })}
    <div style="position:absolute;left:530px;top:520px;width:420px;display:grid;gap:44px">${['Hands and fingers', 'Letters on signs', 'Shadows that disagree', 'Edges that melt'].map((t, i) =>
      `<div style="display:flex;gap:18px;align-items:center"><b style="flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#141A33;color:#fff;font:800 34px Sora">${i + 1}</b><span style="font:800 42px/1.05 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>
    ${p('Too perfect? Check it.', 1220, 46, 'color:#141A33;font-weight:800')}
    ${site()}` },

  { file: 'what-grandmas-made-with-grandkids', n: 23, board: 'gifts', anchor: 'families', variant: 'четыре портрета', ai: false,
    phrase: 'what grandmas made with grandkids',
    title: 'What Grandmas Made With Grandkids | A Cartoon, a Song, a Gift, a Game | Ages 6-14',
    text: 'What grandmas made with grandkids: a cartoon, a song, a gift and a game, all in an AI course done side by side. A gift idea that is time together, not another toy.',
    alt: 'Yellow pin that reads "What grandmas made with grandkids" with four round portraits of grandmothers and what each made: Margaret a cartoon, Susan a song, Linda a gift, Patricia a game.',
    note: 'Margaret, Susan, Linda and Patricia are early-access testers. They received the course free and shared honest feedback.',
    why: 'Серия By a kid, сезон подарков. Имена, фото и проекты из таблицы отзывов в facts.md; цитат на картинке нет, только что сделали. Пометка про бесплатный курс в описании.',
    html: `${h('What grandmas<br>made with <mark>grandkids</mark>', { size: 100 })}
    ${p('A cartoon, a song, a gift, a game.', 505, 46, 'color:#141A33')}
    ${[['margaret', 'Margaret', 'a cartoon', 70, 610], ['susan', 'Susan', 'a song', 520, 650], ['linda', 'Linda', 'a gift', 70, 970], ['patricia', 'Patricia', 'a game', 520, 1010]].map(([f, n, w, l, t], i) =>
      `${ring({ l, t, d: 360, src: `${M}/landing/reviews/${f}.jpg`, pos: '50% 25%', zoom: 175, z: 4, pad: 12 })}${pill(`${n}: ${w}`, l + 20, t + 300, [-4, 3, 4, -3][i], '', 'height:62px;font-size:28px;z-index:8')}`).join('')}
    ${site()}` },

  { file: 'kid-made-a-cartoon-with-ai', n: 24, board: 'activities', anchor: 'works', variant: 'шаги', ai: true,
    phrase: 'kid made a cartoon with AI',
    title: 'Kid Made a Cartoon With AI | 4 Steps a 10-Year-Old Followed | Easy Kids Project',
    text: 'A kid made a cartoon with AI: a 10-year-old told it her story and characters, checked every scene and fixed the ones that came out wrong. About 20 minutes, a parent next to her.',
    alt: 'Yellow pin that reads "Kid made a cartoon with AI" with a cartoon cat and four steps: idea, characters, scenes, voice.',
    why: 'Серия By a kid: как сделан мультфильм, по шагам. «About 20 minutes» и «2-3 попытки» это ответ владельца от 13.11 (запись в desks/instagram.md), в facts.md цифры пока нет.',
    html: `${h('Kid made a<br><mark>cartoon</mark> with AI', { size: 112 })}
    ${card({ l: 56, t: 520, w: 420, h: 700, rot: -3, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 35%' })}
    <div style="position:absolute;left:520px;top:540px;width:430px;display:grid;gap:50px">${['An idea', 'Her characters', 'Every scene, checked', 'Her own voice'].map((t, i) =>
      `<div style="display:flex;gap:18px;align-items:center"><b style="flex:none;display:grid;place-items:center;width:70px;height:70px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 38px Sora">${i + 1}</b><span style="font:800 44px/1.05 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>
    ${p('A 10-year-old.<br>About 20 minutes.', 1260, 44, 'right:300px;color:#141A33;font-weight:800')}
    ${site()}` },
);

// Series frame (SERIES.md): colour and chip per pin. Ask AI + Safe AI coral, By a kid yellow, How it works navy, Free lesson mint.
const FRAME = { c: ['c'], y: ['y'], n: ['n'], m: ['m'] };
const SERIES_OF = {
  'non-toy-gift-idea-for-kids': ['kid', 'y'], 'gift-ideas-for-grandkids': ['kid', 'y'],
  'ai-safety-rules-for-kids': ['safe', 'c'], 'ai-house-rules-for-families': ['safe', 'c'],
  'free-ai-lesson-for-kids': ['free', 'm'], 'turn-kids-drawings-into-cartoons': ['kid', 'y'],
  'ai-projects-for-kids': ['kid', 'y'], 'how-to-teach-kids-ai': ['how', 'n'],
  'creative-screen-time-ideas-for-kids': ['kid', 'y'], 'kids-make-stickers-with-ai': ['kid', 'y'],
  'ai-for-kids-by-age': ['how', 'n'], 'ai-course-for-kids-and-parents': ['how', 'n'],
  'ai-rules-for-kids-poster': ['safe', 'c'], 'what-kids-should-never-tell-ai': ['safe', 'c'],
  'ai-safety-checklist-for-parents': ['safe', 'c'], 'experience-gifts-for-kids': ['kid', 'y'],
  'christmas-gift-ideas-for-grandkids': ['kid', 'y'], 'last-minute-gift-for-grandkids': ['free', 'm'],
  'why-does-ai-draw-six-fingers': ['ask', 'c'], 'how-ai-draws-pictures-for-kids': ['ask', 'n'],
  'why-ai-sounds-sure-when-wrong': ['ask', 'c'], 'spot-a-fake-ai-picture': ['safe', 'c'],
  'what-grandmas-made-with-grandkids': ['kid', 'y'], 'kid-made-a-cartoon-with-ai': ['kid', 'y'],
};
for (const pin of pins) [pin.series, pin.theme] = SERIES_OF[pin.file];

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
    writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}.tile.pin{width:1000px;height:1500px}</style><div class="tile pin ${pin.theme}">${head(pin.series)}${body(pin.html)}</div>`);
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
