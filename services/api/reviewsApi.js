/**
 * API для работы с отзывами
 */

import {
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField
} from '../apiUtils'

/**
 * Отправить отзыв
 */
export const sendReview = async (
   adsId,
   mainCategoryId,
   grade,
   comment,
   photos = []
) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const formData = new FormData()
         formData.append('ads_id', adsId)
         formData.append('main_category_id', mainCategoryId)
         formData.append('grade', grade)
         formData.append('comment', comment)
         photos.forEach((photo, index) =>
            formData.append(`photos[${index}]`, photo)
         )

         await apiClient.post('/reviews', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
      },
      {
         errorMessage: 'Ошибка при отправке отзыва.'
      }
   )
}

/**
 * Получить отзывы обо мне
 */
export const getAboutMeReviews = async (search = '') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = search ? { search } : undefined
         const response = await apiClient.get('/reviews/about_me', {
            params
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении отзывов обо мне.'
      }
   )
}

/**
 * Получить отзывы, оставленные мной
 */
export const getLeftToAnotherReviews = async (search = '') => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const params = search ? { search } : undefined
         const response = await apiClient.get('/reviews/left_to_another', {
            params
         })
         return getResponseDataField(response)
      },
      {
         errorMessage: 'Ошибка при получении отзывов другим пользователям.'
      }
   )
}

/**
 * Удалить отзыв
 */
export const deleteReview = async (review_id) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.delete(`/reviews/${review_id}`)
         return getResponseBody(response)
      },
      {
         errorMessage: 'Ошибка при удалении отзыва.'
      }
   )
}

/**
 * Ответить на отзыв
 */
export const replyToReview = async (reviewId, comment) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            `/reviews_comments/${reviewId}`,
            { comment }
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Произошла ошибка при ответе на отзыв.'
      }
   )
}

/**
 * Удалить ответ на отзыв
 */
export const deleteReviewReply = async (reviewCommentId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.delete(
            `/reviews_comments/${reviewCommentId}`
         )
         return getResponseBody(response)
      },
      {
         errorMessage: 'Произошла ошибка при удалении ответа на отзыв.'
      }
   )
}
