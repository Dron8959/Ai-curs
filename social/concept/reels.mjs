// Reel scenes for the first ten posts. 1080×1920, 30 fps.
//
// Picture rules: each scene is one beat of the story (about 4 s at most), the hook card is on screen at
// frame 1, on-screen lines stay at six words or fewer and inside x 64–850, y 250–1440 so the Instagram
// interface never covers them. The closing card echoes one word of the hook so the loop lands clean.
//
// Sound rules: the reels are cut to the music (kit.mjs: BPM). A scene lasts `beats` beats. Entrances that
// make a sound are placed with on(type, beat), so the eye reads them exactly on a beat. In every reel the
// main reveal and the logo both fall on a bar line (a multiple of four beats from the start): the music's
// big section enters on the first and its last chord lands on the second. `reveal` marks that entrance,
// `swish: true` marks the two transitions per reel that get an air sound; the other cuts stay silent.

import { C, M, B, an, on, card, ring, pill, tape, star, char, icon, plate, endScene } from './kit.mjs';

const h1 = (html, { top = 470, size = 112, a = an('words', 0.15), style = '' } = {}) =>
  `<h1 class="t"${a} style="top:${top}px;font-size:${size}px;${style}">${html}</h1>`;
const sub = (html, top, a = an('rise', 0.9), size = 46) => `<p class="sub"${a} style="top:${top}px;font-size:${size}px">${html}</p>`;
const num = (n, l, t, a, size = 120, bg = C.yellow) =>
  `<span class="num"${a} style="left:${l}px;top:${t}px;width:${size}px;height:${size}px;font-size:${Math.round(size * 0.58)}px;background:${bg}">${n}</span>`;
const row = (label, text, l, t, rot, a) =>
  `<div class="card row"${a} style="left:${l}px;top:${t}px;width:760px;height:150px;transform:rotate(${rot}deg)"><b>${label}</b><span>${text}</span></div>`;
const at = (beat) => +(beat * B).toFixed(4);                       // a beat of the scene in seconds, for silent entrances
const quiet = (type, beat) => an(type, at(beat), 'none');           // decoration: on the beat, but it makes no sound
const reveal = (a) => `${a} data-reveal`;
// a phone that scrolls a feed: the "screen she scrolls"
const phone = (l, t, w, h, rot, a = '') => `<div class="card"${a} style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);border-radius:46px;background:#FFF4DC;border-width:8px">
  <div data-in="scroll" style="padding:26px 22px;display:grid;gap:16px">${[C.coral, C.mint, C.yellow, '#C9CCE0', C.coral, C.yellow, C.mint, '#C9CCE0'].map((c) =>
    `<i style="display:block;height:128px;border-radius:18px;background:${c}"></i><i style="display:block;height:15px;width:72%;border-radius:8px;background:#141A33;opacity:.28"></i><i style="display:block;height:15px;width:46%;border-radius:8px;background:#141A33;opacity:.18"></i>`).join('')}</div></div>`;
// one step of a lesson: the cut comes two beats before a bar line and the photo lands on it
const photoStep = (theme, n, word, line, src, { pos = 'center', beats = 8, wipe, swish, first = false } = {}) => ({ theme, beats, wipe, swish, html: `${plate()}
    ${num(n, 64, 470, on('pop', 0.5))}
    ${h1(word, { top: 612, size: 150, a: an('words', 0.3) })}
    ${card({ l: 64, t: 930, w: 740, h: 490, rot: -2, src, pos, a: first ? reveal(on('slap', 2)) : on('slap', 2), kb: true })}
    ${sub(line, 780, an('rise', at(2.75)))}` });

