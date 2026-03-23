import {
   sendCreateAdRequestWithValidation,
   updateCreateAdRequestWithValidation
} from './orchestration'

export const sendCreateStoreAd = async ({
   formData,
   createAdRequest,
   sendCreateAdRequest = sendCreateAdRequestWithValidation,
   onError = console.error
}) => {
   try {
      return await sendCreateAdRequest({
         formData,
         createAdRequest
      })
   } catch (error) {
      onError('Create advertisement request failed:', error)
      throw error
   }
}

export const updateCreateStoreAd = async ({
   id,
   formData,
   updateAdRequest,
   updateCreateAdRequest = updateCreateAdRequestWithValidation,
   onError = console.error
}) => {
   try {
      return await updateCreateAdRequest({
         id,
         formData,
         updateAdRequest
      })
   } catch (error) {
      onError('Update advertisement request failed:', error)
      throw error
   }
}
