#!/usr/bin/env python3
"""Rebuilds profile.html, the preview page of all platforms, from what is assembled in social/concept.

   python3 social/concept/preview/make_page.py     -> preview/profile.html + preview/p/ (generated, not committed)
Publish it with the Artifact tool to the same address every time (the address is in social/desks/README.md):
the page itself, plus the files in p/ and n/ that changed."""
import json, os, re, glob, subprocess
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(os.path.dirname(HERE), 'posts')
P = os.path.join(HERE, 'p'); os.makedirs(P, exist_ok=True)

RU = {
 1: dict(day='Пн', type='доказательство', why='Главное обещание курса видно за три секунды. Формат «рисунок ожил» лучше всего подтверждён в нише.', send='Мама — папе или бабушке.',
         inside=['«A 6-year-old drew this.» и рисунок на бумаге', '«One lesson later.»: рядом появляется мультяшная версия', '«Who did what.»: ребёнок, ИИ и родитель', 'Финал: «What will yours draw?»'],
         src='Рисунок и мультик с лендинга.', more='Видео рук, которые рисуют фломастерами.'),
 2: dict(day='Вт', type='история', pin=True, why='Перед покупкой детского продукта родитель смотрит, кто за ним стоит.', send='Мама — партнёру.',
         inside=['«A mom and a daughter.» и два портрета', '«Not a corporation.»', '«Anna built every lesson.» Домашку проверяет в тот же день', '«Kamilla, 10, goes first.»', '«Tested at our kitchen table.»', 'Финал: «A mom, a daughter, and you.»'],
         src='Портреты Ани и Камиллы, фото за столом.', more='15–20 секунд Ани в камеру.'),
 3: dict(day='Ср', type='научить', why='Безопасность — первое возражение родителей. Справочный пост сохраняют и пересылают.', send='Мама — в родительский чат и партнёру.',
         inside=['Обложка: пять правил, список выглядывает снизу', '«Almost 9 in 10 kids already use AI», с источником', 'Пять правил, по слайду на каждое', 'Все пять списком: слайд для скриншота', '«Send it to a parent who needs it.»'],
         src='Текст и графика, всё готово.', more=''),
 4: dict(day='Чт', type='доказательство', why='Снимает «у меня нет времени»: один вечер, 39 минут.', send='Мама — папе: «давай сегодня попробуем».',
         inside=['«7:02 pm. Her idea.»: парк, девочка и корги', '«7:41 pm. Playing it.» и игра на экране', '«Against each other. Same table.» и фото', '«She decided. She told the AI. She checked. She fixed.»', 'Финал: «Your kid’s idea. Tonight?»'],
         src='Игра Камиллы и фото за столом.', more='Запись экрана игры, 5–8 секунд.'),
 5: dict(day='Сб', type='позиция', why='Позиция, с которой соглашаются и которую пересылают. Отстраивает и от «экраны зло», и от «без ИИ отстанет».', send='Мама — подруге или партнёру: «это про нас».',
         inside=['«Kids don’t need more screen time.» и телефон с бесконечной лентой', '«They need a reason to show you something.» и фото Камиллы', '«A screen she makes on is not a screen she scrolls.»', 'Финал: «Make the screen worth it.»'],
         src='Фото шага Show и графика.', more='Видео, где Камилла показывает экран.'),
 6: dict(day='Пн', type='научить', why='Объясняет курс за 15 секунд и убирает вопрос «а что мы будем делать».', send='Мама — себе в сохранённое.',
         inside=['«One lesson. Three steps.» 6–20 минут', 'Watch: Камилла сначала показывает готовое', 'Make: ребёнок делает, родитель рядом', 'Show: сыграть, отправить бабушке', 'Финал: «One lesson. One real thing.»'],
         src='Три фото шагов с лендинга.', more='Короткие видео каждого шага.'),
 7: dict(day='Вт', type='доказательство', pin=True, why='Лучшее доказательство и желание: «мой бы тоже хотел».', send='Мама — ребёнку или бабушке.',
         inside=['«Made by a 10-year-old.»', 'Отрывок её мультфильма: настоящее видео внутри ролика', 'Игра, в которую можно играть', 'Стикеры с её персонажем, крупно', 'Финал: «What would yours make?»'],
         src='Мультфильм, игра и фото со стикерами. Сайт убран: на скриншоте его делает Аня, а не Камилла.', more='Скриншот сайта, который сделала сама Камилла, если такой есть.'),
 8: dict(day='Ср', type='позиция', why='Второе возражение: «ИИ сделает его ленивым». Здесь же главная мысль бренда.', send='Мама — скептичному партнёру или знакомой учительнице.',
         inside=['«Will AI think for my kid?»', '«Only if the AI has the ideas.»', 'Четыре шага: decides → tells the AI → checks → fixes', '«Don’t let AI think for your child. Teach them to think with it.»', 'Финал: «Let them do the thinking.»'],
         src='Графика и нарисованные Камилла и Аня.', more=''),
 9: dict(day='Пт', type='доказательство', why='Отзывы людей, похожих на зрителя. Бабушки открывают тему подарка перед праздниками.', send='Мама — своей маме.',
         inside=['Обложка с цитатой Эмили', '«They got it free.»: честно, с первого слайда', 'Пять семей: дословная строка, фото и что сделали', '«What they made»: все восемь списком', '«Try the first lesson free.» и пометка про бесплатный доступ'],
         src='Восемь фото и цитат с лендинга.', more=''),
 10: dict(day='Вс', type='предложение', pin=True, why='Предложение сказано прямо. Сюда ведут все остальные посты.', send='Мама — партнёру: «попробуем бесплатно».',
         inside=['Обложка: бесплатный первый урок', '«Worst case: 20 minutes on the couch.»', 'Три шага, по слайду на каждый', 'Все три шага списком', '«Free first lesson. Link in bio.»'],
         src='Игра Камиллы и графика.', more='Запись экрана первого урока.'),
}
TITLES = {1: 'From crayon to cartoon.', 2: 'Meet Anna & Kamilla.', 3: '5 AI house rules.', 4: 'Idea at 7:02. Game by 7:41.', 5: 'A reason to show you.',
          6: 'Watch. Make. Show.', 7: 'Made by a 10-year-old.', 8: 'Will AI think for my kid?', 9: '8 families tried it first.', 10: 'Free first lesson.'}

