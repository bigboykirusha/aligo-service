import {
   AUTO_UNKNOWN_VALUE,
   buildCarContactProps,
   getAdsParameter,
   getCarDescription,
   getCarEquipmentLabels,
   getCarCityId,
   getMaskedVin,
   getPrimaryAppearance,
   getPrimaryHistoryCondition,
   getPrimarySpec
} from '../auto/adViewModel'

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeText = (value, fallback = AUTO_UNKNOWN_VALUE) => {
   const normalized = typeof value === 'string' ? value.trim() : ''
   return normalized || fallback
}

const normalizeScalarText = (value, fallback = AUTO_UNKNOWN_VALUE) => {
   if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
   }
   return normalizeText(value, fallback)
}

const toNumber = (value, fallback = 0) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : fallback
}

const toNullableNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const formatNumber = (value, suffix = '') => {
   const normalized = Number(value)
   if (!Number.isFinite(normalized) || normalized < 0) return AUTO_UNKNOWN_VALUE
   return suffix ? `${normalized} ${suffix}` : String(normalized)
}

const AUTOGOODS_FIELD_LABELS = Object.freeze({
   count: 'Количество',
   season: 'Сезонность',
   width: 'Ширина',
   height: 'Высота',
   diameter: 'Диаметр',
   axle: 'Ось',
   run_flat: 'Run Flat',
   staggered_set: 'Разноширокий комплект',
   width_rear: 'Ширина задней оси',
   height_rear: 'Высота задней оси',
   diameter_rear: 'Диаметр задней оси',
   rear_width: 'Ширина задней оси',
   rear_height: 'Высота задней оси',
   rear_diameter: 'Диаметр задней оси',
   load_index: 'Индекс нагрузки',
   speed_index: 'Индекс скорости',
   tread_depth: 'Остаток протектора',
   bulge_count: 'Количество шин с грыжами',
   side_repair_count: 'Количество шин с боковым ремонтом',
   viscosity_sae: 'Класс вязкости SAE',
   volume: 'Объём',
   standart_acea: 'Стандарт ACEA',
   standart_api: 'Стандарт API',
   allow_oem: 'Допуски OEM',
   rim_diameter: 'Диаметр диска',
   disk_diameter: 'Диаметр диска',
   rim_width: 'Ширина обода',
   hole_count: 'Количество отверстий',
   hole_diameter: 'Диаметр расположения отверстий / PCD',
   type_disk: 'Тип диска',
   dia: 'Диаметр центрального отверстия / DIA',
   et_offset: 'Вылет / ET',
   repair: 'Был ли ремонт',
   straighten_count: 'Сколько дисков выпрямили',
   brew_count: 'Сколько дисков варили',
   crack_count: 'Сколько дисков с трещинами',
   change_geometry_count: 'Сколько дисков с изменением геометрии',
   coloring_type: 'Тип окраски',
   central_cap: 'Центральные колпачки',
   pressure_sensor: 'Датчики давления'
})

export const getAdMainCategoryId = (ad = null) =>
   toNumber(ad?.main_category_id ?? ad?.main_category?.id, 0)

export const getAdOwnerId = (ad = null) =>
   toNumber(ad?.id_user_owner_ads ?? ad?.user_id ?? ad?.user?.id, 0)

export const getAdCityId = (ad = null) => {
   const cityId = getAdsParameter(ad)?.city?.id
   const normalized = Number(cityId)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : null
}

export const getAdTitleParts = (ad = null) => {
   const mainCategoryId = getAdMainCategoryId(ad)

   if (mainCategoryId === 1) {
      const spec = getPrimarySpec(ad)
      return {
         brand: normalizeText(spec?.brand?.title, ''),
         model: normalizeText(spec?.model?.title, ''),
         year: normalizeScalarText(spec?.year_release?.title, ''),
         type: '',
         categoryLabel: ''
      }
   }

   if (mainCategoryId === 2) {
      return {
         brand: normalizeText(ad?.production?.brand?.title, ''),
         model: normalizeText(ad?.production?.model?.title, ''),
         year: normalizeScalarText(ad?.year?.title ?? ad?.year, ''),
         type: normalizeText(ad?.production?.type?.title, ''),
         categoryLabel: ''
      }
   }

   return {
      brand: normalizeText(ad?.entity?.brand?.title, ''),
      model: normalizeText(ad?.entity?.model?.title, ''),
      year: normalizeScalarText(ad?.entity?.year?.title ?? ad?.entity?.year, ''),
      type: '',
      categoryLabel: ''
   }
}

export const buildAdDisplayTitle = (ad = null) => {
   const { brand, model, year, type } = getAdTitleParts(ad)
   const parts = [brand, model].filter(Boolean)

   if (type && !parts.includes(type)) {
      parts.push(type)
   }

   const brandModel = parts.join(' ')

   if (brandModel && year) return `${brandModel}, ${year}`
   if (brandModel) return brandModel
   if (year) return year
   return 'Объявление'
}

