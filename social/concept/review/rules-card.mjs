// The RULES card: what a parent gets in DMs after commenting RULES. One picture, 1080×1350, lab frame.
//   node social/concept/review/rules-card.mjs   ->  social/concept/out/rules-card.png
// Rules 1, 2, 4 and 5 are the course's safety rules (social/brand/facts.md); the list under rule 3 is general safety advice.
import { writeFileSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { css, here, top, foot } from '../kit.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const RULES = [
  ['The account is yours.', 'Every AI tool runs on the parent’s account. Your kid never signs up alone.'],
  ['No chats with strangers.', 'Your kid doesn’t message people they don’t know, in any app.'],
  ['Some things stay out of AI.', 'Full name with school, home address, passwords, photos of their face.'],
  ['Links get a second look.', 'A link that looks strange doesn’t get clicked. Ask first.'],
  ['Too perfect? Check it.', 'A picture, a video or a text can be fake.'],
];
const body = `<div class="tile c" style="height:1350px">
  ${top('lab')}
  <h1 class="t" style="top:190px;font-size:116px">5 AI<br><mark>house rules.</mark></h1>
  <span style="position:absolute;left:340px;top:205px;transform:rotate(-5deg);font:400 58px 'Caveat Brush';color:#141A33">for the fridge</span>
  <div style="position:absolute;left:64px;right:64px;top:450px;background:#FFF4DC;border:6px solid #141A33;border-radius:36px;box-shadow:12px 12px 0 #141A33;padding:34px 40px;display:grid;gap:20px">
    ${RULES.map(([h, t], i) => `<div style="display:flex;gap:26px;align-items:flex-start">
      <b style="flex:none;display:grid;place-items:center;width:74px;height:74px;border-radius:50%;background:#141A33;color:#FFF4DC;font:800 38px Sora">${i + 1}</b>
      <div><p style="font:800 44px/1.05 Sora;letter-spacing:-.04em;color:#141A33">${h}</p><p style="margin-top:6px;font:600 31px/1.25 Urbanist;color:#4B5070">${t}</p></div></div>`).join('')}
  </div>
  ${foot(false)}
  <p style="position:absolute;z-index:9;right:64px;bottom:62px;font:800 30px Urbanist;color:#141A33">First lesson free · makeshowlab.com</p>
</div>`;
const out = join(here, 'out', 'rules-card.png');
const tmp = `${out}.html`;
writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style>${body}`);
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1080, height: 1350 } })).newPage();
await pg.goto(pathToFileURL(tmp).href); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150);
await pg.screenshot({ path: out }); await b.close(); unlinkSync(tmp);
console.log('wrote', out);
