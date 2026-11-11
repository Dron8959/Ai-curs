// Visual kit for the Make Show Lab Instagram system ("make · show · lab").
// Flat brand colour per rubric, navy outlines, hard offset shadows, Sora headlines, real photos and
// kid-made work as sticker cards. Static slides and animated reels are both built from these pieces;
// an element becomes animated in a reel by carrying data-in / data-at (see an()).

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const here = dirname(fileURLToPath(import.meta.url));
export const repo = resolve(here, '..', '..');
export const A = (p) => pathToFileURL(resolve(repo, p)).href;                 // repo asset -> file URL
const mod = (p) => pathToFileURL(resolve(here, 'node_modules', p)).href;
export const LOGO = 'social/brand/logo';
export const M = 'social/media';

export const C = { navy: '#141A33', yellow: '#FFC533', coral: '#FF6F4A', mint: '#5FE0A8', cream: '#FFF4DC', white: '#FFFFFF' };
// rubric -> tile theme class and accent
export const RUBRIC = { show: { theme: 'y', tint: C.yellow }, make: { theme: 'n', tint: C.navy }, lab: { theme: 'c', tint: C.coral }, start: { theme: 'm', tint: C.mint } };

// Animation hook for reels: an('slap', .6) -> the element slaps in 0.6 s after its scene starts.
// Types: pop, slap, rise, slide, write, draw, words, settle. Ignored by the static renderer.
// Reels are cut to the music. BPM is the tempo of the track (sound/audio/design), B one beat in seconds:
// every scene lasts a whole number of beats and every entrance that makes a sound is read on a beat.
export const BPM = 130;
export const B = 60 / BPM;
// from the start of an entrance to the frame the eye reads it: a pop at half its size, a card or a row on contact
export const SYNC = { pop: 0.06, slap: 0.24, slide: 0.21 };
// an(type, seconds): a free entrance.  on(type, beat): the entrance is read exactly on that beat of its scene.
// cue names the sound class when it is not the default one ('none' = silent, 'logo', ...); see render.mjs.
export const an = (type, at = 0, cue = '') => ` data-in="${type}" data-at="${at}"${cue ? ` data-cue="${cue}"` : ''}`;
export const on = (type, beat, cue = '') => an(type, Math.max(0, +(beat * B - (SYNC[type] || 0)).toFixed(4)), cue);

