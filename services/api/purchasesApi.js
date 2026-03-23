/**
 * API for purchases of reports and paid services
 */

import { executeApiRequest, getApiClient, getResponseBody } from '../apiUtils'

const normalizeMainCategoryId = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : 1
}

const normalizePaidServiceItems = (items = []) =>
   (Array.isArray(items) ? items : [])
      .map((item) => {
         if (!item || typeof item !== 'object') return null

         const paidServiceId =
            item.paid_service_id ?? item.paidServiceId ?? item.id
         if (!paidServiceId) return null

         const normalized = {
            paid_service_id: paidServiceId
         }

         if (item.color) {
            normalized.color = String(item.color)
         }

         return normalized
      })
      .filter(Boolean)

const buildReportPurchasePayload = ({
   adsId = null,
   mainCategoryId = null,
   vin = null
} = {}) => {
   const payload = {}

   if (adsId !== null && adsId !== undefined && String(adsId).trim() !== '') {
      payload.ads_id = adsId
      payload.main_category_id = normalizeMainCategoryId(mainCategoryId)
   }

   if (vin && String(vin).trim()) {
      payload.vin = String(vin).trim()
   }

   return payload
}

const buildPaidServicesPurchasePayload = ({
   adsId = null,
   mainCategoryId = null,
   paidServices = []
} = {}) => {
   const payload = {
      paid_services: normalizePaidServiceItems(paidServices)
   }

   if (adsId !== null && adsId !== undefined && String(adsId).trim() !== '') {
      payload.ads_id = adsId
      payload.main_category_id = normalizeMainCategoryId(mainCategoryId)
   }

   return payload
}

const buildPaidServicesListParams = (params = {}) => {
   const normalized = {}

   for (const [key, value] of Object.entries(params || {})) {
      if (value === null || value === undefined || value === '') continue

      if (
         [
            'is_promotion',
            'is_decoration',
            'is_banner_advertising',
            'is_exclusive',
            'is_first_place',
            'is_second_place',
            'is_third_place',
            'is_up',
            'is_vip',
            'is_badge',
            'is_frame_color'
         ].includes(key)
      ) {
         normalized[key] = Number(value) === 1 || value === true ? 1 : 0
         continue
      }

      normalized[key] = value
   }

   return normalized
}

export const getPaidServicesList = async ({
   paidServiceId = null,
   params = {}
} = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpoint = paidServiceId
            ? `/paid_services/list/${encodeURIComponent(String(paidServiceId))}`
            : '/paid_services/list'

         const response = await apiClient.get(endpoint, {
            params: buildPaidServicesListParams(params)
         })
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u0443\u0441\u043b\u0443\u0433.'
      }
   )
}

export const calculateReportPurchase = async (payload = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/reports/calculate_report',
            buildReportPurchasePayload(payload)
         )
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u043e\u0442\u0447\u0435\u0442\u0430.'
      }
   )
}

export const submitReportPurchase = async (payload = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/reports/require_report_paid', {
            ...buildReportPurchasePayload(payload),
            ...(payload?.payment !== undefined && payload?.payment !== null
               ? { payment: payload.payment }
               : {}),
            ...(payload?.is_use_bonus !== undefined &&
            payload?.is_use_bonus !== null
               ? { is_use_bonus: payload.is_use_bonus }
               : {})
         })
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u044c \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u043e\u0442\u0447\u0435\u0442\u0430.'
      }
   )
}

export const calculatePaidServicesPurchase = async (payload = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/paid_services/calculate_paid_service',
            buildPaidServicesPurchasePayload(payload)
         )
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u0443\u0441\u043b\u0443\u0433.'
      }
   )
}

export const submitPaidServicesPurchase = async (payload = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/paid_services/buy_paid_service',
            {
               ...buildPaidServicesPurchasePayload(payload),
               ...(payload?.payment !== undefined && payload?.payment !== null
                  ? { payment: payload.payment }
                  : {}),
               ...(payload?.is_use_bonus !== undefined &&
               payload?.is_use_bonus !== null
                  ? { is_use_bonus: payload.is_use_bonus }
                  : {})
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u044c \u043f\u043e\u043a\u0443\u043f\u043a\u0443 \u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u0443\u0441\u043b\u0443\u0433.'
      }
   )
}
