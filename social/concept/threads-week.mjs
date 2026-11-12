#!/usr/bin/env node
// Threads, one full week: 21 posts in the grid (7 days x 3 slots, New York time) + 9 in reserve = 30.
// Supersedes threads-v2.mjs. Written, then self-reviewed against: the owner's 25 hook formulas
// (text/threads-hooks.md), the eight emotional levers (owner's strategy doc), the AI-tells blacklist
// (threads-lint.mjs, built from mk-copywriting/ai-tells.md), mk-social and hook-writer-sms rules,
// brand voice (social/brand/voice.md) and facts only from social/brand/facts.md.
// The dry "Rule N of 5:" lecture format is banned by the owner (12.11.2026): safety rules are written
// as situations and tasks, never as a lecture. Drafts only: nothing goes to Metricool without the owner's ok.
//
//   node social/concept/threads-week.mjs     checks all 30 and writes text/threads-week/NN-<id>.md

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const url = 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=free-lesson#free';
export const SLOTS = { am: '8:10 AM', noon: '12:40 PM', pm: '8:40 PM' };

// status: approved = owner said ok on 12.11 · new = written in this pass · reserve = swap pool
// score: self-review total out of 25 (stop line, lever, concreteness, question, human voice; 5 each)
export const posts = [
  // ------------------------------------------------------------------ day 1
  { n: 1, day: 1, slot: 'am', id: 'guilt', status: 'approved', lever: 'вина → разрешение', hook: 2, topic: 'Parenting', score: 22,
    card: 'есть (v2-01-guilt)',
    text: `The guilt about screen time is louder than the screen time.

20 minutes making a game and 2 hours of videos get the same guilt. Why?` },

  { n: 2, day: 1, slot: 'noon', id: 'rule-1-account', status: 'approved', lever: 'открытая петля (серия)', hook: 4, topic: 'AI safety', score: 21,
    card: 'есть (v2-r1-account)',
    text: `5 house rules before any kid opens an AI tool. One a day.

Rule 1: The account is yours. Your kid never signs up for anything alone, and you see everything they make.

Want to guess rule 2?` },

  { n: 3, day: 1, slot: 'pm', id: 'age-ladder', status: 'approved', lever: 'раскол: возраст', hook: 13, topic: 'Parenting', score: 23,
    card: 'есть (v2-12-age)',
    text: `At what age would you let your kid try AI, with you sitting right next to them?

Here's ours:
6 years old: They talk, you type.
10 years old: They do most of it.
Teen: You just stay in the room.

Where's yours?` },

  // ------------------------------------------------------------------ day 2
  { n: 4, day: 2, slot: 'am', id: 'flying-dog', status: 'approved', lever: 'гордость и зеркало', hook: 20, topic: 'Parenting', score: 23,
    card: 'есть (v2-04-who-asks-better)',
    text: `What do you ask an AI? Probably something useful, like a meal plan or an email.

Now ask your kid. A flying dog that runs a pizza shop, probably.

Who's using it better?` },

  { n: 5, day: 2, slot: 'noon', id: 'rule-2-dm-check', status: 'new', lever: 'тревога → действие (серия)', hook: 17, topic: 'AI safety', score: 22,
    card: 'переделать из v2-r2 (заголовок: Who can DM your kid?)',
    text: `Rule 2: Strangers never message my kid.

Open your kid's favorite app and check who's allowed to DM them. I'll wait.

Our course has no chats and no comments at all, on purpose. What did you find?` },

  { n: 6, day: 2, slot: 'pm', id: 'two-kids', status: 'new', lever: 'раскол: два ребёнка', hook: 3, topic: 'AI for kids', score: 24,
    card: 'есть (v2-13-two-kids)',
    text: `Two kids, same chatbot.

One asks for the homework answer. The other tells it about a game she made up, and builds it.

Which one would you stop?` },

  // ------------------------------------------------------------------ day 3
  { n: 7, day: 3, slot: 'am', id: 'school-vs-world', status: 'new', lever: 'раскол: школа и мир', hook: 23, topic: 'AI for kids', score: 21,
    card: 'есть (v2-02-school-vs-world)',
    text: `School says AI is cheating. Plenty of smart people say it's a skill worth learning early.

Your kid hears both. What do you tell them at home?` },

  { n: 8, day: 3, slot: 'noon', id: 'rule-3-never-hears', status: 'new', lever: 'участие (серия)', hook: 4, topic: 'AI safety', score: 21,
    card: 'есть (v2-r3-never-hears), заголовок оставить',
    text: `Rule 3: Some things AI never hears. Full name, school, address.

We made the list together, so she knows why each thing is on it.

Does your kid know what never goes into a chat window?` },

  { n: 9, day: 3, slot: 'pm', id: 'did-she-make-it', status: 'new', lever: 'раскол: чья работа', hook: 3, topic: 'AI for kids', score: 24,
    card: 'есть (v2-03-did-she-make-it)',
    text: `Your 8-year-old describes a song in her own words. AI makes the music. She sings it for grandma.

Did she make it?` },

  // ------------------------------------------------------------------ day 4
  { n: 10, day: 4, slot: 'am', id: 'ban', status: 'new', lever: 'против течения', hook: 14, topic: 'AI safety', score: 23,
    card: 'есть (v2-06-ban)',
    text: `Banning AI at home won't keep your kid away from it. Almost 9 in 10 US kids aged 9 to 17 already use it (Common Sense Media, 2026).

A ban only decides whether they learn it with you or without you.

If you said no at home, what would change your mind?` },

  { n: 11, day: 4, slot: 'noon', id: 'rule-4-links', status: 'new', lever: 'признание (серия)', hook: 5, topic: 'AI safety', score: 22,
    card: 'есть (v2-r4-links), заголовок оставить',
    text: `Rule 4: Links get a second look.

Be honest: you've clicked something you shouldn't have at least once. Adults do it daily. So we teach the second look early.

Has a link ever fooled you?` },

  { n: 12, day: 4, slot: 'pm', id: 'kitchen-table', status: 'new', lever: 'своя кухня (доверие)', hook: 6, topic: 'Parenting', score: 23,
    card: 'есть (v2-09-kitchen-table)',
    text: `I tested every lesson of our course on my 10-year-old at the kitchen table. If it lost her, it got cut.

She argues with the script a lot. Who's the toughest critic at your house?` },

  // ------------------------------------------------------------------ day 5
  { n: 13, day: 5, slot: 'am', id: 'dinner-prompt', status: 'new', lever: 'задание (участие)', hook: 17, topic: 'Parenting', score: 23,
    card: 'есть (v2-16-dinner-prompt)',
    text: `Try this at dinner tonight: ask your kid what game they'd make if they could make any game at all.

Then come back and tell me what they said.` },

  { n: 14, day: 5, slot: 'noon', id: 'rule-5-too-perfect', status: 'new', lever: 'итог серии', hook: 19, topic: 'AI safety', score: 21,
    card: 'есть (v2-r5-too-perfect)',
    text: `Rule 5, the last one: If it looks too perfect, check it. Pictures, videos, even homework sources can be fake.

That's all five. Which one would be the hardest to hold at your house?` },

  { n: 15, day: 5, slot: 'pm', id: 'offer-free-lesson', status: 'new', lever: 'предложение (1 из 21)', hook: 25, topic: 'AI for kids', score: 22,
    card: 'есть (v2-15-offer)',
    text: `First lesson of our course is free. No card, just an email. Your kid builds a playable game in 10 to 20 minutes, then you two play it on the same couch.

${url}

If you try it, tell me what the game was about.` },

  // ------------------------------------------------------------------ day 6
  { n: 16, day: 6, slot: 'am', id: 'lets-find-out', status: 'new', lever: 'зеркало: какой я родитель', hook: 10, topic: 'Parenting', score: 21,
    card: 'нарисовать (три кнопки: Google · AI · "Let\'s find out")',
    text: `Your kid asks something you can't answer. You can google it quietly, ask an AI, or say "I don't know, let's find out together".

I think the third one teaches the most. Which one do you reach for?` },

  { n: 17, day: 6, slot: 'noon', id: 'song-for-grandma', status: 'new', lever: 'тепло', hook: 15, topic: 'AI for kids', score: 21,
    card: 'нарисовать (телефон бабушки, плеер с песней)',
    text: `A song made from your kid's own words, playing on grandma's phone the same evening.

That's one lesson in our course, 6 to 20 minutes like all of them.

What would your kid write a song about?` },

  { n: 18, day: 6, slot: 'pm', id: 'who-thinks', status: 'new', lever: 'страх → пересмотр', hook: 22, topic: 'AI for kids', score: 21,
    card: 'есть (v2-14 / 05-will-ai-think), заголовок The thinking stays with the child',
    text: `Parents ask us: "Won't AI just think for my kid?"

Watch a kid actually make something with it. She decides what to build, tells the AI, checks the result, fixes it. Every decision in that loop is hers.

Where do you land on this?` },

  // ------------------------------------------------------------------ day 7
  { n: 19, day: 7, slot: 'am', id: 'two-evenings', status: 'new', lever: 'вина → выбор', hook: 22, topic: 'AI for kids', score: 22,
    card: 'есть (02-answer-machine, переозаглавить)',
    text: `Same AI, two different evenings.

One kid pulls homework answers out of it. Another builds a cartoon with it. The app doesn't pick which evening your family gets.

Which one happened at your house this week?` },

  { n: 20, day: 7, slot: 'noon', id: 'linda-gift', status: 'new', lever: 'тепло и подарки', hook: 8, topic: 'Gift ideas', score: 22,
    card: 'нарисовать (коробка против часов/дивана)',
    text: `Linda, a grandmother from our early-access group (she got the course free), told us:

"I wanted to give my grandson something more meaningful than another toy. MakeShowLab gave us a fun way to spend time together."

A box to open or time together. Which would your kid pick?` },

  { n: 21, day: 7, slot: 'pm', id: 'fridge-door', status: 'new', lever: 'позиция бренда + тепло', hook: 10, topic: 'Parenting', score: 22,
    card: 'нарисовать (холодильник с рисунком → экран с игрой)',
    text: `Kids don't need more screen time. They need a reason to show you something.

Paper drawings always had the fridge door.

What's the last thing your kid made on a screen and showed you?` },

  // ------------------------------------------------------------------ reserve (9)
  { n: 22, day: 0, slot: 'reserve', id: 'homework-same-day', status: 'reserve', lever: 'своя кухня (доверие)', hook: 6, topic: 'AI for kids', score: 21,
    card: 'нарисовать',
    text: `Every homework in our course comes back the same day, checked by Anna herself.

A kid's "look what I made" can't wait until Thursday.

How long does your kid wait for feedback at school?` },

  { n: 23, day: 0, slot: 'reserve', id: 'own-pace', status: 'reserve', lever: 'вина → разрешение', hook: 24, topic: 'AI for kids', score: 21,
    card: 'нарисовать',
    text: `Our course has no deadlines. Most families do a lesson every day or two and finish in about two weeks.

Nobody loses a streak when life happens.

What pace would actually work at your house?` },

  { n: 24, day: 0, slot: 'reserve', id: 'zero-for-both', status: 'reserve', lever: 'вина → разрешение', hook: 7, topic: 'Parenting', score: 21,
    card: 'нарисовать',
    text: `You don't have to know anything about AI to do our course with your kid. It starts from zero for both of you, on purpose.

Would you rather learn it next to your kid, or have them explain it to you in a year?` },

  { n: 25, day: 0, slot: 'reserve', id: 'parent-account', status: 'reserve', lever: 'тревога → решение', hook: 4, topic: 'AI safety', score: 21,
    card: 'нарисовать',
    text: `Gemini, Canva, Suno, ChatGPT. Every tool in our course runs on your account, not your kid's.

They make things, you see everything.

Which AI apps does your kid already use without you?` },

  { n: 26, day: 0, slot: 'reserve', id: 'sticker-pack', status: 'reserve', lever: 'тепло + участие', hook: 15, topic: 'AI for kids', score: 21,
    card: 'нарисовать',
    text: `A sticker pack of their own character. Kids make one in our course, and the family group chat is never the same.

What character would your kid pick?` },

  { n: 27, day: 0, slot: 'reserve', id: 'idea-702', status: 'reserve', lever: 'до/после (мягкое предложение)', hook: 18, topic: 'AI for kids', score: 22,
    card: 'нарисовать (часы 7:02 → 7:41)',
    text: `Her idea at 7:02 pm. Playing it by 7:41.

That line is on our site because it is what the first lesson looks like: one evening, one playable game, no card needed.

What's your kid's 7:02 idea?` },

  { n: 28, day: 0, slot: 'reserve', id: 'quiz-vs-thing', status: 'reserve', lever: 'вызов привычному', hook: 16, topic: 'AI for kids', score: 22,
    card: 'есть (09-ends-with-a-thing)',
    text: `A quiz shows what a kid remembers. A finished game shows what they can do.

Every lesson of ours ends with a thing you can play, watch or sing, not a test.

Teachers, tell me where I'm wrong.` },

  { n: 29, day: 0, slot: 'reserve', id: 'grandparents', status: 'reserve', lever: 'раскол поколений (к праздникам)', hook: 20, topic: 'Gift ideas', score: 20,
    card: 'без карточки (короткий текстовый)',
    text: `Grandparents, real question: would you sit next to your grandkid while they make a cartoon with AI?

Or is that a hard no at your house?` },

  { n: 30, day: 0, slot: 'reserve', id: 'own-voice', status: 'reserve', lever: 'тепло + гордость', hook: 15, topic: 'AI for kids', score: 21,
    card: 'нарисовать',
    text: `One lesson in our course ends with your kid recording the voice-over for their own cartoon. Their words, their characters, their actual voice coming out of the TV.

What would your kid narrate first?` },
];

