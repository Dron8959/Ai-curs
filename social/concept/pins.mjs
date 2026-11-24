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
  <div><span style="display:flex;align-items:center;width:max-content;height:90px;padding:0 30px;border:5px solid #141A33;border-radius:999px;background:#fff;box-shadow:6px 6px 0 #141A33">
  <img src="${A(`${LOGO}/logo/wordmark-light.svg`)}" style="height:42px;width:auto;display:block" alt="Make Show Lab"></span>
  <p style="margin:12px 0 0 8px;font:800 27px Urbanist;color:var(--ink);white-space:nowrap">AI course for kids 6-14, with a parent</p></div></div>
  <span style="position:absolute;z-index:20;right:44px;top:62px;display:flex;align-items:center;height:62px;padding:0 24px;border:5px solid #141A33;border-radius:999px;background:#FFC533;box-shadow:5px 5px 0 #141A33;font:800 25px Urbanist;letter-spacing:.08em;color:#141A33">${SERIES[series]}</span>`;
// Footer on every pin: the next step, not only the address. Bottom-left, ends well before the bottom-right corner Pinterest uses.
const cta = (theme) => `<span style="position:absolute;z-index:20;left:52px;bottom:92px;display:flex;align-items:center;gap:14px;height:74px;padding:0 32px;border-radius:999px;font:800 31px Urbanist;white-space:nowrap;${theme === 'n' ? 'background:#FFC533;color:#141A33' : 'background:#141A33;color:#FFF4DC'}">
  <b style="color:${theme === 'n' ? '#141A33' : '#FFC533'}">Free first lesson</b><i style="font-style:normal;opacity:.6">|</i><span style="font-weight:700">makeshowlab.com</span></span>`;
const body = (html) => `<div style="position:absolute;inset:0;transform-origin:50% 0;transform:translateY(${HEAD + 8 - 150 * S}px) scale(${S})">${html}</div>`;
const site = () => '';   // the common footer (cta) is drawn by the renderer
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

  { file: 'ai-lessons-for-kids-at-home', n: 4, board: 'homeschool', anchor: 'free', variant: 'фото + шаги', ai: false, theme: 'm',
    phrase: 'AI lessons for kids at home',
    title: 'AI Lessons for Kids at Home | First One Free, No Card, 10-20 Minutes | Ages 6-14',
    text: 'AI lessons for kids at home that fit one evening: watch the finished thing, make your own with a parent next to you, then play it together. The first lesson is free, no card.',
    alt: 'Mint pin that reads "AI lessons for kids at home" with three steps: email only, they build a game tonight, you play it together, above a photo of a mom and daughter playing the game at a kitchen table.',
    why: 'Заменил пин про домашние правила (он повторял пины 3 и 13). Этот объясняет бесплатный урок по шагам: что нужно, сколько времени, чем кончается.',
    html: `${h('AI lessons for<br><mark>kids at home</mark>', { size: 108 })}
    ${p('The first one is free.', 410, 46, 'color:#141A33;font-weight:800')}
    ${rowsCard(['Email only, no card', 'They build a game tonight', 'You play it together'], 500, 470)}
    ${card({ l: 56, t: 1000, w: 888, h: 330, rot: 1.5, src: `${M}/landing/together-game.jpg`, pos: '50% 45%' })}
    ${pill('10 to 20 minutes', 600, 960, -4)}` },

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

  { file: 'turn-kids-drawings-into-cartoons', n: 6, board: 'activities', anchor: 'works', variant: 'было и стало', ai: true, theme: 'y',
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
    ${pill('made by a 10-year-old', 56, 1300, -3, 'dark', 'height:64px;font-size:27px')}` },

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
    alt: 'Coral pin that reads "Creative screen time ideas for kids. A screen they make on is not a screen they scroll" with a scroll-versus-make picture: a grey feed next to a pixel game.',
    why: 'Запрос про экранное время: туда приходят родители с нашей главной болью.',
    html: `${brand()}
    ${h('Creative<br><mark>screen time</mark><br>ideas for kids', { size: 110 })}
    ${p('A screen they make on is not<br>a screen they scroll.', 540, 46, 'color:#141A33')}
    ${card({ l: 56, t: 680, w: 390, h: 540, rot: -3, inner: `<div style="padding:60px 40px;display:grid;gap:26px">${[90, 70, 100, 60, 85].map((w) => `<i style="display:block;height:34px;width:${w}%;border-radius:17px;background:#C9CCDA"></i>`).join('')}</div>` })}
    ${card({ l: 480, t: 740, w: 464, h: 460, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}
    ${pill('scroll', 100, 1170, -4, '', 'background:#fff')}${pill('make', 640, 1170, 4, 'dark')}
    ${p('Ends with something to show you.', 1260, 42, 'color:#141A33;font-weight:800')}` },

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
    why: 'Кто стоит за курсом и чем это доказано: Анна сделала уроки и проверила каждый на Камилле (facts.md). Для детского продукта это вопрос доверия.',
    html: `${brand()}
    ${h('AI course for<br><mark>kids and parents</mark>', { size: 104 })}
    ${p('By a mom and her daughter.', 420, 46)}
    ${ring({ l: 56, t: 520, d: 440, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}
    ${ring({ l: 540, t: 640, d: 380, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}
    ${pill('Anna, mom', 90, 880, -5, '', `background:${C.coral}`)}${pill('Kamilla, 10', 640, 1000, 4, '', `background:${C.mint}`)}
    ${p('Every lesson was tested on Kamilla<br>at the kitchen table. What lost her got cut.', 1100, 38, 'color:#FFF4DC')}
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
    ${tape(420, 500, -4)}` },

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

// ---- batch 4 (23.11): the week 24-30 Nov, 21 pins, built on the niche research (reports/Pinterest ниша ИИ для детей.md):
// "screen-smart, made together": a real result a kid made with a parent, parent words people already search
// (activities, printable, screen time, homeschool, gift), real photos and drawn graphics in front, AI pictures only as part of a scene.
const quoteCard = (q, who, t, h, rot = -1.5, size = 50) => card({ l: 56, t, w: 888, h, rot, inner: `<div style="padding:50px 50px 0"><p style="font:700 ${size}px/1.16 Urbanist;color:#141A33">“${q}”</p>
  <p style="margin-top:24px;font:800 27px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">${who}</p></div>` });
const tips = (items, t, h, { rot = -1.2, size = 44, gap = 34, num = '#141A33', sub = [] } = {}) => card({ l: 56, t, w: 888, h, rot, inner: `<div style="padding:48px 46px 0;display:grid;gap:${gap}px">${
  items.map((r, i) => `<div style="display:flex;align-items:center;gap:26px"><b style="flex:none;display:grid;place-items:center;width:80px;height:80px;border-radius:50%;background:${num};color:#FFF4DC;font:800 44px Sora">${i + 1}</b><span><b style="display:block;font:800 ${size}px/1.06 Urbanist;color:#141A33">${r}</b>${sub[i] ? `<span style="display:block;margin-top:6px;font:600 30px/1.15 Urbanist;color:#4B5070">${sub[i]}</span>` : ''}</span></div>`).join('')}</div>` });
const bubble = (text, l, t, w, { bg = '#fff', tail = 'left', size = 44, rot = 0, z = 5 } = {}) => `<div style="position:absolute;z-index:${z};left:${l}px;top:${t}px;width:${w}px;padding:30px 36px;border:5px solid #141A33;border-radius:36px;${tail === 'left' ? 'border-bottom-left-radius:8px' : 'border-bottom-right-radius:8px'};background:${bg};box-shadow:7px 7px 0 #141A33;transform:rotate(${rot}deg);font:700 ${size}px/1.15 Urbanist;color:#141A33">${text}</div>`;
const tile = (big, small, l, t, w, bg, rot = 0) => `<div style="position:absolute;z-index:4;left:${l}px;top:${t}px;width:${w}px;padding:34px 30px;border:5px solid #141A33;border-radius:30px;background:${bg};box-shadow:7px 7px 0 #141A33;transform:rotate(${rot}deg);text-align:center"><b style="display:block;font:800 96px/1 Sora;letter-spacing:-.05em;color:#141A33">${big}</b><span style="display:block;margin-top:14px;font:800 32px/1.1 Urbanist;color:#141A33">${small}</span></div>`;
const four = (people, t0) => people.map(([f, n, w], i) => { const l = i % 2 ? 520 : 70, t = t0 + Math.floor(i / 2) * 380 + (i % 2) * 40;
  return `${ring({ l, t, d: 340, src: `${M}/landing/reviews/${f}.jpg`, pos: '50% 25%', zoom: 175, z: 4, pad: 12 })}${pill(`${n}: ${w}`, l + 16, t + 285, [-4, 3, 4, -3][i], '', 'height:60px;font-size:27px;z-index:8')}`; }).join('');

