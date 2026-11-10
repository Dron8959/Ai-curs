// Builds the makeshowlab lock-ups from the icon (make_icon.py) and outlined type.
//   node build.mjs <fonts-dir>      fonts-dir holds node_modules with opentype.js, @fontsource/sora, @fontsource/urbanist
// Type: Sora ExtraBold (wordmark, tracking -40) and Urbanist Bold (tagline). Both SIL OFL 1.1.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const F = resolve(process.argv[2]);
const require = createRequire(F + '/');
const opentype = require('opentype.js');
const load = (p) => { const b = readFileSync(resolve(F, 'node_modules', p)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const sora = load('@fontsource/sora/files/sora-latin-800-normal.woff');
const urb = load('@fontsource/urbanist/files/urbanist-latin-700-normal.woff');
const icons = JSON.parse(readFileSync('icons.json', 'utf8'));

const C = { navy: '#141A33', yellow: '#FFC533', cream: '#FFF4DC', coral: '#FF6F4A', mint: '#5FE0A8', space: '#070A1F' };
const DARK = { make: C.cream, show: C.yellow, lab: C.coral, tag: '#A9B0D0', plus: C.mint };
const LIGHT = { make: C.navy, show: '#F2A200', lab: '#F25C36', tag: '#5B6180', plus: '#1FAF7A' };
const n = (v) => +v.toFixed(2);
// Own serializer: opentype.js toPathData() emits NaN for some coordinates.
const d = (path) => path.commands.map((c) => {
  if (c.type === 'M' || c.type === 'L') return `${c.type}${n(c.x)} ${n(c.y)}`;
  if (c.type === 'Q') return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
  if (c.type === 'C') return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
  return 'Z';
}).join('');

const PAIRS = { es: 0.014, wl: -0.012, ke: 0.004 };   // hand kerning for the wordmark, in em
function layout(font, text, size, track) {
  const k = size / font.unitsPerEm; let x = 0; const gs = font.stringToGlyphs(text); const items = [];
  gs.forEach((g, i) => { if (i) x += font.getKerningValue(gs[i - 1], g) * k + (track + (PAIRS[text[i - 1] + text[i]] || 0)) * size; items.push({ g, x, ch: text[i] }); x += g.advanceWidth * k; });
  return items;
}
// Sora's "l" carries a flag at the top left and reads as "1" in "show1ab": the wordmark uses a plain stem.
function plainL(gp) {
  const xs = [...new Set(gp.commands.filter((c) => c.x !== undefined).map((c) => +c.x.toFixed(3)))].sort((a, b) => a - b);
  const b = gp.getBoundingBox(); const [x1, x2] = [xs[xs.length - 2], xs[xs.length - 1]];
  const p = new opentype.Path(); p.moveTo(x1, b.y1); p.lineTo(x2, b.y1); p.lineTo(x2, b.y2); p.lineTo(x1, b.y2); p.close(); return p;
}
function run(items, from, to, size, dx, dy, custom = false) {
  const p = new opentype.Path();
  for (let i = from; i < to; i++) {
    const gp = items[i].g.getPath(items[i].x + dx, dy, size);
    p.extend(custom && items[i].ch === 'l' ? plainL(gp) : gp);
  }
  return p;
}
// Wordmark with its ink box starting at (x, top). Returns paths + metrics.
function wordmark(size, x, top, col) {
  const it = layout(sora, 'makeshowlab', size, -0.04);
  const probe = run(it, 0, 11, size, 0, 0, true).getBoundingBox();
  const dx = x - probe.x1, dy = top - probe.y1;
  const parts = [[0, 4, col.make], [4, 8, col.show], [8, 11, col.lab]];
  const svg = parts.map(([a, b, fill]) => `<path d="${d(run(it, a, b, size, dx, dy, true))}" fill="${fill}"/>`).join('');
  return { svg, x1: x, x2: x + (probe.x2 - probe.x1), top, baseline: dy, w: probe.x2 - probe.x1, h: probe.y2 - probe.y1 };
}
// Tagline tracked out so its ink runs exactly from x1 to x2; top = cap top.
const TAG = 'AI CREATIVITY FOR KIDS + PARENTS';
function tagline(size, x1, x2, top, col) {
  const w0 = (() => { const b = run(layout(urb, TAG, size, 0), 0, TAG.length, size, 0, 0).getBoundingBox(); return b.x2 - b.x1; })();
  const track = ((x2 - x1) - w0) / ((TAG.length - 1) * size);
  const it = layout(urb, TAG, size, track);
  const probe = run(it, 0, TAG.length, size, 0, 0).getBoundingBox();
  const dx = x1 - probe.x1, dy = top - probe.y1;
  const plus = TAG.indexOf('+');
  const svg = `<path d="${d(run(it, 0, plus, size, dx, dy))}${d(run(it, plus + 1, TAG.length, size, dx, dy))}" fill="${col.tag}"/>`
    + `<path d="${d(run(it, plus, plus + 1, size, dx, dy))}" fill="${col.plus}"/>`;
  return { svg, track, h: probe.y2 - probe.y1 };
}
// Icon variant placed so its ring (outer edge) has diameter d and centre (cx, cy).
function icon(kind, cx, cy, d) {
  const v = icons[kind]; const k = d / (2 * v.r);
  return `<g transform="translate(${n(cx - icons.cx * k)} ${n(cy - icons.cy * k)}) scale(${n(k)})">${v.svg}</g>`;
}
const svg = (w, h, inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}" width="${n(w)}" height="${n(h)}">${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}${inner}</svg>`;

// ---- horizontal: icon + wordmark + tagline ----------------------------------------------
function horizontal(col, withTag = true) {
  const S = 200, D = 2.36 * S, pad = 44, lift = 0.048 * D;      // lift = room for the sparkles above the ring
  const cy = pad + lift + D / 2;
  const wm0 = wordmark(S, 0, 0, col);
  const gapT = 0.21 * S, tS = 0.262 * S, tagH = 0.7 * tS;
  const blockH = wm0.h + (withTag ? gapT + tagH : 0);
  const top = cy - blockH / 2 - (withTag ? 0.01 * S : 0);
  const x = pad + D + 0.33 * S;
  const wm = wordmark(S, x, top, col);
  const tg = withTag ? tagline(tS, wm.x1 + 0.012 * S, wm.x2 - 0.012 * S, top + wm.h + gapT, col) : { svg: '' };
  const W = wm.x2 + pad, H = cy + D / 2 + pad;
  return { w: W, h: H, inner: icon('full', pad + D / 2, cy, D) + wm.svg + tg.svg };
}
// ---- stacked: icon above, type centred -------------------------------------------------
function stacked(col) {
  const S = 150, D = 3.3 * S, pad = 50, lift = 0.048 * D;
  const wm0 = wordmark(S, 0, 0, col);
  const W = Math.max(wm0.w, D * 1.12) + pad * 2;
  const cx = W / 2, cy = pad + lift + D / 2;
  const top = cy + D / 2 + 0.36 * S;
  const wm = wordmark(S, cx - wm0.w / 2, top, col);
  const tS = 0.262 * S;
  const tg = tagline(tS, wm.x1 + 2, wm.x2 - 2, top + wm.h + 0.21 * S, col);
  return { w: W, h: top + wm.h + 0.21 * S + 0.7 * tS + pad, inner: icon('full', cx, cy, D) + wm.svg + tg.svg };
}
// ---- plate: the logo on its own dark pill, for video and photos -----------------------
function plate(kind = 'plain') {
  const Hp = 92, D = 128, S = 46, m = 28;                      // m = margin for the soft shadow
  const cy = m + D / 2, cx = m + D / 2;
  const wm0 = wordmark(S, 0, 0, DARK);
  const x = m + D + 16;
  const wm = wordmark(S, x, cy - wm0.h / 2 - 1, DARK);
  const right = wm.x2 + 38;
  const pill = `<rect x="${m + 10}" y="${cy - Hp / 2}" width="${n(right - m - 10)}" height="${Hp}" rx="${Hp / 2}" fill="#0C1130" fill-opacity=".9" stroke="#FFFFFF" stroke-opacity=".16" stroke-width="1.5"/>`;
  return { w: right + m, h: D + m * 2, inner: pill + wm.svg + icon(kind, cx, cy, D), m, D };
}

const out = {
  'logo-horizontal-dark': horizontal(DARK), 'logo-horizontal-light': horizontal(LIGHT),
  'logo-horizontal-dark-notag': horizontal(DARK, false),
  'logo-stacked-dark': stacked(DARK), 'logo-stacked-light': stacked(LIGHT),
  'plate': plate('plain'), 'plate-bold': plate('small'),
};
for (const [name, o] of Object.entries(out)) writeFileSync(name + '.svg', svg(o.w, o.h, o.inner));
// wordmark alone, for reuse without the fonts
const w = wordmark(200, 0, 0, DARK); writeFileSync('wordmark-dark.svg', svg(w.w, w.h, w.svg));
const wl = wordmark(200, 0, 0, LIGHT); writeFileSync('wordmark-light.svg', svg(wl.w, wl.h, wl.svg));
console.log(Object.entries(out).map(([k, o]) => `${k} ${Math.round(o.w)}x${Math.round(o.h)}`).join('\n'));
