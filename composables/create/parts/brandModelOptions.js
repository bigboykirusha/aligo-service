import { normalizeCreateOptions } from '~/store/createStore/optionsUtils'
import { titlesMatch } from '~/composables/create/parts/optionsPredicates'

const DEFAULT_BRAND_TITLE_KEYS = [
   'title',
   'name',
   'brand',
   'value',
   'label',
   'manufacturer',
   'brand_title',
   'brand_name',
   'display_name'
]

const DEFAULT_MODEL_TITLE_KEYS = [
   'title',
   'name',
   'model',
   'value',
   'label',
   'model_title',
   'model_name',
   'display_name'
]

export const normalizeCreateBrandOptions = (list, idKeys = []) =>
   normalizeCreateOptions(list, {
      idKeys: ['id', ...idKeys, 'value'],
      titleKeys: DEFAULT_BRAND_TITLE_KEYS
   })

export const normalizeCreateModelOptions = (list, idKeys = []) =>
   normalizeCreateOptions(list, {
      idKeys: ['id', ...idKeys, 'value'],
      titleKeys: DEFAULT_MODEL_TITLE_KEYS
   })

export const syncCreateBrandSelection = async ({
   brandOptionsRef,
   initialBrandId,
   manufacturer,
   setBrandId,
   setManufacturer,
   loadModels
}) => {
   let normalizedBrandId = initialBrandId

   if (
      normalizedBrandId &&
      manufacturer &&
      !brandOptionsRef.value.some(
         (option) => String(option.id) === String(normalizedBrandId)
      )
   ) {
      brandOptionsRef.value = [
         { id: normalizedBrandId, title: manufacturer },
         ...brandOptionsRef.value
      ]
   }

   if (!normalizedBrandId && manufacturer) {
      const matchedOption = brandOptionsRef.value.find((option) =>
         titlesMatch(option.title, manufacturer)
      )

      if (matchedOption) {
         normalizedBrandId = matchedOption.id
         setBrandId(matchedOption.id)
      }
   }

   if (normalizedBrandId) {
      const selectedBrand = brandOptionsRef.value.find(
         (option) => String(option.id) === String(normalizedBrandId)
      )

      if (selectedBrand && selectedBrand.title !== manufacturer) {
         setManufacturer(selectedBrand.title)
      }
   }

   await loadModels(normalizedBrandId, { local: true })
}
