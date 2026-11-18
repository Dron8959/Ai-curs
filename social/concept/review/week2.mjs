// The pack for the next week on Instagram (Thu 19 to Wed 25 Nov 2026): 21 posts, 3 a day. Rules: social/concept/SERIES.md.
// Worked in five stages with the owner (16 Nov): 1 topics, 2 pictures, 3 assembly, 4 approval, 5 production and Metricool.
// This file is stage 1: topics only. Hooks and asks are post text (English); angle and note are for the owner (Russian).
// It replaces the earlier plan for posts 11-21 (batch2.mjs): those eleven are all in here, plus ten more.

export const STAGES = [
  ['Темы', 'утверждены 16.11: 21 тема, порядок, действия'],
  ['Картинки', 'утверждены 16.11; рука в №11 перерисована реалистичнее'],
  ['Сборка', 'сейчас: тексты готовы (подписи, голос, слайды), дальше ролики и карусели'],
  ['Утверждение', 'вы смотрите каждый пост в телефоне на странице'],
  ['Выпуск', 'ставлю всё в Metricool на неделю'],
];
export const STAGE = 2;

export const SLOTS = ['08:00', '12:30', '19:30'];
// Owner, 17 Nov: the profile grid stays about the first ten posts; every reel goes out as an Instagram Trial Reel
// (shown to non-followers only, not in the grid or the followers' feed until shared). Carousels cannot be trial.
// 18 Nov: Instagram refused trial reels (the account has too few followers). Owner: regular reels, in the grid.
export const TRIAL = () => false;
// Owner, 17 Nov: every post carries one word to comment, by topic; each word gets a DM by hand (social/concept/DM.md).
export const KW = { 11: 'LESSON', 12: 'LESSON', 13: 'CARTOON', 14: 'RULES', 15: 'CARTOON', 16: 'GAME', 17: 'GIFT', 18: 'LESSON', 19: 'GAME', 20: 'RULES',
  21: 'STICKERS', 22: 'LESSON', 23: 'CARTOON', 24: 'RULES', 25: 'LESSON', 26: 'GAME', 27: 'SONG', 28: 'RULES', 29: 'CARTOON', 30: 'PRICE', 31: 'GAME',
  32: 'CARTOON', 33: 'CARTOON', 34: 'CARTOON', 35: 'CARTOON', 36: 'CARTOON' };
export const DAYS = ['Thu 19 Nov', 'Fri 20 Nov', 'Sat 21 Nov', 'Sun 22 Nov', 'Mon 23 Nov', 'Tue 24 Nov', 'Wed 25 Nov'];

