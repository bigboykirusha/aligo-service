const UNKNOWN_VALUE = 'Не указано'
const UNKNOWN_USERNAME = 'Имя не указано'
const DEFAULT_REPORT_PRICE = 85

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const firstFromArray = (value) =>
   Array.isArray(value) && value.length > 0 && isRecord(value[0]) ? value[0] : {}

const normalizeText = (value, fallback = UNKNOWN_VALUE) => {
   const normalized = typeof value === 'string' ? value.trim() : ''
   return normalized || fallback
}

const normalizeNumber = (value, fallback = 0) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : fallback
}

const normalizeNullableNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const toPositiveNumberOrNull = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : null
}

const readFlag = (objectValue, key) => Boolean(objectValue?.[key])

const appendEquipment = (target, source, definitions) => {
   if (!Array.isArray(target) || !isRecord(source) || !Array.isArray(definitions)) {
      return
   }

   for (const [flagKey, label] of definitions) {
      if (readFlag(source, flagKey)) target.push(label)
   }
}

export const getPrimarySpec = (ad = null) =>
   firstFromArray(ad?.auto_technical_specifications)

export const getPrimaryHistoryCondition = (ad = null) =>
   firstFromArray(ad?.auto_history_conditions)

export const getPrimaryAppearance = (ad = null) =>
   firstFromArray(ad?.auto_appearances)

export const getRegistrationData = (ad = null) =>
   firstFromArray(ad?.auto_registration_data)

export const getAdsParameter = (ad = null) =>
   isRecord(ad?.ads_parameter) ? ad.ads_parameter : {}

export const getCarCityId = (ad = null) => {
   const cityId = getAdsParameter(ad)?.city?.id
   return toPositiveNumberOrNull(cityId)
}

export const getCarDescription = (ad = null, fallback = UNKNOWN_VALUE) => {
   const source = getAdsParameter(ad)?.ads_description
   if (typeof source !== 'string') return fallback

   const normalized = source
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim()

   return normalized || fallback
}

export const getMaskedVin = (ad = null) => {
   const vinRaw = getRegistrationData(ad)?.vin
   const vin = typeof vinRaw === 'string' ? vinRaw.trim() : ''

   if (!vin) return UNKNOWN_VALUE
   if (vin.length <= 8) return vin
   return `${vin.slice(0, 4)}****${vin.slice(-4)}`
}

export const getCarEquipmentLabels = (ad = null) => {
   if (!isRecord(ad)) return []

   const result = []

   appendEquipment(result, firstFromArray(ad.auto_additional_options_heating), [
      ['is_front_seats', 'Подогрев передних сидений'],
      ['is_rear_seats', 'Подогрев задних сидений'],
      ['is_mirrors', 'Подогрев зеркал'],
      ['is_rear_window', 'Подогрев заднего стекла'],
      ['is_steering_wheel', 'Подогрев руля']
   ])

   appendEquipment(result, firstFromArray(ad.auto_additional_options_electric_drive), [
      ['is_front_seats_drives', 'Электропривод передних сидений']
   ])

   appendEquipment(
      result,
      firstFromArray(ad.auto_additional_options_driving_assistance),
      [
         ['is_blind_spot_monitoring', 'Мониторинг слепых зон'],
         ['is_automatic_parking', 'Автоматическая парковка'],
         ['is_rain_sensor', 'Датчик дождя'],
         ['is_cruise_control', 'Круиз-контроль']
      ]
   )

   appendEquipment(result, firstFromArray(ad.auto_additional_active_security), [
      ['is_anti_lock_brakes', 'Антиблокировочная система (ABS)'],
      ['is_anti_slip', 'Антипробуксовочная система']
   ])

   appendEquipment(
      result,
      firstFromArray(ad.auto_additional_options_anticreeping_system),
      [['is_satellite', 'Спутниковая система']]
   )

   appendEquipment(
      result,
      firstFromArray(ad.auto_additional_multimedia_navigation),
      [
         ['is_navigation_system', 'Навигационная система'],
         ['is_Bluetooth', 'Bluetooth']
      ]
   )

   appendEquipment(result, firstFromArray(ad.auto_additional_headlights), [
      ['is_xenon_headlights', 'Ксеноновые фары'],
      ['is_led_headlights', 'Светодиодные фары'],
      ['is_fog_lights', 'Противотуманные фары']
   ])

   appendEquipment(result, firstFromArray(ad.auto_additional_tires_wheels), [
      ['is_alloy_wheels', 'Литые диски']
   ])

   return [...new Set(result)]
}

export const resolveFullReportPrice = (
   response = null,
   fallback = DEFAULT_REPORT_PRICE
) => {
   const visited = new Set()

   const findNumeric = (value, depth = 0) => {
      if (depth > 4 || value == null) return null

      if (typeof value === 'number' && Number.isFinite(value)) return value

      if (typeof value === 'string') {
         const cleaned = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''))
         return Number.isFinite(cleaned) ? cleaned : null
      }

      if (typeof value !== 'object') return null
      if (visited.has(value)) return null
      visited.add(value)

      if (Array.isArray(value)) {
         for (const item of value) {
            const found = findNumeric(item, depth + 1)
            if (found !== null) return found
         }
         return null
      }

      const prioritizedKeys = ['price', 'amount', 'value', 'requiredAmount', 'data']
      for (const key of prioritizedKeys) {
         if (!(key in value)) continue
         const found = findNumeric(value[key], depth + 1)
         if (found !== null) return found
      }

      for (const key of Object.keys(value)) {
         if (prioritizedKeys.includes(key)) continue
         const found = findNumeric(value[key], depth + 1)
         if (found !== null) return found
      }

      return null
   }

   const found = findNumeric(response)
   return found !== null ? found : fallback
}

export const buildCarContactProps = (ad = null) => {
   const source = isRecord(ad) ? ad : {}
   const spec = getPrimarySpec(source)
   const adsParameter = getAdsParameter(source)

   const username = normalizeText(
      adsParameter.username || adsParameter.login,
      UNKNOWN_USERNAME
   )

   return {
      id: normalizeNumber(source.id, 0),
      idUserOwnerAds: normalizeNumber(source.id_user_owner_ads || source.user_id, 0),
      brand: normalizeText(spec?.brand?.title),
      model: normalizeText(spec?.model?.title),
      year: normalizeText(spec?.year_release?.title),
      amount: normalizeNumber(adsParameter.amount, 0),
      username,
      place: normalizeText(adsParameter.place_inspection),
      isInFavorites: normalizeNumber(source.is_in_favorites, 0),
      latitude: normalizeNullableNumber(adsParameter.latitude),
      longitude: normalizeNullableNumber(adsParameter.longitude),
      photos: Array.isArray(source.photos) ? source.photos : []
   }
}

export const AUTO_UNKNOWN_VALUE = UNKNOWN_VALUE
