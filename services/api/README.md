# API-модули

## Структура

```text
services/api/
├── authApi.js           # Аутентификация и авторизация
├── autogoodsApi.js      # Автотовары
├── carsApi.js           # Автомобили и справочники
├── filtersApi.js        # Сохранённые фильтры
├── listingsApi.js       # Объявления и списки объявлений
├── locationApi.js       # Регионы и города
├── messagesApi.js       # Чаты и сообщения
├── miscApi.js           # SEO, документы, избранное и прочее
├── motoApi.js           # Мототехника
├── notificationsApi.js  # Уведомления
├── reportsApi.js        # Отчёты
├── reviewsApi.js        # Отзывы
├── supportApi.js        # Техподдержка
└── usersApi.js          # Пользователи
```

## Использование

Обычно функции импортируются через агрегатор:

```js
import { getCarById, createCarAd, getUser } from '@/services/apiClient'
```

Если нужен прямой импорт:

```js
import { getCarById } from '@/services/api/carsApi'
import { createCarAd } from '@/services/api/listingsApi'
```

## Общие правила

- Общие обёртки запросов находятся в `services/apiUtils.js`.
- Для новых модулей используйте `executeApiRequest()`, а не ручной `try/catch` в каждом методе.
- Ошибки должны быть читаемыми и пригодными для UI.
- Если модуль работает с несколькими shape ответов, нормализацию лучше держать рядом с API-модулем, а не размазывать по компонентам.
