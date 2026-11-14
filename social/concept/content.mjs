// The first ten posts of the rebuilt @make_showlab: cover compositions (3:4 tiles), carousel slides and
// captions. Reel scenes live in reels.mjs. Copy is English, written to social/brand/voice.md and only
// uses facts from social/brand/facts.md and the verbatim reviews in social/media/landing/reviews/quotes.md.

import { A, C, M, top, card, ring, pill, tape, star, arrow, char, icon, foot } from './kit.mjs';

// ---------------------------------------------------------------- shared slide templates (cream ground)
const page = (rubric, no, i, total) => top(rubric, no, `<span class="page">${i} / ${total}</span>`);

// numbered step or rule: big number, headline, up to 25 words, a sticker icon
const step = ({ rubric, no, i, total, n, tint, title, body, ic, icTint }) => ({ theme: 'k', html: `
    ${page(rubric, no, i, total)}
    <span class="num" style="left:64px;top:214px;width:200px;height:200px;font-size:124px;background:${tint}">${n}</span>
    <h1 class="t" style="top:478px;font-size:116px">${title}</h1>
    <p class="sub" style="top:780px;font-size:54px;right:120px">${body}</p>
    <i class="badge" style="right:70px;bottom:150px;width:300px;height:300px;background:${icTint};transform:rotate(8deg)">${icon(ic, 150, '#141A33', 2.2)}</i>
    ${foot()}` });

// a list on a note card: the screenshot slide
const listCard = (items, t = 580, h = 940) => card({ l: 84, t, w: 912, h, rot: -2.5, inner: `<div style="padding:86px 56px 0;display:grid;gap:42px">${
  items.map((r, i) => `<div style="display:flex;align-items:center;gap:30px"><b style="flex:none;display:grid;place-items:center;width:88px;height:88px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 46px Sora">${i + 1}</b><span style="font:800 50px/1.08 Urbanist;color:#141A33">${r}</span></div>`).join('')}</div>` });
const magnet = (l, t) => `<i style="position:absolute;z-index:6;left:${l}px;top:${t}px;width:92px;height:92px;border-radius:50%;background:${C.mint};border:6px solid #141A33;box-shadow:6px 6px 0 #141A33"></i>`;

// one family: photo in the ring, what they made, a verbatim line
const FACE = { margaret: '50% 30%', susan: '55% 30%', linda: '50% 25%', patricia: '55% 25%', jessica: '40% 20%', amanda: '35% 35%', rachel: '60% 20%', emily: '62% 30%' };
const MADE_ICON = { cartoon: 'clapperboard', song: 'music', game: 'gamepad-2', website: 'globe', gift: 'gift' };
const family = ({ i, total, who, name, role, made, quote }) => ({ theme: 'k', html: `
    ${page('show', '04', i, total)}
    ${ring({ l: 64, t: 200, d: 380, src: `${M}/landing/reviews/${who}.jpg`, pos: FACE[who], zoom: 175 })}
    ${pill(made, 330, 480, -5, '', `background:${C.yellow}`)}
    <div style="position:absolute;z-index:8;left:68px;right:90px;top:650px">
      <p style="font:700 ${quote.length > 80 ? 60 : 72}px/1.18 Urbanist;color:#141A33">“${quote}”</p>
      <p style="margin-top:44px;font:800 52px Sora;letter-spacing:-.04em;color:#141A33">${name}</p>
      <p style="margin-top:6px;font:700 34px Urbanist;color:#4B5070">${role}</p></div>
    <i class="badge" style="right:70px;bottom:150px;width:230px;height:230px;background:${C.yellow};transform:rotate(8deg)">${icon(MADE_ICON[made], 116, '#141A33', 2.2)}</i>
    ${foot()}` });

