/**
 * API для прочих функций (SEO, документы и общие справочники)
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField,
   getResponsePayload
} from '../apiUtils'

const parseCityId = (value, fallback = 365) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : fallback
}

const SEO_PAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const seoPagePendingRequests = new Map()
const seoPageRecentCache = new Map()

export const getMainCategory = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/main_category')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Failed to load main categories.'
      }
   )
}

export const getSeoPage = async (url = 'main/', cityId = 365) => {
   const normalizedCityId = parseCityId(cityId)
   const normalizedUrl = String(url || 'main/')
   const cacheKey = `${normalizedUrl}::${normalizedCityId}`
   const cached = seoPageRecentCache.get(cacheKey)

   if (cached && Date.now() - cached.timestamp <= SEO_PAGE_CACHE_TTL_MS) {
      return cached.value
   }

   if (seoPagePendingRequests.has(cacheKey)) {
      return seoPagePendingRequests.get(cacheKey)
   }

   const requestPromise = executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const formData = new FormData()
         formData.append('URL', normalizedUrl)
         formData.append('CityID', normalizedCityId)

         const response = await apiClient.post(
            '/get_seo_for_page_and_section',
            formData
         )

         return response
      },
      {
         errorMessage: 'Failed to load SEO page data.'
      }
   )

   seoPagePendingRequests.set(cacheKey, requestPromise)

   try {
      const result = await requestPromise

      if (result?.success !== false) {
         seoPageRecentCache.set(cacheKey, {
            timestamp: Date.now(),
            value: result
         })
      }

      return result
   } finally {
      seoPagePendingRequests.delete(cacheKey)
   }
}

export const getSiteDocuments = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/site_documents')
         return { data: getResponsePayload(response) }
      },
      {
         errorMessage: 'Ошибка при получении списка документов.'
      }
   )
}

export const getSiteDocumentById = async (id = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpoint = id ? `/site_documents/${id}` : '/site_documents'
         const response = await apiClient.get(endpoint)
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении документа.'
      }
   )
}
