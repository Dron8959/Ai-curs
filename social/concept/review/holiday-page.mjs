// The holiday review page: the certificate, posts 47-50 (reel players, carousel slides, captions, voice lines), DM text.
//   node social/concept/review/holiday-page.mjs  ->  social/concept/out/holiday/page/index.html + media + files.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { H } from './holiday-texts.mjs';
const concept = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(concept, 'out', 'holiday', 'page'); mkdirSync(join(out, 'm'), { recursive: true });
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const body = (md) => md.replace(/^---[\s\S]*?---\n/, '').trim();
const files = ['cert.jpg', 'gift-certificate.pdf'];
copyFileSync(join(concept, 'out', 'holiday', 'gift-certificate.pdf'), join(out, 'gift-certificate.pdf'));
ff('-i', join(concept, 'out', 'holiday', 'gift-certificate.png'), '-vf', 'scale=1200:-2', '-q:v', '3', join(out, 'cert.jpg'));

const cards = H.map((p) => {
  const id = `${p.n}-${p.slug}`, dir = join(concept, 'posts', id);
  let media;
  if (p.format === 'Reel') {
    const v = `m/${p.n}.mp4`, c = `m/${p.n}.jpg`;
    ff('-i', join(dir, 'reel.mp4'), '-vf', 'scale=540:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', join(out, v));
    ff('-i', join(dir, 'cover.jpg'), '-vf', 'scale=540:-2', '-q:v', '4', join(out, c)); files.push(v, c);
    media = `<video src="${v}" poster="${c}" controls playsinline preload="none"></video>`;
  } else {
    const sl = readdirSync(dir).filter((f) => /^slide-\d+\.jpg$/.test(f)).sort().map((f, i) => {
      const s = `m/${p.n}-${i + 1}.jpg`; ff('-i', join(dir, f), '-vf', 'scale=540:-2', '-q:v', '4', join(out, s)); files.push(s); return s; });
    media = `<div class="car">${sl.map((s, i) => `<img src="${s}" alt="слайд ${i + 1}" loading="lazy">`).join('')}</div><span class="mute small">${sl.length} слайдов, листайте вбок</span>`;
  }
  const cap = body(readFileSync(join(dir, 'caption.md'), 'utf8'));
  return `<article class="post"><div class="media">${media}</div><div class="info">
    <h3>№${p.n} · ${esc(p.date)} · ${p.format === 'Reel' ? 'ролик' : 'карусель'}</h3>
    <p lang="en"><b>${esc(p.tile.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())}</b></p>
    <pre lang="en">${esc(cap)}</pre>
    ${p.voice ? `<details><summary>Озвучка (голос Ани)</summary><ol lang="en">${p.voice.map((l) => `<li>${esc(l)}</li>`).join('')}</ol></details>` : ''}
  </div></article>`;
}).join('\n');

const html = `<title>Праздничные продажи</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;800&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: one column review sheet: the certificate, then each post with its video or slides beside its texts */
:root{--bg:#f4f3ef;--panel:#fff;--fg:#141a33;--mute:#5d6280;--line:#e1ded4;--accent:#ffc533;--need:#c2410c;--need-soft:#fde8dc;--display:"Sora",system-ui,sans-serif;--text:"Inter",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#10131f;--panel:#1a1f33;--fg:#eef0f8;--mute:#a3a8c3;--line:#2c3350;--accent:#ffc533;--need:#ff9a6b;--need-soft:#3d2317;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#10131f;--panel:#1a1f33;--fg:#eef0f8;--mute:#a3a8c3;--line:#2c3350;--accent:#ffc533;--need:#ff9a6b;--need-soft:#3d2317;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--text);line-height:1.5;padding-block:20px 60px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
main{max-width:64rem;margin:0 auto;display:grid;gap:26px}
h1,h2,h3{font-family:var(--display);margin:0;letter-spacing:-.02em;text-wrap:balance}
h1{font-size:1.7rem}h2{font-size:1.2rem}h3{font-size:1rem}
p{margin:0;max-width:68ch}
.mute{color:var(--mute)}.small{font-size:.8rem}
.note{background:var(--need-soft);border:1px solid var(--need);border-radius:8px;padding:10px 14px}
.note b{color:var(--need)}
figure{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;display:grid;gap:8px;min-width:0}
figure img{width:100%;border-radius:6px;display:block}
figcaption{font-size:.85rem;color:var(--mute)}
figcaption a{color:var(--fg)}
.post{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px;display:grid;grid-template-columns:270px minmax(0,1fr);gap:16px}
@media (max-width:720px){.post{grid-template-columns:minmax(0,1fr)}.media{max-width:300px}}
.media{display:grid;gap:6px;align-content:start;min-width:0}
.media video{width:100%;aspect-ratio:9/16;border-radius:8px;background:#000;display:block}
.car{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory}
.car img{flex:0 0 100%;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px;scroll-snap-align:start}
.info{display:grid;gap:8px;align-content:start;min-width:0}
pre{white-space:pre-wrap;font:400 .88rem/1.5 var(--text);background:var(--bg);border-radius:6px;padding:10px;margin:0}
details summary{cursor:pointer;font-size:.85rem;color:var(--mute)}
details ol{margin:6px 0 0;padding-left:1.2rem;font-size:.85rem}
</style>
<main>
  <header style="display:grid;gap:8px">
    <h1>Праздничные продажи</h1>
    <p class="mute">«Подари навык»: сертификат и четыре продающих поста №47–50. Каждый пост уходит на Instagram, Facebook, TikTok и YouTube Shorts.</p>
    <p class="note"><b>Скидки в постах нет:</b> вы её ещё не назвали. Как назовёте размер, тариф, код и срок, добавлю строку в №47 и №49. Winter Break Challenge на паузе, чек-лист убран.</p>
  </header>
  <section style="display:grid;gap:12px">
    <h2>Сертификат</h2>
    <figure style="max-width:44rem"><img src="cert.jpg" alt="Сертификат «This gift is a skill»: поля для имени и от кого, подарок с иконками игры, музыки, мультфильма и микрофона, шесть проектов, выбор тарифа"><figcaption>Без персонажа, подходит и мальчику, и девочке. Серёжа отправляет его в личку после покупки. <a href="gift-certificate.pdf">PDF</a></figcaption></figure>
  </section>
  <section style="display:grid;gap:12px">
    <h2>Посты</h2>
    ${cards}
  </section>
  <section style="display:grid;gap:8px">
    <h2>Ответ в личку на «GIFT»</h2>
    <pre lang="en">Hi! Here's how the gift works:

1. Pick the plan at makeshowlab.com: Creator $197, or Creator + Homework $297 (Anna checks homework the same day).
2. Send us your kid's first name here.
3. We send you a certificate with their name to print and put under the tree.

The login comes to your email right away. Questions? Just reply here.</pre>
  </section>
</main>`;
writeFileSync(join(out, 'index.html'), html);
writeFileSync(join(out, 'files.json'), JSON.stringify(Object.fromEntries(files.map((f) => [f, f]))));
console.log('wrote', out, files.length, 'media');
