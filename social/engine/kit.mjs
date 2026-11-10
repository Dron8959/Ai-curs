// Shared visual kit for posts and reels, matched to the live landing (www.makeshowlab.com):
// deep-space page (#02040D), glowing italic Archivo caps headlines, Urbanist body, the orange
// planet horizon, orange gradient accents, teal dots, real family photos in rounded frames,
// and the astronaut boy (logo + hero art).

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const repo = resolve(here, '..', '..');
export const asset = (p) => pathToFileURL(resolve(repo, p)).href;
const mod = (p) => pathToFileURL(resolve(here, 'node_modules', p)).href;

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// **word** orange glow · _word_ gold · ~word~ soft italic · \n line break
export const rich = (s = '') =>
  esc(s)
    .replace(/\*\*([\s\S]+?)\*\*/g, '<span class="swipe">$1</span>')
    .replace(/~([\s\S]+?)~/g, '<span class="hand">$1</span>')
    .replace(/_([\s\S]+?)_/g, '<span class="gold">$1</span>')
    .replace(/\n/g, '<br>');

// Icon colour per sticker, from the landing palette (orange, teal, gold, pale blue).
export const STICKER = {
  'gamepad-2': '#FF8A3D', music: '#3FC7C0', clapperboard: '#FFC36B', 'code-xml': '#BFD4FF', shirt: '#3FC7C0',
  sparkles: '#FFC36B', heart: '#FF8A3D', 'shield-check': '#3FC7C0', globe: '#BFD4FF', image: '#FFC36B',
  pencil: '#FF8A3D', star: '#FFC36B', clock: '#BFD4FF', palette: '#FF8A3D', 'wand-sparkles': '#FFC36B',
  mic: '#3FC7C0', sticker: '#FF8A3D', 'mail': '#FFC36B', rocket: '#FF8A3D',
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
  `<span class="sticker ${cls}" style="--c:${STICKER[name] || '#FF8A3D'};${style}">${icon(name)}</span>`;

// Four-point star.
export const sparkle = (cls = '', style = '') =>
  `<svg class="sparkle ${cls}" style="${style}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0C21.5 12 28 18.5 40 20C28 21.5 21.5 28 20 40C18.5 28 12 21.5 0 20C12 18.5 18.5 12 20 0Z"/></svg>`;

export function arrow(dir = 'down-left', cls = '', style = '') {
  const paths = {
    'down-left': ['M150 10 C 140 70, 90 105, 22 112', 'M44 92 L 20 112 L 46 128'],
    'down-right': ['M10 10 C 20 70, 70 105, 138 112', 'M116 92 L 140 112 L 114 128'],
    right: ['M8 70 C 50 30, 100 30, 150 62', 'M126 40 L 152 64 L 120 76'],
    left: ['M152 70 C 110 30, 60 30, 10 62', 'M34 40 L 8 64 L 40 76'],
    'up-right': ['M10 120 C 30 60, 80 30, 146 22', 'M122 8 L 148 22 L 126 42'],
  }[dir];
  return `<svg class="arrow ${cls}" style="${style}" viewBox="0 0 160 140" aria-hidden="true">${paths.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
}

// Logo: the astronaut boy's face in an orange ring (from the landing's touch icon).
export function logoSrc() {
  for (const p of ['social/media/brand/logo.png', 'social/media/landing/logo-180.png', 'assets/img/logo.png']) {
    if (existsSync(resolve(repo, p))) return p;
  }
}
// Mascot badge (kept under the old name "robo" so existing specs still work).
export function robo(cls = '', style = '') {
  return `<span class="robo ${cls}" style="${style}"><img src="${asset(logoSrc())}" alt=""></span>`;
}
// The full astronaut from the landing hero, fading into space at the edges.
export const astro = (cls = '', style = '') =>
  `<span class="astro ${cls}" style="${style}"><img src="${asset('social/media/landing/astro.jpg')}" alt=""></span>`;

export const photo = (src, { cls = '', style = '', pos = 'center' } = {}) =>
  src ? `<figure class="pic ${cls}" style="${style}"><img src="${asset(src)}" style="object-position:${pos}" alt=""></figure>` : '';

export function baseCss() {
  return `
@font-face{font-family:'Archivo';font-style:italic;font-weight:100 900;font-stretch:62% 125%;src:url(${mod('@fontsource-variable/archivo/files/archivo-latin-wdth-italic.woff2')}) format('woff2')}
@font-face{font-family:'Urbanist';font-weight:400;src:url(${mod('@fontsource/urbanist/files/urbanist-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'Urbanist';font-weight:500;src:url(${mod('@fontsource/urbanist/files/urbanist-latin-500-normal.woff2')}) format('woff2')}
@font-face{font-family:'Urbanist';font-weight:600;src:url(${mod('@fontsource/urbanist/files/urbanist-latin-600-normal.woff2')}) format('woff2')}
@font-face{font-family:'Urbanist';font-weight:700;src:url(${mod('@fontsource/urbanist/files/urbanist-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Urbanist';font-weight:800;src:url(${mod('@fontsource/urbanist/files/urbanist-latin-800-normal.woff2')}) format('woff2')}
:root{--page:#02040D;--panel:#0A1024;--panel2:#111A3A;--blue:#3B6CFF;--pale:#BFD4FF;--muted:#CDD2E6;--muted2:#8E96B8;
--orange:#FF8A3D;--gold:#FFC36B;--teal:#3FC7C0;--red:#E62E2E;--line:rgba(205,210,230,.16);--ink:#FFFFFF;--text:#CDD2E6;
--glow:0 0 .12em rgba(255,255,255,.65),0 0 .3em rgba(191,212,255,.5),0 0 .6em rgba(59,108,255,.45)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Urbanist,system-ui,sans-serif;color:var(--text);-webkit-font-smoothing:antialiased;overflow:hidden;background:var(--page)}
.paper{background:
  radial-gradient(1.6px 1.6px at 12% 18%,rgba(255,255,255,.75),transparent 60%),radial-gradient(1.4px 1.4px at 78% 9%,rgba(255,255,255,.6),transparent 60%),
  radial-gradient(1.2px 1.2px at 64% 34%,rgba(255,255,255,.5),transparent 60%),radial-gradient(1.8px 1.8px at 90% 46%,rgba(191,212,255,.7),transparent 60%),
  radial-gradient(1.3px 1.3px at 30% 52%,rgba(255,255,255,.45),transparent 60%),radial-gradient(1.5px 1.5px at 6% 70%,rgba(255,255,255,.55),transparent 60%),
  radial-gradient(1200px 800px at 50% -20%,rgba(59,108,255,.22),transparent 60%),var(--page)}
.navy{background:radial-gradient(900px 700px at 80% -10%,rgba(255,138,61,.18),transparent 60%),radial-gradient(1000px 900px at 10% 110%,rgba(59,108,255,.22),transparent 60%),linear-gradient(180deg,var(--panel) 0%,var(--page) 100%)}
.planet::after{content:"";position:absolute;z-index:0;left:-40%;right:-40%;bottom:-62%;height:80%;border-radius:50%;
  background:radial-gradient(closest-side,var(--page) 96%,transparent 100%);
  box-shadow:0 -2px 0 rgba(255,195,107,.85),0 -18px 60px -6px rgba(255,138,61,.75),0 -60px 160px -20px rgba(255,138,61,.45),inset 0 30px 80px -30px rgba(255,138,61,.35)}
.title{font-family:Archivo,'Arial Black',sans-serif;font-style:italic;font-weight:900;font-stretch:94%;letter-spacing:-.02em;line-height:.95;
  color:#fff;text-transform:uppercase;text-wrap:balance;text-shadow:var(--glow)}
.swipe{background:linear-gradient(180deg,#FFD08A 0%,#FF8A3D 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;
  filter:drop-shadow(0 0 .18em rgba(255,138,61,.55));padding-right:.06em}
.gold{color:var(--gold)}
.hand{font-style:italic;color:var(--pale)}
.note{position:absolute;z-index:6;display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;background:rgba(17,26,58,.92);
  box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -10px rgba(0,0,0,.6);font-family:Urbanist;font-weight:700;font-size:28px;line-height:1.1;color:#fff;white-space:nowrap}
.note::before{content:"";width:12px;height:12px;border-radius:50%;background:var(--teal);box-shadow:0 0 10px var(--teal)}
.note.y{background:linear-gradient(180deg,#FFD08A,#FF8A3D);color:#1A0A02;text-transform:uppercase;letter-spacing:.08em;font-size:24px;font-weight:800}
.note.y::before{display:none}
.arrow{position:absolute;z-index:6;width:150px;height:130px;fill:none;stroke:var(--teal);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px rgba(63,199,192,.6))}
.arrow.y{stroke:var(--gold);filter:drop-shadow(0 0 6px rgba(255,138,61,.6))}
.pic{position:relative;margin:0;border-radius:30px;overflow:hidden;background:var(--panel);box-shadow:inset 0 0 0 1px var(--line),0 40px 90px -40px rgba(59,108,255,.55),0 20px 40px -20px rgba(0,0,0,.7)}
.pic img{display:block;width:100%;height:100%;object-fit:cover}
.pic::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.14);pointer-events:none}
.tape{display:none}
.sticker{position:absolute;z-index:5;display:grid;place-items:center;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#1a2550,var(--panel));
  box-shadow:inset 0 0 0 1.5px var(--line),0 0 30px -6px color-mix(in srgb,var(--c) 60%,transparent)}
.sticker svg{width:46px;height:46px;stroke:var(--c);stroke-width:2.2;fill:none;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--c) 70%,transparent))}
.sticker.sm{width:76px;height:76px}.sticker.sm svg{width:34px;height:34px}
.sparkle{position:absolute;z-index:4;width:40px;height:40px;fill:#fff;filter:drop-shadow(0 0 8px rgba(191,212,255,.9))}
.sparkle.w{fill:var(--gold);filter:drop-shadow(0 0 8px rgba(255,138,61,.9))}.sparkle.sm{width:24px;height:24px}
.robo{position:absolute;z-index:7;width:190px;height:auto!important;aspect-ratio:1;transform-origin:50% 80%}
.robo img{display:block;width:100%;height:100%;border-radius:50%;box-shadow:0 0 0 4px rgba(255,138,61,.35),0 0 40px rgba(255,138,61,.55)}
.astro{position:absolute;z-index:1;display:block;overflow:hidden;-webkit-mask-image:radial-gradient(ellipse 50% 55% at 50% 55%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 55% at 50% 55%,#000 62%,transparent 100%)}
.astro img{width:100%;height:100%;object-fit:cover;object-position:50% 40%;display:block}
.bubble{position:absolute;z-index:7;background:#fff;color:#0A1024;font-family:Urbanist;font-weight:800;font-size:34px;line-height:1.05;padding:18px 26px;border-radius:28px;box-shadow:0 0 30px rgba(191,212,255,.35);white-space:nowrap}
.bubble::after{content:"";position:absolute;width:28px;height:28px;background:#fff;bottom:-10px;left:40px;transform:rotate(45deg);border-radius:5px}
.bubble.r::after{left:auto;right:40px}
.sun{position:absolute;z-index:0;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(255,138,61,.5),rgba(255,138,61,.12) 45%,transparent 70%)}
.dot{position:absolute;z-index:1;border-radius:50%;background:#fff;box-shadow:0 0 10px rgba(191,212,255,.9)}
.chip{display:inline-flex;align-items:center;gap:14px;font-family:Archivo;font-style:italic;font-weight:900;font-stretch:94%;font-size:30px;letter-spacing:-.01em;color:#fff;text-transform:uppercase}
.chip img{width:52px;height:52px;border-radius:50%}
.chip b{color:var(--orange);font-weight:900}
.kick{display:inline-flex;align-items:center;gap:14px;font-family:Urbanist;font-weight:700;font-size:24px;letter-spacing:.26em;text-transform:uppercase;color:var(--muted)}
.kick::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--orange);box-shadow:0 0 12px var(--orange)}
.q{font-family:Urbanist;font-weight:500;font-size:32px;color:var(--muted2)}
`;
}
