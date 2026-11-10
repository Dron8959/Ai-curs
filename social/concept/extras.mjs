#!/usr/bin/env node
// Profile extras in the same system: six highlight covers and the Facebook cover.
//   node social/concept/extras.mjs      -> social/concept/out/
import { createRequire } from 'node:module';
import { writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { A, C, LOGO, M, css, here, star, card, icon } from './kit.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

const hl = [
  ['free-lesson', C.mint, icon('gift', 190, '#141A33', 2)],
  ['how-it-works', C.navy, icon('list-ordered', 190, C.yellow, 2)],
  ['kid-made', C.yellow, icon('star', 190, '#141A33', 2)],
  ['is-it-safe', C.coral, icon('shield-check', 190, '#141A33', 2)],
  ['pricing', C.cream, icon('tag', 190, '#141A33', 2)],
  ['about-us', C.navy, `<img src="${A(`${LOGO}/logo/icon-plain.svg`)}" style="width:300px" alt="">`],
];
const pages = hl.map(([id, bg, inner]) => ({ file: `highlight-${id}.jpg`, w: 400, h: 400, html: `<div style="width:400px;height:400px;background:${bg};display:grid;place-items:center">${inner}</div>` }));
// Facebook cover, 1640×624: everything that matters sits in the middle 1100 px that phones keep
pages.push({ file: 'facebook-cover.jpg', w: 1640, h: 624, html: `
  <div class="tile k" style="width:1640px;height:624px">
    <i style="position:absolute;left:930px;top:-130px;width:800px;height:800px;border-radius:50%;background:${C.yellow}"></i>
    <img src="${A(`${LOGO}/logo/logo-horizontal-light.svg`)}" style="position:absolute;left:286px;top:150px;width:590px" alt="">
    <span class="pill dark" style="left:300px;top:392px;height:76px;font-size:28px;box-shadow:6px 6px 0 ${C.yellow}">First lesson free · makeshowlab.com</span>
    ${card({ l: 1000, t: 160, w: 216, h: 324, rot: -7, src: `${M}/works/rainbow-drawing.jpg`, cls: 'paper' })}
    ${card({ l: 1168, t: 118, w: 240, h: 360, rot: 5, src: `${M}/works/rainbow-cartoon.jpg`, z: 4 })}
    ${star(60, C.coral, 'left:1420px;top:80px')}${star(30, C.coral, 'left:1470px;top:150px')}${star(44, C.mint, 'left:210px;top:90px')}
  </div>` });

const browser = await chromium.launch();
for (const p of pages) {
  const pg = await (await browser.newContext({ viewport: { width: p.w, height: p.h } })).newPage();
  const tmp = join(out, '.tmp.html');
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css()}</style>${p.html}`);
  await pg.goto(pathToFileURL(tmp).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: join(out, p.file), type: 'jpeg', quality: 92 });
  await pg.context().close();
  unlinkSync(tmp);
  console.log(p.file);
}
await browser.close();
