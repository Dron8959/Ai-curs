# Make Show Lab · система контента для соцсетей

```
бренд-основа  →  ежедневная рутина Claude  →  картинки в стиле лендинга  →  Metricool  →  Instagram · Facebook · Threads
(social/brand)   (social/ROUTINE.md)          (social/engine/render.mjs)     (черновик или автопубликация)
```

## Что где лежит
| Файл | Зачем |
|------|-------|
| `01-competitors-and-hooks.md` | Конкуренты, наши отличия, форматы и хуки |
| `brand/brand-profile.md` | Кто мы, для кого, позиционирование, что не делаем, визуальный бренд |
| `brand/voice.md` | Как пишем: тон, правила, стоп-слова |
| `brand/facts.md` | Единственный список фактов, которые можно утверждать |
| `brand/content-pillars.md` | 5 рубрик и их доли |
| `brand/calendar.md` | Недельный ритм, слоты, сезонные поводы, рилсы |
| `brand/logo/` | Утверждённый логотип: аватар, плашка для роликов, логотип для финала, исходники |
| `concept/` | Пересборка соцсетей в новом стиле. Instagram: `PLAN.md` и первые 10 постов со звуком. Остальные площадки: `PLATFORMS.md` (та же видеолента для TikTok, Facebook и YouTube Shorts, текстовая лента для Threads и X, пины для Pinterest). На утверждении, к рутине пока не подключено |
| `config.json` | Режим (`draft` / `auto`), время слотов, ID бренда в Metricool |
| `ROUTINE.md` | Пошаговая инструкция, по которой рутина каждый день делает посты |
| `engine/` | Генератор слайдов (HTML → JPG через Playwright) |
| `posts/` | Готовые посты: `post.json`, `caption.md`, слайды |
| `media/` | Сюда Анна кладёт новые фото и видео |
| `reels/` | Сценарии рилсов на неделю |
| `reports/` | Еженедельные отчёты по аналитике |
| `log.md` | Что и когда поставлено |

## Как управлять
- **Поменять тон, факты, рубрики** — правим файлы в `brand/`. Рутина читает их каждый раз.
- **Включить автопубликацию** — `"mode": "auto"` в `config.json`.
- **Добавить фото или видео** — положить в `media/` (или прислать в чат), рутина возьмёт сама.
- **Сделать пост вне плана** — написать Claude: «сделай пост про … по social/ROUTINE.md».

## Скиллы по этапам
| Этап | Скиллы |
|------|--------|
| Стратегия | `social-media-skills:social-strategy`, `goals-and-kpis`, `competitor-analysis`, `audience-research`, `marketing:campaign-plan` |
| Бренд | `social-media-skills:brand-profile`, `voice-builder`, `content-pillars`, `design-and-templates`, `marketing:brand-review` |
| Профили | `anthropic-skills:ig-profile`, `social-media-skills:profile-optimization`, `link-in-bio-and-traffic` |
| План | `social-media-skills:content-calendar`, `batch-content-plan`, `seasonal-and-moment-marketing`, `anthropic-skills:ig-plan` |
| Тексты | `social-media-skills:hook-writer`, `caption-writer`, `carousel-writer`, `threads-post`, `anthropic-skills:ig-caption`, `ig-carousel`, `ig-human` |
| Видео | `anthropic-skills:ig-reel`, `social-media-skills:reels-script`, `short-form-video-script`, `talking-head-and-piece-to-camera`, `capcut`, `youtube-shorts`, `tiktok-script` |
| Доверие | `social-media-skills:social-proof-and-testimonials`, `before-after-and-transformation`, `behind-the-scenes-and-founder` |
| Площадки | `social-media-skills:instagram-growth`, `instagram-seo`, `facebook-strategy`, `facebook-groups`, `threads-growth`, `pinterest-growth`, `tiktok-growth` |
| Сообщество | `anthropic-skills:ig-reply`, `ig-comment`, `ig-dm`, `ig-story`, `social-media-skills:community-management`, `engagement-routine` |
| Воронка | `social-media-skills:lead-magnets-and-funnels`, `email-and-newsletter`, `marketing:email-sequence` |
| Аналитика | `anthropic-skills:ig-audit`, `social-media-skills:analytics-and-reporting`, `content-audit`, `experimentation-and-ab-testing`, `marketing:performance-report` |
| Публикация | Metricool (подключён) |

## Аналитика и конкуренты
- `analytics.md` — стартовые цифры (10.11.2026) и как устроен еженедельный отчёт.
- `competitors.md` — конкуренты в Metricool с точными Instagram-хэндлами.
- `reports/` — срезы по конкурентам и еженедельные отчёты.
