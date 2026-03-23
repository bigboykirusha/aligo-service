# Структура create-composables

- `useCreateAdPageModel.js` — page-level orchestration для `/create`: lifecycle формы, гидрация черновика, навигация, publish/save.
- `useCreateAdWizardModel.js` — логика мастера и подготовка к публикации.
- `useCreate*ParametersModel.js` — flow-specific модели параметров, которые используются прямо в формах.
- `parts/` — общие helpers для автотоваров: сброс полей, predicates, загрузка опций, brand/model.
- `shared/` — общие create-утилиты, не привязанные к одному домену.

## Правила

- Page orchestration не дублировать внутри form model.
- Синхронизацию route/query держать в `store/createStore/routeHelpers.js`.
- Если несколько parameter model повторяют одну и ту же загрузку опций, выносить это в `shared/`, а не копировать ещё один локальный helper.
- Если helper нужен только для автотоваров, лучше размещать его в `parts/`, а не в `shared/`.

## Что переиспользовать

- `parts/brandModelOptions.js` — нормализация brand/model опций.
- `parts/useCreatePartsFieldSync.js` — синхронизация boolean/reset поведения в parts-формах.
- `shared/staticOptionsLoader.js` — безопасная загрузка mostly-static select options с кэшем и fallback.