const RULES = ['The account is yours', 'No chats with strangers', 'Some things stay out of AI', 'Links get a second look', 'Too perfect? Check it'];
const MADE = [['margaret', 'Margaret', 'cartoon'], ['susan', 'Susan', 'song'], ['linda', 'Linda', 'gift'], ['patricia', 'Patricia', 'game'], ['emily', 'Emily', 'cartoon'], ['jessica', 'Jessica', 'song'], ['amanda', 'Amanda', 'game'], ['rachel', 'Rachel', 'website']];

// ---------------------------------------------------------------- the ten posts
export const posts = [
  { id: '01-crayon-to-cartoon', n: 1, rubric: 'show', no: '01', format: 'reel', ai: true, title: 'From crayon to cartoon.',
    tile: `
    ${top('show', '01')}
    <h1 class="t">From crayon<br>to <mark>cartoon.</mark></h1>
    ${card({ l: 74, t: 600, w: 420, h: 630, rot: -6, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${tape(206, 574, -12)}
    ${card({ l: 524, t: 668, w: 466, h: 699, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    <span class="note" style="left:548px;top:500px;transform:rotate(-4deg)">one lesson later</span>
    ${arrow(120, 110, 'M14 8 C 60 18, 96 46, 100 96', 'M70 78 L101 98 L112 62', 'left:846px;top:566px')}
    ${pill('drawn by a 6-year-old', 66, 1284, -4)}
    ${star(84, '#fff', 'left:946px;top:1290px')}${star(40, '#fff', 'left:900px;top:1262px')}`,
    caption: `Send this to the parent whose fridge is covered in drawings.

A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

In our AI course for kids, the kid has the idea and makes the drawing. The AI follows it, down to the truck on top. You're side by side the whole time.

#aiforkids #kidsart #kidsdrawing #creativekids #familyactivities` },

  { id: '02-meet-anna-kamilla', n: 2, rubric: 'make', no: '01', format: 'reel', ai: true, title: 'Meet Anna & Kamilla.',
    tile: `
    ${top('make', '01')}
    <h1 class="t">Meet Anna<br>&amp; <mark>Kamilla.</mark></h1>
    <p class="sub" style="top:468px">A mom and a daughter.<br>Not a corporation.</p>
    ${ring({ l: 52, t: 650, d: 590, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250 })}
    ${ring({ l: 548, t: 902, d: 478, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5 })}
    ${pill('Anna, mom', 96, 1190, -6, '', `background:${C.coral}`)}
    ${pill('Kamilla, 10', 700, 1326, 4, '', `background:${C.mint}`)}
    ${star(80, C.yellow, 'left:900px;top:700px')}${star(40, C.yellow, 'left:850px;top:660px')}${star(34, C.yellow, 'left:980px;top:800px')}`,
    caption: `The first lesson is free. It's in our bio.

We're Anna and Kamilla, a mom and her daughter. Not a corporation.

I built every lesson of this AI course for kids myself. Then I tested each one on Kamilla at our kitchen table. She's 10. What lost her attention got cut.

In the course she goes first. She shows the finished thing, then your kid makes their own.

#aiforkids #momanddaughter #kidsandai #familyactivities` },

  { id: '03-ai-house-rules', n: 3, rubric: 'lab', no: '01', format: 'carousel', ai: false, title: '5 AI house rules.',
    alt: 'Coral cover that reads "5 AI house rules" above a note card pinned with a magnet. The card lists the first rules: the account is yours, no chats with strangers, some things AI never hears.',
    slides: [
      { theme: 'c', html: `
    ${top('lab', '01')}
    <h1 class="t">5 AI<br><mark>house rules.</mark></h1>
    <p class="kick" style="top:470px;right:300px">Set these before your kid opens any AI tool.</p>
    <span class="note" style="left:560px;top:640px;transform:rotate(-4deg);font-size:60px">save it for the fridge</span>
    ${arrow(110, 90, 'M100 8 C 72 14, 40 30, 16 72', 'M8 36 L14 76 L50 60', 'left:446px;top:668px')}
    ${listCard(RULES, 800, 900)}${magnet(492, 762)}` },
      { theme: 'k', html: `
    ${page('lab', '01', 2, 9)}
    <h1 class="t" style="top:230px;font-size:128px">Almost 9 in 10<br>kids already<br><mark>use AI.</mark></h1>
    <p class="sub" style="top:650px;font-size:56px;right:90px">American kids aged 9 to 17. Almost half have never talked about safety with a parent.</p>
    <p class="fine" style="top:960px;right:600px">Common Sense Media, AI Census of tweens and teens, 2026</p>
    ${char('kamilla', 540, 900, 600)}
    ${foot(false)}` },
      step({ rubric: 'lab', no: '01', i: 3, total: 9, n: 1, tint: C.coral, title: 'The account<br>is <mark>yours.</mark>', body: 'Every tool runs on the parent’s account. Your kid never signs up alone.', ic: 'user-round-check', icTint: C.mint }),
      step({ rubric: 'lab', no: '01', i: 4, total: 9, n: 2, tint: C.coral, title: 'No chats with<br><mark>strangers.</mark>', body: 'The course has no DMs and no comments, so no stranger can reach your kid there.', ic: 'message-circle-off', icTint: C.yellow }),
      step({ rubric: 'lab', no: '01', i: 5, total: 9, n: 3, tint: C.coral, title: 'Some things<br>stay <mark>out of AI.</mark>', body: 'Kids learn what never to share with an AI, and why.', ic: 'lock', icTint: C.mint }),
      step({ rubric: 'lab', no: '01', i: 6, total: 9, n: 4, tint: C.coral, title: 'Links get a<br><mark>second look.</mark>', body: 'Never click a suspicious link. Kids learn how to tell one.', ic: 'link', icTint: C.yellow }),
      step({ rubric: 'lab', no: '01', i: 7, total: 9, n: 5, tint: C.coral, title: 'Too perfect?<br><mark>Check it.</mark>', body: 'A picture, a video, a text. Any of them can be fake.', ic: 'eye', icTint: C.mint }),
      { theme: 'c', html: `
    ${page('lab', '01', 8, 9)}
    <h1 class="t" style="font-size:124px">All <mark>five.</mark></h1>
    <span class="note" style="left:520px;top:226px;transform:rotate(-4deg)">screenshot this</span>
    ${listCard(RULES, 420, 860)}${magnet(492, 382)}
    ${foot()}` },
      { theme: 'c', html: `
    ${page('lab', '01', 9, 9)}
    <h1 class="t" style="top:230px;font-size:124px">Drop it in your<br>parents’ <mark>group chat.</mark></h1>
    <p class="sub" style="top:650px;font-size:52px;color:#141A33;right:120px">This is how every lesson in Make Show Lab is set up.</p>
    ${char('anna', 500, 800, 640)}
    ${foot(false)}` },
    ],
    caption: `Five rules we set before any kid touches an AI tool.

1. The account is the parent's.
2. No chats with strangers.
3. Some things stay out of AI, and the kid knows which.
4. Links get a second look.
5. If it looks too perfect, check it.

Almost 9 in 10 American kids aged 9 to 17 already use AI, and almost half have never talked about safety with a parent (Common Sense Media, 2026). Every lesson of our AI course for kids is set up this way.

Drop it in your parents' group chat.

#aisafety #kidsandai #aiforkids #parentingtips #onlinesafety` },

  { id: '04-idea-to-game', n: 4, rubric: 'show', no: '02', format: 'reel', ai: true, title: 'Idea at 7:02. Game by 7:41.',
    tile: `
    ${top('show', '02')}
    <h1 class="t" style="font-size:118px">Idea at 7:02.<br>Game by <mark>7:41.</mark></h1>
    ${card({ l: 60, t: 478, w: 950, h: 568, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    ${card({ l: 548, t: 1010, w: 470, h: 330, rot: 5, src: `${M}/landing/together-game.jpg`, z: 5 })}
    ${tape(700, 986, 6)}
    ${pill('made by Kamilla, 10', 66, 1104, -4)}
    <span class="note" style="left:78px;top:1262px;transform:rotate(-3deg);font-size:60px">39 minutes later</span>
    ${arrow(90, 60, 'M6 36 C 28 12, 54 10, 80 28', 'M56 6 L82 30 L50 46', 'left:436px;top:1262px')}`,
    caption: `Your kid can do this tonight. The first lesson is free, link in bio.

Kamilla, 10, had the idea at 7:02 pm: a park, a girl and her corgi. By 7:41 we were playing her game against each other at the same table.

She decided, told the AI, checked what came back and fixed it. No code. That's one lesson of our AI course for kids.

#aiforkids #kidsgames #kidsandai #familygamenight` },

  { id: '05-reason-to-show', n: 5, rubric: 'lab', no: '02', format: 'reel', ai: true, title: 'A reason to show you.',
    tile: `
    ${top('lab', '02')}
    <p class="kick" style="top:182px">Not more screen time.</p>
    <h1 class="t" style="top:248px;font-size:130px">A reason to<br><mark>show you.</mark></h1>
    ${card({ l: 92, t: 620, w: 896, h: 750, rot: 2.5, src: `${M}/landing/step-show.jpg`, pos: '82% 30%' })}
    ${tape(450, 594, -5)}
    <span class="note" style="left:70px;top:516px;transform:rotate(-3deg);font-size:60px">the “look what I made” face</span>
    ${arrow(100, 120, 'M20 6 C 6 50, 30 86, 76 104', 'M44 110 L80 106 L66 72', 'left:760px;top:540px')}`,
    caption: `Send this to the person you argue about screen time with.

Kids don't need more screen time. They need a reason to show you something.

In our course every lesson ends with something your kid made to show you: a game, a cartoon, a song.

#screentime #parentingtips #aiforkids #kidsandai` },

  { id: '06-watch-make-show', n: 6, rubric: 'make', no: '02', format: 'reel', ai: true, title: 'Watch. Make. Show.',
    tile: `
    ${top('make', '02')}
    <h1 class="t">Watch.<br><span style="color:${C.yellow}">Make.</span><br><span style="color:${C.coral}">Show.</span></h1>
    <p class="sub" style="top:598px">One lesson. 6 to 20 minutes.</p>
    ${card({ l: 56, t: 720, w: 440, h: 330, rot: -4, src: `${M}/landing/step-watch.jpg` })}
    ${card({ l: 322, t: 900, w: 440, h: 330, rot: 3, src: `${M}/landing/step-make.jpg`, z: 4 })}
    ${card({ l: 590, t: 1066, w: 440, h: 330, rot: -3, src: `${M}/landing/step-show.jpg`, pos: '70% 30%', z: 5 })}
    ${[[30, 690], [300, 874], [566, 1040]].map(([l, t], i) => `<span class="num" style="left:${l}px;top:${t}px;width:98px;height:98px;z-index:8;box-shadow:6px 6px 0 #070A1F">${i + 1}</span>`).join('')}
    ${star(70, C.yellow, 'left:920px;top:760px')}${star(36, C.yellow, 'left:870px;top:720px')}`,
    caption: `Save this for the night you try lesson one.

One lesson of our AI course for kids takes 6 to 20 minutes and has three steps. Watch: Kamilla shows the finished thing first. Make: your kid builds their own and you stay right there. Show: play it, show the family, send it to grandma.

#aiforkids #kidsandai #familyactivities #homeschoolideas` },

  { id: '07-made-by-10-year-old', n: 7, rubric: 'show', no: '03', format: 'reel', ai: true, title: 'Made by a 10-year-old.',
    tile: `
    ${top('show', '03')}
    <h1 class="t" style="font-size:122px">Made by a<br><mark>10-year-old.</mark></h1>
    ${pill('no code', 770, 196, 7, 'dark')}
    ${card({ l: 56, t: 520, w: 390, h: 540, rot: -5, src: `${M}/landing/cartoon-friends.jpg`, pos: '50% 30%' })}
    ${card({ l: 410, t: 560, w: 610, h: 380, rot: 3, src: `${M}/landing/game.jpg`, cls: 'screen', z: 4 })}
    ${card({ l: 110, t: 1020, w: 320, h: 340, rot: 5, src: `${M}/landing/cartoon-cat.jpg`, pos: '50% 38%', z: 5 })}
    ${card({ l: 470, t: 1004, w: 540, h: 350, rot: -3, src: `${M}/landing/step-show.jpg`, pos: '58% 80.1%', zoom: 330, z: 5 })}
    ${pill('cartoon', 40, 1010, -6, '', 'height:58px;font-size:26px;padding:0 22px')}
    ${pill('game', 850, 520, 5, '', 'height:58px;font-size:26px;padding:0 22px')}
    ${pill('stickers', 850, 972, 4, '', 'height:58px;font-size:26px;padding:0 22px')}`,
    caption: `The first lesson is free. Link in bio.

Everything in this video was made by Kamilla. She's 10. A cartoon with her own characters, a game of her own and a sticker pack of her character. No code.

That's the kind of thing kids make in our course, with a parent right there.

#aiforkids #kidscartoon #kidsgames #creativekids` },

  { id: '08-will-ai-think', n: 8, rubric: 'lab', no: '03', format: 'reel', ai: true, title: 'Will AI think for my kid?',
    tile: `
    ${top('lab', '03')}
    <h1 class="t" style="font-size:124px">Will AI think<br>for <mark>my kid?</mark></h1>
    ${char('kamilla', -50, 752, 660)}
    ${['She decides', 'She tells the AI', 'She checks it', 'She fixes it'].map((s, i) =>
      pill(`<b>${i + 1}</b>${s}`, i % 2 ? 560 : 500, 506 + i * 150, [-3, 2, -2, 3][i], 'step')).join('')}
    <span class="note" style="left:618px;top:1150px;transform:rotate(-3deg);font-size:60px">the thinking</span>
    <span class="note" style="left:618px;top:1214px;transform:rotate(-3deg);font-size:60px">stays with her</span>
    ${arrow(110, 80, 'M104 10 C 76 50, 46 62, 10 58', 'M36 34 L8 58 L40 76', 'left:640px;top:1290px')}`,
    caption: `Know a parent who thinks AI makes kids lazy? Send them this.

Will AI think for my kid? Only if the AI is the one with the ideas.

In every lesson of our course the child decides what to make, tells the AI, checks what comes back and fixes it.

#kidsandai #aiforkids #parentingtips #criticalthinking` },

  { id: '09-first-families', n: 9, rubric: 'show', no: '04', format: 'carousel', ai: false, title: '8 families tried it first.',
    alt: 'Yellow cover that reads "8 families tried it first" with a quote from Emily, mom of a 9-year-old, and small round photos of the other families.',
    slides: [
      { theme: 'y', html: `
    ${top('show', '04')}
    <h1 class="t" style="font-size:120px">8 families<br>tried it <mark>first.</mark></h1>
    ${card({ l: 60, t: 520, w: 960, h: 520, rot: -1.5, inner: `<div style="padding:70px 62px 0">
      <p style="font:700 52px/1.22 Urbanist;color:#141A33">“We made our own little cartoon together, and he was so excited to show it to his dad.”</p>
      <p style="margin-top:34px;font:800 30px Urbanist;letter-spacing:.08em;text-transform:uppercase;color:#4B5070">Emily, mom of a 9-year-old</p></div>` })}
    ${ring({ l: 800, t: 930, d: 200, src: `${M}/landing/reviews/emily.jpg`, pos: FACE.emily, zoom: 190, z: 6, pad: 12 })}
    ${['margaret', 'susan', 'linda', 'patricia', 'jessica', 'amanda', 'rachel'].map((n, i) =>
      ring({ l: 56 + i * 114, t: 1128, d: 168, src: `${M}/landing/reviews/${n}.jpg`, pos: FACE[n], zoom: 170, z: 5 + i, pad: 9 })).join('')}
    <p class="fine" style="top:1336px">Early-access families. They got the course free<br>and told us what happened at their table.</p>` },
      { theme: 'k', html: `
    ${page('show', '04', 2, 9)}
    <h1 class="t" style="top:230px;font-size:128px">They got<br>it <mark>free.</mark></h1>
    <p class="sub" style="top:540px;font-size:56px;right:90px">Eight families tried the course before launch. We asked them to tell us what really happened.</p>
    ${MADE.slice(0, 4).map(([w], i) => ring({ l: 64 + i * 150, t: 900, d: 210, src: `${M}/landing/reviews/${w}.jpg`, pos: FACE[w], zoom: 170, z: 5 + i, pad: 11 })).join('')}
    ${MADE.slice(4).map(([w], i) => ring({ l: 140 + i * 150, t: 1080, d: 210, src: `${M}/landing/reviews/${w}.jpg`, pos: FACE[w], zoom: w === 'emily' ? 190 : 170, z: 9 + i, pad: 11 })).join('')}
    ${foot()}` },
      family({ i: 3, total: 9, who: 'margaret', name: 'Margaret', role: 'grandmother of a 9-year-old', made: 'cartoon', quote: 'We made a little cartoon together, and he was so proud of it.' }),
      family({ i: 4, total: 9, who: 'jessica', name: 'Jessica', role: 'mom of an 8-year-old', made: 'song', quote: 'The lessons are short enough to keep my daughter interested, and I love that we actually make something at the end.' }),
      family({ i: 5, total: 9, who: 'amanda', name: 'Amanda', role: 'mom of a 10-year-old', made: 'game', quote: 'She created a little game and was so proud of herself.' }),
      family({ i: 6, total: 9, who: 'rachel', name: 'Rachel', role: 'mom of a 7-year-old', made: 'website', quote: 'We made a little website together, and he keeps asking when we can do the next lesson!' }),
      family({ i: 7, total: 9, who: 'linda', name: 'Linda', role: 'grandmother of a 10-year-old', made: 'gift', quote: 'I was honestly surprised by how much we could create without knowing anything about AI.' }),
      { theme: 'y', html: `
    ${page('show', '04', 8, 9)}
    <h1 class="t" style="font-size:112px">What they <mark>made.</mark></h1>
    ${card({ l: 64, t: 360, w: 952, h: 900, rot: -1, inner: `<div style="padding:50px 54px;display:grid;grid-template-columns:1fr 1fr;gap:34px 40px">${
      MADE.map(([w, name, made]) => `<div style="display:flex;align-items:center;gap:22px">
        <i style="flex:none;width:112px;height:112px;border-radius:50%;border:5px solid #141A33;background:url(${A(`${M}/landing/reviews/${w}.jpg`)}) ${FACE[w]}/${w === 'emily' ? 190 : 170}% auto no-repeat #C9A27A"></i>
        <span style="font:800 44px/1.05 Sora;letter-spacing:-.04em;color:#141A33">${name}<br><span style="font:700 34px Urbanist;letter-spacing:0;color:#4B5070">${made}</span></span></div>`).join('')}</div>` })}
    ${foot()}` },
      { theme: 'y', html: `
    ${page('show', '04', 9, 9)}
    <h1 class="t" style="top:230px;font-size:128px">Try the first<br>lesson <mark>free.</mark></h1>
    <span class="btn" style="left:64px;top:560px;transform:rotate(-2deg)">Link in bio ${icon('arrow-right', 58, '#FFF4DC', 3)}</span>
    <p class="fine" style="top:770px;font-size:34px;right:520px">They received the course free and shared honest feedback. Names and photos are used with their permission.</p>
    ${char('kamilla', 500, 830, 600)}
    ${foot(false)}` },
    ],
    caption: `Eight families got our course before anyone else. They paid nothing.

We asked them to tell us what really happened at their table. Four grandmothers and four moms, kids from 7 to 10. They made cartoons, songs, games and a website.

They received the course free and shared honest feedback. Names and photos are used with their permission.

The first lesson of our AI course for kids is free too. Link in bio.

#aiforkids #kidsandai #grandparents #familyactivities` },

  { id: '10-free-first-lesson', n: 10, rubric: 'start', no: '', format: 'carousel', ai: true, title: 'Free first lesson.',
    alt: 'Mint cover that reads "Free first lesson. Your kid builds a game tonight" over a pixel-art game made by a 10-year-old, with a button that says "Build it tonight".',
    slides: [
      { theme: 'm', html: `
    ${top('start')}
    <h1 class="t"><mark>Free</mark> first<br>lesson.</h1>
    <p class="kick" style="top:462px">Your kid builds a game tonight.</p>
    ${card({ l: 86, t: 580, w: 908, h: 544, rot: 2, src: `${M}/landing/game.jpg`, cls: 'screen' })}
    <span class="btn" style="left:96px;top:1090px;transform:rotate(-3deg)">Build it tonight ${icon('arrow-right', 58, '#FFF4DC', 3)}</span>
    ${pill('10-20 min', 760, 1150, 6)}
    ${pill('no card, just email', 104, 1290, -2)}
    ${star(80, '#fff', 'left:900px;top:1270px')}${star(38, '#fff', 'left:850px;top:1240px')}${star(46, '#fff', 'left:960px;top:1210px')}` },
      { theme: 'k', html: `
    ${page('start', '', 2, 7)}
    <h1 class="t" style="top:230px;font-size:128px">Worst case:<br><mark>20 minutes</mark><br>on the couch.</h1>
    <p class="sub" style="top:660px;font-size:56px;right:90px">If it isn’t a fit for your family, that is all you lose.</p>
    ${char('anna', 500, 880, 620)}
    ${foot(false)}` },
      step({ rubric: 'start', no: '', i: 3, total: 7, n: 1, tint: C.mint, title: 'Leave your<br><mark>email.</mark>', body: 'No card. A laptop or a tablet. Nothing to install.', ic: 'gift', icTint: C.yellow }),
      step({ rubric: 'start', no: '', i: 4, total: 7, n: 2, tint: C.mint, title: 'Your kid builds<br><mark>a game.</mark>', body: '10 to 20 minutes. You sit next to them. They do the making.', ic: 'star', icTint: C.coral }),
      step({ rubric: 'start', no: '', i: 5, total: 7, n: 3, tint: C.mint, title: 'Play it<br><mark>together.</mark>', body: 'Against each other, on the same couch. Then decide if you want the rest.', ic: 'heart', icTint: C.yellow }),
      { theme: 'm', html: `
    ${page('start', '', 6, 7)}
    <h1 class="t" style="font-size:112px">Tonight, in<br><mark>three steps.</mark></h1>
    ${listCard(['Leave your email', 'Your kid builds a game', 'Play it together'], 560, 520)}${magnet(492, 522)}
    ${pill('10-20 min', 120, 1160, -4)}${pill('no card', 480, 1190, 5)}
    ${foot()}` },
      { theme: 'm', html: `
    ${page('start', '', 7, 7)}
    <h1 class="t" style="top:230px;font-size:128px">Free first<br>lesson.<br><mark>Link in bio.</mark></h1>
    ${char('kamilla', 420, 800, 640)}
    ${star(80, '#fff', 'left:120px;top:900px')}${star(40, '#fff', 'left:230px;top:860px')}
    ${foot(false)}` },
    ],
    caption: `Your kid can build a game tonight. The first lesson is free.

1. Leave your email. No card.
2. Your kid builds a game in 10 to 20 minutes. You sit next to them.
3. You play it together, on the same couch.

If it isn't a fit for your family, you've lost nothing but 20 minutes. It's the first lesson of our AI course for kids 6 to 14, on a laptop or a tablet, with nothing to install.

Link in bio.

#aiforkids #kidsgames #kidsandai #familyactivities` },
];

export const byId = (id) => posts.find((p) => p.id === id || p.id.startsWith(id));
