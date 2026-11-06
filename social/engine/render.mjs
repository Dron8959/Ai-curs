#!/usr/bin/env node
// Renders a post spec (post.json) into JPG slides in the warm Make Show Lab look.
//
//   node social/engine/render.mjs social/posts/01-paper-to-screen
//
// Spec format: social/engine/README.md. Visual kit: social/engine/kit.mjs.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { asset, esc, rich, sticker, sparkle, arrow, robo, photo, baseCss } from './kit.mjs';

// require() honours global installs (NODE_PATH), which ESM import does not.
const { chromium } = createRequire(import.meta.url)('playwright');

const SIZES = { post: [1080, 1350], square: [1080, 1080], story: [1080, 1920] };

// Free-placed decorations: [{kind, x, y, ...}] in px from the top-left.
export function deco(list = []) {
  return list
    .map((d) => {
      const at = `left:${d.x}px;top:${d.y}px;${d.rot ? `transform:rotate(${d.rot}deg);` : ''}`;
      switch (d.kind) {
        case 'sticker': return sticker(d.name, d.size === 'sm' ? 'sm' : '', at);
        case 'sparkle': return sparkle(`${d.white ? 'w' : ''} ${d.size === 'sm' ? 'sm' : ''}`, at);
        case 'note': return `<span class="note ${d.gold ? 'y' : ''}" style="${at}">${rich(d.text)}</span>`;
        case 'arrow': return arrow(d.dir, d.gold ? 'y' : '', at + (d.w ? `width:${d.w}px;height:${d.w * 0.87}px;` : ''));
        case 'robo': return robo('', at + `width:${Math.min(d.w || 200, 280)}px;`);
        case 'bubble': return `<span class="bubble ${d.right ? 'r' : ''}" style="${at}">${rich(d.text)}</span>`;
        case 'sun': return `<span class="sun" style="${at}width:${d.w}px;height:${d.w}px"></span>`;
        case 'dot': return `<span class="dot" style="${at}width:${d.w || 12}px;height:${d.w || 12}px;${d.gold ? 'background:var(--yellow)' : ''}"></span>`;
        case 'photo': return `<div style="position:absolute;z-index:2;${at}width:${d.w}px;height:${d.h}px">${photo(d.src, { cls: 'fill', tape: d.tape !== false, pos: d.pos })}</div>`;
        default: throw new Error(`Unknown deco kind: ${d.kind}`);
      }
    })
    .join('');
}

const kicker = (s) => (s.kicker ? `<div><span class="kick">${esc(s.kicker)}</span></div>` : '');

