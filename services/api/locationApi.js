/**
 * API для работы с локацией (регионы, города)
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

/**
 * Получить регионы
 */
export const getRegions = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/regions')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных регионов.'
      }
   )
}

/**
 * Получить города по региону
 */
export const getCitiesByRegion = async (regionId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/region_with_city?region_id=${regionId}`
         )
         const body = getResponseBody(response)
         return body?.data?.[0]?.cities || body?.cities || []
      },
      {
         errorMessage: `Ошибка при получении городов для региона с ID ${regionId}.`
      }
   )
}

/**
 * Получить город по ID
 */
export const getCityById = async (cityId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/moderations/cities/show/${cityId}`
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при получении города с ID ${cityId}.`
      }
   )
}

/**
 * Поиск городов по названию
 */
export const searchCitiesByName = async (cityTitle) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/cities?city_title=${cityTitle}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при поиске города с названием ${cityTitle}.`
      }
   )
}
