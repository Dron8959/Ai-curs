// Stage 3 of next week's pack (19-25 Nov): the reels and carousels, built from one template so the whole week
// keeps one look. Owner, 17 Nov: no rubric word, the comment word in quotes, Kamilla's cartoon behind everything.
//
// Every reel has the cut of reels 11 and 18 (42 beats, 19.4 s): the cover (the tile) as scene 1, three scenes of
// one short line each, the closing card. The voice line of each scene is in week2-texts.mjs and sound/VOICEOVER.md.
// Kamilla's reels play her real cartoon full screen behind a yellow sticker line; Anna's put the line and one
// picture over a frame of the cartoon tinted in the series colour.
import { C, M, B, an, on, card, ring, pill, char, icon, plate, endScene, cartoonBg, top, foot } from '../kit.mjs';
import { TILES, tileHtml, bubble, hand } from './week2-art.mjs';
import { TEXTS } from './week2-texts.mjs';
import { WEEK2, KW } from './week2.mjs';

const at = (beat) => +(beat * B).toFixed(4);
const A = (type, beat, rev) => (rev ? `${on(type, beat)} data-reveal` : on(type, beat));
const h1 = (html, top = 470, size = 92) => `<h1 class="t"${an('words', 0.15)} style="top:${top}px;font-size:${size}px">${html}</h1>`;
const CARTOON = `${M}/landing/cartoon.mp4`;

// ------------------------------------------------------------------ pictures for one scene (y 820-1440, x 64-850)
const V = {
  img: (src, pos = 'center') => (r) => card({ l: 110, t: 820, w: 660, h: 600, rot: -2, src, pos, a: A('slap', 2, r), kb: true }),
  icon: (name, bg = C.mint) => (r) => `<i class="badge"${A('pop', 2, r)} style="left:250px;top:860px;width:380px;height:380px;background:${bg};transform:rotate(-6deg)">${icon(name, 190, '#141A33', 2.2)}</i>`,
  say: (text, me = false) => (r) => `<div${A('pop', 2, r)} style="position:absolute;inset:0;z-index:5">${bubble(text, 80, 900, 700, { me, size: 54 })}</div>`,
  char: (who) => (r) => char(who, 190, 900, 560, '', A('slap', 1, r)),
  ring: (src, pos, label) => (r) => `${ring({ l: 230, t: 840, d: 440, src, pos, zoom: 175, pad: 16, a: A('pop', 2, r) })}${label ? pill(label, 150, 1300, -3, '', '', on('pop', 3)) : ''}`,
  big: (text, small) => (r) => `<div class="card"${A('slap', 2, r)} style="left:110px;top:860px;width:660px;height:auto;padding:46px 50px;transform:rotate(-2deg)"><p style="font:800 170px/1 Sora;letter-spacing:-.05em;color:#141A33">${text}</p><p style="margin-top:14px;font:700 44px/1.2 Urbanist;color:#4B5070">${small}</p></div>`,
  quote: (text, who) => (r) => `<div class="card"${A('slap', 2, r)} style="left:84px;top:840px;width:740px;height:auto;padding:44px 48px;transform:rotate(-1.5deg)"><p style="font:700 50px/1.25 Urbanist;color:#141A33">“${text}”</p><p style="margin-top:22px;font:800 26px Sora;letter-spacing:.06em;text-transform:uppercase;color:#4B5070">${who}</p></div>`,
  hand: () => (r) => `<div${A('slap', 1, r)} style="position:absolute;inset:0;z-index:4">${hand(150, 760)}</div>`,
};

// a scene of Anna's reels: a tinted cartoon frame, the line, one picture
const flat = (theme, frame, line, vis, { reveal = false, beats = 9, wipe, swish } = {}) =>
  ({ theme, beats, wipe, swish, html: `${cartoonBg(frame, 0.78)}${plate()}${h1(line)}${vis(reveal)}` });
// a scene of Kamilla's reels: her cartoon full screen, the line on a yellow sticker in the sky
const clip = (from, line, { reveal = false, beats = 9, wipe, swish } = {}) => ({ theme: 'y', beats, wipe, swish, html: `
    <div style="position:absolute;inset:0;z-index:1;overflow:hidden"><video data-clip data-src="${CARTOON}" data-from="${from}" muted playsinline preload="auto" style="width:100%;height:100%;object-fit:cover"></video></div>
    <div class="card"${A('slap', 1, reveal)} style="left:64px;top:290px;width:790px;height:auto;padding:34px 42px;background:#FFC533;transform:rotate(-1.5deg);overflow:visible"><p style="font:800 80px/1.02 Sora;letter-spacing:-.045em;color:#141A33">${line}</p></div>` });
