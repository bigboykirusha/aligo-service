import { isCreateFieldEmpty, toCreateApiError } from './helpers'
import { mapCreateStoreFromCarData } from './mappers'
import { getCreateTabsByFlow } from './tabs'

export const getConditionDependentCreateFieldEntries = (store) => {
   if (store?.condition_id !== 2) return []

   const fields = [
      ['mileage', store?.mileage],
      ['count_owners', store?.count_owners],
      ['state_id', store?.state_id]
   ]

   return fields.filter(([, value]) => !isCreateFieldEmpty(value))
}

export const applyConditionDependentCreateFields = async ({
   store,
   setField
}) => {
   const applyField =
      setField || ((field, value) => store.setField(field, value))

   for (const [field, value] of getConditionDependentCreateFieldEntries(store)) {
      await applyField(field, value)
   }
}

const ensureSuccessfulCreateMutationResponse = (response, fallbackMessage) => {
   if (response === null || response === undefined) {
      throw new Error(fallbackMessage)
   }

   const responseError = toCreateApiError(response, fallbackMessage)
   if (responseError) throw responseError
   return response
}

export const sendCreateAdRequestWithValidation = async ({
   formData,
   createAdRequest
}) => {
   if (typeof createAdRequest !== 'function') {
      throw new Error('Create request handler is not defined.')
   }

   const createdAd = await createAdRequest(formData)
   return ensureSuccessfulCreateMutationResponse(
      createdAd,
      'Failed to create advertisement.'
   )
}

export const updateCreateAdRequestWithValidation = async ({
   id,
   formData,
   updateAdRequest
}) => {
   if (typeof updateAdRequest !== 'function') {
      throw new Error('Update request handler is not defined.')
   }

   const updatedAd = await updateAdRequest(id, formData)
   return ensureSuccessfulCreateMutationResponse(
      updatedAd,
      'Failed to update advertisement.'
   )
}

export const applyCreateStoreFromApiData = ({
   store,
   carData,
   userStore,
   setActiveTab
}) => {
   const patch = mapCreateStoreFromCarData(carData, userStore, {
      fallbackFlow: store?.create_flow
   })
   Object.assign(store, patch)
   store.tabs = getCreateTabsByFlow(store.create_flow)

   if (typeof setActiveTab === 'function') {
      setActiveTab(store.activeTab)
   } else if (typeof store.setActiveTab === 'function') {
      store.setActiveTab(store.activeTab)
   }

   return patch
}

export const loadCreateStoreFromApi = async ({
   id,
   store,
   userStore,
   getCarByIdRequest
}) => {
   const carData = await getCarByIdRequest(id)
   applyCreateStoreFromApiData({ store, carData, userStore })
   return carData
}