def jpg(src, dst, size, q=84):
    im = Image.open(src).convert('RGB').resize(size, Image.LANCZOS); im.save(os.path.join(P, dst), quality=q, optimize=True)

posts = []
for d in sorted(glob.glob(os.path.join(REPO, '*'))):
    pid = os.path.basename(d); n = int(pid[:2]); k = f'{n:02d}'
    cap_raw = open(os.path.join(d, 'caption.md')).read().split('---', 2)
    meta = dict(l.split(': ', 1) for l in cap_raw[1].strip().split('\n') if ': ' in l)
    rub = meta['rubric'].split()
    jpg(os.path.join(d, 'tile.jpg'), f'{k}-tile.jpg', (720, 960))
    p = dict(n=n, r=rub[0], no=rub[1] if len(rub) > 1 else '', title=TITLES[n], cap=cap_raw[2].strip(), img=f'{k}-tile', **RU[n])
    slides = sorted(glob.glob(os.path.join(d, 'slide-*.jpg')))
    if slides:
        p['fmt'] = f'Карусель · {len(slides)} слайдов'; p['slides'] = []
        for i, s in enumerate(slides, 1):
            jpg(s, f'{k}-s{i}.jpg', (720, 900)); p['slides'].append(f'{k}-s{i}')
    else:
        mp4 = os.path.join(d, 'reel.mp4')
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).decode())
        subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-vf', 'scale=540:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(P, f'{k}.mp4')])
        jpg(os.path.join(d, 'cover.jpg'), f'{k}-cover.jpg', (540, 960))
        p['fmt'] = 'Reel'; p['video'] = k; p['dur'] = round(dur)
    posts.append(p)

html = open(os.path.join(HERE, 'template.html')).read()
# 1. data
a = html.index('const POSTS = ['); b = html.index('const HL = ')
html = html[:a] + 'const POSTS = ' + json.dumps(posts, ensure_ascii=False) + ';\n' + html[b:]
# 2. the post card
a = html.index("document.getElementById('posts').innerHTML"); b = html.index("document.getElementById('grid').addEventListener")
card = r"""document.getElementById('posts').innerHTML = POSTS.map((p) => `
  ${p.n === 1 ? '<div class="week">Неделя 1</div>' : p.n === 6 ? '<div class="week">Неделя 2</div>' : ''}
  <article class="post" id="post-${p.n}">
    <div class="lead-media">${p.video
      ? `<video controls playsinline preload="none" poster="p/${p.video}-cover.jpg" src="p/${p.video}.mp4" aria-label="Ролик: ${esc(p.title)}"></video><span class="len">${p.dur} с · со звуком</span>`
      : `<button class="cover" type="button" data-seq="${p.slides.join(',')}" data-i="0" aria-label="Открыть слайды поста ${p.n}"><img src="p/${p.slides[0]}.jpg" alt="Обложка: ${esc(p.title)}" loading="lazy"></button><span class="len">${p.slides.length} слайдов</span>`}</div>
    <div>
      <div class="meta"><span class="chip">№${p.n} · ${p.day}</span><span class="chip r ${p.r}">${p.r}${p.no ? ' ' + p.no : ''}</span><span class="chip">${esc(p.fmt)}</span><span class="chip">${esc(p.type)}</span>${p.pin ? '<span class="chip pinned">закреп</span>' : ''}<span class="chip done">собрано</span></div>
      <h3>${esc(p.title)}</h3>
      <dl class="rows">
        <dt>Внутри</dt><dd><ol>${p.inside.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></dd>
        <dt>Зачем</dt><dd>${esc(p.why)}</dd>
        <dt>Перешлют</dt><dd>${esc(p.send)}</dd>
        <dt>Собрано из</dt><dd>${esc(p.src)}</dd>
        ${p.more ? `<dt>Сильнее с</dt><dd>${esc(p.more)}</dd>` : ''}
      </dl>
      ${p.slides ? `<div class="strip">${p.slides.map((f,i) => `<button type="button" data-seq="${p.slides.join(',')}" data-i="${i}" aria-label="Слайд ${i + 1}"><img src="p/${f}.jpg" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      <details class="cap"><summary>Подпись к посту</summary><pre>${esc(p.cap)}</pre></details>
    </div>
  </article>`).join('');

"""
html = html[:a] + card + html[b:]
# 3. grid tiles and lightbox now read from p/
for x, y in (('<img src="n/${p.img}.jpg" alt="">', '<img src="p/${p.img}.jpg" alt="">'),
             ("lbImg.src = 'n/' + seq[at] + '.jpg';", "lbImg.src = 'p/' + seq[at] + '.jpg';")):
    assert html.count(x) == 1, 'template.html changed, this patch no longer finds: ' + x
    html = html.replace(x, y)