function body(s) {
  switch (s.type) {
    case 'cover':
      return `<div class="col top">${kicker(s)}<h1 class="title t-${s.size || 'xl'}">${rich(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>
        ${s.image ? `<div class="cover-pic" style="${s.picStyle || ''}">${photo(s.image, { cls: 'fill tilt-r', pos: s.pos })}</div>` : ''}
        ${s.swipe ? `<div class="swipe-hint"><span class="hand">${esc(s.swipe)}</span> ${arrow('right', '', 'position:static;width:80px;height:60px')}</div>` : ''}`;
    case 'hero':
      return `<div class="col top">${kicker(s)}<h1 class="title t-${s.size || 'lg'}">${rich(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>
        <span class="sun" style="width:700px;height:700px;left:190px;top:${s.sunTop ?? 520}px"></span>
        <div class="hero-pic" style="${s.picStyle || ''}">${photo(s.image, { cls: 'fill tilt-l', tape: false, pos: s.pos })}</div>`;
    case 'split':
      return `<div class="col top">${kicker(s)}${s.title ? `<h2 class="title t-md">${rich(s.title)}</h2>` : ''}</div>
        <div class="split-l">${photo(s.left.image, { cls: 'fill tilt-l', pos: s.left.pos })}</div>
        <div class="split-r">${photo(s.right.image, { cls: 'fill tilt-r', pos: s.right.pos })}</div>
        <span class="note" style="left:96px;top:1150px;transform:rotate(-4deg)">${rich(s.left.label)}</span>
        <span class="note y" style="left:600px;top:1150px;transform:rotate(3deg)">${rich(s.right.label)}</span>
        ${arrow('right', 'y', 'left:450px;top:560px;width:180px;height:150px')}`;
    case 'step':
      return `<div class="col ${s.image ? 'top' : 'mid'}">
          <div class="num"><span>${esc(s.num)}</span></div>
          <h2 class="title t-${s.size || 'lg'}">${rich(s.title)}</h2>
          ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
          ${s.example ? `<div class="example">${rich(s.example)}</div>` : ''}
        </div>
        ${s.image ? `<div class="step-pic" style="${s.picStyle || ''}">${photo(s.image, { cls: 'fill tilt-r', pos: s.pos })}</div>` : ''}`;
    case 'prompt':
      return `<div class="col top">${kicker(s)}${s.title ? `<h2 class="title t-md">${rich(s.title)}</h2>` : ''}</div>
        <div class="window">
          <div class="bar"><i></i><i></i><i></i><span>describe → check → ask again</span></div>
          <div class="chat">${(s.turns || [])
            .map((t) => `<div class="turn ${t.role}"><div class="who">${esc(t.label || t.role)}</div><div class="say">${rich(t.text)}</div></div>`)
            .join('')}</div>
        </div>`;
    case 'stat':
      return `<span class="sun" style="width:560px;height:560px;right:-200px;top:-220px"></span>
        <div class="col mid">${kicker(s)}<div class="big">${rich(s.value)}</div><h2 class="title t-md">${rich(s.title)}</h2>
        ${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}${s.source ? `<p class="source">${esc(s.source)}</p>` : ''}</div>`;
    case 'myth':
      return `<div class="col top">${kicker(s)}</div>
        <div class="myth-card"><div class="lab">Myth</div><p>${rich(s.myth)}</p><span class="nope">nope</span></div>
        <div class="truth-card"><div class="lab">Truth</div><p>${rich(s.truth)}</p></div>
        ${s.image ? `<div class="myth-pic">${photo(s.image, { cls: 'fill tilt-r', pos: s.pos })}</div>` : ''}`;
    case 'list':
      return `<div class="col top">${kicker(s)}<h2 class="title t-md">${rich(s.title)}</h2>
        <ol class="list">${(s.items || [])
          .map((it, n) => {
            const o = typeof it === 'string' ? { text: it } : it;
            return `<li>${o.icon ? sticker(o.icon, 'sm inline') : `<span class="n">${n + 1}</span>`}<span>${rich(o.text)}</span></li>`;
          })
          .join('')}</ol></div>`;
    case 'quote':
      return `<div class="col mid"><div class="qmark">“</div><blockquote class="title t-md">${rich(s.quote)}</blockquote>${s.by ? `<p class="by hand">${esc(s.by)}</p>` : ''}</div>`;
    case 'photo':
      return `<div class="col top">${kicker(s)}${s.title ? `<h2 class="title t-md">${rich(s.title)}</h2>` : ''}</div>
        <div class="full-pic" style="${s.picStyle || ''}">${photo(s.image, { cls: 'fill tilt-l', pos: s.pos })}</div>
        ${s.sub ? `<p class="sub bottom">${rich(s.sub)}</p>` : ''}`;
    case 'cta':
      return `<span class="sun" style="width:520px;height:520px;right:-170px;top:-200px"></span>
        <div class="col mid narrow">${kicker(s)}<h2 class="title t-lg">${rich(s.title)}</h2>${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
        <div class="buttons">${(s.buttons || []).map((b, i) => `<span class="btn ${i ? 'quiet' : ''}">${esc(b)}</span>`).join('')}</div></div>
        ${robo('', 'right:90px;bottom:150px;width:220px')}
        ${s.bubble ? `<span class="bubble r" style="right:120px;bottom:410px">${rich(s.bubble)}</span>` : ''}`;
    default:
      throw new Error(`Unknown slide type: ${s.type}`);
  }
}

