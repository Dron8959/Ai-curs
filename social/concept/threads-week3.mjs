#!/usr/bin/env node
// Threads, week 3 (Fri 27.11 – Thu 03.12.2026, New York): 21 posts from the owner's topic bank (24.11.2026).
//
//   node social/concept/threads-week3.mjs     checks every post and writes text/threads-week3/NN-id.md
//
// Owner's rules for this week:
// - 80/20: 17 posts about the parent's problem, 4 about the course. The hook is always about the viewer; the course
//   shows up only in the last lines, never in the first words ("In our course..." as an opener is banned).
// - Built on parents' fears and needs (social/brand/brand-profile.md): screens instead of time together; AI will make
//   the kid lazy or do the homework; is it safe; no time; "I don't understand AI myself".
// - About 20% with a card (4 posts), the rest plain text. Text must not read as AI-written (threads-lint.mjs).
// - Times spread over the day, at least an hour apart (the 17:00-18:30 window test lost, 24.11): 08:10 / 12:40 / 20:40.
// - Nothing goes to Metricool before the owner's ok.
// Facts only from social/brand/facts.md, quotes word for word (quotes.md). No invented stories, no unsourced numbers.

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from './threads-lint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const url = 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=w3-free-lesson#free';
export const SLOTS = { am: '08:10', noon: '12:40', pm: '20:40' };