# 4. styles
html = html.replace('</style>', """.post{grid-template-columns:190px minmax(0,1fr)}
.lead-media{align-self:start}
.lead-media video{display:block;width:100%;aspect-ratio:9/16;border-radius:14px;background:#141A33}
.lead-media .cover img{aspect-ratio:4/5}
.len{display:block;margin-top:6px;font-size:12.5px;color:var(--muted);text-align:center}
.chip.done{background:var(--mint);color:var(--on-brand)}
.strip img{height:150px}
.cap{margin-top:12px;border:1px solid var(--line);border-radius:12px;padding:9px 14px;background:var(--bg)}
.cap summary{cursor:pointer;font-weight:600;font-size:14px}
.cap pre{white-space:pre-wrap;font:inherit;font-size:14px;margin:10px 0 2px}
.rows{grid-template-columns:96px minmax(0,1fr)}
@media (max-width:560px){.post{grid-template-columns:118px minmax(0,1fr)}.rows{grid-template-columns:minmax(0,1fr)}}
</style>""", 1)
# 5. copy
rep = [
 ('Три слова из названия становятся тремя рубриками, у каждой свой цвет из логотипа. Слева профиль с первыми десятью постами, справа — что внутри каждого и зачем он нужен. Нажмите на плитку, чтобы перейти к посту.',
  'Первые десять постов собраны: три карусели целиком и семь роликов. Слева профиль, справа каждый пост — ролик можно посмотреть, слайды пролистать, подпись прочитать. Нажмите на плитку, чтобы перейти к посту.'),
 ('<h2>Первые 10 постов</h2>', '<h2>Десять постов: что собрано</h2>'),
 ('Сейчас у страницы почти нет охвата: посты видят только свои. Поэтому семь из десяти — ролики, их Instagram показывает неподписчикам. Карусели стоят там, где нужны сохранения и пересылки. Порядок ниже — порядок публикации.',
  'Семь из десяти — ролики: у страницы почти нет охвата, а неподписчикам Instagram показывает в основном их. Ролики собраны как графика из фото и работ с лендинга. Звук уже внутри: одна музыкальная тема на всю серию и звуки под анимацию — бумага, хлопки, карандаш. Монтаж переставлен под ритм музыки: её основная часть входит на главном кадре, последний аккорд приходится на логотип. Голоса пока нет. Где живое видео сделает пост сильнее, это отмечено в строке «Сильнее с».'),
]
for x, y in rep:
    assert x in html, x[:50]
    html = html.replace(x, y)
a = html.index('<section id="next-sec">'); b = html.index('</main>')
html = html[:a] + """<section id="next-sec">
        <h2>Что дальше</h2>
        <div class="two">
          <div class="box"><h3>Нужно от вас</h3><ol class="steps">
            <li>Послушать ролики со звуком. Я не слышу: музыку и эффекты подбирал по описаниям и измерениям, вкус проверить можете только вы.</li>
            <li>Решить про голос: записать Аню и Камиллу на телефон (тексты готовы), взять ИИ-голос или оставить без голоса.</li>
            <li>Посмотреть посты и сказать, что править: тексты, порядок, картинки.</li>
            <li>Подтвердить два факта: радугу нарисовал ребёнок шести лет (так подписано на прошлой версии лендинга); история «7:02 → 7:41» действительно про игру Камиллы. До ответа посты №1 и №4 не публикуем.</li>
            <li>Поставить аватар в трёх сетях и вставить имя, описание и ссылку.</li>
            <li>По возможности снять короткие видео для строки «Сильнее с»: я вставлю их в готовые ролики.</li>
          </ol></div>
          <div class="box"><h3>Что сделаю после вашего ответа</h3><ol class="steps">
            <li>Внесу правки и пересоберу посты; сменю музыку или громкость эффектов, если не понравятся.</li>
            <li>Вставлю голос: приглушу под ним музыку и сведу заново.</li>
            <li>Поставлю их черновиками в Metricool: пять в неделю, будни в 19:30 по Нью-Йорку.</li>
            <li>Отрисую обложки хайлайтов и шапку Facebook в финальном размере.</li>
          </ol></div>
        </div>
      </section>
    """ + html[b:]