pins.push(
  { file: 'kids-make-a-video-game-with-ai', n: 25, board: 'activities', anchor: 'free', variant: 'игра + фото', ai: true,
    phrase: 'kids make a game with AI',
    title: 'Kids Make a Game With AI | A 10-Year-Old Built This Video Game | No Coding, Ages 6-14',
    text: 'Kids make a game with AI in one short lesson: a 10-year-old built this pixel park with a girl and a corgi, then played it with her mom.',
    alt: 'Yellow pin that reads "Kids make a game with AI" with a pixel-art game of a girl and a corgi in a park and a photo of a mom and daughter playing it at a kitchen table.',
    why: 'By a kid: настоящая игра Камиллы и живое фото, как они играют вместе. Ведёт на бесплатный урок, где ребёнок делает игру.',
    html: `${h('Kids make a<br><mark>game</mark> with AI', { size: 116 })}
    ${card({ l: 56, t: 470, w: 888, h: 500, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 380, t: 940, w: 564, h: 380, rot: 3, src: `${M}/landing/together-game.jpg`, pos: '50% 45%', z: 5 })}
    ${pill('her idea', 80, 1000, -4)}${pill('then you play it', 80, 1100, -2, 'dark')}` },

  { file: 'kids-write-a-song-with-ai', n: 26, board: 'activities', anchor: 'works', variant: 'цитата', ai: false,
    phrase: 'kids write a song with AI',
    title: 'Kids Write a Song With AI | From Their Own Words | A Gift for Grandma, Ages 6-14',
    text: 'Kids write a song with AI from their own words, in one short lesson with a parent next to them. Then they send it to grandma.',
    note: 'Susan is an early-access tester. She received the course free and shared honest feedback.',
    alt: 'Yellow pin that reads "Kids write a song with AI" with a grandmother\'s words: We made a song together, and she wanted to show it to everyone in the family.',
    why: 'By a kid: песня из своих слов (факт курса). Цитата Сьюзан дословная, пометка про бесплатный курс в описании.',
    html: `${h('Kids write a<br><mark>song</mark> with AI', { size: 112 })}
    ${p('Their words. A real song.', 420, 46, 'color:#141A33;font-weight:800')}
    ${quoteCard('We made a song together, and she wanted to show it to everyone in the family!', 'Susan, grandmother of an 8-year-old', 520, 470, -1.5, 54)}
    ${ring({ l: 640, t: 920, d: 300, src: `${M}/landing/reviews/susan.jpg`, pos: '50% 25%', zoom: 175, z: 6, pad: 14 })}
    ${pill('her words, her song', 70, 1060, -3)}` },

  { file: 'kids-make-a-website-with-ai', n: 27, board: 'activities', anchor: 'works', variant: 'цитата', ai: false,
    phrase: 'kids make a website with AI',
    title: 'Kids Make a Website With AI | A 7-Year-Old Did It With Mom | No Coding',
    text: 'Kids make a website with AI in one lesson, side by side with a parent. A 7-year-old made his with his mom, and now he keeps asking for the next lesson.',
    note: 'Rachel is an early-access tester. She received the course free and shared honest feedback.',
    alt: 'Yellow pin that reads "Kids make a website with AI" with a mom\'s words: We made a little website together, and he keeps asking when we can do the next lesson.',
    why: 'By a kid: сайт (факт курса) и слова мамы Рэйчел дословно. Скриншот сайта из урока не берём: его делает Анна.',
    html: `${h('Kids make a<br><mark>website</mark> with AI', { size: 112 })}
    ${p('No coding. Mom next to him.', 420, 46, 'color:#141A33;font-weight:800')}
    ${quoteCard('We made a little website together, and he keeps asking when we can do the next lesson!', 'Rachel, mom of a 7-year-old', 520, 470, 1.5, 54)}
    ${ring({ l: 640, t: 920, d: 300, src: `${M}/landing/reviews/rachel.jpg`, pos: '50% 25%', zoom: 175, z: 6, pad: 14 })}
    ${pill('his first website', 70, 1060, -3)}` },

  { file: 'thanksgiving-activity-for-kids-at-home', n: 28, board: 'activities', anchor: 'free', variant: 'три работы', ai: true,
    phrase: 'Thanksgiving activity for kids at home',
    title: 'Thanksgiving Activity for Kids at Home | Make Something to Show the Family | Ages 6-14',
    text: 'A Thanksgiving activity for kids at home: in one short lesson your kid makes a game, a cartoon or a sticker pack with AI, then shows it to the family at the table.',
    alt: 'Mint pin that reads "Thanksgiving activity for kids at home" with three things a kid made: a pixel game, a cartoon cat and a sheet of stickers.',
    why: 'Сезон: День благодарения 26.11. Обещание «покажи семье за столом» это шаг Show из урока.',
    html: `${h('Thanksgiving<br><mark>activity</mark> for kids<br>at home', { size: 100 })}
    ${p('Something to show the family at the table.', 560, 40, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 660, w: 420, h: 300, rot: -3, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 520, t: 640, w: 424, h: 640, rot: 3, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 35%', z: 4 })}
    ${card({ l: 56, t: 1000, w: 440, h: 320, rot: 2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330, z: 5 })}
    ${pill('game', 70, 930, -5)}${pill('cartoon', 700, 1230, 4)}${pill('stickers', 300, 1290, -3)}` },

  { file: 'what-moms-made-with-their-kids', n: 29, board: 'activities', anchor: 'families', variant: 'четыре портрета', ai: false,
    phrase: 'what moms made with their kids',
    title: 'What Moms Made With Their Kids | A Cartoon, a Song, a Game, a Website | AI Course',
    text: 'What moms made with their kids in a short AI course: a cartoon, a song, a game and a website. Real projects from early-access families, done side by side.',
    note: 'Emily, Jessica, Amanda and Rachel are early-access testers. They received the course free and shared honest feedback.',
    alt: 'Yellow pin that reads "What moms made with their kids" with four round portraits of moms and what each made: Emily a cartoon, Jessica a song, Amanda a game, Rachel a website.',
    why: 'By a kid: пара к пину про бабушек. Имена, фото и проекты из таблицы отзывов в facts.md.',
    html: `${h('What moms made<br>with their <mark>kids</mark>', { size: 100 })}
    ${p('A cartoon, a song, a game, a website.', 440, 44, 'color:#141A33')}
    ${four([['emily', 'Emily', 'a cartoon'], ['jessica', 'Jessica', 'a song'], ['amanda', 'Amanda', 'a game'], ['rachel', 'Rachel', 'a website']], 560)}` },

  { file: 'kids-voice-their-own-cartoon', n: 30, board: 'activities', anchor: 'works', variant: 'кадр + запись', ai: true,
    phrase: 'kids voice their own cartoon',
    title: 'Kids Voice Their Own Cartoon | Their Characters, Their Voice | Easy AI Project',
    text: 'Kids voice their own cartoon: they make the characters with AI, then record the voice-over themselves. Their words and their own voice, with a parent next to them.',
    alt: 'Yellow pin that reads "Kids voice their own cartoon" with a frame from a 10-year-old\'s cartoon of two girls and a cat in a bakery and a red record button.',
    why: 'By a kid: озвучка своим голосом (факт курса). Кадр из мультфильма Камиллы, ИИ-картинка только часть сцены.',
    html: `${h('Kids <mark>voice</mark> their<br>own cartoon', { size: 112 })}
    ${p('Their characters. Their own voice.', 420, 46, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 520, w: 888, h: 640, rot: -2, src: `${M}/landing/cartoon-friends.jpg`, pos: '50% 40%' })}
    <div style="position:absolute;z-index:8;left:90px;top:1110px;display:flex;align-items:center;gap:18px;height:96px;padding:0 40px;border:5px solid #141A33;border-radius:999px;background:#fff;box-shadow:7px 7px 0 #141A33;transform:rotate(-3deg)"><i style="width:44px;height:44px;border-radius:50%;background:${C.coral}"></i><b style="font:800 42px Urbanist;color:#141A33">REC · her voice</b></div>
    ${pill('made by a 10-year-old', 560, 1200, 4, 'dark')}` },

  { file: 'family-ai-agreement-for-kids', n: 31, board: 'safety', anchor: 'safe', variant: 'памятка с подписями', ai: false,
    phrase: 'family AI agreement for kids',
    title: 'Family AI Agreement for Kids | 5 Rules You Both Sign | Printable for the Fridge',
    text: 'A family AI agreement for kids: five simple rules you read together and both sign, from whose account it is to checking anything that looks too perfect. Print it.',
    alt: 'Coral pin with a paper sheet titled "Our family AI agreement": five rules with tick boxes and two signature lines, kid and parent.',
    why: 'Safe AI: сохраняемая распечатка. Правила те же пять из facts.md, новое только формат «подписываем вдвоём».',
    html: `${h('Family <mark>AI agreement</mark><br>for kids', { size: 90 })}
    ${card({ l: 56, t: 470, w: 888, h: 760, rot: 1, cls: 'paper', inner: `<div style="padding:46px 50px 0">
      <p style="font:800 30px Urbanist;letter-spacing:.1em;text-transform:uppercase;color:#4B5070">Our family AI agreement</p>
      <div style="margin-top:28px;display:grid;gap:30px">${['We use AI on a parent\'s account', 'No chats with strangers', 'Some things AI never hears', 'We ask before we click a link', 'Too perfect? We check it'].map((t) =>
        `<div style="display:flex;align-items:center;gap:22px"><i style="flex:none;width:58px;height:58px;border:5px solid #141A33;border-radius:12px;background:#fff"></i><b style="font:800 42px/1.05 Urbanist;color:#141A33">${t}</b></div>`).join('')}</div>
      <div style="margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:40px">${['Kid', 'Parent'].map((w) => `<div><i style="display:block;height:5px;background:#141A33"></i><span style="display:block;margin-top:10px;font:800 28px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">${w}</span></div>`).join('')}</div></div>` })}
    ${tape(420, 440, -3)}` },

  { file: 'is-ai-safe-for-kids', n: 32, board: 'safety', anchor: 'safe', variant: 'вопрос + список', ai: false,
    phrase: 'is AI safe for kids',
    title: 'Is AI Safe for Kids | 4 Things That Make It Safer | For Parents of Kids 6-14',
    text: 'Is AI safe for kids? It depends on the setup: the account is the parent\'s, there are no chats with strangers, an AI avatar is always labeled, and a parent sits nearby.',
    alt: 'Coral pin that reads "Is AI safe for kids?" with four points: your account not theirs, no chats with strangers, AI is always labeled, you sit next to them.',
    why: 'Safe AI: главный вопрос родителя. Все четыре пункта из раздела «Безопасность» facts.md.',
    html: `${h('Is AI <mark>safe</mark><br>for kids?', { size: 120 })}
    ${p('It depends on the setup.', 440, 46, 'color:#141A33;font-weight:800')}
    ${tips(['Your account, not theirs', 'No chats with strangers', 'AI is always labeled', 'You sit next to them'], 540, 680, { size: 48, gap: 50 })}` },

  { file: 'chatbot-safety-tips-for-kids', n: 33, board: 'safety', anchor: 'safe', variant: 'чат', ai: false,
    phrase: 'chatbot safety tips for kids',
    title: 'Chatbot Safety Tips for Kids | 4 Things to Say Before They Start | Kids and AI',
    text: 'Chatbot safety tips for kids: it is a program, not a friend; it can be wrong, so check; some things it never hears; and a grown-up stays in the room.',
    alt: 'Coral pin that reads "Chatbot safety tips for kids" with four chat bubbles: it is a program not a friend, it can be wrong, some things it never hears, a grown-up stays in the room.',
    why: 'Safe AI: что сказать ребёнку до первого чата. Общие правила и наши из facts.md.',
    html: `${h('Chatbot <mark>safety</mark><br>tips for kids', { size: 110 })}
    ${bubble('It\'s a program, not a friend.', 56, 450, 700, { rot: -2 })}
    ${bubble('It can be wrong. Check it.', 244, 650, 700, { tail: 'right', bg: '#FFF4DC', rot: 2 })}
    ${bubble('Some things it never hears.', 56, 850, 700, { rot: -1 })}
    ${bubble('A grown-up stays in the room.', 244, 1050, 700, { tail: 'right', bg: '#FFF4DC', rot: 1.5 })}` },

  { file: 'teach-kids-to-spot-fake-videos', n: 34, board: 'safety', anchor: 'safe', variant: 'экран + список', ai: false,
    phrase: 'teach kids to spot fake videos',
    title: 'Teach Kids to Spot Fake Videos | 4 Things to Watch For | Kids and AI Safety',
    text: 'Teach kids to spot fake videos: watch if the mouth matches the words, look at the hands, the eyes and blinking, and the edges of the face. Too perfect? Check before you share.',
    alt: 'Coral pin that reads "Teach kids to spot fake videos" with a video player and a list: mouth and words, hands, eyes and blinking, edges of the face.',
    why: 'Safe AI: в курсе есть урок про фейки (facts.md). Сами приметы общие знания.',
    html: `${h('Teach kids to spot<br><mark>fake videos</mark>', { size: 100 })}
    <div style="position:absolute;z-index:3;left:56px;top:450px;width:888px;height:300px;border:6px solid #141A33;border-radius:30px;background:#141A33;box-shadow:8px 8px 0 #141A33;transform:rotate(-1.5deg);display:grid;place-items:center"><svg viewBox="0 0 100 100" style="width:140px;height:140px"><circle cx="50" cy="50" r="46" fill="#FFF4DC"/><path d="M40 30 L72 50 L40 70 Z" fill="#141A33"/></svg><i style="position:absolute;left:40px;right:40px;bottom:36px;height:12px;border-radius:6px;background:#4B5070"></i><i style="position:absolute;left:40px;width:300px;bottom:36px;height:12px;border-radius:6px;background:${C.coral}"></i></div>
    ${tips(['Does the mouth match the words?', 'Look at the hands', 'Eyes and blinking', 'Edges of the face'], 800, 520, { size: 42, gap: 30 })}` },

  { file: 'what-is-ai-explained-for-kids', n: 35, board: 'ai', anchor: 'how', variant: 'схема', ai: false,
    phrase: 'what is AI explained for kids',
    title: 'What Is AI Explained for Kids | A Program That Learned From Examples | Easy Answer',
    text: 'What is AI explained for kids: a computer program that looked at a huge number of examples and learned to guess what comes next. It guesses well, and it can still be wrong.',
    alt: 'Coral pin that reads "What is AI? Explained for kids" with a grid of many small example cards, an arrow, and a speech bubble that says a good guess.',
    why: 'Ask AI: базовый вопрос ребёнка, ответ общими знаниями, просто и верно. Схема нарисована в коде.',
    html: `${h('What is AI?<br><mark>Explained</mark> for kids', { size: 92 })}
    ${p('A program that learned from a huge pile of examples.', 450, 40, 'color:#141A33;font-weight:800')}
    <div style="position:absolute;z-index:3;left:56px;top:580px;width:440px;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;transform:rotate(-2deg)">${Array.from({ length: 30 }, (_, i) => `<i style="display:block;height:62px;border:4px solid #141A33;border-radius:12px;background:${['#FFF4DC', '#FFC533', '#5FE0A8', '#fff', '#B9C0DE'][i % 5]}"></i>`).join('')}</div>
    ${pill('examples', 150, 1110, -3)}
    <svg viewBox="0 0 120 60" style="position:absolute;z-index:3;left:500px;top:780px;width:140px;height:70px"><path d="M5 30 H95" stroke="#141A33" stroke-width="10" stroke-linecap="round"/><path d="M80 10 L108 30 L80 50" fill="none" stroke="#141A33" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${bubble('A good guess. Still check it.', 640, 700, 300, { size: 46, rot: 2 })}` },

  { file: 'how-does-ai-make-music', n: 36, board: 'ai', anchor: 'how', variant: 'слова → звук', ai: false,
    phrase: 'how does AI make music',
    title: 'How Does AI Make Music | It Learned Which Sounds Follow Which | For Kids and Parents',
    text: 'How does AI make music from a kid\'s words? It learned from a huge amount of recorded music which sounds tend to follow which, then builds the song step by step.',
    alt: 'Navy pin that reads "How does AI make music?" with a note card of a kid\'s words, an arrow and a row of sound bars.',
    why: 'Ask AI: как ИИ делает песню (в курсе ребёнок делает песню из своих слов). Объяснение общее, без названий моделей.',
    html: `${h('How does AI<br>make <mark>music</mark>?', { size: 112 })}
    ${p('It learned which sounds tend to follow which.', 440, 42)}
    ${card({ l: 56, t: 560, w: 640, h: 300, rot: -2, cls: 'paper', inner: `<p style="padding:40px 44px;font:400 64px/1.1 'Caveat Brush';color:#141A33">a happy song about<br>my dog who can fly</p>` })}
    ${pill('their words', 80, 830, -3)}
    <svg viewBox="0 0 888 300" style="position:absolute;z-index:3;left:56px;top:950px;width:888px;height:300px">${Array.from({ length: 22 }, (_, i) => { const hh = [60, 120, 200, 140, 90, 230, 170, 110, 260, 190, 130, 220, 80, 150, 240, 180, 100, 210, 140, 70, 160, 110][i]; return `<rect x="${i * 40 + 6}" y="${150 - hh / 2}" width="26" height="${hh}" rx="13" fill="${['#FFC533', '#5FE0A8', '#FF6F4A'][i % 3]}"/>`; }).join('')}</svg>
    ${pill('a song', 700, 1220, 4)}` },

  { file: 'ai-prompts-for-kids', n: 37, board: 'ai', anchor: 'how', variant: 'шаблон', ai: false,
    phrase: 'AI prompts for kids',
    title: 'AI Prompts for Kids | A Fill-In Template for Their First Picture | Save for Later',
    text: 'AI prompts for kids, made simple: fill in what to make, what it is about and how it looks. Your kid has the idea, the AI follows it, and you check the result together.',
    alt: 'Coral pin that reads "AI prompts for kids" with a fill-in template: make a blank about blank that looks blank, filled in by hand: a picture, a dog who can fly, bright and silly.',
    why: 'Ask AI: сохраняемый шаблон, по ресерчу «prompts for kids» ищут, но там в основном сервисы. Пример в шаблоне выдуман как пример, а не как работа ребёнка.',
    html: `${h('AI <mark>prompts</mark><br>for kids', { size: 120 })}
    ${p('A fill-in template for their first picture.', 440, 42, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 540, w: 888, h: 760, rot: -1, cls: 'paper', inner: `<div style="padding:50px 54px;display:grid;gap:44px">${[['Make a', 'a picture'], ['about', 'a dog who can fly'], ['that looks', 'bright and silly']].map(([a, b]) =>
      `<div><b style="display:block;font:800 52px Urbanist;color:#141A33">${a}</b><span style="display:block;margin-top:6px;padding-bottom:6px;border-bottom:5px solid #141A33;font:400 72px/1.05 'Caveat Brush';color:${C.coral}">${b}</span></div>`).join('')}</div>` })}
    ${tape(400, 520, 4)}` },

  { file: 'fun-ai-experiment-for-kids', n: 38, board: 'ai', anchor: 'how', variant: 'три ответа', ai: false,
    phrase: 'fun AI experiment for kids',
    title: 'Fun AI Experiment for Kids | One Question, Three Answers | Try It Tonight',
    text: 'A fun AI experiment for kids: ask why the sky is blue, once for a 6-year-old, once for a 12-year-old and once for grandma. Same topic, new words. Which one did they like?',
    alt: 'Coral pin that reads "Fun AI experiment for kids" with a question, why is the sky blue, and three answer bubbles labeled for a 6-year-old, for a 12-year-old and for grandma.',
    why: 'Ask AI: опыт на вечер, вопрос + парадокс (одна тема, разные слова). Тот же сюжет есть в Threads.',
    html: `${h('Fun AI <mark>experiment</mark><br>for kids', { size: 96 })}
    ${bubble('Why is the sky blue?', 56, 450, 620, { size: 50, rot: -2, bg: '#FFC533' })}
    ${[['for a 6-year-old', 600], ['for a 12-year-old', 820], ['for grandma', 1040]].map(([w, t], i) => `${card({ l: i % 2 ? 56 : 210, t, w: 734, h: 170, rot: i % 2 ? -1.5 : 1.5, inner: `<div style="padding:28px 36px;display:flex;flex-direction:column;gap:14px">${[90, 70].map((x) => `<i style="display:block;height:26px;width:${x}%;border-radius:13px;background:#C9CCDA"></i>`).join('')}</div>` })}${pill(w, i % 2 ? 80 : 560, t + 130, i % 2 ? -3 : 3, 'dark', 'z-index:8')}`).join('')}` },

  { file: 'ai-for-6-year-olds', n: 39, board: 'homeschool', anchor: 'faq', variant: 'диалог', ai: false,
    phrase: 'AI for 6 year olds',
    title: 'AI for 6 Year Olds | They Talk, You Type | A Parent-Led First Lesson',
    text: 'AI for 6 year olds works when the parent types: your kid says the idea out loud, you type it, and together you check what comes back. The idea stays theirs.',
    alt: 'Dark blue pin that reads "AI for 6 year olds. They talk, you type" with a speech bubble from a kid and a drawn keyboard for the parent.',
    why: 'How it works: возраст 6 из facts.md («шестилетний говорит, родитель печатает»). Пример в пузыре общий, не история конкретного ребёнка.',
    html: `${h('AI for<br><mark>6 year olds</mark>', { size: 120 })}
    ${p('They talk. You type.', 440, 50, 'font-weight:800')}
    ${bubble('A dog who can fly! And he\'s orange!', 56, 560, 640, { size: 54, rot: -2, bg: '#FFC533' })}
    ${pill('your kid', 80, 800, -4)}
    <div style="position:absolute;z-index:4;left:180px;top:900px;width:764px;padding:30px;border:6px solid #FFF4DC;border-radius:30px;background:#1D2550;box-shadow:8px 8px 0 #FFC533;transform:rotate(2deg);display:grid;gap:14px">${[10, 9, 7].map((n) => `<div style="display:flex;gap:12px;justify-content:center">${Array.from({ length: n }, () => '<i style="width:56px;height:50px;border-radius:10px;background:#FFF4DC"></i>').join('')}</div>`).join('')}<div style="display:flex;justify-content:center"><i style="width:420px;height:50px;border-radius:10px;background:#FFF4DC"></i></div></div>
    ${pill('you', 760, 1250, 4)}` },

  { file: 'short-lessons-for-kids-at-home', n: 40, board: 'homeschool', anchor: 'how', variant: 'цифры', ai: false,
    phrase: 'short lessons for kids at home',
    title: 'Short Lessons for Kids at Home | 6 to 20 Minutes, Done in About Two Weeks | AI Course',
    text: 'Short lessons for kids at home: each one takes 6 to 20 minutes and ends with a finished thing. Most families do one every day or two and finish in about two weeks.',
    alt: 'Dark blue pin that reads "Short lessons for kids at home" with two tiles: 6 to 20 minutes a lesson, and about 2 weeks for the course.',
    why: 'How it works: длина уроков и темп из facts.md, без обещаний сверх них.',
    html: `${h('Short <mark>lessons</mark><br>for kids at home', { size: 106 })}
    ${p('Each one ends with a finished thing.', 450, 44)}
    ${tile('6–20', 'minutes a lesson', 56, 580, 420, '#FFC533', -3)}
    ${tile('~2', 'weeks for the course', 524, 640, 420, '#5FE0A8', 3)}
    ${p('Most families do one every day or two.<br>Your pace, no deadlines.', 1050, 40, 'font-weight:800')}` },

  { file: 'what-kids-need-to-learn-ai', n: 41, board: 'homeschool', anchor: 'faq', variant: 'чек-лист', ai: false,
    phrase: 'what kids need to learn AI',
    title: 'What Kids Need to Learn AI | A Laptop or Tablet and You | Nothing to Install',
    text: 'What kids need to learn AI at home: a laptop or tablet and a parent next to them. Nothing to install, the tools run on your account, and you do not need to know AI first.',
    alt: 'Dark blue pin that reads "What kids need to learn AI" with a checklist: a laptop or tablet, nothing to install, your account, no AI know-how needed.',
    why: 'How it works: что нужно для урока (facts.md: ноутбук или планшет, ничего не ставить, аккаунт родителя, родителю не нужно знать ИИ).',
    html: `${h('What kids need<br>to <mark>learn AI</mark>', { size: 108 })}
    ${card({ l: 56, t: 470, w: 888, h: 760, rot: 1.2, inner: `<div style="padding:56px 50px 0;display:grid;gap:54px">${['A laptop or tablet', 'Nothing to install', 'Your account, not theirs', 'No AI know-how needed', 'You, next to them'].map((t) =>
      `<div style="display:flex;align-items:center;gap:28px"><b style="flex:none;display:grid;place-items:center;width:80px;height:80px;border:5px solid #141A33;border-radius:16px;background:${C.yellow};font:800 52px/1 Sora;color:#141A33">✓</b><span style="font:800 48px/1.06 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>` })}` },

  { file: 'ai-for-homeschool-kids', n: 42, board: 'homeschool', anchor: 'how', variant: 'петля', ai: false,
    phrase: 'AI for homeschool kids',
    title: 'AI for Homeschool Kids | Watch, Make, Show in One Lesson | Ages 6-14',
    text: 'AI for homeschool kids in a simple loop: watch a finished example, make your own with a parent next to you, show it to the family. Each lesson ends with a real project.',
    alt: 'Dark blue pin that reads "AI for homeschool kids" with a loop of three steps: watch, make, show, around a photo of a girl at a laptop.',
    why: 'How it works: петля Watch, Make, Show из facts.md, нарисованная кругом (у пина 8 те же шаги, но три фото).',
    html: `${h('AI for<br><mark>homeschool</mark> kids', { size: 112 })}
    ${ring({ l: 250, t: 640, d: 500, src: `${M}/landing/step-make.jpg`, pos: '50% 50%', zoom: 160, z: 3 })}
    <svg viewBox="0 0 700 700" style="position:absolute;z-index:2;left:150px;top:540px;width:700px;height:700px"><circle cx="350" cy="350" r="320" fill="none" stroke="#FFC533" stroke-width="14" stroke-dasharray="40 26"/></svg>
    ${pill('1 Watch', 360, 520, -3)}${pill('2 Make', 700, 1060, 4)}${pill('3 Show', 80, 1060, -4)}
    ${p('One lesson, one real project.', 1250, 42, 'font-weight:800;text-align:center')}` },

  { file: 'gift-for-kids-who-love-tech', n: 43, board: 'gifts', anchor: 'pricing', variant: 'подарок', ai: true,
    phrase: 'gift for kids who love tech',
    title: 'Gift for Kids Who Love Tech | Screen Time That Ends in Something They Made | Ages 6-14',
    text: 'A gift for kids who love tech: an AI creativity course they do with you. Pay once, no subscription, and each short lesson ends with a game, a cartoon or a song they made.',
    alt: 'Mint pin that reads "Gift for kids who love tech" with a gift tag over a cartoon and a pixel game: pay once, no subscription.',
    why: 'Сезон подарков и Black Friday: подарок без скидок (скидок в facts.md нет). Оплата один раз, без подписки.',
    html: `${h('Gift for kids<br>who love <mark>tech</mark>', { size: 112 })}
    ${p('Screen time that ends in something they made.', 440, 40, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 560, w: 520, h: 680, rot: -3, src: `${M}/landing/cartoon-girl.jpg`, pos: '30% 40%' })}
    ${card({ l: 500, t: 620, w: 444, h: 300, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}
    <div style="position:absolute;z-index:6;left:520px;top:960px;width:420px;padding:36px 34px;border:5px solid #141A33;border-radius:26px;background:#fff;box-shadow:8px 8px 0 #141A33;transform:rotate(4deg)"><b style="display:block;font:800 30px Urbanist;letter-spacing:.1em;text-transform:uppercase;color:${C.coral}">Gift</b><b style="display:block;margin-top:10px;font:800 46px/1.08 Urbanist;color:#141A33">Pay once.<br>No subscription.</b></div>` },

  { file: 'free-ai-class-for-kids-online', n: 44, board: 'activities', anchor: 'free', variant: 'форма', ai: true,
    phrase: 'free AI class for kids online',
    title: 'Free AI Class for Kids Online | No Card, Just an Email | A Game in 10-20 Minutes',
    text: 'A free AI class for kids online: leave your email, no card, and your kid builds a playable game in 10 to 20 minutes on a laptop or tablet. Then you play it together.',
    alt: 'Mint pin that reads "Free AI class for kids online" with a sign-up field that says your email, a free stamp and a pixel game below.',
    why: 'Free lesson: прямой призыв, каждый пункт из раздела «Бесплатный урок» facts.md.',
    html: `${h('<mark>Free</mark> AI class<br>for kids online', { size: 110 })}
    <div style="position:absolute;z-index:4;left:56px;top:470px;width:888px;display:flex;gap:16px;transform:rotate(-1.5deg)"><span style="flex:1;height:110px;padding:0 34px;display:flex;align-items:center;border:5px solid #141A33;border-radius:22px;background:#fff;font:700 44px Urbanist;color:#8A8FA8">your email</span><b style="height:110px;padding:0 34px;display:flex;align-items:center;border:5px solid #141A33;border-radius:22px;background:#141A33;color:#FFF4DC;font:800 40px Urbanist">Start</b></div>
    ${pill('no card', 640, 620, 4)}
    ${card({ l: 56, t: 720, w: 888, h: 520, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${pill('their game, 10–20 minutes', 90, 1200, -3, 'dark')}` },

  { file: 'winter-break-activities-for-kids', n: 45, board: 'screen', anchor: 'free', variant: 'три плитки', ai: true,
    phrase: 'winter break activities for kids',
    title: 'Winter Break Activities for Kids | Make a Game, a Cartoon or a Song | Ages 6-14',
    text: 'Winter break activities for kids that are more than scrolling: short lessons where they make a game, a cartoon or a song with AI, with you sitting next to them.',
    alt: 'Mint pin that reads "Winter break activities for kids" with sparkles and three pictures: a pixel game, a cartoon cat and a sticker sheet.',
    why: 'Сезон: зимние каникулы в США с середины декабря, искать начинают заранее. Экран, который заканчивается вещью.',
    html: `${h('Winter break<br><mark>activities</mark><br>for kids', { size: 104 })}
    ${p('More than scrolling.', 560, 46, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 680, w: 430, h: 300, rot: -3, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 520, t: 660, w: 424, h: 620, rot: 3, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 35%', z: 4 })}
    ${card({ l: 56, t: 1010, w: 440, h: 300, rot: 2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330, z: 5 })}
    ${star(80, '#fff', 'left:860px;top:560px')}${star(44, '#fff', 'left:800px;top:600px')}${star(36, '#fff', 'left:470px;top:640px')}` },
);

// ---- batch 5 (24.11): the owner's 2-week topic bank (A fear "AI thinks for my kid", B screen time, C safety, D explainers,
// E "what to do with a bored kid", F gifts; 80% about the parent's problem, 20% about the course), turned into searches.
// Hook = the parent's search phrase, body = something to use tonight, the course only in the footer and the last line.
const promptCard = (lines, t, h, label = 'copy this prompt') => `${card({ l: 56, t, w: 888, h, rot: -1, inner: `<div style="padding:44px 46px 0"><p style="font:800 28px Urbanist;letter-spacing:.1em;text-transform:uppercase;color:#4B5070">${label}</p>
  <p style="margin-top:22px;padding:30px 34px;border-radius:22px;background:#141A33;color:#FFF4DC;font:600 44px/1.25 Urbanist">${lines}</p></div>` })}`;
const twoCol = (left, right, t, lt = 'Watching', rt = 'Making') => `
  ${card({ l: 56, t, w: 420, h: 700, rot: -2, inner: `<div style="padding:40px 34px"><b style="display:block;font:800 52px Sora;letter-spacing:-.04em;color:#8A8FA8">${lt}</b><div style="margin-top:30px;display:grid;gap:26px">${left.map((x) => `<span style="font:700 38px/1.1 Urbanist;color:#4B5070">${x}</span>`).join('')}</div></div>` })}
  ${card({ l: 524, t: t + 30, w: 420, h: 700, rot: 2, inner: `<div style="padding:40px 34px"><b style="display:block;font:800 52px Sora;letter-spacing:-.04em;color:#141A33">${rt}</b><div style="margin-top:30px;display:grid;gap:26px">${right.map((x) => `<span style="font:800 38px/1.1 Urbanist;color:#141A33">${x}</span>`).join('')}</div></div>`, z: 4 })}`;
const strip = (srcs, t) => srcs.map(([src, pos, lab], i) => `${card({ l: 56 + i * 300, t: t + (i % 2) * 40, w: 280, h: 480, rot: [-3, 2, -2][i], src, pos, z: 3 + i })}${pill(lab, 70 + i * 300, t + 430 + (i % 2) * 40, [-4, 3, -3][i], '', 'z-index:8;height:58px;font-size:26px')}`).join('');

pins.push(
  // A. "AI will think for my kid"
  { file: 'ai-homework-help-for-kids', n: 46, board: 'ai', anchor: 'how', variant: 'промпт', ai: false,
    phrase: 'AI homework help for kids',
    title: 'AI Homework Help for Kids | Make It Quiz Them, Not Answer | A Prompt to Copy',
    text: 'AI homework help for kids that keeps them thinking: tell the chatbot to quiz your kid one question at a time instead of giving answers. Copy the prompt and try it tonight.',
    alt: 'Coral pin that reads "AI homework help for kids. Make it quiz them, not answer" with a prompt to copy: do not give me the answer, ask me one question at a time and tell me if I am right.',
    why: 'Тема A1: страх «ИИ делает уроки за ребёнка». Польза на сегодня: промпт «квизуй, а не отвечай». Общий приём, без фактов о курсе.',
    html: `${h('AI <mark>homework</mark><br>help for kids', { size: 112 })}
    ${p('Make it quiz them. Not answer for them.', 440, 44, 'color:#141A33;font-weight:800')}
    ${promptCard('Don\'t give me the answer. Ask me one question at a time, and tell me if I got it right.', 560, 560)}
    ${pill('try it tonight', 600, 1080, 4)}` },

  { file: 'how-kids-should-use-ai', n: 47, board: 'ai', anchor: 'how', variant: 'петля', ai: false,
    phrase: 'how kids should use AI',
    title: 'How Kids Should Use AI | One Habit: Their Idea, AI Does It, They Fix It | Ages 6-14',
    text: 'How kids should use AI comes down to one habit: the kid has the idea, tells the AI, checks what comes back and fixes it. The thinking stays with the child.',
    alt: 'Coral pin that reads "How kids should use AI. One habit" with four steps in a loop: their idea, they tell the AI, they check it, they fix it.',
    why: 'Тема A2: разница между «списывает» и «строит» в одной привычке. Петля «решает, говорит ИИ, проверяет, правит» уже есть в постах Threads и Instagram.',
    html: `${h('How kids <mark>should</mark><br>use AI', { size: 104 })}
    ${p('One habit makes the difference.', 440, 46, 'color:#141A33;font-weight:800')}
    ${tips(['Their idea', 'They tell the AI', 'They check it', 'They fix it'], 540, 640, { size: 54, gap: 52 })}
    ${p('The thinking stays with the kid.', 1240, 42, 'color:#141A33;font-weight:800')}` },

  { file: 'before-your-kid-uses-chatgpt', n: 48, board: 'safety', anchor: 'safe', variant: 'три вопроса', ai: false,
    phrase: 'before your kid uses ChatGPT',
    title: 'Before Your Kid Uses ChatGPT | 3 Questions to Ask First | For Parents of Kids 6-14',
    text: 'Before your kid uses ChatGPT, ask three questions: whose account is it, who can message them there, and what never goes into the chat. Then sit next to them the first time.',
    alt: 'Coral pin that reads "Before your kid uses ChatGPT: 3 questions" in three big question cards: whose account is it, who can message them, what never goes in.',
    why: 'Тема A3. Три вопроса из наших правил безопасности (facts.md: аккаунт родителя, без чатов с незнакомцами, что не говорить ИИ).',
    html: `${h('Before your kid<br>uses <mark>ChatGPT</mark>', { size: 106 })}
    ${p('Ask these 3 questions first.', 440, 46, 'color:#141A33;font-weight:800')}
    ${bubble('Whose account is it?', 56, 560, 760, { size: 54, rot: -2, bg: '#FFF4DC' })}
    ${bubble('Who can message them there?', 184, 790, 760, { size: 54, tail: 'right', rot: 2 })}
    ${bubble('What never goes into the chat?', 56, 1020, 800, { size: 54, rot: -1, bg: '#FFF4DC' })}` },

  { file: 'is-using-ai-for-homework-cheating', n: 49, board: 'homeschool', anchor: 'how', variant: 'три проверки', ai: false,
    phrase: 'is using AI for homework cheating',
    title: 'Is Using AI for Homework Cheating | 3 Checks That Show Who Did the Thinking | Parents',
    text: 'Is using AI for homework cheating? Check three things: can your kid explain it in their own words, did they decide what to ask, and did they check the answer. If yes, they did the thinking.',
    alt: 'Coral pin that reads "Is using AI for homework cheating?" with three checks: can they explain it in their own words, did they decide what to ask, did they check the answer.',
    why: 'Тема A4, без непроверяемого «учителя видят за секунды»: вместо этого три проверки для родителя.',
    html: `${h('Is using AI for<br><mark>homework</mark> cheating?', { size: 86 })}
    ${p('Three checks that show who did the thinking.', 440, 42, 'color:#141A33;font-weight:800')}
    ${tips(['Can they explain it in their own words?', 'Did they decide what to ask?', 'Did they check the answer?'], 560, 620, { size: 46, gap: 52 })}
    ${pill('3 yes = their thinking', 520, 1180, 4, 'dark')}` },

  // B. Screen time
  { file: 'active-vs-passive-screen-time', n: 50, board: 'screen', anchor: 'problem', variant: 'две колонки', ai: false,
    phrase: 'active vs passive screen time',
    title: 'Active vs Passive Screen Time | How to Tell in 10 Seconds | For Parents of Kids 6-14',
    text: 'Active vs passive screen time, the 10-second test: ask your kid what they made. Watching, scrolling and swiping are passive. Building, writing and recording are active.',
    alt: 'Coral pin that reads "Active vs passive screen time" with two cards: watching, with scroll, swipe, next video; making, with build, write, record, show you.',
    why: 'Тема B6. Тест за 10 секунд: «что ты сделал?». Мысль бренда «экран, который заканчивается вещью».',
    html: `${h('Active vs passive<br><mark>screen time</mark>', { size: 100 })}
    ${p('The 10-second test: ask "what did you make?"', 440, 40, 'color:#141A33;font-weight:800')}
    ${twoCol(['Scroll', 'Swipe', 'Next video', 'Again'], ['Build', 'Write', 'Record', 'Show you'], 560, 'Passive', 'Active')}` },

  { file: 'alternatives-to-youtube-for-kids', n: 51, board: 'screen', anchor: 'free', variant: 'час видео против часа', ai: true,
    phrase: 'alternatives to YouTube for kids',
    title: 'Alternatives to YouTube for Kids | What One Hour of Making Looks Like | Ages 6-14',
    text: 'Alternatives to YouTube for kids: one hour of short lessons can end with a game, a song and a sticker pack your kid made, with you next to them, instead of an hour of videos.',
    alt: 'Coral pin that reads "Alternatives to YouTube for kids" comparing one hour of videos, a grey stack of thumbnails, with one hour of making: a game, a song, a sticker pack.',
    why: 'Тема B5 без чужой статистики «20 часов Shorts»: просто «час видео или час, в котором ребёнок сделал три вещи». Уроки 6–20 минут (facts.md).',
    html: `${h('Alternatives to<br><mark>YouTube</mark> for kids', { size: 104 })}
    ${p('One hour of making looks like this:', 440, 44, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 560, w: 888, h: 300, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 56, t: 900, w: 500, h: 360, rot: 2, src: `${M}/landing/step-show.jpg`, pos: '58% 80.3%', zoom: 330, z: 4 })}
    ${tile('♪', 'a song', 600, 920, 344, '#FFF4DC', 3)}
    ${pill('a game', 80, 820, -4)}${pill('a sticker pack', 90, 1220, -3)}` },

  { file: 'educational-screen-time-for-kids', n: 52, board: 'screen', anchor: 'problem', variant: 'текст', ai: false,
    phrase: 'educational screen time for kids',
    title: 'Educational Screen Time for Kids | Change What the Screen Is For | Ages 6-14',
    text: 'Educational screen time for kids does not mean less fun. Change what the screen is for: it ends with something they made and want to show you, not with the next video.',
    alt: 'Coral pin that reads "Educational screen time for kids. Change what the screen is for" with a drawn girl in headphones and the words: it ends with something to show you.',
    why: 'Тема B7 без личной истории Анны (её нет в facts.md): та же мысль общими словами бренда.',
    html: `${h('Educational<br><mark>screen time</mark><br>for kids', { size: 104 })}
    ${p('Don\'t cut the screen.<br>Change what it\'s for.', 560, 50, 'color:#141A33;font-weight:800')}
    ${char('kamilla', 500, 760, 460)}
    ${bubble('Look what I made!', 70, 860, 420, { size: 50, rot: -3, bg: '#FFF4DC' })}` },

  // C. Safety
  { file: 'safe-ai-apps-for-kids', n: 53, board: 'safety', anchor: 'safe', variant: 'чек-лист', ai: false,
    phrase: 'safe AI apps for kids',
    title: 'Safe AI Apps for Kids | 3 Things to Check Before They Start | Parent Checklist',
    text: 'Safe AI apps for kids pass three checks: the account belongs to the parent, strangers cannot message your kid, and anything made by AI is clearly labeled.',
    alt: 'Coral pin that reads "Safe AI apps for kids: 3 things to check" with a checklist: the account is yours, no messages from strangers, AI is labeled.',
    why: 'Тема C9. Три проверки из facts.md (раздел «Безопасность»).',
    html: `${h('Safe <mark>AI apps</mark><br>for kids', { size: 118 })}
    ${p('3 things I check before they start.', 440, 46, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 560, w: 888, h: 620, rot: 1.2, inner: `<div style="padding:60px 50px 0;display:grid;gap:64px">${['The account is mine', 'Strangers can\'t message them', 'AI is clearly labeled'].map((t) =>
      `<div style="display:flex;align-items:center;gap:28px"><b style="flex:none;display:grid;place-items:center;width:92px;height:92px;border:5px solid #141A33;border-radius:18px;background:${C.mint};font:800 60px/1 Sora;color:#141A33">✓</b><span style="font:800 52px/1.06 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>` })}` },

  { file: 'is-this-photo-ai', n: 54, board: 'safety', anchor: 'safe', variant: 'ребёнок учит бабушку', ai: true,
    phrase: 'is this photo AI',
    title: 'Is This Photo AI | 3 Checks Your Kid Can Teach Grandma | Kids and AI Safety',
    text: 'Is this photo AI? Three quick checks: count the fingers, read the small letters, and ask if it looks too perfect. Easy enough for a kid to teach grandma.',
    alt: 'Coral pin that reads "Is this photo AI? 3 checks your kid can teach grandma" with a cartoon picture and three checks: count the fingers, read the letters, too perfect.',
    why: 'Тема C10: угол «ребёнок учит бабушку». Приметы общие, урок про фейки в курсе есть (facts.md).',
    html: `${h('Is this<br>photo <mark>AI</mark>?', { size: 120 })}
    ${p('3 checks your kid can teach grandma.', 440, 44, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 560, w: 400, h: 600, rot: -3, src: `${M}/works/rainbow-cartoon.jpg` })}
    <div style="position:absolute;left:500px;top:600px;width:444px;display:grid;gap:56px">${['Count the fingers', 'Read the small letters', 'Too perfect? Check'].map((t, i) =>
      `<div style="display:flex;gap:18px;align-items:center"><b style="flex:none;display:grid;place-items:center;width:70px;height:70px;border-radius:50%;background:#141A33;color:#fff;font:800 38px Sora">${i + 1}</b><span style="font:800 44px/1.05 Urbanist;color:#141A33">${t}</span></div>`).join('')}</div>
    ${pill('kid teaches grandma', 520, 1160, 4, 'dark')}` },

  { file: 'how-to-talk-to-kids-about-ai', n: 55, board: 'safety', anchor: 'safe', variant: 'вопросы для разговора', ai: false,
    phrase: 'talking to kids about AI',
    title: 'Talking to Kids About AI | 4 Questions for Dinner, No Lecture | Kids and AI Safety',
    text: 'Talking to kids about AI without a lecture: ask four questions at dinner. What would you make with it? Can it be wrong? What would you never tell it? Who would you ask?',
    alt: 'Coral pin that reads "Talking to kids about AI: 4 questions for dinner" with four question cards on a table.',
    why: 'Тема C8 в сохраняемом формате (вопросы для разговора вместо ещё одной памятки, памятки уже есть: пины 3, 13, 31).',
    html: `${h('Talking to kids<br>about <mark>AI</mark>', { size: 112 })}
    ${p('4 questions for dinner. No lecture.', 440, 46, 'color:#141A33;font-weight:800')}
    ${['What would you make with it?', 'Can it be wrong?', 'What would you never tell it?', 'Who would you ask if unsure?'].map((t, i) =>
      `${card({ l: i % 2 ? 500 : 56, t: 570 + Math.floor(i / 2) * 340, w: 444, h: 300, rot: [-3, 2, 2, -2][i], inner: `<div style="padding:36px 32px"><b style="display:block;font:800 40px Sora;color:${C.coral}">${i + 1}</b><span style="display:block;margin-top:10px;font:800 42px/1.1 Urbanist;color:#141A33">${t}</span></div>` })}`).join('')}` },

  // D. Explainers
  { file: 'why-does-ai-make-things-up', n: 56, board: 'ai', anchor: 'how', variant: 'объяснялка', ai: false,
    phrase: 'why does AI make things up',
    title: 'Why Does AI Make Things Up | Explained So a 7-Year-Old Gets It | Kids and AI',
    text: 'Why does AI make things up? It picks words that sound right, not words it has checked. So the rule for kids is simple: if an answer sounds too smooth, check it.',
    alt: 'Navy pin that reads "Why does AI make things up?" with a chat bubble that says sounds right is not the same as checked, and the rule: too smooth, check it.',
    why: 'Тема D12 («галлюцинации» простыми словами). Общие знания, без терминов.',
    html: `${h('Why does AI<br><mark>make things up</mark>?', { size: 100 })}
    ${p('Explained so a 7-year-old gets it.', 440, 44)}
    ${bubble('It picks words that sound right.', 56, 580, 720, { size: 52, rot: -2 })}
    ${bubble('Not words it checked.', 224, 800, 720, { size: 52, tail: 'right', bg: '#FFC533', rot: 2 })}
    ${tile('Too smooth?', 'check it', 230, 1030, 540, '#5FE0A8', -2)}` },

  { file: 'teach-kids-about-ai-at-home', n: 57, board: 'homeschool', anchor: 'how', variant: 'три мысли', ai: false,
    phrase: 'teach kids about AI at home',
    title: 'Teach Kids About AI at Home | 3 Ideas for the Kitchen Table Tonight | Ages 6-14',
    text: 'Teach kids about AI at home with three ideas tonight: AI guesses, it does not know; AI can be wrong, so check; and the idea is always yours.',
    alt: 'Dark blue pin that reads "Teach kids about AI at home" with three ideas: AI guesses, AI can be wrong, the idea is yours.',
    why: 'Тема D14 без прогноза «школы научат через 5 лет»: кухонный стол сегодня вечером.',
    html: `${h('Teach kids<br>about AI <mark>at home</mark>', { size: 106 })}
    ${p('3 ideas for the kitchen table tonight.', 440, 44)}
    ${tile('1', 'AI guesses. It doesn\'t know.', 56, 560, 420, '#FFC533', -3)}
    ${tile('2', 'It can be wrong. Check.', 524, 620, 420, '#5FE0A8', 3)}
    ${tile('3', 'The idea is always yours.', 290, 930, 420, '#FFF4DC', -1)}` },

  { file: 'ai-words-for-kids', n: 58, board: 'ai', anchor: 'how', variant: 'словарик', ai: false,
    phrase: 'AI words for kids',
    title: 'AI Words for Kids | 4 Words Every Kid Should Know | Save for Later',
    text: 'AI words for kids, explained in one line each: a prompt is what you tell the AI, a guess is what it gives back, a fake is a picture that never happened, and a check is your job.',
    alt: 'Navy pin that reads "AI words for kids" with four word cards: prompt, guess, fake, check, each with a one-line meaning.',
    why: 'Тема D: сохраняемый словарик, «рубрика-объяснялка».',
    html: `${h('<mark>AI words</mark><br>for kids', { size: 120 })}
    ${p('4 words every kid should know.', 440, 46)}
    ${[['Prompt', 'what you tell the AI'], ['Guess', 'what it gives back'], ['Fake', 'a picture that never happened'], ['Check', 'your job, every time']].map(([w, m], i) =>
      card({ l: 56, t: 550 + i * 190, w: 888, h: 160, rot: i % 2 ? 1 : -1, inner: `<div style="padding:30px 40px;display:flex;align-items:baseline;gap:26px"><b style="flex:none;width:230px;font:800 54px Sora;letter-spacing:-.04em;color:${[C.coral, '#141A33', C.coral, '#141A33'][i]}">${w}</b><span style="font:700 40px/1.1 Urbanist;color:#141A33">${m}</span></div>` })).join('')}` },

  // E. Bored kid
  { file: 'rainy-day-activities-for-kids', n: 59, board: 'activities', anchor: 'free', variant: 'план на 20 минут', ai: true,
    phrase: 'rainy day activities for kids',
    title: 'Rainy Day Activities for Kids | A 20-Minute Plan With One Laptop | Ages 6-14',
    text: 'Rainy day activities for kids with one laptop: your kid picks the idea, makes a little game in one short lesson with you next to them, then you play it together.',
    alt: 'Mint pin that reads "Rainy day activities for kids: a 20-minute plan" with three steps, idea, make, play together, and a pixel game.',
    why: 'Тема E15: «дождливая суббота, скучающий ребёнок, один ноутбук». Длина урока до 20 минут (facts.md).',
    html: `${h('Rainy day<br><mark>activities</mark> for kids', { size: 104 })}
    ${p('One laptop. About 20 minutes.', 440, 46, 'color:#141A33;font-weight:800')}
    ${tips(['Your kid picks the idea', 'They make a little game', 'You play it together'], 540, 460, { size: 46, gap: 40 })}
    ${card({ l: 180, t: 1030, w: 764, h: 290, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}` },

  { file: 'what-to-do-when-kids-are-bored', n: 60, board: 'screen', anchor: 'problem', variant: 'было и стало', ai: false,
    phrase: 'when kids say they are bored',
    title: 'When Kids Say They Are Bored | From "I\'m Bored" to "Look What I Made" | Ages 6-14',
    text: 'When kids say they are bored, swap the next video for 20 minutes of making. "I\'m bored" turns into "look what I made", and they have something to show you.',
    alt: 'Mint pin that reads "When kids say they are bored" with two speech bubbles: I\'m bored, and after 20 minutes, look what I made.',
    why: 'Тема E16: обмен «скучно» на «смотри, что я сделал».',
    html: `${h('When kids say<br>they are <mark>bored</mark>', { size: 106 })}
    ${bubble('I\'m bored.', 56, 500, 520, { size: 64, rot: -3, bg: '#B9C0DE' })}
    <svg viewBox="0 0 120 160" style="position:absolute;z-index:3;left:430px;top:710px;width:120px;height:160px"><path d="M60 10 V130" stroke="#141A33" stroke-width="12" stroke-linecap="round"/><path d="M25 100 L60 140 L95 100" fill="none" stroke="#141A33" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${pill('20 minutes later', 560, 760, 4, 'dark')}
    ${bubble('Look what I made!', 300, 920, 640, { size: 64, tail: 'right', rot: 2, bg: '#FFC533' })}` },

  { file: 'things-kids-can-make-with-ai', n: 61, board: 'activities', anchor: 'works', variant: 'листикл', ai: true,
    phrase: 'things kids can make with AI',
    title: 'Things Kids Can Make With AI | 5 Projects Before Dinner | No Coding, Ages 6-14',
    text: 'Things kids can make with AI before dinner: a game, a cartoon, a song from their own words, a sticker pack of their own character and a little website.',
    alt: 'Yellow pin that reads "5 things kids can make with AI" with a numbered list: a game, a cartoon, a song, a sticker pack, a website, next to a cartoon cat.',
    why: 'Тема E17: листикл из пяти проектов курса (facts.md).',
    html: `${h('5 things kids can<br>make <mark>with AI</mark>', { size: 100 })}
    ${p('Before dinner. No coding.', 440, 46, 'color:#141A33;font-weight:800')}
    ${tips(['A game', 'A cartoon', 'A song', 'A sticker pack', 'A website'], 540, 760, { size: 50, gap: 40 })}
    ${card({ l: 620, t: 620, w: 320, h: 520, rot: 4, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 35%', z: 6 })}` },

  { file: 'activities-for-kids-and-parents-together', n: 62, board: 'activities', anchor: 'how', variant: 'фото', ai: false,
    phrase: 'activities for kids and parents together',
    title: 'Activities for Kids and Parents Together | Side by Side, 6 to 20 Minutes | Ages 6-14',
    text: 'Activities for kids and parents together that fit a weeknight: short lessons you do side by side, where your kid makes the thing and you sit right next to them.',
    alt: 'Yellow pin that reads "Activities for kids and parents together" above a photo of a mom and daughter making something at a laptop.',
    why: 'Тема E: «вместе». Живое фото мамы и дочки за ноутбуком.',
    html: `${h('Activities for kids<br>and <mark>parents</mark> together', { size: 82 })}
    ${p('Side by side. 6 to 20 minutes.', 430, 46, 'color:#141A33;font-weight:800')}
    ${card({ l: 56, t: 540, w: 888, h: 700, rot: -2, src: `${M}/landing/step-make.jpg` })}
    ${pill('you, right next to them', 420, 1200, 4)}` },

  // F. Gifts
  { file: 'gifts-for-kids-who-have-everything', n: 63, board: 'gifts', anchor: 'pricing', variant: 'список', ai: false,
    phrase: 'gifts for kids who have everything',
    title: 'Gifts for Kids Who Have Everything | Give Them Something to Make | Ages 6-14',
    text: 'Gifts for kids who have everything: skip the next toy and give them something to make. A short AI course you do together ends with a game, a cartoon and a song.',
    alt: 'Yellow pin that reads "Gifts for kids who have everything" with crossed-out toys and a card: something to make, together.',
    why: 'Тема F18. Подарок-курс без скидок (их нет в facts.md).',
    html: `${h('Gifts for kids who<br>have <mark>everything</mark>', { size: 96 })}
    ${card({ l: 56, t: 470, w: 888, h: 380, rot: -2, inner: `<div style="padding:46px 50px;display:grid;gap:22px">${['another toy', 'another gadget', 'another box'].map((t) => `<span style="font:800 54px Urbanist;color:#8A8FA8;text-decoration:line-through;text-decoration-thickness:6px;text-decoration-color:${C.coral}">${t}</span>`).join('')}</div>` })}
    ${tile('Something to make', 'together', 180, 900, 640, '#FFF4DC', 2)}` },

  { file: 'gifts-kids-can-make-for-grandparents', n: 64, board: 'gifts', anchor: 'families', variant: 'три подарка', ai: true,
    phrase: 'gifts kids can make for grandparents',
    title: 'Gifts Kids Can Make for Grandparents | A Song, a Cartoon, Stickers | Christmas Idea',
    text: 'Gifts kids can make for grandparents this Christmas: a song from their own words, a short cartoon or a sticker pack of their own character. Made by the kid, not bought.',
    alt: 'Yellow pin that reads "Gifts kids can make for grandparents" with three gifts: a song, a cartoon frame and a sheet of stickers, each with a gift tag.',
    why: 'Тема F19: «подарок, который бабушка хранит: сделанный ребёнком». Сезон Рождества.',
    html: `${h('Gifts kids can make<br>for <mark>grandparents</mark>', { size: 92 })}
    ${p('Made by the kid. Not bought.', 430, 46, 'color:#141A33;font-weight:800')}
    ${strip([[`${M}/landing/cartoon-friends.jpg`, '50% 40%', 'a cartoon'], [`${M}/landing/step-show.jpg`, '62% 85%', 'stickers'], [`${M}/landing/cartoon-girl.jpg`, '30% 40%', 'a song for her']], 560)}` },

  // Course 20%
  { file: 'ai-course-for-kids-reviews', n: 65, board: 'activities', anchor: 'families', variant: 'отзывы', ai: false,
    phrase: 'AI course for kids reviews',
    title: 'AI Course for Kids Reviews | What Early-Access Families Said | Ages 6-14',
    text: 'AI course for kids reviews from early-access families, word for word: short lessons, real projects at the end, and kids who ask for the next one.',
    note: 'Amanda, Jessica and Emily are early-access testers. They received the course free and shared honest feedback.',
    alt: 'Yellow pin that reads "AI course for kids reviews" with three short quotes from moms with their photos.',
    why: 'Курс (20%): доказательство. Три цитаты дословно (quotes.md), пометка про бесплатный курс в описании.',
    html: `${h('AI course for kids<br><mark>reviews</mark>', { size: 100 })}
    ${[['amanda', 'She created a little game and was so proud of herself.', 'Amanda, mom of a 10-year-old'], ['jessica', 'Our little song turned out so cute!', 'Jessica, mom of an 8-year-old'], ['emily', 'We made our own little cartoon together, and he was so excited to show it to his dad.', 'Emily, mom of a 9-year-old']].map(([f, q, w], i) =>
      `${card({ l: 56, t: 440 + i * 300, w: 888, h: 260, rot: [-1.5, 1.5, -1][i], inner: `<div style="padding:34px 40px 0 250px"><p style="font:700 40px/1.15 Urbanist;color:#141A33">“${q}”</p><p style="margin-top:14px;font:800 24px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">${w}</p></div>` })}${ring({ l: 80, t: 465 + i * 300, d: 190, src: `${M}/landing/reviews/${f}.jpg`, pos: '50% 25%', zoom: 175, z: 6, pad: 8 })}`).join('')}` },

  { file: 'first-ai-lesson-for-kids', n: 66, board: 'homeschool', anchor: 'free', variant: 'шаги', ai: true,
    phrase: 'first AI lesson for kids',
    title: 'First AI Lesson for Kids | Free, No Card | They Build a Game in 10-20 Minutes',
    text: 'A first AI lesson for kids that is free: leave an email, no card, and your kid builds a playable game in 10 to 20 minutes on a laptop or tablet. Nothing to install.',
    alt: 'Mint pin that reads "First AI lesson for kids, free" with three steps: email, no card; build a game in 10 to 20 minutes; play it together, and a pixel game.',
    why: 'Курс (20%): прямой призыв на бесплатный урок, каждый пункт из facts.md.',
    html: `${h('<mark>First</mark> AI lesson<br>for kids', { size: 112 })}
    ${p('Free. No card. Nothing to install.', 440, 46, 'color:#141A33;font-weight:800')}
    ${rowsCard(['Leave an email', 'Build a game: 10–20 min', 'Play it together'], 540, 520)}
    ${card({ l: 300, t: 1010, w: 644, h: 310, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 5 })}` },

  { file: 'ai-course-made-by-a-mom', n: 67, board: 'homeschool', anchor: 'team', variant: 'кто за этим', ai: false,
    phrase: 'AI course made by a mom',
    title: 'AI Course Made by a Mom | Every Lesson Tested on Her 10-Year-Old | Ages 6-14',
    text: 'An AI course made by a mom: Anna built every lesson herself and tested it on her 10-year-old daughter Kamilla at the kitchen table. Whatever lost her attention got cut.',
    alt: 'Dark blue pin that reads "AI course made by a mom" with a round photo of Anna and the words: every lesson tested on her 10-year-old, what lost her got cut.',
    why: 'Курс (20%): «кто за этим стоит». Только факты из facts.md. Строку «делает ИИ-рекламу брендам с 2023 года» не ставим: в facts.md её нет, нужен источник.',
    html: `${h('AI course<br>made by a <mark>mom</mark>', { size: 112 })}
    ${ring({ l: 56, t: 450, d: 520, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}
    ${ring({ l: 600, t: 640, d: 320, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}
    ${pill('Anna, mom', 90, 920, -5, '', `background:${C.coral}`)}${pill('Kamilla, 10', 640, 930, 4, '', `background:${C.mint}`)}
    ${p('Every lesson tested at our kitchen table.<br>What lost her attention got cut.', 1080, 40)}` },

  { file: 'ai-cartoon-for-kids', n: 68, board: 'activities', anchor: 'works', variant: 'кадры', ai: true,
    phrase: 'AI cartoon for kids',
    title: 'AI Cartoon for Kids | A 10-Year-Old Made This One, Frame by Frame | No Coding',
    text: 'An AI cartoon for kids, made by a 10-year-old: her characters, a cat with a croissant, a bakery in Paris. She told the AI her story and checked every scene.',
    alt: 'Yellow pin that reads "AI cartoon for kids, made by a 10-year-old" with three frames from her cartoon: a girl with glasses, two friends in a bakery, a cat with a croissant.',
    why: 'Курс (20%): один лучший демо-мультфильм Камиллы (кадры из cartoon-*.jpg), вместо трёх похожих.',
    html: `${h('AI <mark>cartoon</mark><br>for kids', { size: 120 })}
    ${p('A 10-year-old made this one.', 440, 46, 'color:#141A33;font-weight:800')}
    ${strip([[`${M}/landing/cartoon-girl.jpg`, '30% 40%', 'her character'], [`${M}/landing/cartoon-friends.jpg`, '50% 40%', 'her story'], [`${M}/landing/cartoon-cat.jpg`, '50% 35%', 'her cat']], 560)}` },
);

// Series frame (SERIES.md): colour and chip per pin. Ask AI + Safe AI coral, By a kid yellow, How it works navy, Free lesson mint.
const FRAME = { c: ['c'], y: ['y'], n: ['n'], m: ['m'] };
const SERIES_OF = {
  'non-toy-gift-idea-for-kids': ['kid', 'y'], 'gift-ideas-for-grandkids': ['kid', 'y'],
  'ai-safety-rules-for-kids': ['safe', 'c'], 'ai-lessons-for-kids-at-home': ['free', 'm'],
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
  'kids-make-a-video-game-with-ai': ['kid', 'y'], 'kids-write-a-song-with-ai': ['kid', 'y'], 'kids-make-a-website-with-ai': ['kid', 'y'],
  'thanksgiving-activity-for-kids-at-home': ['free', 'm'], 'what-moms-made-with-their-kids': ['kid', 'y'], 'kids-voice-their-own-cartoon': ['kid', 'y'],
  'family-ai-agreement-for-kids': ['safe', 'c'], 'is-ai-safe-for-kids': ['safe', 'c'], 'chatbot-safety-tips-for-kids': ['safe', 'c'],
  'teach-kids-to-spot-fake-videos': ['safe', 'c'], 'what-is-ai-explained-for-kids': ['ask', 'c'], 'how-does-ai-make-music': ['ask', 'n'],
  'ai-prompts-for-kids': ['ask', 'c'], 'fun-ai-experiment-for-kids': ['ask', 'c'], 'ai-for-6-year-olds': ['how', 'n'],
  'short-lessons-for-kids-at-home': ['how', 'n'], 'what-kids-need-to-learn-ai': ['how', 'n'], 'ai-for-homeschool-kids': ['how', 'n'],
  'gift-for-kids-who-love-tech': ['free', 'm'], 'free-ai-class-for-kids-online': ['free', 'm'], 'winter-break-activities-for-kids': ['free', 'm'],
  'ai-homework-help-for-kids': ['ask', 'c'], 'how-kids-should-use-ai': ['ask', 'c'], 'before-your-kid-uses-chatgpt': ['safe', 'c'],
  'is-using-ai-for-homework-cheating': ['ask', 'c'], 'active-vs-passive-screen-time': ['how', 'c'], 'alternatives-to-youtube-for-kids': ['how', 'c'],
  'educational-screen-time-for-kids': ['how', 'c'], 'safe-ai-apps-for-kids': ['safe', 'c'], 'is-this-photo-ai': ['safe', 'c'],
  'how-to-talk-to-kids-about-ai': ['safe', 'c'], 'why-does-ai-make-things-up': ['ask', 'n'], 'teach-kids-about-ai-at-home': ['ask', 'n'],
  'ai-words-for-kids': ['ask', 'n'], 'rainy-day-activities-for-kids': ['free', 'm'], 'what-to-do-when-kids-are-bored': ['how', 'm'],
  'things-kids-can-make-with-ai': ['kid', 'y'], 'activities-for-kids-and-parents-together': ['kid', 'y'], 'gifts-for-kids-who-have-everything': ['kid', 'y'],
  'gifts-kids-can-make-for-grandparents': ['kid', 'y'], 'ai-course-for-kids-reviews': ['kid', 'y'], 'first-ai-lesson-for-kids': ['free', 'm'],
  'ai-course-made-by-a-mom': ['how', 'n'], 'ai-cartoon-for-kids': ['kid', 'y'],
};
for (const pin of pins) [pin.series, pin.theme] = SERIES_OF[pin.file];
// the alt text names the background colour, which follows the series frame
const COLOUR = { y: 'Yellow', c: 'Coral', n: 'Dark blue', m: 'Mint', k: 'Cream' };
for (const pin of pins) pin.alt = pin.alt.replace(/^(Yellow|Coral|Dark blue|Mint|Cream) pin/, `${COLOUR[pin.theme]} pin`);

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

// Every description ends with the next step (pinterest-seo: a CTA), unless it already says it or the pin sells the gift itself.
for (const pin of pins) {
  if (/free/i.test(pin.text) || pin.file === 'last-minute-gift-for-grandkids') continue;
  for (const c of [' First lesson free, no card.', ' First lesson free.']) if (pin.text.length + c.length <= 220) { pin.text += c; break; }
}

if (process.argv[1] && process.argv[1].endsWith('pins.mjs')) {
  const out = join(here, 'pins');
  mkdirSync(out, { recursive: true });
  pins.forEach(check);
  const browser = await chromium.launch();
  for (const pin of pins) {
    const pg = await (await browser.newContext({ viewport: { width: 1000, height: 1500 } })).newPage();
    const tmp = join(out, '.tmp.html');
    writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}.tile.pin{width:1000px;height:1500px}</style><div class="tile pin ${pin.theme}">${head(pin.series)}${body(pin.html)}${cta(pin.theme)}</div>`);
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