// fear: which parent fear or need the post answers. topic: owner's bank number. course: true for the 20%.
export const posts = [
  // ---------------------------------------------------------------- Fri 27.11 (Black Friday)
  { id: 'w3-01-has-everything', date: '2026-11-27', slot: 'am', topic: 18, fear: 'подарки: ещё одна игрушка',
    text: `Black Friday question, and I mean it: what do you get a kid who already has everything?

A toy gets opened in a minute. Something they made themselves gets shown to grandma, the neighbors and the dog.

What's the one gift your kid still talks about?` },
  { id: 'w3-02-quiz-me', date: '2026-11-27', slot: 'noon', topic: 1, fear: 'ИИ сделает домашку за ребёнка', card: 'w3-quiz-me',
    text: `Homework tip for the AI age. Before your kid asks for the answer, they paste this in first:

"Don't give me the answer. Ask me questions until I figure it out."

Same app. A lot more thinking on their side of the screen.

Would yours use it or roll their eyes?` },
  { id: 'w3-03-rainy-plan', date: '2026-11-27', slot: 'pm', topic: 15, fear: 'чем занять ребёнка',
    text: `Rainy weekend plan for one bored kid and one laptop. 20 minutes total.

First 5: they pick what to make. Game, song, story, whatever.
Next 10: they describe it to AI out loud. Little kids talk, you type.
Last 5: they show it to someone who wasn't in the room.

What would yours make?` },

  // ---------------------------------------------------------------- Sat 28.11
  { id: 'w3-04-noun-or-verb', date: '2026-11-28', slot: 'am', topic: 6, fear: 'экран вместо общения',
    text: `Quick test I like. Next time your kid is on a screen, ask "what are you doing?"

If you get a noun back (a video, a show), they're watching. If you get a verb (building, drawing, writing), they're making something.

Noun or verb at your house today?` },
  { id: 'w3-05-guesser', date: '2026-11-28', slot: 'noon', topic: 12, fear: 'ИИ может навредить / врёт',
    text: `My favorite way to explain to a 7-year-old why AI makes stuff up: AI is a guesser.

It guesses which words usually come next. A guess can sound super sure and still be wrong.

So our rule is short. If it sounds too smooth, check it somewhere else.

How would your kid explain it?` },
  { id: 'w3-06-grandma-gift', date: '2026-11-28', slot: 'pm', topic: 19, fear: 'подарки: время вместе', course: true,
    text: `Grandma probably has enough scarves by now.

A song your kid wrote the words to, saved on her phone, is the thing she'll make her friends listen to.

A song from their own words is one of the lessons in our course. What would your kid's song for grandma be about?` },

  // ---------------------------------------------------------------- Sun 29.11
  { id: 'w3-07-what-for', date: '2026-11-29', slot: 'am', topic: 7, fear: 'экран вместо общения',
    text: `You can fight the screen all week. Or you can change what it's for.

When they're making something on it, even your question changes. It goes from "how long have you been on that?" to "wait, what is that?"

Which one do you say more?` },
  { id: 'w3-08-three-questions', date: '2026-11-29', slot: 'noon', topic: 3, fear: 'это небезопасно', card: 'w3-three-questions',
    text: `3 questions to ask before your kid opens ChatGPT, or any AI app really:

1. Whose account is it on?
2. Can a stranger message them in there?
3. Do they know what never goes in a chat? Full name, school, address.

If you said "not sure" to any of them, start there. Which one got you?` },
  { id: 'w3-09-one-evening', date: '2026-11-29', slot: 'pm', topic: 22, fear: 'нет времени', course: true,
    text: `Sunday night and nothing planned for the week? One evening, sorted.

Your kid builds a game in 10 to 20 minutes on a laptop or tablet, you sit next to them, then you play it against each other on the couch.

The first lesson of our course is free, no card: ${url}

Who wins at your house?` },

  // ---------------------------------------------------------------- Mon 30.11
  { id: 'w3-10-who-has-the-idea', date: '2026-11-30', slot: 'am', topic: 2, fear: 'ИИ сделает ребёнка ленивым',
    text: `Cheating with AI and building with it usually come down to one habit: who had the idea first.

Kid's idea? Then they still have to check what comes back and fix it. AI's idea? There's nothing left for the kid to do.

Who usually has it first at your house?` },
  { id: 'w3-11-explain-it', date: '2026-11-30', slot: 'noon', topic: 4, fear: 'ИИ сделает домашку за ребёнка',
    text: `AI can write your kid's homework. It can't explain it at dinner.

One question tonight: "Explain it to me without the screen."

If they can, AI helped. If they can't, AI did the homework. Want to try it tonight?` },
  { id: 'w3-12-teach-grandma', date: '2026-11-30', slot: 'pm', topic: 10, fear: 'фейки и безопасность',
    text: `Little challenge: ask your kid to teach grandma how to spot a fake photo.

Hands. Letters on signs. Shadows going the wrong way. Kids remember stuff way better when they're the one explaining, and grandma gets a bit safer online too.

Who's the fact-checker in your family?` },

  // ---------------------------------------------------------------- Tue 01.12
  { id: 'w3-13-twenty-minutes', date: '2026-12-01', slot: 'am', topic: 16, fear: 'скука и экран',
    text: `"I'm bored" and "look what I made" are usually about 20 minutes apart.

What gets them across is one question from you: "If you could make anything right now, what would it be?"

What did yours say last time?` },
  { id: 'w3-14-one-hour', date: '2026-12-01', slot: 'noon', topic: 5, fear: 'экран вместо общения', card: 'w3-one-hour',
    text: `An hour of Shorts or an hour of making?

An hour of making can be a tiny game, a song with their own words and a short cartoon. All three are things they'll come find you to show.

Which would your kid trade the Shorts for?` },
  { id: 'w3-15-four-grandmas', date: '2026-12-01', slot: 'pm', topic: 21, fear: 'подарки: время вместе', course: true,
    text: `Who in your family would actually sit down and make a cartoon with your kid?

Four grandmothers from our early-access group did it with grandkids aged 7 to 10. Cartoon, song, game. They got the course free and told us honestly how it went.

Linda's words: "I wanted to give my grandson something more meaningful than another toy."

Would your kid's grandma be up for it?` },

  // ---------------------------------------------------------------- Wed 02.12
  { id: 'w3-16-kitchen-table', date: '2026-12-02', slot: 'am', topic: 14, fear: 'школа не учит, ребёнок отстанет',
    text: `Most schools are still figuring out what to do about AI. Your kitchen table doesn't have to wait.

20 minutes, one laptop, your kid's idea, you sitting next to them. That's the whole setup.

What would you want them to make first?` },
  { id: 'w3-17-agreement', date: '2026-12-02', slot: 'noon', topic: 8, fear: 'это небезопасно', card: 'w3-agreement',
    text: `Our family AI agreement. It fits on the fridge, so save it:

1. We use AI on a parent's account.
2. We make something before we ask it anything else.
3. Name, school and address stay out of every chat.
4. If it looks too perfect, we check it.
5. We show each other what we made.

What would you add to yours?` },
  { id: 'w3-18-not-an-expert', date: '2026-12-02', slot: 'pm', topic: null, fear: 'я сам не разбираюсь',
    text: `You don't have to understand AI to sit next to your kid while they use it. Really.

Two questions do most of the work: "Why did you tell it that?" and "Is that right?" That checking habit is what they pick up from you.

What's the one thing about AI you'd want explained to you first?` },

  // ---------------------------------------------------------------- Thu 03.12
  { id: 'w3-19-lazy', date: '2026-12-03', slot: 'am', topic: null, fear: 'ИИ сделает ребёнка ленивым',
    text: `"Will AI make my kid lazy?" Depends who's doing the deciding.

If your kid picks what to make, how it should look and what to fix, the thinking is still theirs. If they hit generate and wander off, not so much.

Which one have you seen?` },
  { id: 'w3-20-dream-pet', date: '2026-12-03', slot: 'noon', topic: 13, fear: 'чем занять ребёнка',
    text: `Tonight's game: your kid draws their dream pet on paper first. Then they describe it to AI and see what comes back.

The paper one always looks more like them. The words get better every try, though.

Which version won at your house?` },
  { id: 'w3-21-paris-cartoon', date: '2026-12-03', slot: 'pm', topic: 20, fear: 'ИИ думает за ребёнка', course: true,
    text: `How many tries does a 10-year-old need for one cartoon scene? Kamilla needed two or three.

Her cartoon has a cat, a croissant and Paris. Each time she looked at what came back and told the AI what to fix. About 20 minutes for the whole thing.

That checking and fixing is in every lesson of our course. What would your kid's cartoon be about?` },
];