export const buildAdContactProps = (ad = null) => {
   if (getAdMainCategoryId(ad) === 1) return buildCarContactProps(ad)

   const adsParameter = getAdsParameter(ad)
   const { brand, model, year } = getAdTitleParts(ad)

   return {
      id: toNumber(ad?.id, 0),
      idUserOwnerAds: getAdOwnerId(ad),
      mainCategoryId: toNullableNumber(ad?.main_category_id ?? ad?.main_category?.id),
      brand,
      model,
      year,
      amount: toNumber(adsParameter.amount, 0),
      username: normalizeText(
         adsParameter.username || adsParameter.login || ad?.user?.username || ad?.user?.login,
         'Имя не указано'
      ),
      place: normalizeText(adsParameter.place_inspection),
      isInFavorites: toNumber(ad?.is_in_favorites, 0),
      latitude: toNullableNumber(adsParameter.latitude),
      longitude: toNullableNumber(adsParameter.longitude),
      photos: Array.isArray(ad?.photos) ? ad.photos : []
   }
}

const buildAutoCharacteristics = (ad = null) => {
   const spec = getPrimarySpec(ad)
   const history = getPrimaryHistoryCondition(ad)
   const appearance = getPrimaryAppearance(ad)

   return [
      ['Год выпуска', spec?.year_release?.title || AUTO_UNKNOWN_VALUE],
      ['Пробег', formatNumber(history?.mileage, 'км')],
      ['Владельцев по ПТС', history?.count_owners?.title || AUTO_UNKNOWN_VALUE],
      ['Состояние', history?.state?.title || AUTO_UNKNOWN_VALUE],
      ['Тип двигателя', spec?.engine_type?.title || AUTO_UNKNOWN_VALUE],
      ['Коробка передач', spec?.transmission?.title || AUTO_UNKNOWN_VALUE],
      ['Привод', spec?.drive?.title || AUTO_UNKNOWN_VALUE],
      ['Тип кузова', spec?.car_body_type?.title || AUTO_UNKNOWN_VALUE],
      ['Цвет', appearance?.color?.title || AUTO_UNKNOWN_VALUE],
      ['Руль', spec?.handlebar?.title || AUTO_UNKNOWN_VALUE],
      ['VIN или номер кузова', getMaskedVin(ad)]
   ]
}

const buildMotoCharacteristics = (ad = null) => {
   const motorcycleFields = isRecord(ad?.fields_only_for_motorcycle)
      ? ad.fields_only_for_motorcycle
      : {}

   return [
      ['Год выпуска', ad?.year?.title || AUTO_UNKNOWN_VALUE],
      ['Пробег', formatNumber(ad?.mileage, 'км')],
      ['Владельцев по ПТС', ad?.count_owners?.title || AUTO_UNKNOWN_VALUE],
      ['Состояние', ad?.condition?.title || AUTO_UNKNOWN_VALUE],
      ['Тип двигателя', ad?.engine_type?.title || AUTO_UNKNOWN_VALUE],
      ['Подача топлива', ad?.fuel_feed?.title || AUTO_UNKNOWN_VALUE],
      ['Число тактов', ad?.stroke?.title || AUTO_UNKNOWN_VALUE],
      ['Коробка передач', ad?.transmission?.title || AUTO_UNKNOWN_VALUE],
      ['Объем двигателя', formatNumber(ad?.engine_capacity, 'см3')],
      ['Мощность', formatNumber(ad?.power_range, 'л.с.')],
      ['Наличие', ad?.availability?.title || AUTO_UNKNOWN_VALUE],
      ['ПТС', ad?.pts?.title || ad?.technical_passport?.title || AUTO_UNKNOWN_VALUE],
      ['VIN или номер рамы', normalizeText(ad?.vin)]
   ].concat(
      motorcycleFields?.drive_type?.title
         ? [['Тип привода', motorcycleFields.drive_type.title]]
         : [],
      motorcycleFields?.cylinder?.title
         ? [['Количество цилиндров', motorcycleFields.cylinder.title]]
         : [],
      motorcycleFields?.number_gear?.title
         ? [['Количество передач', motorcycleFields.number_gear.title]]
         : [],
      motorcycleFields?.cylinder_position?.title
         ? [['Расположение цилиндров', motorcycleFields.cylinder_position.title]]
         : [],
      motorcycleFields?.engine_cooling?.title
         ? [['Охлаждение', motorcycleFields.engine_cooling.title]]
         : []
   )
}

