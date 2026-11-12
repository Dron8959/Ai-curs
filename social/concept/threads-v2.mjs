#!/usr/bin/env node
// Threads, second pass: the first 15 posts as a five-day plan, three a day (US time), plus a reserve.
// Every post presses on one emotional lever (owner's doc: https://claude.ai/artifact/RQ2iivZWf1D9wXMyzUtGo9).
// Drafts only. Nothing here is scheduled until the owner says ok.
//
//   node social/concept/threads-v2.mjs     checks every post and writes text/threads-v2/<NN>-<id>.md
//
// Day shape: morning = short text with a card worded from it (a lever that splits or stings); noon = "AI house rules" series,
// one rule a day with the same card layout; evening = the main post with a motion card.
// Rules: facts only from social/brand/facts.md; no invented stories or kid quotes; warm and calm, the
// provocation is in the idea, never aimed at people; short (phone read); no "AI tells" (threads-lint.mjs);
// the post ends on a real question (or "tell me").

import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const url = 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=free-lesson#free';
export const SLOTS = { am: '8:10 AM', noon: '12:40 PM', pm: '8:40 PM' };   // New York time

export const posts = [
  // ---------------------------------------------------------------- day 1
  { id: 'v2-01-guilt', day: 1, slot: 'am', lever: 'вина → разрешение', topic: 'Parenting', media: 'v2-01-guilt',
    text: `The guilt about screen time is louder than the screen time.

20 minutes making a game and 2 hours of videos get the same guilt. Why?` },
  { id: 'v2-r1-account', day: 1, slot: 'noon', lever: 'серия: открытая петля', topic: 'AI safety', media: 'v2-r1-account',
    text: `5 house rules before any kid opens an AI tool. One a day.

Rule 1: The account is yours. Your kid never signs up for anything alone, and you see everything they make.

Want to guess rule 2?` },
  { id: 'v2-12-age', day: 1, slot: 'pm', lever: 'раскол: возраст', topic: 'Parenting', media: 'v2-12-age',
    text: `At what age would you let your kid try AI, with you sitting right next to them?

Here's ours:
6 years old: They talk, you type.
10 years old: They do most of it.
Teen: You just stay in the room.

Where's yours?` },

  // ---------------------------------------------------------------- day 2
  { id: 'v2-04-who-asks-better', day: 2, slot: 'am', lever: 'гордость и зеркало', topic: 'Parenting', media: 'v2-04-who-asks-better',
    text: `Kids just say what they want. Grown ups write three paragraphs first.

Be honest, who's better at asking an AI for what they want, you or your 10-year-old?` },
  { id: 'v2-r2-strangers', day: 2, slot: 'noon', lever: 'серия: открытая петля', topic: 'AI safety', media: 'v2-r2-strangers',
    text: `Rule 2 of 5: Nobody you don't know gets to message your kid. Our course has no chat between strangers at all, on purpose.

Does your kid's favorite app let strangers in?` },
  { id: 'v2-13-two-kids', day: 2, slot: 'pm', lever: 'раскол: два ребёнка', topic: 'AI for kids', media: 'v2-13-two-kids',
    text: `Two kids, same chatbot.

One asks for the homework answer. The other tells it about a game she made up, and builds it.

Which one would you stop?` },

  // ---------------------------------------------------------------- day 3
  { id: 'v2-02-school-vs-world', day: 3, slot: 'am', lever: 'раскол: школа и мир', topic: 'AI for kids', media: 'v2-02-school-vs-world',
    text: `School says using AI is cheating. Plenty of other people say it's a skill.

Your kid sits right in the middle. What do you tell them?` },
  { id: 'v2-r3-never-hears', day: 3, slot: 'noon', lever: 'серия: участие', topic: 'AI safety', media: 'v2-r3-never-hears',
    text: `Rule 3 of 5: Some things AI never hears. We teach kids what's on that list and why.

What's the first thing on yours?` },
  { id: 'v2-03-did-she-make-it', day: 3, slot: 'pm', lever: 'раскол: чья это работа', topic: 'AI for kids', media: 'v2-03-did-she-make-it',
    text: `Your 8-year-old describes a song in her own words. AI makes the music. She sings it for grandma.

Did she make it?` },

  // ---------------------------------------------------------------- day 4
  { id: 'v2-06-ban', day: 4, slot: 'am', lever: 'против течения', topic: 'AI safety', media: 'v2-06-ban',
    text: `Banning AI at home won't keep your kid away from it. Almost 9 in 10 US kids aged 9 to 17 already use it (Common Sense Media, 2026).

A ban only decides whether they learn it with you or without you.

If you've said no at home, what would change your mind?` },
  { id: 'v2-r4-links', day: 4, slot: 'noon', lever: 'серия: признание', topic: 'AI safety', media: 'v2-r4-links',
    text: `Rule 4 of 5: Links get a second look. Kids learn what a suspicious link looks like before they ever click one.

Be honest, has your kid clicked something they shouldn't have?` },
  { id: 'v2-09-kitchen-table', day: 4, slot: 'pm', lever: 'своя кухня (доверие)', topic: 'Parenting', media: 'v2-09-kitchen-table',
    text: `I tested every lesson of our course on my 10-year-old at the kitchen table. If it lost her, it got cut.

She argues with the script a lot. Who's the toughest critic at your house?` },

  // ---------------------------------------------------------------- day 5
  { id: 'v2-16-dinner-prompt', day: 5, slot: 'am', lever: 'задание (участие)', topic: 'Parenting', media: 'v2-16-dinner-prompt',
    text: `Try this at dinner tonight: ask your kid what game they'd make if they could make any game at all.

Then come back and tell me what they said.` },
  { id: 'v2-r5-too-perfect', day: 5, slot: 'noon', lever: 'серия: итог', topic: 'AI safety', media: 'v2-r5-too-perfect',
    text: `Rule 5 of 5: If it looks too perfect, check it. Pictures, videos and texts can all be fake, and kids can learn to spot them.

That's all five. Which one would you add or swap at your house?` },
  { id: 'v2-15-offer', day: 5, slot: 'pm', lever: 'предложение (раз в пять постов)', topic: 'AI for kids', media: 'v2-15-offer',
    text: `First lesson of our course is free. No card, just an email. Your kid builds a playable game in 10 to 20 minutes, then you two play it on the same couch.

${url}

If you try it, tell me what the game was about.` },
];

