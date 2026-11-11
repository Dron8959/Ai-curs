#!/usr/bin/env node
// The text lane: Threads and X. Different content from the video lane, written to be answered.
//
//   node social/concept/text.mjs        checks every post against the platform rules and writes text/NN-slug.md
//
// One idea, two native versions. They are not the same post twice:
//   X        up to 280 characters, something worth arguing with, no link in the post (it goes in the
//            first reply), no tags or one. First-hour replies are what spread it.
//   Threads  up to 500 characters, warmer, ends on a real question, one topic tag, a link may sit in
//            the text. Photos help. Negativity and "comment YES" bait are pushed down.
// Voice is Anna's (social/brand/voice.md). Facts only from social/brand/facts.md and the live landing:
// no invented anecdotes, reviews quoted word for word with the early-access note.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.makeshowlab.com/';
const link = (source, campaign, anchor = 'free') => `${SITE}?utm_source=${source}&utm_medium=social&utm_campaign=${campaign}#${anchor}`;

export const posts = [
  { id: '01-reason-to-show', kind: 'позиция', day: 'Пн',
    why: 'Главная мысль бренда про экраны. С ней спорят и соглашаются, это и нужно обеим площадкам.',
    image: 'posts/05-reason-to-show/tile.jpg',
    x: { text: `Kids don't need more screen time.

They need a reason to show you something.

A screen she makes on is not a screen she scrolls. I'd rather argue about that than about minutes.`,
      reply: `It's why every lesson we make ends with a thing to show, not a quiz. The first one is free: ${link('x', 'reason-to-show')}` },
    threads: { rubric: 'Unpopular opinion', topic: 'Parenting', text: `Unpopular opinion: the screen-time fight is the wrong fight.

Kids don't need more minutes or fewer minutes. They need a reason to show you something. A screen she makes on is not a screen she scrolls.

Plenty of parents count minutes and it works for them. So tell me honestly: what matters more in your house, how long or what for?` } },

  { id: '02-answer-machine', kind: 'вопрос', day: 'Вт',
    why: 'Вопрос с лендинга. На него легко ответить одной строкой, а ответы и двигают пост.',
    x: { text: `Answer machine or creative tool.

Same AI, same screen, same kid. A completely different evening.

Which one is it at your house right now?` },
    threads: { rubric: 'You decide', topic: 'AI for kids', text: `You decide: is this a good use of AI or not?

Kid A asks a chatbot for the answer to a homework question. Kid B tells the same chatbot about a game she made up, and builds it.

Same app, same screen. Where's the line for you, and which kid would you stop?` } },

  { id: '03-rule-one', kind: 'совет', day: 'Ср',
    why: 'Одно правило безопасности из пяти. Польза в одну строку, плюс картинка из карусели.',
    image: 'posts/03-ai-house-rules/slide-03.jpg',
    x: { text: `AI house rule #1:

The account is the parent's.

Every tool runs on your account. Your kid never signs up for anything alone. You see everything they make.

Boring rule. Fixes most of the scary stuff.`,
      reply: `The other four, and how the course is set up around them: ${link('x', 'rule-one', 'safe')}` },
    threads: { rubric: 'Unpopular opinion', topic: 'AI safety', text: `Unpopular opinion: parental controls are not an AI safety plan.

The rule that does the most in our house is boring. The account is mine, not hers. Every tool runs on the parent's account, my kid never signs up for anything alone, and I see everything she makes.

Settings get switched off. Ownership doesn't. Am I wrong? What's your one rule that actually holds?` } },

  { id: '04-kitchen-table', kind: 'за кадром', day: 'Чт',
    why: 'Кто мы и как делался курс. Доверие к автору важнее рекламы, особенно для детского продукта.',
    image: 'posts/02-meet-anna-kamilla/tile.jpg',
    x: { text: `I tested every lesson of our course on a 10-year-old at my kitchen table.

If it lost her attention, it got cut.

She's my daughter. She argues with the script.` },
    threads: { rubric: 'Unpopular opinion', topic: 'Parenting', text: `Unpopular opinion: if a kids' course can't hold a 10-year-old's attention, it doesn't matter who designed it.

I built every lesson of ours myself, then tested each one on my daughter Kamilla at the kitchen table. She's 10 and she argues with the script. What lost her got cut.

Who would you trust more to judge something made for kids: an expert or a kid?` } },

  { id: '05-will-ai-think', kind: 'позиция', day: 'Пт',
    why: 'Возражение «ИИ будет думать за ребёнка». Ответ бренда в четырёх шагах.',
    image: 'posts/08-will-ai-think/tile.jpg',
    x: { text: `"Will AI think for my kid?"

Only if the AI is the one with the ideas.

Kid decides what to make. Kid tells the AI. Kid checks what comes back. Kid fixes it.

That's not outsourcing thinking. That's directing.` },
    threads: { rubric: 'Unpopular opinion', topic: 'AI for kids', text: `Unpopular opinion: AI is not the reason a kid stops thinking.

A kid stops thinking when nobody asks what they think first. When the child decides what to make, tells the AI, checks what comes back and fixes it, the thinking stays with the child.

Don't let AI think for your child. Teach them to think with it.

Agree or not? I'd really like to hear from the parents who don't.` } },

  { id: '06-nine-in-ten', kind: 'цифра', day: 'Сб',
    why: 'Внешняя цифра с источником. На X картинка с данными работает лучше голого текста.',
    image: 'posts/03-ai-house-rules/slide-02.jpg',
    x: { text: `Almost 9 in 10 American kids aged 9 to 17 already use AI.

Almost half have never talked about safety with a parent.

(Common Sense Media, 2026)

The talk is shorter than you think. Five rules fit on a fridge.`,
      reply: `Our five, and how the course is built around them: ${link('x', 'nine-in-ten', 'safe')}` },
    threads: { rubric: 'Unpopular opinion', topic: 'AI safety', text: `Unpopular opinion: banning AI at home won't keep your kid away from it.

Almost 9 in 10 American kids aged 9 to 17 already use AI. Almost half have never talked about safety with a parent (Common Sense Media, 2026).

A ban mostly decides one thing: whether they learn it with you or without you.

If you've said no to AI at home, I'd honestly like to hear why. What would change your mind?` } },

  { id: '07-by-age', kind: 'совет', day: 'Пн',
    why: 'Снимает вопрос «а сколько мне придётся делать самому». Родители отвечают возрастом ребёнка.',
    x: { text: `How much does a parent do in an AI project? Depends on the age.

6: the kid talks, you type.
10: the kid does most of it alone.
Teen: you just need to be in the room.

Same rule at every age: the idea is theirs.` },
    threads: { rubric: 'You decide', topic: 'Parenting', text: `You decide: how young is too young for AI, if a parent is right there?

Here's how it goes in our course. A six-year-old talks and you type. A ten-year-old does most of it alone. A teenager just needs you in the room. The idea is always theirs.

I know some of you will say six is too early. Where do you draw the line, and why?` } },

  { id: '08-more-than-a-toy', kind: 'отзыв', day: 'Вт',
    why: 'Дословный отзыв бабушки. Перед праздниками это разговор о подарках, и он идёт сам.',
    image: 'posts/09-first-families/slide-07.jpg',
    x: { text: `A grandmother from our early-access group wrote:

"I wanted to give my grandson something more meaningful than another toy."

That's Linda. She got the course free and told us what happened at their table.

Best non-toy gift you ever gave a kid?` },
    threads: { rubric: 'You decide', topic: 'Gift ideas', text: `You decide: do kids want a box to open, or time with you?

Linda, a grandmother from our early-access group (she got the course free), told us:

"I wanted to give my grandson something more meaningful than another toy. MakeShowLab gave us a fun way to spend time together."

Plenty of kids would still pick the box. Honestly, which would yours pick?` } },

  { id: '09-ends-with-a-thing', kind: 'за кадром', day: 'Ср',
    why: 'Объясняет устройство урока через позицию: результат вместо теста.',
    x: { text: `Our lessons are 6 to 20 minutes on purpose.

Not a video to sit through. Minutes of making, and it ends with a thing: a game, a cartoon, a song.

A quiz tells you what a kid remembers. A thing they made tells you what they can do.` },
    threads: { rubric: 'Unpopular opinion', topic: 'AI for kids', text: `Unpopular opinion: a quiz is a weak way to check what a kid learned.

A quiz tells you what a kid remembers. A thing they made tells you what they can do. That's why our lessons are 6 to 20 minutes of making, and each one ends with a game, a cartoon or a song instead of a test.

Teachers and parents, push back on this one: what does a quiz show you that a finished thing can't?` } },

  { id: '10-is-it-cheating', kind: 'позиция', day: 'Чт',
    why: 'Самый спорный вопрос ниши. Короткий ответ бренда и приглашение не согласиться.',
    x: { text: `"Isn't AI just cheating?"

Not when your kid is the one with the idea.

The AI is the tool. The thinking stays with the child.

Disagree? Tell me where the line is for you.` },
    threads: { rubric: 'You decide', topic: 'AI for kids', text: `You decide: did she make it?

Say your 8-year-old describes a song in her own words. AI writes the music. She sings it for grandma.

Some will say the AI made it. Some will say she did. My answer: the idea and the words are hers, the AI is the tool.

Yes or no, and where exactly is the line for you?` } },

  { id: '11-free-lesson', kind: 'предложение', day: 'Пт',
    why: 'Единственный пост с прямым предложением на две недели. На X ссылка уходит в ответ, в Threads стоит в тексте.',
    image: 'posts/10-free-first-lesson/slide-01.jpg',
    x: { text: `The first lesson of our course is free.

No card. One email.

Your kid builds a playable game in 10 to 20 minutes. Then you play it against each other on the same couch.

If it isn't a fit, you've lost 20 minutes on the couch. Link below.`,
      reply: `Here it is: ${link('x', 'free-lesson')}` },
    threads: { rubric: 'Offer', topic: 'AI for kids', text: `The fastest way to decide how you feel about kids and AI is not another article. It's one evening.

The first lesson of our course is free. No card, one email. Your kid builds a playable game in 10 to 20 minutes, then you play it against each other on the same couch.

${link('threads', 'free-lesson')}

If you try it, come back and tell me: did it change your mind, or confirm it?` } },

  { id: '12-what-first', kind: 'выбор', day: 'Сб',
    why: 'Выбор из готовых вариантов: ответить проще всего. Заодно показывает, что делают на курсе.',
    image: 'posts/07-made-by-10-year-old/tile.jpg',
    x: { text: `Your kid gets 20 minutes and an AI tool. What do they make first?

A game
A cartoon
A song from their own words
A sticker pack of their own character` },
    threads: { rubric: 'You decide', topic: 'AI for kids', text: `You decide: 20 minutes tonight. Your kid makes their own game, or learns to spot a fake picture?

Both are in our course. One is pure fun. The other might matter more.

If you only had time for one this week, which would you pick for your kid?` } },
];