// ask: [kind, text]; kind = keyword (GAME or RULES in comments, answered by hand: DM.md), save, send
export const WEEK2 = [
  // Thu 19
  { n: 33, day: 0, slot: 0, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'Paris, drawn by AI. Directed by a kid.',
    angle: 'Вместо №11 (он вышел 17.11 пробным роликом). Кадры Парижа из мультфильма Камиллы: ИИ рисует, режиссёр она.', ask: ['keyword', 'Comment "CARTOON" and I\'ll send you the free first lesson.'], note: 'Серия по мультфильму.' },
  { n: 32, day: 0, slot: 1, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'A cat with a croissant? Her idea.',
    angle: 'Вместо слабого №12 (списки по возрастам). Кадр мультфильма Камиллы, её голос: идея её, ИИ рисует, она правит сцены.', ask: ['keyword', 'Comment CARTOON and I\'ll send you the free first lesson.'], note: 'Серия по мультфильму (17.11). Факты: Камилле 10, персонажи и история её.' },
  { n: 13, day: 0, slot: 2, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'A 10-year-old made this cartoon. How?',
    angle: 'Она не нарисовала ни одного кадра: рассказала историю, проверила сцены, переделала. Около 20 минут, 2-3 попытки.', ask: ['send', 'Send this to someone who thinks kids just watch cartoons.'], note: 'Цифры от владельца 13.11. Мультфильм Камиллы есть.' },
  // Fri 20
  { n: 14, day: 1, slot: 0, series: 'Safe AI', rubric: 'lab', format: 'Reel', hook: 'Your kid asks for ChatGPT. Say yes, with one rule.',
    angle: 'Было списком «5 способов». Теперь одна сцена: ребёнок просит ChatGPT, вы отвечаете одним правилом (аккаунт ваш). Остальные четыре в памятке.', ask: ['keyword', 'Comment RULES and I\'ll send you the fridge card.'], note: 'facts.md, безопасность. Памятка готова.' },
  { n: 15, day: 1, slot: 1, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'How does AI draw from words?',
    angle: 'Начинает не с белого листа, а с телевизионного «снега», и убирает шум шаг за шагом.', ask: ['keyword', 'Comment CARTOON and I\'ll send you the free first lesson.'], note: 'Общее знание (диффузия), без названий моделей.' },
  { n: 16, day: 1, slot: 2, series: 'Free lesson', rubric: 'start', format: 'Reel', hook: 'Tonight: a game your kid made',
    angle: 'Это быстрее ужина: почта без карты, 10-20 минут, потом играете друг против друга.', ask: ['keyword', 'Comment GAME and I\'ll send you the link.'], note: 'facts.md, бесплатный урок. Пятница вечером, впереди выходные.' },
  // Sat 21
  { n: 17, day: 2, slot: 0, series: 'Made by a kid', rubric: 'show', format: 'Carousel', hook: 'What 4 grandmothers made with their grandkids',
    angle: 'Никто из них ничего не знал про ИИ. Мультфильм, песня, подарок, игра. Сезон подарков.', ask: ['send', 'Send this to your mom before the holidays.'], note: 'Цитаты дословно, с пометкой, что курс бесплатно.' },
  { n: 35, day: 2, slot: 1, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: '2-3 tries a scene. About 20 minutes.',
    angle: 'Вместо №18 (вышел 17.11). Как Камилла переделывала сцены: 2-3 попытки на сцену, около 20 минут.', ask: ['keyword', 'Comment "CARTOON" and I\'ll send you the free first lesson.'], note: 'Цифры от владельца 13.11.' },
  { n: 19, day: 2, slot: 2, series: 'How it works', rubric: 'make', format: 'Reel', hook: 'Your kid is 6. Can they do this?',
    angle: 'Читать и печатать не нужно: ребёнок говорит, вы печатаете. Идея его.', ask: ['keyword', 'Comment GAME and I\'ll send you the free first lesson.'], note: 'facts.md, возраст.' },
  // Sun 22
  { n: 20, day: 3, slot: 0, series: 'Safe AI', rubric: 'lab', format: 'Carousel', hook: '“Mom, is this real?”',
    angle: 'Было списком «4 проверки». Теперь одна сцена: ребёнок показывает картинку, вы смотрите на руки, потом на буквы.', ask: ['save', 'Save this for the next “is this real?”'], note: 'В курсе есть урок про фейки. Приметы общие.' },
  { n: 21, day: 3, slot: 1, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'Her own character, as stickers',
    angle: 'Камилла придумала персонажа, и теперь он живёт в семейном чате.', ask: ['send', 'Send this to the family group chat.'], note: 'Стикерпак Камиллы есть (step-show.jpg).' },
  { n: 22, day: 3, slot: 2, series: 'Ask AI', rubric: 'lab', format: 'Reel', hook: 'Is AI alive? It talks like a friend.',
    angle: 'Говорит как человек, потому что учился на текстах людей. Не ест, не спит, не скучает.', ask: ['send', 'Ask your kid, then send this to them.'], note: 'Общее знание. Вопрос, который задают дети.' },
  // Mon 23
  { n: 23, day: 4, slot: 0, series: 'Free lesson', rubric: 'start', format: 'Reel', hook: 'A cartoon for grandma this Thanksgiving',
    angle: 'В четверг День благодарения. Мультфильм из рисунка ребёнка как подарок бабушке.', ask: ['keyword', 'Comment CARTOON and I\'ll send you the free first lesson.'], note: 'Сезон (26.11). Подарок из PLAN.md. Что сделать в первом уроке, проверить: первый урок про игру, не мультфильм.' },
  { n: 24, day: 4, slot: 1, series: 'Safe AI', rubric: 'lab', format: 'Carousel', hook: 'Your kid told a chatbot their school.',
    angle: 'Было списком. Теперь одна сцена: ребёнок пишет чатботу название школы, как другу. Почему это важно и список вместе.', ask: ['keyword', 'Comment RULES and I\'ll send you the fridge card.'], note: 'Урок «что не сообщать ИИ» есть (facts.md). Список общий.' },
  { n: 34, day: 4, slot: 2, series: 'Made by a kid', rubric: 'show', format: 'Reel', hook: 'Every character? Made up by a kid.',
    angle: 'Вместо слабого №25. Все персонажи придуманы Камиллой; в конце вопрос ребёнку: кто был бы в твоём мультфильме?', ask: ['keyword', 'Comment CARTOON and I\'ll send you the free first lesson.'], note: 'Серия по мультфильму (17.11).' },
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
  'Картинки утверждены (16.11). Пост 11: рука перерисована ближе к настоящей.',
  'Продающие посты: №26 и №30 говорят цены, в №31 одна строка с ценой. Итого 3 из 21.',
  'Пост 19: остаётся рисованная девочка и фото шага Make.',
  'Пробные ролики (Trial Reels) Instagram не принял 17.11: у аккаунта мало подписчиков. Решение 18.11: все ролики идут обычными Reels в сетку.',
  'Пробных роликов 3-5 в день, не больше (17.11): лимит Instagram неофициальный, перебор грозит блокировкой пробных.',
  'Слабые №12 и №25 заменены роликами по мультфильму №32 и №34 (17.11). №33, 35, 36 в запасе на следующую неделю.',
  '№11 и №18 вышли 17.11 пробными роликами на всех площадках; в паке их места заняли №33 и №35 из серии по мультфильму. В запасе остаётся №36.',
  'Владелец 17.11: предварительное «ок» на выпуск всего пака. Пост 17 переписан (бабушки вместе с внуками), в посте 30 по пунктам, что входит в каждый тариф.',
  'Посты-списки №14, 20, 24 переписаны в «одну историю»: одна сцена с ребёнком вместо перечня (17.11).',
];

