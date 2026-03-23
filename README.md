# Aligo

Фронтенд доски объявлений на Nuxt с разделами автомобилей, мототехники, автотоваров, профиля, чатов и отчётов.

## Сборка

```bash
# Production
npm run build:prod
npm run start:prod

# Development
npm run build:dev
npm run start:dev

# DevLocal
npm run build:devlocal
npm run start:devlocal
```

## Переменные окружения

Используются файлы `.env.development`, `.env.production`, `.env.devlocal`.

Основные переменные:

- `API_BASE_URL` — базовый URL API.
- `API_TOKEN` — токен API.
- `YANDEX_API_KEY` — ключ Yandex API.

## Проверки качества

```bash
# Локально перед коммитом
npm run check

# Отдельные шаги
npm run lint
npm run typecheck
npm test -- --run
```

CI в `.github/workflows/ci.yml` запускает те же проверки и дополнительно сборку:

```bash
npm run build:dev
```

## Ключевая структура проекта

- `pages/` — маршруты и страницы Nuxt.
- `components/` — UI-компоненты и блоки страниц.
- `composables/` — переиспользуемая логика.
- `store/` — Pinia-сторы, включая create/edit/save слой.
- `services/` — API-клиенты и утилиты.
- `tests/` — unit тесты.