// One thread for X: a list that needs more than one post. On Threads the same rules go out as post 03 and 06.
export const thread = { id: 'thread-five-rules', day: 'Вс', image: 'posts/03-ai-house-rules/slide-08.jpg',
  why: 'Единственная цепочка в первой партии: список из пяти правил не помещается в один пост. Картинка со всеми пятью идёт в последнем.',
  posts: [
    `Almost 9 in 10 American kids aged 9 to 17 already use AI. Almost half have never talked about safety with a parent (Common Sense Media, 2026).

Here are the 5 house rules we set before any kid opens an AI tool. They fit on a fridge.`,
    `1. The account is the parent's.

Every tool runs on your account. Your kid never signs up for anything alone, and you see everything they make.`,
    `2. No chats with strangers.

No DMs. No comments. Nobody writing to your child.`,
    `3. Some things AI never hears.

Kids learn what never to share with an AI, and why.`,
    `4. Links get a second look.

Never click a suspicious link. And learn how to tell one.`,
    `5. If it looks too perfect, check it.

A picture, a video, a text. Any of them can be fake, and kids can learn to spot one.`,
    `All five:

1. Parent's account
2. No strangers
3. Some things stay private
4. A second look at links
5. Check the too-perfect

If this is useful, repost the first post so another parent sees it.`,
  ] };

