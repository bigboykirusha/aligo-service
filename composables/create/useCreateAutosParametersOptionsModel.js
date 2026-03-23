import { ref } from 'vue'
import {
   getCarBodyType,
   getCarBrands,
   getCarCountry,
   getCarDrive,
   getCarEngineType,
   getCarEquipment,
   getCarGenerations,
   getCarsHandlebar,
   getCarModels,
   getCarModifications,
   getCarsOwners,
   getCarsPts,
   getCarState,
   getCarTransmission,
   getColors,
   getYear
} from '@/services/apiClient'
import { fetchDataWithCache } from '@/services/createUtils'
import { normalizeCreateOptions } from '@/store/createStore/optionsUtils'

const CAR_CONDITION_OPTIONS = Object.freeze([
   Object.freeze({ id: 1, title: 'Новые' }),
   Object.freeze({ id: 2, title: 'С пробегом' })
])

export const useCreateAutosParametersOptionsModel = () => {
   const conditionOptions = ref([...CAR_CONDITION_OPTIONS])
   const dropdownMarksOptions = ref([])
   const dropdownModelsOptions = ref([])
   const dropdownGenerationOptions = ref([])
   const dropdownModificationOptions = ref([])
   const dropdownEquipmentOptions = ref([])
   const isModelsLoading = ref(false)
   const isGenerationsLoading = ref(false)
   const isModificationsLoading = ref(false)
   const isEquipmentLoading = ref(false)
   const dropdownTransmissionOptions = ref([])
   const checkboxBodyTypeOptions = ref([])
   const checkboxEngineTypeOptions = ref([])
   const checkboxDriveOptions = ref([])
   const switcherStateOptions = ref([])
   const colorOptions = ref([])
   const countryOptions = ref([])
   const ownersOptions = ref([])
   const yearOptions = ref([])
   const handlebarIdOptions = ref([])
   const ptsOptions = ref([])
   const requestVersionByKey = {
      models: 0,
      generations: 0,
      modifications: 0,
      equipment: 0
   }

   const beginRequest = (requestKey) => {
      requestVersionByKey[requestKey] += 1
      return requestVersionByKey[requestKey]
   }

   const isLatestRequest = (requestKey, requestVersion) =>
      requestVersionByKey[requestKey] === requestVersion

   const cancelPendingOptionRequests = (requestKeys = []) => {
      requestKeys.forEach((requestKey) => {
         if (!(requestKey in requestVersionByKey)) return
         requestVersionByKey[requestKey] += 1
      })

      if (requestKeys.includes('models')) isModelsLoading.value = false
      if (requestKeys.includes('generations')) isGenerationsLoading.value = false
      if (requestKeys.includes('modifications')) isModificationsLoading.value = false
      if (requestKeys.includes('equipment')) isEquipmentLoading.value = false
   }

   const fetchMarksDropdownOptions = async () => {
      dropdownMarksOptions.value = await fetchDataWithCache(
         'dropdownMarksOptions',
         getCarBrands
      )
   }

   const fetchPtsOptions = async () => {
      ptsOptions.value = await fetchDataWithCache('ptsOptions', getCarsPts)
   }

   const fetchHandlebarOptions = async () => {
      handlebarIdOptions.value = await fetchDataWithCache(
         'handlebarIdOptions',
         getCarsHandlebar
      )
   }

   const fetchColorOptions = async () => {
      colorOptions.value = await fetchDataWithCache('colorOptions', getColors)
   }

   const fetchTransmissionDropdownOptions = async () => {
      dropdownTransmissionOptions.value = await fetchDataWithCache(
         'dropdownTransmissionOptions',
         getCarTransmission
      )
   }

   const fetchBodyTypeOptions = async () => {
      checkboxBodyTypeOptions.value = await fetchDataWithCache(
         'checkboxBodyTypeOptions',
         getCarBodyType
      )
   }

   const fetchEngineTypeOptions = async () => {
      checkboxEngineTypeOptions.value = await fetchDataWithCache(
         'checkboxEngineTypeOptions',
         getCarEngineType
      )
   }

   const fetchOwnersOptions = async () => {
      ownersOptions.value = await fetchDataWithCache('ownersOptions', getCarsOwners)
   }

   const fetchDriveOptions = async () => {
      checkboxDriveOptions.value = await fetchDataWithCache(
         'checkboxDriveOptions',
         getCarDrive
      )
   }

   const fetchStateOptions = async () => {
      switcherStateOptions.value = await fetchDataWithCache(
         'switcherStateOptions',
         getCarState
      )
   }

   const fetchCountryOptions = async () => {
      countryOptions.value = await fetchDataWithCache('countryOptions', getCarCountry)
   }

   const fetchYearOptions = async () => {
      const options = await fetchDataWithCache('yearOptions', getYear)
      if (!Array.isArray(options)) {
         yearOptions.value = []
         return
      }

      yearOptions.value = [...options].sort((a, b) => {
         const aValue = Number(a?.title ?? a?.id ?? 0)
         const bValue = Number(b?.title ?? b?.id ?? 0)
         if (Number.isFinite(aValue) && Number.isFinite(bValue)) {
            return bValue - aValue
         }
         return String(b?.title ?? b?.id ?? '').localeCompare(
            String(a?.title ?? a?.id ?? '')
         )
      })
   }

   const fetchModelsDropdownOptions = async (brandId) => {
      const requestVersion = beginRequest('models')
      isModelsLoading.value = true

      if (!brandId) {
         dropdownModelsOptions.value = []
         isModelsLoading.value = false
         return
      }

      try {
         const options = await getCarModels(brandId)

         if (!isLatestRequest('models', requestVersion)) return
         dropdownModelsOptions.value = options
      } catch (error) {
         if (!isLatestRequest('models', requestVersion)) return
         console.error('Create: failed to load car models:', error)
         dropdownModelsOptions.value = []
      } finally {
         if (isLatestRequest('models', requestVersion)) {
            isModelsLoading.value = false
         }
      }
   }

   const fetchGenerationDropdownOptions = async (brandId, modelId) => {
      const requestVersion = beginRequest('generations')
      isGenerationsLoading.value = true

      if (!brandId || !modelId) {
         dropdownGenerationOptions.value = []
         isGenerationsLoading.value = false
         return
      }

      try {
         const options = await getCarGenerations(brandId, modelId)

         if (!isLatestRequest('generations', requestVersion)) return
         dropdownGenerationOptions.value = options
      } catch (error) {
         if (!isLatestRequest('generations', requestVersion)) return
         console.error('Create: failed to load car generations:', error)
         dropdownGenerationOptions.value = []
      } finally {
         if (isLatestRequest('generations', requestVersion)) {
            isGenerationsLoading.value = false
         }
      }
   }

   const fetchModificationDropdownOptions = async (
      brandId,
      modelId,
      generationId
   ) => {
      const requestVersion = beginRequest('modifications')
      isModificationsLoading.value = true

      if (!brandId || !modelId || !generationId) {
         dropdownModificationOptions.value = []
         isModificationsLoading.value = false
         return
      }

      try {
         const response = await getCarModifications(
            brandId,
            modelId,
            generationId
         )
         if (!isLatestRequest('modifications', requestVersion)) return
         dropdownModificationOptions.value = normalizeCreateOptions(response, {
            idKeys: ['id', 'modification_id'],
            titleKeys: ['title', 'modification']
         })
      } catch (error) {
         if (!isLatestRequest('modifications', requestVersion)) return
         console.error('Create: failed to load car modifications:', error)
         dropdownModificationOptions.value = []
      } finally {
         if (isLatestRequest('modifications', requestVersion)) {
            isModificationsLoading.value = false
         }
      }
   }

   const fetchEquipmentDropdownOptions = async (brandId, modelId, generationId) => {
      const requestVersion = beginRequest('equipment')
      isEquipmentLoading.value = true

      if (!brandId || !modelId || !generationId) {
         dropdownEquipmentOptions.value = []
         isEquipmentLoading.value = false
         return
      }

      try {
         const response = await getCarEquipment(
            brandId,
            modelId,
            generationId
         )
         if (!isLatestRequest('equipment', requestVersion)) return
         dropdownEquipmentOptions.value = normalizeCreateOptions(response, {
            idKeys: ['id', 'equipment_id'],
            titleKeys: ['title', 'equipment']
         })
      } catch (error) {
         if (!isLatestRequest('equipment', requestVersion)) return
         console.error('Create: failed to load car equipment:', error)
         dropdownEquipmentOptions.value = []
      } finally {
         if (isLatestRequest('equipment', requestVersion)) {
            isEquipmentLoading.value = false
         }
      }
   }

   const loadBaseOptions = async () =>
      Promise.all([
         fetchMarksDropdownOptions(),
         fetchTransmissionDropdownOptions(),
         fetchBodyTypeOptions(),
         fetchEngineTypeOptions(),
         fetchDriveOptions(),
         fetchColorOptions(),
         fetchStateOptions(),
         fetchCountryOptions(),
         fetchYearOptions(),
         fetchOwnersOptions(),
         fetchHandlebarOptions(),
         fetchPtsOptions()
      ])

   return {
      conditionOptions,
      dropdownMarksOptions,
      dropdownModelsOptions,
      dropdownGenerationOptions,
      dropdownModificationOptions,
      dropdownEquipmentOptions,
      isModelsLoading,
      isGenerationsLoading,
      isModificationsLoading,
      isEquipmentLoading,
      dropdownTransmissionOptions,
      checkboxBodyTypeOptions,
      checkboxEngineTypeOptions,
      checkboxDriveOptions,
      switcherStateOptions,
      colorOptions,
      countryOptions,
      ownersOptions,
      yearOptions,
      handlebarIdOptions,
      ptsOptions,
      loadBaseOptions,
      fetchModelsDropdownOptions,
      fetchGenerationDropdownOptions,
      fetchModificationDropdownOptions,
      fetchEquipmentDropdownOptions,
      cancelPendingOptionRequests
   }
}
