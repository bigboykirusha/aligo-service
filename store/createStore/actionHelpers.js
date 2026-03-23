import { isCreateFieldEmpty } from './helpers'

const pickFirstNonEmptyValue = (...values) => {
   for (const value of values) {
      if (!isCreateFieldEmpty(value)) return value
   }
   return null
}

const setFieldWhenStoreValueIsEmpty = ({
   fieldsToSave,
   key,
   storeValue,
   fallbackValue
}) => {
   if (!isCreateFieldEmpty(storeValue)) return
   if (isCreateFieldEmpty(fallbackValue)) return
   fieldsToSave[key] = fallbackValue
}

export const buildCreateUserInitializationData = ({
   store,
   userStore
}) => {
   if (store?.create_by_user_id) {
      return {
         localUserFields: {
            username: pickFirstNonEmptyValue(store?.username),
            email: pickFirstNonEmptyValue(store?.email),
            phone: pickFirstNonEmptyValue(store?.phone)
         },
         fieldsToSave: {}
      }
   }

   const latitude = pickFirstNonEmptyValue(
      store?.latitude,
      userStore?.latitude
   )
   const longitude = pickFirstNonEmptyValue(
      store?.longitude,
      userStore?.longitude
   )

   const localUserFields = {
      username: pickFirstNonEmptyValue(store?.username, userStore?.username),
      email: pickFirstNonEmptyValue(
         store?.email,
         userStore?.unconfirmed_email,
         userStore?.email
      ),
      phone: pickFirstNonEmptyValue(store?.phone, userStore?.phoneNumber)
   }

   const fieldsToSave = {}
   setFieldWhenStoreValueIsEmpty({
      fieldsToSave,
      key: 'latitude',
      storeValue: store?.latitude,
      fallbackValue: latitude
   })
   setFieldWhenStoreValueIsEmpty({
      fieldsToSave,
      key: 'longitude',
      storeValue: store?.longitude,
      fallbackValue: longitude
   })

   return { localUserFields, fieldsToSave }
}

export const shouldSkipCreateSetFieldAutosave = ({
   field,
   value,
   id
}) => {
   if (field === 'photos') return true
   if (!id && isCreateFieldEmpty(value)) return true
   if (field === 'condition_id' && !id) return true
   return false
}

export const finalizeCreateAutosaveCreateResponse = ({
   store,
   response,
   onInitializeUserDataError
}) => {
   if (!response?.id) {
      throw new Error('Server did not return id for created advertisement.')
   }

   store.id = response.id
   store.id_user_owner_ads = response.id_user_owner_ads

   store.initializeUserData().catch((error) => {
      console.error('Create user initialization failed:', error)
      if (typeof onInitializeUserDataError === 'function') {
         onInitializeUserDataError(error)
      }
   })

   return response
}