export const reels = {
  // 30 beats, 13.8 s. Reveal on beat 8 (the cartoon lands), logo on beat 24.
  '01-crayon-to-cartoon': [
    { theme: 'y', beats: 6, html: `${plate()}
    ${h1('A 6-year-old<br>drew <mark>this.</mark>', { size: 106, a: an('settle', 0) })}
    ${card({ l: 150, t: 760, w: 440, h: 660, rot: -4, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper', a: on('slap', 1) })}
    ${tape(290, 736, -10, '', quiet('pop', 2))}
    ${star(90, '#fff', 'left:660px;top:820px', quiet('pop', 2.5))}${star(44, '#fff', 'left:740px;top:770px', quiet('pop', 2.75))}` },
    { theme: 'y', beats: 8, wipe: '600,1100', swish: true, html: `${plate()}
    ${h1('One lesson<br><mark>later.</mark>')}
    ${card({ l: 64, t: 800, w: 330, h: 495, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 380, t: 740, w: 470, h: 705, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4, a: reveal(on('slap', 2)), kb: true })}
    ${star(90, '#fff', 'left:770px;top:680px', quiet('pop', 3))}${star(44, '#fff', 'left:720px;top:640px', quiet('pop', 3.25))}
    ${pill('AI followed the drawing', 80, 1340, -3, '', '', on('pop', 5))}` },
    { theme: 'n', beats: 9, wipe: '200,800', html: `${plate()}
    ${h1('Who did<br><mark>what.</mark>', { size: 120 })}
    ${row('Kid:', 'the idea, the drawing', 64, 760, -2, on('slide', 2))}
    ${row('AI:', 'follows the drawing', 84, 940, 1.5, on('slide', 4))}
    ${row('You:', 'right next to them', 64, 1120, -1, on('slide', 6))}` },
    endScene('What will<br>yours <mark>draw?</mark>'),
  ],

  // 42 beats, 19.4 s. Anna on beat 12 (the reveal), Kamilla on 20, the kitchen table on 28, logo on 36.
  '02-meet-anna-kamilla': [
    { theme: 'n', beats: 6, html: `${plate()}
    ${h1('A mom and<br>a <mark>daughter.</mark>', { a: an('settle', 0) })}
    ${ring({ l: 64, t: 760, d: 440, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250, a: on('pop', 1) })}
    ${ring({ l: 430, t: 920, d: 400, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5, a: on('pop', 2) })}
    ${pill('Anna, mom', 80, 1210, -5, '', `background:${C.coral}`, on('pop', 3))}
    ${pill('Kamilla, 10', 520, 1340, 4, '', `background:${C.mint}`, on('pop', 3.5))}` },
    { theme: 'n', beats: 5, wipe: '500,700', html: `${plate()}
    ${h1('Not a<br><mark>corporation.</mark>', { top: 560, size: 104 })}
    ${star(110, C.yellow, 'left:620px;top:900px', quiet('pop', 2))}${star(50, C.yellow, 'left:560px;top:860px', quiet('pop', 2.25))}${star(40, C.yellow, 'left:740px;top:1010px', quiet('pop', 2.5))}` },
    { theme: 'k', beats: 8, wipe: '300,700', swish: true, html: `${plate()}
    ${ring({ l: 64, t: 470, d: 520, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250, a: reveal(on('pop', 1)) })}
    ${h1('Anna built<br>every <mark>lesson.</mark>', { top: 1040, size: 104, a: an('words', at(1.5)) })}
    ${sub('She checks homework the same day.', 1270, an('rise', at(4)))}` },
    { theme: 'k', beats: 7, wipe: '600,700', html: `${plate()}
    ${ring({ l: 300, t: 470, d: 520, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, a: on('pop', 1) })}
    ${h1('Kamilla, 10,<br>goes <mark>first.</mark>', { top: 1040, size: 104, a: an('words', at(1.5)) })}
    ${sub('Then your kid makes their own.', 1270, an('rise', at(4)))}` },
    { theme: 'n', beats: 9, wipe: '450,1000', html: `${plate()}
    ${h1('Tested at our<br><mark>kitchen table.</mark>', { size: 92 })}
    ${card({ l: 64, t: 740, w: 780, h: 536, rot: -2, src: `${M}/landing/together-game.jpg`, a: on('slap', 2), kb: true })}
    ${sub('What lost her attention got cut.', 1320, an('rise', at(4.5)))}` },
    endScene('A mom, a daughter,<br><mark>and you.</mark>'),
  ],

  // 38 beats, 17.5 s. Reveal on beat 8 (the game lands), logo on beat 32.
  '04-idea-to-game': [
    { theme: 'y', beats: 6, html: `${plate()}
    ${pill('7:02 pm', 64, 470, -3, 'time', '', on('pop', 0.5))}
    ${h1('Her <mark>idea.</mark>', { top: 670, size: 150, a: an('settle', 0) })}
    <span class="note"${an('write', at(2.5))} style="left:70px;top:880px;transform:rotate(-3deg);font-size:64px">a park, a girl, her corgi</span>
    ${char('kamilla', 250, 1010, 560, '', on('slap', 1.5))}` },
    { theme: 'y', beats: 8, wipe: '300,560', swish: true, html: `${plate()}
    ${pill('7:41 pm', 64, 470, -3, 'time', '', on('pop', 0.5))}
    ${h1('<mark>Playing</mark> it.', { top: 670, size: 150, a: an('words', 0.35) })}
    ${card({ l: 64, t: 900, w: 786, h: 477, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen', a: reveal(on('slap', 2)), kb: true })}
    ${pill('made by Kamilla, 10', 90, 1330, -3, '', '', on('pop', 5))}` },
    { theme: 'k', beats: 8, wipe: '450,750', html: `${plate()}
    ${card({ l: 64, t: 470, w: 786, h: 540, rot: 2, src: `${M}/landing/together-game.jpg`, a: on('slap', 2), kb: true })}
    ${h1('Against each other.<br><mark>Same table.</mark>', { top: 1090, size: 72, a: an('words', at(2.5)) })}` },
    { theme: 'n', beats: 9, wipe: '300,600', html: `${plate()}
    ${['She decided.', 'She told the AI.', 'She checked.', '<mark>She fixed.</mark>'].map((l, i) => h1(l, { top: 470 + i * 104, size: 84, a: an('rise', at(1 + i)) })).join('')}
    ${sub('The thinking stayed with her.', 930, an('rise', at(5.5)), 50)}
    ${char('kamilla', 230, 1040, 500, '', on('slap', 2))}` },
    endScene('Your kid’s <mark>idea.</mark><br>Tonight?'),
  ],

  // 34 beats, 15.7 s. Reveal on beat 12 (her photo lands), logo on beat 28.
  '05-reason-to-show': [
    { theme: 'c', beats: 8, html: `${plate()}
    ${h1('Kids don’t<br>need more<br><mark>screen time.</mark>', { top: 520, size: 104, a: an('settle', 0) })}
    ${phone(520, 900, 260, 500, 6, on('slap', 2))}` },
    { theme: 'c', beats: 10, wipe: '300,700', swish: true, html: `${plate()}
    ${h1('They need a<br>reason to<br><mark>show you</mark><br>something.', { size: 96 })}
    ${card({ l: 110, t: 880, w: 700, h: 560, rot: 2.5, src: `${M}/landing/step-show.jpg`, pos: '82% 30%', a: reveal(on('slap', 4)), kb: true })}
    ${pill('the “look what I made” face', 80, 1350, -3, '', 'text-transform:none;letter-spacing:0;font-size:34px', on('pop', 7))}` },
    { theme: 'k', beats: 9, wipe: '500,900', html: `${plate()}
    ${h1('A screen she<br><mark>makes on</mark><br>is not a screen<br>she scrolls.', { top: 500, size: 92 })}
    ${card({ l: 64, t: 960, w: 470, h: 300, rot: -3, src: `${M}/landing/game.jpg`, cls: 'screen', a: on('pop', 3) })}
    ${pill('makes', 90, 1230, -5, '', `background:${C.mint}`, on('pop', 4))}
    ${phone(590, 930, 230, 400, 5, on('pop', 5))}
    ${pill('scrolls', 600, 1300, 4, '', `background:${C.coral}`, on('pop', 6))}` },
    endScene('Make the screen<br><mark>worth it.</mark>'),
  ],

  // 38 beats, 17.5 s. The three photos land on beats 8, 16 and 24, logo on beat 32.
  '06-watch-make-show': [
    { theme: 'n', beats: 6, html: `${plate()}
    ${h1('One lesson.<br><mark>Three steps.</mark>', { top: 540, size: 100, a: an('settle', 0) })}
    ${sub('6 to 20 minutes.', 780, an('rise', 0.5), 56)}
    ${[1, 2, 3].map((n, i) => num(n, 64 + i * 170, 940, on('pop', 2 + i), 140, [C.cream, C.yellow, C.coral][i])).join('')}` },
    photoStep('n', 1, 'Watch.', 'Kamilla shows the finished thing.', `${M}/landing/step-watch.jpg`, { swish: true, first: true }),
    photoStep('y', 2, 'Make.', 'Your kid builds it.<br>You sit next to them.', `${M}/landing/step-make.jpg`, { wipe: '500,700' }),
    photoStep('c', 3, 'Show.', 'Play it. Send it to grandma.', `${M}/landing/step-show.jpg`, { pos: '70% 30%', wipe: '300,700', beats: 9 }),
    endScene('One <mark>lesson.</mark><br>One real thing.'),
  ],

  // 38 beats, 17.5 s. Her cartoon, her game and her stickers land on beats 8, 16 and 24, logo on beat 32.
  '07-made-by-10-year-old': [
    { theme: 'y', beats: 6, html: `${plate()}
    ${h1('Made by a<br><mark>10-year-old.</mark>', { top: 500, size: 104, a: an('settle', 0) })}
    ${pill('no code', 480, 770, 6, 'dark', '', on('pop', 2.5))}
    ${char('kamilla', 130, 880, 620, '', on('slap', 1))}` },
    { theme: 'k', beats: 8, wipe: '400,1000', swish: true, html: `${plate()}
    ${h1('Her story.<br>Her <mark>characters.</mark>', { size: 86 })}
    ${card({ l: 200, t: 700, w: 420, h: 732, rot: -2, a: reveal(on('slap', 2)), inner: `<video data-clip data-src="${M}/landing/cartoon.mp4" data-from="6" data-at="${at(1.5)}" muted playsinline preload="auto"></video>` })}
    ${pill('cartoon', 560, 760, 6, '', `background:${C.yellow}`, on('pop', 4))}` },
    { theme: 'y', beats: 8, wipe: '450,1000', html: `${plate()}
    ${h1('A game you<br>can <mark>play.</mark>', { size: 104 })}
    ${card({ l: 64, t: 760, w: 786, h: 477, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen', a: on('slap', 2), kb: true })}
    ${pill('game', 620, 1190, 5, '', '', on('pop', 4))}` },
    { theme: 'k', beats: 9, wipe: '450,1000', html: `${plate()}
    ${h1('Stickers of her<br>own <mark>character.</mark>', { size: 88 })}
    ${card({ l: 64, t: 730, w: 700, h: 500, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '60% 100%', a: on('slap', 2), kb: true })}
    ${card({ l: 360, t: 1110, w: 470, h: 310, rot: 4, src: `${M}/landing/step-show.jpg`, pos: '58% 80.6%', zoom: 330, z: 6, a: on('pop', 4) })}
    ${pill('sticker pack', 548, 1072, -3, '', `background:${C.yellow}`, on('pop', 5))}` },
    endScene('What would<br>yours <mark>make?</mark>'),
  ],

  // 38 beats, 17.5 s. The four steps pop on beats 16–19; the answer (Anna, beat 24) is the reveal; logo on beat 32.
  '08-will-ai-think': [
    { theme: 'c', beats: 6, html: `${plate()}
    ${h1('Will AI think<br>for <mark>my kid?</mark>', { top: 500, size: 108, a: an('settle', 0) })}
    ${char('kamilla', 130, 820, 620, '', on('slap', 1))}` },
    { theme: 'k', beats: 8, wipe: '450,800', html: `${plate()}
    ${h1('Only if the AI<br>has the <mark>ideas.</mark>', { top: 540, size: 100 })}
    <i class="badge"${on('pop', 2)} style="left:250px;top:880px;width:340px;height:340px;background:${C.mint};transform:rotate(-6deg)">${icon('lightbulb', 170, '#141A33', 2.2)}</i>` },
    { theme: 'c', beats: 9, wipe: '300,700', html: `${plate()}
    <p class="kick"${an('rise', 0.1)} style="top:480px;font-size:52px">In every lesson</p>
    ${['She decides', 'She tells the AI', 'She checks it', 'She fixes it'].map((s, i) =>
      pill(`<b>${i + 1}</b>${s}`, i % 2 ? 120 : 64, 590 + i * 150, [-3, 2, -2, 3][i], 'step', '', on('pop', 2 + i))).join('')}
    <span class="note"${an('write', at(6))} style="left:80px;top:1230px;transform:rotate(-3deg);font-size:60px">the thinking stays with her</span>` },
    { theme: 'n', beats: 8, wipe: '450,700', swish: true, html: `${plate()}
    ${h1('Don’t let AI think<br>for your child.', { top: 500, size: 78 })}
    ${h1('Teach them to<br><mark>think with it.</mark>', { top: 700, size: 92, a: an('words', at(3)) })}
    ${char('anna', 190, 990, 560, '', reveal(on('slap', 1)))}` },
    endScene('Let them do<br>the <mark>thinking.</mark>'),
  ],
};
