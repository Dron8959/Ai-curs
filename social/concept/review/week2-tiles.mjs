// Stage 2 of next week's pack: one key picture per post (the cover / first frame, 3:4 like the grid), built
// from the same kit as the first ten so every series keeps its frame. The data lives in week2-art.mjs.
//   node social/concept/review/week2-tiles.mjs [n]   ->  social/concept/out/week2/NN.jpg
import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { css, here, cartoonBg } from '../kit.mjs';
import { TILES } from './week2-art.mjs';
import { KW } from './week2.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = join(here, 'out', 'week2');
mkdirSync(out, { recursive: true });

// Owner, 17 Nov: the cartoon behind every flat tile ([frame, tint opacity]); 13, 15 and 32-36 are cartoon already.
const BG = { 11: ['f3', .7], 12: ['f11', .7], 14: ['f8', .7], 16: ['f19', .7], 17: ['f17', .7], 18: ['f1', .7], 19: ['f5', .7], 20: ['f14', .7],
  21: ['f22', .7], 22: ['f9', .7], 23: ['f17', .7], 24: ['f19', .7], 25: ['f3', .7], 26: ['f11', .7], 27: ['f5', .7], 28: ['f8', .7], 29: ['f22', .7],
  30: ['f14', .7], 31: ['f1', .7] };
const only = process.argv[2] ? [+process.argv[2]] : Object.keys(TILES).map(Number);
const b = await chromium.launch();
const pg = await (await b.newContext({ viewport: { width: 1080, height: 1440 } })).newPage();
for (const n of only) {
  const t = TILES[n];
  const tmp = join(out, `.${n}.html`);
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style><div class="tile ${t.theme}">${BG[n] ? cartoonBg(...BG[n]) : ''}${t.html}${KW[n] ? `<span class="btn" style="right:56px;bottom:46px;height:84px;padding:0 34px;font-size:36px;box-shadow:8px 8px 0 #fff;z-index:12">Comment “${KW[n]}”</span>` : ''}</div>`);
  await pg.goto(pathToFileURL(tmp).href); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(120);
  await pg.screenshot({ path: join(out, `${n}.jpg`), type: 'jpeg', quality: 90 }); unlinkSync(tmp);
}
await b.close();
console.log(`wrote ${only.length} tiles to ${out}`);
