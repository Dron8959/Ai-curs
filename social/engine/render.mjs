#!/usr/bin/env node
// Renders a post spec (post.json) into PNG slides in the brand style of the landing page.
//
//   node social/engine/render.mjs social/posts/2026-11-09-paper-to-screen
//
// Writes slide-01.png, slide-02.png, ... next to post.json.
// Spec format: see social/engine/README.md.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// require() honours global installs (NODE_PATH), which ESM import does not.
const { chromium } = createRequire(import.meta.url)('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const asset = (p) => pathToFileURL(resolve(repo, p)).href;

const SIZES = { post: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// **word** -> yellow highlighter swipe, _word_ -> gold, \n -> line break
const rich = (s = '') =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<span class="swipe">$1</span>')
    .replace(/_(.+?)_/g, '<span class="gold">$1</span>')
    .replace(/\n/g, '<br>');

const img = (p, cls = '') => (p ? `<div class="photo ${cls}"><img src="${asset(p)}" alt=""></div>` : '');

function slideBody(s) {
  switch (s.type) {
    case 'cover':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        <h1 class="title ${s.image ? '' : 'xl'}">${rich(s.title)}</h1>
        ${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}
        ${s.image ? `<div class="cover-media">${img(s.image, 'tilt')}${s.tab ? `<span class="tab">${esc(s.tab)}</span>` : ''}</div>` : ''}
        ${s.swipe ? `<div class="swipe-hint">${esc(s.swipe)} <span>→</span></div>` : ''}`;
    case 'split':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        ${s.title ? `<h2 class="title md">${rich(s.title)}</h2>` : ''}
        <div class="split">
          <figure>${img(s.left.image)}<figcaption><span class="tab static">${esc(s.left.label)}</span></figcaption></figure>
          <div class="arrow">→</div>
          <figure>${img(s.right.image)}<figcaption><span class="tab static yellow">${esc(s.right.label)}</span></figcaption></figure>
        </div>
        ${s.sub ? `<p class="sub center">${rich(s.sub)}</p>` : ''}`;
    case 'step':
      return `
        <div class="num">${esc(s.num)}</div>
        <h2 class="title lg">${rich(s.title)}</h2>
        ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
        ${s.example ? `<div class="example">${rich(s.example)}</div>` : ''}
        ${s.image ? `<div class="step-media">${img(s.image)}</div>` : ''}`;
    case 'prompt':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        ${s.title ? `<h2 class="title md">${rich(s.title)}</h2>` : ''}
        <div class="chat">
          ${(s.turns || [])
            .map(
              (t) => `<div class="turn ${t.role}"><div class="who">${esc(t.label || t.role)}</div><div class="bubble">${rich(t.text)}</div></div>`
            )
            .join('')}
        </div>`;
    case 'stat':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        <div class="big">${rich(s.value)}</div>
        <h2 class="title md">${rich(s.title)}</h2>
        ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
        ${s.source ? `<p class="source">${esc(s.source)}</p>` : ''}`;
    case 'myth':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        <div class="myth"><div class="label">Myth</div><p>${rich(s.myth)}</p></div>
        <div class="truth"><div class="label">Truth</div><p>${rich(s.truth)}</p></div>
        ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}`;
    case 'list':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        <h2 class="title md">${rich(s.title)}</h2>
        <ol class="list">${(s.items || []).map((i, n) => `<li><span class="n">${n + 1}</span><span>${rich(i)}</span></li>`).join('')}</ol>`;
    case 'quote':
      return `
        <div class="qmark">“</div>
        <blockquote class="title md">${rich(s.quote)}</blockquote>
        ${s.by ? `<p class="by">${esc(s.by)}</p>` : ''}
        ${s.image ? `<div class="quote-media">${img(s.image, 'round')}</div>` : ''}`;
    case 'photo':
      return `
        ${s.kicker ? `<div class="kicker"><span class="hl">${esc(s.kicker)}</span></div>` : ''}
        ${s.title ? `<h2 class="title md">${rich(s.title)}</h2>` : ''}
        <div class="photo-full">${img(s.image)}${s.tab ? `<span class="tab">${esc(s.tab)}</span>` : ''}</div>
        ${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}`;
    case 'cta':
      return `
        <h2 class="title lg">${rich(s.title)}</h2>
        ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
        <div class="buttons">${(s.buttons || ['Save this for your next family evening']).map((b, i) => `<span class="btn ${i ? 'quiet' : ''}">${esc(b)}</span>`).join('')}</div>
        <div class="handle-big">@make_showlab</div>`;
    default:
      throw new Error(`Unknown slide type: ${s.type}`);
  }
}

function page(s, i, total, format) {
  const [w, h] = SIZES[format];
  const theme = s.theme || 'light';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Bricolage Grotesque';font-weight:700 800;src:url(${asset('assets/fonts/bricolage-grotesque-latin.woff2')}) format('woff2')}
@font-face{font-family:'Figtree';font-weight:400 700;src:url(${asset('assets/fonts/figtree-latin.woff2')}) format('woff2')}
:root{--paper:#fbfaf7;--sand:#f3f1ec;--ink:#141a33;--yellow:#ffc533;--ysoft:#fff1cf;--gold:#ab8422;--text:#4d5266;--line:#e9e7e1;
--swipe:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40' preserveAspectRatio='none'%3E%3Cpath fill='%23ffc533' d='M4 8L15 5L28 7L42 4L57 6L71 3L86 6L101 4L116 6L131 3L146 6L161 4L175 6L188 3L196 7L194 14L198 21L195 28L197 35L185 37L171 35L157 38L142 35L127 37L112 35L97 38L82 35L67 37L52 35L37 38L23 35L10 37L3 34L6 27L2 20L5 13Z'/%3E%3C/svg%3E")}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px}
body{font-family:Figtree,sans-serif;color:var(--text);background:var(--paper);-webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:100%;height:100%;padding:150px 88px 120px;display:flex;flex-direction:column;justify-content:${s.align || 'center'};gap:34px;isolation:isolate;overflow:hidden}
.slide.sand{background:var(--sand)}
.slide.yellow{background:var(--ysoft)}
.slide.dark{background:var(--ink);color:rgba(255,255,255,.86)}
.slide.dark::before{content:"";position:absolute;z-index:-1;width:520px;height:520px;border-radius:50%;background:var(--yellow);right:-210px;top:-230px}
.slide.dark::after{content:"";position:absolute;z-index:-1;inset:0;background:
 radial-gradient(circle at 9% 18%,#fff 0 5px,transparent 6px),radial-gradient(circle at 14% 84%,var(--yellow) 0 7px,transparent 8px),
 radial-gradient(circle at 91% 72%,#fff 0 5px,transparent 6px),radial-gradient(circle at 72% 93%,rgba(255,255,255,.6) 0 4px,transparent 5px)}
.slide.light::before{content:"";position:absolute;z-index:-1;width:300px;height:300px;border-radius:50%;background:var(--yellow);opacity:.18;left:-120px;bottom:-140px}
header{position:absolute;top:44px;left:88px;right:88px;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:24px;color:var(--ink)}
.dark header{color:#fff}
.dark header .count{color:var(--ink);opacity:.8}
header .brand{display:flex;align-items:center;gap:14px}
header img{width:44px;height:44px;border-radius:12px}
header .count{font-size:22px;opacity:.55;font-weight:600}
footer{position:absolute;bottom:48px;left:88px;right:88px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;opacity:.6;color:var(--ink)}
.dark footer{color:#fff}
.kicker .hl{position:relative;display:inline-block;isolation:isolate;padding:.45em .85em;font-weight:700;font-size:30px;line-height:1;color:var(--ink);transform:rotate(-2deg)}
.kicker .hl::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--swipe) center/100% 100% no-repeat}
.title{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;line-height:1.0;color:var(--ink);text-wrap:balance}
.dark .title{color:#fff}
.title{font-size:92px}.title.xl{font-size:122px}.title.lg{font-size:84px}.title.md{font-size:70px;line-height:1.04}
.swipe{position:relative;display:inline-block;isolation:isolate;padding:0 .08em}
.swipe::before{content:"";position:absolute;left:-.04em;right:-.04em;top:.18em;bottom:.02em;z-index:-1;background:var(--swipe) center/100% 100% no-repeat}
.dark .swipe{color:var(--ink)}
.gold{color:var(--gold)}.dark .gold{color:var(--yellow)}
.sub{font-size:38px;line-height:1.35;color:var(--text);max-width:880px}.dark .sub{color:rgba(255,255,255,.82)}
.sub.center{text-align:center;margin-inline:auto}
.body{font-size:38px;line-height:1.4;max-width:900px}
.dark .body{color:rgba(255,255,255,.85)}
.photo{border:10px solid #fff;border-radius:34px;background:#fff;box-shadow:0 40px 60px -34px rgba(20,26,51,.45),0 10px 24px -14px rgba(20,26,51,.2);overflow:hidden}
.photo img{display:block;width:100%;height:100%;object-fit:cover;border-radius:24px}
.photo.tilt{transform:rotate(2.5deg)}
.photo.round{border-radius:50%;width:180px;height:180px}.photo.round img{border-radius:50%}
.cover-media{position:relative;flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start;margin-top:10px}
.cover-media .photo{height:100%;max-height:640px;aspect-ratio:${s.ratio || '4/5'}}
.tab{position:absolute;z-index:2;padding:16px 28px;border-radius:20px;background:#fff;color:var(--ink);font-weight:700;font-size:30px;box-shadow:0 14px 30px -14px rgba(20,26,51,.45);transform:rotate(-4deg);white-space:nowrap}
.cover-media .tab{left:60px;bottom:40px}
.tab.static{position:static;display:inline-block}
.tab.yellow{background:var(--yellow)}
.swipe-hint{font-weight:700;font-size:30px;color:var(--ink);display:flex;gap:12px;align-items:center}
.dark .swipe-hint{color:#fff}
.split{display:flex;align-items:center;gap:22px;justify-content:center}
.split figure{flex:1;display:flex;flex-direction:column;align-items:center;gap:26px}
.split .photo{width:100%;aspect-ratio:2/3}
.split figure:first-child .photo{transform:rotate(-2.5deg)}
.split figure:last-child .photo{transform:rotate(2.5deg)}
.arrow{font-family:'Bricolage Grotesque';font-weight:800;font-size:80px;color:var(--gold)}
.num{font-family:'Bricolage Grotesque';font-weight:800;font-size:150px;line-height:.8;color:var(--yellow);-webkit-text-stroke:3px var(--ink)}
.dark .num{-webkit-text-stroke:0}
.example{font-size:34px;line-height:1.35;background:#fff;border-radius:28px;padding:32px 36px;color:var(--ink);box-shadow:0 20px 40px -26px rgba(20,26,51,.35);border-left:12px solid var(--yellow)}
.dark .example{background:rgba(255,255,255,.08);color:#fff}
.step-media{display:flex;justify-content:flex-end;margin-top:-10px}
.step-media .photo{height:430px;aspect-ratio:2/3;transform:rotate(3deg)}
.chat{display:flex;flex-direction:column;gap:22px}
.turn{display:flex;flex-direction:column;gap:8px;max-width:86%}
.turn .who{font-size:22px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.6}
.turn .bubble{font-size:36px;line-height:1.3;padding:26px 32px;border-radius:30px;background:#fff;color:var(--ink);box-shadow:0 16px 34px -24px rgba(20,26,51,.4)}
.turn.kid{align-self:flex-end;text-align:right}.turn.kid .bubble{background:var(--yellow);border-bottom-right-radius:8px}
.turn.check .bubble{background:var(--sand);border-bottom-left-radius:8px}
.turn.win .bubble{background:var(--ink);color:#fff}
.big{font-family:'Bricolage Grotesque';font-weight:800;font-size:230px;line-height:.85;letter-spacing:-.05em;color:var(--ink)}
.dark .big{color:var(--yellow)}
.source{font-size:24px;opacity:.6}
.myth,.truth{border-radius:32px;padding:38px 42px;display:flex;flex-direction:column;gap:12px}
.myth{background:#fff;box-shadow:0 20px 40px -28px rgba(20,26,51,.35)}
.myth p{font-size:46px;line-height:1.15;color:var(--text);text-decoration:line-through;text-decoration-color:rgba(171,132,34,.7);text-decoration-thickness:4px;font-weight:600}
.truth{background:var(--ink);color:#fff}
.truth p{font-family:'Bricolage Grotesque';font-weight:800;font-size:56px;line-height:1.05;letter-spacing:-.02em}
.label{font-size:22px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;opacity:.7}
.truth .label{color:var(--yellow);opacity:1}
.list{list-style:none;display:flex;flex-direction:column;gap:24px}
.list li{display:flex;gap:26px;align-items:flex-start;font-size:38px;line-height:1.3;color:var(--ink)}
.dark .list li{color:#fff}
.list .n{flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:18px;background:var(--yellow);color:var(--ink);font-family:'Bricolage Grotesque';font-weight:800;font-size:34px;transform:rotate(-4deg)}
.qmark{font-family:'Bricolage Grotesque';font-weight:800;font-size:220px;line-height:.5;color:var(--yellow);height:90px}
.by{font-size:30px;font-weight:700;color:var(--gold)}.dark .by{color:var(--yellow)}
.photo-full{position:relative;flex:1;min-height:0}
.photo-full .photo{height:100%}
.photo-full .tab{left:40px;bottom:36px}
.buttons{display:flex;flex-direction:column;gap:20px;align-items:flex-start}
.btn{display:inline-flex;align-items:center;min-height:96px;padding:0 50px;border-radius:999px;background:#fff;color:var(--ink);font-weight:700;font-size:34px;box-shadow:0 22px 40px -18px rgba(255,197,51,.85),inset 0 0 0 2px rgba(255,197,51,.5)}
.btn.quiet{box-shadow:inset 0 0 0 2px var(--line);background:transparent}
.dark .btn.quiet{color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.3)}
.handle-big{font-family:'Bricolage Grotesque';font-weight:800;font-size:44px;color:var(--gold)}.dark .handle-big{color:var(--yellow)}
.story .slide{padding:200px 88px 220px}
.story header{top:90px}.story footer{bottom:110px}
</style></head><body class="${format}"><div class="slide ${theme}">
<header><span class="brand"><img src="${asset('assets/img/logo.png')}" alt="">Make Show Lab</span>${total > 1 ? `<span class="count">${i + 1}/${total}</span>` : ''}</header>
${slideBody(s)}
<footer><span>@make_showlab</span><span>${s.footer ? esc(s.footer) : 'makeshowlab.com'}</span></footer>
</div></body></html>`;
}

async function main() {
  const dir = resolve(process.argv[2] || '.');
  const specPath = join(dir, 'post.json');
  if (!existsSync(specPath)) throw new Error(`No post.json in ${dir}`);
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  const format = spec.format || 'post';
  const [w, h] = SIZES[format];
  for (const f of readdirSync(dir)) if (/^slide-\d+\.(png|jpg)$/.test(f)) unlinkSync(join(dir, f));

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const out = [];
  for (const [i, s] of spec.slides.entries()) {
    const tmp = join(dir, `.slide-${i}.html`);
    writeFileSync(tmp, page(s, i, spec.slides.length, format));
    await pg.goto(pathToFileURL(tmp).href);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(150);
    // Guard against text spilling out of the frame.
    const overflow = await pg.evaluate(() => {
      const box = document.querySelector('.slide').getBoundingClientRect();
      const kids = document.querySelectorAll('.slide > :not(header):not(footer)');
      const foot = document.querySelector('footer').getBoundingClientRect().top;
      return [...kids].some((k) => {
        const r = k.getBoundingClientRect();
        return r.top < box.top + 80 || r.bottom > foot - 8;
      });
    });
    const file = join(dir, `slide-${String(i + 1).padStart(2, '0')}.jpg`);
    await pg.screenshot({ path: file, type: 'jpeg', quality: 92 });
    unlinkSync(tmp);
    out.push(file);
    console.log(`${overflow ? 'OVERFLOW ' : ''}${file}`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