# highlights: themed covers into n/, title stories into p/
for hid in ('free-lesson', 'how-it-works', 'kid-made', 'is-it-safe', 'pricing', 'about-us'):
    Image.open(os.path.join(os.path.dirname(HERE), 'out', f'highlight-{hid}.jpg')).convert('RGB').resize((200, 200), Image.LANCZOS).save(os.path.join(HERE, 'n', f'h-{hid}.jpg'), quality=86)
    jpg(os.path.join(os.path.dirname(HERE), 'out', f'story-{hid}.jpg'), f'st-{hid}.jpg', (540, 960))

# ============================================================ the other platforms (PLATFORMS.md)
from html import escape as E
C = os.path.dirname(HERE)
D = json.loads(subprocess.check_output(['node', os.path.join(HERE, 'export.mjs')]).decode())

def md(path):
    if not os.path.exists(path): return None
    _, fm, body = open(path).read().split('---', 2)
    meta = dict(l.split(': ', 1) for l in fm.strip().split('\n') if ': ' in l)
    return meta, body.strip()

# video lane: the four texts of every post
VID = []
for d in sorted(glob.glob(os.path.join(REPO, '*'))):
    n = int(os.path.basename(d)[:2]); row = dict(n=n, title=TITLES[n])
    for net in ('caption', 'tiktok', 'youtube', 'facebook'):
        r = md(os.path.join(d, net + '.md'))
        if r:
            m, body = r
            row[net] = dict(text=body, title=m.get('title', '').strip('"'), comment=m.get('first_comment', '').strip('"'), phrase=m.get('search_phrase', '').strip('"'),
                            tags=m.get('tags', ''), kind=m.get('type', ''))
    VID.append(row)

# pins and text-post images into p/
for pin in D['pins']:
    jpg(os.path.join(C, 'pins', pin['file'] + '.jpg'), f"pin-{pin['n']:02d}.jpg", (500, 750))
def pimg(path):                      # posts/05-reason-to-show/tile.jpg -> 05-tile ; .../slide-03.jpg -> 03-s3
    if not path: return ''
    parts = path.split('/'); k = parts[1][:2]; f = parts[2]
    return f'{k}-tile' if f.startswith('tile') else f"{k}-s{int(f[6:8])}"

ANCH = {'families': 'отзывы', 'safe': 'безопасность', 'free': 'бесплатный урок', 'works': 'что делают дети', 'how': 'как устроен урок', 'problem': 'зачем курс', 'faq': 'вопросы', 'team': 'кто мы', 'pricing': 'цены', 'program': 'программа', 'start': 'начало'}
seq = ','.join(f"pin-{p['n']:02d}" for p in D['pins'])
def tpost(i, t):
    img = pimg(t.get('image'))
    reply = f'<div class="reply"><span>первый ответ: ссылка живёт здесь</span><pre>{E(t["x"]["reply"])}</pre></div>' if t['x'].get('reply') else ''
    xl = len(t['x']['text']); tl = len(t['threads']['text'])
    return f"""<article class="box tpost">
      <div class="meta"><span class="chip">№{i} · {t['day']}</span><span class="chip">{E(t['kind'])}</span></div>
      <p class="twhy">{E(t['why'])}</p>
      <div class="two">
        <div class="msg"><div class="mh"><b>X</b><span>{xl} из 280</span></div><pre>{E(t['x']['text'])}</pre>{reply}</div>
        <div class="msg"><div class="mh"><b>Threads</b><span>{tl} из 500 · тема: {E(t['threads']['topic'])}</span></div><pre>{E(t['threads']['text'])}</pre></div>
      </div>
      {f'<button class="timg" type="button" data-seq="{img}" data-i="0"><img src="p/{img}.jpg" alt="" loading="lazy"><span>картинка к посту</span></button>' if img else ''}
    </article>"""