export const slideCss = `
.slide{position:relative;width:100%;height:100%;overflow:hidden;isolation:isolate}
.head{position:absolute;z-index:8;top:48px;left:64px;right:64px;display:flex;align-items:center;justify-content:space-between}
.count{font-family:Caveat,cursive;font-weight:700;font-size:44px;color:var(--gold)}.navy .count{color:var(--yellow)}
.foot{position:absolute;z-index:8;bottom:44px;left:72px;right:72px;display:flex;justify-content:space-between;font-size:22px;font-weight:700;color:var(--ink);opacity:.5}
.navy .foot{color:#fff}
.col{position:absolute;z-index:4;left:80px;right:80px;display:flex;flex-direction:column;gap:30px}
.col.top{top:150px}.col.mid{top:0;bottom:0;justify-content:center}.col.narrow{right:330px}
.t-xl{font-size:112px}.t-lg{font-size:90px}.t-md{font-size:72px;line-height:1.03}
.sub{font-size:38px;line-height:1.32;color:var(--text);max-width:880px}.navy .sub{color:rgba(255,255,255,.85)}
.sub.bottom{position:absolute;z-index:4;left:80px;right:80px;bottom:110px}
.body{font-size:38px;line-height:1.38;max-width:900px}.navy .body{color:rgba(255,255,255,.86)}
.fill{width:100%;height:100%}
.tilt-r{transform:rotate(2.5deg)}.tilt-l{transform:rotate(-2.5deg)}
.cover-pic{position:absolute;z-index:2;left:150px;right:150px;top:520px;bottom:190px}
.hero-pic{position:absolute;z-index:2;left:200px;right:200px;top:520px;bottom:150px}
.split-l{position:absolute;z-index:2;left:70px;width:440px;top:420px;height:690px}
.split-r{position:absolute;z-index:2;right:70px;width:440px;top:380px;height:690px}
.step-pic{position:absolute;z-index:2;right:90px;width:430px;bottom:120px;height:520px}
.myth-pic{position:absolute;z-index:2;right:80px;width:330px;bottom:110px;height:400px}
.full-pic{position:absolute;z-index:2;left:80px;right:80px;top:360px;bottom:220px}
.swipe-hint{position:absolute;z-index:6;left:84px;bottom:96px;display:flex;align-items:center;gap:12px;font-size:56px;color:var(--ink)}
.swipe-hint .arrow{stroke:var(--gold)}.navy .swipe-hint .arrow{stroke:var(--yellow)}
.num{width:150px;height:150px;display:grid;place-items:center;background:var(--swipe) center/100% 100% no-repeat;transform:rotate(-5deg)}
.num span{font-family:'Bricolage Grotesque';font-weight:800;font-size:96px;line-height:1;color:var(--ink)}
.example{font-size:34px;line-height:1.35;background:#fff;border-radius:28px;padding:30px 36px;color:var(--ink);box-shadow:0 20px 40px -26px rgba(60,40,10,.45);max-width:900px;transform:rotate(-1deg)}
.navy .example{background:rgba(255,255,255,.08);color:#fff;box-shadow:none}
.window{position:absolute;z-index:3;left:90px;right:90px;top:380px;background:#fff;border-radius:40px;overflow:hidden;box-shadow:0 46px 70px -40px rgba(60,40,10,.55);transform:rotate(-1.2deg)}
.window .bar{display:flex;align-items:center;gap:12px;background:var(--navy);padding:26px 34px;color:#fff;font-weight:700;font-size:26px}
.window .bar i{width:18px;height:18px;border-radius:50%;background:var(--yellow)}.window .bar i:nth-child(2){background:#fff}.window .bar i:nth-child(3){background:#aba598}
.window .bar span{margin-left:14px}
.chat{display:flex;flex-direction:column;gap:22px;padding:34px}
.turn .who{font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.turn .say{font-size:34px;line-height:1.3;padding:22px 28px;border-radius:24px;background:#f3f1ec;color:var(--ink)}
.turn.check .say{background:var(--ysoft)}.turn.ask .say{background:var(--yellow)}
.turn.win .say{background:var(--navy);color:#fff;font-family:Caveat,cursive;font-size:52px;font-weight:700;padding:14px 28px}
.big{font-family:'Bricolage Grotesque';font-weight:800;font-size:240px;line-height:.85;letter-spacing:-.05em;color:var(--yellow)}
.source{font-size:24px;opacity:.65}
.myth-card,.truth-card{position:absolute;z-index:3;left:80px;right:80px;border-radius:36px;padding:40px 46px}
.myth-card{top:290px;background:#fff;box-shadow:0 30px 50px -34px rgba(60,40,10,.5);transform:rotate(-1.5deg)}
.myth-card p{font-size:64px;line-height:1.05;font-weight:700;color:var(--text);text-decoration:line-through;text-decoration-color:var(--coral);text-decoration-thickness:6px}
.nope{position:absolute;right:46px;top:30px;font-family:Caveat,cursive;font-weight:700;font-size:66px;color:var(--coral);transform:rotate(-8deg)}
.truth-card{top:640px;right:330px;background:var(--navy);color:#fff;transform:rotate(1deg)}
.truth-card p{font-family:'Bricolage Grotesque';font-weight:800;font-size:64px;line-height:1.02;letter-spacing:-.02em}
.lab{font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px;color:var(--gold)}.truth-card .lab{color:var(--yellow)}
.list{list-style:none;display:flex;flex-direction:column;gap:26px;margin-top:10px}
.list li{display:flex;gap:26px;align-items:center;font-size:38px;line-height:1.25;color:var(--ink);font-weight:600}
.navy .list li{color:#fff}
.list .n{flex:none;display:grid;place-items:center;width:70px;height:70px;background:var(--swipe) center/100% 100% no-repeat;color:var(--ink);font-family:'Bricolage Grotesque';font-weight:800;font-size:36px;transform:rotate(-4deg)}
.sticker.inline{position:static;flex:none}
.qmark{font-family:'Bricolage Grotesque';font-weight:800;font-size:220px;line-height:.5;color:var(--yellow);height:90px}
.by{font-size:52px}
.buttons{display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.btn{display:inline-flex;align-items:center;min-height:92px;padding:0 46px;border-radius:999px;background:#fff;color:var(--ink);font-weight:700;font-size:32px;box-shadow:0 22px 40px -18px rgba(255,197,51,.9),inset 0 0 0 3px rgba(255,197,51,.55)}
.btn.quiet{background:transparent;color:inherit;box-shadow:inset 0 0 0 3px rgba(171,132,34,.35)}
.navy .btn.quiet{color:#fff;box-shadow:inset 0 0 0 3px rgba(255,255,255,.28)}
`;

