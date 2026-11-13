#!/usr/bin/env node
// Threads, useful layer on top of the week (owner, 13.11.2026): broad AI questions that interest parents
// and kids, built as "question + paradox + one visual", plus one saveable post for parents
// ("5 safe ways"). Added between the week posts, never instead of them. Week 2 ideas derived from
// "5 safe ways" sit in `next`.
//
//   node social/concept/threads-extra.mjs     checks every post and writes text/threads-extra/<id>.md
//
// Facts: brand claims only from social/brand/facts.md; the review is quoted word for word from
// social/media/landing/reviews/quotes.md with the "got the course free" note. General AI explanations are
// kept simple and true (no numbers we can't source).

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));

// when: New York time. kind: question (broad AI topic) | useful (save-worthy) | story (real review)
export const posts = [
  { id: 'ex-6-fingers', when: '2026-11-13T15:10', kind: 'question', topic: 'AI for kids', media: 'ex-6-fingers',
    text: `AI can paint a dragon in seconds. So why does it sometimes give people six fingers?

It learned from millions of photos where hands are half hidden or holding things. It copies what hands look like. It doesn't count them.

Next AI picture you see, have your kid count the fingers. Catch any?` },

  { id: 'ex-words-to-picture', when: '2026-11-14T15:10', kind: 'question', topic: 'AI for kids', media: 'ex-words-to-picture',
    text: `How does AI turn your kid's words into a picture?

It starts with pure static, like an old TV. Then it cleans the noise away step by step, each step nudged toward the words it was given.

That's why better words make better pictures. What would your kid describe first?` },

  { id: 'ex-9yo-cartoon', when: '2026-11-17T15:10', kind: 'story', topic: 'AI for kids', media: 'ex-9yo-cartoon',
    text: `A 9-year-old made his own cartoon with AI. How does a kid that age even start?

In our course every lesson is one short loop: Kamilla shows her finished thing first, your kid makes their own with you next to them, then shows the family.

His mom Emily, from our early-access group (they got the course free): "We made our own little cartoon together, and he was so excited to show it to his dad."

What would your kid's cartoon be about?` },

  { id: 'ex-5-safe-ways', when: '2026-11-18T15:10', kind: 'useful', topic: 'AI safety', media: 'ex-5-safe-ways',
    text: `5 safe ways to start your kid with AI. Save this for later.

1. Use your account and sit next to them.
2. Start with making something, like a game or a song.
3. Decide together what never goes into a chat: full name, school, address.
4. Check every result together. Sounds sure, still check.
5. Pick tools where strangers can't message your kid.

Which one would you add?` },

  { id: 'ex-sure-and-wrong', when: '2026-11-19T15:10', kind: 'question', topic: 'AI safety', media: 'ex-sure-and-wrong',
    text: `Why does AI sound so sure even when it's wrong?

It writes the most likely next words, and confident words are very likely. It has no feeling of "I'm not sure" unless it was trained to say so.

So we teach kids one habit: sounds sure, still check. Does your kid double-check AI?` },
];

// week 2: more broad questions and posts spun out of "5 safe ways", one way per post
export const next = [
  { id: 'nx-cat-prompt', kind: 'question', topic: 'AI for kids',
    text: `Try this with your kid: ask an AI for "a cat". Then ask for "an orange cat in a red hat, waving, cartoon style".

Same AI, same cat. Why is the second picture so much better?

Post what you got.` },
  { id: 'nx-way-1-account', kind: 'useful', topic: 'AI safety',
    text: `Safe way #1: use your account and sit next to them.

Every tool in our course runs on the parent's account, so your kid never signs up for anything alone and you see everything they make.

Whose account does your kid use for AI right now?` },
  { id: 'nx-way-2-make', kind: 'useful', topic: 'AI for kids',
    text: `Safe way #2: make the first AI evening about making something.

A kid who starts with a game or a song learns to give AI ideas. A kid who starts with homework learns to take answers.

What would your kid want to make first?` },
  { id: 'nx-way-3-never-list', kind: 'useful', topic: 'AI safety',
    text: `Safe way #3: write the never-share list together. Full name, school, address, passwords.

Kids keep a rule better when they helped write it.

What's on your list that's not on ours?` },
  { id: 'nx-why-weird-hands-fixed', kind: 'question', topic: 'AI for kids',
    text: `Can your kid spot an AI picture? Fingers, text on signs and earrings are good places to look.

Make it a game: the first one to find the mistake picks dessert.

Who won at your house?` },
];

const LIMITS = { question: 300, story: 450, useful: 450 };
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%/i;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-extra');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const [group, list] of [['scheduled', posts], ['next', next]]) {
    for (const p of list) {
      const n = [...p.text].length;
      const bad = lint(p.text).filter((h) => !h.includes('too long for a phone read'));
      if (n > LIMITS[p.kind]) bad.push(`${n} characters, limit for ${p.kind} is ${LIMITS[p.kind]}`);
      if (BANNED.test(p.text)) bad.push(`banned phrase: ${p.text.match(BANNED)[0]}`);
      if (!/\?/.test(p.text.trim().split('\n').slice(-2).join(' ')) && !/tell me|post what you got/i.test(p.text)) bad.push('must end on a real question');
      if (p.media && !existsSync(join(here, 'text', 'threads', `${p.media}.mp4`))) bad.push(`no card text/threads/${p.media}.mp4`);
      if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
      writeFileSync(join(out, `${p.id}.md`), `---\ngroup: ${group}\nwhen: ${p.when || 'week 2'} (New York)\nkind: ${p.kind}\ntopic: ${p.topic}\ncharacters: ${n}\ncard: ${p.media ? `text/threads/${p.media}.mp4` : 'none'}\n---\n${p.text}\n`);
      console.log(`${group.padEnd(9)} ${p.id.padEnd(26)} ${String(n).padStart(3)}ch ${p.kind}`);
    }
  }
}
