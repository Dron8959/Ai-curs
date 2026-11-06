# Daily content routine · Make Show Lab

Эту инструкцию выполняет ежедневная рутина Claude. Её можно запустить и вручную: «выполни social/ROUTINE.md».
Цель: всегда держать **2 дня вперёд** заполненными (2 публикации в день) в Metricool.

## 0. Подготовка
1. `git fetch origin <branch> && git checkout <branch> && git pull` (ветка — `branch` из `social/config.json`).
2. Прочитать: `social/config.json`, `social/brand/brand-profile.md`, `voice.md`, `facts.md`,
   `content-pillars.md`, `calendar.md`, `social/01-competitors-and-hooks.md`, последние 30 строк `social/log.md`.
3. Посмотреть `social/media/` — новые фото и видео от Анны (файлы, которых нет в логе).

## 1. Какие слоты пустые
1. Metricool `getScheduledPosts` для `metricool_blog_id` на сегодня + `buffer_days` (таймзона из config).
2. Также проверить `social/log.md`: черновики (draft) не всегда видны как scheduled.
3. Для каждого дня в окне и каждого слота (A, B) из `calendar.md`: если публикации нет, его нужно заполнить.
   Если всё заполнено, сразу переходить к шагу 7.

## 2. Тема каждого поста
- Рубрика и формат берутся из недельной таблицы в `calendar.md`. Сезонный повод важнее обычной рубрики.
- Угол не должен повторять посты за последние 14 дней из `log.md`.
- Если в `social/media/` есть новое видео, ставим его в ближайший слот A как Reel.
- Слот B (Threads) развивает тему слота A того же дня другим углом: вопрос, история, совет.

## 3. Текст
Используем скиллы:
- обложка и первая строка: `social-media-skills:hook-writer` и хуки из `01-competitors-and-hooks.md`;
- карусель: `anthropic-skills:ig-carousel` / `social-media-skills:carousel-writer`;
- подпись: `anthropic-skills:ig-caption` / `social-media-skills:caption-writer`;
- Threads: `social-media-skills:threads-post` (до 500 символов, без хэштегов или 1 хэштег);
- финальная проверка каждого текста: `anthropic-skills:ig-human` (никаких длинных тире, слов из стоп-листа `voice.md`).

**Жёсткие правила:**
- Только факты из `facts.md`. Никаких выдуманных отзывов, цифр, учеников, времени («8:15 утра») и цитат,
  выданных за реальные. Примеры промптов помечаем «For example».
- Не больше одного поста P5 (продажа) в неделю.
- Английский язык, голос из `voice.md`.

## 4. Картинки
1. Папка `social/posts/<YYYY-MM-DD>-<slot>-<slug>/`.
2. `post.json` по схеме из `social/engine/README.md`. Карусель — 5–8 слайдов, одиночный пост — 1 слайд.
   Первый слайд: одна мысль, крупно, ≤ 10 слов. Последний: CTA (сохранить / ссылка в шапке).
3. `node social/engine/render.mjs social/posts/<папка>`.
4. Если в выводе есть `OVERFLOW`, сократить текст и перерендерить.
5. **Посмотреть каждый слайд** (Read на jpg): текст читается, ничего не обрезано, фото подходит к тексту.
6. `caption.md` с frontmatter (pillar, slot, networks, type, ai_generated) и текстом подписи.

## 5. Публикация
1. `git add social && git commit && git push origin <branch>`, затем `SHA=$(git rev-parse HEAD)`.
2. Ссылки на медиа: `<repo_raw_base>/<SHA>/social/posts/<папка>/slide-01.jpg` и т.д.
   Проверить, что первая ссылка открывается (`curl -sI` → 200), прежде чем отдавать её в Metricool.
3. Metricool `createScheduledPost`:
   - `blogId` из config, дата слота в `timezone` из config;
   - `draft: true`, если `mode` = `draft`; `draft: false, autoPublish: true`, если `mode` = `auto`;
   - Instagram: `instagramData.type` = `POST` (карусель — несколько media), `isAiGenerated` по frontmatter;
   - Facebook: `facebookData.type` = `POST`;
   - Threads: текст, медиа по желанию;
   - `mediaAltText`: короткое описание каждого слайда.
4. Если Metricool вернул ошибку, не повторять вслепую: записать в лог и в итоговое сообщение.

## 6. Лог
Дописать в `social/log.md` строку на каждый пост:
`| дата слота | слот | рубрика | формат | хук | папка | metricool: draft/scheduled/error |`
Закоммитить и запушить.

## 7. По понедельникам дополнительно
- 2 сценария рилсов для съёмки в `social/reels/<YYYY-MM-DD>-<slug>.md` через `anthropic-skills:ig-reel`
  (хук, текст на экране, раскадровка по секундам, что снимать телефоном). Видео снимают Анна и Камилла.
- Короткий отчёт за прошлую неделю: Metricool `getAnalyticsDataByMetrics` для Instagram
  (охват, сохранения, репосты по постам) → `social/reports/<YYYY-MM-DD>.md`. Какая рубрика сработала,
  что повторить. Цифры только из Metricool, ничего не додумывать.

## 8. Итог
Последнее сообщение сессии — коротко по-русски:
- что поставлено (дата, время, сеть, хук, ссылка `plannerUrl`);
- в каком режиме (черновик или автопубликация);
- что нужно от людей (например, «нужно снять рилс №2», «закончились фото для P2»).
