/**
 * API для работы с пользователями
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

/**
 * Получить информацию о пользователе
 */
export const getUser = async (user_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/user_other/show/${user_id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при получении информации о пользователе с ID ${user_id}.`
      }
   )
}

/**
 * Получить информацию о другом пользователе
 */
export const getUserOtherInfo = async (user_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/user_other/show/${user_id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при получении информации о пользователе с ID ${user_id}.`
      }
   )
}

/**
 * Получить объявления другого пользователя
 */
export const getUserOtherAds = async (
   user_id,
   is_published_or_closed,
   { count = 8 } = {}
) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/user_other/get_ads_active_closed/${user_id}`,
            {
               params: {
                  is_published: is_published_or_closed === 'published' ? 1 : 0,
                  is_closed: is_published_or_closed === 'closed' ? 1 : 0,
                  count
               }
            }
         )
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при получении объявлений пользователя с ID ${user_id}.`
      }
   )
}

/**
 * Получить отзывы о другом пользователе
 */
export const getUserOtherReviews = async (user_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(`/user_other/reviews/${user_id}`)
         return getResponseDataField(response)
      },
      {
         errorMessage: `Ошибка при получении отзывов о пользователе с ID ${user_id}.`
      }
   )
}

/**
 * Получить телефон и email пользователя
 */
export const getUserPhoneEmail = async (user_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/user_other/get_phone_email/${user_id}`
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении телефона и email пользователя.'
      }
   )
}

/**
 * Получить данные пользователя
 */
export const getUserCount = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/user/get_info_count_for_myself')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении данных пользователя.'
      }
   )
}

/**
 * Обновить информацию о пользователе
 */
export const updateUserInfo = async (params) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post('/user/update', params, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при обновлении информации о пользователе.'
      }
   )
}

/**
 * Получить всех пользователей
 */
export const getUsers = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/users')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении пользователей.'
      }
   )
}

/**
 * Заблокировать пользователя
 */
export const blockUser = async (data) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/blocked_users', data)
      },
      {
         errorMessage: 'Ошибка при блокировке пользователя.'
      }
   )
}

/**
 * Получить заблокированных пользователей
 */
export const getBlockedUsers = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/blocked_users')
         return getResponseBody(response)
      },
      {
         errorMessage:
            'Ошибка при получении списка заблокированных пользователей.'
      }
   )
}

/**
 * Разблокировать пользователя
 */
export const unblockUser = async (userId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.delete(`/blocked_users/${userId}`)
      },
      {
         errorMessage: `Ошибка при разблокировке пользователя с ID ${userId}.`
      }
   )
}

/**
 * Отправить жалобу на пользователя
 */
export const submitComplaint = async (formData) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         await apiClient.post('/claim_users', formData)
      },
      {
         errorMessage: 'Ошибка при отправке жалобы.'
      }
   )
}