// ------------------------------------------------------------------------------------ checks and files
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%|^Rule \d of 5:/im;
const LECTURE = /^Rule \d+ of 5:/m;      // the dry lecture opener the owner banned

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-week');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const grid = posts.filter((p) => p.slot !== 'reserve');
  if (grid.length !== 21 || posts.length !== 30) throw new Error(`need 21 grid + 9 reserve, got ${grid.length}/${posts.length}`);
  const offers = grid.filter((p) => p.text.includes('http')).length;
  if (offers > 1) throw new Error(`${offers} offer posts in the grid: one a week at most`);
  for (const p of posts) {
    const bad = lint(p.text);
    const n = [...p.text].length;
    if (n > 500) bad.push(`${n} characters, limit 500`);
    if (BANNED.test(p.text.replace(url, ''))) bad.push(`banned phrase: ${p.text.replace(url, '').match(BANNED)[0]}`);
    if (LECTURE.test(p.text)) bad.push('dry "Rule N of 5:" lecture opener is banned');
    if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' ')) && !/tell me/i.test(p.text)) bad.push('must end on a real question');
    if (p.score < 20) bad.push(`self-review score ${p.score}: rewrite before it ships`);
    if (bad.length) throw new Error(`${p.n} ${p.id}: ${bad.join('; ')}`);
    const nn = String(p.n).padStart(2, '0');
    writeFileSync(join(out, `${nn}-${p.id}.md`), `---\nn: ${p.n}\nwhen: ${p.slot === 'reserve' ? 'reserve' : `day ${p.day}, ${SLOTS[p.slot]} New York`}\nstatus: ${p.status}\nlever: ${p.lever}\nhook_formula: ${p.hook} (text/threads-hooks.md)\ntopic: ${p.topic}\nscore: ${p.score}/25\ncharacters: ${n}\ncard: ${p.card}\n---\n${p.text}\n`);
    console.log(`${nn} ${(p.slot === 'reserve' ? 'RES ' : `d${p.day} ${p.slot}`).padEnd(7)} ${p.id.padEnd(20)} ${String(n).padStart(3)}ch ${p.score}/25 ${p.status}`);
  }
  console.log(`\n${grid.length} in the grid, ${posts.length - grid.length} in reserve, ${offers} offer post`);
}
