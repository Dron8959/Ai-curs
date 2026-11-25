// Pack 3 reels and carousels, the same template as pack 2 (review/week2-reels.mjs): the cover as scene 1, three
// scenes of one short line each over a tinted frame of Kamilla's cartoon, the closing card. Anna's voice.
import { C, M, B, an, on, card, ring, icon, plate, endScene, cartoonBg, top, foot } from '../kit.mjs';
import { bubble } from './week2-art.mjs';
import { W3 } from './week3-texts.mjs';
import { TILES3, BG3, tileHtml3 } from './week3-art.mjs';

const A = (type, beat, rev) => (rev ? `${on(type, beat)} data-reveal` : on(type, beat));
const h1 = (html, top = 470, size = 92) => `<h1 class="t"${an('words', 0.15)} style="top:${top}px;font-size:${size}px">${html}</h1>`;
const BADGE = [C.yellow, C.mint, C.coral];
// one picture per scene (y 820-1440, x 64-850), from the spec string in week3-texts.mjs
const vis = (spec, i) => (r) => {
  const [kind, ...rest] = spec.split(':'); const arg = rest.join(':');
  if (kind === 'say' || kind === 'say-me') return `<div${A('pop', 2, r)} style="position:absolute;inset:0;z-index:5">${bubble(arg, 80, 900, 720, { me: kind === 'say-me', size: 54 })}</div>`;
  if (kind === 'icon') return `<i class="badge"${A('pop', 2, r)} style="left:250px;top:860px;width:380px;height:380px;background:${BADGE[i % 3]};transform:rotate(-6deg)">${icon(arg, 190, '#141A33', 2.2)}</i>`;
  if (kind === 'img') return card({ l: 110, t: 820, w: 660, h: 600, rot: -2, src: `${M}/${arg}`, a: A('slap', 2, r), kb: true });
  if (kind === 'ring') return ring({ l: 230, t: 840, d: 440, src: `${M}/landing/reviews/${arg}.jpg`, pos: '50% 25%', zoom: 175, pad: 16, a: A('pop', 2, r) });
  throw new Error(`unknown picture ${spec}`);
};
const FRAMES = ['f1', 'f5', 'f9', 'f11', 'f14', 'f17', 'f19', 'f22', 'f3', 'f8'];
const flat = (theme, frame, line, v, reveal) => ({ theme, beats: 9, html: `${cartoonBg(frame, 0.78)}${plate()}${h1(line)}${v(reveal)}` });
const cover = (n) => ({ theme: TILES3[n].theme, beats: 9, html: `${cartoonBg('f3', 1)}<div${an('settle', 0)} style="position:absolute;z-index:2;left:0;top:240px;width:1080px;height:1440px;overflow:hidden" class="tile ${TILES3[n].theme}">${tileHtml3(n)}</div>` });
const alt = (t) => (t === 'k' ? 'c' : 'k');
// LONG: a closing line longer than the card gets more beats on the card (as in pack 2)
const LONG = { 39: { end: 9 } };
const reel = (p, k) => [cover(p.n), ...p.scenes.map(([line, spec], i) => ({ ...flat(i === 1 ? alt(p.theme) : p.theme, FRAMES[(k * 3 + i) % FRAMES.length], line, vis(spec, i), i === 2),
  wipe: ['450,800', '300,700', '450,700'][i], swish: i === 2 })), { ...endScene(p.end), ...(LONG[p.n]?.end ? { beats: LONG[p.n].end } : {}) }];

// carousels: the tile, then one slide per point
const slide = (theme, frame, head, body, extra = '') => ({ theme, html: `${cartoonBg(frame, 0.84)}${top('')}
    <h1 class="t" style="top:200px;font-size:92px">${head}</h1>
    <p class="sub" style="top:640px;font-size:58px;right:110px">${body}</p>${extra}${foot(false)}` });
const badge = (name, bg) => `<i class="badge" style="left:600px;top:960px;width:330px;height:330px;background:${bg};transform:rotate(-6deg)">${icon(name, 160, '#141A33', 2.2)}</i>`;
const SB = { 41: [null, ['user-check', C.mint], ['ban', C.yellow], ['search-check', C.mint], ['message-circle', C.yellow], null],
  42: [null, ['user-check', C.mint], ['message-circle-off', C.yellow], ['ban', C.mint], ['link', C.yellow], ['scan-search', C.mint], null] };
const carousel = (p) => [{ theme: p.theme, html: tileHtml3(p.n) },
  ...p.slides.slice(1).map(([h, b], i) => slide(['k', 'c', 'k', 'c', 'n', 'm'][i % 6], FRAMES[(i * 2 + p.n) % FRAMES.length], h, b, SB[p.n][i + 1] ? badge(...SB[p.n][i + 1]) : ''))];

const RUB = { c: 'lab', k: 'lab', y: 'show', m: 'start', n: 'make' };
export const idOf3 = (n) => `${n}-${W3.find((p) => p.n === n).slug}`;
export const posts3 = W3.map((p) => ({ id: idOf3(p.n), n: p.n, rubric: RUB[p.theme], no: '', format: p.format === 'Reel' ? 'reel' : 'carousel',
  ai: p.format === 'Reel', title: p.tile.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), caption: p.caption, tt: true,
  ...(p.format === 'Reel' ? { tile: tileHtml3(p.n) } : { slides: carousel(p) }) }));
export const reelScenes3 = Object.fromEntries(W3.filter((p) => p.format === 'Reel').map((p, k) => [idOf3(p.n), reel(p, k)]));
