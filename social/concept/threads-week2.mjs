#!/usr/bin/env node
// Threads, week 2 (Fri 20.11 – Thu 26.11.2026, New York): 21 posts, three a day, one of the three is useful.
// Built in steps (owner, 14.11.2026): first the half-template and the first 5 posts, the rest after the owner's ok.
//
//   node social/concept/threads-week2.mjs     checks every post and writes text/threads-week2/NN-id.md
//
// NEW RULE (owner, 17.11.2026, after the first stats: the text-only 17:30 post got the most views):
// the week is a test. 90% of posts are text only, and they go out in one window, 17:00 to 18:30 New York
// (30 minutes before and an hour after 17:30), 17:00 / 17:45 / 18:30. The useful post of the day is the middle one.
// Two card posts stay OUTSIDE the window as a control: ex-words-to-picture (Fri 15:10, already in Metricool) and
// w2-05-spot-the-fake (Sat 12:40). One exception on Thanksgiving: the morning post goes at 8:10 (it says "before the turkey").
// Compare views of the window text posts with the control cards and with week 1 (cards at 8:10, 12:40, 20:40).
//
// HALF-TEMPLATE (the content shape, the clock times above replace the old 8:10 / 12:40 / 20:40)
// Day = 3 posts: ours, USEFUL, ours. Thanksgiving is Thu 26.11.
//
// Useful post (12:40), "question + paradox + one visual". One of four kinds, never two of a kind in a row:
//   how    "How/why does AI ...?" a mechanism in plain words (six fingers, static to picture)
//   try    a game or test for parent + kid tonight (spot the AI picture, the cat prompt)
//   save   a list a parent saves (5 safe ways) and its spin-offs, one point per post
//   case   a real family result from quotes.md, told as "how did they do it"
// Shape: 1) hook a kid would ask too, 2) paradox: "it can X, it can't Y" or a surprise, 3) the plain truth in 1–2
// sentences, 4) one thing to do together tonight, 5) a real question. No selling; "our course" at most one line.
// Card: chip with the kind, headline = the paradox (one marked word), one visual that shows the mechanism or the game.
//
// Ours (8:10 and 20:40): one emotional lever each, as in week 1 (threads-week.mjs). Morning short and splitting,
// evening the main one (product fact, family story, offer once in 6–7 posts).
// Same rules as week 1: facts only from social/brand/facts.md, quotes word for word, no AI tells (threads-lint.mjs),
// sentence case, ends on a real question, short.

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const url = 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=free-lesson-break#free';
export const SLOTS = { am: '08:10', noon: '12:40', pm: '20:40' };
export const CARD_POSTS = new Set(['ex-words-to-picture', 'w2-05-spot-the-fake']);
const FIXED = { 'ex-words-to-picture': '15:10', 'w2-05-spot-the-fake': '12:40', 'w2-19-before-turkey': '08:10' };
const WINDOW = ['17:00', '17:45', '18:30'];
// New York clock time of a post
export function whenOf(p, all) {
  if (FIXED[p.id]) return FIXED[p.id];
  const day = all.filter((q) => q.date === p.date && !FIXED[q.id]);
  const t = day.length === 3 ? WINDOW : WINDOW.slice(0, 2);
  return t[day.indexOf(p)];
}

