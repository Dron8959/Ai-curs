// The pack for the next week on Instagram (Thu 19 to Wed 25 Nov 2026): 21 posts, 3 a day. Rules: social/concept/SERIES.md.
// Worked in five stages with the owner (16 Nov): 1 topics, 2 pictures, 3 assembly, 4 approval, 5 production and Metricool.
// This file is stage 1: topics only. Hooks and asks are post text (English); angle and note are for the owner (Russian).
// It replaces the earlier plan for posts 11-21 (batch2.mjs): those eleven are all in here, plus ten more.

export const STAGES = [
  ['Темы', 'утверждены 16.11: 21 тема, порядок, действия'],
  ['Картинки', 'сейчас: главная картинка каждого поста (обложка и первый кадр)'],
  ['Сборка', 'ролики, карусели, подписи, голос; черновики на этой странице'],
  ['Утверждение', 'вы смотрите каждый пост в телефоне на странице'],
  ['Выпуск', 'ставлю всё в Metricool на неделю'],
];
export const STAGE = 1;

export const SLOTS = ['08:00', '12:30', '19:30'];
export const DAYS = ['Thu 19 Nov', 'Fri 20 Nov', 'Sat 21 Nov', 'Sun 22 Nov', 'Mon 23 Nov', 'Tue 24 Nov', 'Wed 25 Nov'];