const LIMIT = 450;
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof|hack)\b|comment yes|follow for more|\b99%|[\u{1F300}-\u{1FAFF}]/iu;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text', 'threads-week3');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const course = posts.filter((p) => p.course).length;
  const cards = posts.filter((p) => p.card).length;
  if (posts.length !== 21) throw new Error(`${posts.length} posts, need 21`);
  if (course > 4) throw new Error(`${course} course posts, 4 at most (80/20)`);
  if (cards > 5) throw new Error(`${cards} cards, about 20% (4-5) at most`);
  posts.forEach((p, i) => {
    const n = [...p.text].length;
    const bad = lint(p.text).filter((h) => !h.includes('too long for a phone read'));
    if (n > LIMIT) bad.push(`${n} characters, limit ${LIMIT}`);
    const t = p.text.replace(url, '');
    if (BANNED.test(t)) bad.push(`banned: ${t.match(BANNED)[0]}`);
    if (/^(in our course|our course|making a cartoon is one of)/i.test(p.text)) bad.push('hook starts with the product');
    if (/our course/i.test(p.text.split('\n')[0])) bad.push('course in the first line');
    if (!/^[A-Z0-9"]/.test(p.text)) bad.push('must start with a capital letter');
    if (!/\?/.test(p.text.trim().split('\n').slice(-1)[0])) bad.push('must end on a real question');
    if (p.card && !existsSync(join(here, 'text', 'threads', `${p.card}.jpg`))) bad.push(`no card text/threads/${p.card}.jpg`);
    if (bad.length) throw new Error(`${p.id}: ${bad.join('; ')}`);
    const nn = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `${nn}-${p.id}.md`), `---\nwhen: ${p.date} ${SLOTS[p.slot]} (New York)\nfear: ${p.fear}\ncourse: ${!!p.course}\ncard: ${p.card ? `text/threads/${p.card}.mp4` : 'none (text only)'}\ncharacters: ${n}\n---\n${p.text}\n`);
    console.log(`${nn} ${p.date} ${SLOTS[p.slot]} ${p.card ? 'CARD' : 'text'} ${p.course ? 'COURSE' : '      '} ${p.id.padEnd(24)} ${String(n).padStart(3)}ch`);
  });
  console.log(`course ${course}/21, cards ${cards}/21`);
}
