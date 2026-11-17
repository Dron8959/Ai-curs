# Слово в комментарии → ответ в личку

Как отвечаем на `GAME` и `RULES`, пока всё делается руками (решение владельца 13.11.2026), и как потом это
автоматизировать. Тексты на английском, для родителей в США, по `social/brand/voice.md`.

## Порядок, пока отвечаем сами
1. Два-три раза в день (утром, в обед, вечером, после каждого поста) открыть комментарии новых постов.
2. На каждый комментарий со словом: короткий ответ под комментарием (варианты ниже, чередовать, чтобы не было
   одинаково) и сообщение в личку.
3. Instagram разрешает написать в личку тому, кто оставил комментарий: в приложении под комментарием есть
   «Отправить личный ответ» (Send private reply). Самим первыми писать незнакомым нельзя.
4. Отвечать в тот же день. Чем быстрее ответ, тем выше шанс, что человек откроет урок.

## GAME → бесплатный первый урок
Ответ под комментарием (по очереди):
- Just sent it to your DMs.
- Check your DMs, it's there.
- Sent! Tell me what they build.

Сообщение в личку:
```
Hi! Here's your kid's free first lesson: makeshowlab.com

Leave your email there, no card needed. The lesson takes 10 to 20 minutes on a laptop or a tablet, and it ends with a game your kid builds. Then you play it against each other.

What do you think they'll make?
```

## RULES → памятка для холодильника
Картинка: `social/concept/out/rules-card.png` (собирает `node social/concept/review/rules-card.mjs`).

Ответ под комментарием (по очереди):
- Sent you the card in DMs.
- It's in your DMs. Fridge-ready.
- Just sent it. Print it or keep it on your phone.

Сообщение в личку (картинка и текст):
```
Hi! Here's the card with our 5 AI house rules. Print it for the fridge or keep it on your phone.

Every lesson in our course for kids is set up around these rules. The first lesson is free if you want to try one together: makeshowlab.com
```

## Остальные слова (решение владельца 17.11: у каждого поста своё слово)
Все слова, кроме `RULES`, ведут на бесплатный первый урок. Ответ под комментарием тот же, что для `GAME`.
В личке первая строка по теме поста, дальше общий текст:

```
<первая строка по слову>

Leave your email at makeshowlab.com, no card needed. The first lesson is free, takes 10 to 20 minutes on a laptop or a tablet, and ends with a game your kid builds.
```

| Слово | Посты | Первая строка |
|---|---|---|
| `LESSON` | 11, 18, 22 | Hi! Here's your kid's free first lesson. |
| `CARTOON` | 13, 15, 23, 29, 32-36 | Hi! Cartoons come later in the course. You start with the free first lesson, and it's a game. |
| `STICKERS` | 21 | Hi! Stickers are one of the projects in the course. You start with the free first lesson. |
| `SONG` | 27 | Hi! Songs are one of the projects in the course. You start with the free first lesson. |
| `GIFT` | 17 | Hi! A gift made by your kid starts with the free first lesson. |
| `PRICE` | 30 | Hi! The full course is $197, paid once. With Anna checking homework the same day, it's $297. You can try the first lesson free. |

Слово в правиле всегда главная просьба поста: подпись начинается с него, и оно же на обложке справа внизу.

## Потом: автоматический ответ
| Вариант | Что умеет | Цена | Что сделать |
|---|---|---|---|
| Meta Business Suite (Comment-to-Message) | слово в комментарии → готовое сообщение в личку; обычно одно слово на одну автоматизацию, только с компьютера | бесплатно | проверить в Business Suite → Inbox → Automations, есть ли эта функция у аккаунта |
| ManyChat | несколько слов, ответ под комментарием и в личку, сбор контактов | бесплатный план с марта 2026 всего 25 контактов в месяц, платные от ~$14 в месяц (по обзорам, проверить на сайте) | подключить Instagram к ManyChat, создать сценарий «Comment → DM» для каждого слова, вставить тексты отсюда |

Настройка любого варианта занимает около часа: подключение делает владелец (это его аккаунт и оплата),
тексты и сценарий готовы здесь.

## Рассылка
В Instagram нельзя разослать сообщение всем подписчикам: писать можно только тем, кто сам написал или оставил
комментарий, и только в течение нескольких дней после этого. Настоящая рассылка у нас уже есть: почта, которую
родитель оставляет на сайте ради бесплатного урока. Поэтому каждое слово в комментарии ведёт на сайт, где человек
оставляет почту.
