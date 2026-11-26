// Page "Профиль Instagram": the planned feed as the owner would see it on a phone (owner, 26 Nov). The grid shows the
// planned posts on top (newest first, as Instagram does) and the published ones below; tapping a planned tile opens
// the post with its date, video or carousel and caption, and the owner marks it «Да» or «Нет» (db collection "feed",
// doc = post number: { status: 'yes' | 'no' | '', note, at }).
//   node social/concept/review/profile-page.mjs  ->  social/concept/out/review/profile/index.html + m/
// Holiday dates 2026: Black Friday 27 Nov, Cyber Monday 30 Nov, Giving Tuesday 1 Dec, Hanukkah from 4 Dec evening,
// winter break about 19 Dec - 3 Jan, Christmas 25 Dec. Gift posts go out early so people can buy in time; the gift is
// digital (login by email), so the last-minute post can run until 23 Dec.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const concept = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(concept, '..', '..');
const out = join(concept, 'out', 'review', 'profile');
rmSync(out, { recursive: true, force: true }); mkdirSync(join(out, 'm'), { recursive: true });
const tmp = join(out, '_src'); mkdirSync(tmp, { recursive: true });
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const HEAD = new Set([37, 38, 39, 40, 41, 42, 43, 44, 45, 46]);   // last checked versions (a QA pass was stopped half-way)
const dirOf = (n) => readdirSync(join(concept, 'posts')).find((d) => d.startsWith(String(n).padStart(2, '0') + '-'));
const src = (n, f) => {
  const rel = `social/concept/posts/${dirOf(n)}/${f}`;
  if (!HEAD.has(n)) return existsSync(join(repo, rel)) ? join(repo, rel) : null;
  const p = join(tmp, `${n}-${f.replace(/\//g, '_')}`);
  try { writeFileSync(p, execFileSync('git', ['-C', repo, 'show', `HEAD:${rel}`], { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] })); return p; } catch { return null; }
};
const body = (md) => md.replace(/^---[\s\S]*?---\n/, '').trim();

// [date, time, post, why] — the proposal; the owner says yes or no per post
export const PLAN = [
  ['2026-11-27', '08:00', 47, 'Чёрная пятница: подарок'], ['2026-11-27', '12:30', 39, 'подарки, а не игрушки'], ['2026-11-27', '19:30', 37, 'домашка'],
  ['2026-11-28', '08:00', 40, 'суббота дома'], ['2026-11-28', '12:30', 48, 'подарок на всю зиму'], ['2026-11-28', '19:30', 38, 'почему ИИ выдумывает'],
  ['2026-11-29', '08:00', 42, '5 правил на холодильник'], ['2026-11-29', '12:30', 27, 'песня для бабушки'], ['2026-11-29', '19:30', 43, 'смотрит или делает'],
  ['2026-11-30', '08:00', 49, 'Киберпонедельник: подарок без доставки'], ['2026-11-30', '12:30', 44, 'одна привычка'], ['2026-11-30', '19:30', 30, 'цены'],
  ['2026-12-01', '08:00', 41, '3 вопроса до ChatGPT'], ['2026-12-01', '12:30', 21, 'стикеры: идея подарка'], ['2026-12-01', '19:30', 45, 'объясни своими словами'],
  ['2026-12-02', '08:00', 46, 'игра: 3 способа'], ['2026-12-02', '12:30', 22, 'живой ли ИИ'], ['2026-12-02', '19:30', 24, 'чатбот и школа'],
  ['2026-12-03', '08:00', 19, 'ребёнку 6 лет'], ['2026-12-03', '12:30', 29, 'рисунок в мультфильм'], ['2026-12-03', '19:30', 28, 'человек или ИИ'],
  ['2026-12-17', '12:30', 50, 'подарок в последний момент, без доставки'],
];
const PUBLISHED = [15, 14, 13, 18, 11, 4, 10, 9, 6, 8, 7, 5, 2, 3, 1];   // already on the profile (newest first)
const files = [];
const tile = (n, name) => { const s = src(n, 'tile.jpg'); if (!s) return ''; const o = `m/${name}.jpg`; ff('-i', s, '-vf', 'scale=360:-2', '-q:v', '5', join(out, o)); files.push(o); return o; };
const posts = PLAN.map(([date, time, n, why]) => {
  const d = dirOf(n); const r = { n, date, time, why, ig: body(readFileSync(src(n, 'caption.md'), 'utf8')), tile: tile(n, `t${n}`) };
  const v = src(n, 'reel.mp4');
  if (v) { r.video = `m/${n}.mp4`; ff('-i', v, '-vf', 'scale=540:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', join(out, r.video)); files.push(r.video); }
  else r.slides = readdirSync(join(concept, 'posts', d)).filter((f) => /^slide-\d+\.jpg$/.test(f)).sort().map((f, i) => { const o = `m/${n}-${i + 1}.jpg`; ff('-i', src(n, f), '-vf', 'scale=540:-2', '-q:v', '4', join(out, o)); files.push(o); return o; });
  r.group = n >= 47 ? 'праздник' : n >= 37 ? '80/20' : 'пак 2';
  return r;
});
const pub = PUBLISHED.map((n) => ({ n, tile: tile(n, `p${n}`) })).filter((p) => p.tile);
ff('-i', join(repo, 'social/media/brand/avatar-1080.png'), '-vf', 'scale=180:-2', join(out, 'm/avatar.png')); files.push('m/avatar.png');
rmSync(tmp, { recursive: true, force: true });
const json = JSON.stringify({ posts: [...posts].reverse(), pub }).replace(/</g, '\\u003c');