export const posts = [
  // ---------------------------------------------------------------- Fri 20.11
  { id: 'w2-01-things-made', date: '2026-11-20', slot: 'am', kind: 'ours', lever: 'раскол привычного правила', topic: 'Parenting', media: 'w2-01-things-made', visual: 'drawn',
    text: `Screen time rules usually count hours.

What if yours counted things made instead? One game, one song, one cartoon, then screens off.

Would that work at your house?` },
  { id: 'ex-words-to-picture', date: '2026-11-20', slot: 'noon', kind: 'how', lever: 'любопытство: как это работает', topic: 'AI for kids', media: 'ex-words-to-picture', visual: 'drawn',
    text: `How does AI turn your kid's words into a picture? It doesn't look one up.

It starts from pure static, like an old TV, and cleans the noise away step by step, each step nudged toward the words.

Try "a cat", then "an orange cat in a red hat, waving". Which one looks more like your kid's idea?` },
  { id: 'w2-03-ai-kamilla', date: '2026-11-20', slot: 'pm', kind: 'ours', lever: 'доверие: честность про ИИ', topic: 'AI safety', media: 'w2-03-ai-kamilla', visual: 'drawn',
    text: `Some lessons in our course are led by an AI version of Kamilla, our 10-year-old co-host. Every time, we say so.

Kids should always know when they're watching a real person and when it's AI.

Does your kid know how to tell?` },

  // ---------------------------------------------------------------- Sat 21.11
  { id: 'w2-04-last-question', date: '2026-11-21', slot: 'am', kind: 'ours', lever: 'любопытство и лёгкая тревога', topic: 'Parenting', media: 'w2-04-last-question', visual: 'drawn',
    text: `Quick one: do you know the last thing your kid asked an AI?

Kids ask it things they'd never ask us. Sometimes funny, sometimes not.

Do you know what yours asked this week?` },
  { id: 'w2-05-spot-the-fake', date: '2026-11-21', slot: 'noon', kind: 'try', lever: 'игра вместе', topic: 'AI for kids', media: 'w2-05-spot-the-fake', visual: 'drawn',
    text: `Can your kid spot an AI picture? The first clue: it looks a little too perfect.

Then check the hands, words on signs, earrings that don't match, shadows going the wrong way.

Make it a game tonight. First one to find a mistake picks dessert. Who wins at your house?` },
  { id: 'w2-06-voice-over', date: '2026-11-21', slot: 'pm', kind: 'ours', lever: 'гордость и чудо', topic: 'AI for kids',
    visual: 'микрофон и волна звука; слева детский рисунок-персонаж, справа речевое облачко «Hi, I\'m...» с подписью «their own voice»',
    text: `In our course, your kid can record a voice-over in their own voice for something they made.

Their words, their characters, their actual voice, played back to the whole family.

What would your kid narrate first?` },

  // ---------------------------------------------------------------- Sun 22.11
  { id: 'w2-07-spare-evening', date: '2026-11-22', slot: 'am', kind: 'ours', lever: 'малый шаг, снятие вины', topic: 'Parenting',
    visual: 'календарь на неделю, пять вечеров, один обведён; рядом таймер «20 min»',
    text: `Sunday question for parents: which evening this week has 20 spare minutes?

A small evening is enough. Our lessons run 6 to 20 minutes and end with something your kid made.

Which evening works at your house?` },
  { id: 'w2-08-dinner-questions', date: '2026-11-22', slot: 'noon', kind: 'save', lever: 'польза: список, который сохраняют', topic: 'AI safety',
    visual: 'пять карточек-вопросов на столе, как салфетки за ужином; сверху чип «Save this»',
    text: `5 questions to ask your kid about AI at dinner. Save this.

1. What did you ask it this week?
2. Did it ever get something wrong?
3. What would you make if it could make anything?
4. Is there something you wouldn't tell it?
5. How do you know a picture is real?

Which one will you ask tonight?` },
  { id: 'w2-09-same-day', date: '2026-11-22', slot: 'pm', kind: 'ours', lever: 'внимание и скорость', topic: 'Parenting',
    visual: 'часы на 20:40 и стопка школьных тетрадей слева («days»), справа детская работа с галочкой «same day»',
    text: `A kid finishes something and waits for someone to look at it. With our Homework option, Anna looks at your kid's work the same day.

A "look what I made" is best answered while it's still exciting.

How long does your kid usually wait?` },

  // ---------------------------------------------------------------- Mon 23.11
  { id: 'w2-10-one-sentence', date: '2026-11-23', slot: 'am', kind: 'ours', lever: 'тревога в действие', topic: 'AI safety',
    visual: 'пустая строка для одного предложения на бумажной полоске, карандаш; заголовок «One sentence»',
    text: `Monday question for parents: what's the one thing you want your kid to know about AI before they use it alone?

One sentence is plenty.

What's yours?` },
  { id: 'w2-11-song-how', date: '2026-11-23', slot: 'noon', kind: 'how', lever: 'любопытство: как это работает', topic: 'AI for kids',
    visual: 'слова ребёнка (4 строки) превращаются в звуковую волну; ноты проступают из шума, как в картинке по словам',
    text: `AI has no ears and has never danced to a song. So how does it make music from your kid's words?

It was trained on a huge amount of recorded music, so it learned which sounds tend to follow which. Your words say what the song is about, and it builds the sound step by step.

Try it with your kid: ask for 4 lines about anything, and happy, silly or sad. Which would yours pick?` },
  { id: 'w2-12-kamilla-first', date: '2026-11-23', slot: 'pm', kind: 'ours', lever: 'кто научит ребёнка', topic: 'Parenting',
    visual: 'три круга-ведущих: parent / teacher / older kid; у третьего корона «Kamilla, 10 goes first»',
    text: `In our course, Kamilla, 10, shows the finished thing first, and then your kid makes their own.

Who does your kid listen to most when they learn something new: a parent, a teacher or a slightly older kid?` },

  // ---------------------------------------------------------------- Tue 24.11
  { id: 'w2-13-bored', date: '2026-11-24', slot: 'am', kind: 'ours', lever: 'узнавание и честность', topic: 'Parenting',
    visual: 'ребёнок-значок и речевое облачко «I\'m bored», три кнопки: screen / snack / make something',
    text: `Your kid says "I'm bored." What do you reach for first: a screen, a snack, or "go make something"?

Be honest, the answer changes by the hour.

Which one wins at your house?` },
  { id: 'w2-14-next-lesson', date: '2026-11-24', slot: 'noon', kind: 'case', lever: 'польза: как семья добилась результата', topic: 'AI for kids',
    visual: 'сайт в рамке браузера, нарисованный ребёнком, и цитата Рэйчел; чип «Early-access family»',
    text: `A 7-year-old made a website with his mom, and now he keeps asking when the next lesson is. How does a lesson get a 7-year-old to ask for more?

His mom Rachel, from our early-access group (they got the course free): "We made a little website together, and he keeps asking when we can do the next lesson!"

Our lessons run 6 to 20 minutes and end with something finished. What would your kid's first website be about?` },
  { id: 'w2-15-break-offer', date: '2026-11-24', slot: 'pm', kind: 'offer', lever: 'предложение (раз в неделю)', topic: 'AI for kids',
    visual: 'три шага первого урока (email, игра за 10 до 20 минут, играете вместе) на фоне осенних листьев; чип «Free lesson»',
    text: `If your kid is off school for Thanksgiving break, here's something for one afternoon.

The first lesson of our course is free. No card, just an email. Your kid builds a playable game in 10 to 20 minutes on a laptop or tablet, then you two play it on the same couch.

${url}

If you try it, tell me what the game was about.` },

  // ---------------------------------------------------------------- Wed 25.11
  { id: 'w2-16-wish', date: '2026-11-25', slot: 'am', kind: 'ours', lever: 'ностальгия', topic: 'Parenting',
    visual: 'детская рука с карандашом, из рисунка вырастают три значка: мультфильм, игра, пластинка',
    text: `When you were your kid's age, what did you wish you could make? A cartoon, a game, a record?

Kids today can make a cartoon, a game and a song, in lessons of 6 to 20 minutes, with you sitting next to them.

What was yours?` },
  { id: 'w2-17-who-listens', date: '2026-11-25', slot: 'noon', kind: 'try', lever: 'игра вместе', topic: 'AI for kids',
    visual: 'один вопрос «Why is the sky blue?» и три ответа разной длины для 6 лет, 12 лет и бабушки',
    text: `Can AI explain the same thing to a 6-year-old and to a grandparent? It can, if you tell it who's listening.

Try it tonight with "why is the sky blue?" Ask for an answer for a 6-year-old, then for a 12-year-old, then for grandma.

The topic stays the same and the words change. Which version did your kid like best?` },
  { id: 'w2-18-table', date: '2026-11-25', slot: 'pm', kind: 'story', lever: 'тепло и семья', topic: 'Parenting',
    visual: 'накрытый стол, на каждой тарелке карточка: песня, мультфильм, игра; цитата Сьюзан',
    text: `Tomorrow a lot of families sit at one big table. A song, a cartoon or a game your kid made is something to show them.

Susan, a grandmother from our early-access group (she got the course free): "We made a song together, and she wanted to show it to everyone in the family!"

What would your kid show the table?` },

  // ---------------------------------------------------------------- Thu 26.11 (Thanksgiving)
  { id: 'w2-19-before-turkey', date: '2026-11-26', slot: 'am', kind: 'ours', lever: 'благодарность', topic: 'Parenting',
    visual: 'утренний стол и три вопроса-облачка: card / song / cartoon',
    text: `Before the turkey, one question for your kid: what would you make for the whole family this season?

A card, a song, a little cartoon?

What did yours say?` },
  { id: 'w2-20-long-weekend', date: '2026-11-26', slot: 'noon', kind: 'save', lever: 'польза: список, который сохраняют', topic: 'AI for kids',
    visual: 'пять значков-проектов в ряд (игра, песня, мультфильм, сайт, стикеры) с цифрами 1 до 5; чип «Save this»',
    text: `Save this for the long weekend: 5 things a kid can make with AI.

1. A playable game
2. A song from their own words
3. A cartoon
4. A website
5. A sticker pack of their own character

Which one would your kid pick first?` },
  { id: 'w2-21-thankful', date: '2026-11-26', slot: 'pm', kind: 'story', lever: 'благодарность и тепло', topic: 'Parenting',
    visual: 'рука, держащая цитату Маргарет на тёплом фоне; чип «Happy Thanksgiving»',
    text: `Happy Thanksgiving. Margaret, a grandmother from our early-access group (she got the course free), said about her 9-year-old grandson: "I love that he gets to create something instead of just watching videos."

What's one thing your kid made this year that you're thankful for?` },
];

