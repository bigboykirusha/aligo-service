/**
 * API для работы с мотоциклами
 */

import { executeApiRequest, getApiClient, getResponseDataField } from '../apiUtils'

const resolveMotoResponseData = (response) => {
   const dataField = getResponseDataField(response)
   if (dataField !== undefined) return dataField
   return response?.data ?? []
}

const shouldTryNextMotoEndpoint = (error) => {
   const status = Number(error?.response?.status || 0)
   return status === 404 || status === 405
}

const requestMotoOptions = async ({
   endpoints = [],
   params = undefined,
   errorMessage = 'Ошибка при получении параметров мототехники'
}) =>
   executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpointList = Array.isArray(endpoints)
            ? endpoints.filter(Boolean)
            : [endpoints].filter(Boolean)

         if (!endpointList.length) return []

         let lastError = null
         for (let index = 0; index < endpointList.length; index += 1) {
            const endpoint = endpointList[index]

            try {
               const response = await apiClient.get(endpoint, {
                  ...(params ? { params } : {})
               })
               return resolveMotoResponseData(response)
            } catch (error) {
               lastError = error
               const isLastEndpoint = index === endpointList.length - 1
               if (isLastEndpoint || !shouldTryNextMotoEndpoint(error)) {
                  throw error
               }
            }
         }

         if (lastError) throw lastError
         return []
      },
      {
         errorMessage,
         throwError: true
      }
   )

export const getMotoCondition = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_condition', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении состояния мототехники' }
   )
}

export const getMotoAvailability = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_availability', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении доступности мототехники' }
   )
}

export const getMotoEngineType = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_engine_type', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении типов двигателя мототехники' }
   )
}

export const getMotoFuelFeed = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_fuel_feed', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении типов подачи топлива' }
   )
}

export const getMotoStroke = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_stroke', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении числа тактов' }
   )
}

export const getMotoPts = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_pts', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении ПТС мототехники' }
   )
}

export const getMotoTransmission = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_transmission', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении КПП мототехники' }
   )
}

export const getMotoCountOwner = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_count_owner', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении количества владельцев мототехники' }
   )
}

export const getMopedType = async (order_by = 'desc') => {
   return requestMotoOptions({
      endpoints: ['/moped_type'],
      params: { order_by },
      errorMessage: 'Ошибка при получении типов мопедов'
   })
}

export const getMopedBrand = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moped_brand')
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении брендов мопедов' }
   )
}

export const getMopedModel = async (brand_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moped_model', { params: { brand_id } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении моделей мопедов' }
   )
}

export const getMotorcycleType = async (order_by = 'desc') => {
   return requestMotoOptions({
      endpoints: ['/motorcycle_type'],
      params: { order_by },
      errorMessage: 'Ошибка при получении типов мотоциклов'
   })
}

export const getMotoSubCategory = async (order_by = 'desc') => {
   return requestMotoOptions({
      endpoints: ['/moto_sub_category'],
      params: { order_by },
      errorMessage: 'Ошибка при получении подкатегорий мототехники'
   })
}

export const getMotorcycleBrand = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/motorcycle_brand')
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении брендов мотоциклов' }
   )
}

export const getMotorcycleModel = async (brand_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/motorcycle_model', { params: { brand_id } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении моделей мотоциклов' }
   )
}

export const getMotoDriveType = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_drive_type', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении типов привода мототехники' }
   )
}

export const getMotoCountCylinder = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_count_cylinder', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении количества цилиндров' }
   )
}

export const getMotoNumberOfGears = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_number_of_gears', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении количества передач' }
   )
}

export const getMotoCylinderPosition = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_cylinder_position', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении расположения цилиндров' }
   )
}

export const getMotoEngineCooling = async (order_by = 'desc') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/moto_engine_cooling', { params: { order_by } })
         return getResponseDataField(response)
      },
      { errorMessage: 'Ошибка при получении информации об охлаждении' }
   )
}

export const getMotoById = async (id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/motos/${id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных мототехники.'
      }
   )
}

export const getMotos = async (filters = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = {
            page: 1,
            count: 20,
            order_by: 'asc',
            ...(filters && typeof filters === 'object' ? filters : {})
         }
         const response = await apiClient.get('/motos', {
            params
         })
         return {
            data: getResponseDataField(response),
            totalCount:
               response?.data?.meta?.total_count ??
               response?.data?.total_count ??
               0
         }
      },
      {
         errorMessage: 'Ошибка при получении мотообъявлений.'
      }
   )
}

export const getMotosFilters = async (filters = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = {
            page: 1,
            count: 20,
            order_by: 'asc',
            ...(filters && typeof filters === 'object' ? filters : {})
         }
         const response = await apiClient.get('/motos_filters', {
            params
         })
         return {
            data: getResponseDataField(response),
            totalCount:
               response?.data?.meta?.total_count ??
               response?.data?.total_count ??
               0
         }
      },
      {
         errorMessage: 'Ошибка при получении отфильтрованных мотообъявлений.'
      }
   )
}

export const createMotoAd = async (params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post('/motos', params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при создании мотообъявления.'
      }
   )
}

export const updateMotoAd = async (moto_id, params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post(`/motos/${moto_id}`, params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при обновлении мотообъявления.'
      }
   )
}
