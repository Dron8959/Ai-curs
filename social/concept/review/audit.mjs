// One page with the whole skills pass: what reads as machine-written, where meaning is lost, what is proposed.
//   node social/concept/review/audit.mjs   ->  social/concept/out/review/audit.html (+ audit.png)
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { COMMON, PASS } from './pass.mjs';
import { texts } from './texts.mjs';
const require = createRequire(import.meta.url);
const concept = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const para = (s) => esc(s).replace(/#(\w+)/g, '<span class="tag">#$1</span>').replace(/\n/g, '<br>');
const all = texts();
const rows = all.map((p) => {
  const ps = PASS[p.n], cap = p.items.find((i) => i.where === 'caption').text;
  const changed = (ps.before ? 1 : 0) + ps.screen.length;
  return `<section><h2><span class="n">${p.n}</span>${esc(p.id.slice(3).replace(/-/g, ' '))}<span class="badge ${changed ? 'ch' : 'ok'}">${changed ? changed + ' change' + (changed > 1 ? 's' : '') : 'no change'}</span></h2>
  <p class="verdict">${esc(ps.verdict)}</p><ul>${ps.notes.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  ${ps.before ? `<div class="two"><div><h3>Caption before</h3><div class="cap">${para(ps.before)}</div></div><div><h3>Caption now</h3><div class="cap new">${para(cap)}</div></div></div>` : ''}
  ${ps.open ? `<p class="open"><b>Needs your answer:</b> ${esc(ps.open)}</p>` : ''}
  ${ps.screen.length ? `<h3>Changed on screen and in the voice</h3><table>${ps.screen.map(([w, a, c]) => `<tr><td>${esc(w)}</td><td class="old">${esc(a)}</td><td class="nw">${esc(c)}</td></tr>`).join('')}</table>` : ''}</section>`;
}).join('');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Text remake</title><style>
:root{--bg:#F4EFE4;--card:#fff;--ink:#141A33;--mut:#5B6180;--line:#E9E0CB;--ok:#1E7F58;--okb:#EAFBF3;--acc:#FF6F4A}
@media (prefers-color-scheme:dark){:root{--bg:#0B0F24;--card:#141A33;--ink:#FFF4DC;--mut:#A9B0D0;--line:#262E55;--okb:#12352A;--ok:#5FE0A8}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 -apple-system,'Segoe UI',Roboto,sans-serif}
.w{max-width:1100px;margin:0 auto;padding:28px 16px 60px}h1{font-size:30px;margin:0 0 6px;letter-spacing:-.02em}.lead{color:var(--mut);margin:0 0 20px}
.common{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 20px;margin-bottom:22px}.common li{margin:6px 0}
section{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 20px;margin-bottom:16px}
h2{font-size:20px;margin:0 0 6px;display:flex;align-items:center;gap:10px;text-transform:capitalize}h2 .n{background:#141A33;color:#FFC533;border-radius:8px;padding:0 10px}
.badge{margin-left:auto;font-size:12px;text-transform:uppercase;letter-spacing:.08em;border-radius:20px;padding:3px 10px}.badge.ok{background:var(--okb);color:var(--ok)}.badge.ch{background:#FFF1D2;color:#9A5B00}
.verdict{font-weight:600;margin:4px 0}.open{background:#FFF1D2;color:#5A3A00;border-radius:10px;padding:8px 12px;font-size:14.5px}ul{margin:6px 0 10px;padding-left:20px}li{margin:3px 0}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--acc);margin:12px 0 6px}.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cap{border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14.5px}.cap.new{background:var(--okb);border-color:transparent}.tag{color:#2F6FD6}
table{border-collapse:collapse;width:100%;font-size:14.5px}td{border-top:1px solid var(--line);padding:7px 8px;vertical-align:top}td:first-child{color:var(--mut);width:190px}.old{text-decoration:line-through;color:var(--mut)}.nw{font-weight:600}
@media (max-width:720px){.two{grid-template-columns:1fr}td:first-child{width:auto}}
</style><div class="w"><h1>Text remake, posts 1 to 10</h1><p class="lead">Every caption, every word on screen and every voice line went through the marketing and social skills (ai-tells, mk-social, caption and hook writers, ig-human by hand) and the brand voice and facts. This page is the record of what changed and why. The posts, reels and voices are rebuilt with these texts.</p>
<div class="common"><h3 style="margin-top:0">Across all ten</h3><ul>${COMMON.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>${rows}</div></html>`;
const out = join(concept, 'out', 'review', 'audit.html');
writeFileSync(out, html);
const { chromium } = require('playwright');
const b = await chromium.launch(); const pg = await (await b.newContext({ viewport: { width: 1140, height: 900 }, deviceScaleFactor: 1 })).newPage();
await pg.goto(pathToFileURL(out).href); await pg.screenshot({ path: out.replace('.html', '.png'), fullPage: true }); await b.close();
console.log('wrote', out.replace(concept + '/', ''));
