/**
 * API для работы с объявлениями
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField,
   getResponseTotalCount
} from '../apiUtils'

const toOptionalNumber = (value) => {
   if (value === null || value === undefined || value === '') return null
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const REASONS_CACHE_TTL_MS = 5 * 60 * 1000
const ADS_SIMILAR_CACHE_TTL_MS = 15 * 60 * 1000

const dismissedReasonsCache = {
   items: null,
   expiresAt: 0,
   pending: null
}

const closeReasonsCache = {
   items: null,
   expiresAt: 0,
   pending: null
}

const adsSimilarCache = new Map()
const adsSimilarPending = new Map()

const normalizeReasonsRecord = (source) => {
   if (!source || typeof source !== 'object' || Array.isArray(source)) {
      return []
   }

   const entries = Object.entries(source)
   const normalized = []

   for (const [rawKey, rawValue] of entries) {
      if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
         const hasReasonFields =
            'id' in rawValue ||
            'reason_id' in rawValue ||
            'reasonId' in rawValue ||
            'title' in rawValue ||
            'name' in rawValue ||
            'reason' in rawValue

         if (!hasReasonFields) continue

         normalized.push({
            ...rawValue,
            id: rawValue.id ?? rawValue.reason_id ?? rawValue.reasonId ?? Number(rawKey)
         })
         continue
      }

      const numericKey = Number(rawKey)
      const isNumericKey = Number.isFinite(numericKey) && numericKey > 0
      const isStringValue = typeof rawValue === 'string' && rawValue.trim()

      if (isNumericKey && isStringValue) {
         normalized.push({
            id: numericKey,
            title: rawValue.trim()
         })
      }
   }

   return normalized
}

const pickReasonsArray = (response) => {
   const body = getResponseBody(response)
   const candidates = [
      getResponseDataField(response),
      body?.reasons,
      body?.items,
      body?.result,
      body?.data?.reasons,
      body?.data?.items,
      body?.data?.result,
      body?.data?.data,
      normalizeReasonsRecord(body?.data),
      normalizeReasonsRecord(body)
   ]

   for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
         return candidate
      }
   }

   return []
}

const normalizeCacheValue = (value) => {
   if (Array.isArray(value)) {
      return value.map((item) => normalizeCacheValue(item))
   }
   if (value && typeof value === 'object') {
      return Object.keys(value)
         .sort()
         .reduce((acc, key) => {
            acc[key] = normalizeCacheValue(value[key])
            return acc
         }, {})
   }
   return value ?? null
}

const buildAdsSimilarCacheKey = (params) =>
   JSON.stringify(normalizeCacheValue(params && typeof params === 'object' ? params : {}))

/**
 * Получить историю объявлений
 */
export const getAdsHistory = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/show_history_ads', {
            params: { count: 5 }
         })
         return {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response)
         }
      },
      {
         errorMessage: 'Ошибка при получении данных истории объявлений.'
      }
   )
}

/**
 * Получить похожие объявления
 */
export const getAdsSimilar = async ({
   city = null,
   not_in_this_city = null,
   not_this_ad_id = null,
   main_category_id = null,
   page = 1,
   count = 10,
   order_by = 'asc'
}) => {
   const cacheKey = buildAdsSimilarCacheKey({
      city,
      not_in_this_city,
      not_this_ad_id,
      main_category_id,
      page,
      count,
      order_by
   })
   const cachedEntry = adsSimilarCache.get(cacheKey)
   const now = Date.now()

   if (cachedEntry && now - cachedEntry.timestamp <= ADS_SIMILAR_CACHE_TTL_MS) {
      return cachedEntry.value
   }

   if (adsSimilarPending.has(cacheKey)) {
      return adsSimilarPending.get(cacheKey)
   }

   const pending = executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = { page, count, order_by }

         const cityId = toOptionalNumber(city)
         const notInThisCityId = toOptionalNumber(not_in_this_city)
         const notThisAdId = toOptionalNumber(not_this_ad_id)
         const mainCategoryId = toOptionalNumber(main_category_id)

         if (cityId !== null) params.city = cityId
         if (notInThisCityId !== null) params.not_in_this_city = notInThisCityId
         if (notThisAdId !== null) params.not_this_ad_id = notThisAdId
         if (mainCategoryId !== null) params.main_category_id = mainCategoryId

         const response = await apiClient.get('/show_similar_ads', { params })
         const normalized = {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response)
         }

         adsSimilarCache.set(cacheKey, {
            timestamp: Date.now(),
            value: normalized
         })

         return normalized
      },
      {
         errorMessage: 'Ошибка при получении данных похожих объявлений.'
      }
   ).finally(() => {
      adsSimilarPending.delete(cacheKey)
   })

   adsSimilarPending.set(cacheKey, pending)

   try {
      return await pending
   } finally {
      if (adsSimilarCache.size > 50) {
         const oldestKey = adsSimilarCache.keys().next().value
         if (oldestKey) adsSimilarCache.delete(oldestKey)
      }
   }
}

