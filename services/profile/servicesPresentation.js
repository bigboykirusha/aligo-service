import { mapMyPublicationCardProps } from './profileCardMappers'

export const PROFILE_SERVICE_TABS = Object.freeze([
   { id: 'promotion', label: 'Продвижение' },
   { id: 'decor', label: 'Оформление' },
   { id: 'banner', label: 'Баннерная реклама' }
])

const formatAdPrice = (value) => {
   const normalized = Number(value)
   if (!Number.isFinite(normalized) || normalized <= 0) {
      return '—'
   }

   return normalized.toLocaleString('ru-RU')
}

const normalizeText = (value) =>
   String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()

const toArray = (value) => {
   if (Array.isArray(value)) return value
   if (value === null || value === undefined || value === '') return []
   return [value]
}

const toPositiveNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : null
}

const SERVICE_CATEGORY_BY_FLAGS = Object.freeze([
   ['is_banner_advertising', 'banner'],
   ['is_decoration', 'decor'],
   ['is_vip', 'decor'],
   ['is_badge', 'decor'],
   ['is_frame_color', 'decor']
])

const SERVICE_META_LABELS = Object.freeze([
   ['is_exclusive', 'Эксклюзив'],
   ['is_first_place', 'Первое место'],
   ['is_second_place', 'Второе место'],
   ['is_third_place', 'Третье место'],
   ['is_up', 'Поднятие'],
   ['is_vip', 'VIP'],
   ['is_badge', 'Бейдж'],
   ['is_frame_color', 'Рамка'],
   ['is_banner_advertising', 'Баннер']
])

const COLOR_NAME_BY_KEY = Object.freeze({
   green: 'Зелёный',
   violet: 'Фиолетовый',
   raspberry: 'Малиновый',
   blue: 'Синий',
   yellow: 'Жёлтый',
   dark_blue: 'Тёмно-синий',
   light_blue: 'Голубой',
   raspberry_violet: 'Малиново-фиолетовый',
   raspberry_blue: 'Малиново-синий',
   green_blue: 'Зелёно-синий',
   raspberry_red: 'Малиново-красный'
})

const normalizeChoicePreview = (value) => {
   if (typeof value === 'string') {
      const normalized = normalizeText(value)
      return normalized || null
   }

   if (value && typeof value === 'object') {
      const from = normalizeText(value.from ?? value.start ?? value.color_from)
      const to = normalizeText(value.to ?? value.end ?? value.color_to)

      if (from && to) {
         return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
      }

      const single = normalizeText(
         value.color ?? value.code ?? value.value ?? value.hex
      )
      return single || null
   }

   return null
}

const translateColorName = (value) => {
   const normalized = normalizeText(value)
   if (!normalized) return ''

   return COLOR_NAME_BY_KEY[normalized.toLowerCase()] || normalized
}

const buildPaidServiceColorOptions = (item = {}) => {
   const values = toArray(item?.color).map((value) => normalizeText(value))
   const previews = toArray(item?.color_code)
   const length = Math.max(values.length, previews.length)

   if (length <= 1) return []

   return Array.from({ length })
      .map((_, index) => {
         const value = values[index] || `variant_${index + 1}`
         const label = translateColorName(value) || `Вариант ${index + 1}`
         const preview = normalizeChoicePreview(previews[index])

         return {
            label,
            value,
            preview
         }
      })
      .filter((option) => option.label)
}

const buildGroupedBadgeOptions = (items = []) =>
   items
      .map((item, index) => {
         const label = normalizeText(item?.subtitle) || `Вариант ${index + 1}`

         return {
            label,
            value: String(Number(item?.id) || index + 1),
            paidServiceId: Number(item?.id) || 0,
            title: normalizeText(item?.title) || 'Услуга',
            subtitle: label,
            cost: Number(item?.cost ?? item?.price ?? 0) || 0
         }
      })
      .filter((option) => option.paidServiceId > 0)

const mergeColorOptions = (items = []) => {
   const uniqueOptions = new Map()

   for (const item of items) {
      for (const option of item?.colorOptions || []) {
         if (!option?.value || uniqueOptions.has(option.value)) continue
         uniqueOptions.set(option.value, option)
      }
   }

   return Array.from(uniqueOptions.values())
}

const normalizeServiceTitleKey = (value) => normalizeText(value).toLowerCase()

