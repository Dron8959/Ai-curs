#!/usr/bin/env node
// Threads-only posts built on the hook formulas in text/threads-hooks.md. These have no X twin
// (the shared Threads + X posts live in text.mjs).
//
//   node social/concept/threads.mjs     checks every post and writes text/threads-NN-slug.md
//
// Rules: up to 500 characters, warm and calm, one hook formula per post, a real question at the end,
// no hashtags (the topic is set in the app), no em dashes or curly quotes, facts only from
// social/brand/facts.md. No photos of Anna or Kamilla and nothing from inside the course: visuals are
// motion cards drawn in code (threads-cards.mjs).

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export const posts = [
  { id: 'threads-01-honestly', hook: 5, rubric: 'Unpopular opinion', topic: 'Parenting', week: 3, day: 'Пн',
    text: `Honestly, I don't get why an hour of scrolling feels normal and 20 minutes of making something with AI feels scary.

One ends with nothing. The other ends with a game, a cartoon or a song your kid can show you.

I'm not saying screens are fine. I'm saying not all screen time is the same.

So which one worries you more at your house, and why?` },

  { id: 'threads-02-age-six', hook: 13, rubric: 'You decide', topic: 'Parenting', week: 3, day: 'Вт',
    text: `If your kid is 6, here's your job with AI: they talk, you type.

At 6 the ideas are big and the typing is slow. So the child describes, you type it in, and they decide if what comes back is right. At 10 most kids do it alone. A teenager just needs you in the room.

The idea is always theirs.

Parents of 6-year-olds: would you let yours try this, or is it too early?` },

  { id: 'threads-03-argue', hook: 1, rubric: 'Unpopular opinion', topic: 'AI for kids', week: 3, day: 'Ср',
    text: `Not many parents say this out loud, so I will: I'd rather my kid argue with an AI than obey it.

AI gets things wrong. A picture comes out strange, an answer sounds sure and isn't. A kid who checks, pushes back and asks again is learning the most useful thing AI can teach.

Do you want your kid to trust AI, or to question it?` },

  { id: 'threads-04-ai-level', hook: 20, rubric: 'You decide', topic: 'AI for kids', week: 3, day: 'Чт', poll: true,
    text: `Quick check: what's your family's AI level right now?

1. Never tried it
2. Homework answers
3. My kid made something with it
4. My kid showed it to someone

No wrong answer. Which number are you, and would you like to move up a level or stay put?` },

  { id: 'threads-05-three-things', hook: 4, rubric: 'Unpopular opinion', topic: 'AI safety', week: 3, day: 'Пт',
    text: `3 things to settle before your kid opens an AI app:

1. The account is yours. They never sign up for anything alone.
2. Some things AI never hears. Decide together what they are.
3. If it looks too perfect, check it. Pictures, videos and texts can be fake.

Settle these three, and the fight about minutes gets a lot smaller.

What would you add as number 4?` },

  { id: 'threads-06-tuesday-night', hook: 8, rubric: 'Unpopular opinion', topic: 'AI for kids', week: 4, day: 'Пн',
    text: `Everyone says "teach your kids AI." Very few show what that looks like on a Tuesday night.

Here's ours, in one loop. Watch: see a finished thing first. Make: your kid makes their own, you sit next to them. Show: play it, share it, send it to grandma.

6 to 20 minutes, and it ends with a thing, not a quiz.

What does "teaching AI" look like at your house, if anything?` },
];

// ------------------------------------------------------------------------------------ checks and files
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack|lifehack)\b|comment yes|like (and|&) share|follow for more|\b99%/i;
function check(p) {
  const bad = [];
  const n = [...p.text].length;
  if (n > 500) bad.push(`${n} characters, the limit is 500`);
  if (BANNED.test(p.text)) bad.push(`banned character or phrase: ${p.text.match(BANNED)[0]}`);
  if ((p.text.replace(/https?:\/\/\S+/g, '').match(/#\w+/g) || []).length) bad.push('no hashtags on Threads: the topic is set in the app');
  if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' '))) bad.push('a Threads post ends on a real question');
  if (!p.hook || p.hook < 1 || p.hook > 25) bad.push('hook must name a formula 1-25 from text/threads-hooks.md');
  if (p.media && !existsSync(join(here, p.media))) bad.push(`no media ${p.media}`);
  if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
  return n;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text');
  mkdirSync(out, { recursive: true });
  const ids = new Set();
  for (const p of posts) {
    if (ids.has(p.id)) throw new Error(`duplicate id ${p.id}`);
    ids.add(p.id);
    const n = check(p);
    writeFileSync(join(out, `${p.id}.md`), `---
lane: text (Threads only)
hook_formula: ${p.hook} (text/threads-hooks.md)
rubric: ${p.rubric}
week: ${p.week}
day: ${p.day}
threads_characters: ${n} of 500
threads_topic: ${p.topic}
threads_media: ${p.media ? `social/concept/${p.media}` : 'not drawn yet (motion card in code, no photos)'}${p.poll ? '\nthreads_poll: yes, put the four options in the app poll as well' : ''}
---
## Threads

${p.text}
`);
    console.log(`${p.id.padEnd(26)} hook ${String(p.hook).padStart(2)}  ${String(n).padStart(3)} chars  ${p.rubric}`);
  }
}
