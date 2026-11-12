#!/usr/bin/env node
// Threads, second pass: every post is built on one emotional lever (see text/threads-strategy.md in the owner's doc).
// Drafts only. Nothing here is scheduled until the owner says ok.
//
//   node social/concept/threads-v2.mjs     checks every draft and writes text/threads-v2/<id>.md
//
// Rules: facts only from social/brand/facts.md; no invented stories or kid quotes; warm and calm, the
// provocation is in the idea, never aimed at people; short (phone read); no "AI tells" (threads-lint.mjs);
// the post ends on a real question (or "tell me").

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.makeshowlab.com/';
const url = `${SITE}?utm_source=threads&utm_medium=social&utm_campaign=free-lesson#free`;

// lever: what the post presses on
export const posts = [
  { id: 'v2-01-guilt', lever: 'вина → разрешение', rubric: 'Unpopular opinion', topic: 'Parenting',
    text: `the guilt about screen time is louder than the screen time.

20 minutes making a game and 2 hours of videos get the same guilt. why?` },

  { id: 'v2-02-school-vs-world', lever: 'раскол: школа и мир', rubric: 'You decide', topic: 'AI for kids',
    text: `school says using AI is cheating. plenty of other people say it's a skill.

your kid sits right in the middle. what do you tell them?` },

  { id: 'v2-03-did-she-make-it', lever: 'раскол: чья это работа', rubric: 'You decide', topic: 'AI for kids', media: '10-is-it-cheating',
    text: `your 8-year-old describes a song in her own words. AI makes the music. she sings it for grandma.

did she make it?` },

  { id: 'v2-04-who-asks-better', lever: 'гордость и зеркало', rubric: 'You decide', topic: 'Parenting',
    text: `kids just say what they want. grown ups write three paragraphs first.

be honest, who's better at asking an AI for what they want, you or your 10-year-old?` },

  { id: 'v2-05-alone-or-couch', lever: 'тревога → решение', rubric: 'Unpopular opinion', topic: 'AI safety',
    text: `the risky version of kids and AI is a kid alone with it in their room. the safe version is the two of you on the same couch.

where does your kid use screens right now?` },

  { id: 'v2-06-ban', lever: 'идёт против течения', rubric: 'Unpopular opinion', topic: 'AI safety',
    text: `banning AI at home won't keep your kid away from it. almost 9 in 10 US kids aged 9 to 17 already use it (Common Sense Media, 2026).

a ban only decides whether they learn it with you or without you.

if you've said no at home, what would change your mind?` },

  { id: 'v2-07-five-rules', lever: 'открытая петля (серия)', rubric: 'Unpopular opinion', topic: 'AI safety', media: '03-rule-one',
    text: `5 rules we set before any kid opens an AI tool. rule 1 today: the account is yours. your kid never signs up for anything alone.

rule 2 tomorrow. want to guess it?` },

  { id: 'v2-08-quiz', lever: 'вызов привычному', rubric: 'Unpopular opinion', topic: 'AI for kids', media: '09-ends-with-a-thing',
    text: `a quiz shows what a kid remembers. a finished thing shows what they can do. every lesson of ours ends with a game, a cartoon or a song.

teachers, what does a quiz show you that a finished project can't?` },

  { id: 'v2-09-kitchen-table', lever: 'своя кухня (доверие)', rubric: 'Unpopular opinion', topic: 'Parenting', media: '04-kitchen-table',
    text: `i tested every lesson of our course on my 10-year-old at the kitchen table. if it lost her, it got cut.

she argues with the script a lot. who's the toughest critic at your house?` },

  { id: 'v2-10-no-expert', lever: 'вина → разрешение', rubric: 'You decide', topic: 'Parenting',
    text: `you don't have to understand AI to sit next to your kid while they use it. that's the whole job.

what's holding you back?` },

  { id: 'v2-11-gift', lever: 'тепло и подарки', rubric: 'You decide', topic: 'Gift ideas',
    text: `Linda, a grandmother from our early-access group (she got the course free), told us:

"I wanted to give my grandson something more meaningful than another toy. MakeShowLab gave us a fun way to spend time together."

a box to open or time together. which would your kid pick?` },

  { id: 'v2-12-age', lever: 'раскол: возраст', rubric: 'You decide', topic: 'Parenting', media: '07-by-age',
    text: `how young is too young for AI, if you're sitting right there?

6: they talk, you type
10: they do most of it
teen: you stay in the room

where's your line?` },

  { id: 'v2-13-two-kids', lever: 'раскол: два ребёнка', rubric: 'You decide', topic: 'AI for kids', media: '02-answer-machine',
    text: `two kids, same chatbot.

one asks for the homework answer. the other tells it about a game she made up, and builds it.

which one would you stop?` },

  { id: 'v2-14-who-thinks', lever: 'страх → пересмотр', rubric: 'Unpopular opinion', topic: 'AI for kids', media: '05-will-ai-think',
    text: `people worry AI will think for their kid. it does when nobody asks the kid what they think first.

when your kid decides what to make, tells the AI, checks it and fixes it, the thinking stays theirs.

where do you land on this?` },

  { id: 'v2-15-offer', lever: 'предложение (раз в пять постов)', rubric: 'Offer', topic: 'AI for kids',
    text: `first lesson of our course is free. no card, just an email. your kid builds a playable game in 10 to 20 minutes, then you play each other on the same couch.

${url}

tell me what the game was about if you try it` },
];

const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%/i;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-v2');
  mkdirSync(out, { recursive: true });
  for (const p of posts) {
    const bad = lint(p.text);
    const n = [...p.text].length;
    if (n > 500) bad.push(`${n} characters, the limit is 500`);
    if (BANNED.test(p.text.replace(url, ''))) bad.push(`banned phrase: ${p.text.match(BANNED)[0]}`);
    if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' ')) && !/tell me/i.test(p.text)) bad.push('must end on a real question');
    if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
    writeFileSync(join(out, `${p.id}.md`), `---\nlever: ${p.lever}\nrubric: ${p.rubric}\ntopic: ${p.topic}\ncharacters: ${n}\ncard: ${p.media ? `text/threads/${p.media}.mp4` : 'none (text only)'}\n---\n${p.text}\n`);
    console.log(`${p.id.padEnd(24)} ${String(n).padStart(3)}  ${p.lever}`);
  }
}
