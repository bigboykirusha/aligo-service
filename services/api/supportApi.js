import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

export const sendSupport = async (themeId, comment, photos = []) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const formData = new FormData()
         formData.append('comment', comment)
         formData.append('theme_id', themeId)

         photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo)
         })

         const response = await apiClient.post('/tech_support', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })

         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при отправке запроса в поддержку.'
      }
   )
}

export const getTechSupportThemes = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/tickets/topics')
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при получении тем поддержки.'
      }
   )
}

export const getTechSupport = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/tech_support')
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении данных поддержки.'
      }
   )
}
