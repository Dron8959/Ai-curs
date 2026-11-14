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
// removed 14.11: ex-sure-and-wrong (owner didn't like it, Metricool draft 427864136);
// ex-words-to-picture moved to threads-week2.mjs (Fri 20.11, 12:40)
export const posts = [
  { id: 'ex-6-fingers', when: '2026-11-14T15:10', kind: 'question', topic: 'AI for kids', media: 'ex-6-fingers',
    text: `AI can paint a dragon in seconds. So why does it sometimes give people six fingers?

It learned from millions of photos where hands are half hidden or holding things. It copies what hands look like. It doesn't count them.

Next AI picture you see, have your kid count the fingers. Catch any?` },

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


  // added 14.11 at the owner's ask: one useful post every day (they take the 15:10 slot)
  { id: 'ex-two-answers', when: '2026-11-15T15:10', kind: 'try', topic: 'AI for kids', media: 'ex-two-answers',
    text: `Ask an AI the same question twice. You'll often get two different answers.

It picks its words with a bit of chance each time, so no two answers come out exactly the same.

Try it tonight: "Tell me a fact about octopuses", twice. Then check one fact together. What did yours say?` },
  { id: 'ex-is-it-alive', when: '2026-11-16T15:10', kind: 'how', topic: 'AI for kids', media: 'ex-is-it-alive',
    text: `Is AI alive? It talks like a friend, so it's a fair question for a kid.

It learned how people write by reading a huge amount of text, so it sounds like a person. It doesn't eat, sleep or miss anyone.

How would your kid answer: alive or not?` },
  { id: 'ex-our-dog', when: '2026-11-19T15:10', kind: 'try', topic: 'AI for kids', media: 'ex-our-dog',
    text: `AI has seen millions of dogs. It has never seen yours.

Ask it to draw "our dog" and you get a random dog. Now let your kid describe yours: the color, the ears, the silly thing it always does.

How close did it get?` },
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

const LIMITS = { question: 300, story: 450, useful: 450, how: 450, try: 450, save: 450, case: 450 };
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
