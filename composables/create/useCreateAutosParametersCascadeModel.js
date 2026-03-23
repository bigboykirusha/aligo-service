import { nextTick, ref } from 'vue'
import { getAutoFullInfo } from '@/services/apiClient'
import { isCreateSelectionEqual } from '@/composables/create/useCreateStorePatchApplier'

const AUTO_OPEN_STEP_DELAY_MS = 220

const buildAutoFilledResetPatch = ({ clearEquipmentId = true } = {}) => ({
   ...(clearEquipmentId ? { equipment_id: null } : {}),
   car_body_type_id: null,
   count_doors: null,
   engine_type_id: null,
   drive_id: null,
   transmission_id: null,
   engine_volume: null,
   power_range: null
})

export const useCreateAutosParametersCascadeModel = ({
   createStore,
   applyCreateStorePatch,
   isMobileViewport,
   dropdownModelsOptions,
   dropdownGenerationOptions,
   dropdownModificationOptions,
   dropdownEquipmentOptions,
   fetchModelsDropdownOptions,
   fetchGenerationDropdownOptions,
   fetchModificationDropdownOptions,
   fetchEquipmentDropdownOptions,
   cancelPendingOptionRequests = () => {}
}) => {
   const isAutoInfoLoading = ref(false)
   const isAutoInfoLocked = ref(false)
   const modelSelectRef = ref(null)
   const generationSelectRef = ref(null)
   const modificationSelectRef = ref(null)
   const equipmentSelectRef = ref(null)

   let autoInfoRequestId = 0
   let autoOpenStepTimer = null
   let cascadeActionId = 0

   const beginCascadeAction = () => {
      cascadeActionId += 1
      return cascadeActionId
   }

   const isCascadeActionCurrent = (actionId) => actionId === cascadeActionId

   const clearAutoOpenStepTimer = () => {
      if (autoOpenStepTimer === null) return
      clearTimeout(autoOpenStepTimer)
      autoOpenStepTimer = null
   }

   const openNextMobileSelect = async (selectRef) => {
      if (!isMobileViewport.value || !selectRef?.value) return
      clearAutoOpenStepTimer()
      await nextTick()
      autoOpenStepTimer = setTimeout(() => {
         selectRef.value?.openDropdown?.()
         autoOpenStepTimer = null
      }, AUTO_OPEN_STEP_DELAY_MS)
   }

   const resetAutoFilledFields = async ({
      clearEquipmentOptions = false,
      clearEquipmentId = true,
      persist = false,
      shouldContinue = () => true
   } = {}) => {
      autoInfoRequestId += 1
      isAutoInfoLoading.value = false
      isAutoInfoLocked.value = false

      if (clearEquipmentOptions) {
         dropdownEquipmentOptions.value = []
      }

      return applyCreateStorePatch(
         buildAutoFilledResetPatch({ clearEquipmentId }),
         { persist, shouldContinue }
      )
   }

   const fetchAutoFullInfoBySelection = async (modificationId, equipmentId) => {
      const brandId = createStore.brand_id
      const modelId = createStore.model_id
      const generationId = createStore.generation_id

      if (
         !brandId ||
         !modelId ||
         !generationId ||
         !modificationId ||
         !equipmentId
      ) {
         return
      }

      autoInfoRequestId += 1
      const requestId = autoInfoRequestId
      isAutoInfoLoading.value = true

      try {
         const data = await getAutoFullInfo({
            brand_id: brandId,
            model_id: modelId,
            generation_id: generationId,
            modification_id: modificationId,
            equipment_id: equipmentId
         })

         if (requestId !== autoInfoRequestId) return

         const fullInfo = Array.isArray(data)
            ? data.find(
                 (item) => Number(item?.equipment_id) === Number(equipmentId)
              ) || data[0]
            : null

         if (!fullInfo) {
            isAutoInfoLocked.value = false
            return
         }

         if (fullInfo.equipment_id && fullInfo.equipment) {
            const exists = dropdownEquipmentOptions.value.some(
               (option) => Number(option.id) === Number(fullInfo.equipment_id)
            )

            if (!exists) {
               dropdownEquipmentOptions.value = [
                  ...dropdownEquipmentOptions.value,
                  { id: fullInfo.equipment_id, title: fullInfo.equipment }
               ]
            }
         }

         const updates = {
            car_body_type_id: fullInfo.car_body_type_id ?? null,
            count_doors: fullInfo.count_doors ?? null,
            engine_type_id: fullInfo.engine_type_id ?? null,
            drive_id: fullInfo.drive_id ?? null,
            transmission_id: fullInfo.transmission_id ?? null,
            engine_volume: fullInfo.engine_volume ?? null,
            power_range: fullInfo.power_range ?? null
         }

         if (
            fullInfo.equipment_id !== undefined &&
            fullInfo.equipment_id !== null &&
            Number(fullInfo.equipment_id) !== Number(createStore.equipment_id)
         ) {
            updates.equipment_id = fullInfo.equipment_id
         }

         const patchResult = await applyCreateStorePatch(updates, {
            persist: true,
            shouldContinue: () => requestId === autoInfoRequestId
         })
         if (patchResult?.success === false) return

         isAutoInfoLocked.value = true
      } catch (error) {
         if (requestId === autoInfoRequestId) {
            isAutoInfoLocked.value = false
         }
         console.error('Create: failed to load auto full info:', error)
      } finally {
         if (requestId === autoInfoRequestId) {
            isAutoInfoLoading.value = false
         }
      }
   }

   const handleMarksUpdate = async (selectedBrandId) => {
      if (isCreateSelectionEqual(createStore.brand_id, selectedBrandId)) return
      const actionId = beginCascadeAction()

      cancelPendingOptionRequests(['models', 'generations', 'modifications', 'equipment'])
      dropdownModelsOptions.value = []
      dropdownGenerationOptions.value = []
      dropdownModificationOptions.value = []

      const applyBrandResult = await applyCreateStorePatch(
         {
            brand_id: selectedBrandId,
            model_id: null,
            generation_id: null,
            modification_id: null
         },
         { persist: true, shouldContinue: () => isCascadeActionCurrent(actionId) }
      )
      if (applyBrandResult?.success === false) return

      const resetResult = await resetAutoFilledFields({
         clearEquipmentOptions: true,
         persist: true,
         shouldContinue: () => isCascadeActionCurrent(actionId)
      })
      if (resetResult?.success === false) return

      if (selectedBrandId) {
         await fetchModelsDropdownOptions(selectedBrandId)
      }
      if (!isCascadeActionCurrent(actionId)) return

      if (selectedBrandId && dropdownModelsOptions.value.length > 0) {
         openNextMobileSelect(modelSelectRef)
      }
   }

   const handleModelsUpdate = async (selectedModelId) => {
      if (isCreateSelectionEqual(createStore.model_id, selectedModelId)) return
      const actionId = beginCascadeAction()

      cancelPendingOptionRequests(['generations', 'modifications', 'equipment'])
      dropdownGenerationOptions.value = []
      dropdownModificationOptions.value = []

      const applyModelResult = await applyCreateStorePatch(
         {
            model_id: selectedModelId,
            generation_id: null,
            modification_id: null
         },
         { persist: true, shouldContinue: () => isCascadeActionCurrent(actionId) }
      )
      if (applyModelResult?.success === false) return

      const resetResult = await resetAutoFilledFields({
         clearEquipmentOptions: true,
         persist: true,
         shouldContinue: () => isCascadeActionCurrent(actionId)
      })
      if (resetResult?.success === false) return

      if (createStore.brand_id && selectedModelId) {
         await fetchGenerationDropdownOptions(createStore.brand_id, selectedModelId)
      }
      if (!isCascadeActionCurrent(actionId)) return

      if (selectedModelId && dropdownGenerationOptions.value.length > 0) {
         openNextMobileSelect(generationSelectRef)
      }
   }

   const handleGenerationUpdate = async (selectedGenerationId) => {
      if (isCreateSelectionEqual(createStore.generation_id, selectedGenerationId))
         return
      const actionId = beginCascadeAction()

      cancelPendingOptionRequests(['modifications', 'equipment'])
      dropdownModificationOptions.value = []

      const applyGenerationResult = await applyCreateStorePatch(
         {
            generation_id: selectedGenerationId,
            modification_id: null
         },
         { persist: true, shouldContinue: () => isCascadeActionCurrent(actionId) }
      )
      if (applyGenerationResult?.success === false) return

      const resetResult = await resetAutoFilledFields({
         clearEquipmentOptions: true,
         persist: true,
         shouldContinue: () => isCascadeActionCurrent(actionId)
      })
      if (resetResult?.success === false) return

      if (createStore.brand_id && createStore.model_id && selectedGenerationId) {
         await Promise.all([
            fetchModificationDropdownOptions(
               createStore.brand_id,
               createStore.model_id,
               selectedGenerationId
            ),
            fetchEquipmentDropdownOptions(
               createStore.brand_id,
               createStore.model_id,
               selectedGenerationId
            )
         ])
      }
      if (!isCascadeActionCurrent(actionId)) return

      if (!selectedGenerationId) return

      if (dropdownModificationOptions.value.length > 0) {
         openNextMobileSelect(modificationSelectRef)
         return
      }

      if (dropdownEquipmentOptions.value.length > 0) {
         openNextMobileSelect(equipmentSelectRef)
      }
   }

   const handleModificationUpdate = async (selectedModificationId) => {
      if (
         isCreateSelectionEqual(createStore.modification_id, selectedModificationId)
      ) {
         return
      }
      const actionId = beginCascadeAction()

      const applyModificationResult = await applyCreateStorePatch(
         { modification_id: selectedModificationId },
         { persist: true, shouldContinue: () => isCascadeActionCurrent(actionId) }
      )
      if (applyModificationResult?.success === false) return

      const resetResult = await resetAutoFilledFields({
         persist: true,
         shouldContinue: () => isCascadeActionCurrent(actionId)
      })
      if (resetResult?.success === false) return
      if (!isCascadeActionCurrent(actionId)) return

      if (selectedModificationId && dropdownEquipmentOptions.value.length > 0) {
         openNextMobileSelect(equipmentSelectRef)
      }
   }

   const handleEquipmentUpdate = async (selectedEquipmentId) => {
      if (isCreateSelectionEqual(createStore.equipment_id, selectedEquipmentId))
         return
      const actionId = beginCascadeAction()

      const applyEquipmentResult = await applyCreateStorePatch(
         { equipment_id: selectedEquipmentId },
         { persist: true, shouldContinue: () => isCascadeActionCurrent(actionId) }
      )
      if (applyEquipmentResult?.success === false) return

      const resetResult = await resetAutoFilledFields({
         clearEquipmentId: false,
         persist: true,
         shouldContinue: () => isCascadeActionCurrent(actionId)
      })
      if (resetResult?.success === false) return
      if (!isCascadeActionCurrent(actionId)) return
      await fetchAutoFullInfoBySelection(
         createStore.modification_id,
         selectedEquipmentId
      )
   }

   const setAutoInfoLocked = (value) => {
      isAutoInfoLocked.value = Boolean(value)
   }

   return {
      isAutoInfoLoading,
      isAutoInfoLocked,
      modelSelectRef,
      generationSelectRef,
      modificationSelectRef,
      equipmentSelectRef,
      clearAutoOpenStepTimer,
      fetchAutoFullInfoBySelection,
      handleMarksUpdate,
      handleModelsUpdate,
      handleGenerationUpdate,
      handleModificationUpdate,
      handleEquipmentUpdate,
      setAutoInfoLocked
   }
}
