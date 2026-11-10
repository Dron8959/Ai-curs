// Reel scenes for the first ten posts. 1080×1920, 30 fps. Each scene is one beat (4 s at most):
// the frame changes every beat, the hook card is on screen at frame 1, on-screen lines stay at six
// words or fewer and inside x 64–850, y 250–1440 so the Instagram interface never covers them.
// The closing card echoes one word of the hook so the loop lands clean.

import { C, M, an, card, ring, pill, tape, star, char, icon, plate, endScene } from './kit.mjs';

const h1 = (html, { top = 470, size = 112, a = an('words', 0.15), style = '' } = {}) =>
  `<h1 class="t"${a} style="top:${top}px;font-size:${size}px;${style}">${html}</h1>`;
const sub = (html, top, a = an('rise', 0.9), size = 46) => `<p class="sub"${a} style="top:${top}px;font-size:${size}px">${html}</p>`;
const num = (n, l, t, a, size = 120, bg = C.yellow) =>
  `<span class="num"${a} style="left:${l}px;top:${t}px;width:${size}px;height:${size}px;font-size:${Math.round(size * 0.58)}px;background:${bg}">${n}</span>`;
const row = (label, text, l, t, rot, a) =>
  `<div class="card row"${a} style="left:${l}px;top:${t}px;width:760px;height:150px;transform:rotate(${rot}deg)"><b>${label}</b><span>${text}</span></div>`;
// a phone that scrolls a feed: the "screen she scrolls"
const phone = (l, t, w, h, rot, a = '') => `<div class="card"${a} style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);border-radius:46px;background:#FFF4DC;border-width:8px">
  <div data-in="scroll" style="padding:26px 22px;display:grid;gap:16px">${[C.coral, C.mint, C.yellow, '#C9CCE0', C.coral, C.yellow, C.mint, '#C9CCE0'].map((c) =>
    `<i style="display:block;height:128px;border-radius:18px;background:${c}"></i><i style="display:block;height:15px;width:72%;border-radius:8px;background:#141A33;opacity:.28"></i><i style="display:block;height:15px;width:46%;border-radius:8px;background:#141A33;opacity:.18"></i>`).join('')}</div></div>`;
const photoStep = (theme, n, word, line, src, pos = 'center') => ({ theme, dur: 3.4, html: `${plate()}
    ${num(n, 64, 470, an('pop', 0.1))}
    ${h1(word, { top: 612, size: 150, a: an('words', 0.2) })}
    ${sub(line, 780, an('rise', 0.8))}
    ${card({ l: 64, t: 930, w: 740, h: 490, rot: -2, src, pos, a: an('slap', 0.55), kb: true })}` });