export const QUESTIONS = [
  'Серия по мультфильму: в этой неделе два (32, 34) плюс №13. Сколько таких ставить в следующие недели? В запасе 33, 35, 36.',
  'Слово в комментарии на каждом посте: LESSON, GAME, CARTOON, RULES, STICKERS, SONG, GIFT, PRICE. Все, кроме RULES, отвечаем ссылкой на бесплатный урок и строкой по теме.',
  'Карусели (17, 20, 24, 30) пробными быть не могут. Оставить их в сетке (тогда в ней будет 10 + 4 = 14) или пересобрать в короткие ролики-слайдшоу и тоже пустить пробными (сетка остаётся 10)?',
  'Тексты всех 21 поста готовы (откройте «Texts» в карточке). Можно поправить сейчас, до озвучки; если правок нет, я собираю ролики и карусели, и вы утверждаете всё целиком на этапе 4.',
  'Пост 23: обещать «до четверга» рискованно (мультфильм в курсе идёт не в первом уроке), поэтому в обложке и голосе теперь «this Thanksgiving».',
];

// Owner, 17 Nov: many more posts like 13, on frames of Kamilla's cartoon with a line about AI and cartoons. Proposed, not in the week yet.
export const EXTRA = [
  { n: 36, hook: 'What would your kid\'s cartoon be about?' },
];
