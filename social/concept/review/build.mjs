// One review picture per post: how it looks in the Instagram app, plus everything around it (caption checks, music,
// voice, slot, what is unconfirmed). Open the PNGs, say what to change.
//   node social/concept/review/build.mjs          all ten      node social/concept/review/build.mjs 05    one
// Output: social/concept/out/review/NN-<id>.png (not committed beyond the repo's out/ rules).
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { slotOf } from './schedule.mjs';
import { META } from './meta.mjs';
import { PASS } from './pass.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const concept = resolve(here, '..');
const out = join(concept, 'out', 'review');
const tmp = join(out, '.frames');
mkdirSync(tmp, { recursive: true });
const U = (p) => pathToFileURL(p).href;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AVATAR = U(join(concept, 'preview', 'n', 'avatar.jpg'));

function readPost(dir) {
  const raw = readFileSync(join(concept, 'posts', dir, 'caption.md'), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = Object.fromEntries(m[1].split('\n').map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\"/g, '"')]; }));
  return { dir, fm, caption: m[2].trim() };
}
function voiceLines(id) {
  const t = readFileSync(join(concept, 'sound', 'VOICEOVER.md'), 'utf8');
  const sec = t.split(/^### /m).find((s) => s.startsWith(id));
  if (!sec) return null;
  const head = sec.split('\n')[0];
  const rows = [...sec.matchAll(/^\| (\d+) \| ([\d.]+-[\d.]+) \| (.+?) \| [\d.]+/gm)].map((r) => ({ t: r[2], line: r[3] }));
  return { head, rows };
}
function checks(caption) {
  const first = caption.split('\n')[0];
  const tags = caption.match(/#\w+/g) || [];
  return [
    [first.length <= 125, `First line ${first.length} of 125 characters`],
    [tags.length <= 5, `${tags.length} hashtags (max 5)`],
    [!/https?:\/\/|www\./i.test(caption), 'No links in the caption'],
    [!/[—–]/.test(caption), 'No long dashes'],
    [(caption.match(/in (our )?bio|send this|save this|send it|forward this/gi) || []).length >= 1, 'Has one call to action'],
  ];
}
const capHtml = (c, collapsed) => {
  const tag = (t) => t.replace(/#(\w+)/g, '<span class="tag">#$1</span>');
  if (!collapsed) return tag(esc(c)).replace(/\n/g, '<br>');
  const flat = c.replace(/\s*\n\s*/g, ' ');
  if (flat.length <= 92) return tag(esc(flat));
  const cut = flat.slice(0, 92).replace(/\s+\S*$/, '').replace(/[.,;:]+$/, '');
  return tag(esc(cut)) + '<span class="more">… more</span>';
};
const ICON = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-8-4.7-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.3-8 11-8 11z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M22 3 9.5 10.5M22 3l-7 18-5.5-10.5L22 3zM9.5 10.5 2 8.5 22 3"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
};

function reelPhone(p, media) {
  const first = p.caption.split('\n')[0];
  return `<div class="phone"><div class="rview">${media}
    <div class="rtop"><b>Reels</b><span>Friends</span></div>
    <div class="rail"><div>${ICON.heart}<i>Like</i></div><div>${ICON.comment}<i>Comment</i></div><div>${ICON.send}<i>Send</i></div><div>${ICON.dots}</div></div>
    <div class="rbottom"><div class="who"><img src="${AVATAR}"><b>make_showlab</b><span class="fol">Follow</span></div>
      <div class="rcap">${capHtml(p.caption, true)}</div>
      <div class="rmusic">${ICON.music}<span>make_showlab · Original audio</span></div></div></div></div>`;
}
function feedPhone(p, slides, live) {
  if (live) return `<div class="phone"><div class="feed">
    <div class="ph"><img src="${AVATAR}"><div><b>make_showlab</b></div><span class="dots">${ICON.dots}</span></div>
    <div class="media sw" id="sw">${slides.map((x) => `<img src="${x}">`).join('')}<span class="count" id="ct">1/${slides.length}</span></div>
    <div class="acts"><span>${ICON.heart}</span><span>${ICON.comment}</span><span>${ICON.send}</span><span class="sv">${ICON.save}</span></div>
    <div class="cap"><b>make_showlab</b> ${capHtml(p.caption, true)}</div></div></div>
    <script>var sw=document.getElementById('sw'),ct=document.getElementById('ct');sw.addEventListener('scroll',function(){ct.textContent=(Math.round(sw.scrollLeft/sw.clientWidth)+1)+'/${slides.length}'});</script>`;
  return `<div class="phone"><div class="feed">
    <div class="ph"><img src="${AVATAR}"><div><b>make_showlab</b></div><span class="dots">${ICON.dots}</span></div>
    <div class="media"><img src="${slides[0]}"><span class="count">1/${slides.length}</span></div>
    <div class="acts"><span>${ICON.heart}</span><span>${ICON.comment}</span><span>${ICON.send}</span><i class="dotsrow">${slides.slice(0, 5).map((_, i) => `<u class="${i ? '' : 'on'}"></u>`).join('')}${slides.length > 5 ? '<u></u>' : ''}</i><span class="sv">${ICON.save}</span></div>
    <div class="cap"><b>make_showlab</b> ${capHtml(p.caption, true)}</div></div></div>`;
}
function frames(dir, n, f) {
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
  const res = [];
  for (let i = 0; i < n; i++) {
    const t = Math.min(dur - 0.1, 0.3 + (dur - 0.6) * i / (n - 1));
    const o = join(tmp, `${dir}-${i}.jpg`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', t.toFixed(2), '-i', f, '-frames:v', '1', '-vf', 'scale=270:-2', '-q:v', '3', o]);
    res.push({ src: U(o), t: t.toFixed(1) });
  }
  return { res, dur };
}

const CSS = `
*{box-sizing:border-box;margin:0}body{background:#F4EFE4;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#141A33;width:1380px;padding:34px}
.top{display:flex;align-items:baseline;gap:16px;margin-bottom:22px}.top h1{font-size:34px;letter-spacing:-.02em}.top .n{background:#141A33;color:#FFC533;border-radius:10px;padding:2px 12px;font-weight:800;font-size:26px}
.top .tag2{font-size:15px;color:#5B6180}.layout{display:grid;grid-template-columns:400px 1fr;gap:34px;align-items:start}
.phone{width:400px;border-radius:38px;background:#0B0D1C;padding:9px}
.feed,.rview{border-radius:30px;overflow:hidden;background:#fff;position:relative;color:#0C0C0F;font-size:14px;line-height:1.38}
.ph{display:flex;align-items:center;gap:10px;padding:12px 12px 10px}.ph img{width:34px;height:34px;border-radius:50%}.ph b{font-size:14px}.ph .dots{margin-left:auto;width:22px}
.sw{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.sw::-webkit-scrollbar{display:none}.sw img{flex:none;width:100%;scroll-snap-align:start}.sw .count{position:sticky;right:12px;margin-left:-70px;align-self:flex-start;top:12px;left:auto}.media{position:relative;aspect-ratio:4/5;background:#eee}.media img{width:100%;height:100%;object-fit:cover;display:block}.count{position:absolute;right:12px;top:12px;background:rgba(20,20,24,.72);color:#fff;border-radius:12px;padding:3px 10px;font-size:12px;font-weight:600}
.acts{display:flex;align-items:center;gap:14px;padding:11px 12px 6px}.acts span{width:25px;height:25px;display:block}.acts .sv{margin-left:auto}.dotsrow{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:4px}.dotsrow u{width:6px;height:6px;border-radius:50%;background:#C7C7CC}.dotsrow u.on{background:#0095F6}
.cap{padding:2px 12px 16px;font-size:14px}.cap b{font-weight:700}.tag{color:#00376B}.more{color:#737380}
.rview{aspect-ratio:9/16;background:#000;color:#fff}.rbg{background:#000;position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.rview:after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.62) 0,rgba(0,0,0,0) 34%,rgba(0,0,0,0) 80%,rgba(0,0,0,.35) 100%)}
.rtop{position:absolute;z-index:2;top:16px;left:16px;right:16px;display:flex;gap:18px;font-size:18px}.rtop span{opacity:.7}
.rail{position:absolute;z-index:2;right:12px;bottom:130px;display:flex;flex-direction:column;gap:20px;align-items:center}.rail div{display:flex;flex-direction:column;align-items:center;font-size:11px;gap:3px}.rail svg{width:28px;height:28px}.rail i{font-style:normal}
.rbottom{position:absolute;z-index:2;left:14px;right:62px;bottom:18px}.who{display:flex;align-items:center;gap:8px;font-size:14px}.who img{width:32px;height:32px;border-radius:50%;border:1.5px solid #fff}.fol{border:1px solid #fff;border-radius:7px;padding:2px 9px;font-size:12px;font-weight:600}
.rcap{margin-top:9px;font-size:13.5px;line-height:1.35}.rcap .tag{color:#fff}.rcap .more{color:#ddd}.rmusic{display:flex;align-items:center;gap:6px;margin-top:9px;font-size:12.5px}.rmusic svg{width:14px;height:14px}
.side{display:flex;flex-direction:column;gap:16px}.card{background:#fff;border:1px solid #E9E0CB;border-radius:16px;padding:16px 18px}.card h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#FF6F4A;margin-bottom:8px}
.full{font-size:15px;line-height:1.5;white-space:normal}.full .tag{color:#00376B}.kv{display:grid;grid-template-columns:150px 1fr;gap:6px 14px;font-size:14.5px}.kv b{color:#5B6180;font-weight:600}
.chk{list-style:none;padding:0;font-size:14.5px;display:grid;gap:4px}.chk li:before{content:'✓ ';color:#1E9E6A;font-weight:800}.chk li.bad:before{content:'✗ ';color:#D93A2B}
.pass{background:#EAFBF3;border-color:#5FE0A8}.pass h2{color:#1E7F58}.chg{border-collapse:collapse;font-size:14px;width:100%}.chg td{border-top:1px solid #CFEBDD;padding:6px 8px;vertical-align:top}.chg td:first-child{color:#5B6180;width:170px}.chg .old{text-decoration:line-through;color:#8A8FA8}.full.old{color:#6B7090;font-size:13.5px}.chg .new{font-weight:600}.notes{padding-left:18px;font-size:14.5px;display:grid;gap:5px}.hold{background:#FFF1D2;border-color:#F2A200}.hold h2{color:#B26B00}
.vo b{white-space:nowrap}.vo{font-size:14px;display:grid;grid-template-columns:100px 1fr;gap:3px 12px}.vo b{color:#5B6180;font-weight:600;font-variant-numeric:tabular-nums}
.strip{display:flex;gap:8px;overflow:hidden}.strip div{flex:none;text-align:center;font-size:11px;color:#5B6180}.strip img{display:block;border-radius:8px;height:200px;width:auto;margin-bottom:3px}
.sl{display:grid;grid-template-columns:repeat(9,1fr);gap:6px}.sl img{width:100%;border-radius:6px;display:block}
.snd{position:absolute;z-index:4;left:50%;top:46%;transform:translateX(-50%);background:rgba(20,20,24,.75);color:#fff;border:0;border-radius:24px;padding:10px 18px;font:600 14px -apple-system,Segoe UI,Roboto,sans-serif;cursor:pointer}.snd.hide{display:none}.mark{display:inline-block;background:#FFC533;border-radius:8px;padding:1px 9px;font-weight:700;font-size:13px}
`;

function page(p, live) {
  const id = p.dir, n = +p.fm.post, meta = META[n], slot = slotOf(n), reel = p.fm.type === 'reel';
  const dirp = join(concept, 'posts', id);
  const slides = reel ? [] : readdirSync(dirp).filter((f) => /^slide-\d+\.jpg$/.test(f)).sort().map((f) => U(join(dirp, f)));
  const vo = reel ? voiceLines(id) : null;
  const voicedFile = join(concept, 'out', `voice-sample-${String(n).padStart(2, '0')}.mp4`);
  const voiced = reel && existsSync(voicedFile);
  const videoFile = voiced ? voicedFile : join(dirp, 'reel.mp4');
  const fr = reel ? frames(id, 8, videoFile) : null;
  const still = reel ? U(join(tmp, `${id}-still.jpg`)) : '';
  if (reel) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '2.0', '-i', videoFile, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '3', join(tmp, `${id}-still.jpg`)]);
  const media = !reel ? '' : live
    ? `<video class="rbg" id="v" src="data:video/mp4;base64,${readFileSync(videoFile).toString('base64')}" poster="${still}" autoplay muted loop playsinline></video><button class="snd" id="snd" onclick="var v=document.getElementById('v');v.muted=false;v.currentTime=0;v.play();this.classList.add('hide')">Tap for sound</button>`
    : `<img class="rbg" src="${still}">`;
  const ck = checks(p.caption);
  const music = reel ? '"Playground Fun" by Ahjay Stelino (Mixkit free licence), cut to the picture, with real sound effects. ' : 'none (carousel)';
  const html = `<!doctype html><meta charset="utf-8"><style>${CSS}</style><body>
  <div class="top"><span class="n">${n}</span><h1>${esc(p.fm.rubric)} · ${reel ? 'Reel' : 'Carousel, ' + slides.length + ' slides'}</h1><span class="tag2">${meta.type} · ${slot ? 'proposed ' + slot.text : ''}</span></div>
  <div class="layout"><div>${reel ? reelPhone(p, media) : feedPhone(p, slides, live)}</div>
  <div class="side">
    ${meta.hold ? `<div class="card hold"><h2>Held: needs a fact confirmed</h2>${esc(meta.hold)}</div>` : ''}
    <div class="card"><h2>Full caption (what opens after "more")</h2><div class="full">${capHtml(p.caption, false)}</div></div>
    ${PASS[n] ? `<div class="card pass"><h2>Text remake: ${esc(PASS[n].verdict)}</h2><ul class="notes">${PASS[n].notes.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>${PASS[n].before ? `<h2 style="margin-top:12px">Caption before the remake</h2><div class="full old">${capHtml(PASS[n].before, false)}</div>` : ''}${PASS[n].screen.length ? `<h2 style="margin-top:12px">Changed on screen and in the voice</h2><table class="chg">${PASS[n].screen.map(([w, a, c]) => `<tr><td>${esc(w)}</td><td class="old">${esc(a)}</td><td class="new">${esc(c)}</td></tr>`).join('')}</table>` : ''}</div>` : ''}
    ${PASS[n] && PASS[n].open ? `<div class="card hold"><h2>Needs your answer</h2>${esc(PASS[n].open)}</div>` : ''}
    <div class="card"><h2>Checks</h2><ul class="chk">${ck.map(([ok, t]) => `<li class="${ok ? '' : 'bad'}">${esc(t)}</li>`).join('')}</ul></div>
    <div class="card"><h2>Details</h2><div class="kv">
      <b>Why this post</b><span>${esc(meta.why)}</span>
      <b>Who forwards it</b><span>${esc(meta.fwd)}</span>
      <b>Music</b><span>${esc(music)}</span>
      <b>Voice</b><span>${voiced ? 'cloned voice (' + esc(vo.head.replace(/^\S+ · /, '').replace(/ · [\d.]+ s$/, '')) + ') is in this video; test version, the owner decides' : vo ? 'not in the reel yet' : reel ? 'none' : 'none (carousel)'}</span>
      <b>AI label</b><span>${p.fm.ai_generated === 'true' ? 'ON when publishing (pictures are AI-made)' + (voiced ? ' and the voice is cloned' : '') : voiced ? 'ON when publishing: the voice in this version is cloned (the pictures are real)' : 'off'}</span>
      <b>Slot</b><span>${slot ? esc(slot.text) + ' (proposed, not set anywhere yet)' : ''}</span>
      ${p.fm.alt ? `<b>Alt text</b><span>${esc(p.fm.alt)}</span>` : ''}
    </div></div>
    ${vo ? `<div class="card"><h2>Voice-over lines</h2><div class="vo">${vo.rows.map((r) => `<b>${r.t} s</b><span>${esc(r.line)}</span>`).join('')}</div></div>` : ''}
    ${reel ? `<div class="card"><h2>The reel, ${fr.dur.toFixed(1)} s, frames in order</h2><div class="strip">${fr.res.map((f) => `<div><img src="${f.src}">${f.t} s</div>`).join('')}</div></div>` : `<div class="card"><h2>All slides</h2><div class="sl">${slides.map((s) => `<img src="${s}">`).join('')}</div></div>`}
  </div></div></body>`;
  return html;
}

const only = process.argv[2];
const dirs = readdirSync(join(concept, 'posts')).filter((d) => /^\d\d-/.test(d)).filter((d) => !only || d.startsWith(only));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1450, height: 1000 }, deviceScaleFactor: 2 });
for (const d of dirs) {
  const p = readPost(d);
  const f = join(tmp, d + '.html');
  writeFileSync(join(out, `${d}.html`), page(p, true));
  writeFileSync(f, page(p, false));
  const pg = await ctx.newPage();
  await pg.goto(U(f)); await pg.waitForTimeout(400);
  const png = join(out, `${d}.png`);
  await pg.screenshot({ path: png, fullPage: true });
  await pg.close();
  console.log('wrote', png.replace(concept + '/', ''));
}
await b.close();
