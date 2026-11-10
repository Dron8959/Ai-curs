# Логотип: черновик v1 (не применён к постам и роликам)

Оригинальный персонаж: девочка-астронавт в стиле логотипа makeshowlab (тёмная обводка, жёлтое
кольцо, мятные наушники как у робота, полоски на костюме, звёзды). Ни с кого не скопирована.

| Файл | Что это |
|---|---|
| `girl-icon.svg` | Исходник в векторе, масштабируется без потерь |
| `girl-icon.png` | Иконка 1024×1024, прозрачный фон |
| `lockup.png` | Иконка + надпись makeshowlab (для шапок слайдов, сайта) |
| `avatar-1080.png` | Аватар для Instagram, Facebook, Threads |

После утверждения: заменить `logoSrc()` в `social/engine/kit.mjs` и пересобрать посты и ролики.

## Промпт для объёмной (3D) версии — Gemini / Google Flow
Для роликов, где нужен персонаж «как в мультфильме», а не плоский значок:

> 3D animated-film style portrait of an original cartoon girl, about 9 years old, auburn hair in a
> high side ponytail with a small coral hair tie, a yellow star hair clip, short side bangs,
> big friendly green eyes, light freckles across the nose, rosy cheeks, warm closed-mouth smile.
> She wears a white and orange space suit with an open round collar, a mint-green chest panel
> with thin coral stripes, and mint-green round headphones over her ears. Deep navy space
> background with an orange planet glow at the bottom. Soft cinematic rim light, head and
> shoulders, centered, 1:1. Original character, not based on any existing film character.

Анимация (Flow / Veo, из этой картинки, 5 секунд): «She slowly looks to the side, then back to the
camera and smiles, hair gently moving, subtle light flicker on the suit, camera static.»