thread = D['thread']
boards = ''.join(f'<span class="chip">{E(b["name"])} · {sum(1 for p in D["pins"] if p["board"] == k)}</span>' for k, b in D['boards'].items())
pins_html = ''.join(f"""<figure class="pinc"><button type="button" data-seq="{seq}" data-i="{k}" aria-label="Пин {p['n']}: {E(p['phrase'])}"><img src="p/pin-{p['n']:02d}.jpg" alt="{E(p['alt'])}" loading="lazy"></button>
      <figcaption><b>{p['n']}. {E(p['phrase'])}</b><span>{E(D['boards'][p['board']]['name'])}</span><span>ведёт в раздел «{ANCH.get(p['anchor'], p['anchor'])}»</span>{'<span class="chip pinned">ждёт подтверждения</span>' if p.get('hold') else ''}</figcaption></figure>"""
      for k, p in enumerate(D['pins']))
pin_rows = ''.join(f"<tr><td>{p['n']}</td><td>{E(p['title'])}</td><td>{E(p['text'])}</td></tr>" for p in D['pins'])

more = f"""<section id="lanes-sec">
        <h2>Семь площадок, три ленты</h2>
        <p class="h2note">Instagram разобран выше. Остальные площадки не получают семь разных планов: они делятся на три ленты по тому, как там смотрят.</p>
        <div class="lanes">
          <div class="rub show"><b>видео</b><span>Instagram · TikTok · Facebook · YouTube Shorts</span><small>один и тот же контент: 7 роликов и 3 карусели</small></div>
          <div class="rub make"><b>текст</b><span>Threads · X</span><small>другой контент: 12 постов и одна цепочка</small></div>
          <div class="rub lab"><b>поиск</b><span>Pinterest</span><small>12 пинов со ссылкой на сайт, 5 досок</small></div>
        </div>
        <p class="why">Файл один, слова разные. Одинаковая подпись на всех площадках читается как спам, и её показывают хуже. Поэтому ролик один, а текст под каждую площадку свой.</p>
      </section>

      <section id="video-sec">
        <h2>Видеолента: один файл, четыре подписи</h2>
        <p class="h2note">Тот же ролик идёт в Instagram, TikTok, Facebook и YouTube Shorts. В финальном кадре теперь адрес сайта вместо «Link in bio»: он верен на всех четырёх. Выберите пост и сравните тексты.</p>
        <label class="pick"><span>Пост</span><select id="vsel" aria-label="Пост">{''.join(f'<option value="{v["n"]}">№{v["n"]} · {E(v["title"])}</option>' for v in VID)}</select></label>
        <div class="two" id="vgrid"></div>
        <div class="tablewrap"><table class="tbl"><thead><tr><th></th><th>Instagram</th><th>TikTok</th><th>YouTube Shorts</th><th>Facebook</th></tr></thead><tbody>
          <tr><th>Первая строка</th><td>призыв или крючок</td><td>поисковая фраза</td><td>заголовок с фразой в первых 40 знаках</td><td>разговорная</td></tr>
          <tr><th>Ссылка</th><td>в шапке профиля</td><td>адрес текстом</td><td>адрес текстом</td><td>в первом комментарии</td></tr>
          <tr><th>Карусели</th><td>да</td><td>фото-режим, слайды 9:16</td><td>нет, только видео</td><td>альбом</td></tr>
          <tr><th>Выходит</th><td>день Д, 19:30</td><td>Д+1, 19:00</td><td>Д+2, 12:00</td><td>Д+1, 10:00</td></tr>
        </tbody></table></div>
        <p class="phone-note" style="text-align:left;margin:10px 0 0">Время по Нью-Йорку. Это отправная точка: у новых аккаунтов своей статистики пока нет.</p>
      </section>

      <section id="text-sec">
        <h2>Текстовая лента: Threads и X</h2>
        <p class="h2note">Другой контент, не пересказ роликов. У каждой идеи два варианта, и они разные: в X короче и острее, ссылка уходит в первый ответ; в Threads теплее и обязательно с настоящим вопросом в конце.</p>
        <div class="posts">{''.join(tpost(i + 1, t) for i, t in enumerate(D['text']))}
          <details class="cap"><summary>Цепочка для X: пять правил безопасности, {len(thread['posts'])} постов</summary>{''.join(f'<pre><b>{k + 1} / {len(thread["posts"])}</b>' + chr(10) + E(t) + '</pre>' for k, t in enumerate(thread['posts']))}</details>
        </div>
        <p class="why">Планировщик опубликует пост, но обе площадки показывают его по ответам в первый час. Отвечать на реплики должен человек: 20–30 минут после публикации. И честно про X: без подписки Premium охват у новых аккаунтов почти нулевой.</p>
      </section>

      <section id="pins-sec">
        <h2>Pinterest: поисковик, а не лента</h2>
        <p class="h2note">Сюда приходят с запросом и уходят по ссылке на сайт. Постим пины: вертикальная картинка, на ней крупно поисковая фраза, под ней заголовок с той же фразой, описание и ссылка на раздел сайта, который отвечает на запрос. Пин работает месяцами, результат копится 3–6 месяцев.</p>
        <div class="meta" style="margin-bottom:14px">{boards}</div>
        <div class="pins">{pins_html}</div>
        <details class="cap"><summary>Заголовки и описания всех двенадцати пинов</summary><div class="tablewrap"><table class="tbl"><thead><tr><th>№</th><th>Заголовок</th><th>Описание</th></tr></thead><tbody>{pin_rows}</tbody></table></div></details>
        <div class="why"><b>Три вещи заранее.</b> Фразы на пинах — мои гипотезы: их нужно проверить в подсказках поиска Pinterest. У сайта одна страница, а между пинами на один адрес нужно не меньше трёх дней: это два пина в неделю, партии хватит на шесть недель. Чтобы Pinterest заработал в полную силу, сайту нужны 4–6 отдельных страниц-статей.</div>
      </section>

      """