const groupDecorBadgeServices = (items = []) => {
   const groupedServices = new Map()
   const standaloneServices = []

   for (const item of items) {
      if (!item?.flags?.isBadge) {
         standaloneServices.push(item)
         continue
      }

      const key = normalizeServiceTitleKey(item.title)
      if (!groupedServices.has(key)) {
         groupedServices.set(key, [])
      }

      groupedServices.get(key).push(item)
   }

   const mergedBadgeServices = Array.from(groupedServices.values())
      .map((group) => {
         if (!group.length) return null

         if (group.length === 1) {
            return {
               ...group[0],
               choiceOptions: [],
               choiceLabel: '',
               colorChoiceLabel: group[0].colorOptions.length ? 'Цвет' : ''
            }
         }

         const [firstItem] = group
         const colorOptions = mergeColorOptions(group)
         const choiceOptions = buildGroupedBadgeOptions(group)

         return {
            ...firstItem,
            subtitle: '',
            choiceOptions,
            colorOptions,
            choiceLabel: 'Вид бейджа',
            colorChoiceLabel: colorOptions.length ? 'Цвет' : '',
            hasChoices: choiceOptions.length > 0 || colorOptions.length > 0
         }
      })
      .filter(Boolean)

   return [...mergedBadgeServices, ...standaloneServices].sort(
      (left, right) => left.id - right.id
   )
}

export const resolvePaidServiceCategory = (item = {}) => {
   for (const [flag, category] of SERVICE_CATEGORY_BY_FLAGS) {
      if (Number(item?.[flag]) === 1) {
         return category
      }
   }

   return 'promotion'
}

export const resolvePaidServiceMetaLabel = (item = {}) => {
   const subtitle = normalizeText(item?.subtitle)
   if (subtitle) return subtitle

   for (const [flag, label] of SERVICE_META_LABELS) {
      if (Number(item?.[flag]) === 1) {
         return label
      }
   }

   return ''
}

export const mapPaidServiceItem = (item = {}) => {
   const id = Number(item?.id) || 0
   if (id <= 0) return null

   const title = normalizeText(item?.title) || 'Услуга'
   const description = normalizeText(item?.description)
   const metaLabel = resolvePaidServiceMetaLabel(item)
   const category = resolvePaidServiceCategory(item)
   const period = toPositiveNumber(item?.period)
   const cost = Number(item?.cost ?? item?.price ?? 0) || 0
   const dateFrom = normalizeText(item?.date_from)
   const dateBefore = normalizeText(item?.date_before)
   const colorOptions = buildPaidServiceColorOptions(item)
   const colorValues = toArray(item?.color)
      .map((value) => normalizeText(value))
      .filter(Boolean)

   return {
      id,
      category,
      title,
      subtitle: metaLabel,
      description,
      cost,
      priceLabel: formatAdPrice(cost),
      period,
      periodLabel: period ? `${period} дней` : '',
      dateFrom,
      dateBefore,
      dateRangeLabel: dateFrom && dateBefore ? `${dateFrom} — ${dateBefore}` : '',
      color: colorValues[0] || '',
      colorValues,
      colorCode: normalizeChoicePreview(item?.color_code),
      colorCodes: toArray(item?.color_code),
      choiceOptions: [],
      choiceLabel: '',
      colorOptions,
      colorChoiceLabel: colorOptions.length ? 'Цвет' : '',
      hasChoices: colorOptions.length > 0,
      flags: {
         isExclusive: Number(item?.is_exclusive) === 1,
         isFirstPlace: Number(item?.is_first_place) === 1,
         isSecondPlace: Number(item?.is_second_place) === 1,
         isThirdPlace: Number(item?.is_third_place) === 1,
         isUp: Number(item?.is_up) === 1,
         isVip: Number(item?.is_vip) === 1,
         isBadge: Number(item?.is_badge) === 1,
         isFrameColor: Number(item?.is_frame_color) === 1,
         isPromotion: Number(item?.is_promotion) === 1,
         isDecoration: Number(item?.is_decoration) === 1,
         isBannerAdvertising: Number(item?.is_banner_advertising) === 1
      }
   }
}

export const mapPaidServiceItems = (items = [], { category = '' } = {}) => {
   const filteredItems = (Array.isArray(items) ? items : [])
      .map(mapPaidServiceItem)
      .filter(Boolean)
      .filter((item) => !category || item.category === category)

   return category === 'decor'
      ? groupDecorBadgeServices(filteredItems)
      : filteredItems
}

export const mapProfileServiceAdOption = (item) => {
   const ad = mapMyPublicationCardProps(item)

   return {
      id: Number(ad.id) || 0,
      mainCategoryId: ad.mainCategoryId ?? null,
      image:
         ad.images?.[0]?.arr_title_size?.preview ||
         ad.images?.[0]?.arr_title_size?.middle ||
         '',
      title: ad.displayTitle || 'Без названия',
      price: formatAdPrice(ad.price)
   }
}

export const mapProfileServiceAdOptions = (items = []) =>
   (Array.isArray(items) ? items : [])
      .map(mapProfileServiceAdOption)
      .filter((ad) => ad.id > 0)
