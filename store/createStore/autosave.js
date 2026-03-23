import { appendCreateFieldToFormData } from './helpers'

const isFileValue = (value) =>
   typeof File !== 'undefined' && value instanceof File

export const appendCreateAutosaveFieldToFormData = (formData, field, value) => {
   if (field === 'photos' && isFileValue(value)) {
      formData.append('photos[]', value)
      return
   }

   if (field === 'ids_delete_photos' && typeof value === 'number') {
      formData.append('ids_delete_photos[]', value)
      return
   }

   if (field === 'color_ids' && typeof value === 'number') {
      formData.append('color_ids[]', value)
      return
   }

   appendCreateFieldToFormData(formData, field, value)
}

export const appendCreateAutosaveContextToFormData = (
   formData,
   {
      field,
      isDraft,
      id,
      conditionId,
      mainCategoryId = null,
      subCategoryId = null,
      lastCategoryId = null
   }
) => {
   const appendCategoryIdIfPresent = (key, value) => {
      if (value === null || value === undefined || value === '') return
      const normalized = Number(value)
      if (!Number.isFinite(normalized)) return
      formData.append(key, normalized)
   }

   if (field !== 'is_draft') {
      formData.append('is_draft', isDraft)
   }

   appendCategoryIdIfPresent('main_category_id', mainCategoryId)
   appendCategoryIdIfPresent('sub_category_id', subCategoryId)
   appendCategoryIdIfPresent('last_category_id', lastCategoryId)

   if (
      !id &&
      field !== 'condition_id' &&
      conditionId !== null &&
      conditionId !== undefined &&
      conditionId !== ''
   ) {
      formData.append('condition_id', conditionId)
   }

   if (id) {
      formData.append('id', id)
      formData.append('is_cancelled', 0)
   }
}
