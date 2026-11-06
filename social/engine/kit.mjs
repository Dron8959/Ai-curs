// Shared visual kit for posts and reels: the warm "kitchen-table scrapbook" look
// built from the landing page (navy card with a yellow sun, colored icon stickers,
// photos in white frames, highlighter swipes) plus tape, handwritten notes and Robo,
// the robot from the logo.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const repo = resolve(here, '..', '..');
export const asset = (p) => pathToFileURL(resolve(repo, p)).href;
const mod = (p) => pathToFileURL(resolve(here, 'node_modules', p)).href;

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// **word** highlighter · _word_ gold · ~word~ handwritten · \n line break
export const rich = (s = '') =>
  esc(s)
    .replace(/\*\*([\s\S]+?)\*\*/g, '<span class="swipe">$1</span>')
    .replace(/~([\s\S]+?)~/g, '<span class="hand">$1</span>')
    .replace(/_([\s\S]+?)_/g, '<span class="gold">$1</span>')
    .replace(/\n/g, '<br>');

// Sticker colours match the icon circles on the landing's "Meet Kamilla" card.
export const STICKER = {
  'gamepad-2': '#f2605a', music: '#4fc98a', clapperboard: '#ffffff', 'code-xml': '#ffffff', shirt: '#4fc98a',
  sparkles: '#ffc533', heart: '#f2605a', 'shield-check': '#ffc533', globe: '#ffc533', image: '#ffc533',
  pencil: '#ffc533', star: '#ffc533', clock: '#ffffff', palette: '#f2605a', 'wand-sparkles': '#ffc533',
};
const iconCache = {};
export function icon(name) {
  if (!iconCache[name]) {
    iconCache[name] = readFileSync(resolve(here, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/class="[^"]*"/, '')
      .replace(/width="24"/, '').replace(/height="24"/, '');
  }
  return iconCache[name];
}
export const sticker = (name, cls = '', style = '') =>
  `<span class="sticker ${cls}" style="--c:${STICKER[name] || '#ffc533'};${style}">${icon(name)}</span>`;

// Four-point sparkle, as on the landing.
export const sparkle = (cls = '', style = '') =>
  `<svg class="sparkle ${cls}" style="${style}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0C21.5 12 28 18.5 40 20C28 21.5 21.5 28 20 40C18.5 28 12 21.5 0 20C12 18.5 18.5 12 20 0Z"/></svg>`;

// Hand-drawn arrow; dir = 'down-left' | 'down-right' | 'left' | 'right' | 'up-right'
export function arrow(dir = 'down-left', cls = '', style = '') {
  const paths = {
    'down-left': ['M150 10 C 140 70, 90 105, 22 112', 'M44 92 L 20 112 L 46 128'],
    'down-right': ['M10 10 C 20 70, 70 105, 138 112', 'M116 92 L 140 112 L 114 128'],
    right: ['M8 70 C 50 30, 100 30, 150 62', 'M126 40 L 152 64 L 120 76'],
    left: ['M152 70 C 110 30, 60 30, 10 62', 'M34 40 L 8 64 L 40 76'],
    'up-right': ['M10 120 C 30 60, 80 30, 146 22', 'M122 8 L 148 22 L 126 42'],
  }[dir];
  return `<svg class="arrow ${cls}" style="${style}" viewBox="0 0 160 140" aria-hidden="true">${paths
    .map((d) => `<path d="${d}"/>`)
    .join('')}</svg>`;
}

// Robo, the robot from the logo, redrawn as clean vector so it stays sharp at any size.
export function robo(cls = '', style = '', { wave = false } = {}) {
  return `<svg class="robo ${cls}" style="${style}" viewBox="0 0 240 260" aria-hidden="true">
  <g class="robo-body">
    <g class="robo-antenna"><path d="M120 52 V24" stroke="#141a33" stroke-width="8" stroke-linecap="round"/><circle cx="120" cy="20" r="13" fill="#22a6b3" stroke="#141a33" stroke-width="6"/></g>
    <rect x="80" y="196" width="80" height="44" rx="18" fill="#fff" stroke="#141a33" stroke-width="8"/>
    <path d="M98 206 V232 M112 206 V232 M128 206 V232 M142 206 V232" stroke="#f5a623" stroke-width="6"/>
    <path d="M105 206 V232 M135 206 V232" stroke="#22a6b3" stroke-width="5"/>
    ${wave ? `<g class="robo-arm"><path d="M172 196 C 196 180, 204 160, 206 138" fill="none" stroke="#141a33" stroke-width="10" stroke-linecap="round"/><circle cx="207" cy="130" r="13" fill="#fff" stroke="#141a33" stroke-width="7"/></g>` : ''}
    <rect x="22" y="104" width="30" height="58" rx="15" fill="#22a6b3" stroke="#141a33" stroke-width="7"/>
    <rect x="188" y="104" width="30" height="58" rx="15" fill="#22a6b3" stroke="#141a33" stroke-width="7"/>
    <circle cx="120" cy="132" r="80" fill="#fff" stroke="#141a33" stroke-width="9"/>
    <path d="M52 140 A68 68 0 0 1 188 140" fill="none" stroke="#f5a623" stroke-width="16" stroke-linecap="round"/>
    <path d="M60 150 A60 60 0 0 1 180 150" fill="none" stroke="#141a33" stroke-width="4" opacity=".15"/>
    <g class="robo-eyes">
      <circle cx="93" cy="138" r="21" fill="#22a6b3" stroke="#141a33" stroke-width="6"/>
      <circle cx="147" cy="138" r="21" fill="#22a6b3" stroke="#141a33" stroke-width="6"/>
      <circle cx="86" cy="131" r="7" fill="#fff"/><circle cx="140" cy="131" r="7" fill="#fff"/>
    </g>
    <path d="M100 174 Q120 190 140 174" fill="none" stroke="#141a33" stroke-width="7" stroke-linecap="round"/>
    <circle cx="74" cy="168" r="7" fill="#ffc533" opacity=".8"/><circle cx="166" cy="168" r="7" fill="#ffc533" opacity=".8"/>
  </g>
</svg>`;
}

export const photo = (src, { cls = '', tape = true, style = '', pos = 'center' } = {}) =>
  src
    ? `<figure class="pic ${cls}" style="${style}">${tape ? '<i class="tape t1"></i><i class="tape t2"></i>' : ''}<img src="${asset(src)}" style="object-position:${pos}" alt=""></figure>`
    : '';

const SWIPE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath fill='%23ffc533' d='M4 8L15 5L28 7L42 4L57 6L71 3L86 6L101 4L116 6L131 3L146 6L161 4L175 6L188 3L196 7L194 14L198 21L195 28L197 35L185 37L171 35L157 38L142 35L127 37L112 35L97 38L82 35L67 37L52 35L37 38L23 35L10 37L3 34L6 27L2 20L5 13Z'/%3E%3C/svg%3E")`;
// Paper grain as an SVG turbulence filter, tiled.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .36 0 0 0 0 .2 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function baseCss() {
  return `
@font-face{font-family:'Bricolage Grotesque';font-weight:700 800;src:url(${asset('assets/fonts/bricolage-grotesque-latin.woff2')}) format('woff2')}
@font-face{font-family:'Figtree';font-weight:400 700;src:url(${asset('assets/fonts/figtree-latin.woff2')}) format('woff2')}
@font-face{font-family:'Caveat';font-weight:700;src:url(${mod('@fontsource/caveat/files/caveat-latin-700-normal.woff2')}) format('woff2')}
:root{--cream:#fbf4e6;--cream2:#f6ead2;--paper:#fffaf0;--ink:#141a33;--navy:#141a33;--yellow:#ffc533;--ysoft:#fff1cf;--gold:#ab8422;
--text:#4a4f63;--coral:#f2605a;--mint:#4fc98a;--teal:#22a6b3;--line:#eadfc8;--swipe:${SWIPE};--grain:${GRAIN}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Figtree,sans-serif;color:var(--text);-webkit-font-smoothing:antialiased;overflow:hidden}
.paper{background:var(--grain),radial-gradient(1200px 700px at 85% -10%,#fff6dc 0,transparent 60%),radial-gradient(900px 700px at -10% 110%,#f8e3bd 0,transparent 55%),var(--cream)}
.navy{background:var(--grain),radial-gradient(900px 900px at 50% 40%,#1c2448 0,var(--navy) 70%);color:rgba(255,255,255,.88)}
.title{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;line-height:1.0;color:var(--ink);text-wrap:balance}
.navy .title{color:#fff}
.swipe{padding:0 .1em;margin:0 -.04em;background:var(--swipe) center 62%/100% 72% no-repeat;-webkit-box-decoration-break:clone;box-decoration-break:clone;color:var(--ink)}
.navy .swipe{background:none;color:var(--yellow);padding:0;margin:0}
.gold{color:var(--gold)}.navy .gold{color:var(--yellow)}
.hand{font-family:Caveat,cursive;font-weight:700;color:var(--gold);letter-spacing:0;font-size:1.12em}
.navy .hand{color:var(--yellow)}
.note{position:absolute;z-index:6;font-family:Caveat,cursive;font-weight:700;font-size:54px;line-height:.95;color:var(--ink);white-space:nowrap}
.navy .note{color:#fff}
.note.y{color:var(--gold)}.navy .note.y{color:var(--yellow)}
.arrow{position:absolute;z-index:6;width:150px;height:130px;fill:none;stroke:var(--ink);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.navy .arrow,.arrow.y{stroke:var(--yellow)}
.pic{position:relative;margin:0;background:#fff;padding:14px;border-radius:30px;box-shadow:0 46px 70px -40px rgba(60,40,10,.55),0 12px 26px -16px rgba(60,40,10,.35)}
.pic img{display:block;width:100%;height:100%;object-fit:cover;border-radius:20px}
.tape{position:absolute;z-index:3;width:150px;height:46px;background:rgba(255,214,110,.78);box-shadow:0 2px 6px rgba(80,60,10,.15);mix-blend-mode:multiply}
.tape.t1{top:-18px;left:30px;transform:rotate(-8deg)}
.tape.t2{bottom:-16px;right:36px;transform:rotate(6deg)}
.sticker{position:absolute;z-index:5;display:grid;place-items:center;width:104px;height:104px;border-radius:50%;background:var(--c);box-shadow:0 14px 24px -12px rgba(20,26,51,.45)}
.sticker svg{width:50px;height:50px;stroke:#141a33;stroke-width:2.2;fill:none}
.sticker.sm{width:78px;height:78px}.sticker.sm svg{width:38px;height:38px}
.sparkle{position:absolute;z-index:4;width:54px;height:54px;fill:var(--yellow)}
.sparkle.w{fill:#fff}.sparkle.sm{width:34px;height:34px}
.robo{position:absolute;z-index:7;width:220px;height:240px;filter:drop-shadow(0 16px 18px rgba(20,26,51,.25))}
.bubble{position:absolute;z-index:7;background:#fff;color:var(--ink);font-family:Caveat,cursive;font-weight:700;font-size:48px;line-height:1;padding:22px 30px 26px;border-radius:34px;box-shadow:0 18px 30px -18px rgba(20,26,51,.4);white-space:nowrap}
.bubble::after{content:"";position:absolute;width:34px;height:34px;background:#fff;bottom:-12px;left:46px;transform:rotate(45deg);border-radius:6px}
.bubble.r::after{left:auto;right:46px}
.sun{position:absolute;z-index:0;border-radius:50%;background:var(--yellow)}
.dot{position:absolute;z-index:1;border-radius:50%;background:#fff}
.chip{display:inline-flex;align-items:center;gap:14px;padding:12px 24px 12px 14px;border-radius:999px;background:#fff;color:var(--ink);font-weight:700;font-size:26px;box-shadow:0 10px 22px -14px rgba(60,40,10,.5)}
.chip img{width:40px;height:40px;border-radius:11px}
.navy .chip{background:rgba(255,255,255,.1);color:#fff;box-shadow:none}
.kick{position:relative;display:inline-block;isolation:isolate;padding:.45em .9em;font-weight:700;font-size:30px;line-height:1;color:var(--ink);transform:rotate(-2deg)}
.kick::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--swipe) center/100% 100% no-repeat}
`;
}
