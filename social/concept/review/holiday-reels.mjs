// Holiday sales posts 47-50: reels and carousels, the pack 3 template (review/week3-reels.mjs) with the owner's phone
// rules built in: the reel cover at 0.78 inside the phone-safe box without the button, pictures inside x 64-850 /
// y 250-1440, only cartoon frames with the kids seen from behind, explicit line breaks (no orphan words).
import { C, M, an, on, card, icon, plate, endScene, cartoonBg, top, foot } from '../kit.mjs';
import { H } from './holiday-texts.mjs';
import { TILESH, tileHtmlH, CERT } from './holiday-art.mjs';

const A = (type, beat, rev) => (rev ? `${on(type, beat)} data-reveal` : on(type, beat));
const h1 = (html, top = 470, size = 92) => `<h1 class="t"${an('words', 0.15)} style="top:${top}px;font-size:${size}px">${html}</h1>`;
const BADGE = [C.yellow, C.mint, C.coral];
// one picture per scene (y 820-1440, x 64-850)
const vis = (spec, i) => (r) => {
  const [kind, ...rest] = spec.split(':'); const arg = rest.join(':');
  if (kind === 'icon') return `<i class="badge"${A('pop', 2, r)} style="left:250px;top:860px;width:380px;height:380px;background:${BADGE[i % 3]};transform:rotate(-6deg)">${icon(arg, 190, '#141A33', 2.2)}</i>`;
  if (kind === 'img' && arg === 'certificate') return card({ l: 90, t: 860, w: 740, h: Math.round(740 * 1275 / 1650), rot: -2, src: CERT, a: A('slap', 2, r) });
  if (kind === 'img') return card({ l: 110, t: 820, w: 660, h: 560, rot: -2, src: `${M}/${arg}`, a: A('slap', 2, r), kb: true });
  throw new Error(`unknown picture ${spec}`);
};
const FRAMES = ['f22', 'f14'];
const flat = (theme, frame, line, v, reveal) => ({ theme, beats: 9, html: `${cartoonBg(frame, 0.78)}${plate()}${h1(line)}${v(reveal)}` });
const cover = (n) => ({ theme: TILESH[n].theme, beats: 9, html: `${cartoonBg('f22', 1)}<div${an('settle', 0)} style="position:absolute;z-index:2;left:64px;top:250px;width:842px;height:1123px"><div style="position:absolute;left:0;top:0;width:1080px;height:1440px;overflow:hidden;transform:scale(.78);transform-origin:0 0" class="tile ${TILESH[n].theme}">${tileHtmlH(n, false)}</div></div>` });
const alt = (t) => (t === 'k' ? 'c' : 'k');
const reel = (p, k) => [cover(p.n), ...p.scenes.map(([line, spec], i) => ({ ...flat(i === 1 ? alt(p.theme) : p.theme, FRAMES[(k + i) % FRAMES.length], line, vis(spec, i), i === 2),
  wipe: ['450,800', '300,700', '450,700'][i], swish: i === 2 })), { ...endScene(p.end), beats: 8 }];   // the closing line needs one more beat on the card

// carousels: the tile, then one slide per point; heads with explicit breaks so no line ends on one short word
const HEAD = {
  47: [null, 'What they’ll<br>make', 'With you<br>next to them', 'Under<br>the tree', '$197,<br>paid once', 'Comment<br>“GIFT”'],
  49: [null, 'The login comes<br>by email', 'A certificate<br>to print', 'What’s<br>inside', '$197,<br>paid once', 'Comment<br>“GIFT”'],
};
const BODY = {
  47: [null, 'A game, a cartoon, a song,<br>a website, a sticker pack,<br>a voiceover.', null, null, 'Or $297 with homework checked<br>by Anna the same day.<br>No subscription.', null],
  49: [null, null, 'With their name,<br>for under the tree.', 'A game, a cartoon, a song,<br>a website, a sticker pack,<br>a voiceover.', 'Or $297 with homework checked<br>by Anna the same day.', null],
};
const slide = (theme, frame, head, body, extra = '') => ({ theme, html: `${cartoonBg(frame, 0.84)}${top('')}
    <h1 class="t" style="top:200px;font-size:96px">${head}</h1>
    <p class="sub" style="top:450px;font-size:60px;line-height:1.2;right:64px">${body}</p>${extra}${foot(false)}` });
const badge = (name, bg) => `<i class="badge" style="left:580px;top:800px;width:330px;height:330px;background:${bg};transform:rotate(-6deg)">${icon(name, 160, '#141A33', 2.2)}</i>`;
const certSlide = card({ l: 170, t: 760, w: 740, h: Math.round(740 * 1275 / 1650), rot: 2, src: CERT });
const SB = { 47: [null, ['gamepad-2', C.mint], ['users', C.yellow], 'cert', ['wallet', C.mint], ['message-circle', C.yellow]],
  49: [null, ['mail', C.yellow], 'cert', ['sparkles', C.mint], ['wallet', C.yellow], ['message-circle', C.mint]] };
const extra = (n, i) => { const b = SB[n][i]; return !b ? '' : b === 'cert' ? certSlide : badge(...b); };
const carousel = (p) => [{ theme: p.theme, html: tileHtmlH(p.n) },
  ...p.slides.slice(1).map(([h, b], i) => slide(['k', 'c', 'k', 'n', 'm'][i % 5], FRAMES[(i + p.n) % FRAMES.length], HEAD[p.n][i + 1] || h, BODY[p.n][i + 1] || b, extra(p.n, i + 1)))];

const RUB = { c: 'lab', k: 'lab', y: 'show', m: 'start', n: 'make' };
export const idOfH = (n) => `${n}-${H.find((p) => p.n === n).slug}`;
export const postsH = H.map((p) => ({ id: idOfH(p.n), n: p.n, rubric: RUB[p.theme], no: '', format: p.format === 'Reel' ? 'reel' : 'carousel',
  ai: p.format === 'Reel', title: p.tile.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), caption: p.caption, tt: true,
  ...(p.format === 'Reel' ? { tile: tileHtmlH(p.n) } : { slides: carousel(p) }) }));
export const reelScenesH = Object.fromEntries(H.filter((p) => p.format === 'Reel').map((p, k) => [idOfH(p.n), reel(p, k)]));
