// Builds the 80/20 grid page for the owner: node build.mjs <concept dir> -> grid.html next to this script
import { execFileSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const concept = process.argv[2];
const here = dirname(fileURLToPath(import.meta.url));
const thumb = (n) => {
  const f = join(concept, 'out', 'week2', `${n}.jpg`);
  if (!existsSync(f)) return '';
  const b = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-vf', 'scale=180:-2', '-q:v', '6', '-f', 'mjpeg', '-']);
  return 'data:image/jpeg;base64,' + b.toString('base64');
};
// kind: v = про зрителя, c = про курс. st: keep | move | new | out (already published / fixed)
const R = (n, kind, fmt, hook, st, note, flag) => ({ n, kind, fmt, hook, st, note, flag });
const WEEKS = [
  { title: 'Неделя 1 · 24–30 ноября', sub: 'Уже стоит в Metricool. Меняем то, что после вашего «ок»', days: [
    ['Вт 24', [
      R(23, 'c', 'Reel', 'A cartoon for grandma this Thanksgiving', 'out', 'Выходит в 08:00. Не трогаем: волна Дня благодарения.'),
      R(14, 'v', 'Reel', 'Your kid asks for ChatGPT. Say yes, with one rule.', 'move', 'Готов. Встаёт на место №33 (Париж), переносим с 25.11.'),
      R(15, 'v', 'Reel', 'How does AI draw from words?', 'move', 'Готов. Встаёт на место №32 (кот с круассаном), переносим с 25.11.'),
    ]],
    ['Ср 25', [
      R(13, 'c', 'Reel', 'She didn’t draw a single frame', 'keep', 'Один мультик-демо из трёх, самый сильный хук.'),
      R('A1', 'v', 'Reel', 'Don’t let AI do the homework. Make it quiz your kid.', 'new', 'Промпт «спрашивай меня, не отвечай за меня». Родитель повторит сегодня.', 'Если хук от первого лица («я попросила ИИ…»), это должна быть настоящая история Ани.'),
      R('D12', 'v', 'Reel', 'Why AI sometimes makes things up, explained for a 7-year-old', 'new', 'Галлюцинации простыми словами + правило «слишком гладко, значит проверь».'),
    ]],
    ['Чт 26 · День благодарения', [
      R(16, 'c', 'Reel', 'Tonight: a game your kid made', 'keep', 'Праздник, вечер дома. Прямой промо бесплатного урока.'),
      R(17, 'c', 'Carousel', 'What 4 grandmothers made with their grandkids', 'keep', 'Доказательство + сезон подарков. Входит в 20%.'),
      R(20, 'v', 'Carousel', '“Mom, is this real?”', 'move', 'Готов. Встаёт вместо №35 (ещё одно демо мультика), переносим с 27.11.'),
    ]],
    ['Пт 27 · Чёрная пятница', [
      R(22, 'v', 'Reel', 'Is AI alive? It talks like a friend.', 'move', 'Готов. Переносим с 28.11.'),
      R(24, 'v', 'Carousel', 'Your kid told a chatbot their school.', 'move', 'Готов. Переносим с 28.11.'),
      R('F18', 'v', 'Reel', 'Gifts that aren’t toys: for the kid who has everything', 'new', 'Чёрная пятница. Подарок, который ребёнок делает сам.'),
    ]],
    ['Сб 28', [
      R('E15', 'v', 'Reel', 'Rainy Saturday, bored kid, one laptop: a 20-minute plan', 'new', 'Суббота. План на 20 минут, можно сделать сегодня.'),
      R(29, 'v', 'Reel', 'How does a crayon drawing become a cartoon?', 'move', 'Готов, объяснялка. Переносим с 30.11.'),
      R('A3', 'v', 'Carousel', '3 questions to ask before your kid opens ChatGPT', 'new', 'Карусель, которую сохраняют.'),
    ]],
    ['Вс 29', [
      R(28, 'v', 'Reel', 'Person or AI? Your kid should always know.', 'move', 'Готов. Переносим с 29.11 (было 19:30). Первая строка без «in our course».'),
      R('C8', 'v', 'Carousel', '5 family AI rules for the fridge', 'new', 'Памятка с холодильника каруселью: сохраняемый формат. Правила уже есть (RULES).'),
      R('B6', 'v', 'Reel', 'Watching or making? Tell in 10 seconds.', 'new', 'Пассивный и активный экран.'),
    ]],
    ['Пн 30', [
      R('A2', 'v', 'Reel', 'Cheating with AI or building with it: one habit', 'new', 'Идея от ребёнка, ИИ делает, ребёнок правит.'),
      R(30, 'c', 'Carousel', 'What the course costs, and what you get', 'keep', 'Всё о цене. Входит в 20%.'),
      R(31, 'c', 'Reel', 'Worst case: 20 minutes on the couch', 'keep', 'Бесплатный урок. Входит в 20%.'),
    ]],
  ]},
  { title: 'Неделя 2 · 1–7 декабря', sub: 'Новая неделя. Ничего ещё не стоит', days: [
    ['Вт 1', [
      R('A4', 'v', 'Reel', 'AI can write the homework. It can’t explain it for your kid.', 'new', 'Тема №4. Хук переписан, см. «Проверка фактов».', 'Фразу «учителя за секунды видят ИИ» нечем подтвердить. Поэтому хук другой.'),
      R('D13', 'v', 'Reel', 'Ask AI the same question 3 ways', 'new', 'Игра на вечер: версии для 6-летки, 12-летки и бабушки.'),
      R(21, 'c', 'Reel', 'Her own character, as stickers', 'move', 'Готов, переносим с 27.11. Подарок к праздникам.'),
    ]],
    ['Ср 2', [
      R('B5', 'v', 'Reel', 'One hour of Shorts, or one hour of making', 'new', 'Счётная визуализация.', 'Цифру «20 часов Shorts в месяц» без источника не ставим. Есть источник? Пришлите.'),
      R('X1', 'v', 'Reel', 'A family code word against AI voice scams', 'new', 'Моё предложение. Общий совет по безопасности, страх родителей.'),
      R('E16', 'v', 'Reel', '“I’m bored” to “look what I made”: the 20-minute swap', 'new', 'Из Threads «I’m bored».'),
    ]],
    ['Чт 3', [
      R('C9', 'v', 'Carousel', '3 things to check before your kid touches any AI app', 'new', 'Сохраняемая карусель.'),
      R(19, 'v', 'Reel', 'Can a 6-year-old use AI if they can’t read yet?', 'move', 'Готов, переносим с 27.11. Новая первая строка: ребёнок говорит, вы печатаете.'),
      R('X2', 'v', 'Reel', 'Bedtime story: your kid picks what happens next', 'new', 'Моё предложение. Занятие на вечер.'),
    ]],
    ['Пт 4', [
      R('F19', 'v', 'Reel', 'A gift grandma keeps: made by the kid, not bought', 'new', 'Сезон подарков.'),
      R('C10', 'v', 'Reel', 'Teach your kid to spot a fake in 2 minutes', 'new', 'Ребёнок учит бабушку. В курсе есть урок про фейки.'),
      R('G23', 'c', 'Reel', 'Who’s behind this: a mom and her 10-year-old', 'new', 'Аня сделала каждый урок и проверила на Камилле.', '«Делает ИИ-рекламу брендам с 2023-го» в фактах нет. Нужно подтверждение и откуда это видно.'),
    ]],
    ['Сб 5', [
      R('E17', 'v', 'Carousel', '5 things a kid can make with AI before dinner', 'new', 'Листикл каруселью (сохраняют). Из текста Threads.'),
      R('X3', 'v', 'Reel', '“Free skins” in a game chat: the one check', 'new', 'Моё предложение. В курсе есть урок про подозрительные ссылки.'),
      R('X4', 'v', 'Reel', 'A thank-you card from your kid’s own drawing', 'new', 'Моё предложение. Праздники.'),
    ]],
    ['Вс 6', [
      R('B7', 'v', 'Reel', 'We didn’t cut screen time. We changed what it’s for.', 'new', 'История Ани в кадре или голосом.', 'Нужна настоящая история Ани: что было дома, своими словами.'),
      R('D14', 'v', 'Reel', 'School may not teach this yet. Your kitchen table can tonight.', 'new', 'Тема №14. Хук смягчён, см. «Проверка фактов».', '«Школы будут учить через 5 лет» это прогноз, не факт. Поэтому хук другой.'),
      R(27, 'c', 'Reel', 'A song from her own words', 'move', 'Готов, переносим с 29.11. Подарок бабушке.'),
    ]],
    ['Пн 7', [
      R('X5', 'v', 'Reel', '“Show me what you made” beats “how long were you on it”', 'new', 'Моё предложение. Главная мысль бренда.'),
      R('X6', 'v', 'Reel', 'Your kid says AI is smarter than you. What to say.', 'new', 'Моё предложение.'),
      R(26, 'c', 'Reel', 'Do I need to know AI first?', 'move', 'Готов, переносим с 29.11. Частый вопрос о курсе.'),
    ]],
  ]},
];
const OUT = [
  [33, 'Paris, drawn by AI. Directed by a kid.', 'в запас (третье демо мультика за 48 часов)'],
  [32, 'A cat with a croissant? Her idea.', 'в запас'],
  [35, '2-3 tries a scene. About 20 minutes.', 'в запас'],
  [34, 'Every character? Made up by a kid.', 'в запас'],
  [36, 'Серия по мультфильму', 'остаётся в запасе'],
];
const LINES = [
  [13, 'Comment "CARTOON" and I’ll send you the free first lesson.', 'Kamilla is 10. She made this cartoon without drawing a single frame.'],
  [14, 'Comment "RULES" and I’ll send you the fridge card.', 'Your kid asks for ChatGPT because everyone at school has it.'],
  [15, 'Comment "CARTOON" and I’ll send you the free first lesson.', 'AI doesn’t draw on a blank page. It starts with static, like an old TV.'],
  [16, 'Comment "GAME" and I’ll send you the link to the free first lesson.', 'Tonight your kid can build a game, then beat you at it on the couch.'],
  [17, 'Comment "GIFT" and I’ll send you the free first lesson.', 'Four grandmothers sat down with their grandkids and made something together.'],
  [19, 'Comment "GAME" and I’ll send you the free first lesson.', 'A 6-year-old doesn’t need to read or type to make something with AI.'],
  [20, 'Comment "RULES" and I’ll send you the fridge card.', 'Your kid holds up the phone and asks if the picture is real.'],
  [22, 'Comment "LESSON" and I’ll send you the free first lesson.', 'AI talks like a friend. Here’s why, in words your kid will get.'],
  [24, 'Comment "RULES" and I’ll send you the fridge card.', 'Your kid tells a chatbot the name of their school, like telling a friend.'],
  [28, 'Comment "RULES" and I’ll send you the fridge card.', 'Your kid should always know if they’re talking to a person or an AI.'],
  [29, 'Comment "CARTOON" and I’ll send you the free first lesson.', 'When AI turns a kid’s drawing into a cartoon, it doesn’t start over.'],
];
const ST = { keep: 'остаётся', move: 'готов, переносим', new: 'новый, делаем', out: 'выходит, не трогаем' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let nv = 0, nc = 0, nnew = 0;
const card = (p) => {
  p.kind === 'v' ? nv++ : nc++; if (p.st === 'new') nnew++;
  const img = typeof p.n === 'number' ? thumb(p.n) : '';
  return `<article class="card k-${p.kind} s-${p.st}">
  <div class="pic">${img ? `<img src="${img}" alt="">` : `<span>${p.fmt === 'Carousel' ? 'карусель' : 'ролик'}<br>в работе</span>`}</div>
  <div class="body">
    <div class="meta"><b>${typeof p.n === 'number' ? '№' + p.n : 'тема ' + esc(p.n)}</b><span class="tag">${p.kind === 'v' ? 'про зрителя' : 'про курс'}</span></div>
    <p class="hook" lang="en">${esc(p.hook)}</p>
    <p class="st">${ST[p.st]} · ${p.fmt === 'Carousel' ? 'карусель' : 'ролик'}</p>
    <p class="note">${esc(p.note)}</p>
    ${p.flag ? `<p class="flag">Факт: ${esc(p.flag)}</p>` : ''}
  </div></article>`;
};
const TIMES = ['08:00', '12:30', '19:30'];
const weeks = WEEKS.map((w) => {
  const v0 = nv, c0 = nc;
  const days = w.days.map(([d, posts]) => `<section class="day"><h3>${d}</h3>${posts.map((p, i) => `<div class="slot"><time>${TIMES[i]}</time>${card(p)}</div>`).join('')}</section>`).join('');
  const v = nv - v0, c = nc - c0;
  return `<section class="week"><header class="wh"><h2>${w.title}</h2><p>${w.sub}</p><p class="ratio"><span class="pv">${v} про зрителя</span> <span class="pc">${c} про курс</span> <span class="pct">${Math.round(v / (v + c) * 100)}/${Math.round(c / (v + c) * 100)}</span></p></header><div class="grid">${days}</div></section>`;
}).join('');
const html = `<title>Сетка Instagram 80/20</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: a planner board, days as columns, three time slots per day; viewer posts teal, course posts amber */
:root{--bg:#f3f5f6;--panel:#ffffff;--fg:#17212b;--mute:#5b6874;--line:#dbe1e5;--v:#0f8a7e;--v-soft:#e1f3f0;--c:#b86e00;--c-soft:#fbefdc;--warn:#b3261e;--warn-soft:#fbe4e2;--display:"Space Grotesk",system-ui,sans-serif;--text:"Inter",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11171c;--panel:#1a232a;--fg:#e6ecef;--mute:#98a6b1;--line:#2c3841;--v:#43c2b4;--v-soft:#173a37;--c:#f0a640;--c-soft:#3d2d14;--warn:#ff8a80;--warn-soft:#3f1d1b;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11171c;--panel:#1a232a;--fg:#e6ecef;--mute:#98a6b1;--line:#2c3841;--v:#43c2b4;--v-soft:#173a37;--c:#f0a640;--c-soft:#3d2d14;--warn:#ff8a80;--warn-soft:#3f1d1b;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--text);line-height:1.45;padding-block:20px 48px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);margin:0;text-wrap:balance}
h1{font-size:1.7rem}h2{font-size:1.25rem}h3{font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);padding-bottom:6px;border-bottom:1px solid var(--line)}
.top{display:grid;gap:10px;max-width:70rem;margin-bottom:22px}
.top p{margin:0;max-width:65ch;color:var(--mute)}
.alert{background:var(--warn-soft);border:1px solid var(--warn);border-radius:8px;padding:12px 14px;color:var(--fg);max-width:65ch}
.alert b{color:var(--warn)}
.legend{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:.85rem;color:var(--mute)}
.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px}
.week{margin-top:26px}
.wh{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 16px;margin-bottom:12px}
.wh p{margin:0;color:var(--mute);font-size:.9rem}
.ratio{font-variant-numeric:tabular-nums}
.ratio span{padding:2px 8px;border-radius:999px;font-weight:600;font-size:.8rem}
.pv{background:var(--v-soft);color:var(--v)}.pc{background:var(--c-soft);color:var(--c)}.pct{color:var(--fg)}
.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px}
@media (max-width:1100px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.grid{grid-template-columns:minmax(0,1fr)}}
.day{display:grid;gap:8px;align-content:start;min-width:0}
.slot time{display:block;font-size:.75rem;color:var(--mute);font-variant-numeric:tabular-nums;margin-bottom:3px}
.card{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--v);border-radius:6px;overflow:hidden;display:grid;grid-template-columns:64px minmax(0,1fr)}
.card.k-c{border-left-color:var(--c)}
.pic{background:var(--line);display:grid;place-items:center;min-height:86px}
.pic img{width:64px;height:100%;object-fit:cover;display:block}
.pic span{font-size:.62rem;text-align:center;color:var(--mute);line-height:1.2}
.body{padding:7px 9px;min-width:0}
.meta{display:flex;justify-content:space-between;gap:6px;font-size:.75rem}
.tag{color:var(--v);font-weight:600}.k-c .tag{color:var(--c)}
.hook{margin:3px 0;font-weight:600;font-size:.84rem;line-height:1.3}
.st{margin:0;font-size:.72rem;color:var(--mute)}
.s-new .st{color:var(--fg);font-weight:600}
.note{margin:3px 0 0;font-size:.74rem;color:var(--mute)}
.flag{margin:5px 0 0;font-size:.72rem;background:var(--warn-soft);color:var(--fg);padding:4px 6px;border-radius:4px}
.s-out{opacity:.7}
.sec{margin-top:34px;max-width:70rem}
.sec h2{margin-bottom:10px}
.sec>p{color:var(--mute);max-width:65ch;margin:0 0 10px}
.tbl{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:.85rem}
th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:.75rem;color:var(--mute);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
td.old{color:var(--mute);text-decoration:line-through}
ol,ul{margin:0;padding-left:1.2rem;max-width:70ch}li{margin:4px 0}
</style>
<div class="top">
  <h1>Сетка Instagram 80/20</h1>
  <p>Сетка постов Instagram на две недели, 24 ноября – 7 декабря, по вашему аудиту: каждый хук про страх или желание родителя, курс только в последней строке. Всё это на 4 площадки сразу. Pinterest и Threads ведут их отделы, здесь их нет.</p>
  <div class="alert"><b>Срочно:</b> №33 «Париж» уходит сегодня в 12:30 по Нью-Йорку, №32 «кот» в 19:30. Чтобы заменить их на №14 и №15, нужно ваше «ок» до 12:30.</div>
  <div class="legend"><span><i style="background:var(--v)"></i>про зрителя</span><span><i style="background:var(--c)"></i>про курс</span><span>«новый, делаем» = картинка, текст и озвучка ещё впереди</span></div>
</div>
${weeks}
<section class="sec"><h2>Убираем из недели 1</h2><p>Не удаляем, а переводим в черновики на всех 4 площадках и оставляем в запасе.</p>
<div class="tbl"><table><tr><th>№</th><th>Хук</th><th>Куда</th></tr>${OUT.map(([n, h, w]) => `<tr><td>№${n}</td><td lang="en">${esc(h)}</td><td>${w}</td></tr>`).join('')}</table></div></section>
<section class="sec"><h2>Первые строки подписей</h2><p>Сейчас каждая подпись начинается со строки «Comment … and I’ll send you…», то есть с курса. Предлагаю начинать с хука про зрителя. Строка со словом для комментария уходит в конец, перед хештегами. Ролики не переозвучиваем, меняется только текст подписи.</p>
<div class="tbl"><table><tr><th>№</th><th>Сейчас первая строка</th><th>Будет первая строка</th></tr>${LINES.map(([n, o, x]) => `<tr><td>№${n}</td><td class="old" lang="en">${esc(o)}</td><td lang="en">${esc(x)}</td></tr>`).join('')}</table></div></section>
<section class="sec"><h2>Проверка фактов</h2><ul>
<li>Тема №23: «Аня делает ИИ-рекламу брендам с 2023-го» в нашем файле фактов нет. Нужно ваше подтверждение и где это видно (сайт, портфолио). Без него пост про то, что знаем: мама и дочь, Аня сделала каждый урок и проверила на Камилле.</li>
<li>Тема №5: цифру «~20 часов Shorts в месяц» без источника не ставим. Есть исследование? Пришлите ссылку. Без неё хук без цифры.</li>
<li>Тема №4: «учителя за секунды видят ИИ-домашку» нечем подтвердить. Хук: «AI can write the homework. It can’t explain it for your kid.»</li>
<li>Тема №14: «школы будут учить через 5 лет» это прогноз. Хук: «School may not teach this yet.»</li>
<li>Темы №1 и №7 от первого лица («я попросила ИИ…», «мы не урезали экранное время…») ставим только с настоящей историей Ани. Иначе №1 идёт советом, а №7 ждёт её рассказа.</li>
</ul></section>
<section class="sec"><h2>Вопрос по темпу</h2><p>В аудите сказано «5–6 роликов про зрителя + 1–2 про курс» в неделю, это около 1 поста в день. Сейчас стоит 3 в день, 21 в неделю. Сетка выше собрана на 3 в день. Если хотите 1 в день, оставлю лучшие 7 в неделю, а остальные пойдут на следующие недели.</p></section>
<section class="sec"><h2>Что сделаю после «ок»</h2><ol>
<li>Сегодня до 12:30: в Metricool поменяю местами №33 и №32 с №14 и №15 на всех 4 площадках.</li>
<li>Переставлю готовые посты по датам сетки. Убранные переведу в черновики.</li>
<li>Перепишу первые строки подписей Instagram у остающихся постов. Отделам Facebook, TikTok и YouTube передам то же правило.</li>
<li>Новые темы пройдут те же этапы, что и раньше: тексты, картинки, озвучка, показ вам. Первыми идут A1 и D12 на 25 ноября.</li>
</ol></section>`;
writeFileSync(join(here, 'grid.html'), html);
console.log('ok', nv, nc, nnew);
