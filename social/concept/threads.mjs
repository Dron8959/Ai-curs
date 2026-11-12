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
    text: `honestly don't get why an hour of scrolling feels normal and 20 minutes of making something with AI feels scary.

one ends with nothing. the other ends with a game your kid can show you.

which one worries you more?` },

  { id: 'threads-02-age-eight', hook: 13, rubric: 'You decide', topic: 'Parenting', week: 3, day: 'Вт',
    text: `if your kid is 8, your job with AI is to sit next to them. not across the room.

the ideas come faster than the typing, so you help get them in. they decide if it's right.

how much do you step in?` },

  { id: 'threads-03-argue', hook: 1, rubric: 'Unpopular opinion', topic: 'AI for kids', week: 3, day: 'Ср',
    text: `not many parents say this out loud: i'd rather my kid argue with an AI than obey it.

it gets things wrong. a kid who checks and asks again is learning the useful part.

trust it or question it, which do you want?` },

  { id: 'threads-04-ai-level', hook: 20, rubric: 'You decide', topic: 'AI for kids', week: 3, day: 'Чт', poll: true,
    media: 'text/threads/threads-04-ai-level.mp4',
    text: `quick one. your family's AI level right now?

1 never tried it
2 homework answers
3 my kid made something
4 my kid showed it to someone

which number?` },

  { id: 'threads-05-fake-check', hook: 4, rubric: 'Unpopular opinion', topic: 'AI safety', week: 3, day: 'Пт',
    media: 'text/threads/threads-05-fake-check.mp4',
    text: `if a picture looks too perfect, check it. same for videos and texts.

it's one of the AI safety lessons in our course.

could your kid spot a fake today?` },

  { id: 'threads-06-tuesday-night', hook: 8, rubric: 'Unpopular opinion', topic: 'AI for kids', week: 4, day: 'Пн',
    media: 'text/threads/threads-06-tuesday-night.mp4',
    text: `everyone says "teach your kids AI". what it looks like at our house:

watch a finished thing. make your own. show someone.

6 to 20 minutes, no quiz at the end.

what does it look like at yours, if anything?` },

  { id: 'threads-07-describe-check', hook: 10, rubric: 'Unpopular opinion', topic: 'AI for kids', week: 4, day: 'Вт',
    media: 'text/threads/threads-07-describe-check.mp4',
    text: `the whole skill of using AI, as far as i can tell: say what you want, check what came back, ask again.

a 10-year-old can do that.

when did you last tell an AI "no, try again"?` },
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