a = html.index('<section id="next-sec">'); b = html.index('</main>')
html = html[:a] + more + """<section id="next-sec">
        <h2>Что дальше</h2>
        <div class="two">
          <div class="box"><h3>Нужно от вас</h3><ol class="steps">
            <li>Послушать ролики и посмотреть посты, текстовую ленту и пины. Сказать, что править.</li>
            <li>Завести и подключить к Metricool четыре аккаунта: TikTok, YouTube, X, Pinterest. Сейчас подключены только Instagram, Facebook и Threads.</li>
            <li>Решить про голос в роликах и про подписку X Premium.</li>
            <li>Подтвердить два факта: радугу нарисовал ребёнок шести лет; история «7:02 → 7:41» про игру Камиллы. От них зависят посты №1 и №4 на всех площадках и пин 6.</li>
            <li>Для YouTube подтвердить отметку «не для детей»: ролики обращены к родителям.</li>
            <li>Выделить 20–30 минут в день на ответы в Threads и X.</li>
          </ol></div>
          <div class="box"><h3>Что сделаю после вашего ответа</h3><ol class="steps">
            <li>Внесу правки и пересоберу.</li>
            <li>Поставлю всё черновиками в Metricool по расписанию: видео с разносом по дням, тексты, пины раз в три дня.</li>
            <li>Вставлю голос в ролики, если решите записать.</li>
            <li>Если решите делать страницы-статьи для Pinterest, подготовлю их и новые пины к ним.</li>
          </ol></div>
        </div>
      </section>
    """ + html[b:]

html = html.replace('</style>', """.lanes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.pick{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-weight:600;font-size:14px}
.pick select{flex:1;min-width:0;max-width:440px;font:inherit;font-weight:600;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink)}
.pick select:focus-visible{outline:3px solid var(--coral);outline-offset:2px}
.ptext{white-space:pre-wrap;font:inherit;font-size:14px;margin:8px 0 0;overflow-wrap:anywhere}
.pset{font-size:12.5px;color:var(--muted);margin:10px 0 0;overflow-wrap:anywhere}
.box h3{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tablewrap{overflow-x:auto;margin-top:16px}
.tbl{border-collapse:collapse;width:100%;font-size:14px;min-width:520px}
.tbl th,.tbl td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}
.tbl thead th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.tbl tbody th{font-weight:600;white-space:nowrap}
.tpost{display:block}
.twhy{color:var(--muted);font-size:14.5px;margin:0 0 12px}
.msg{border:1px solid var(--line);border-radius:14px;padding:12px 14px;background:var(--bg);min-width:0}
.mh{display:flex;justify-content:space-between;gap:10px;align-items:baseline;font-size:12.5px;color:var(--muted)}
.mh b{font-family:var(--latin);font-weight:800;font-size:15px;color:var(--ink);letter-spacing:-.03em}
.msg pre,.reply pre{white-space:pre-wrap;font:inherit;font-size:14.5px;margin:8px 0 0;overflow-wrap:anywhere}
.reply{margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)}
.reply span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:var(--muted)}
.timg{display:flex;align-items:center;gap:10px;margin-top:12px;border:0;background:none;padding:0;cursor:zoom-in;color:var(--muted);font:inherit;font-size:13px}
.timg img{width:54px;height:68px;object-fit:cover;border-radius:8px;display:block}
.timg:focus-visible,.pinc button:focus-visible{outline:3px solid var(--coral);outline-offset:2px}
.pins{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px 14px}
.pinc{margin:0;min-width:0}
.pinc button{display:block;width:100%;border:0;padding:0;background:none;cursor:zoom-in;border-radius:14px;overflow:hidden}
.pinc img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover}
.pinc figcaption{display:flex;flex-direction:column;gap:2px;margin-top:8px;font-size:12.5px;color:var(--muted)}
.pinc figcaption b{font-family:var(--latin);font-weight:800;font-size:14px;letter-spacing:-.03em;color:var(--ink);line-height:1.2}
.pinc .chip{align-self:flex-start;margin-top:4px}
.cap pre b{font-family:var(--latin)}
@media (max-width:980px){.lanes{grid-template-columns:minmax(0,1fr)}}
</style>""", 1)

