#!/usr/bin/env node
// Threads, week 2 (Fri 20.11 – Thu 26.11.2026, New York): 21 posts, three a day, one of the three is useful.
// Built in steps (owner, 14.11.2026): first the half-template and the first 5 posts, the rest after the owner's ok.
//
//   node social/concept/threads-week2.mjs     checks every post and writes text/threads-week2/NN-id.md
//
// HALF-TEMPLATE
// Day = 3 posts (New York): 8:10 ours · 12:40 USEFUL · 20:40 ours. Thanksgiving is Thu 26.11.
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
export const SLOTS = { am: '08:10', noon: '12:40', pm: '20:40' };

export const posts = [
  // ---------------------------------------------------------------- Fri 20.11
  { id: 'w2-01-things-made', date: '2026-11-20', slot: 'am', kind: 'ours', lever: 'раскол привычного правила', topic: 'Parenting', media: 'w2-01-things-made',
    text: `Screen time rules usually count hours.

What if yours counted things made instead? One game, one song, one cartoon, then screens off.

Would that work at your house?` },
  { id: 'ex-words-to-picture', date: '2026-11-20', slot: 'noon', kind: 'how', lever: 'любопытство: как это работает', topic: 'AI for kids', media: 'ex-words-to-picture',
    text: `How does AI turn your kid's words into a picture? It doesn't look one up.

It starts from pure static, like an old TV, and cleans the noise away step by step, each step nudged toward the words.

Try "a cat", then "an orange cat in a red hat, waving". Which one looks more like your kid's idea?` },
  { id: 'w2-03-ai-kamilla', date: '2026-11-20', slot: 'pm', kind: 'ours', lever: 'доверие: честность про ИИ', topic: 'AI safety', media: 'w2-03-ai-kamilla',
    text: `Some lessons in our course are led by an AI version of Kamilla, our 10-year-old co-host. Every time, we say so.

Kids should always know when they're watching a real person and when it's AI.

Does your kid know how to tell?` },

  // ---------------------------------------------------------------- Sat 21.11
  { id: 'w2-04-last-question', date: '2026-11-21', slot: 'am', kind: 'ours', lever: 'любопытство и лёгкая тревога', topic: 'Parenting', media: 'w2-04-last-question',
    text: `Quick one: do you know the last thing your kid asked an AI?

Kids ask it things they'd never ask us. Sometimes funny, sometimes not.

Do you know what yours asked this week?` },
  { id: 'w2-05-spot-the-fake', date: '2026-11-21', slot: 'noon', kind: 'try', lever: 'игра вместе', topic: 'AI for kids', media: 'w2-05-spot-the-fake',
    text: `Can your kid spot an AI picture? The first clue: it looks a little too perfect.

Then check the hands, words on signs, earrings that don't match, shadows going the wrong way.

Make it a game tonight. First one to find a mistake picks dessert. Who wins at your house?` },
];

const LIMIT = { ours: 300, how: 450, try: 450, save: 450, case: 450 };
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%/i;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-week2');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const days = [...new Set(posts.map((p) => p.date))];
  for (const d of days) {
    const day = posts.filter((p) => p.date === d);
    if (day.filter((p) => p.kind !== 'ours').length > 1) throw new Error(`${d}: one useful post a day`);
    if (day.length === 3 && !day.some((p) => p.slot === 'noon' && p.kind !== 'ours')) throw new Error(`${d}: the 12:40 post must be useful`);
  }
  const useful = posts.filter((p) => p.kind !== 'ours');
  useful.forEach((p, i) => { if (i && useful[i - 1].kind === p.kind) throw new Error(`${p.id}: two "${p.kind}" useful posts in a row`); });
  posts.forEach((p, i) => {
    const n = [...p.text].length;
    const bad = lint(p.text).filter((h) => !h.includes('too long for a phone read'));
    if (n > LIMIT[p.kind]) bad.push(`${n} characters, limit for ${p.kind} is ${LIMIT[p.kind]}`);
    if (BANNED.test(p.text)) bad.push(`banned phrase: ${p.text.match(BANNED)[0]}`);
    if (/^Rule \d+ of 5:/m.test(p.text)) bad.push('lecture format "Rule N of 5:"');
    if (!/^[A-Z0-9"]/.test(p.text)) bad.push('must start with a capital letter');
    if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' '))) bad.push('must end on a real question');
    if (p.media && !existsSync(join(here, 'text', 'threads', `${p.media}.mp4`))) bad.push(`no card text/threads/${p.media}.mp4`);
    if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
    const nn = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `${nn}-${p.id}.md`), `---\nwhen: ${p.date} ${SLOTS[p.slot]} (New York)\nkind: ${p.kind}\nlever: ${p.lever}\ntopic: ${p.topic}\ncharacters: ${n}\ncard: text/threads/${p.media}.mp4\n---\n${p.text}\n`);
    console.log(`${nn} ${p.date} ${SLOTS[p.slot]} ${p.kind.padEnd(5)} ${p.id.padEnd(22)} ${String(n).padStart(3)}ch`);
  });
}
