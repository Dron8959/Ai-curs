#!/usr/bin/env node
// A picture of how the Threads profile and the first 15 planned posts (threads-v2.mjs) will look in the app.
// It is a mock-up for the owner, drawn in code: not a screenshot of the real app.
//
//   node social/concept/threads-mockup.mjs   -> text/threads/profile-mockup.png

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { here, repo } from './kit.mjs';
import { posts, SLOTS } from './threads-v2.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const OUT = join(here, 'text', 'threads');
const ic = (n, s = 22) => readFileSync(join(here, 'node_modules/lucide-static/icons', `${n}.svg`), 'utf8')
  .replace(/width="24"/, `width="${s}"`).replace(/height="24"/, `height="${s}"`).replace(/stroke-width="2"/, 'stroke-width="1.8"');
const AVATAR = pathToFileURL(join(repo, 'social/brand/logo/avatar/avatar-1080.png')).href;

const BIO = 'AI course for kids 6-14, done side by side with a parent. Cartoons, games, songs. First lesson free.';
const LINK = 'makeshowlab.com';

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
const post = (p) => {
  const when = `Day ${p.day} · ${SLOTS[p.slot]}`;
  const img = p.media ? pathToFileURL(join(OUT, `${p.media}.jpg`)).href : '';
  return `<div class="post">
    <img class="av" src="${AVATAR}">
    <div class="body">
      <div class="head"><b>make_showlab</b><span class="topic">› ${p.topic}</span><span class="when">${when}</span><span class="dots">${ic('ellipsis', 20)}</span></div>
      <div class="txt">${esc(p.text).replace(/(https:\/\/[^\s<]+)/, '<span class="url">makeshowlab.com</span>')}</div>
      ${img ? `<img class="media" src="${img}">` : ''}
      <div class="acts"><span>${ic('heart')}</span><span>${ic('message-circle')}</span><span>${ic('repeat-2')}</span><span>${ic('send')}</span></div>
    </div></div>`;
};
const nav = `<div class="nav"><span>${ic('house', 26)}</span><span>${ic('search', 26)}</span><span class="plus">${ic('plus', 22)}</span><span>${ic('heart', 26)}</span><span class="me">${ic('user-round', 26)}</span></div>`;
const profile = `<div class="prof">
  <div class="row1"><div><div class="nm">Make Show Lab</div><div class="hd">make_showlab</div></div><img class="bigav" src="${AVATAR}"></div>
  <div class="bio">${BIO}</div>
  <div class="lnk">${ic('link', 16)} ${LINK}</div>
  <div class="btns"><div class="btn">Follow</div><div class="btn">Mention</div></div>
  <div class="tabs"><span class="on">Threads</span><span>Replies</span><span>Media</span><span>Reposts</span></div></div>`;

// a profile shows the newest post first: day 5 evening on top, day 1 morning at the very bottom
const days = [5, 4, 3, 2, 1].map((d) => posts.filter((p) => p.day === d).reverse());
const screens = days.map((list, i) => [i === 0 ? profile : '', list.map(post).join('')]);
const html = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#E9E6DF;font-family:Helvetica,Arial,'Liberation Sans',sans-serif;color:#101010;padding:48px 56px;width:2712px}
.title{font:700 26px Helvetica,Arial;margin-bottom:6px}.sub{font-size:17px;color:#555;margin-bottom:28px}
.phones{display:flex;gap:40px;align-items:flex-start}.cap{font:700 20px Helvetica,Arial;margin:0 0 12px 8px;color:#333}.url{color:#2B6BE6}
.phone{width:480px;background:#fff;border-radius:44px;border:10px solid #141A33;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.18);position:relative}
.status{height:34px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;font-size:14px;font-weight:700}
.scr{padding:0 0 76px}
.nav{position:absolute;left:0;right:0;bottom:0;height:66px;background:#fff;border-top:1px solid #E6E6E6;display:flex;justify-content:space-around;align-items:center;color:#9A9A9A}
.nav .plus{background:#F2F2F2;border-radius:12px;width:54px;height:40px;display:flex;align-items:center;justify-content:center;color:#555}.nav .me{color:#101010}
.prof{padding:14px 22px 0}
.row1{display:flex;justify-content:space-between;align-items:flex-start}
.nm{font:700 25px Helvetica,Arial}.hd{font-size:16px;margin-top:4px}
.bigav{width:76px;height:76px;border-radius:50%;border:1px solid #E0E0E0;object-fit:cover}
.bio{margin-top:14px;font-size:16px;line-height:1.35}
.lnk{margin-top:10px;font-size:15px;color:#6B6B6B;display:flex;align-items:center;gap:6px}
.btns{display:flex;gap:10px;margin-top:16px}.btn{flex:1;text-align:center;border:1px solid #D6D6D6;border-radius:10px;padding:9px 0;font-weight:700;font-size:15px}
.tabs{display:flex;margin-top:14px;border-bottom:1px solid #E6E6E6}.tabs span{flex:1;text-align:center;padding:12px 0;font-size:15px;font-weight:700;color:#9A9A9A}.tabs .on{color:#101010;border-bottom:2px solid #101010}
.post{display:flex;gap:12px;padding:16px 18px 6px;border-bottom:1px solid #E6E6E6}
.av{width:42px;height:42px;border-radius:50%;border:1px solid #E0E0E0;flex:none;object-fit:cover}
.body{flex:1;min-width:0}
.head{display:flex;align-items:center;gap:7px;font-size:15px}.head b{font-weight:700}.topic{color:#8A8A8A}.when{color:#9A9A9A;margin-left:auto}.dots{color:#6B6B6B;display:flex}
.txt{margin-top:5px;font-size:15.5px;line-height:1.38}
.media{display:block;width:100%;margin-top:12px;border-radius:12px;border:1px solid #E0E0E0}
.acts{display:flex;gap:22px;padding:12px 2px 10px;color:#101010}
.note{margin-top:26px;font-size:16px;color:#444;max-width:1500px;line-height:1.45}
</style>
<div class="title">Make Show Lab in Threads: the profile and the first 15 posts</div>
<div class="sub">Mock-up drawn in code, not a screenshot. Read the phones as one long scroll: newest on the left (day 5), oldest on the right (day 1), newest at the top of each. Cards are video in the app; here you see the last frame. Follower counts are left out on purpose.</div>
<div class="phones">${screens.map(([a, b], i) => `<div><div class="cap">Day ${5 - i}${i === 0 ? ' (newest, top of the profile)' : ''}</div><div class="phone"><div class="status"><span>9:41</span><span>5G</span></div><div class="scr">${a}${b}</div>${nav}</div></div>`).join('')}</div>
<div class="note">Three posts a day, New York time: 8:10 AM short post, 12:40 PM "AI house rules" (one rule a day), 8:40 PM main post. Every post has its own card, worded from its text. Profile text is a proposal (100 characters).</div>`;

const tmp = join(OUT, '.mockup.html');
writeFileSync(tmp, html);
const browser = await chromium.launch();
const pg = await (await browser.newContext({ viewport: { width: 2824, height: 900 }, deviceScaleFactor: 1.5 })).newPage();
await pg.goto(pathToFileURL(tmp).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(300);
await pg.screenshot({ path: join(OUT, 'profile-mockup.png'), fullPage: true });
await browser.close();
unlinkSync(tmp);
console.log('profile-mockup.png');
