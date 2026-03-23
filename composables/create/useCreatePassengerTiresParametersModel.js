import { computed, onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import {
   getAutogoodsTireBrand as getTireBrandOptions,
   getAutogoodsTireCondition as getTireConditionOptions,
   getAutogoodsTireCount as getTireCountOptions,
   getAutogoodsTireModel as getPassengerTireModels,
   getAutogoodsTireSeasonality as getTireSeasonalityOptions,
   getAutogoodsTireYear as getTireYearOptions,
   getAutogoodsTireStaggeredSet as getTireStaggeredSetOptions,
   getAutogoodsTireWidth as getTireFrontWidthOptions,
   getAutogoodsTireHeight as getTireFrontHeightOptions,
   getAutogoodsTireDiameter as getTireFrontDiameterOptions,
   getAutogoodsTireWidthRear as getTireRearWidthOptions,
   getAutogoodsTireHeightRear as getTireRearHeightOptions,
   getAutogoodsTireDiameterRear as getTireRearDiameterOptions,
   getAutogoodsTireLoadIndex as getTireLoadIndexOptions,
   getAutogoodsTireSpeedIndex as getTireSpeedIndexOptions,
   getAutogoodsTireRunFlat as getTireRunFlatOptions,
   getAutogoodsTireTreadDepth as getTireTreadDepthOptions,
   getAutogoodsTireBulgeCounts as getTireBulgesCountOptions,
   getAutogoodsTireSideRepairCount as getTireSideRepairCountOptions
} from '~/services/apiClient'
import { normalizeCreateOptions } from '~/store/createStore/optionsUtils'
import { useCreatePartsFieldSync } from '~/composables/create/parts/useCreatePartsFieldSync'
import { createOptionsLoader } from '~/composables/create/parts/optionsLoader'
import {
   isAffirmativeOptionByValue,
   isUsedOptionByValue
} from '~/composables/create/parts/optionsPredicates'
import {
   normalizeCreateBrandOptions,
   normalizeCreateModelOptions,
   syncCreateBrandSelection
} from '~/composables/create/parts/brandModelOptions'

const DEFECT_NONE_FIELD = 'tires_defect_none'

const defectsOptions = Object.freeze([
   Object.freeze({ field: DEFECT_NONE_FIELD, label: 'Без дефектов' }),
   Object.freeze({
      field: 'tires_defect_uneven_wear',
      label: 'Неравномерный износ'
   }),
   Object.freeze({
      field: 'tires_defect_tread_delamination',
      label: 'Отслоение протектора'
   }),
   Object.freeze({ field: 'tires_defect_cracks', label: 'Трещины на шинах' }),
   Object.freeze({
      field: 'tires_defect_driven_flat',
      label: 'Езда на спущенных'
   })
])

const isYesByValueWithOptions = (value, options = []) => {
   return isAffirmativeOptionByValue(value, options)
}

const isUsedByValueWithOptions = (value, options = []) => {
   return isUsedOptionByValue(value, options)
}

export const useCreatePassengerTiresParametersModel = () => {
   const createStore = useCreateStore()

   const brandOptions = ref([])
   const modelOptions = ref([])
   const isModelLoading = ref(false)
   const widthOptions = ref([])
   const heightOptions = ref([])
   const diameterOptions = ref([])
   const rearWidthOptions = ref([])
   const rearHeightOptions = ref([])
   const rearDiameterOptions = ref([])
   const loadIndexOptions = ref([])
   const speedIndexOptions = ref([])
   const runFlatOptions = ref([])
   const conditionOptions = ref([])
   const countOptions = ref([])
   const seasonOptions = ref([])
   const staggeredSetOptions = ref([])
   const treadDepthOptions = ref([])
   const bulgesCountOptions = ref([])
   const sideRepairCountOptions = ref([])
   const yearOptions = ref([])

   const tiresCountValue = computed(() => {
      const parsed = Number.parseInt(String(createStore.tires_count ?? ''), 10)
      return Number.isFinite(parsed) ? parsed : null
   })

   const isStaggeredSetVisible = computed(
      () => tiresCountValue.value !== null && tiresCountValue.value !== 1
   )

   const isStaggeredSet = computed(
      () =>
         isStaggeredSetVisible.value &&
         isYesByValueWithOptions(
            createStore.tires_staggered_set_id,
            staggeredSetOptions.value
         )
   )

   const isUsedCondition = computed(() =>
      isUsedByValueWithOptions(
         createStore.tires_condition_id,
         conditionOptions.value
      )
   )

   const isModelSelectDisabled = computed(
      () => isModelLoading.value || modelOptions.value.length === 0
   )

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   const setLocalField = (field, value) => {
      createStore[field] = value
   }

   const { safeFetchOptions, fetchOptionsDirect } = createOptionsLoader({
      useStaticFallbacks: true,
      errorPrefix: 'Create tires options load failed'
   })

   const {
      clearFields,
      clearOptionFields,
      watchWhenFalseReset,
      createExclusiveDefectUpdater
   } = useCreatePartsFieldSync(updateField)

   const resetRearSizeFields = () => {
      clearFields([
         'tires_rear_width_id',
         'tires_rear_height_id',
         'tires_rear_diameter_id'
      ])
   }

   const resetUsedConditionFields = () => {
      clearFields([
         'tires_tread_depth_id',
         'tires_bulges_count_id',
         'tires_side_repair_count_id'
      ])
      clearOptionFields(defectsOptions)
   }

   watchWhenFalseReset(isStaggeredSetVisible, () => {
      updateField('tires_staggered_set_id', null)
      resetRearSizeFields()
   })

   watchWhenFalseReset(isStaggeredSet, resetRearSizeFields)
   watchWhenFalseReset(isUsedCondition, resetUsedConditionFields)

   const handleDefectUpdate = createExclusiveDefectUpdater({
      noneField: DEFECT_NONE_FIELD,
      defectOptions: defectsOptions
   })

   const loadStaticOptions = async () => {
      const [
         brands,
         conditions,
         counts,
         seasons,
         years,
         staggeredSet,
         widths,
         heights,
         diameters,
         rearWidths,
         rearHeights,
         rearDiameters,
         loadIndices,
         speedIndices,
         runFlatValues,
         treadDepthValues,
         bulgesCountValues,
         sideRepairCountValues
      ] = await Promise.all([
         safeFetchOptions('tires:brands', getTireBrandOptions),
         safeFetchOptions('tires:condition', getTireConditionOptions),
         safeFetchOptions('tires:count', getTireCountOptions),
         safeFetchOptions('tires:seasonality', getTireSeasonalityOptions),
         safeFetchOptions('tires:year', getTireYearOptions),
         safeFetchOptions('tires:staggered-set', getTireStaggeredSetOptions),
         safeFetchOptions('tires:front:width', getTireFrontWidthOptions),
         safeFetchOptions('tires:front:height', getTireFrontHeightOptions),
         safeFetchOptions('tires:front:diameter', getTireFrontDiameterOptions),
         safeFetchOptions('tires:rear:width', getTireRearWidthOptions),
         safeFetchOptions('tires:rear:height', getTireRearHeightOptions),
         safeFetchOptions('tires:rear:diameter', getTireRearDiameterOptions),
         safeFetchOptions('tires:load-index', getTireLoadIndexOptions),
         safeFetchOptions('tires:speed-index', getTireSpeedIndexOptions),
         safeFetchOptions('tires:run-flat', getTireRunFlatOptions),
         safeFetchOptions('tires:tread-depth', getTireTreadDepthOptions),
         safeFetchOptions('tires:bulges-count', getTireBulgesCountOptions),
         safeFetchOptions(
            'tires:side-repair-count',
            getTireSideRepairCountOptions
         )
      ])

      brandOptions.value = normalizeCreateBrandOptions(brands, [
         'brand_id',
         'tire_brand_id',
         'disk_brand_id'
      ])
      if (!brandOptions.value.length) {
         const liveBrands = await fetchOptionsDirect(getTireBrandOptions)
         brandOptions.value = normalizeCreateBrandOptions(liveBrands, [
            'brand_id',
            'tire_brand_id',
            'disk_brand_id'
         ])
      }

      conditionOptions.value = normalizeCreateOptions(conditions, {
         idKeys: ['id', 'condition_id', 'state_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      countOptions.value = normalizeCreateOptions(counts, {
         idKeys: ['id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      seasonOptions.value = normalizeCreateOptions(seasons, {
         idKeys: ['id', 'season_id', 'seasonality_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      yearOptions.value = normalizeCreateOptions(years, {
         idKeys: ['id', 'year_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      staggeredSetOptions.value = normalizeCreateOptions(staggeredSet, {
         idKeys: ['id', 'staggered_set_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      widthOptions.value = normalizeCreateOptions(widths, {
         idKeys: ['id', 'width_id', 'section_width_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })

      heightOptions.value = normalizeCreateOptions(heights, {
         idKeys: ['id', 'height_id', 'aspect_ratio_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })

      diameterOptions.value = normalizeCreateOptions(diameters, {
         idKeys: ['id', 'diameter_id', 'rim_diameter_id', 'value'],
         titleKeys: ['title', 'name', 'value'],
         titleFormatter: (value) => {
            const normalized = String(value)
            return normalized.toLowerCase().startsWith('r')
               ? normalized
               : `R${normalized}`
         }
      })

      rearWidthOptions.value = normalizeCreateOptions(rearWidths, {
         idKeys: ['id', 'width_id', 'rear_width_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })

      rearHeightOptions.value = normalizeCreateOptions(rearHeights, {
         idKeys: ['id', 'height_id', 'rear_height_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })

      rearDiameterOptions.value = normalizeCreateOptions(rearDiameters, {
         idKeys: ['id', 'diameter_id', 'rear_diameter_id', 'value'],
         titleKeys: ['title', 'name', 'value'],
         titleFormatter: (value) => {
            const normalized = String(value)
            return normalized.toLowerCase().startsWith('r')
               ? normalized
               : `R${normalized}`
         }
      })

      loadIndexOptions.value = normalizeCreateOptions(loadIndices, {
         idKeys: ['id', 'load_index_id', 'load_indice_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      speedIndexOptions.value = normalizeCreateOptions(speedIndices, {
         idKeys: ['id', 'speed_index_id', 'speed_indice_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      runFlatOptions.value = normalizeCreateOptions(runFlatValues, {
         idKeys: ['id', 'run_flat_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      treadDepthOptions.value = normalizeCreateOptions(treadDepthValues, {
         idKeys: ['id', 'tread_depth_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      bulgesCountOptions.value = normalizeCreateOptions(bulgesCountValues, {
         idKeys: ['id', 'bulges_count_id', 'bulge_count_id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      sideRepairCountOptions.value = normalizeCreateOptions(
         sideRepairCountValues,
         {
            idKeys: ['id', 'side_repair_count_id', 'count_id', 'value'],
            titleKeys: ['title', 'name', 'label', 'value']
         }
      )
   }

   const loadModels = async (brandId, { local = false } = {}) => {
      if (!brandId) {
         isModelLoading.value = false
         modelOptions.value = []
         if (local) {
            setLocalField('tires_model_id', null)
         } else {
            updateField('tires_model_id', null)
         }
         return
      }

      isModelLoading.value = true

      try {
         const models = await fetchOptionsDirect(() =>
            getPassengerTireModels(brandId)
         )

         modelOptions.value = normalizeCreateModelOptions(models, [
            'model_id',
            'tire_model_id'
         ])

         if (
            !modelOptions.value.some(
               (option) => String(option.id) === String(createStore.tires_model_id)
            )
         ) {
            if (local) {
               setLocalField('tires_model_id', null)
            } else {
               updateField('tires_model_id', null)
            }
         }
      } finally {
         isModelLoading.value = false
      }
   }

   const handleBrandUpdate = async (brandId) => {
      const selectedBrand = brandOptions.value.find(
         (option) => String(option.id) === String(brandId)
      )

      updateField('tires_brand_id', brandId)
      updateField('tires_manufacturer', selectedBrand?.title || null)

      await loadModels(brandId)
   }

   const syncBrandSelectionFromStoredValues = async () => {
      await syncCreateBrandSelection({
         brandOptionsRef: brandOptions,
         initialBrandId: createStore.tires_brand_id,
         manufacturer: createStore.tires_manufacturer,
         setBrandId: (value) => setLocalField('tires_brand_id', value),
         setManufacturer: (value) =>
            setLocalField('tires_manufacturer', value),
         loadModels
      })
   }

   onMounted(async () => {
      await loadStaticOptions()
      await syncBrandSelectionFromStoredValues()
   })

   return {
      createStore,
      brandOptions,
      modelOptions,
      isModelSelectDisabled,
      widthOptions,
      heightOptions,
      diameterOptions,
      rearWidthOptions,
      rearHeightOptions,
      rearDiameterOptions,
      loadIndexOptions,
      speedIndexOptions,
      runFlatOptions,
      conditionOptions,
      countOptions,
      seasonOptions,
      staggeredSetOptions,
      treadDepthOptions,
      bulgesCountOptions,
      sideRepairCountOptions,
      defectsOptions,
      yearOptions,
      isStaggeredSetVisible,
      isStaggeredSet,
      isUsedCondition,
      updateField,
      handleDefectUpdate,
      handleBrandUpdate
   }
}
