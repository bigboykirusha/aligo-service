import { computed, ref, unref } from 'vue'

const isRequiredFieldValueEmpty = (value) => {
   if (value === null || value === undefined) return true
   if (typeof value === 'string') return value.trim() === ''
   if (Array.isArray(value)) return value.length === 0
   return false
}

export const useDraftRequiredFieldHighlight = (isDraftEditModeSource) => {
   const dismissedRequiredFields = ref({})

   const isDraftEditMode = computed(() =>
      Boolean(unref(isDraftEditModeSource))
   )

   const shouldHighlightRequiredField = (field, value, condition = true) => {
      if (!condition || !isDraftEditMode.value) return false
      if (dismissedRequiredFields.value[field]) return false
      return isRequiredFieldValueEmpty(value)
   }

   const dismissRequiredField = (field) => {
      dismissedRequiredFields.value = {
         ...dismissedRequiredFields.value,
         [field]: true
      }
   }

   const resetDismissedRequiredFields = () => {
      dismissedRequiredFields.value = {}
   }

   return {
      shouldHighlightRequiredField,
      dismissRequiredField,
      resetDismissedRequiredFields
   }
}
