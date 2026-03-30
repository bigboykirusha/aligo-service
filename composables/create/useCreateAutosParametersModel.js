import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCreateStore } from '@/store/create'
import { useDraftRequiredFieldHighlight } from '@/composables/create/useDraftRequiredFieldHighlight'
import { useCreateStorePatchApplier } from '@/composables/create/useCreateStorePatchApplier'
import { useCreateAutosParametersOptionsModel } from '@/composables/create/useCreateAutosParametersOptionsModel'
import { useCreateAutosParametersCascadeModel } from '@/composables/create/useCreateAutosParametersCascadeModel'

export const useCreateAutosParametersModel = () => {
   const loading = ref(true)
   const isMobileViewport = ref(false)
   const vinHelpRef = ref(null)

   const createStore = useCreateStore()
   const { applyCreateStorePatch } = useCreateStorePatchApplier(createStore)

   const optionsModel = useCreateAutosParametersOptionsModel()

   const cascadeModel = useCreateAutosParametersCascadeModel({
      createStore,
      applyCreateStorePatch,
      isMobileViewport,
      dropdownModelsOptions: optionsModel.dropdownModelsOptions,
      dropdownGenerationOptions: optionsModel.dropdownGenerationOptions,
      dropdownModificationOptions: optionsModel.dropdownModificationOptions,
      dropdownEquipmentOptions: optionsModel.dropdownEquipmentOptions,
      fetchModelsDropdownOptions: optionsModel.fetchModelsDropdownOptions,
      fetchGenerationDropdownOptions: optionsModel.fetchGenerationDropdownOptions,
      fetchModificationDropdownOptions: optionsModel.fetchModificationDropdownOptions,
      fetchEquipmentDropdownOptions: optionsModel.fetchEquipmentDropdownOptions,
      cancelPendingOptionRequests: optionsModel.cancelPendingOptionRequests
   })

   const isDraftEditMode = computed(() => Boolean(createStore.isDraftEditMode))
   const { shouldHighlightRequiredField, dismissRequiredField } =
      useDraftRequiredFieldHighlight(isDraftEditMode)

   const showStateNumber = computed(
      () =>
         createStore.country_id !== null &&
         createStore.country_id !== undefined &&
         Number(createStore.country_id) !== 1
   )
   const showDraftRecoveryConditionField = computed(
      () => !createStore.condition_id
   )
   const showUsedOptions = computed(() => Number(createStore.condition_id) === 2)
   const showModelField = computed(() => Boolean(createStore.brand_id))
   const showGenerationField = computed(() => Boolean(createStore.model_id))
   const showModificationField = computed(() => Boolean(createStore.generation_id))
   const showEquipmentField = computed(() => Boolean(createStore.modification_id))
   const isModelSelectDisabled = computed(
      () =>
         optionsModel.isModelsLoading.value ||
         optionsModel.dropdownModelsOptions.value.length === 0
   )
   const isGenerationSelectDisabled = computed(
      () =>
         optionsModel.isGenerationsLoading.value ||
         optionsModel.dropdownGenerationOptions.value.length === 0
   )
   const isModificationSelectDisabled = computed(
      () =>
         optionsModel.isModificationsLoading.value ||
         optionsModel.dropdownModificationOptions.value.length === 0
   )
   const isEquipmentSelectDisabled = computed(
      () =>
         optionsModel.isEquipmentLoading.value ||
         optionsModel.dropdownEquipmentOptions.value.length === 0
   )

   const hasAutoInfoValues = computed(() =>
      [
         createStore.car_body_type_id,
         createStore.count_doors,
         createStore.engine_type_id,
         createStore.drive_id,
         createStore.transmission_id,
         createStore.engine_volume,
         createStore.power_range
      ].some((field) => field !== null && field !== '' && field !== undefined)
   )

   const hasAutoInfoSelection = computed(() => Boolean(createStore.equipment_id))

   const showAutoInfoFields = computed(
      () =>
         cascadeModel.isAutoInfoLoading.value ||
         cascadeModel.isAutoInfoLocked.value ||
         hasAutoInfoValues.value ||
         hasAutoInfoSelection.value
   )

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   const updateIsMobileViewport = () => {
      if (!import.meta.client) return
      isMobileViewport.value = window.innerWidth <= 768
   }

   const handleVinLabelClick = () => {
      vinHelpRef.value?.openIfMobile?.()
   }

   const loadOptions = async () => {
      loading.value = true

      try {
         await optionsModel.loadBaseOptions()

         if (createStore.brand_id) {
            await optionsModel.fetchModelsDropdownOptions(createStore.brand_id)
         }

         if (createStore.model_id) {
            await optionsModel.fetchGenerationDropdownOptions(
               createStore.brand_id,
               createStore.model_id
            )
         }

         if (createStore.generation_id) {
            await Promise.all([
               optionsModel.fetchModificationDropdownOptions(
                  createStore.brand_id,
                  createStore.model_id,
                  createStore.generation_id
               ),
               optionsModel.fetchEquipmentDropdownOptions(
                  createStore.brand_id,
                  createStore.model_id,
                  createStore.generation_id
               )
            ])
         }

         if (createStore.modification_id && createStore.equipment_id) {
            await cascadeModel.fetchAutoFullInfoBySelection(
               createStore.modification_id,
               createStore.equipment_id
            )
         } else if (hasAutoInfoValues.value) {
            cascadeModel.setAutoInfoLocked(true)
         }

         // For edit flows, auto specs can arrive in a second async patch
         // after the initial store hydration. Refresh the dirty baseline
         // only after all dependent auto data has finished loading.
         if (createStore.id) {
            createStore.markCurrentStateAsInitial()
         }
      } catch (error) {
         console.error('Create: failed to load autos parameters options:', error)
      } finally {
         loading.value = false
      }
   }

   onMounted(() => {
      loadOptions()
      updateIsMobileViewport()

      if (import.meta.client) {
         window.addEventListener('resize', updateIsMobileViewport, {
            passive: true
         })
      }
   })

   onBeforeUnmount(() => {
      cascadeModel.clearAutoOpenStepTimer()

      if (import.meta.client) {
         window.removeEventListener('resize', updateIsMobileViewport)
      }
   })

   return {
      loading,
      isAutoInfoLoading: cascadeModel.isAutoInfoLoading,
      isAutoInfoLocked: cascadeModel.isAutoInfoLocked,
      createStore,
      conditionOptions: optionsModel.conditionOptions,
      dropdownMarksOptions: optionsModel.dropdownMarksOptions,
      dropdownModelsOptions: optionsModel.dropdownModelsOptions,
      dropdownGenerationOptions: optionsModel.dropdownGenerationOptions,
      dropdownModificationOptions: optionsModel.dropdownModificationOptions,
      dropdownEquipmentOptions: optionsModel.dropdownEquipmentOptions,
      isModelsLoading: optionsModel.isModelsLoading,
      isGenerationsLoading: optionsModel.isGenerationsLoading,
      isModificationsLoading: optionsModel.isModificationsLoading,
      isEquipmentLoading: optionsModel.isEquipmentLoading,
      dropdownTransmissionOptions: optionsModel.dropdownTransmissionOptions,
      checkboxBodyTypeOptions: optionsModel.checkboxBodyTypeOptions,
      checkboxEngineTypeOptions: optionsModel.checkboxEngineTypeOptions,
      checkboxDriveOptions: optionsModel.checkboxDriveOptions,
      switcherStateOptions: optionsModel.switcherStateOptions,
      colorOptions: optionsModel.colorOptions,
      countryOptions: optionsModel.countryOptions,
      ownersOptions: optionsModel.ownersOptions,
      yearOptions: optionsModel.yearOptions,
      handlebarIdOptions: optionsModel.handlebarIdOptions,
      ptsOptions: optionsModel.ptsOptions,
      showDraftRecoveryConditionField,
      showStateNumber,
      showUsedOptions,
      showModelField,
      showGenerationField,
      showModificationField,
      showEquipmentField,
      isModelSelectDisabled,
      isGenerationSelectDisabled,
      isModificationSelectDisabled,
      isEquipmentSelectDisabled,
      showAutoInfoFields,
      isMobileViewport,
      vinHelpRef,
      modelSelectRef: cascadeModel.modelSelectRef,
      generationSelectRef: cascadeModel.generationSelectRef,
      modificationSelectRef: cascadeModel.modificationSelectRef,
      equipmentSelectRef: cascadeModel.equipmentSelectRef,
      shouldHighlightRequiredField,
      dismissRequiredField,
      handleVinLabelClick,
      updateField,
      handleMarksUpdate: cascadeModel.handleMarksUpdate,
      handleModelsUpdate: cascadeModel.handleModelsUpdate,
      handleGenerationUpdate: cascadeModel.handleGenerationUpdate,
      handleModificationUpdate: cascadeModel.handleModificationUpdate,
      handleEquipmentUpdate: cascadeModel.handleEquipmentUpdate
   }
}
