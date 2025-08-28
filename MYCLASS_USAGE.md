# Использование myclass в CustomTableItem

## Описание

Компонент `CustomTableItem.vue` теперь поддерживает массив классов `myclass` для динамического применения CSS классов к элементам таблицы с условной логикой.

## Как использовать

### 1. В store (например, seoAdsTable.js)

#### Условная логика для поля Active:
```javascript
Active: {
  value: firstItem?.Active ? 'да' : 'нет',
  type: 'text',
  akcent: firstItem?.Active,
  // Условная логика: если Active = true, то класс 'active', иначе 'of'
  myclass: firstItem?.Active ? ['active'] : ['of'],
  contenteditable: false,
},
```

#### Условная логика для поля Noindex:
```javascript
Noindex: {
  value: firstItem?.NoIndex ? 'есть' : 'нет',
  type: 'text',
  // Условная логика: если NoIndex = true, то класс 'noindex-status', иначе 'noindex-clear'
  myclass: firstItem?.NoIndex ? ['noindex-status'] : ['noindex-clear'],
  contenteditable: false,
},
```

### 2. Поддерживаемые типы данных

- `myclass` должен быть массивом строк
- Каждая строка представляет CSS класс
- Классы применяются как к внешнему элементу, так и к внутреннему блоку
- **Новое**: Поддерживается условная логика для динамического выбора классов

### 3. Примеры классов

#### Для активных элементов (Active = true):
```javascript
myclass: ['active']
```

#### Для неактивных элементов (Active = false):
```javascript
myclass: ['of']
```

#### Для элементов с noindex (NoIndex = true):
```javascript
myclass: ['noindex-status']
```

#### Для элементов без noindex (NoIndex = false):
```javascript
myclass: ['noindex-clear']
```

#### Комбинирование классов:
```javascript
myclass: ['active', 'highlight', 'custom-style']
```

### 4. Условная логика

Теперь `myclass` может содержать условную логику:

```javascript
// Простая условная логика
myclass: condition ? ['class1'] : ['class2']

// Примеры:
myclass: firstItem?.Active ? ['active'] : ['of']
myclass: item?.NoIndex ? ['noindex-status'] : ['noindex-clear']
myclass: item?.status === 'pending' ? ['pending'] : ['completed']
```

## CSS стили

Классы автоматически получают стили из `CustomTable.scss`:

```scss
.table-box__item {
  &.active {
    background-color: #e8f5e8;
    border-left: 3px solid #4caf50;
  }
  
  &.of {
    background-color: #fff3e0;
    border-left: 3px solid #ff9800;
  }
  
  &.noindex-status {
    background-color: #fce4ec;
    border-left: 3px solid #e91e63;
  }
  
  &.noindex-clear {
    background-color: #e8f5e8;
    border-left: 3px solid #4caf50;
  }
}
```

## Преимущества

1. **Гибкость**: Можно комбинировать любые CSS классы
2. **Динамичность**: Классы применяются на основе данных
3. **Условная логика**: Автоматический выбор классов в зависимости от состояния
4. **Переиспользование**: Один компонент для разных стилей
5. **Читаемость**: Код становится более понятным

## Ограничения

- `myclass` должен быть массивом
- Классы применяются только к элементам таблицы
- CSS классы должны быть определены в стилях
- Условная логика должна возвращать массив