/**
 * Получить объявления пользователя
 */
export const getMyAds = async (isPublished) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = {}
         if (isPublished !== null) {
            if (isPublished === 2) {
               params.is_moderation = 1
            } else {
               params.is_published = isPublished
            }
         }

         const response = await apiClient.get(
            '/all_ads_user_not_draft_not_archive',
            { params }
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении объявлений.'
      }
   )
}

/**
 * Получить количество объявлений пользователя
 */
export const getMyAdsCount = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            '/all_ads_user_not_draft_not_archive'
         )
         return getResponseTotalCount(response)
      },
      {
         errorMessage: 'Ошибка при получении общего количества объявлений.'
      }
   )
}

/**
 * Получить объявления с фильтрами
 */
export const getCarsFiltered = async (filters) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/autos_filters', {
            params: filters
         })
         return {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response),
            seo: response.data.seo
         }
      },
      {
         errorMessage: 'Ошибка при получении автомобилей с фильтрами.'
      }
   )
}

/**
 * Получить объявления (поиск)
 */
export const getCarsSearch = async ({ searchQuery, page, count }) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/autos_filters', {
            params: {
               search_title: searchQuery,
               page,
               count
            }
         })
         return {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response)
         }
      },
      {
         errorMessage: 'Ошибка при поиске автомобилей.'
      }
   )
}

/**
 * Получить все объявления
 */
export const getCars = async ({ page = 1, count = 20, order_by = 'asc' }) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/autos', {
            params: { page, count, order_by }
         })
         return {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response)
         }
      },
      {
         errorMessage: 'Ошибка при получении данных.'
      }
   )
}

/**
 * Создать объявление об автомобиле
 */
export const createCarAd = async (params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post('/autos', params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при создании объявления.'
      }
   )
}

/**
 * Обновить объявление об автомобиле
 */
export const updateCarAd = async (auto_id, params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post(`/autos/${auto_id}`, params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при обновлении объявления об автомобиле.'
      }
   )
}

/**
 * Удалить объявления
 */
export const deleteAds = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/delete_add_to_archive', { ids })
      },
      {
         errorMessage: 'Ошибка при удалении объявлений.'
      }
   )
}

/**
 * Снять с публикации
 */
export const takeOffPublication = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/take_off_publication', { ids })
      },
      {
         errorMessage: 'Ошибка при снятии с публикации.'
      }
   )
}

/**
 * Получить причины снятия объявления с публикации владельцем
 */
export const getDismissedFromPublicationReasonsByOwner = async ({
   force = false
} = {}) => {
   const now = Date.now()
   if (
      !force &&
      Array.isArray(dismissedReasonsCache.items) &&
      dismissedReasonsCache.expiresAt > now
   ) {
      return dismissedReasonsCache.items
   }

   if (!force && dismissedReasonsCache.pending) {
      return dismissedReasonsCache.pending
   }

   const requestPromise = executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            '/show_reasons_dismissed_from_publication_by_owner'
         )
         const reasons = pickReasonsArray(response)
         dismissedReasonsCache.items = reasons
         dismissedReasonsCache.expiresAt = Date.now() + REASONS_CACHE_TTL_MS
         return reasons
      },
      {
         errorMessage: 'Ошибка при получении причин снятия с публикации.',
         throwError: true
      }
   )

   dismissedReasonsCache.pending = requestPromise

   try {
      return await requestPromise
   } finally {
      dismissedReasonsCache.pending = null
   }
}

