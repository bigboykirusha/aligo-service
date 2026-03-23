/**
 * API для работы с сообщениями и чатами
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField,
   getResponseTotalCount
} from '../apiUtils'

/**
 * Получить сообщения чата
 */
export const fetchMessages = async (
   adsId,
   mainCategoryId,
   userId,
   params = {}
) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post('/chats/show', {
            ads_id: adsId,
            main_category_id: mainCategoryId,
            user_id: userId,
            ...params
         })
         return getResponseDataField(response)
      },
      {
         timeout: 115000,
         errorMessage: 'Ошибка при получении сообщений.'
      }
   )
}

/**
 * Отправить сообщение
 */
export const sendMessage = async (
   message,
   adsId,
   mainCategoryId,
   forUserId,
   photos
) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const formData = new FormData()
         if (message?.trim()) formData.append('message', message.trim())
         formData.append('ads_id', adsId)
         formData.append('main_category_id', mainCategoryId)
         formData.append('for_user_id', forUserId)
         photos.forEach((photo, index) =>
            formData.append(`photos[${index}]`, photo)
         )

         const response = await apiClient.post('/chats', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при отправке сообщения.'
      }
   )
}

/**
 * Получить последние сообщения
 */
export const fetchLastMessages = async (
   translate_to = null,
   unread_chats = false,
   read_chats = false,
   only_my_ads = false
) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = {}
         if (translate_to) params.translate_to = translate_to
         if (unread_chats) params.unread_chats = true
         if (read_chats) params.read_chats = true
         if (only_my_ads) params.only_my_ads = true

         const response = await apiClient.get('/chats/last_messages', {
            params
         })
         return {
            data: getResponseDataField(response),
            totalCount: getResponseTotalCount(response)
         }
      },
      {
         errorMessage: 'Ошибка при получении последних сообщений.'
      }
   )
}

/**
 * Удалить чаты
 */
export const deleteChats = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/chats/delete_conversations', { ids })
      },
      {
         errorMessage: 'Ошибка при удалении чатов.'
      }
   )
}

/**
 * Отметить чаты как прочитанные
 */
export const markChatsAsRead = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/chats/mark_as_read_conversations', { ids })
      },
      {
         errorMessage: 'Ошибка при пометке чатов как прочитанных.'
      }
   )
}

export const markDefinedMessagesAsRead = async (ids) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         await apiClient.post('/chats/mark_as_read_define_messages', { ids })
      },
      {
         errorMessage: 'Ошибка при пометке сообщений как прочитанных.'
      }
   )
}
