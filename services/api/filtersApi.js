/**
 * API для работы с фильтрами
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

const DEFAULT_FILTER_MAIN_CATEGORY_ID = 12

const toNumber = (value, fallback = 0) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : fallback
}

const toNullableNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const toBinaryFlag = (value, fallback = 1) => (toNumber(value, fallback) > 0 ? 1 : 0)

const normalizeText = (value, fallback = '') => {
   if (typeof value !== 'string') return fallback
   const normalized = value.trim()
   return normalized || fallback
}

const normalizeAddFilterPayload = (filter = {}) => ({
   title: normalizeText(filter?.title, ''),
   url: normalizeText(filter?.url, ''),
   city_id: toNullableNumber(filter?.city_id),
   is_email: toBinaryFlag(filter?.is_email, 1),
   is_telegram: toBinaryFlag(filter?.is_telegram, 1)
})

const normalizeNotifyFilterItem = (filter = {}) => ({
   id: toNumber(filter?.id, 0),
   main_category_id: toNumber(
      filter?.main_category_id,
      DEFAULT_FILTER_MAIN_CATEGORY_ID
   ),
   is_email: toBinaryFlag(filter?.is_email, 0),
   is_telegram: toBinaryFlag(filter?.is_telegram, 0)
})

const normalizeDeleteFilterItem = (filter = {}) => ({
   id: toNumber(filter?.id, 0),
   main_category_id: toNumber(
      filter?.main_category_id,
      DEFAULT_FILTER_MAIN_CATEGORY_ID
   )
})

/**
 * Получить сохраненные фильтры пользователя
 */
export const getUserSavedFilters = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/user_save_filters')
         const dataField = getResponseDataField(response)
         return dataField ?? getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении сохранённых фильтров.'
      }
   )
}

/**
 * Сохранить фильтр
 */
export const saveFilter = async (filter) => {
   const payload = normalizeAddFilterPayload(filter)

   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/user_save_filters/add_filter',
            payload
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при сохранении фильтра.'
      }
   )
}

/**
 * Получить сохраненные фильтры
 */
export const fetchSavedFilters = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/user_save_filters')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при загрузке сохранённых фильтров.'
      }
   )
}

/**
 * Обновить уведомления фильтров
 */
export const updateNotifyFilters = async (filters) => {
   const normalizedFilters = Array.isArray(filters)
      ? filters
           .map(normalizeNotifyFilterItem)
           .filter((item) => item.id > 0)
      : []

   if (!normalizedFilters.length) {
      return {
         success: false,
         message: 'Нет фильтров для обновления'
      }
   }

   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/user_save_filters/update_notify_filters',
            {
               ids: normalizedFilters
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при обновлении уведомлений.'
      }
   )
}

/**
 * Удалить фильтры
 */
export const deleteFilters = async (filters) => {
   const normalizedFilters = Array.isArray(filters)
      ? filters
           .map(normalizeDeleteFilterItem)
           .filter((item) => item.id > 0)
      : []

   if (!normalizedFilters.length) {
      return {
         success: false,
         message: 'Нет фильтров для удаления'
      }
   }

   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/user_save_filters/destroy_filters',
            {
               ids: normalizedFilters
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при удалении фильтров.'
      }
   )
}
