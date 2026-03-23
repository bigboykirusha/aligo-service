/**
 * API для аутентификации и авторизации
 */

import { executeApiRequest, getApiClient, getResponseBody } from '../apiUtils'

/**
 * Вход по телефону/email
 */
export const loginUserByPhone = async ({
   phone,
   email,
   is_send_code_telegram
}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/send_code', {
            phone,
            email,
            is_send_code_telegram: is_send_code_telegram ? 1 : 0
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при входе.'
      }
   )
}

/**
 * Подтвердить код по телефону/email
 */
export const confirmPhoneCode = async ({ phone, email, code }) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/auth_by_phone_email', {
            phone,
            email,
            code
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Код неверный, проверьте правильность ввода.'
      }
   )
}

/**
 * Подтвердить код для обновления телефона/email
 */
export const confirmCode = async ({ phone, email, code }) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/user/check_code_and_update_phone_or_email',
            {
               phone,
               email,
               code
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при подтверждении кода.'
      }
   )
}

/**
 * Получить события аутентификации
 */
export const getMyselfAuthEvents = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/user/get_myself_auth_events', {
            params: { is_active: 1 }
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении событий аутентификации.'
      }
   )
}

/**
 * Выход пользователя
 */
export const logoutUser = async (authEventId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpoint = authEventId ? `/logout/${authEventId}` : '/logout'
         const response = await apiClient.post(endpoint)
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при выходе.'
      }
   )
}

/**
 * Выход везде кроме текущей сессии
 */
export const logoutEverywhere = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/logout_everywhere_but_this')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при выходе везде.'
      }
   )
}