const face = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url(${mod(file)}) format('woff2')}`;

export const css = () => `
${[600, 700, 800].map((w) => face('Sora', w, `@fontsource/sora/files/sora-latin-${w}-normal.woff2`)).join('')}
${[500, 600, 700, 800].map((w) => face('Urbanist', w, `@fontsource/urbanist/files/urbanist-latin-${w}-normal.woff2`)).join('')}
${face('Caveat Brush', 400, '@fontsource/caveat-brush/files/caveat-brush-latin-400-normal.woff2')}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#888;-webkit-font-smoothing:antialiased}
.frame{position:relative;overflow:hidden;background:var(--bg)}
.tile{position:relative;overflow:hidden;width:1080px;height:1440px;background:var(--bg);color:var(--ink);font-family:Urbanist,sans-serif}
.frame>.tile{position:absolute;overflow:visible}
.tile.reel{height:1920px}
.y{--bg:#FFC533;--ink:#141A33;--ink2:#4D3F12;--line:#141A33;--sh:#141A33;--card:#FFF9EC;--mark:#FFFFFF;--markink:#141A33}
.c{--bg:#FF6F4A;--ink:#141A33;--ink2:#4A1D12;--line:#141A33;--sh:#141A33;--card:#FFF4DC;--mark:#FFF4DC;--markink:#141A33}
.m{--bg:#5FE0A8;--ink:#141A33;--ink2:#14432F;--line:#141A33;--sh:#141A33;--card:#FFFFFF;--mark:#FFFFFF;--markink:#141A33}
.n{--bg:#141A33;--ink:#FFF4DC;--ink2:#B9C0DE;--line:#FFF4DC;--sh:#FFC533;--card:#FFF4DC;--mark:#FFC533;--markink:#141A33}
.k{--bg:#FFF4DC;--ink:#141A33;--ink2:#4B5070;--line:#141A33;--sh:#141A33;--card:#FFFFFF;--mark:#FFC533;--markink:#141A33}

/* top row: rubric chip (a piece of the wordmark) and the small mark */
.top{position:absolute;z-index:9;left:64px;right:64px;top:58px;display:flex;justify-content:space-between;align-items:center}
.chip{display:inline-flex;align-items:baseline;gap:14px;height:80px;padding:0 30px;line-height:68px;border:5px solid #141A33;border-radius:999px;background:#fff;color:#141A33;
  font:800 42px/68px Sora;letter-spacing:-.04em;box-shadow:6px 6px 0 #141A33}
.chip i{font:800 26px Urbanist;letter-spacing:.1em;font-style:normal;opacity:.6}
.n .chip{box-shadow:6px 6px 0 #FFC533}
.mini{width:84px;height:84px;display:block}
.page{font:800 30px Urbanist;letter-spacing:.1em;color:var(--ink2)}
.foot{position:absolute;z-index:9;left:64px;right:64px;bottom:54px;display:flex;justify-content:space-between;align-items:center}
.foot span{font:800 28px Urbanist;letter-spacing:.06em;color:var(--ink2)}

/* type */
.t{position:absolute;z-index:8;left:64px;right:64px;top:178px;font:800 138px/.95 Sora;letter-spacing:-.05em}
.t mark,.t .w{display:inline-block}
.t mark{background:var(--mark);color:var(--markink);border-radius:24px;padding:.02em .16em .08em;margin:0 -.07em;transform:rotate(-1.6deg)}
.kick{position:absolute;z-index:8;left:68px;right:64px;font:800 46px/1.15 Urbanist;letter-spacing:-.005em;color:var(--ink)}
.sub{position:absolute;z-index:8;left:68px;right:64px;font:700 46px/1.2 Urbanist;color:var(--ink2)}
.note{position:absolute;z-index:8;font:400 66px/1 'Caveat Brush',cursive;color:var(--ink);white-space:nowrap}
.fine{position:absolute;z-index:8;left:68px;right:64px;font:700 28px/1.3 Urbanist;color:var(--ink2)}

/* sticker cards */
.card{position:absolute;z-index:3;border:6px solid var(--line);border-radius:36px;box-shadow:14px 14px 0 var(--sh);overflow:hidden;background:var(--card)}
.card>img,.card>video{display:block;width:100%;height:100%;object-fit:cover}
.card>.crop{display:block;width:100%;height:100%;background-repeat:no-repeat}
.card.paper{background:#FFFEF8;padding:20px;border-radius:14px}
.card.paper>img{border-radius:4px}
.card.screen{padding-top:44px;background:#141A33}
.card.screen::before{content:"";position:absolute;left:22px;top:15px;width:14px;height:14px;border-radius:50%;background:#FF6F4A;box-shadow:24px 0 0 #FFC533,48px 0 0 #5FE0A8}
.n .card.screen{background:#070A1F}
.card.row{display:flex;align-items:center;gap:26px;padding:0 38px;border-radius:30px}
.card.row b{font:800 54px Sora;letter-spacing:-.04em;color:#141A33;white-space:nowrap}
.card.row span{font:700 50px/1.05 Urbanist;color:#141A33}
.tape{position:absolute;z-index:5;width:170px;height:54px;background:rgba(255,255,255,.66);box-shadow:0 2px 0 rgba(20,26,51,.1)}
.pill{position:absolute;z-index:6;display:inline-flex;align-items:center;height:72px;padding:0 30px;border:5px solid #141A33;border-radius:999px;background:#fff;color:#141A33;
  font:800 31px Urbanist;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;box-shadow:6px 6px 0 #141A33}
.n .pill{box-shadow:6px 6px 0 #070A1F}
.pill.dark{background:#141A33;color:#FFF4DC}
.pill.step{height:112px;padding:0 38px 0 18px;gap:22px;font:800 42px Sora;letter-spacing:-.03em;text-transform:none;background:#FFF4DC}
.pill.step b{display:grid;place-items:center;width:74px;height:74px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 38px Sora}
.pill.time{height:150px;padding:0 44px;font:800 84px Sora;letter-spacing:-.05em;text-transform:none;box-shadow:10px 10px 0 #141A33}
.spark{position:absolute;z-index:6;display:block}
.arrow{position:absolute;z-index:7;fill:none;stroke:var(--ink);stroke-width:9;stroke-linecap:round;stroke-linejoin:round;overflow:visible}

/* the logo's ring as a portrait window */
.ring{position:absolute;z-index:4;border-radius:50%;background:#FFC533;border:6px solid var(--line);padding:24px;box-shadow:14px 14px 0 var(--sh)}
.ring>i{display:block;width:100%;height:100%;border-radius:50%;border:6px solid #141A33;background-color:#C9A27A;background-repeat:no-repeat}
.n .ring{border-color:#141A33;box-shadow:14px 14px 0 #070A1F}

/* numbered badge, button, sticker icon */
.num{position:absolute;z-index:7;display:grid;place-items:center;border-radius:50%;border:6px solid #141A33;background:#FFC533;color:#141A33;font:800 60px Sora;letter-spacing:-.04em;box-shadow:6px 6px 0 #141A33}
.btn{position:absolute;z-index:7;display:inline-flex;align-items:center;gap:22px;height:128px;padding:0 54px;border-radius:999px;border:6px solid #141A33;background:#141A33;color:#FFF4DC;
  font:800 54px Sora;letter-spacing:-.04em;white-space:nowrap;box-shadow:12px 12px 0 #fff}
.badge{position:absolute;z-index:4;display:grid;place-items:center;border-radius:50%;border:6px solid #141A33;box-shadow:12px 12px 0 #141A33}
.char{position:absolute;z-index:4;display:block}

/* reels: 1080×1920, text stays inside x 64–850, y 250–1440 (clear of the Instagram interface) */
.scene{position:absolute;inset:0;visibility:hidden;isolation:isolate}
.scene:first-of-type{visibility:visible}
.reel .t{top:470px;right:230px;font-size:112px}
.reel .sub,.reel .kick{right:230px}
.plate{position:absolute;z-index:9;left:36px;top:234px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.28))}
/* a quiet arc rises from the bottom of every reel scene: the part of the frame the interface covers */
.reel.y{--arc:#FFD568}.reel.c{--arc:#FF8563}.reel.m{--arc:#82E9BE}.reel.n{--arc:#1D2550}.reel.k{--arc:#FFE9BD}
.reel::after{content:"";position:absolute;z-index:0;left:-220px;right:-220px;top:1530px;height:1520px;border-radius:50%;background:var(--arc)}
`;

export const star = (size, fill, style = '', a = '') =>
  `<svg class="spark"${a} style="width:${size}px;height:${size}px;${style}" viewBox="-60 -60 120 120"><path d="M0 -60Q15.6 -15.6 60 0Q15.6 15.6 0 60Q-15.6 15.6 -60 0Q-15.6 -15.6 0 -60Z" fill="${fill}"/></svg>`;

// Hand-drawn arrow: a curve plus a two-stroke head, both given as path data in a w×h box.
export const arrow = (w, h, curve, head, style = '', a = '') =>
  `<svg class="arrow"${a} style="width:${w}px;height:${h}px;${style}" viewBox="0 0 ${w} ${h}"><path d="${curve}"/><path d="${head}"/></svg>`;

// kb: slow zoom on the image while its scene plays (reels only)
// zoom (image width as a percentage of the card) crops into a detail of the photo; without it the photo covers the card
export const card = ({ l, t, w, h, rot = 0, src, pos = 'center', zoom, cls = '', inner = '', z, a = '', kb = false }) =>
  `<div class="card ${cls}"${a} style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg)${z ? `;z-index:${z}` : ''}">${
    !src ? '' : zoom
      ? `<i class="crop"${kb ? ' data-kb' : ''} style="background-image:url(${A(src)});background-position:${pos};background-size:${zoom}% auto"></i>`
      : `<img src="${A(src)}"${kb ? ' data-kb' : ''} style="object-position:${pos}" alt="">`}${inner}</div>`;

// pos and zoom place the face: "x% y%" and the image width as a percentage of the window
export const ring = ({ l, t, d, src, pos = 'center', zoom = 100, z, pad, a = '' }) =>
  `<div class="ring"${a} style="left:${l}px;top:${t}px;width:${d}px;height:${d}px${z ? `;z-index:${z}` : ''}${pad ? `;padding:${pad}px` : ''}"><i style="background-image:url(${A(src)});background-position:${pos};background-size:${zoom}% auto"></i></div>`;

export const pill = (text, l, t, rot = 0, cls = '', style = '', a = '') =>
  `<span class="pill ${cls}"${a} style="left:${l}px;top:${t}px;transform:rotate(${rot}deg);${style}">${text}</span>`;

export const tape = (l, t, rot = -8, style = '', a = '') => `<i class="tape"${a} style="left:${l}px;top:${t}px;transform:rotate(${rot}deg);${style}"></i>`;

export const top = (word, no = '', right = null) =>
  `<div class="top"><span class="chip">${word}${no ? `<i>${no}</i>` : ''}</span>${right ?? `<img class="mini" src="${A(`${LOGO}/logo/icon-small.svg`)}" alt="">`}</div>`;

export const char = (who, l, t, w, style = '', a = '') =>
  `<img class="char"${a} src="${A(`${LOGO}/logo/char-${who}.svg`)}" style="left:${l}px;top:${t}px;width:${w}px;${style}" alt="">`;

// lucide icon as inline svg with our stroke
export const icon = (name, size, color, sw = 2.2, style = '') => {
  const raw = readFileSync(resolve(here, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8');
  return raw.replace('<svg', `<svg style="width:${size}px;height:${size}px;display:block;${style}"`).replace(/stroke="currentColor"/, `stroke="${color}"`).replace(/stroke-width="2"/, `stroke-width="${sw}"`).replace(/\s(width|height)="24"/g, '');
};

// Slide footer: the wordmark in the tile's ink (inlined, file:// masks are blocked) and the handle,
// so a screenshot of any slide still says whose it is.
const monoWordmark = readFileSync(resolve(repo, LOGO, 'logo/wordmark-light.svg'), 'utf8')
  .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="currentColor"').replace(/ width="[\d.]+" height="[\d.]+"/, ' style="height:34px;width:auto;display:block;color:var(--ink)"');
export const foot = (handle = true) => `<div class="foot">${monoWordmark}${handle ? '<span>@make_showlab</span>' : ''}</div>`;

// Reel pieces: the plate that sits on every scene, and the closing card with the stacked logo.
export const plate = () => `<img class="plate" src="${A(`${LOGO}/reels/plate.svg`)}" alt="">`;
// The closing card lasts seven beats: the cut, then the logo on beat 1 (a bar line: the music's last chord lands
// on it), the button on beat 3, the link line on beat 4.
export const endScene = (line) => ({ theme: 'n', beats: 7, wipe: '500,900', swish: true, end: true, html: `
  <h1 class="t"${an('words', 0.02)} style="top:320px;left:0;right:80px;text-align:center;font-size:96px">${line}</h1>
  <img${on('pop', 1, 'logo')} src="${A(`${LOGO}/reels/end-logo.svg`)}" style="position:absolute;z-index:5;left:140px;top:590px;width:720px" alt="">
  <span class="btn"${on('pop', 3)} style="left:170px;top:1220px;width:660px;justify-content:center;background:${C.yellow};color:#141A33;border-color:${C.yellow};box-shadow:12px 12px 0 #070A1F">First lesson free</span>
  <p class="sub"${an('rise', +(4 * B).toFixed(4))} style="top:1380px;left:0;right:80px;text-align:center;font-size:50px;color:#FFF4DC">Link in bio</p>` });
