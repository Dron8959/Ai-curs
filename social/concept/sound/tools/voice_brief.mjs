#!/usr/bin/env node
// The recording brief for the live voices: one PDF for Anna and one for Kamilla. First page: how to record on a phone and
// how to say the lines. Then one page per reel: every line in English, what it means, how to say it, two boxes for the
// takes. The English lines come from VOICEOVER.md (one source of truth, the build stops if they drift apart); the Russian
// meaning and the direction live here.
//   node social/concept/sound/tools/voice_brief.mjs     ->  social/concept/out/voice-brief-anna.pdf, voice-brief-kamilla.pdf
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const concept = resolve(here, '..', '..');
const { chromium } = createRequire(import.meta.url)('playwright');
const font = (family, weight, pkg, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url(${pathToFileURL(resolve(concept, 'node_modules', pkg, 'files', file)).href}) format('woff2')}`;

// ---- the lines: * marks the words to stress with the voice
const REELS = [
  { no: '02', id: '02-meet-anna-kamilla', title: 'Meet Anna & Kamilla.', topic: 'Вы вдвоём представляетесь: мама и дочка, а не корпорация. Говорите по очереди, а в конце вместе.', lines: [
    { who: 'Anna', en: 'We’re a *mom* and a *daughter*.', ru: 'Мы — мама и дочка.', how: 'Тепло и с улыбкой, как будто знакомитесь с новой подругой.' },
    { who: 'Kamilla', en: 'Not a *corporation*.', ru: 'Не корпорация.', how: 'Быстро и весело, с озорством: «Нет-нет, никакая мы не корпорация!»' },
    { who: 'Anna', en: 'I’m Anna. I built *every* lesson *myself*.', ru: 'Я Аня. Я сама сделала каждый урок.', how: 'Просто и спокойно, без хвастовства. «Every» и «myself» чуть выделите: это правда, которой вы гордитесь.' },
    { who: 'Kamilla', en: 'I’m Kamilla, I’m ten, and I *go first*.', ru: 'Я Камилла, мне десять, и я иду первой.', how: 'Бодро и весело. «I go first» скажи с гордостью: ты первая всё пробуешь.' },
    { who: 'Anna', en: 'We tested it all at our kitchen table. What lost her attention got *cut*.', ru: 'Мы всё проверили за нашим кухонным столом. Что ей надоедало, то вырезали.', how: 'По-домашнему, с лёгким юмором. После «table» маленькая пауза. «Cut» коротко и весело, как точка.' },
    { who: 'Both', en: 'A mom, a daughter, and *you*.', ru: 'Мама, дочка — и вы.', how: 'Вдвоём, одновременно, в один телефон. Тепло, а на «you» как будто обращаетесь к тому, кто смотрит.' },
  ] },
  { no: '05', id: '05-reason-to-show', title: 'A reason to show you.', topic: 'Мысль бренда: детям нужно не больше экрана, а повод что-то показать вам.', lines: [
    { who: 'Anna', en: 'Kids don’t need *more* screen time.', ru: 'Детям не нужно больше экранного времени.', how: 'Спокойно и уверенно, как мысль, в которую вы верите. Без нравоучительного тона.' },
    { who: 'Anna', en: 'They need a reason to *show* you something.', ru: 'Им нужен повод что-то вам показать.', how: 'Теплее и мягче. «Show» главное слово, выделите его.' },
    { who: 'Anna', en: 'A screen she *makes* on is not a screen she *scrolls*.', ru: 'Экран, на котором она создаёт, это не тот экран, который она листает.', how: 'С лёгкой иронией. Два слова-противовеса: «makes» скажите с радостью, «scrolls» с усталостью.' },
    { who: 'Anna', en: 'Make the screen *worth* it.', ru: 'Пусть экран того стоит.', how: 'Тихо и просто, как вывод и приглашение. В конце голос вниз и улыбка.' },
  ] },
  { no: '06', id: '06-watch-make-show', title: 'Watch. Make. Show.', topic: 'Камилла объясняет урок тремя словами: Watch, Make, Show.', lines: [
    { who: 'Kamilla', en: 'One lesson. *Three* steps.', ru: 'Один урок. Три шага.', how: 'Бодро, как ведущая детского шоу. Между двумя фразами пауза.' },
    { who: 'Kamilla', en: '*Watch*: I show you the finished thing.', ru: 'Смотри: я показываю готовую вещь.', how: 'Первое слово как название шага: коротко и громко. Дальше обычным весёлым голосом.' },
    { who: 'Kamilla', en: '*Make*: you build yours, with a parent next to you.', ru: 'Делай: ты строишь своё, а рядом родитель.', how: 'Название шага коротко. «With a parent next to you» теплее, как будто рядом сидит мама.' },
    { who: 'Kamilla', en: '*Show*: play it, and send it to *grandma*.', ru: 'Покажи: поиграй и отправь бабушке.', how: 'Название шага коротко. «Grandma» с радостью, улыбнись.' },
    { who: 'Kamilla', en: 'One lesson. One *real* thing.', ru: 'Один урок. Одна настоящая вещь.', how: 'Гордо и спокойно, как итог.' },
  ] },
  { no: '07', id: '07-made-by-10-year-old', title: 'Made by a 10-year-old.', topic: 'Камилла показывает, что сделала сама: мультфильм, игру и стикеры.', lines: [
    { who: 'Kamilla', en: 'I’m ten, and I made *all* of this.', ru: 'Мне десять, и я сделала всё это.', how: 'Гордо, но без хвастовства. «All» чуть выдели.' },
    { who: 'Kamilla', en: 'A cartoon. My story, my *characters*.', ru: 'Мультфильм. Моя история, мои персонажи.', how: 'Перечисляй с радостью: каждая фраза как маленький подарок зрителю.' },
    { who: 'Kamilla', en: 'A game you can *play*.', ru: 'Игра, в которую можно играть.', how: 'С приглашением, как будто протягиваешь телефон: «На, поиграй!»' },
    { who: 'Kamilla', en: 'And stickers of my *own* character.', ru: 'И стикеры с моим собственным персонажем.', how: '«Own» с гордостью: это твой персонаж.' },
    { who: 'Kamilla', en: 'What would *you* make?', ru: 'А что бы сделал ты?', how: 'Любопытно, как вопрос подруге. В конце голос идёт вверх.' },
  ] },
  { no: '08', id: '08-will-ai-think', title: 'Will AI think for my kid?', topic: 'Ответ на главную тревогу родителей: думает ребёнок, а не ИИ.', lines: [
    { who: 'Anna', en: 'Will AI *think* for my kid?', ru: 'ИИ будет думать за моего ребёнка?', how: 'Как вопрос, который волнует маму: чуть тревожно, по-настоящему. «Think» выделите.' },
    { who: 'Anna', en: 'Only if the *AI* has the ideas.', ru: 'Только если идеи будут у ИИ.', how: 'Спокойно и уверенно, с короткой паузой перед «the AI». Это ответ.' },
    { who: 'Anna', en: 'In every lesson she *decides*, *tells* the AI, *checks* it, *fixes* it.', ru: 'В каждом уроке она решает, говорит ИИ, проверяет, исправляет.', how: 'Четыре коротких действия, как на пальцах: решает, говорит, проверяет, исправляет. Между ними крошечные паузы, ритм ровный.' },
    { who: 'Anna', en: 'Don’t let AI think for your child. Teach them to think *with* it.', ru: 'Не позволяйте ИИ думать за вашего ребёнка. Научите думать вместе с ним.', how: 'Главная мысль ролика. Тепло и твёрдо, не торопитесь. «With» выделите.' },
    { who: 'Anna', en: 'Let them do the *thinking*.', ru: 'Пусть думают они.', how: 'Тихо, с улыбкой. Последнее слово ролика.' },
  ] },
  { no: '01', id: '01-crayon-to-cartoon', title: 'From crayon to cartoon.', topic: 'Рисунок ребёнка превращается в мультфильм за один урок.', later: true, lines: [
    { who: 'Anna', en: 'A *six-year-old* drew this.', ru: 'Это нарисовал шестилетний ребёнок.', how: 'С удивлением и теплом.' },
    { who: 'Anna', en: 'One lesson later, it’s a *cartoon*.', ru: 'Один урок спустя это мультфильм.', how: 'Радостно, как будто показываете чудо.' },
    { who: 'Anna', en: 'Kid’s idea. AI follows the drawing. And you’re *right there*.', ru: 'Идея ребёнка. ИИ идёт за рисунком. А вы рядом.', how: 'Три коротких мысли, спокойно и внятно. Последнюю теплее.' },
    { who: 'Anna', en: 'What will *yours* draw?', ru: 'А что нарисует ваш?', how: 'Любопытно и с улыбкой, как вопрос зрителю.' },
  ] },
  { no: '04', id: '04-idea-to-game', title: 'Idea at 7:02. Game by 7:41.', topic: 'Идея в 7:02, а в 7:41 семья уже играет в готовую игру.', later: true, lines: [
    { who: 'Anna', en: 'Seven oh two. She has an *idea*.', ru: 'Семь ноль два. У неё появилась идея.', how: 'Коротко и с интригой.' },
    { who: 'Anna', en: 'Seven forty-one. We’re *playing* it.', ru: 'Семь сорок один. Мы в неё играем.', how: 'Радостно, будто сами удивляетесь, как быстро.' },
    { who: 'Anna', en: 'Against each other, at the *same table*.', ru: 'Друг против друга, за одним столом.', how: 'С азартом и теплом.' },
    { who: 'Anna', en: 'She *decided*, told the AI, checked, and fixed it.', ru: 'Она решила, сказала ИИ, проверила и исправила.', how: 'По пунктам, короткие действия подряд, как в ролике 08.' },
    { who: 'Anna', en: 'Your kid’s idea. *Tonight*?', ru: 'Идея вашего ребёнка. Сегодня вечером?', how: 'Как приглашение: тепло, вопрос, улыбка.' },
  ] },
];

// ---- the lines must be the ones in VOICEOVER.md
const spoken = {};
let cur = null;
for (const l of readFileSync(resolve(here, '..', 'VOICEOVER.md'), 'utf8').split('\n')) {
  const h = l.match(/^### (\S+) · /);
  if (h) { cur = spoken[h[1]] = []; continue; }
  const r = l.match(/^\| (\d+) \| [\d.]+-[\d.]+ \| (.+?) \| /);
  if (r && cur) cur.push(r[2].replace(/^(Anna|Kamilla|Both): /, '').replace(/\*/g, '').replace(/’/g, "'"));
}
for (const reel of REELS) {
  const want = (spoken[reel.id] || []);
  const have = reel.lines.map((x) => x.en.replace(/\*/g, '').replace(/’/g, "'"));
  if (JSON.stringify(want) !== JSON.stringify(have)) {
    console.error(`${reel.id}: the lines here and in VOICEOVER.md differ\n  VOICEOVER.md: ${JSON.stringify(want)}\n  here:         ${JSON.stringify(have)}`);
    process.exit(1);
  }
}

// ---- the pages
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const stress = (s) => esc(s).replace(/\*([^*]+)\*/g, '<mark>$1</mark>');
const PEOPLE = {
  Anna: { name: 'Аня', dat: 'Ани', mine: ['02', '05', '08'], later: ['01', '04'], together: 'Камиллой' },
  Kamilla: { name: 'Камилла', dat: 'Камиллы', mine: ['02', '06', '07'], later: [], together: 'мамой' },
};
const WHO_RU = { Anna: 'Аня', Kamilla: 'Камилла', Both: 'Аня и Камилла вместе' };

const STEPS = {
  Anna: [
    ['Тихое место.', 'Лучше всего небольшая комната с мягкими вещами: диван, шторы, ковёр. Идеально шкаф с одеждой. Выключите вентилятор и кондиционер, закройте окно, поставьте телефон на «Не беспокоить».'],
    ['Обычный «Диктофон».', 'Записывайте в приложении «Диктофон» на телефоне, а не голосовым сообщением в мессенджере: оно сильно сжимает звук.'],
    ['Телефон на столе.', 'Поставьте его на стопку книг. От рта до телефона ладонь с кулаком (15–20 см), чуть сбоку: так меньше шипения и «взрывов» на «п» и «б». Не держите в руке и не двигайте во время записи.'],
    ['Сначала тишина.', 'Нажмите запись и помолчите 5 секунд. По этой тишине я уберу шум комнаты.'],
    ['Каждую реплику два раза.', 'Говорите по порядку. Между повторами вдох и пауза 1–2 секунды. Второй раз можно по-другому: теплее, живее.'],
    ['Запнулись?', 'Запись не останавливайте: пауза, вдох и реплику заново с начала.'],
    ['Один файл на один ролик.', 'Номер ролика и дубля называть не нужно, я разберусь по тексту.'],
    ['Отправьте как есть.', 'Файлом (m4a, mp3, wav, любой формат). Через мессенджер выбирайте «отправить как файл».'],
  ],
  Kamilla: [
    ['Тихая комната.', 'Лучше с мягкими вещами: диван, шторы, одеяло. Выключи вентилятор и кондиционер, закрой окно.'],
    ['Обычный «Диктофон».', 'Записывай в приложении «Диктофон» на телефоне, а не голосовым сообщением в мессенджере: там звук сильно сжимается.'],
    ['Телефон на столе.', 'Поставь его на стопку книг. От рта до телефона ладонь с кулаком (15–20 см), чуть сбоку. Не держи в руке и не двигай во время записи.'],
    ['Сначала тишина.', 'Нажми запись и помолчи 5 секунд. По этой тишине я уберу шум комнаты.'],
    ['Каждую реплику два раза.', 'Говори по порядку. Между повторами вдох и пауза 1–2 секунды. Второй раз можно смешнее или теплее!'],
    ['Запнулась?', 'Запись не останавливай: подожди секунду и скажи реплику заново с начала.'],
    ['Один файл на один ролик.', 'Номер ролика и дубля называть не нужно, я разберусь по тексту.'],
    ['Отправь как есть.', 'Файлом (m4a, mp3, wav, любой формат). Через мессенджер выбирай «отправить как файл».'],
  ],
};
const TIPS = {
  Anna: [
    'Это не диктор, это вы: мама, которая рассказывает другой маме о том, во что верит.',
    'Улыбайтесь, пока говорите: улыбку слышно.',
    '<mark>Слова на жёлтом</mark> выделяйте голосом: чуть дольше и выше.',
    'Не торопитесь. Картинку под вашу речь я подстрою, а ускорить речь и не потерять живость нельзя.',
    'Чуть «слишком живо» лучше, чем ровно и скучно. Из двух повторов я выберу лучший.',
  ],
  Kamilla: [
    'Это не чтение в классе. Прочитай реплику глазами, подними голову и скажи её так, будто рассказываешь подруге про свою игру.',
    'Улыбайся, пока говоришь: улыбку слышно!',
    '<mark>Слова на жёлтом</mark> выдели голосом: скажи их чуть громче и дольше.',
    'Не торопись. Лучше медленно и по-настоящему, чем быстро и ровно.',
    'Слово не выходит? Отметь его на листе, я заменю на другое. Это нормально.',
  ],
};

const reelPage = (p, reel) => {
  const P = PEOPLE[p];
  const rows = reel.lines.map((x, i) => {
    const mine = x.who === p || x.who === 'Both';
    if (!mine) return `<div class="line other"><b class="n">${i + 1}</b><div><p class="en">${stress(x.en)}</p><p class="ru">Говорит ${esc(WHO_RU[x.who])}. Её реплику записывать не нужно: она здесь, чтобы вы видели весь ролик.</p></div></div>`;
    return `<div class="line"><b class="n">${i + 1}</b><div>
      ${x.who === 'Both' ? `<span class="tag">вместе с ${P.together}, в один телефон, три раза</span>` : ''}
      <p class="en">${stress(x.en)}</p>
      <p class="ru">${esc(x.ru)}</p>
      <p class="how"><span>Как сказать</span>${esc(x.how)}</p>
      <p class="takes">дубль 1 <i></i> дубль 2 <i></i>${x.who === 'Both' ? ' дубль 3 <i></i>' : ''}</p></div></div>`;
  }).join('');
  return `<section class="page${reel.later ? ' later' : ''}">
    <div class="top"><span class="brand">make · show · lab</span><span class="who">${P.name} · ролик ${reel.no}</span></div>
    <h2>${esc(reel.title)}</h2>
    <p class="topic">${esc(reel.topic)}</p>
    ${reel.later ? '<p class="wait">Пока не записывайте этот ролик. Сначала подтверждаем факты, слова могут измениться.</p>' : ''}
    ${rows}
  </section>`;
};

const firstPage = (p) => {
  const P = PEOPLE[p];
  const mine = REELS.filter((r) => P.mine.includes(r.no)).map((r) => r.no);
  const wait = REELS.filter((r) => P.later.includes(r.no)).map((r) => r.no);
  const both = REELS.some((r) => P.mine.includes(r.no) && r.lines.some((x) => x.who === 'Both'));
  return `<section class="page first">
    <div class="top"><span class="brand">make · show · lab</span><span class="who">${P.name}</span></div>
    <h1>Запись голоса<br>для роликов</h1>
    <p class="lead">${p === 'Anna'
      ? 'Голос, который собрал компьютер, вышел безжизненным. Поэтому в роликах будет ваш настоящий голос: живой, с выражением, как вы говорите с подругой о том, во что верите. Реплики и подсказки на следующих страницах, по странице на ролик.'
      : 'Камилла, твой голос это половина роликов. Не нужно «прочитать», нужно сказать так, будто рассказываешь подруге про свою игру. Реплики и подсказки на следующих страницах, по странице на ролик.'}</p>
    <h3>Как записать</h3>
    <ol class="steps">${STEPS[p].map(([b, t]) => `<li><b>${esc(b)}</b> ${esc(t)}</li>`).join('')}</ol>
    <h3>Как говорить</h3>
    <ul class="tips">${TIPS[p].map((t) => `<li>${t}</li>`).join('')}</ul>
    <div class="send"><h3>Что записать</h3>
      <p>Сейчас: ролики ${mine.join(', ')}.${both ? ` Последнюю фразу ролика 02 («A mom, a daughter, and you») ${p === 'Anna' ? 'запишите вместе с Камиллой' : 'запиши вместе с мамой'}, в один телефон, три раза, отдельным файлом.` : ''}</p>
      ${wait.length ? `<p>Потом: ролики ${wait.join(' и ')}. Не записывайте их, пока я не скажу: сначала подтверждаем факты.</p>` : ''}
      <p>${p === 'Anna'
        ? 'По желанию, в самом конце: 1–2 минуты свободной речи по-английски. Расскажите своими словами, что это за курс, как подруге: с эмоциями, паузами, можно со смехом. Читать не нужно.'
        : 'По желанию, в самом конце: минута свободной речи по-английски. Расскажи про игру, которую ты сделала, как будто рассказываешь другу: с эмоциями и смехом. Читать не нужно.'}</p></div>
  </section>`;
};

const css = `
${[600, 700, 800].map((w) => font('Sora', w, '@fontsource/sora', `sora-latin-${w}-normal.woff2`)).join('')}
${[500, 600, 700, 800].map((w) => font('Urbanist', w, '@fontsource/urbanist', `urbanist-latin-${w}-normal.woff2`)).join('')}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,'DejaVu Sans',sans-serif;color:#141A33;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;padding:11mm 15mm;overflow:hidden;page-break-after:always;background:#FFF8EA;position:relative}
.page:last-child{page-break-after:auto}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4mm}
.brand{font:800 16px Sora,Inter;letter-spacing:-.02em}
.who{font:800 13px Urbanist,Inter;letter-spacing:.1em;text-transform:uppercase;background:#141A33;color:#FFC533;padding:6px 15px;border-radius:99px}
mark{background:#FFC533;color:#141A33;padding:0 .14em;border-radius:5px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
h1{font:800 38px/1.08 Sora,Inter;letter-spacing:-.03em;margin-bottom:4mm}
h2{font:800 32px/1.1 Sora,Inter;letter-spacing:-.03em}
h3{font:800 14px Inter;letter-spacing:.08em;text-transform:uppercase;margin:5mm 0 2mm;color:#FF6F4A}
.lead{font-size:14.5px;line-height:1.45;color:#2B3150}
.steps{padding-left:20px;font-size:12.6px;line-height:1.42}
.steps li{margin-bottom:1.6mm;padding-left:3px}
.steps b{font-weight:800}
.tips{padding-left:18px;font-size:12.6px;line-height:1.42}
.tips li{margin-bottom:1.3mm}
.send{margin-top:2mm;background:#141A33;color:#FFF4DC;border-radius:14px;padding:3.5mm 5mm 4mm}
.send h3{color:#FFC533;margin-top:0}
.send p{font-size:13.2px;line-height:1.45;margin-top:1.2mm}
.topic{font-size:15px;line-height:1.4;color:#4B5070;margin:2mm 0 4mm}
.line{display:flex;gap:14px;align-items:flex-start;background:#fff;border:2.5px solid #141A33;border-radius:16px;box-shadow:5px 5px 0 #141A33;padding:3.2mm 5mm;margin-bottom:3.6mm}
.line .n{flex:none;width:32px;height:32px;border-radius:50%;background:#FFC533;border:2.5px solid #141A33;font:800 16px/27px Urbanist;text-align:center;margin-top:3px}
.line>div{flex:1;min-width:0}
.en{font:800 27px/1.22 Urbanist,Inter;letter-spacing:-.01em}
.ru{font-size:13.5px;color:#4B5070;margin-top:1.2mm;line-height:1.35}
.how{font-size:14.5px;line-height:1.38;margin-top:1.8mm}
.how span{display:inline-block;font:800 11px Inter;letter-spacing:.08em;text-transform:uppercase;background:#FF6F4A;color:#fff;padding:3px 9px;border-radius:99px;margin-right:8px;vertical-align:1px}
.takes{font-size:11.5px;color:#4B5070;margin-top:2mm}
.takes i{display:inline-block;width:13px;height:13px;border:2px solid #141A33;border-radius:3px;margin:0 12px 0 4px;vertical-align:-3px}
.tag{display:inline-block;font:800 11px Inter;letter-spacing:.06em;text-transform:uppercase;background:#5FE0A8;border:2px solid #141A33;border-radius:99px;padding:3px 10px;margin-bottom:2mm}
.line.other{background:transparent;border:2px dashed #B9B2A0;box-shadow:none;padding:3mm 5mm}
.line.other .n{background:#EDE6D4;border-color:#B9B2A0;color:#7A7458}
.line.other .en{font-size:19px;color:#7A7458}
.line.other .ru{font-size:11.5px;color:#9A947A}
.wait{background:#FF6F4A;color:#fff;font-weight:800;font-size:14px;border-radius:12px;padding:3mm 5mm;margin-bottom:5mm;line-height:1.35}
.later .line{opacity:.75}
`;

const out = resolve(concept, 'out');
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(resolve(tmpdir(), 'voice-brief-'));
const browser = await chromium.launch();
for (const p of Object.keys(PEOPLE)) {
  const P = PEOPLE[p];
  const reels = [...P.mine, ...P.later].map((no) => REELS.find((r) => r.no === no));
  const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Make Show Lab: запись голоса, ${P.name}</title><style>${css}</style><body>${firstPage(p)}${reels.map((r) => reelPage(p, r)).join('')}</body></html>`;
  const file = resolve(tmp, `${p}.html`);
  writeFileSync(file, html);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  const pdf = resolve(out, `voice-brief-${p.toLowerCase()}.pdf`);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  await page.close();
  console.log('wrote', pdf.replace(concept + '/', ''), `(${reels.length + 1} pages)`);
}
await browser.close();
