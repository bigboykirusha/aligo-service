import { isCreateFieldEmpty, toCreateApiError } from './helpers'
import {
   beginCreateAutosaveTracking,
   completeCreateAutosaveTrackingError,
   completeCreateAutosaveTrackingSuccess,
   finalizeCreateAutosaveTracking
} from './autosaveStatus'
import {
   appendCreateAutosaveFieldToFormData
} from './autosave'
import {
   buildCreateUserInitializationData,
   finalizeCreateAutosaveCreateResponse,
   shouldSkipCreateSetFieldAutosave
} from './actionHelpers'
import {
   applyConditionDependentCreateFields,
   loadCreateStoreFromApi
} from './orchestration'
import {
   getCreateDraftInFlightPromise,
   setCreateDraftInFlightPromise
} from './draftInFlight'
import { enqueueCreateFieldAutosave } from './fieldAutosaveQueue'

export const initializeCreateUserData = async ({
   store,
   userStore
}) => {
   if (store.isUserDataInitialized || store.isUserDataInitializing) return
   store.isUserDataInitializing = true

   try {
      const { localUserFields, fieldsToSave } = buildCreateUserInitializationData({
         store,
         userStore
      })

      if (isCreateFieldEmpty(store.username)) {
         store.username = localUserFields.username
      }
      if (isCreateFieldEmpty(store.email)) {
         store.email = localUserFields.email
      }
      if (isCreateFieldEmpty(store.phone)) {
         store.phone = localUserFields.phone
      }

      for (const [field, value] of Object.entries(fieldsToSave)) {
         await store.setField(field, value)
      }
      store.isUserDataInitialized = true
   } finally {
      store.isUserDataInitializing = false
   }
}

export const updateCreateConditionDependentFields = async ({ store }) => {
   await applyConditionDependentCreateFields({ store })
}

const isCreateFieldEmptyLikeValue = (value) =>
   value === null || value === undefined || value === ''

const isUnchangedCreateFieldValue = (previousValue, nextValue) => {
   if (Object.is(previousValue, nextValue)) return true

   return (
      isCreateFieldEmptyLikeValue(previousValue) &&
      isCreateFieldEmptyLikeValue(nextValue)
   )
}

export const setCreateFieldWithAutosave = async ({ store, field, value }) => {
   const previousValue = store[field]
   store[field] = value

   if (isUnchangedCreateFieldValue(previousValue, value)) {
      return { success: true, skipped: true }
   }

   if (
      shouldSkipCreateSetFieldAutosave({
         field,
         value,
         id: store.id
      })
   ) {
      return { success: true, skipped: true }
   }

   try {
      const persistBatch =
         typeof store.autoSaveFields === 'function'
            ? (entries) => {
                 const patch = Object.fromEntries(entries)
                 return store.autoSaveFields.call(store, patch)
              }
            : null

      const response = await enqueueCreateFieldAutosave({
         store,
         field,
         value,
         persist: (queuedField, queuedValue) =>
            store.autoSaveField(queuedField, queuedValue),
         persistBatch
      })

      if (field === 'condition_id' && value === 2) {
         await store.updateConditionDependentFields()
      }

      return response
   } catch (error) {
      if (field === 'is_draft') {
         store[field] = previousValue
      }
      console.error(`Create field autosave failed for "${field}":`, error)
      return { success: false, error }
   }
}

const isCreateFieldPresent = (patch, field) =>
   Object.prototype.hasOwnProperty.call(patch || {}, field)