// scene 1: the cover itself, so the first frame is the tile people saw in the grid
const cover = (n) => ({ theme: TILES[n].theme, beats: 9, html: `${cartoonBg(...(['f3', 1]))}<div${an('settle', 0)} style="position:absolute;z-index:2;left:0;top:240px;width:1080px;height:1440px;overflow:hidden" class="tile ${TILES[n].theme}">${tileHtml(n, KW[n])}</div>` });

// LONG: where a voice line is longer than its scene, that scene gets more beats (scene 4 by a whole bar, so the
// reveal and the logo stay on bar lines; the closing card simply holds longer after the logo)
const LONG = { 15: { end: 10 }, 21: { end: 10 }, 23: { end: 9 }, 19: { s4: 12 }, 26: { s4: 12 } };
const W = (n, scenes, end) => [cover(n), ...scenes.map((s, i) => ({ ...s, wipe: ['450,800', '300,700', '450,700'][i], swish: i === 2,
  ...(i === 2 && LONG[n]?.s4 ? { beats: LONG[n].s4 } : {}) })), { ...endScene(end), ...(LONG[n]?.end ? { beats: LONG[n].end } : {}) }];

// [frame of the cartoon behind Anna's scenes]
export const reels = {
  13: W(13, [clip(0, 'Not a single<br>frame drawn.'), clip(10, 'Her story.<br>Her characters.'), clip(7, 'She fixed what<br>came out wrong.', { reveal: true })], '20 minutes.<br><mark>2-3 tries a scene.</mark>'),
  32: W(32, [clip(5, 'That was<br>my idea.'), clip(7, 'My characters.<br>My story.'), clip(2, 'I fixed what<br>came out wrong.', { reveal: true })], 'What would yours<br><mark>be about?</mark>'),
  33: W(33, [clip(10, 'The AI drew<br>every street.'), clip(21, 'I chose<br>what happens.'), clip(14, 'Wrong scene?<br>Ask again.', { reveal: true })], 'Where would<br><mark>yours go?</mark>'),
  34: W(34, [clip(17, 'The girls, the cat,<br>Paris.'), clip(19, 'I told the AI.<br>It drew them.'), clip(9, 'Wrong?<br>I tried again.', { reveal: true })], 'Who would be<br><mark>in yours?</mark>'),
  35: W(35, [clip(13, 'Not right<br>the first time.'), clip(15, 'I tell the AI<br>what to fix.'), clip(22, 'About<br>20 minutes.', { reveal: true })], 'Fix it,<br><mark>or keep it?</mark>'),

  14: W(14, [flat('c', 'f8', 'Say yes,<br><mark>with one rule.</mark>', V.say('Yes. On my account, next to me.', true)),
    flat('k', 'f1', 'Your account.<br><mark>Not theirs.</mark>', V.icon('user-check')),
    flat('c', 'f17', 'You sit<br><mark>next to them.</mark>', V.img(`${M}/landing/step-make.jpg`), { reveal: true })], 'One rule.<br><mark>Say yes.</mark>'),
  15: W(15, [flat('k', 'f3', 'It starts with<br><mark>static.</mark>', V.img('social/concept/out/week2/assets/c-noise.jpg')),
    flat('c', 'f5', 'Noise out,<br><mark>step by step.</mark>', V.img('social/concept/out/week2/assets/c-half.jpg')),
    flat('k', 'f9', 'Until it matches<br><mark>the words.</mark>', V.img('social/concept/out/week2/assets/c-end.jpg'), { reveal: true })], 'From static<br>to <mark>her words.</mark>'),
  16: W(16, [flat('m', 'f19', 'Leave your email.<br><mark>No card.</mark>', V.icon('mail', C.yellow)),
    flat('k', 'f11', '10-20 minutes.<br><mark>Laptop or tablet.</mark>', V.img(`${M}/landing/game.jpg`)),
    flat('m', 'f22', 'Then you play<br><mark>each other.</mark>', V.img(`${M}/landing/together-game.jpg`), { reveal: true })], 'A game<br><mark>tonight.</mark>'),
  19: W(19, [flat('n', 'f5', 'No reading.<br><mark>No typing.</mark>', V.icon('keyboard-off', C.yellow)),
    flat('k', 'f8', 'They talk.<br><mark>You type.</mark>', V.say('“a dragon who bakes cookies”')),
    flat('n', 'f14', 'Their idea.<br><mark>Your keyboard.</mark>', V.img(`${M}/landing/step-make.jpg`), { reveal: true })], 'Six?<br><mark>They can.</mark>'),
  21: W(21, [flat('y', 'f22', 'Her character,<br><mark>as stickers.</mark>', V.img(`${M}/landing/step-show.jpg`)),
    flat('k', 'f1', 'Happy. Surprised.<br><mark>Silly.</mark>', V.img(`${M}/landing/step-show.jpg`, '20% 50%')),
    flat('y', 'f17', 'That was<br><mark>one lesson.</mark>', V.char('kamilla'), { reveal: true })], 'What would<br><mark>yours be?</mark>'),
  22: W(22, [flat('k', 'f9', 'It read a lot<br><mark>of human text.</mark>', V.icon('book-open', C.yellow)),
    flat('c', 'f3', 'So it sounds<br><mark>like a person.</mark>', V.say('I’m so happy you’re here!')),
    flat('k', 'f19', 'No food. No sleep.<br><mark>No missing you.</mark>', V.icon('heart-off', C.coral), { reveal: true })], 'Alive?<br><mark>Ask your kid.</mark>'),
  23: W(23, [flat('m', 'f17', 'Your kid draws it.<br><mark>Crayons are fine.</mark>', V.img(`${M}/works/rainbow-drawing.jpg`)),
    flat('k', 'f5', 'AI turns it into<br><mark>a cartoon.</mark>', V.img(`${M}/works/rainbow-cartoon.jpg`)),
    flat('m', 'f8', 'Their idea.<br><mark>Their drawing.</mark>', V.char('kamilla'), { reveal: true })], 'A cartoon<br><mark>for grandma.</mark>'),
  26: W(26, [flat('n', 'f11', '<mark>No.</mark> From zero,<br>for both of you.', V.char('anna')),
    flat('k', 'f22', 'Laptop or tablet.<br><mark>Nothing to install.</mark>', V.icon('laptop', C.yellow)),
    flat('n', 'f3', 'The full course:', V.big('$197', 'paid once, no subscription'), { reveal: true })], 'Or start<br><mark>free.</mark>'),
  27: W(27, [flat('y', 'f5', 'Kid writes words.<br><mark>AI makes music.</mark>', V.icon('music', C.coral)),
    flat('k', 'f17', 'Susan made one<br><mark>with her granddaughter.</mark>', V.ring(`${M}/landing/reviews/susan.jpg`, '55% 30%', 'grandmother of an 8-year-old')),
    flat('y', 'f1', 'What she<br><mark>told us:</mark>', V.quote('We made a song together, and she wanted to show it to everyone in the family!', 'Susan · early access, got the course free'), { reveal: true })], 'Send it<br><mark>to grandma.</mark>'),
  28: W(28, [flat('c', 'f8', 'An AI version?<br><mark>It says so.</mark>', V.ring(`${M}/landing/kamilla.jpg`, '50% 30%', 'real Kamilla')),
    flat('k', 'f17', '<mark>Every time.</mark>', V.char('kamilla')),
    flat('c', 'f19', 'Know who<br><mark>you talk to.</mark>', V.icon('badge-check', C.mint), { reveal: true })], 'One rule.<br><mark>Every app.</mark>'),
  29: W(29, [flat('c', 'f22', 'It starts from<br><mark>the drawing.</mark>', V.img(`${M}/works/rainbow-drawing.jpg`)),
    flat('k', 'f14', 'Same shapes.<br><mark>New style.</mark>', V.img(`${M}/works/rainbow-cartoon.jpg`)),
    flat('c', 'f9', 'The truck<br><mark>stayed.</mark>', V.img(`${M}/works/rainbow-cartoon.jpg`, '50% 80%'), { reveal: true })], 'The idea stays<br><mark>the kid’s.</mark>'),
  31: W(31, [flat('m', 'f1', 'Leave your email.<br><mark>No card.</mark>', V.icon('mail', C.yellow)),
    flat('k', 'f11', 'They build a game.<br><mark>You play it.</mark>', V.img(`${M}/landing/together-game.jpg`)),
    flat('m', 'f19', 'Not a fit?<br><mark>20 minutes.</mark>', V.icon('sofa', C.yellow), { reveal: true })], 'Worst case:<br><mark>20 minutes.</mark>'),
};

