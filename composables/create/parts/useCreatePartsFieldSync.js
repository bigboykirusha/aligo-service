import { watch } from 'vue'

const normalizeFieldList = (fields) =>
   Array.isArray(fields) ? fields.filter(Boolean) : []

export const useCreatePartsFieldSync = (updateField) => {
   const clearFields = (fields, value = null) => {
      normalizeFieldList(fields).forEach((field) => {
         updateField(field, value)
      })
   }

   const clearOptionFields = (options, fieldKey = 'field', value = null) => {
      if (!Array.isArray(options)) return

      options.forEach((option) => {
         const field = option?.[fieldKey]
         if (!field) return
         updateField(field, value)
      })
   }

   const watchWhenFalseReset = (source, reset, options = { immediate: true }) =>
      watch(
         source,
         (value) => {
            if (value) return
            reset()
         },
         options
      )

   const createExclusiveDefectUpdater = ({ noneField, defectOptions }) => {
      const options = Array.isArray(defectOptions) ? defectOptions : []

      return (field, value) => {
         if (field === noneField && value) {
            options.forEach((option) => {
               const optionField = option?.field
               if (!optionField) return

               updateField(optionField, optionField === noneField ? 1 : 0)
            })
            return
         }

         if (field !== noneField && value) {
            updateField(noneField, 0)
         }

         updateField(field, value)
      }
   }

   return {
      clearFields,
      clearOptionFields,
      watchWhenFalseReset,
      createExclusiveDefectUpdater
   }
}
