import { createInitialCreateState } from './state'

const CREATE_ANY_FIELD_IGNORED_KEYS = new Set([
   'id',
   'id_user_owner_ads',
   'create_by_user_id',
   'is_draft',
   'is_published',
   'create_flow',
   'activeTab',
   'tabs',
   'currency_id',
   'autosave_pending_count',
   'autosave_last_error',
   'autosave_last_error_field',
   'autosave_last_success_at',
   'isDraftEditMode',
   'isUserDataInitializing',
   'isUserDataInitialized',
   'initialStateSnapshot'
])

const CREATE_TRACKED_STATE_KEYS = new Set([
   ...Object.keys(createInitialCreateState()),
   'activeTab',
   'tabs',
   'initialStateSnapshot'
])

export const isAnyCreateFieldFilled = (state = {}) =>
   Object.entries(state).some(([key, value]) => {
      if (!CREATE_TRACKED_STATE_KEYS.has(key)) return false
      if (CREATE_ANY_FIELD_IGNORED_KEYS.has(key)) return false
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.keys(value).length > 0
      if ((key.startsWith('is_') || key.includes('_is_')) && Number(value) === 0)
         return false
      return true
   })

const normalizeCreateComparableValue = (value) => {
   if (value === undefined) return null
   if (value === null) return null

   if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed === '' ? null : trimmed
   }

   if (Array.isArray(value)) {
      return value.map(normalizeCreateComparableValue)
   }

   if (typeof value === 'object') {
      return Object.fromEntries(
         Object.entries(value)
            .filter(([, nestedValue]) => nestedValue !== undefined)
            .map(([nestedKey, nestedValue]) => [
               nestedKey,
               normalizeCreateComparableValue(nestedValue)
            ])
      )
   }

   return value
}

export const buildCreateDirtyCheckSnapshot = (state = {}) =>
   Object.fromEntries(
      Object.entries(state)
         .filter(
            ([key]) =>
               CREATE_TRACKED_STATE_KEYS.has(key) &&
               !CREATE_ANY_FIELD_IGNORED_KEYS.has(key)
         )
         .map(([key, value]) => [key, normalizeCreateComparableValue(value)])
   )

export const hasCreateUnsavedChanges = (state = {}) => {
   const currentSnapshot = buildCreateDirtyCheckSnapshot(state)
   const initialSnapshot = normalizeCreateComparableValue(
      state?.initialStateSnapshot || {}
   )

   return JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot)
}

const CREATE_FIELD_LABELS = Object.freeze({
   ads_description: 'Описание',
   amount: 'Цена',
   place_inspection: 'Место осмотра',
   username: 'Имя',
   email: 'Email',
   phone: 'Телефон',
   city_id: 'Город',
   city_name: 'Город',
   latitude: 'Широта',
   longitude: 'Долгота',
   condition_id: 'Состояние',
   main_category_id: 'Основная категория',
   sub_category_id: 'Подкатегория',
   last_category_id: 'Последняя категория',
   photos: 'Фотографии',
   ids_delete_photos: 'Удаленные фотографии',
   color_ids: 'Цвет',
   color_custom: 'Цвет',
   brand_id: 'Марка',
   model_id: 'Модель',
   generation_id: 'Поколение',
   modification_id: 'Модификация',
   equipment_id: 'Комплектация',
   year_id: 'Год выпуска',
   country_id: 'Страна',
   vin: 'VIN',
   state_number: 'Госномер',
   mileage: 'Пробег',
   count_owners: 'Количество владельцев',
   state_id: 'Состояние',
   pts_id: 'ПТС',
   transmission_id: 'Коробка передач',
   engine_type_id: 'Тип двигателя',
   engine_volume: 'Объем двигателя',
   power_range: 'Мощность',
   drive_id: 'Привод',
   handlebar_id: 'Руль',
   communication_method_id: 'Способ связи',
   tires_condition_id: 'Состояние шин',
   disks_condition_id: 'Состояние дисков',
   moto_tires_condition_id: 'Состояние мотошин',
   full_wheels_condition_id: 'Состояние колес в сборе',
   motor_oil_condition_id: 'Состояние масла',
   moto_motorcycle_condition_id: 'Состояние мотоцикла',
   moto_scooter_condition_id: 'Состояние скутера'
})

const toReadableCreateFieldLabel = (key) => {
   if (CREATE_FIELD_LABELS[key]) return CREATE_FIELD_LABELS[key]

   return String(key || '')
      .replace(/_id$/i, '')
      .replace(/^is_/i, '')
      .replace(/_/g, ' ')
      .trim()
      .replace(/^\w/, (char) => char.toUpperCase())
}

export const getCreateChangedFieldLabels = (state = {}) => {
   const currentSnapshot = buildCreateDirtyCheckSnapshot(state)
   const initialSnapshot = normalizeCreateComparableValue(
      state?.initialStateSnapshot || {}
   )

   return Object.keys(currentSnapshot)
      .filter(
         (key) =>
            JSON.stringify(currentSnapshot[key]) !==
            JSON.stringify(initialSnapshot?.[key] ?? null)
      )
      .map(toReadableCreateFieldLabel)
}