// ------------------------------------------------------------------------------------ checks and files
const BANNED = /[—–‘’“”]|\b(unlock|unleash|empower|revolutioni[sz]e|game-changer|cutting-edge|harness|delve|future-proof)\b|comment yes|like (and|&) share|follow for more/i;
const xLen = (t) => [...t.replace(/https?:\/\/\S+/g, 'x'.repeat(23))].length;      // X counts every link as 23
const tags = (t) => t.replace(/https?:\/\/\S+/g, '').match(/#\w+/g) || [];      // an address may hold a #anchor: not a tag
function check(id, where, text, max, extra = []) {
  const bad = [];
  if (BANNED.test(text)) bad.push(`banned character or phrase: ${text.match(BANNED)[0]}`);
  const n = where.startsWith('x') ? xLen(text) : [...text].length;
  if (n > max) bad.push(`${n} characters, the limit is ${max}`);
  for (const [ok, msg] of extra) if (!ok) bad.push(msg);
  if (bad.length) throw new Error(`${id} ${where}: ${bad.join('; ')}`);
  return n;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = join(here, 'text');
  mkdirSync(out, { recursive: true });
  for (const [i, p] of posts.entries()) {
    if (p.image && !existsSync(join(here, p.image))) throw new Error(`${p.id}: no image ${p.image}`);
    const nx = check(p.id, 'x', p.x.text, 280, [[!/https?:\/\//.test(p.x.text), 'no link in the X post: it goes in the first reply'], [tags(p.x.text).length <= 1, 'one tag at most on X']]);
    const nr = p.x.reply ? check(p.id, 'x reply', p.x.reply, 280) : 0;
    const nt = check(p.id, 'threads', p.threads.text, 500, [[tags(p.threads.text).length === 0, 'Threads takes one topic tag, set in the app, not hashtags in the text'],
      [/\?/.test(p.threads.text.trim().split('\n').slice(-2).join(' ')) || /tell me/i.test(p.threads.text), 'a Threads post ends on a real question']]);
    writeFileSync(join(out, `${p.id}.md`), `---
post: ${i + 1}
lane: text (Threads and X)
kind: ${p.kind}
day: ${p.day}
image: ${p.image ? `social/concept/${p.image}` : 'none'}
x_characters: ${nx} of 280${nr ? `\nx_reply_characters: ${nr} of 280` : ''}
threads_characters: ${nt} of 500
threads_topic: ${p.threads.topic}
threads_rubric: ${p.threads.rubric || 'none'}
---
## X

${p.x.text}
${p.x.reply ? `\n### First reply (the link lives here, not in the post)\n\n${p.x.reply}\n` : ''}
## Threads

${p.threads.text}
`);
    console.log(`${p.id.padEnd(22)} x ${String(nx).padStart(3)}${nr ? ` +reply ${nr}` : ''}  threads ${nt} ${p.threads.rubric || ''}`);
  }
  const lens = thread.posts.map((t, k) => check(thread.id, `x thread ${k + 1}`, t, 280, [[!/https?:\/\//.test(t), 'no link inside the thread']]));
  writeFileSync(join(out, `${thread.id}.md`), `---
lane: text (X only)
kind: thread, ${thread.posts.length} posts
day: ${thread.day}
image: social/concept/${thread.image} (on the last post)
characters: ${lens.join(', ')}
---
${thread.posts.map((t, k) => `## ${k + 1} / ${thread.posts.length}\n\n${t}\n`).join('\n')}`);
  console.log(`${thread.id.padEnd(22)} ${lens.join(' ')}`);
}
