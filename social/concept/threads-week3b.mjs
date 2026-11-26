#!/usr/bin/env node
// Threads, week 3 rebuilt (owner, 26.11.2026) after the growth research (doc https://claude.ai/artifact/VbBtFaiqFg1FrXtiJHEdsP):
// - 2 posts a day: 08:30 and 19:30 New York (20:30 and 07:30 in Vietnam, so someone is awake for the first hour).
// - Anna's first-person voice, the course rarely.
// - Every post gives a one-word way in: A or B, a number, fill in the blank, one sentence.
// - One topic tag per post (Threads reads the first hashtag as the topic).
// - firstComment: Anna's own first reply, posted with the post, so the thread is never empty.
// Facts only from social/brand/facts.md and owner-confirmed stories (7:02 -> 7:41 game, cartoon 2-3 tries per scene,
// lessons tested on Kamilla at the kitchen table). Nothing invented.
//
//   node social/concept/threads-week3b.mjs   checks every post

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const url = 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=w3b-free-lesson#free';
export const SLOTS = { am: '08:30', pm: '19:30' };

export const posts = [
  { date: '2026-11-27', slot: 'am', text: `Black Friday question for parents. The last toy you bought your kid: how many days before it ended up under the bed?

Just the number. #parenting`,
    firstComment: `And the one thing that never ends up under the bed at your house?` },
  { date: '2026-11-27', slot: 'pm', text: `Hi, I'm Anna. Mom of a 10-year-old, and I'm building an AI course for kids with her at our kitchen table.

She tests every lesson. If she gets bored, the lesson gets cut. No appeals.

What's one thing you'd want to ask a mom doing this? #parenting` },

  { date: '2026-11-28', slot: 'am', text: `Saturday, one hour of screen time left. Pick one for your kid:

A) watching someone else play Minecraft
B) making their own little game

A or B, and be honest. #parenting` },
  { date: '2026-11-28', slot: 'pm', text: `7:02 pm my daughter had an idea: a park, a girl and her corgi.

7:41 pm we were playing her game against each other at the kitchen table. No code.

What would your kid's game be about? One sentence is enough. #AIforKids` },

  { date: '2026-11-29', slot: 'am', text: `Fill in the blank: "My kid uses AI mostly for ___."

No judgment. I'm genuinely curious what it looks like in other houses. #parenting` },
  { date: '2026-11-29', slot: 'pm', text: `Unpopular opinion: screen time limits are the wrong fight.

Two hours of watching and two hours of making something are not the same two hours. I'd rather count what my kid made than how long she was on.

Tell me where I'm wrong. #parenting` },

  { date: '2026-11-30', slot: 'am', text: `Quick one for parents: has your kid ever asked AI something they'd never ask you?

Yes, no, or "I don't want to know". #parenting` },
  { date: '2026-11-30', slot: 'pm', text: `My daughter's first AI cartoon took two or three tries per scene. A cat, a croissant, Paris.

She looked at every scene and told the AI what to fix. About 20 minutes for the whole thing.

Would your kid keep the first version or fix it? #AIforKids` },

  { date: '2026-12-01', slot: 'am', text: `Your kid finishes homework with AI's help. What do you check first?

A) the answer
B) whether they can explain it without the screen

#parenting` },
  { date: '2026-12-01', slot: 'pm', text: `A grandmother from our early-access group (she got the course free) told us she wanted to give her grandson "something more meaningful than another toy."

Grandparents, what's the best gift you ever gave a grandkid that wasn't a toy? #grandparents` },

  { date: '2026-12-02', slot: 'am', text: `Finish this sentence: "The thing that worries me most about AI and my kid is ___."

I'll go first in the comments. #parenting`,
    firstComment: `Mine: that it does the thinking for her instead of with her. That's why every lesson we make starts with her idea, not the AI's.` },
  { date: '2026-12-02', slot: 'pm', text: `If your kid has a free evening this week: the first lesson of our course is free, no card. They build a game in 10 to 20 minutes, then you play it against each other.

${url}

Who wins at your house, you or the kid? #AIforKids` },

  { date: '2026-12-03', slot: 'am', text: `Honest question for parents who said no to AI at home: what would change your mind?

One sentence. I read every reply. #parenting` },
  { date: '2026-12-03', slot: 'pm', text: `My daughter made a sticker pack of her own character with AI.

If your kid had a sticker of themselves, what face would it be? #AIforKids` },
];

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|game-changer|delve|harness)\b|comment yes|follow for more|[\u{1F300}-\u{1FAFF}]/iu;
  posts.forEach((p, i) => {
    const bad = lint(p.text).filter((h) => !h.includes('too long'));
    const t = p.text.replace(url, '');
    if (BANNED.test(t)) bad.push(`banned: ${t.match(BANNED)[0]}`);
    if ((t.match(/#\w+/g) || []).length !== 1) bad.push('exactly one topic tag');
    if ([...p.text].length > 500) bad.push('over 500');
    if (/^(in our course|our course)/i.test(p.text)) bad.push('hook starts with the product');
    if (bad.length) throw new Error(`${i + 1}: ${bad.join('; ')}`);
    console.log(`${String(i + 1).padStart(2, '0')} ${p.date} ${SLOTS[p.slot]} ${String([...p.text].length).padStart(3)}ch ${p.firstComment ? '+1st comment' : ''}`);
  });
}