export const reels = {
  '01-crayon-to-cartoon': [
    { theme: 'y', dur: 3.0, html: `${plate()}
    ${h1('A 6-year-old<br>drew <mark>this.</mark>', { size: 106, a: an('settle', 0) })}
    ${card({ l: 150, t: 760, w: 440, h: 660, rot: -4, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper', a: an('slap', 0.3) })}
    ${tape(290, 736, -10, '', an('pop', 0.75))}
    ${star(90, '#fff', 'left:660px;top:820px', an('pop', 1.0))}${star(44, '#fff', 'left:740px;top:770px', an('pop', 1.15))}` },
    { theme: 'y', dur: 4.0, wipe: '600,1100', html: `${plate()}
    ${h1('One lesson<br><mark>later.</mark>')}
    ${card({ l: 64, t: 800, w: 330, h: 495, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 380, t: 740, w: 470, h: 705, rot: 4, src: `${M}/works/rainbow-cartoon.jpg`, z: 4, a: an('slap', 0.8), kb: true })}
    ${star(90, '#fff', 'left:770px;top:680px', an('pop', 1.3))}${star(44, '#fff', 'left:720px;top:640px', an('pop', 1.45))}
    ${pill('AI followed the drawing', 80, 1340, -3, '', '', an('pop', 2.0))}` },
    { theme: 'n', dur: 4.0, wipe: '200,800', html: `${plate()}
    ${h1('Who did<br><mark>what.</mark>', { size: 120 })}
    ${row('Kid:', 'the idea, the drawing', 64, 760, -2, an('slide', 0.8))}
    ${row('AI:', 'follows the drawing', 84, 940, 1.5, an('slide', 1.5))}
    ${row('You:', 'right next to them', 64, 1120, -1, an('slide', 2.2))}` },
    endScene('What will<br>yours <mark>draw?</mark>'),
  ],

  '02-meet-anna-kamilla': [
    { theme: 'n', dur: 3.2, html: `${plate()}
    ${h1('A mom and<br>a <mark>daughter.</mark>', { a: an('settle', 0) })}
    ${ring({ l: 64, t: 760, d: 440, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250, a: an('pop', 0.3) })}
    ${ring({ l: 430, t: 920, d: 400, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, z: 5, a: an('pop', 0.55) })}
    ${pill('Anna, mom', 80, 1210, -5, '', `background:${C.coral}`, an('pop', 1.1))}
    ${pill('Kamilla, 10', 520, 1340, 4, '', `background:${C.mint}`, an('pop', 1.3))}` },
    { theme: 'n', dur: 2.6, wipe: '500,700', html: `${plate()}
    ${h1('Not a<br><mark>corporation.</mark>', { top: 560, size: 104 })}
    ${star(110, C.yellow, 'left:620px;top:900px', an('pop', 0.9))}${star(50, C.yellow, 'left:560px;top:860px', an('pop', 1.05))}${star(40, C.yellow, 'left:740px;top:1010px', an('pop', 1.2))}` },
    { theme: 'k', dur: 3.6, wipe: '300,700', html: `${plate()}
    ${ring({ l: 64, t: 470, d: 520, src: `${M}/landing/anna.jpg`, pos: '50% 25%', zoom: 250, a: an('pop', 0.15) })}
    ${h1('Anna built<br>every <mark>lesson.</mark>', { top: 1040, size: 104, a: an('words', 0.5) })}
    ${sub('She checks homework the same day.', 1270, an('rise', 1.4))}` },
    { theme: 'k', dur: 3.6, wipe: '600,700', html: `${plate()}
    ${ring({ l: 300, t: 470, d: 520, src: `${M}/landing/kamilla.jpg`, pos: '44% 19%', zoom: 215, a: an('pop', 0.15) })}
    ${h1('Kamilla, 10,<br>goes <mark>first.</mark>', { top: 1040, size: 104, a: an('words', 0.5) })}
    ${sub('Then your kid makes their own.', 1270, an('rise', 1.4))}` },
    { theme: 'n', dur: 3.6, wipe: '450,1000', html: `${plate()}
    ${h1('Tested at our<br><mark>kitchen table.</mark>', { size: 92 })}
    ${card({ l: 64, t: 740, w: 780, h: 536, rot: -2, src: `${M}/landing/together-game.jpg`, a: an('slap', 0.6), kb: true })}
    ${sub('What lost her attention got cut.', 1320, an('rise', 1.5))}` },
    endScene('A mom, a daughter,<br><mark>and you.</mark>'),
  ],

  '04-idea-to-game': [
    { theme: 'y', dur: 3.0, html: `${plate()}
    ${pill('7:02 pm', 64, 470, -3, 'time', '', an('pop', 0.1))}
    ${h1('Her <mark>idea.</mark>', { top: 670, size: 150, a: an('settle', 0) })}
    <span class="note"${an('write', 1.0)} style="left:70px;top:880px;transform:rotate(-3deg);font-size:64px">a park, a girl, her corgi</span>
    ${char('kamilla', 250, 1010, 560, '', an('slap', 0.4))}` },
    { theme: 'y', dur: 3.8, wipe: '300,560', html: `${plate()}
    ${pill('7:41 pm', 64, 470, -3, 'time', '', an('pop', 0.15))}
    ${h1('<mark>Playing</mark> it.', { top: 670, size: 150, a: an('words', 0.35) })}
    ${card({ l: 64, t: 900, w: 786, h: 477, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen', a: an('slap', 0.7), kb: true })}
    ${pill('made by Kamilla, 10', 90, 1330, -3, '', '', an('pop', 1.6))}` },
    { theme: 'k', dur: 3.4, wipe: '450,750', html: `${plate()}
    ${card({ l: 64, t: 470, w: 786, h: 540, rot: 2, src: `${M}/landing/together-game.jpg`, a: an('slap', 0.15), kb: true })}
    ${h1('Against each other.<br><mark>Same table.</mark>', { top: 1090, size: 72, a: an('words', 0.6) })}` },
    { theme: 'n', dur: 4.0, wipe: '300,600', html: `${plate()}
    ${['She decided.', 'She told the AI.', 'She checked.', '<mark>She fixed.</mark>'].map((l, i) => h1(l, { top: 470 + i * 104, size: 84, a: an('rise', 0.2 + i * 0.6) })).join('')}
    ${sub('The thinking stayed with her.', 930, an('rise', 2.8), 50)}
    ${char('kamilla', 230, 1040, 500, '', an('slap', 0.5))}` },
    endScene('Your kid’s <mark>idea.</mark><br>Tonight?'),
  ],

  '05-reason-to-show': [
    { theme: 'c', dur: 3.0, html: `${plate()}
    ${h1('Kids don’t<br>need more<br><mark>screen time.</mark>', { top: 520, size: 104, a: an('settle', 0) })}
    ${phone(520, 900, 260, 500, 6, an('slap', 0.3))}` },
    { theme: 'c', dur: 4.0, wipe: '300,700', html: `${plate()}
    ${h1('They need a<br>reason to<br><mark>show you</mark><br>something.', { size: 96 })}
    ${card({ l: 110, t: 880, w: 700, h: 560, rot: 2.5, src: `${M}/landing/step-show.jpg`, pos: '82% 30%', a: an('slap', 1.0), kb: true })}
    ${pill('the “look what I made” face', 80, 1350, -3, '', 'text-transform:none;letter-spacing:0;font-size:34px', an('pop', 2.1))}` },
    { theme: 'k', dur: 3.6, wipe: '500,900', html: `${plate()}
    ${h1('A screen she<br><mark>makes on</mark><br>is not a screen<br>she scrolls.', { top: 500, size: 92 })}
    ${card({ l: 64, t: 960, w: 470, h: 300, rot: -3, src: `${M}/landing/game.jpg`, cls: 'screen', a: an('pop', 1.1) })}
    ${pill('makes', 90, 1230, -5, '', `background:${C.mint}`, an('pop', 1.4))}
    ${phone(590, 930, 230, 400, 5, an('pop', 1.7))}
    ${pill('scrolls', 600, 1300, 4, '', `background:${C.coral}`, an('pop', 2.0))}` },
    endScene('Make the screen<br><mark>worth it.</mark>'),
  ],

  '06-watch-make-show': [
    { theme: 'n', dur: 2.6, html: `${plate()}
    ${h1('One lesson.<br><mark>Three steps.</mark>', { top: 540, size: 100, a: an('settle', 0) })}
    ${sub('6 to 20 minutes.', 780, an('rise', 0.7), 56)}
    ${[1, 2, 3].map((n, i) => num(n, 64 + i * 170, 940, an('pop', 0.9 + i * 0.2), 140, [C.cream, C.yellow, C.coral][i])).join('')}` },
    photoStep('n', 1, 'Watch.', 'Kamilla shows the finished thing.', `${M}/landing/step-watch.jpg`),
    { ...photoStep('y', 2, 'Make.', 'Your kid builds it.<br>You sit next to them.', `${M}/landing/step-make.jpg`), wipe: '500,700' },
    { ...photoStep('c', 3, 'Show.', 'Play it. Send it to grandma.', `${M}/landing/step-show.jpg`, '70% 30%'), wipe: '300,700' },
    endScene('One <mark>lesson.</mark><br>One real thing.'),
  ],

  '07-made-by-10-year-old': [
    { theme: 'y', dur: 2.6, html: `${plate()}
    ${h1('Made by a<br><mark>10-year-old.</mark>', { top: 500, size: 104, a: an('settle', 0) })}
    ${pill('no code', 480, 770, 6, 'dark', '', an('pop', 0.6))}
    ${char('kamilla', 130, 880, 620, '', an('slap', 0.3))}` },
    { theme: 'k', dur: 4.0, wipe: '400,1000', html: `${plate()}
    ${h1('Her story.<br>Her <mark>characters.</mark>', { size: 86 })}
    ${card({ l: 200, t: 700, w: 420, h: 732, rot: -2, a: an('slap', 0.4), inner: `<video data-clip data-src="${M}/landing/cartoon.mp4" data-from="6" data-at="0.4" muted playsinline preload="auto"></video>` })}
    ${pill('cartoon', 560, 760, 6, '', `background:${C.yellow}`, an('pop', 1.2))}` },
    { theme: 'y', dur: 3.0, wipe: '450,1000', html: `${plate()}
    ${h1('A game you<br>can <mark>play.</mark>', { size: 104 })}
    ${card({ l: 64, t: 760, w: 786, h: 477, rot: -2, src: `${M}/landing/game.jpg`, cls: 'screen', a: an('slap', 0.4), kb: true })}
    ${pill('game', 620, 1190, 5, '', '', an('pop', 1.1))}` },
    { theme: 'k', dur: 3.4, wipe: '450,1000', html: `${plate()}
    ${h1('Stickers of her<br>own <mark>character.</mark>', { size: 88 })}
    ${card({ l: 64, t: 730, w: 700, h: 500, rot: -2, src: `${M}/landing/step-show.jpg`, pos: '60% 100%', a: an('slap', 0.4), kb: true })}
    ${card({ l: 360, t: 1110, w: 470, h: 310, rot: 4, src: `${M}/landing/step-show.jpg`, pos: '58% 80.6%', zoom: 330, z: 6, a: an('pop', 1.2) })}
    ${pill('sticker pack', 548, 1072, -3, '', `background:${C.yellow}`, an('pop', 1.7))}` },
    endScene('What would<br>yours <mark>make?</mark>'),
  ],

  '08-will-ai-think': [
    { theme: 'c', dur: 3.0, html: `${plate()}
    ${h1('Will AI think<br>for <mark>my kid?</mark>', { top: 500, size: 108, a: an('settle', 0) })}
    ${char('kamilla', 130, 820, 620, '', an('slap', 0.3))}` },
    { theme: 'k', dur: 3.2, wipe: '450,800', html: `${plate()}
    ${h1('Only if the AI<br>has the <mark>ideas.</mark>', { top: 540, size: 100 })}
    <i class="badge"${an('pop', 1.0)} style="left:250px;top:880px;width:340px;height:340px;background:${C.mint};transform:rotate(-6deg)">${icon('lightbulb', 170, '#141A33', 2.2)}</i>` },
    { theme: 'c', dur: 4.0, wipe: '300,700', html: `${plate()}
    <p class="kick"${an('rise', 0.1)} style="top:480px;font-size:52px">In every lesson</p>
    ${['She decides', 'She tells the AI', 'She checks it', 'She fixes it'].map((s, i) =>
      pill(`<b>${i + 1}</b>${s}`, i % 2 ? 120 : 64, 590 + i * 150, [-3, 2, -2, 3][i], 'step', '', an('pop', 0.5 + i * 0.6))).join('')}
    <span class="note"${an('write', 3.0)} style="left:80px;top:1230px;transform:rotate(-3deg);font-size:60px">the thinking stays with her</span>` },
    { theme: 'n', dur: 3.8, wipe: '450,700', html: `${plate()}
    ${h1('Don’t let AI think<br>for your child.', { top: 500, size: 78 })}
    ${h1('Teach them to<br><mark>think with it.</mark>', { top: 700, size: 92, a: an('words', 1.2) })}
    ${char('anna', 190, 990, 560, '', an('slap', 0.6))}` },
    endScene('Let them do<br>the <mark>thinking.</mark>'),
  ],
};