const html = `<title>Профиль Instagram</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Layout: a phone-width Instagram profile, 3-column 3:4 grid; a tapped planned tile opens a full-screen post sheet */
:root{--bg:#ffffff;--fg:#0c0c0d;--mute:#737373;--line:#dbdbdb;--chip:#efefef;--yes:#1d8a5b;--yes-soft:#dff3e9;--no:#c2410c;--no-soft:#fde8dc;--accent:#0095f6;--sheet:#ffffff;--shade:rgba(0,0,0,.55);--ui:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#000000;--fg:#f5f5f5;--mute:#a8a8a8;--line:#262626;--chip:#262626;--yes:#5fd39c;--yes-soft:#173a2b;--no:#ff9a6b;--no-soft:#3d2317;--accent:#4cb5f9;--sheet:#121212;--shade:rgba(0,0,0,.7);color-scheme:dark}}
:root[data-theme="dark"]{--bg:#000000;--fg:#f5f5f5;--mute:#a8a8a8;--line:#262626;--chip:#262626;--yes:#5fd39c;--yes-soft:#173a2b;--no:#ff9a6b;--no-soft:#3d2317;--accent:#4cb5f9;--sheet:#121212;--shade:rgba(0,0,0,.7);color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:14px/1.4 var(--ui);padding-block:0 40px}
.phone{max-width:430px;margin:0 auto}
.bar{display:flex;align-items:center;justify-content:center;gap:6px;height:44px;font-weight:700;font-size:16px;border-bottom:1px solid var(--line)}
.head{display:grid;grid-template-columns:86px minmax(0,1fr);gap:18px;align-items:center;padding:14px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px))}
.ava{width:86px;height:86px;border-radius:50%;background:var(--chip);overflow:hidden;border:1px solid var(--line)}
.ava img{width:100%;height:100%;object-fit:cover}
.stats{display:flex;justify-content:space-between;text-align:center;font-variant-numeric:tabular-nums}
.stats b{display:block;font-size:16px}
.stats span{font-size:13px}
.bio{padding:0 max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px));display:grid;gap:2px}
.bio a{color:#00376b;font-weight:600;text-decoration:none}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .bio a{color:#e0f1ff}}
:root[data-theme="dark"] .bio a{color:#e0f1ff}
.legend{margin:12px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px));padding:10px 12px;background:var(--chip);border-radius:10px;font-size:13px;display:grid;gap:4px}
.sum{display:flex;gap:10px;flex-wrap:wrap;font-weight:600;font-variant-numeric:tabular-nums}
.tabs{display:flex;border-top:1px solid var(--line);margin-top:8px}
.tabs span{flex:1;text-align:center;padding:10px 0;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
.tabs span.on{color:var(--fg);box-shadow:inset 0 -1px 0 var(--fg)}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px}
.tile{position:relative;aspect-ratio:3/4;background:var(--chip);border:0;padding:0;cursor:pointer;overflow:hidden;display:block;width:100%}
.tile img{width:100%;height:100%;object-fit:cover;display:block}
.tile .d{position:absolute;left:4px;top:4px;background:rgba(0,0,0,.66);color:#fff;font-size:10px;font-weight:600;padding:2px 5px;border-radius:4px}
.tile .k{position:absolute;right:4px;top:4px;color:#fff;font-size:13px;text-shadow:0 0 3px rgba(0,0,0,.8)}
.tile .s{position:absolute;inset:auto 0 0 0;padding:3px 0;text-align:center;font-size:11px;font-weight:700;color:#fff}
.tile.yes .s{background:rgba(29,138,91,.92)}.tile.no .s{background:rgba(194,65,12,.92)}.tile.no img{opacity:.35}
.tile.pub{cursor:default}.tile.pub img{opacity:.5}
.sep{grid-column:1/-1;padding:10px 16px;font-size:12px;color:var(--mute);background:var(--bg)}
.sheet{position:fixed;inset:0;z-index:20;background:var(--shade);display:flex;justify-content:center;align-items:flex-end}
.sheet[hidden]{display:none!important}
.card{background:var(--sheet);width:100%;max-width:430px;max-height:100%;overflow-y:auto;border-radius:14px 14px 0 0;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}
.ch{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line)}
.ch img{width:32px;height:32px;border-radius:50%}
.ch .who{flex:1;min-width:0}.ch .who b{display:block}.ch .who span{font-size:12px;color:var(--mute)}
.x{border:0;background:transparent;color:var(--fg);font-size:26px;line-height:1;cursor:pointer;padding:4px 8px}
.media video,.media img{width:100%;display:block;background:#000}
.media video{aspect-ratio:9/16;max-height:70vh;object-fit:contain}
.car{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}
.car img{flex:0 0 100%;scroll-snap-align:start;aspect-ratio:4/5;object-fit:cover}
.hint{font-size:12px;color:var(--mute);padding:6px 14px 0}
.cap{padding:10px 14px;white-space:pre-wrap;font-size:14px}
.cap b{margin-right:6px}
.why{padding:0 14px;font-size:13px;color:var(--mute)}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 14px 0}
.acts button{font:700 15px var(--ui);border-radius:10px;padding:12px;cursor:pointer;border:2px solid var(--line);background:transparent;color:var(--fg)}
.acts .yes[aria-pressed="true"]{background:var(--yes-soft);border-color:var(--yes);color:var(--yes)}
.acts .no[aria-pressed="true"]{background:var(--no-soft);border-color:var(--no);color:var(--no)}
textarea{display:block;width:calc(100% - 28px);margin:10px 14px 0;box-sizing:border-box;min-height:64px;font:14px/1.4 var(--ui);color:var(--fg);background:var(--chip);border:1px solid var(--line);border-radius:10px;padding:8px 10px}
.msg{padding:6px 14px 0;font-size:12px;color:var(--mute);min-height:1em}
button:focus-visible,textarea:focus{outline:2px solid var(--accent);outline-offset:1px}
</style>
<div class="phone">
  <div class="bar">make_showlab</div>
  <div class="head"><div class="ava"><img src="m/avatar.png" alt="аватар"></div>
    <div class="stats"><div><b id="cnt">0</b><span>posts</span></div><div><b>1,274</b><span>followers</span></div><div><b>—</b><span>following</span></div></div></div>
  <div class="bio" lang="en"><b>Make Show Lab</b><span>AI creativity for kids 6–14, made with a parent.</span><span>First lesson free, no card ↓</span><a href="https://www.makeshowlab.com" target="_blank" rel="noopener">makeshowlab.com</a></div>
  <div class="legend"><span>Так будет выглядеть профиль. Сверху посты по плану (с датой), ниже то, что уже вышло. Нажмите на пост: откроется, как в Instagram, там «Да» или «Нет».</span><span class="sum" id="sum"></span></div>
  <div class="tabs"><span class="on">▦ Posts</span><span>▶ Reels</span><span>☺ Tagged</span></div>
  <div class="grid" id="grid"></div>
</div>
<div class="sheet" id="sheet" hidden>
  <div class="card" role="dialog" aria-modal="true" aria-labelledby="sheetWho">
    <div class="ch"><img src="m/avatar.png" alt=""><div class="who"><b id="sheetWho">make_showlab</b><span id="when"></span></div><button class="x" id="close" type="button" aria-label="Закрыть">×</button></div>
    <div class="media" id="media"></div>
    <p class="why" id="why"></p>
    <div class="cap" lang="en"><b>make_showlab</b><span id="cap"></span></div>
    <div class="acts"><button class="yes" id="yes" type="button" aria-pressed="false">Да</button><button class="no" id="no" type="button" aria-pressed="false">Нет</button></div>
    <textarea id="note" placeholder="Замечание (необязательно)" aria-label="замечание"></textarea>
    <p class="msg" id="msg"></p>
  </div>
</div>
<script>
const D = ${json};
const DAYS = ['вс','пн','вт','ср','чт','пт','сб'];
const saved = {}; let db = null, canWrite = false, open = null;
const $ = (s) => document.querySelector(s);
function el(tag, attrs = {}, text) { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; }
const fmt = (p) => { const d = new Date(p.date + 'T12:00:00Z'); return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + '.' + String(d.getUTCMonth() + 1).padStart(2, '0') + ' · ' + p.time; };
function render() {
  const g = $('#grid'); g.textContent = '';
  for (const p of D.posts) {
    const s = (saved[p.n] || {}).status || '';
    const b = el('button', { class: 'tile ' + s, type: 'button', 'aria-label': '№' + p.n + ', ' + fmt(p) });
    b.append(el('img', { src: p.tile, alt: '', loading: 'lazy' }), el('span', { class: 'd' }, fmt(p)));
    b.append(el('span', { class: 'k' }, p.video ? '▶' : '❐'));
    if (s) b.append(el('span', { class: 's' }, s === 'yes' ? 'Да' : 'Нет'));
    b.onclick = () => show(p); g.append(b);
  }
  g.append(el('div', { class: 'sep' }, 'Уже вышло'));
  for (const p of D.pub) { const t = el('div', { class: 'tile pub' }); t.append(el('img', { src: p.tile, alt: '№' + p.n, loading: 'lazy' })); g.append(t); }
  $('#cnt').textContent = String(D.posts.length + D.pub.length);
  const v = Object.values(saved);
  $('#sum').textContent = 'Да: ' + v.filter((x) => x.status === 'yes').length + ' · Нет: ' + v.filter((x) => x.status === 'no').length + ' · Ждут: ' + (D.posts.length - v.filter((x) => x.status).length);
}
function paint() { const s = (saved[open.n] || {}).status || ''; $('#yes').setAttribute('aria-pressed', String(s === 'yes')); $('#no').setAttribute('aria-pressed', String(s === 'no')); }
function show(p) {
  open = p; const m = $('#media'); m.textContent = '';
  if (p.video) m.append(el('video', { src: p.video, controls: '', playsinline: '', autoplay: '', muted: '' }));
  else { const c = el('div', { class: 'car' }); p.slides.forEach((s, i) => c.append(el('img', { src: s, alt: 'слайд ' + (i + 1) }))); m.append(c, el('p', { class: 'hint' }, p.slides.length + ' слайдов, листайте вбок')); }
  $('#when').textContent = fmt(p) + ' · №' + p.n + ' · ' + p.group;
  $('#why').textContent = p.why; $('#cap').textContent = p.ig;
  $('#note').value = (saved[p.n] || {}).note || ''; $('#msg').textContent = canWrite ? '' : 'Отметки сейчас не сохраняются: нет доступа к записи.';
  paint(); $('#sheet').hidden = false; $('#close').focus();
}
function hide() { const v = $('#media video'); if (v) v.pause(); $('#sheet').hidden = true; open = null; }
async function mark(st) {
  if (!open) return; const n = open.n; const cur = (saved[n] || {}).status || ''; const status = cur === st ? '' : st;
  if (!db || !canWrite) { $('#msg').textContent = 'Не сохранено: нет доступа к записи.'; return; }
  $('#msg').textContent = 'Сохраняю…';
  try { await db.doc('feed/' + n).set({ status, note: $('#note').value, at: new Date().toISOString() }); saved[n] = { status, note: $('#note').value }; paint(); render(); $('#msg').textContent = status ? 'Отмечено' : 'Отметка снята'; }
  catch (e) { $('#msg').textContent = 'Не сохранилось (' + (e && e.code || 'ошибка') + '). Попробуйте ещё раз.'; }
}
$('#yes').onclick = () => mark('yes'); $('#no').onclick = () => mark('no');
$('#note').onchange = async () => { if (!open || !db || !canWrite) return; const n = open.n; try { await db.doc('feed/' + n).set({ ...(saved[n] || {}), note: $('#note').value, at: new Date().toISOString() }); saved[n] = { ...(saved[n] || {}), note: $('#note').value }; $('#msg').textContent = 'Замечание сохранено'; } catch (e) { $('#msg').textContent = 'Замечание не сохранилось.'; } };
$('#close').onclick = hide; $('#sheet').onclick = (e) => { if (e.target.id === 'sheet') hide(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) hide(); });
render();
(async () => {
  try {
    db = await window.claude?.use?.('db'); const user = await window.claude?.use?.('user');
    canWrite = !!db && ((await user?.can?.('data.write')) ?? true); if (!db) return;
    db.collection('feed').onSnapshot((snap) => { for (const d of snap.docs) saved[d.id] = d.data() || {}; render(); if (open) paint(); }, () => {});
  } catch (e) {}
})();
</script>`;
writeFileSync(join(out, 'index.html'), html);
writeFileSync(join(out, 'files.json'), JSON.stringify(files.map((f) => ({ path: f }))));
console.log('wrote', join(out, 'index.html'), files.length, 'files');
