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
import { asset, esc, rich, sticker, sparkle, arrow, robo, astro, photo, baseCss, logoSrc } from './kit.mjs';

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
        case 'astro': return astro('', at + `width:${d.w}px;height:${d.h || d.w * 1.08}px;`);
        case 'review': return review(d, at);
        case 'bubble': return `<span class="bubble ${d.right ? 'r' : ''}" style="${at}">${rich(d.text)}</span>`;
        case 'sun': return `<span class="sun" style="${at}width:${d.w}px;height:${d.w}px"></span>`;
        case 'dot': return `<span class="dot" style="${at}width:${d.w || 12}px;height:${d.w || 12}px;${d.gold ? 'background:var(--yellow)' : ''}"></span>`;
        case 'photo': return `<div style="position:absolute;z-index:2;${at}width:${d.w}px;height:${d.h}px">${photo(d.src, { cls: 'fill', tape: d.tape !== false, pos: d.pos })}</div>`;
        default: throw new Error(`Unknown deco kind: ${d.kind}`);
      }
    })
    .join('');
}

const kicker = (s) => (s.q ? `<div class="q">“${esc(s.q)}”</div>` : '') + (s.kicker ? `<div><span class="kick">${esc(s.kicker)}</span></div>` : '');
const review = (d, at) => `<div class="review" style="${at}width:${d.w}px;height:${d.h}px"><img src="${asset(d.src)}" alt=""><div class="rb"><div class="rn"><span>${esc(d.name)}</span><span class="stars">★★★★★</span></div><div class="rr">${esc(d.role)}</div>${d.tag ? `<span class="tag">${esc(d.tag)}</span>` : ''}${d.quote ? `<p class="rq">“${esc(d.quote)}”</p>` : ''}</div></div>`;

function body(s) {
  switch (s.type) {
    case 'cover':
      return `<div class="col top">${kicker(s)}<h1 class="title t-${s.size || 'xl'}">${rich(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>
        ${s.image ? `<div class="cover-pic" style="${s.picStyle || ''}">${photo(s.image, { cls: 'fill tilt-r', pos: s.pos })}</div>` : ''}
        ${s.swipe ? `<div class="swipe-hint"><span class="hand">${esc(s.swipe)}</span> ${arrow('right', '', 'position:static;width:80px;height:60px')}</div>` : ''}`;
    case 'hero':
      return `<div class="col top">${kicker(s)}<h1 class="title t-${s.size || 'lg'}">${rich(s.title)}</h1>${s.sub ? `<p class="sub">${rich(s.sub)}</p>` : ''}</div>
        <span class="sun" style="width:900px;height:900px;left:90px;top:${s.sunTop ?? 420}px"></span>
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
      return `
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
      return `
        <div class="col mid narrow">${kicker(s)}<h2 class="title t-lg">${rich(s.title)}</h2>${s.body ? `<p class="body">${rich(s.body)}</p>` : ''}
        <div class="buttons">${(s.buttons || []).map((b, i) => `<span class="btn ${i ? 'quiet' : ''}">${esc(b)}</span>`).join('')}</div></div>
        ${robo('', 'right:90px;bottom:150px;width:210px')}
        ${s.bubble ? `<span class="bubble r" style="right:120px;bottom:410px">${rich(s.bubble)}</span>` : ''}`;
    default:
      throw new Error(`Unknown slide type: ${s.type}`);
  }
}