# the viewer of the four texts
viewer = """
const VID = """ + json.dumps(VID, ensure_ascii=False) + """;
const NETS = [['caption', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube Shorts'], ['facebook', 'Facebook']];
function vshow(n) {
  const v = VID.find((x) => x.n === +n);
  document.getElementById('vgrid').innerHTML = NETS.map(([k, name]) => {
    const d = v[k];
    if (!d) return `<div class="box"><h3>${name}</h3><p class="pset">Сюда этот пост не идёт: это карусель, а в Shorts только видео.</p></div>`;
    const set = k === 'tiktok' ? `Поисковая фраза: ${esc(d.phrase)}. ${d.kind.startsWith('photo') ? 'Фото-режим, слайды 9:16.' : 'Комментарии, Duet и Stitch включены.'}`
      : k === 'youtube' ? `Теги: ${esc(d.tags.replace(/^\\[|\\]$/g, ''))}. Категория Education. Made for kids: No.`
      : k === 'facebook' ? `Первый комментарий: ${esc(d.comment)}` : 'Ссылка в шапке профиля.';
    return `<div class="box"><h3>${name}${k === 'youtube' ? ` <span class="chip">заголовок ${d.title.length} зн.</span>` : ''}</h3>${k === 'youtube' ? `<p style="font-weight:700;margin:8px 0 0">${esc(d.title)}</p>` : ''}<pre class="ptext">${esc(d.text)}</pre><p class="pset">${set}</p></div>`;
  }).join('');
}
document.getElementById('vsel').addEventListener('change', (e) => vshow(e.target.value));
vshow(1);
"""
a = html.rindex('</script>')
html = html[:a] + viewer + html[a:]
x = 'Первые десять постов собраны: три карусели целиком и семь роликов. Слева профиль, справа каждый пост — ролик можно посмотреть, слайды пролистать, подпись прочитать. Нажмите на плитку, чтобы перейти к посту.'
assert x in html
html = html.replace(x, 'Слева Instagram, справа каждый из десяти постов: ролик можно посмотреть со звуком, слайды пролистать, подпись прочитать. Ниже остальные площадки: та же видеолента для TikTok, Facebook и YouTube Shorts, отдельная текстовая лента для Threads и X, и Pinterest.')
x = '<p class="eyebrow">@make_showlab · пересборка страницы</p>'
assert x in html
html = html.replace(x, '<p class="eyebrow">@make_showlab · Instagram и ещё шесть площадок</p>')
open(os.path.join(HERE, 'profile.html'), 'w').write(html)
# the phone alone, as a picture of how the profile will look (out/instagram-profile.png)
if subprocess.run(['node', os.path.join(HERE, 'shot.cjs')]).returncode:
    print('profile picture not retaken: shot.cjs failed (needs Playwright)')