export function page(s, i, total, format = 'post') {
  const [w, h] = SIZES[format];
  const ground = s.theme === 'navy' ? 'navy' : 'paper';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss()}
html,body{width:${w}px;height:${h}px}${slideCss}</style></head><body><div class="slide ${ground}">
<div class="head"><span class="chip"><img src="${asset('assets/img/logo.png')}" alt="">Make Show Lab</span>${total > 1 ? `<span class="count">${i + 1}/${total}</span>` : ''}</div>
${body(s)}
${deco(s.deco)}
<div class="foot"><span>@make_showlab</span><span>${s.footer ? esc(s.footer) : 'makeshowlab.com'}</span></div>
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
  const pg = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
  for (const [i, s] of spec.slides.entries()) {
    const tmp = join(dir, `.slide-${i}.html`);
    writeFileSync(tmp, page(s, i, spec.slides.length, format));
    await pg.goto(pathToFileURL(tmp).href);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(120);
    // Text block must stay clear of the header and footer.
    const overflow = await pg.evaluate(() => {
      const col = document.querySelector('.col');
      if (!col) return false;
      const kids = [...col.children].map((k) => k.getBoundingClientRect());
      const foot = document.querySelector('.foot').getBoundingClientRect().top;
      return kids.some((r) => r.top < 120 || r.bottom > foot - 8);
    });
    const file = join(dir, `slide-${String(i + 1).padStart(2, '0')}.jpg`);
    await pg.screenshot({ path: file, type: 'jpeg', quality: 92 });
    unlinkSync(tmp);
    console.log(`${overflow ? 'OVERFLOW ' : ''}${file}`);
  }
  await browser.close();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
