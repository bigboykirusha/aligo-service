const isNilSelection = (value) =>
   value === null || value === undefined || value === ''

export const isCreateSelectionEqual = (left, right) => {
   if (isNilSelection(left)) return isNilSelection(right)
   if (isNilSelection(right)) return false
   return String(left) === String(right)
}

const isCreateFieldValueEqual = (left, right) => {
   if (Array.isArray(left) || Array.isArray(right)) {
      const leftArray = Array.isArray(left) ? left : []
      const rightArray = Array.isArray(right) ? right : []
      if (leftArray.length !== rightArray.length) return false
      return leftArray.every((value, index) => value === rightArray[index])
   }

   return isCreateSelectionEqual(left, right)
}

export const useCreateStorePatchApplier = (createStore) => {
   const applyCreateStorePatch = async (
      patch = {},
      {
         persist = false,
         shouldContinue = () => true,
         stopOnPersistError = true
      } = {}
   ) => {
      const entries = Object.entries(patch)
      const changedEntries = entries.filter(
         ([field, value]) => !isCreateFieldValueEqual(createStore[field], value)
      )

      if (!persist) {
         changedEntries.forEach(([field, value]) => {
            createStore[field] = value
         })
         return { success: true, changedCount: changedEntries.length }
      }

      for (const [field, value] of changedEntries) {
         if (!shouldContinue()) {
            return { success: false, cancelled: true, failedField: field }
         }

         const previousValue = createStore[field]

         try {
            const response = await createStore.setField(field, value)
            if (response?.success === false) {
               createStore[field] = previousValue
               if (stopOnPersistError) {
                  return {
                     success: false,
                     failedField: field,
                     error: response.error || null
                  }
               }
            }
         } catch (error) {
            createStore[field] = previousValue
            if (stopOnPersistError) {
               return {
                  success: false,
                  failedField: field,
                  error
               }
            }
         }
      }

      return { success: true, changedCount: changedEntries.length }
   }

   return { applyCreateStorePatch }
}