print('posts', len(posts), 'files', len(os.listdir(P)), 'size', sum(os.path.getsize(os.path.join(P, f)) for f in os.listdir(P)) // 1024, 'KB')


# ============================================================ lists and the Instagram package
import zipfile
HLS = [('free-lesson', 'Free lesson', 'заставка, затем слайды поста №10 (вертикальные, из posts/10-free-first-lesson/tiktok/)'),
       ('how-it-works', 'How it works', 'заставка, затем ролик №6'), ('kid-made', 'Kid-made', 'заставка, затем ролики №7, №1 и №4'),
       ('is-it-safe', 'Is it safe?', 'заставка, затем слайды поста №3 (вертикальные, из posts/03-ai-house-rules/tiktok/)'),
       ('pricing', 'Pricing', 'заставка: обе цены стоят на ней'), ('about-us', 'About us', 'заставка, затем ролик №2 и отзывы из поста №9')]
ids = {int(os.path.basename(d)[:2]): os.path.basename(d) for d in glob.glob(os.path.join(REPO, '*'))}
WAIT = {1: 'ждёт подтверждения, что рисунок детский', 4: 'ждёт подтверждения истории «7:02 → 7:41»'}
L = ['# Instagram: все креативы первой партии', '',
     'Порядок публикации. Файлы лежат в `social/concept/posts/<папка>/`; тот же набор собран в архив `out/instagram-creatives.zip`.', '',
     '| № | День | Креатив | Формат | Рубрика | Закреп | Файлы | Статус |', '|---|---|---|---|---|---|---|---|']
for p in posts:
    files = f"`reel.mp4`, `cover.jpg`, `caption.md`" if p.get('video') else f"`slide-01…{len(p['slides']):02d}.jpg`, `caption.md`"
    kind = f"ролик, {p['dur']} с, со звуком" if p.get('video') else f"карусель, {len(p['slides'])} слайдов"
    L.append(f"| {p['n']} | {p['day']} | **{p['title']}** | {kind} | {p['r']} {p['no']} | {'да' if p.get('pin') else ''} | `{ids[p['n']]}/`: {files} | {WAIT.get(p['n'], 'собран')} |")
L += ['', '## Что внутри каждого', '']
for p in posts:
    L += [f"### {p['n']}. {p['title']}", f"Зачем: {p['why']} Перешлют: {p['send']}", ''] + [f"{i}. {x}" for i, x in enumerate(p['inside'], 1)] + ['']
L += ['## Закрепы', '', 'Три поста закрепляются наверху сетки: №10 (как начать), №2 (кто мы), №7 (лучшее доказательство).', '',
      '## Хайлайты', '', '| Хайлайт | Обложка | Заставка | Что внутри |', '|---|---|---|---|']
L += [f"| {t} | `out/highlight-{h}.jpg` | `out/story-{h}.jpg` | {w} |" for h, t, w in HLS]
L += ['', '## Шапка профиля', '', 'Имя: `Make Show Lab | AI for Kids`. Описание, ссылка и аватар: `PLAN.md`, раздел 4.', '']
open(os.path.join(C, 'INSTAGRAM.md'), 'w').write('\n'.join(L))

Mo = ['# Ролики с моушен-графикой', '',
      'Семь роликов первой партии. Все собраны как графика из фото и работ с сайта: 1080×1920, 30 кадров в секунду, музыка и звуковые эффекты внутри, голоса пока нет.',
      'Один и тот же файл идёт в Instagram, TikTok, Facebook и YouTube Shorts.', '',
      '| № | Ролик | Длина | Сцен | Из чего собран | Что усилит | Статус | Файл |', '|---|---|---|---|---|---|---|---|']
for p in posts:
    if not p.get('video'): continue
    Mo.append(f"| {p['n']} | **{p['title']}** | {p['dur']} с | {len(p['inside'])} | {p['src']} | {p['more'] or '—'} | {WAIT.get(p['n'], 'собран')} | `posts/{ids[p['n']]}/reel.mp4` |")
Mo += ['', '## Сцены по порядку', '']
for p in posts:
    if not p.get('video'): continue
    Mo += [f"### {p['n']}. {p['title']}", ''] + [f"{i}. {x}" for i, x in enumerate(p['inside'], 1)] + ['']
Mo += ['## Что общего у всех семи', '',
       '- Первая надпись на экране с первого кадра, не больше шести слов на карточку.',
       '- Монтаж переставлен под ритм музыки: главный кадр попадает на вход основной темы, логотип на последний аккорд.',
       '- Звук: одна музыкальная тема на серию и настоящие записи эффектов (бумага, хлопки, карандаш).',
       '- Финальный кадр: логотип, «First lesson free» и адрес сайта.',
       '- Тексты для озвучки с хронометражем: `sound/VOICEOVER.md`.', '']
open(os.path.join(C, 'MOTION.md'), 'w').write('\n'.join(Mo))

zp = os.path.join(C, 'out', 'instagram-creatives.zip')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_STORED) as z:
    z.write(os.path.join(C, 'INSTAGRAM.md'), 'instagram/00-list.md'); z.write(os.path.join(C, 'MOTION.md'), 'instagram/00-motion-reels.md')
    z.write(os.path.join(os.path.dirname(os.path.dirname(C)), 'social/brand/logo/avatar/avatar-1080.png'), 'instagram/profile/avatar-1080.png')
    z.write(os.path.join(C, 'out', 'instagram-profile.png'), 'instagram/profile/how-it-will-look.png')
    z.writestr('instagram/profile/profile.txt', "Name: Make Show Lab | AI for Kids\nCategory: Education\n\nBio:\nYour kid makes a cartoon, a game, a song with AI. You sit next to them.\nAges 6-14. No code. By mom Anna & Kamilla, 10.\nFree first lesson\n\nLink: https://www.makeshowlab.com/#free\n\nPinned posts: 10, 2, 7\nHighlights: Free lesson, How it works, Kid-made, Is it safe?, Pricing, About us\n")
    for h, t, w in HLS:
        z.write(os.path.join(C, 'out', f'highlight-{h}.jpg'), f'instagram/profile/highlights/{h}-cover.jpg'); z.write(os.path.join(C, 'out', f'story-{h}.jpg'), f'instagram/profile/highlights/{h}-story.jpg')
    for p in posts:
        d = os.path.join(REPO, ids[p['n']]); name = f"instagram/{p['n']:02d}-{'reel' if p.get('video') else 'carousel'}-{ids[p['n']][3:]}"
        for f in sorted(os.listdir(d)):
            if f in ('reel.mp4', 'cover.jpg') or f.startswith('slide-'): z.write(os.path.join(d, f), f'{name}/{f}')
        z.writestr(f'{name}/caption.txt', p['cap'] + '\n')
print('lists written; zip', os.path.getsize(zp) // (1024 * 1024), 'MB')