// ------------------------------------------------------------------ carousels: the tile, then one slide per point
const slide = (theme, frame, head, body, extra = '') => ({ theme, html: `${cartoonBg(frame, 0.84)}${top('')}
    <h1 class="t" style="top:200px;font-size:96px">${head}</h1>
    <p class="sub" style="top:600px;font-size:58px;right:110px">${body}</p>${extra}${foot(false)}` });
const S = TEXTS;
const badge = (name, bg) => `<i class="badge" style="left:600px;top:930px;width:330px;height:330px;background:${bg};transform:rotate(-6deg)">${icon(name, 160, '#141A33', 2.2)}</i>`;
const BADGES = { 20: [['eye-off', C.mint], null, ['type', C.yellow], ['users', C.mint], ['bookmark', C.yellow]],
  24: [['school', C.yellow], ['undo-2', C.mint], ['megaphone', C.yellow], ['list-checks', C.mint], ['mail', C.yellow]],
  30: [null, ['pencil', C.mint], ['phone-off', C.yellow], ['clock', C.mint], ['gift', C.yellow]] };
const bx = (n, i) => (BADGES[n][i] ? badge(...BADGES[n][i]) : '');
const photo = (who, pos) => ring({ l: 600, t: 860, d: 380, src: `${M}/landing/reviews/${who}.jpg`, pos, zoom: 175, pad: 14 });
export const carousels = {
  17: [{ theme: 'y', html: tileHtml(17, KW[17]) },
    slide('k', 'f1', S[17].slides[1][0], S[17].slides[1][1]),
    ...[['margaret', '50% 30%'], ['susan', '55% 30%'], ['linda', '50% 25%'], ['patricia', '55% 25%']].map(([w, p], i) =>
      slide(i % 2 ? 'k' : 'y', ['f5', 'f17', 'f9', 'f22'][i], S[17].slides[i + 2][0], S[17].slides[i + 2][1], photo(w, p))),
    slide('y', 'f8', S[17].slides[6][0], S[17].slides[6][1]),
    slide('n', 'f14', S[17].slides[7][0], S[17].slides[7][1])],
  20: [{ theme: 'k', html: tileHtml(20, KW[20]) },
    ...S[20].slides.slice(1).map(([h, b], i) => slide(['k', 'c', 'k', 'c', 'n'][i], ['f1', 'f8', 'f17', 'f5', 'f14'][i], h, b,
      i === 1 ? `<div style="position:absolute;inset:0;z-index:4;transform:scale(.62);transform-origin:620px 1400px">${hand(150, 520)}</div>` : bx(20, i)))],
  24: [{ theme: 'c', html: tileHtml(24, KW[24]) },
    ...S[24].slides.slice(1).map(([h, b], i) => slide(['k', 'c', 'k', 'c', 'n'][i], ['f19', 'f3', 'f11', 'f22', 'f9'][i], h, b, bx(24, i)))],
  30: [{ theme: 'n', html: tileHtml(30, KW[30]) },
    ...S[30].slides.slice(1).map(([h, b], i) => slide(['k', 'y', 'k', 'n', 'm'][i], ['f14', 'f5', 'f11', 'f3', 'f19'][i], h, b, bx(30, i)))],
};

