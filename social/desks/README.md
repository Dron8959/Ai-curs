# Отдел соцсетей: как всё устроено

Один отдел, семь рабочих мест. У каждой площадки свой диалог в Claude Code («Соцсети · <площадка>»),
свой файл в этой папке и своя зона в репозитории. Общий диалог («Соцсети, аналитика конкурентов и
автоматизация») отвечает за то, что касается всех: стиль, шаблоны, звук, расписание, страницу-превью.

## Диалоги отдела в Claude Code
| Отдел | Диалог |
|---|---|
| Общий: стиль, шаблоны, звук, расписание, страница-превью | https://claude.ai/code/session_01DtGyjPrLYBdfsoFsnT7baz |
| Instagram | https://claude.ai/code/session_01DtGyjSqHdVpz2CXmqnfjKT |
| TikTok | https://claude.ai/code/session_01DtGyjPnB1RSRVySoguS2Fc |
| Facebook | https://claude.ai/code/session_01DtGyjR1qZgrp95kBXuysqE |
| YouTube Shorts | https://claude.ai/code/session_01DtGyjRGpiXcMMkWajbRbts |
| Threads | https://claude.ai/code/session_01DtGyjTNHw2H24ziPzUQof3 |
| X | https://claude.ai/code/session_01DtGyjQj5kufnsN2cUjGMaJ |
| Pinterest | https://claude.ai/code/session_01DtGyjPj8iBxY3GMZhcrbkr |

Все диалоги названы «Соцсети · <площадка>» и помечены меткой «соцсети». Тот же отдел в чатах claude.ai:
`social/desks/CHATS.md`.

## Три ленты
| Лента | Площадки | Откуда контент |
|---|---|---|
| Видео | Instagram, TikTok, Facebook, YouTube Shorts | одни и те же 10 постов (`social/concept/posts/`), подпись у каждой площадки своя |
| Текст | Threads, X | отдельные посты (`social/concept/text/`), у каждой идеи два варианта |
| Поиск | Pinterest | пины (`social/concept/pins/`) |

Планы: `social/concept/PLAN.md` (Instagram и общее), `social/concept/PLATFORMS.md` (остальные площадки).
Страница-превью со всем сразу: https://claude.ai/artifact/AfXN1eaajoGcu8cAXYoaAy

## Кто за что отвечает
| Файл | Чей |
|---|---|
| `social/concept/content.mjs`, `reels.mjs` (посты и ролики видеоленты) | Instagram: он ведёт видеоленту |
| `social/concept/platforms.mjs`: блок `tiktok` / `youtube` / `facebook` каждого поста | TikTok / YouTube Shorts / Facebook |
| `social/concept/text.mjs`: поле `x` / поле `threads` каждого поста | X / Threads; идею поста (id, зачем, картинка) меняют вдвоём |
| `social/concept/pins.mjs` | Pinterest |
| `social/concept/kit.mjs`, `render.mjs`, `extras.mjs`, `sound/`, `social/brand/` | общий диалог; отделы меняют их только с согласия владельца |
| `social/desks/<площадка>.md` | свой отдел: держит его в актуальном виде |

Чужую зону не правим. Если нужна правка в чужой зоне, скажи владельцу, в какой отдел с ней идти.

## Общий порядок работы
1. `git pull --rebase origin claude/pensive-allen-86govc`.
2. Прочитать свой файл отдела и нужный план.
3. Сделать работу в своей зоне. Пересобрать: команды в файле отдела. Сборка сама проверяет лимиты и
   правила площадки и останавливается, если что-то нарушено.
4. Показать владельцу результат. Публикация и постановка в Metricool только после его «ок».
5. Обновить свой файл отдела (что готово, что ждёт), закоммитить, `git push`.

## Страница-превью
Одна страница показывает всё сразу. Пересобрать после изменений:
`python3 social/concept/preview/make_page.py`, затем опубликовать `social/concept/preview/profile.html`
инструментом Artifact на тот же адрес (параметр `url`), вместе с изменившимися файлами из `p/`.
Обычно это делает общий диалог: скажи владельцу, что страницу пора обновить.

## Чего не может ни один отдел
- Заводить аккаунты и подключать их к Metricool: это делает владелец. Сейчас подключены Instagram, Facebook, Threads.
- Менять аватар, шапку и описание профиля: вручную в приложениях. Тексты и картинки готовы в `PLATFORMS.md`, раздел 5.
- Отвечать на комментарии и реплики: это человек. Отдел может написать варианты ответов.
- Слышать звук и проверять поисковые фразы в самих площадках.

## Открытые вопросы на весь отдел
- Два факта ждут подтверждения владельца: радугу нарисовал ребёнок шести лет (пост №1, пин 6);
  история «7:02 → 7:41» про игру Камиллы (пост №4). До ответа эти материалы не публикуются.
- Голос в роликах. Есть одна проба: ролик №5 с голосом Ани, сгенерированным по её записи
  (`social/concept/out/voice-sample-05.mp4`, в репозиторий не попадает). Владелец и Аня слушают и выбирают:
  так для роликов Ани (№1, 4, 5, 8), живая запись или без голоса. Голос Камиллы не клонируем: свои реплики
  (№2, 6, 7) она записывает сама. До решения ничего больше не озвучиваем. Записи голоса в git не кладём.
  Подробности: `social/concept/sound/VOICEOVER.md`.