const buildAutogoodsCharacteristics = (ad = null) => {
   const entity = isRecord(ad?.entity) ? ad.entity : {}
   const baseItems = [
      ['Бренд', entity?.brand?.title || AUTO_UNKNOWN_VALUE],
      ['Модель', entity?.model?.title || AUTO_UNKNOWN_VALUE],
      ['Год', normalizeScalarText(entity?.year?.title ?? entity?.year)],
      ['Состояние', entity?.condition?.title || ad?.condition?.title || ad?.condition_name || AUTO_UNKNOWN_VALUE],
      ['Категория', ad?.last_category?.title || AUTO_UNKNOWN_VALUE],
      ['Артикул', entity?.article?.title || ad?.article || AUTO_UNKNOWN_VALUE]
   ]

   const skipKeys = new Set([
      'brand',
      'model',
      'year',
      'condition',
      'article',
      'condition_detail'
   ])

   const entityItems = Object.entries(entity)
      .filter(([key, value]) => !skipKeys.has(key) && isRecord(value))
      .map(([key, value]) => {
         const title = normalizeScalarText(value?.title, '')
         if (!title) return null

         const label =
            AUTOGOODS_FIELD_LABELS[key] ||
            key
               .replace(/_/g, ' ')
               .replace(/\b\w/g, (char) => char.toUpperCase())

         return [label, title]
      })
      .filter(Boolean)

   const detailItems = Array.isArray(entity?.condition_detail)
      ? entity.condition_detail
           .map((item) => {
              const label = normalizeText(item?.key_string, '').replace(/:\s*$/, '')
              const value = normalizeScalarText(item?.title_string, '')
              if (!label || !value) return null
              return [label, value]
           })
           .filter(Boolean)
      : []

   return [...baseItems, ...entityItems, ...detailItems]
}

export const getAdCharacteristics = (ad = null) => {
   const mainCategoryId = getAdMainCategoryId(ad)
   const items =
      mainCategoryId === 1
         ? buildAutoCharacteristics(ad)
         : mainCategoryId === 2
            ? buildMotoCharacteristics(ad)
            : buildAutogoodsCharacteristics(ad)

   return items
      .filter((item) => Array.isArray(item) && item[0])
      .map(([label, value]) => ({
         label,
         value: value || AUTO_UNKNOWN_VALUE
      }))
}

export const getAdDescription = (ad = null) => {
   if (getAdMainCategoryId(ad) === 1) {
      return getCarDescription(ad, AUTO_UNKNOWN_VALUE)
   }

   const description = getAdsParameter(ad)?.ads_description
   if (typeof description !== 'string') return AUTO_UNKNOWN_VALUE

   const normalized = description
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim()

   return normalized || AUTO_UNKNOWN_VALUE
}

export const getAdEquipmentLabels = (ad = null) => {
   if (getAdMainCategoryId(ad) === 1) return getCarEquipmentLabels(ad)

   const options = isRecord(ad?.additional_options) ? ad.additional_options : {}
   const labels = []

   if (options.is_electric_starter) labels.push('Электростартер')
   if (options.is_abs) labels.push('ABS')
   if (options.is_tcs) labels.push('TCS')
   if (options.is_start_stop_system) labels.push('Start-Stop')
   if (options.is_windscreen) labels.push('Ветровое стекло')
   if (options.is_trunk) labels.push('Багажник')

   return labels
}

export const buildAdSpecProps = (ad = null) => {
   const mainCategoryId = getAdMainCategoryId(ad)
   if (mainCategoryId !== 1 && mainCategoryId !== 2) return null

   if (mainCategoryId === 1) {
      const spec = getPrimarySpec(ad)
      const registration = Array.isArray(ad?.auto_registration_data)
         ? ad.auto_registration_data[0]
         : {}

      return {
         id: toNumber(ad?.id, 0),
         mainCategoryId,
         brand: spec?.brand?.title || AUTO_UNKNOWN_VALUE,
         model: spec?.model?.title || AUTO_UNKNOWN_VALUE,
         year: spec?.year_release?.title || AUTO_UNKNOWN_VALUE,
         shortReport: ad?.short_report || {},
         vin: registration?.vin || ''
      }
   }

   return {
      id: toNumber(ad?.id, 0),
      mainCategoryId,
      brand: ad?.production?.brand?.title || AUTO_UNKNOWN_VALUE,
      model: ad?.production?.model?.title || AUTO_UNKNOWN_VALUE,
      year: ad?.year?.title || AUTO_UNKNOWN_VALUE,
      shortReport: ad?.short_report || {},
      vin: normalizeText(ad?.vin, '')
   }
}

export const buildSeoTitle = (ad = null) => {
   const adsParameter = getAdsParameter(ad)
   const title = buildAdDisplayTitle(ad)
   const amount = Number(adsParameter.amount)

   if (Number.isFinite(amount) && amount > 0) {
      return `${title || 'Объявление'} - ${new Intl.NumberFormat('ru-RU').format(amount)} ₽`
   }

   return title || 'Объявление'
}

export const buildSeoDescription = (ad = null) => {
   const description = getAdDescription(ad)
   if (description && description !== AUTO_UNKNOWN_VALUE) return description

   const characteristics = getAdCharacteristics(ad)
      .slice(0, 3)
      .map((item) => `${item.label}: ${item.value}`)
      .join('. ')

   return characteristics || 'Объявление на Aligo'
}

export const getListingCityId = (ad = null) => {
   if (getAdMainCategoryId(ad) === 1) return getCarCityId(ad)
   return getAdCityId(ad)
}
