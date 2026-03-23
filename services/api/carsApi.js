/**
 * API для работы с автомобилями и их характеристиками
 */

import { executeApiRequest, getApiClient, getResponseDataField } from '../apiUtils'

/**
 * Получить автомобиль по ID
 */
export const getCarById = async (id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/autos/${id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных автомобиля.'
      }
   )
}

/**
 * Получить бренды автомобилей
 */
export const getCarBrands = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_brand', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении брендов автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить модели автомобилей
 */
export const getCarModels = async (id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/auto_model?brand_id=${id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении моделей автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить поколения автомобилей
 */
export const getCarGenerations = async (brandId, modelId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/unique_fields_from_auto_full_info?brand_id=${brandId}&model_id=${modelId}&generation=1`
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных поколений автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить комплектации автомобилей
 */
export const getCarEquipment = async (brandId, modelId, generationId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/unique_fields_from_auto_full_info?brand_id=${brandId}&model_id=${modelId}&generation_id=${generationId}&equipment=1`
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных комплектаций автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить модификации автомобиля
 */
export const getCarModifications = async (brandId, modelId, generationId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/unique_fields_from_auto_full_info?brand_id=${brandId}&model_id=${modelId}&generation_id=${generationId}&modification=1`
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении модификаций автомобиля.',
         throwError: true
      }
   )
}

/**
 * Получить полную информацию по авто
 */
export const getAutoFullInfo = async ({
   brand_id,
   model_id,
   generation_id,
   modification_id,
   equipment_id
}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_full_info', {
            params: {
               brand_id,
               model_id,
               generation_id,
               modification_id,
               equipment_id
            }
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении полной информации об автомобиле.',
         throwError: true
      }
   )
}

/**
 * Получить типы трансмиссий
 */
export const getCarTransmission = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_transmission', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении трансмиссий автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить типы кузовов
 */
export const getCarBodyType = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_car_body_type', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении типов кузовов автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить типы двигателей
 */
export const getCarEngineType = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_engine_type', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении типов двигателей автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить состояния автомобилей
 */
export const getCarState = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_state', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении состояния автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить условия автомобилей
 */
export const getCarCondition = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_condition', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении условий автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить типы привода
 */
export const getCarDrive = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/auto_drive', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении типа привода автомобилей.',
         throwError: true
      }
   )
}

/**
 * Получить страны регистрации
 */
export const getCarCountry = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_country_register')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении стран регистрации.',
         throwError: true
      }
   )
}

/**
 * Получить цвета
 */
export const getColors = async (translate_to = null) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = translate_to ? { translate_to } : {}
         const response = await apiClient.get('/colors', { params })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении цветов.',
         throwError: true
      }
   )
}

/**
 * Получить годы
 */
export const getYear = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/year')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении годов.',
         throwError: true
      }
   )
}

/**
 * Получить количество владельцев
 */
export const getCarsOwners = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_count_owner')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении количества владельцев.',
         throwError: true
      }
   )
}

/**
 * Получить ПТС
 */
export const getCarsPts = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_pts')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении ПТС.',
         throwError: true
      }
   )
}

/**
 * Получить повреждения
 */
export const getCarsDamage = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_damage')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении повреждений.',
         throwError: true
      }
   )
}

/**
 * Получить рулевое управление
 */
export const getCarsPowerSteering = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_power_steering')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении рулевого управления.',
         throwError: true
      }
   )
}

/**
 * Получить салон
 */
export const getCarsSalon = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_salon')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении салона.',
         throwError: true
      }
   )
}

/**
 * Получить электростекла
 */
export const getCarsElectricWindow = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_electric_window')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении электростекол.',
         throwError: true
      }
   )
}

/**
 * Получить колеса и шины
 */
export const getCarsWheels = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_tires_wheels')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении колес и шин.',
         throwError: true
      }
   )
}

/**
 * Получить аудиосистему
 */
export const getCarsAudioSystem = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_audio_system')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении аудиосистемы.',
         throwError: true
      }
   )
}

/**
 * Получить фары
 */
export const getCarsHeadlight = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_headlight')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении фар.',
         throwError: true
      }
   )
}

/**
 * Получить климат-контроль
 */
export const getCarsClimate = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_climate_management')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении климат-контроля.',
         throwError: true
      }
   )
}

/**
 * Получить руль
 */
export const getCarsHandlebar = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/auto_handlebar')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении руля.',
         throwError: true
      }
   )
}

/**
 * Получить способы связи
 */
export const getCommunicationMethod = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/contact_communication_method')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении способов связи.',
         throwError: true
      }
   )
}