export const slideCss = `
.slide{position:relative;width:100%;height:100%;overflow:hidden;isolation:isolate}
.head{position:absolute;z-index:8;top:50px;left:64px;right:64px;display:flex;align-items:center;justify-content:space-between}
.count{font-family:Urbanist;font-weight:700;font-size:26px;letter-spacing:.14em;color:var(--muted2)}
.foot{position:absolute;z-index:8;bottom:44px;left:72px;right:72px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;color:var(--muted2)}
.col{position:absolute;z-index:4;left:80px;right:80px;display:flex;flex-direction:column;gap:28px}
.col.top{top:160px}.col.mid{top:0;bottom:0;justify-content:center}.col.narrow{right:330px}
.t-xl{font-size:108px}.t-lg{font-size:88px}.t-md{font-size:70px;line-height:.98}
.sub{font-size:38px;line-height:1.3;color:var(--muted);max-width:900px;font-weight:500}
.sub.bottom{position:absolute;z-index:4;left:80px;right:80px;bottom:110px}
.body{font-size:38px;line-height:1.36;max-width:900px;color:var(--muted);font-weight:500}
.fill{width:100%;height:100%}
.tilt-r,.tilt-l{transform:none}
.cover-pic{position:absolute;z-index:2;left:120px;right:120px;top:540px;bottom:170px}
.hero-pic{position:absolute;z-index:2;left:180px;right:180px;top:520px;bottom:150px}
.split-l{position:absolute;z-index:2;left:70px;width:450px;top:400px;height:700px}
.split-r{position:absolute;z-index:2;right:70px;width:450px;top:400px;height:700px}
.step-pic{position:absolute;z-index:2;right:80px;width:460px;bottom:120px;height:500px}
.myth-pic{position:absolute;z-index:2;right:80px;width:330px;bottom:110px;height:400px}
.full-pic{position:absolute;z-index:2;left:80px;right:80px;top:380px;bottom:230px}
.swipe-hint{position:absolute;z-index:6;left:84px;bottom:100px;display:flex;align-items:center;gap:14px;font-size:30px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.swipe-hint .hand{font-style:normal;color:var(--muted)}
.swipe-hint .arrow{stroke:var(--orange)}
.num{font-family:Archivo;font-style:italic;font-weight:900;font-stretch:94%;font-size:150px;line-height:.8;background:linear-gradient(180deg,#FFD08A,#FF8A3D);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 20px rgba(255,138,61,.55));width:auto;height:auto}
.num span{font:inherit}
.example{font-size:34px;line-height:1.35;background:rgba(17,26,58,.85);border-radius:26px;padding:28px 34px;color:#fff;box-shadow:inset 0 0 0 1px var(--line);max-width:900px;border-left:6px solid var(--orange)}
.window{position:absolute;z-index:3;left:80px;right:80px;top:380px;background:var(--panel);border-radius:34px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 90px -40px rgba(59,108,255,.6)}
.window .bar{display:flex;align-items:center;gap:12px;background:var(--panel2);padding:24px 32px;color:var(--muted);font-weight:700;font-size:24px;letter-spacing:.06em}
.window .bar i{width:16px;height:16px;border-radius:50%;background:var(--orange)}.window .bar i:nth-child(2){background:var(--gold)}.window .bar i:nth-child(3){background:var(--teal)}
.window .bar span{margin-left:14px}
.chat{display:flex;flex-direction:column;gap:20px;padding:32px}
.turn .who{font-size:20px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--muted2);margin-bottom:10px}
.turn .say{font-size:34px;line-height:1.3;padding:20px 26px;border-radius:22px;background:var(--panel2);color:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.turn.check .say{color:var(--gold)}
.turn.ask .say,.turn.kid .say{background:linear-gradient(180deg,#FFD08A,#FF8A3D);color:#1A0A02;font-weight:600;box-shadow:none}
.turn.win .say{background:rgba(63,199,192,.16);color:var(--teal);font-weight:800;box-shadow:inset 0 0 0 1.5px rgba(63,199,192,.5)}
.big{font-family:Archivo;font-style:italic;font-weight:900;font-stretch:94%;font-size:250px;line-height:.85;letter-spacing:-.03em;background:linear-gradient(180deg,#FFD08A,#FF8A3D);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(255,138,61,.5))}
.source{font-size:24px;color:var(--muted2)}
.myth-card,.truth-card{position:absolute;z-index:3;left:80px;right:80px;border-radius:32px;padding:38px 44px}
.myth-card{top:300px;background:rgba(17,26,58,.9);box-shadow:inset 0 0 0 1px var(--line)}
.myth-card p{font-size:60px;line-height:1.05;font-weight:700;color:var(--muted2);text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:5px}
.nope{position:absolute;right:40px;top:34px;font-family:Urbanist;font-weight:800;font-size:22px;letter-spacing:.2em;color:#fff;background:var(--red);padding:8px 16px;border-radius:999px;text-transform:uppercase}
.truth-card{top:650px;right:330px;background:linear-gradient(180deg,rgba(255,138,61,.16),rgba(17,26,58,.95));box-shadow:inset 0 0 0 1.5px rgba(255,195,107,.55),0 0 60px -10px rgba(255,138,61,.5)}
.truth-card p{font-family:Archivo;font-style:italic;font-weight:900;font-stretch:94%;font-size:60px;line-height:.98;text-transform:uppercase;color:#fff;text-shadow:var(--glow)}
.lab{font-size:20px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px;color:var(--muted2)}.truth-card .lab{color:var(--gold)}
.list{list-style:none;display:flex;flex-direction:column;gap:24px;margin-top:12px}
.list li{display:flex;gap:26px;align-items:center;font-size:38px;line-height:1.22;color:#fff;font-weight:600;padding-bottom:22px;border-bottom:1px solid var(--line)}
.list .n{flex:none;display:grid;place-items:center;width:64px;font-family:Archivo;font-style:italic;font-weight:900;font-size:52px;color:var(--orange);text-shadow:0 0 18px rgba(255,138,61,.6)}
.sticker.inline{position:static;flex:none}
.qmark{font-family:Archivo;font-style:italic;font-weight:900;font-size:200px;line-height:.5;color:var(--orange);height:80px}
.by{font-size:34px;font-weight:700;color:var(--gold)}
.buttons{display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.btn{display:inline-flex;align-items:center;min-height:92px;padding:0 46px;border-radius:999px;font-weight:800;font-size:32px;color:#1A0A02;background:linear-gradient(180deg,#FFD08A 0%,#FF8A3D 100%);box-shadow:0 0 0 1px rgba(255,195,107,.45),0 14px 44px rgba(255,138,61,.4)}
.btn.quiet{color:#fff;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)}
.review{position:absolute;z-index:3;border-radius:30px;overflow:hidden;background:var(--panel);box-shadow:inset 0 0 0 1px var(--line),0 40px 90px -40px rgba(59,108,255,.5)}
.review img{display:block;width:100%;height:46%;object-fit:cover}
.review .rb{padding:26px 32px;display:flex;flex-direction:column;gap:10px}
.review .rn{display:flex;justify-content:space-between;align-items:center;font-size:34px;font-weight:800;color:#fff}
.review .stars{color:var(--gold);letter-spacing:.1em;font-size:28px}
.review .rr{font-size:24px;color:var(--muted2);font-weight:600}
.review .tag{align-self:flex-start;font-size:18px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);background:rgba(255,138,61,.14);padding:6px 14px;border-radius:999px}
.review .rq{font-size:30px;line-height:1.35;color:#fff;font-weight:500}
`;

export function page(s, i, total, format = 'post') {
  const [w, h] = SIZES[format];
  const ground = (s.theme === 'navy' ? 'navy' : 'paper') + (s.planet === false ? '' : ' planet');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss()}
html,body{width:${w}px;height:${h}px}${slideCss}</style></head><body><div class="slide ${ground}">
<div class="head"><span class="chip"><img src="${asset(logoSrc())}" alt="">Make Show <b>Lab</b></span>${total > 1 ? `<span class="count">${i + 1}/${total}</span>` : ''}</div>
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
