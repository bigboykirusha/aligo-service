/**
 * API для работы с уведомлениями
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

/**
 * Получить уведомления
 */
export const getNotifications = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/notifications')
         const dataField = getResponseDataField(response)
         return dataField ?? getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении уведомлений.',
         throwError: true
      }
   )
}

/**
 * Удалить уведомление по ID
 */
export const deleteNotificationById = async (id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.delete(`/notifications/${id}`)
         return getResponseBody(response)
      },
      {
         errorMessage: `Ошибка при удалении уведомления с ID ${id}.`
      }
   )
}

/**
 * Удалить все уведомления
 */
export const deleteAllNotifications = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.delete(
            '/notifications/delete_all_notifications'
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при удалении всех уведомлений.'
      }
   )
}

/**
 * Отметить все уведомления как прочитанные
 */
export const markAllNotificationsAsRead = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/notifications/mark_as_read_all')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при пометке всех уведомлений как прочитанных.'
      }
   )
}

/**
 * Отметить уведомление как прочитанное
 */
export const markNotificationAsRead = async (id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/notifications/mark_as_read/${id}`
         )
         return getResponseBody(response)
      },
      {
         errorMessage: `Ошибка при пометке уведомления с ID ${id} как прочитанного.`
      }
   )
}
