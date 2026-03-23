/**
 * API для работы с отчетами
 */

import { executeApiRequest, getApiClient, getResponseBody } from '../apiUtils'

const normalizeMainCategoryId = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : 1
}

const FULL_REPORT_PRICE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const FULL_REPORT_PRICE_CACHE_KEY = 'full-report-price'
const fullReportPricePendingRequests = new Map()
const fullReportPriceRecentCache = new Map()

/**
 * Запросить отчет по объявлению
 */
export const requireReport = async (ads_id, mainCategoryId = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/reports/require_report', {
            ids: [{ ads_id, main_category_id: normalizeMainCategoryId(mainCategoryId) }]
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Произошла ошибка при запросе отчёта.'
      }
   )
}

/**
 * Получить стоимость полного отчета по объявлению
 */
export const getFullReportPrice = async () => {
   const cached = fullReportPriceRecentCache.get(FULL_REPORT_PRICE_CACHE_KEY)
   if (cached && Date.now() - cached.timestamp <= FULL_REPORT_PRICE_CACHE_TTL_MS) {
      return cached.value
   }

   if (fullReportPricePendingRequests.has(FULL_REPORT_PRICE_CACHE_KEY)) {
      return fullReportPricePendingRequests.get(FULL_REPORT_PRICE_CACHE_KEY)
   }

   const requestPromise = executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/paid_services/get_price_full_report')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Не удалось получить стоимость полного отчёта.'
      }
   )

   fullReportPricePendingRequests.set(FULL_REPORT_PRICE_CACHE_KEY, requestPromise)
   try {
      const result = await requestPromise
      if (result?.success !== false) {
         fullReportPriceRecentCache.set(FULL_REPORT_PRICE_CACHE_KEY, {
            timestamp: Date.now(),
            value: result
         })
      }
      return result
   } finally {
      fullReportPricePendingRequests.delete(FULL_REPORT_PRICE_CACHE_KEY)
   }
}

/**
 * Запросить отчет по VIN
 */
export const requireReportByVin = async (vin) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/reports/require_report', {
            ids: [{ vin }]
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Произошла ошибка при запросе отчёта.'
      }
   )
}

/**
 * Получить отчет по ID
 */
export const getReportById = async (report_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/reports/get_report/${report_id}`
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Сервер временно недоступен, повторите попытку позже.'
      }
   )
}

/**
 * Получить все отчеты пользователя
 */
export const fetchUserReports = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            '/reports/get_all_reports_buy_user'
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при загрузке отчётов.'
      }
   )
}