const toCreateContextNumberOrNull = (value) => {
   if (value === null || value === undefined || value === '') return null
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const appendCreateAutosaveContextCategoryField = (
   formData,
   { store, patch, field }
) => {
   if (isCreateFieldPresent(patch, field)) return

   const fieldValue = toCreateContextNumberOrNull(store?.[field])
   if (fieldValue === null) return
   formData.append(field, fieldValue)
}

const appendCreateAutosaveBatchContextToFormData = (formData, { store, patch }) => {
   if (!isCreateFieldPresent(patch, 'is_draft')) {
      formData.append('is_draft', store.is_draft)
   }

   appendCreateAutosaveContextCategoryField(formData, {
      store,
      patch,
      field: 'main_category_id'
   })
   appendCreateAutosaveContextCategoryField(formData, {
      store,
      patch,
      field: 'sub_category_id'
   })
   appendCreateAutosaveContextCategoryField(formData, {
      store,
      patch,
      field: 'last_category_id'
   })
   appendCreateAutosaveContextCategoryField(formData, {
      store,
      patch,
      field: 'create_by_user_id'
   })

   if (store.id) {
      formData.append('id', store.id)
      formData.append('is_cancelled', 0)
      return
   }

   const conditionId = isCreateFieldPresent(patch, 'condition_id')
      ? patch.condition_id
      : store.condition_id

   if (conditionId !== null && conditionId !== undefined && conditionId !== '') {
      formData.append('condition_id', conditionId)
   }
}

const appendCreateAutosavePatchToFormData = (formData, patch = {}) => {
   Object.entries(patch).forEach(([field, fieldValue]) => {
      appendCreateAutosaveFieldToFormData(formData, field, fieldValue)
   })
}

const getAutosaveActionMethods = (store) => ({
   updateAd: store.updateAd,
   sendAd: store.sendAd
})

const ensureAutosaveActionMethod = (method, methodName) => {
   if (typeof method === 'function') return
   throw new Error(`Create autosave method "${methodName}" is not defined.`)
}

const runCreateAutosaveMutation = async ({ store, patch }) => {
   const existingCreateDraftPromise = getCreateDraftInFlightPromise(store)
   if (!store.id && existingCreateDraftPromise) {
      await existingCreateDraftPromise
   }

   const formData = new FormData()
   appendCreateAutosaveBatchContextToFormData(formData, { store, patch })
   appendCreateAutosavePatchToFormData(formData, patch)

   const { updateAd, sendAd } = getAutosaveActionMethods(store)

   if (store.id) {
      ensureAutosaveActionMethod(updateAd, 'updateAd')
      const response = await updateAd.call(store, formData)
      const responseError = toCreateApiError(
         response,
         'Failed to update advertisement.'
      )
      if (responseError) throw responseError
      return response
   }

   const createDraftRequestPromise = (async () => {
      ensureAutosaveActionMethod(sendAd, 'sendAd')
      const response = await sendAd.call(store, formData)
      const responseError = toCreateApiError(
         response,
         'Failed to create advertisement.'
      )
      if (responseError) throw responseError
      return finalizeCreateAutosaveCreateResponse({
         store,
         response
      })
   })()

   setCreateDraftInFlightPromise(store, createDraftRequestPromise)

   try {
      return await createDraftRequestPromise
   } finally {
      if (getCreateDraftInFlightPromise(store) === createDraftRequestPromise) {
         setCreateDraftInFlightPromise(store, null)
      }
   }
}

export const autoSaveCreateField = async ({ store, field, value }) => {
   return autoSaveCreateFields({
      store,
      patch: { [field]: value },
      trackedField: field
   })
}

export const autoSaveCreateFields = async ({
   store,
   patch = {},
   trackedField = null
}) => {
   const entries = Object.entries(patch).filter(([field]) => Boolean(field))
   if (!entries.length) {
      return { success: true, skipped: true }
   }

   const normalizedPatch = Object.fromEntries(entries)
   const fallbackTrackedField = trackedField || entries[0][0]

   beginCreateAutosaveTracking(store)

   try {
      const response = await runCreateAutosaveMutation({
         store,
         patch: normalizedPatch
      })
      completeCreateAutosaveTrackingSuccess(store)
      return response
   } catch (error) {
      completeCreateAutosaveTrackingError(store, {
         field: fallbackTrackedField,
         error
      })
      console.error(
         `Create autosave failed for field "${fallbackTrackedField}":`,
         error
      )
      throw error
   } finally {
      finalizeCreateAutosaveTracking(store)
   }
}

export const fillCreateStoreFromApi = async ({
   id,
   store,
   userStore,
   getCarByIdRequest
}) => {
   await loadCreateStoreFromApi({
      id,
      store,
      userStore,
      getCarByIdRequest
   })
}
