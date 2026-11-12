#!/usr/bin/env node
// The Threads profile as the owner will fill it in the app, shown with the first posts under it.
// A mock-up drawn in code, not a screenshot. Threads has no banner image: the "header" is avatar, name,
// bio (150 characters at most) and one link.
//
//   node social/concept/threads-profile.mjs   -> text/threads/review/profile.png

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { here, repo } from './kit.mjs';
import { posts } from './threads-v2.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const CARDS = join(here, 'text', 'threads');
const OUT = join(CARDS, 'review');
mkdirSync(OUT, { recursive: true });

export const PROFILE = {
  name: 'Make Show Lab',
  handle: 'make_showlab',
  bio: 'A mom and her 10-year-old teaching kids 6-14 to make cartoons, games and songs with AI. Side by side with a parent. First lesson free.',
  linkText: 'makeshowlab.com',
  linkUrl: 'https://www.makeshowlab.com/?utm_source=threads&utm_medium=social&utm_campaign=profile#free',
};

const ic = (n, s = 22) => readFileSync(join(here, 'node_modules/lucide-static/icons', `${n}.svg`), 'utf8')
  .replace(/width="24"/, `width="${s}"`).replace(/height="24"/, `height="${s}"`).replace(/stroke-width="2"/, 'stroke-width="1.8"');
const AVATAR = pathToFileURL(join(repo, 'social/brand/logo/avatar/avatar-1080.png')).href;
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
const SHOWN = [3, 2, 1].map((n) => posts[n - 1]);      // newest first, as after day 1
const post = (p, when) => `<div class="post"><img class="av" src="${AVATAR}"><div class="body">
  <div class="head"><b>${PROFILE.handle}</b><span class="topic">› ${p.topic}</span><span class="when">${when}</span><span class="dots">${ic('ellipsis', 20)}</span></div>
  <div class="txt">${esc(p.text).replace(/(https:\/\/[^\s<]+)/, '<span class="url">makeshowlab.com</span>')}</div>
  ${p.media ? `<img class="card" src="${pathToFileURL(join(CARDS, `${p.media}.jpg`)).href}">` : ''}
  <div class="acts"><span>${ic('heart')}</span><span>${ic('message-circle')}</span><span>${ic('repeat-2')}</span><span>${ic('send')}</span></div></div></div>`;

const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#E9E6DF;font-family:Helvetica,Arial,'Liberation Sans',sans-serif;color:#101010;padding:24px}
.phone{width:480px;background:#fff;border-radius:44px;border:10px solid #141A33;overflow:hidden;position:relative}
.status{height:34px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;font-size:14px;font-weight:700}
.bar{display:flex;justify-content:space-between;align-items:center;padding:8px 22px 0;color:#101010}
.prof{padding:12px 22px 0}
.row1{display:flex;justify-content:space-between;align-items:flex-start}
.nm{font:700 26px Helvetica,Arial}.hd{font-size:16px;margin-top:4px}
.bigav{width:80px;height:80px;border-radius:50%;border:1px solid #E0E0E0;object-fit:cover}
.bio{margin-top:14px;font-size:16px;line-height:1.38}
.lnk{margin-top:10px;font-size:15px;color:#2B6BE6;display:flex;align-items:center;gap:6px}
.btns{display:flex;gap:10px;margin-top:16px}.btn{flex:1;text-align:center;border:1px solid #D6D6D6;border-radius:10px;padding:9px 0;font-weight:700;font-size:15px}
.tabs{display:flex;margin-top:14px;border-bottom:1px solid #E6E6E6}.tabs span{flex:1;text-align:center;padding:12px 0;font-size:15px;font-weight:700;color:#9A9A9A}.tabs .on{color:#101010;border-bottom:2px solid #101010}
.post{display:flex;gap:12px;padding:16px 18px 6px;border-bottom:1px solid #E6E6E6}
.av{width:42px;height:42px;border-radius:50%;border:1px solid #E0E0E0;flex:none;object-fit:cover}
.body{flex:1;min-width:0}
.head{display:flex;align-items:center;gap:7px;font-size:15px}.head b{font-weight:700}.topic{color:#8A8A8A}.when{color:#9A9A9A;margin-left:auto}.dots{color:#6B6B6B;display:flex}
.txt{margin-top:5px;font-size:15.5px;line-height:1.38}.url{color:#2B6BE6}
.card{display:block;width:100%;margin-top:12px;border-radius:12px;border:1px solid #E0E0E0}
.acts{display:flex;gap:22px;padding:12px 2px 10px}
</style>
<div class="phone">
  <div class="status"><span>9:41</span><span>5G</span></div>
  <div class="bar"><span>${ic('globe', 24)}</span><span style="display:flex;gap:20px">${ic('at-sign', 24)}${ic('ellipsis', 24)}</span></div>
  <div class="prof">
    <div class="row1"><div><div class="nm">${PROFILE.name}</div><div class="hd">${PROFILE.handle}</div></div><img class="bigav" src="${AVATAR}"></div>
    <div class="bio">${esc(PROFILE.bio)}</div>
    <div class="lnk">${ic('link', 16)} ${PROFILE.linkText}</div>
    <div class="btns"><div class="btn">Follow</div><div class="btn">Mention</div></div>
    <div class="tabs"><span class="on">Threads</span><span>Replies</span><span>Media</span><span>Reposts</span></div>
  </div>
  ${post(SHOWN[0], 'Day 1 · 8:40 PM')}${post(SHOWN[1], 'Day 1 · 12:40 PM')}${post(SHOWN[2], 'Day 1 · 8:10 AM')}
</div>`;

const tmp = join(OUT, '.profile.html');
writeFileSync(tmp, html);
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 528, height: 1000 }, deviceScaleFactor: 2 })).newPage();
await pg.goto(pathToFileURL(tmp).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(200);
await (await pg.$('.phone')).screenshot({ path: join(OUT, 'profile.png') });
// the top screen only, the way the profile opens
await pg.screenshot({ path: join(OUT, 'profile-top.png'), clip: { x: 0, y: 0, width: 528, height: 760 } });
await browser.close();
unlinkSync(tmp);
console.log('profile.png, profile-top.png');