const NOT_USEFUL = ['ours', 'offer', 'story'];
const LIMIT = { ours: 300, story: 450, offer: 450, how: 450, try: 450, save: 450, case: 450 };
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%/i;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-week2');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const days = [...new Set(posts.map((p) => p.date))];
  for (const d of days) {
    const day = posts.filter((p) => p.date === d);
    if (day.filter((p) => !NOT_USEFUL.includes(p.kind)).length > 1) throw new Error(`${d}: one useful post a day`);
    if (day.length === 3 && !day.some((p) => p.slot === 'noon' && !NOT_USEFUL.includes(p.kind))) throw new Error(`${d}: the middle post must be useful`);
    const inWin = day.map((p) => whenOf(p, posts)).filter((w) => w >= '17:00' && w <= '18:30').length;
    if (day.length - inWin > 2) throw new Error(`${d}: too many posts outside the 17:00-18:30 window`);
  }
  const useful = posts.filter((p) => !NOT_USEFUL.includes(p.kind));
  if (posts.filter((p) => p.kind === 'offer').length > 1) throw new Error('one offer a week');
  useful.forEach((p, i) => { if (i && useful[i - 1].kind === p.kind) throw new Error(`${p.id}: two "${p.kind}" useful posts in a row`); });
  const cards = posts.filter((p) => CARD_POSTS.has(p.id)).length;
  if (cards / posts.length > 0.1) throw new Error(`${cards} card posts of ${posts.length}: 90% must be text only`);
  posts.forEach((p, i) => {
    const n = [...p.text].length;
    const bad = lint(p.text).filter((h) => !h.includes('too long for a phone read'));
    if (n > LIMIT[p.kind]) bad.push(`${n} characters, limit for ${p.kind} is ${LIMIT[p.kind]}`);
    if (BANNED.test(p.text.replace(url, ''))) bad.push(`banned phrase: ${p.text.replace(url, '').match(BANNED)[0]}`);
    if (/^Rule \d+ of 5:/m.test(p.text)) bad.push('lecture format "Rule N of 5:"');
    if (!/^[A-Z0-9"]/.test(p.text)) bad.push('must start with a capital letter');
    if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' ')) && !(p.kind === 'offer' && /tell me/i.test(p.text))) bad.push('must end on a real question');
    if (CARD_POSTS.has(p.id) && !existsSync(join(here, 'text', 'threads', `${p.media}.mp4`))) bad.push(`no card text/threads/${p.media}.mp4`);
    if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
    const nn = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `${nn}-${p.id}.md`), `---\nwhen: ${p.date} ${whenOf(p, posts)} (New York)\nkind: ${p.kind}\nlever: ${p.lever}\ntopic: ${p.topic}\ncharacters: ${n}\ncard: ${CARD_POSTS.has(p.id) ? `text/threads/${p.media}.mp4` : 'none (text only)'}\n---\n${p.text}\n`);
    console.log(`${nn} ${p.date} ${whenOf(p, posts)} ${CARD_POSTS.has(p.id) ? 'CARD' : 'text'} ${p.kind.padEnd(5)} ${p.id.padEnd(22)} ${String(n).padStart(3)}ch`);
  });
}
