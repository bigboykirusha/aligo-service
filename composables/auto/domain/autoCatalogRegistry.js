const AUTO_BASE_NODE = Object.freeze({
   key: 'auto-catalog',
   slug: 'auto',
   title: 'Автомобили',
   description: 'Каталог автомобилей с фильтрами по параметрам авто и продавца.',
   filterPresetKey: 'auto.catalog',
   filterSummary: [
      'Состояние, таможенное оформление, состояние автомобиля',
      'Марка → Модель → Поколение',
      'Цена, год выпуска, пробег, объём двигателя, мощность',
      'Тип кузова, двигатель, привод, коробка, цвет'
   ],
   children: []
})

export const resolveAutoConditionBySlugSegments = (segments = []) => {
   const list = Array.isArray(segments)
      ? segments.map((item) => String(item || '').toLowerCase())
      : []

   if (list.includes('type-new') || list.includes('new')) {
      return { id: '1', slug: 'new' }
   }
   if (list.includes('type-used') || list.includes('used')) {
      return { id: '2', slug: 'used' }
   }

   return { id: null, slug: null }
}

export const buildAutoCatalogNode = ({ conditionId = null } = {}) => ({
   ...AUTO_BASE_NODE,
   pathKey: `auto:${conditionId || 'all'}`
})