// Not in the first 15. Why each one waits is in the owner's doc.
export const reserve = [
  { id: 'v2-05-alone-or-couch', lever: 'тревога → решение', why: 'схема «рискованный вариант / безопасный вариант» читается как шаблон; тревога без новой мысли',
    text: `The risky version of kids and AI is a kid alone with it in their room. The safe version is the two of you on the same couch.

Where does your kid use screens right now?` },
  { id: 'v2-08-quiz', lever: 'вызов привычному', why: 'вопрос к учителям, а читают родители; карточка готова, вернём, когда пойдёт тема школы',
    text: `A quiz shows what a kid remembers. A finished thing shows what they can do. Every lesson of ours ends with a game, a cartoon or a song.

Teachers, what does a quiz show you that a finished project can't?` },
  { id: 'v2-10-no-expert', lever: 'вина → разрешение', why: '«that\'s the whole job» звучит как поучение, «what\'s holding you back?» как продажа',
    text: `You don't have to understand AI to sit next to your kid while they use it. That's the whole job.

What's holding you back?` },
  { id: 'v2-11-gift', lever: 'тепло и подарки', why: 'хорош к праздникам: ставим ближе к концу ноября',
    text: `Linda, a grandmother from our early-access group (she got the course free), told us:

"I wanted to give my grandson something more meaningful than another toy. MakeShowLab gave us a fun way to spend time together."

A box to open or time together. Which would your kid pick?` },
  { id: 'v2-14-who-thinks', lever: 'страх → пересмотр', why: 'под видом мысли спрятана та же схема «не X, а Y»; абстрактно',
    text: `People worry AI will think for their kid. It does when nobody asks the kid what they think first.

When your kid decides what to make, tells the AI, checks it and fixes it, the thinking stays theirs.

Where do you land on this?` },
  { id: 'v2-17-nine-pm', lever: 'раскол и самопроверка', why: 'новая идея, для второй недели',
    text: `Your kid asks you something you can't answer. You google it, ask an AI, or say "I don't know, let's find out".

Which one teaches them the most?` },
  { id: 'v2-18-grandparents', lever: 'раскол: бабушки и дедушки', why: 'новая идея, для второй недели и праздников',
    text: `Grandparents, real question: would you sit next to your grandkid while they make a cartoon with AI?

Or is that a hard no at your house?` },
];

const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%/i;
function check(p) {
  const bad = lint(p.text);
  const n = [...p.text].length;
  if (n > 500) bad.push(`${n} characters, the limit is 500`);
  if (BANNED.test(p.text.replace(url, ''))) bad.push(`banned phrase: ${p.text.replace(url, '').match(BANNED)[0]}`);
  if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' ')) && !/tell me/i.test(p.text)) bad.push('must end on a real question');
  if (p.media && !existsSync(join(here, 'text', 'threads', `${p.media}.mp4`))) bad.push(`no card text/threads/${p.media}.mp4 (node social/concept/threads-cards.mjs)`);
  if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
  return n;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-v2');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const offers = posts.filter((p) => p.text.includes(url)).length;
  if (offers > Math.ceil(posts.length / 5)) throw new Error(`${offers} offer posts in ${posts.length}: one in five at most`);
  posts.forEach((p, i) => {
    const n = check(p);
    const nn = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `${nn}-${p.id}.md`), `---\nday: ${p.day}\nslot: ${p.slot} (${SLOTS[p.slot]} New York)\nlever: ${p.lever}\ntopic: ${p.topic}\ncharacters: ${n}\ncard: ${p.media ? `text/threads/${p.media}.mp4` : 'none (text only)'}\n---\n${p.text}\n`);
    console.log(`${nn} d${p.day} ${p.slot.padEnd(4)} ${p.id.padEnd(24)} ${String(n).padStart(3)}  ${p.media ? 'card' : '    '}  ${p.lever}`);
  });
  for (const r of reserve) { const bad = lint(r.text); if (bad.length) console.log(`  reserve ${r.id}: ${bad.join('; ')}`); }
  console.log(`reserve: ${reserve.length} posts`);
}