// ask: [kind, text]; kind = keyword (GAME or RULES in comments, answered by hand: DM.md), save, send
export const WEEK2 = [
  // Thu 19
  { n: 11, day: 0, slot: 0, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'Why does AI draw six fingers?',
    angle: 'Рисует лицо как фото и не может сосчитать до пяти. Учился на фото, где руки спрятаны.', ask: ['send', 'Send this to the kid who asks you everything.'], note: 'Общее знание.' },
  { n: 12, day: 0, slot: 1, series: 'How it works', rubric: 'make', format: 'Carousel', hook: 'How much AI at 6, 10 and 14?',
    angle: 'Чем младше ребёнок, тем меньше он трогает клавиатуру. Шпаргалка по возрастам.', ask: ['save', 'Save this for the first lesson.'], note: 'facts.md, возраст.' },
  { n: 13, day: 0, slot: 2, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'A 10-year-old made this cartoon. How?',
    angle: 'Она не нарисовала ни одного кадра: рассказала историю, проверила сцены, переделала. Около 20 минут, 2-3 попытки.', ask: ['send', 'Send this to someone who thinks kids just watch cartoons.'], note: 'Цифры от владельца 13.11. Мультфильм Камиллы есть.' },
  // Fri 20
  { n: 14, day: 1, slot: 0, series: 'Safe AI', rubric: 'lab', format: 'Reel', hook: '5 safe ways to give your kid AI',
    angle: 'Самая безопасная схема та, где ребёнок нигде не регистрируется сам.', ask: ['keyword', 'Comment RULES and I\'ll send you the fridge card.'], note: 'facts.md, безопасность. Памятка готова.' },
  { n: 15, day: 1, slot: 1, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'How does AI draw from words?',
    angle: 'Начинает не с белого листа, а с телевизионного «снега», и убирает шум шаг за шагом.', ask: ['keyword', 'Comment GAME and I\'ll send you the free first lesson.'], note: 'Общее знание (диффузия), без названий моделей.' },
  { n: 16, day: 1, slot: 2, series: 'Free lesson', rubric: 'start', format: 'Reel', hook: 'Tonight: a game your kid made',
    angle: 'Это быстрее ужина: почта без карты, 10-20 минут, потом играете друг против друга.', ask: ['keyword', 'Comment GAME and I\'ll send you the link.'], note: 'facts.md, бесплатный урок. Пятница вечером, впереди выходные.' },
  // Sat 21
  { n: 17, day: 2, slot: 0, series: 'Made by a kid', rubric: 'show', format: 'Carousel', hook: 'What 4 grandmothers made with their grandkids',
    angle: 'Никто из них ничего не знал про ИИ. Мультфильм, песня, подарок, игра. Сезон подарков.', ask: ['send', 'Send this to your mom before the holidays.'], note: 'Цитаты дословно, с пометкой, что курс бесплатно.' },
  { n: 18, day: 2, slot: 1, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'Why does AI sound so sure when it\'s wrong?',
    angle: 'Он не ищет ответ, он угадывает следующее слово. Вероятное и верное не одно и то же.', ask: ['send', 'Send this to the parent whose kid uses ChatGPT for homework.'], note: 'Общее знание. Мостик к шагу «проверь».' },
  { n: 19, day: 2, slot: 2, series: 'How it works', rubric: 'make', format: 'Reel', hook: 'Your kid is 6. Can they do this?',
    angle: 'Читать и печатать не нужно: ребёнок говорит, вы печатаете. Идея его.', ask: ['keyword', 'Comment GAME and I\'ll send you the free first lesson.'], note: 'facts.md, возраст.' },
  // Sun 22
  { n: 20, day: 3, slot: 0, series: 'Safe AI', rubric: 'lab', format: 'Carousel', hook: 'Is this picture real? 4 checks',
    angle: 'Фейк легче всего поймать в скучных местах: руки, буквы, тени, края.', ask: ['save', 'Save this for the next picture that looks too perfect.'], note: 'В курсе есть урок про фейки. Приметы общие.' },
  { n: 21, day: 3, slot: 1, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'Her own character, as stickers',
    angle: 'Камилла придумала персонажа, и теперь он живёт в семейном чате.', ask: ['send', 'Send this to the family group chat.'], note: 'Стикерпак Камиллы есть (step-show.jpg).' },
  { n: 22, day: 3, slot: 2, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'Is AI alive? It talks like a friend.',
    angle: 'Говорит как человек, потому что учился на текстах людей. Не ест, не спит, не скучает.', ask: ['send', 'Ask your kid, then send this to them.'], note: 'Общее знание. Вопрос, который задают дети.' },
  // Mon 23
  { n: 23, day: 4, slot: 0, series: 'Free lesson', rubric: 'start', format: 'Reel', hook: 'A cartoon for grandma, before Thursday',
    angle: 'В четверг День благодарения. Мультфильм из рисунка ребёнка как подарок бабушке.', ask: ['keyword', 'Comment GAME and I\'ll send you the free first lesson.'], note: 'Сезон (26.11). Подарок из PLAN.md. Что сделать в первом уроке, проверить: первый урок про игру, не мультфильм.' },
  { n: 24, day: 4, slot: 1, series: 'Safe AI', rubric: 'lab', format: 'Carousel', hook: 'What your kid should never tell an AI',
    angle: 'Чатбот дружелюбный, в этом и проблема. Имя со школой, адрес, пароли, фото лица.', ask: ['keyword', 'Comment RULES and I\'ll send you the fridge card.'], note: 'Урок «что не сообщать ИИ» есть (facts.md). Список общий.' },
  { n: 25, day: 4, slot: 2, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'Same question, two answers. Why?',
    angle: 'ИИ выбирает слова с долей случайности, поэтому каждый раз отвечает по-другому. Проверяйте вместе.', ask: ['save', 'Save this and try it tonight with your kid.'], note: 'Общее знание.' },
  // Tue 24
  { n: 26, day: 5, slot: 0, series: 'How it works', rubric: 'make', format: 'Reel', hook: 'Do I need to know AI first?',
    angle: 'Нет. Всё с нуля для вас обоих, ноутбук или планшет, ничего не ставить.', ask: ['keyword', 'Comment GAME and I\'ll send you the free first lesson.'], note: 'facts.md, «О курсе».' },
  { n: 27, day: 5, slot: 1, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'A song from her own words',
    angle: 'Ребёнок пишет слова, ИИ делает музыку, бабушка слушает в тот же вечер. Голос семей из отзывов.', ask: ['send', 'Send this to grandma.'], note: 'Песни есть в отзывах (Susan, Jessica), цитаты дословно. Своей записи песни у нас нет: делаем карточки с цитатой.' },
  { n: 28, day: 5, slot: 2, series: 'Safe AI', rubric: 'lab', format: 'Reel', hook: 'Is that Kamilla, or her AI version?',
    angle: 'Если урок ведёт ИИ-версия Камиллы, это всегда сказано. Ребёнок должен знать, с кем говорит.', ask: ['save', 'Save this: one rule for every app.'], note: 'facts.md: ИИ-аватар всегда помечен.' },
  // Wed 25
  { n: 29, day: 6, slot: 0, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'How does a crayon drawing become a cartoon?',
    angle: 'ИИ берёт рисунок как основу и дорисовывает поверх, а не придумывает заново. Поэтому грузовик остался.', ask: ['send', 'Send this to the parent whose fridge is covered in drawings.'], note: 'Общее знание. Продолжение поста №1, тот же рисунок.' },
  { n: 30, day: 6, slot: 1, series: 'How it works', rubric: 'make', format: 'Carousel', hook: 'What the course costs, and what you get',
    angle: '$197 один раз или $297 с проверкой домашки Аней в тот же день. Без подписки и звонков.', ask: ['save', 'Save this for when you decide.'], note: 'facts.md, цены. Возврат за 30 дней не обещаем.' },
  { n: 31, day: 6, slot: 2, series: 'Free lesson', rubric: 'start', format: 'Reel', hook: 'Worst case: 20 minutes on the couch',
    angle: 'Если не подойдёт, вы потеряли 20 минут. Канун праздника, вечер с ребёнком.', ask: ['keyword', 'Comment GAME and I\'ll send you the link.'], note: 'facts.md, фраза с сайта.' },
];

export const DONE2 = [
  'Темы и порядок утверждены (16.11).',
  'Пост 23 «мультфильм для бабушки к четвергу» остаётся, призыв GAME.',
  'Пост 30: цены показываем в ленте.',
];

export const QUESTIONS = [
  'Картинки: ок целиком или правки по номерам (что поменять в кадре, цвет, текст на обложке).',
  'Пост 19: у нас нет фото шестилетнего ребёнка. На картинке рисованная девочка и фото шага Make с лендинга. Так оставить или Аня пришлёт кадр из урока?',
  'Пост 11: рука с шестью пальцами нарисована нами, не сгенерирована ИИ. Оставить рисованную или сделать настоящую картинку ИИ с лишним пальцем (так нагляднее, но это генерация)?',
];
