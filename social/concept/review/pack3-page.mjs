// Page "Пак 80/20": the posts made after the owner's 24 Nov audit (37-46), to watch and edit.
//   node social/concept/review/pack3-page.mjs  ->  social/concept/out/review/pack3/index.html + m/ media + files.json
// Edits the owner makes on the page are kept in the artifact db, collection "edits", doc = post number:
// { ig, fb, tt, yt, note, status: 'ok' | 'redo' | '', at }. The Instagram desk reads them with ArtifactData.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { W3 } from './week3-texts.mjs';
import { FB3 } from './week3-facebook.mjs';
import { WEEK3_YT } from '../youtube/week3.mjs';
const concept = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(concept, 'out', 'review', 'pack3');
rmSync(out, { recursive: true, force: true }); mkdirSync(join(out, 'm'), { recursive: true });
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const body = (md) => md.replace(/^---[\s\S]*?---\n/, '').trim();
const files = [];
const posts = W3.map((p) => {
  const id = `${p.n}-${p.slug}`, dir = join(concept, 'posts', id);
  const r = { n: p.n, grid: p.grid, kw: p.kw, format: p.format, hook: p.tile.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), voice: p.voice || [], note: p.note,
    ig: body(readFileSync(join(dir, 'caption.md'), 'utf8')), fb: FB3[p.n]?.caption || '', fbComment: FB3[p.n]?.comment || '',
    tt: existsSync(join(dir, 'tiktok.md')) ? body(readFileSync(join(dir, 'tiktok.md'), 'utf8')) : '',
    yt: WEEK3_YT[p.n] ? `${WEEK3_YT[p.n].title}\n\n${WEEK3_YT[p.n].body}` : '' };
  if (p.format === 'Reel') {
    r.video = `m/${p.n}.mp4`; r.poster = `m/${p.n}.jpg`;
    ff('-i', join(dir, 'reel.mp4'), '-vf', 'scale=540:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', join(out, r.video));
    ff('-i', join(dir, 'cover.jpg'), '-vf', 'scale=540:-2', '-q:v', '4', join(out, r.poster));
    files.push(r.video, r.poster);
  } else {
    r.slides = readdirSync(dir).filter((f) => /^slide-\d+\.jpg$/.test(f)).sort().map((f, i) => {
      const s = `m/${p.n}-${i + 1}.jpg`; ff('-i', join(dir, f), '-vf', 'scale=540:-2', '-q:v', '4', join(out, s)); files.push(s); return s; });
  }
  return r;
});
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = JSON.stringify(posts).replace(/</g, '\\u003c');
const html = `<title>Пак 80/20</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;800&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: a review desk, one row per post: the video or carousel at phone size on the left, the texts to edit on the right */
:root{--bg:#f4f3ef;--panel:#ffffff;--fg:#141a33;--mute:#5d6280;--line:#e1ded4;--accent:#ffc533;--accent-fg:#141a33;--ok:#1d8a5b;--ok-soft:#dff3e9;--redo:#c2410c;--redo-soft:#fde8dc;--display:"Sora",system-ui,sans-serif;--text:"Inter",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#10131f;--panel:#1a1f33;--fg:#eef0f8;--mute:#a3a8c3;--line:#2c3350;--accent:#ffc533;--accent-fg:#141a33;--ok:#5fd39c;--ok-soft:#173a2b;--redo:#ff9a6b;--redo-soft:#3d2317;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#10131f;--panel:#1a1f33;--fg:#eef0f8;--mute:#a3a8c3;--line:#2c3350;--accent:#ffc533;--accent-fg:#141a33;--ok:#5fd39c;--ok-soft:#173a2b;--redo:#ff9a6b;--redo-soft:#3d2317;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--text);line-height:1.45;padding-block:20px 60px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2{font-family:var(--display);margin:0;letter-spacing:-.02em;text-wrap:balance}
h1{font-size:1.7rem}h2{font-size:1.15rem}
.head{max-width:72rem;margin:0 auto 18px;display:grid;gap:8px}
.head p{margin:0;color:var(--mute);max-width:68ch}
.sum{display:flex;flex-wrap:wrap;gap:8px;font-size:.85rem}
.sum span{padding:3px 10px;border-radius:999px;background:var(--panel);border:1px solid var(--line);font-variant-numeric:tabular-nums}
.list{max-width:72rem;margin:0 auto;display:grid;gap:18px}
.post{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px;display:grid;grid-template-columns:270px minmax(0,1fr);gap:18px}
.post.st-ok{border-color:var(--ok)}.post.st-redo{border-color:var(--redo)}
@media (max-width:720px){.post{grid-template-columns:minmax(0,1fr)}.media{max-width:300px}}
.media{display:grid;gap:8px;align-content:start}
.media video,.media img{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:8px;background:#000;display:block}
.media img.slide{aspect-ratio:4/5}
.car{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory}
.car img{flex:0 0 100%;scroll-snap-align:start}
.car-hint{font-size:.75rem;color:var(--mute)}
.info{min-width:0;display:grid;gap:10px;align-content:start}
.top{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px}
.tag{font-size:.75rem;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--accent);color:var(--accent-fg)}
.kw{font-size:.8rem;color:var(--mute)}
.tabs{display:flex;flex-wrap:wrap;gap:4px}
.tabs button{font:500 .8rem var(--text);border:1px solid var(--line);background:transparent;color:var(--fg);padding:5px 10px;border-radius:6px;cursor:pointer}
.tabs button[aria-selected="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.tabs button.edited::after{content:" •";color:var(--accent)}
textarea{width:100%;box-sizing:border-box;min-height:12rem;font:400 .9rem/1.5 var(--text);color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:10px;resize:vertical}
textarea.note{min-height:4.5rem}
textarea:focus,button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.fbc{font-size:.8rem;color:var(--mute);margin:0}
details summary{cursor:pointer;font-size:.85rem;color:var(--mute)}
details ol{margin:6px 0 0;padding-left:1.2rem;font-size:.85rem}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.btn{font:600 .85rem var(--text);border-radius:6px;padding:7px 14px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--fg)}
.btn.save{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
.btn.ok[aria-pressed="true"]{background:var(--ok-soft);color:var(--ok);border-color:var(--ok)}
.btn.redo[aria-pressed="true"]{background:var(--redo-soft);color:var(--redo);border-color:var(--redo)}
.msg{font-size:.8rem;color:var(--mute)}
.ro{font-size:.85rem;color:var(--mute);background:var(--bg);border-radius:6px;padding:8px 10px}
</style>
<div class="head">
  <h1>Пак 80/20</h1>
  <p>Посты №37–46, сделанные после аудита 24 ноября: хук про страх или желание родителя, курс только в конце. Смотрите ролик или листайте карусель. Тексты можно править прямо здесь, по каждой площадке, и нажать «Сохранить». Кнопки «Ок» и «Переделать» и поле для замечаний видит отдел Instagram.</p>
  <div class="sum" id="sum"></div>
  <p class="ro" id="ro" hidden>Правки сейчас не сохраняются: страница открыта без доступа к записи. Тексты можно читать и копировать.</p>
</div>
<div class="list" id="list"></div>
<script>
const POSTS = ${json};
const NET = [['ig','Instagram'],['fb','Facebook'],['tt','TikTok'],['yt','YouTube']];
const saved = {}; let db = null, canWrite = false;
const $ = (s, el = document) => el.querySelector(s);
function el(tag, attrs = {}, text) { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; }
function cur(p, k) { return saved[p.n] && typeof saved[p.n][k] === 'string' ? saved[p.n][k] : p[k]; }
function render() {
  const list = $('#list'); list.textContent = '';
  for (const p of POSTS) {
    const s = saved[p.n] || {};
    const card = el('article', { class: 'post st-' + (s.status || 'none'), id: 'p' + p.n });
    const media = el('div', { class: 'media' });
    if (p.video) { const v = el('video', { src: p.video, poster: p.poster, controls: '', playsinline: '', preload: 'none' }); media.append(v); }
    else { const c = el('div', { class: 'car' }); p.slides.forEach((src, i) => c.append(el('img', { src, class: 'slide', alt: 'слайд ' + (i + 1), loading: 'lazy' }))); media.append(c, el('span', { class: 'car-hint' }, p.slides.length + ' слайдов, листайте вбок')); }
    const info = el('div', { class: 'info' });
    const top = el('div', { class: 'top' }); top.append(el('h2', { lang: 'en' }, '№' + p.n + ' · ' + p.hook), el('span', { class: 'tag' }, p.format === 'Reel' ? 'ролик' : 'карусель'), el('span', { class: 'kw' }, 'слово: “' + p.kw + '”'));
    const tabs = el('div', { class: 'tabs', role: 'tablist' });
    const ta = el('textarea', { id: 'ta' + p.n, lang: 'en', 'aria-label': 'текст подписи' });
    const fbc = el('p', { class: 'fbc' });
    let net = 'ig';
    const show = (k) => { net = k; ta.value = cur(p, k); for (const b of tabs.children) b.setAttribute('aria-selected', String(b.dataset.k === k)); fbc.textContent = k === 'fb' && p.fbComment ? 'Первый комментарий: ' + p.fbComment : ''; };
    for (const [k, name] of NET) { const b = el('button', { role: 'tab', type: 'button' }, name); b.dataset.k = k; if (typeof s[k] === 'string') b.classList.add('edited'); b.onclick = () => show(k); tabs.append(b); }
    const note = el('textarea', { class: 'note', id: 'note' + p.n, placeholder: 'Замечания по посту (картинка, голос, текст)', 'aria-label': 'замечания' }); note.value = s.note || '';
    const msg = el('span', { class: 'msg' });
    const save = el('button', { class: 'btn save', type: 'button' }, 'Сохранить');
    const ok = el('button', { class: 'btn ok', type: 'button', 'aria-pressed': String(s.status === 'ok') }, 'Ок');
    const redo = el('button', { class: 'btn redo', type: 'button', 'aria-pressed': String(s.status === 'redo') }, 'Переделать');
    const write = async (patch, done) => {
      if (!db || !canWrite) { msg.textContent = 'Не сохранено: нет доступа к записи.'; return; }
      msg.textContent = 'Сохраняю…';
      try { await db.doc('edits/' + p.n).set({ ...(saved[p.n] || {}), ...patch, at: new Date().toISOString() }); msg.textContent = done; }
      catch (e) { msg.textContent = 'Не сохранилось (' + (e && e.code || 'ошибка') + '). Попробуйте ещё раз.'; }
    };
    save.onclick = () => { const patch = { note: note.value }; if (ta.value !== p[net]) patch[net] = ta.value; write(patch, 'Сохранено'); };
    ok.onclick = () => write({ status: s.status === 'ok' ? '' : 'ok', note: note.value }, 'Отмечено');
    redo.onclick = () => write({ status: s.status === 'redo' ? '' : 'redo', note: note.value }, 'Отмечено');
    const row = el('div', { class: 'row' }); row.append(save, ok, redo, msg);
    info.append(top, tabs, ta, fbc);
    if (p.voice.length) { const d = el('details'); d.append(el('summary', {}, 'Озвучка (голос Ани)')); const ol = el('ol', { lang: 'en' }); p.voice.forEach((l) => ol.append(el('li', {}, l))); d.append(ol); info.append(d); }
    info.append(note, row);
    card.append(media, info); list.append(card); show('ig');
  }
  const st = Object.values(saved);
  $('#sum').textContent = '';
  [['постов', POSTS.length], ['ок', st.filter((x) => x.status === 'ok').length], ['переделать', st.filter((x) => x.status === 'redo').length], ['с правками', st.filter((x) => NET.some(([k]) => typeof x[k] === 'string') || x.note).length]]
    .forEach(([t, n]) => $('#sum').append(el('span', {}, n + ' ' + t)));
}
render();
(async () => {
  try {
    db = await window.claude?.use?.('db');
    const user = await window.claude?.use?.('user');
    canWrite = !!db && ((await user?.can?.('data.write')) ?? true);
    if (!db || !canWrite) { $('#ro').hidden = false; return; }
    let first = true;
    db.collection('edits').onSnapshot((snap) => {
      for (const d of snap.docs) saved[d.id] = d.data() || {};
      const active = document.activeElement && document.activeElement.tagName === 'TEXTAREA';
      if (first || !active) render(); first = false;
    }, () => { $('#ro').hidden = false; });
  } catch (e) { $('#ro').hidden = false; }
})();
</script>`;
writeFileSync(join(out, 'index.html'), html);
writeFileSync(join(out, 'files.json'), JSON.stringify(Object.fromEntries(files.map((f) => [f, join(out, f)]))));
console.log('wrote', join(out, 'index.html'), files.length, 'media');
