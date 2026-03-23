import { isAutogoodsCreateFlow } from './flows'
import {
   AUTOGOODS_FLOW_CONDITION_STORE_FIELD,
   getAutogoodsStoreToApiFieldMap,
   isAutogoodsStoreFieldKey
} from './autogoodsFieldMap'

const isFilledValue = (value) =>
   value !== null && value !== undefined && value !== ''

export const remapAutogoodsCreateFormDataForApi = ({
   formData,
   flow,
   store
}) => {
   if (!isAutogoodsCreateFlow(flow)) return formData
   if (!formData || typeof formData.entries !== 'function') return formData

   const storeToApiMap = getAutogoodsStoreToApiFieldMap(flow) || {}
   const mappedFormData = new FormData()
   let hasConditionField = false
   const appendedApiFields = new Set()

   for (const [field, value] of formData.entries()) {
      const mappedField = storeToApiMap[field]
      if (typeof mappedField === 'string') {
         mappedFormData.append(mappedField, value)
         appendedApiFields.add(mappedField)
         if (mappedField === 'condition_id') {
            hasConditionField = true
         }
         continue
      }

      if (isAutogoodsStoreFieldKey(field)) {
         continue
      }

      mappedFormData.append(field, value)
      appendedApiFields.add(field)
      if (field === 'condition_id') {
         hasConditionField = true
      }
   }

   Object.entries(storeToApiMap).forEach(([storeField, apiField]) => {
      if (
         typeof apiField !== 'string' ||
         appendedApiFields.has(apiField)
      ) {
         return
      }

      const storeValue = store?.[storeField]
      if (!isFilledValue(storeValue)) return

      mappedFormData.append(apiField, storeValue)
      appendedApiFields.add(apiField)
   })

   if (!hasConditionField) {
      const conditionStoreField = AUTOGOODS_FLOW_CONDITION_STORE_FIELD[flow]
      const conditionValue = store?.[conditionStoreField]
      if (isFilledValue(conditionValue)) {
         mappedFormData.append('condition_id', conditionValue)
      }
   }

   return mappedFormData
}