/**
 * Получить причины закрытия объявления (успешная сделка)
 */
export const getTakeOffPublicationReasons = async ({ force = false } = {}) => {
   const now = Date.now()
   if (
      !force &&
      Array.isArray(closeReasonsCache.items) &&
      closeReasonsCache.expiresAt > now
   ) {
      return closeReasonsCache.items
   }

   if (!force && closeReasonsCache.pending) {
      return closeReasonsCache.pending
   }

   const requestPromise = executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/reason_take_off_publication')
         const reasons = pickReasonsArray(response)
         closeReasonsCache.items = reasons
         closeReasonsCache.expiresAt = Date.now() + REASONS_CACHE_TTL_MS
         return reasons
      },
      {
         errorMessage: 'Ошибка при получении причин закрытия объявления.',
         throwError: true
      }
   )

   closeReasonsCache.pending = requestPromise

   try {
      return await requestPromise
   } finally {
      closeReasonsCache.pending = null
   }
}

/**
 * Снять объявления с публикации владельцем с указанием причины
 */
export const dismissFromPublicationByOwnerAds = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/dismissed_from_publication_by_owner_ads', { ids })
      },
      {
         errorMessage: 'Ошибка при снятии объявления с публикации.'
      }
   )
}

/**
 * Закрыть объявление как успешную сделку
 */
export const closeAdsSuccessSell = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/close_ads_success_sell', { ids })
         return response?.data ?? response
      },
      {
         errorMessage: 'Ошибка при закрытии объявления.'
      }
   )
}

/**
 * Опубликовать снова
 */
export const publishAgainSelected = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/publish_again_from_main_tab', { ids })
      },
      {
         errorMessage: 'Ошибка при публикации из архива.'
      }
   )
}

/**
 * Получить черновики
 */
export const getDrafts = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/show_draft_ads')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении черновиков.'
      }
   )
}

/**
 * Удалить из черновиков
 */
export const deleteFromDrafts = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/delete_from_draft_and_forever', { ids })
      },
      {
         errorMessage: 'Ошибка при удалении из черновиков.'
      }
   )
}

/**
 * Получить отклоненные объявления
 */
export const getCancelledAds = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/show_cancelled_ads')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении отклонённых объявлений.'
      }
   )
}

/**
 * Получить архив
 */
export const getArchives = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/archives')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении архива.'
      }
   )
}

/**
 * Удалить из архива
 */
export const deleteFromArchive = async (ads_id, main_category_id = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/archives/delete_from_archive', {
            ids: [{ ads_id, main_category_id: toOptionalNumber(main_category_id) ?? 1 }]
         })
      },
      {
         errorMessage: 'Ошибка при удалении из архива.'
      }
   )
}

/**
 * Опубликовать из архива
 */
export const publishFromArchive = async (ads_id, main_category_id = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/archives/publish_again_from_archive', {
            ids: [{ ads_id, main_category_id: toOptionalNumber(main_category_id) ?? 1 }]
         })
      },
      {
         errorMessage: 'Ошибка при публикации из архива.'
      }
   )
}

/**
 * Опубликовать с главной вкладки
 */
export const publishFromMainTab = async (ads_id, main_category_id = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/publish_again_from_main_tab', {
            ids: [{ ads_id, main_category_id: toOptionalNumber(main_category_id) ?? 1 }]
         })
         return response
      },
      {
         errorMessage: 'Произошла ошибка при публикации.'
      }
   )
}

/**
 * Получить объявления модерации
 */
export const getModerationAds = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moderations/ads')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных модерации.',
         throwError: true
      }
   )
}

/**
 * Показать контакты продавца
 */
export const seeContact = async ({ ads_id, main_category_id = null }) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/show_phone_seller_and_add_count_view_seller_contact',
            {
               ads_id,
               main_category_id: toOptionalNumber(main_category_id) ?? 1
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении контактных данных.'
      }
   )
}