// ------------------------------------------------------------------ the posts for content.mjs
const SLUG = { 13: 'cartoon-how', 14: 'one-rule', 15: 'draw-from-words', 16: 'game-tonight', 17: 'grandmas', 19: 'kid-is-6', 20: 'is-this-real',
  21: 'stickers', 22: 'is-ai-alive', 23: 'cartoon-for-grandma', 24: 'chatbot-school', 26: 'know-ai-first', 27: 'song', 28: 'ai-version',
  29: 'crayon-to-cartoon', 30: 'what-it-costs', 31: 'worst-case', 32: 'cat-croissant', 33: 'paris', 34: 'characters', 35: 'tries-a-scene' };
export const idOf = (n) => `${n}-${SLUG[n]}`;
export const posts = WEEK2.map((p) => ({ id: idOf(p.n), n: p.n, rubric: p.rubric, no: '', format: p.format === 'Reel' ? 'reel' : 'carousel',
  ai: p.format === 'Reel' || p.n === 20, title: p.hook, caption: TEXTS[p.n].caption, tt: true,
  ...(p.format === 'Reel' ? { tile: tileHtml(p.n, KW[p.n]) } : { slides: carousels[p.n] }) }));
export const reelScenes = Object.fromEntries(Object.entries(reels).map(([n, s]) => [idOf(+n), s]));
