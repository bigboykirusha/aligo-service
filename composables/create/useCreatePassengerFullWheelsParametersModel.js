import { computed, onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import {
   getAutogoodsWheelCondition as getWheelConditionOptions,
   getAutogoodsWheelCount as getWheelCountOptions,
   getAutogoodsWheelBrand as getWheelBrandOptions,
   getAutogoodsWheelModel as getWheelModelOptions,
   getAutogoodsWheelStaggeredSet as getWheelStaggeredSetOptions,
   getAutogoodsWheelWidth as getWheelFrontWidthOptions,
   getAutogoodsWheelHeight as getWheelFrontHeightOptions,
   getAutogoodsWheelDiameter as getWheelFrontDiameterOptions,
   getAutogoodsWheelWidthRear as getWheelRearWidthOptions,
   getAutogoodsWheelHeightRear as getWheelRearHeightOptions,
   getAutogoodsWheelDiameterRear as getWheelRearDiameterOptions,
   getAutogoodsWheelLoadIndex as getWheelLoadIndexOptions,
   getAutogoodsWheelSpeedIndex as getWheelSpeedIndexOptions,
   getAutogoodsWheelSeasonality as getWheelSeasonalityOptions,
   getAutogoodsWheelRunFlat as getWheelRunFlatOptions,
   getAutogoodsWheelTreadDepth as getWheelTreadDepthOptions,
   getAutogoodsWheelYear as getWheelYearOptions,
   getAutogoodsWheelDiskDiameter as getWheelDiskRimDiameterOptions,
   getAutogoodsWheelDiskHoleCounts as getWheelDiskHoleCountOptions,
   getAutogoodsWheelDiskHoleDiameter as getWheelDiskHoleDiameterOptions,
   getAutogoodsWheelDiskType as getWheelDiskTypeOptions,
   getAutogoodsWheelDiskDia as getWheelDiskDiaOptions,
   getAutogoodsWheelOffsetEt as getWheelDiskEtOptions,
   getAutogoodsWheelDiskWidth as getWheelDiskRimWidthOptions
} from '~/services/apiClient'
import {
   buildDescendingYearOptions,
   normalizeCreateOptions
} from '~/store/createStore/optionsUtils'
import { useCreatePartsFieldSync } from '~/composables/create/parts/useCreatePartsFieldSync'
import { createOptionsLoader } from '~/composables/create/parts/optionsLoader'
import {
   isAffirmativeOptionByValue
} from '~/composables/create/parts/optionsPredicates'
import {
   normalizeCreateBrandOptions,
   normalizeCreateModelOptions,
   syncCreateBrandSelection
} from '~/composables/create/parts/brandModelOptions'
import {
   CREATE_PARTS_CONDITION_OPTIONS,
   CREATE_TIRES_SEASON_OPTIONS,
   CREATE_TREAD_DEPTH_OPTIONS,
   CREATE_YES_NO_OPTIONS
} from '~/store/createStore/partsOptionCatalog'

const fallbackWidthOptions = Object.freeze([
   Object.freeze({ id: 195, title: '195' }),
   Object.freeze({ id: 205, title: '205' }),
   Object.freeze({ id: 215, title: '215' }),
   Object.freeze({ id: 225, title: '225' })
])

const fallbackHeightOptions = Object.freeze([
   Object.freeze({ id: 45, title: '45' }),
   Object.freeze({ id: 50, title: '50' }),
   Object.freeze({ id: 55, title: '55' }),
   Object.freeze({ id: 60, title: '60' })
])

const fallbackDiameterOptions = Object.freeze([
   Object.freeze({ id: 'R15', title: 'R15' }),
   Object.freeze({ id: 'R16', title: 'R16' }),
   Object.freeze({ id: 'R17', title: 'R17' }),
   Object.freeze({ id: 'R18', title: 'R18' })
])

const fallbackLoadIndexOptions = Object.freeze([
   Object.freeze({ id: 91, title: '91' }),
   Object.freeze({ id: 94, title: '94' }),
   Object.freeze({ id: 98, title: '98' })
])

const fallbackSpeedIndexOptions = Object.freeze([
   Object.freeze({ id: 'H', title: 'H' }),
   Object.freeze({ id: 'V', title: 'V' }),
   Object.freeze({ id: 'W', title: 'W' })
])

const fallbackDiskRimDiameterOptions = Object.freeze([
   Object.freeze({ id: 15, title: '15' }),
   Object.freeze({ id: 16, title: '16' }),
   Object.freeze({ id: 17, title: '17' }),
   Object.freeze({ id: 18, title: '18' })
])

const fallbackDiskHoleCountOptions = Object.freeze([
   Object.freeze({ id: 4, title: '4' }),
   Object.freeze({ id: 5, title: '5' }),
   Object.freeze({ id: 6, title: '6' })
])

const fallbackDiskHolePatternDiameterOptions = Object.freeze([
   Object.freeze({ id: 98, title: '98' }),
   Object.freeze({ id: 100, title: '100' }),
   Object.freeze({ id: 112, title: '112' })
])

const fallbackDiskTypeOptions = Object.freeze([
   Object.freeze({ id: 1, title: 'Литой' }),
   Object.freeze({ id: 2, title: 'Штампованный' }),
   Object.freeze({ id: 3, title: 'Кованый' })
])

const fallbackDiskDiaOptions = Object.freeze([
   Object.freeze({ id: 57.1, title: '57.1' }),
   Object.freeze({ id: 66.6, title: '66.6' }),
   Object.freeze({ id: 67.1, title: '67.1' })
])

const fallbackDiskEtOptions = Object.freeze([
   Object.freeze({ id: 35, title: '35' }),
   Object.freeze({ id: 40, title: '40' }),
   Object.freeze({ id: 45, title: '45' })
])

const fallbackDiskRimWidthOptions = Object.freeze([
   Object.freeze({ id: 6, title: '6' }),
   Object.freeze({ id: 6.5, title: '6.5' }),
   Object.freeze({ id: 7, title: '7' }),
   Object.freeze({ id: 7.5, title: '7.5' })
])

const fallbackWheelCountOptions = Object.freeze([
   Object.freeze({ id: 1, title: '1' }),
   Object.freeze({ id: 2, title: '2' }),
   Object.freeze({ id: 3, title: '3' }),
   Object.freeze({ id: 4, title: '4' })
])
const USE_STATIC_OPTION_FALLBACKS = false

const isYesByValueWithOptions = (value, options = []) => {
   return isAffirmativeOptionByValue(value, options)
}

export const useCreatePassengerFullWheelsParametersModel = () => {
   const createStore = useCreateStore()

   const countOptions = ref([...fallbackWheelCountOptions])
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

   const diskRimDiameterOptions = ref([...fallbackDiskRimDiameterOptions])
   const diskHoleCountOptions = ref([])
   const diskHolePatternDiameterOptions = ref([])
   const diskTypeOptions = ref([])
   const diskDiaOptions = ref([])
   const diskEtOptions = ref([])
   const diskRimWidthOptions = ref([])

   const conditionOptions = ref([...CREATE_PARTS_CONDITION_OPTIONS])
   const staggeredSetOptions = ref([...CREATE_YES_NO_OPTIONS])
   const seasonOptions = ref([...CREATE_TIRES_SEASON_OPTIONS])
   const treadDepthOptions = ref([...CREATE_TREAD_DEPTH_OPTIONS])
   const yearOptions = ref(buildDescendingYearOptions())
   const runFlatOptions = ref([...CREATE_YES_NO_OPTIONS])

   const isStaggeredSet = computed(() =>
      isYesByValueWithOptions(
         createStore.full_wheels_staggered_set_id,
         staggeredSetOptions.value
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
      useStaticFallbacks: USE_STATIC_OPTION_FALLBACKS,
      errorPrefix: 'Create full wheels options load failed'
   })

   const { clearFields, watchWhenFalseReset } = useCreatePartsFieldSync(updateField)

   const resetRearSizeFields = () => {
      clearFields([
         'full_wheels_rear_width_id',
         'full_wheels_rear_height_id',
         'full_wheels_rear_diameter_id'
      ])
   }

   watchWhenFalseReset(isStaggeredSet, resetRearSizeFields)

   const loadStaticOptions = async () => {
      const [
         conditions,
         counts,
         brands,
         staggeredSets,
         widths,
         heights,
         diameters,
         rearWidths,
         rearHeights,
         rearDiameters,
         loadIndices,
         speedIndices,
         seasonality,
         runFlats,
         treadDepthValues,
         years,
         diskRimDiameters,
         diskHoleCounts,
         diskHolePatternDiameters,
         diskTypes,
         diskDias,
         diskEts,
         diskRimWidths
      ] = await Promise.all([
         safeFetchOptions('full-wheels:condition', getWheelConditionOptions),
         safeFetchOptions('full-wheels:count', getWheelCountOptions, fallbackWheelCountOptions),
         safeFetchOptions('full-wheels:brand', getWheelBrandOptions),
         safeFetchOptions('full-wheels:staggered-set', getWheelStaggeredSetOptions),
         safeFetchOptions('full-wheels:front:width', getWheelFrontWidthOptions, fallbackWidthOptions),
         safeFetchOptions('full-wheels:front:height', getWheelFrontHeightOptions, fallbackHeightOptions),
         safeFetchOptions('full-wheels:front:diameter', getWheelFrontDiameterOptions, fallbackDiameterOptions),
         safeFetchOptions('full-wheels:rear:width', getWheelRearWidthOptions),
         safeFetchOptions('full-wheels:rear:height', getWheelRearHeightOptions),
         safeFetchOptions('full-wheels:rear:diameter', getWheelRearDiameterOptions),
         safeFetchOptions('full-wheels:load-index', getWheelLoadIndexOptions, fallbackLoadIndexOptions),
         safeFetchOptions('full-wheels:speed-index', getWheelSpeedIndexOptions, fallbackSpeedIndexOptions),
         safeFetchOptions('full-wheels:seasonality', getWheelSeasonalityOptions),
         safeFetchOptions('full-wheels:run-flat', getWheelRunFlatOptions),
         safeFetchOptions('full-wheels:tread-depth', getWheelTreadDepthOptions),
         safeFetchOptions('full-wheels:year', getWheelYearOptions),
         safeFetchOptions('full-wheels:disk:diameter', getWheelDiskRimDiameterOptions, fallbackDiskRimDiameterOptions),
         safeFetchOptions('full-wheels:disk:hole-count', getWheelDiskHoleCountOptions, fallbackDiskHoleCountOptions),
         safeFetchOptions('full-wheels:disk:hole-diameter', getWheelDiskHoleDiameterOptions, fallbackDiskHolePatternDiameterOptions),
         safeFetchOptions('full-wheels:disk:type', getWheelDiskTypeOptions, fallbackDiskTypeOptions),
         safeFetchOptions('full-wheels:disk:dia', getWheelDiskDiaOptions, fallbackDiskDiaOptions),
         safeFetchOptions('full-wheels:disk:et', getWheelDiskEtOptions, fallbackDiskEtOptions),
         safeFetchOptions('full-wheels:disk:width', getWheelDiskRimWidthOptions, fallbackDiskRimWidthOptions)
      ])

      conditionOptions.value = normalizeCreateOptions(conditions, {
         idKeys: ['id', 'condition_id', 'state_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !conditionOptions.value.length) {
         conditionOptions.value = [...CREATE_PARTS_CONDITION_OPTIONS]
      }

      countOptions.value = normalizeCreateOptions(counts, {
         idKeys: ['id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (!countOptions.value.length) {
         countOptions.value = [...fallbackWheelCountOptions]
      }

      brandOptions.value = normalizeCreateBrandOptions(brands, [
         'brand_id',
         'wheel_brand_id'
      ])
      if (!brandOptions.value.length) {
         const liveBrands = await fetchOptionsDirect(getWheelBrandOptions)
         brandOptions.value = normalizeCreateBrandOptions(liveBrands, [
            'brand_id',
            'wheel_brand_id'
         ])
      }

      staggeredSetOptions.value = normalizeCreateOptions(staggeredSets, {
         idKeys: ['id', 'staggered_set_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !staggeredSetOptions.value.length) {
         staggeredSetOptions.value = [...CREATE_YES_NO_OPTIONS]
      }

      widthOptions.value = normalizeCreateOptions(widths, {
         idKeys: ['id', 'width_id', 'section_width_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !widthOptions.value.length) {
         widthOptions.value = [...fallbackWidthOptions]
      }

      heightOptions.value = normalizeCreateOptions(heights, {
         idKeys: ['id', 'height_id', 'aspect_ratio_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !heightOptions.value.length) {
         heightOptions.value = [...fallbackHeightOptions]
      }

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
      if (USE_STATIC_OPTION_FALLBACKS && !diameterOptions.value.length) {
         diameterOptions.value = [...fallbackDiameterOptions]
      }

      rearWidthOptions.value = normalizeCreateOptions(rearWidths, {
         idKeys: ['id', 'width_rear_id', 'rear_width_id', 'width_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (!rearWidthOptions.value.length) {
         rearWidthOptions.value = [...widthOptions.value]
      }

      rearHeightOptions.value = normalizeCreateOptions(rearHeights, {
         idKeys: ['id', 'height_rear_id', 'rear_height_id', 'height_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (!rearHeightOptions.value.length) {
         rearHeightOptions.value = [...heightOptions.value]
      }

      rearDiameterOptions.value = normalizeCreateOptions(rearDiameters, {
         idKeys: ['id', 'diameter_rear_id', 'rear_diameter_id', 'diameter_id', 'value'],
         titleKeys: ['title', 'name', 'value'],
         titleFormatter: (value) => {
            const normalized = String(value)
            return normalized.toLowerCase().startsWith('r')
               ? normalized
               : `R${normalized}`
         }
      })
      if (!rearDiameterOptions.value.length) {
         rearDiameterOptions.value = [...diameterOptions.value]
      }

      loadIndexOptions.value = normalizeCreateOptions(loadIndices, {
         idKeys: ['id', 'load_index_id', 'load_indice_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !loadIndexOptions.value.length) {
         loadIndexOptions.value = [...fallbackLoadIndexOptions]
      }

      speedIndexOptions.value = normalizeCreateOptions(speedIndices, {
         idKeys: ['id', 'speed_index_id', 'speed_indice_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !speedIndexOptions.value.length) {
         speedIndexOptions.value = [...fallbackSpeedIndexOptions]
      }

      seasonOptions.value = normalizeCreateOptions(seasonality, {
         idKeys: ['id', 'season_id', 'seasonality_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !seasonOptions.value.length) {
         seasonOptions.value = [...CREATE_TIRES_SEASON_OPTIONS]
      }

      runFlatOptions.value = normalizeCreateOptions(runFlats, {
         idKeys: ['id', 'run_flat_id', 'homologation_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !runFlatOptions.value.length) {
         runFlatOptions.value = [...CREATE_YES_NO_OPTIONS]
      }

      treadDepthOptions.value = normalizeCreateOptions(treadDepthValues, {
         idKeys: ['id', 'tread_depth_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !treadDepthOptions.value.length) {
         treadDepthOptions.value = [...CREATE_TREAD_DEPTH_OPTIONS]
      }

      yearOptions.value = normalizeCreateOptions(years, {
         idKeys: ['id', 'year_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !yearOptions.value.length) {
         yearOptions.value = buildDescendingYearOptions()
      }

      diskRimDiameterOptions.value = normalizeCreateOptions(
         diskRimDiameters,
         {
            idKeys: ['id', 'disk_diameter_id', 'rim_diameter_id', 'value'],
            titleKeys: ['title', 'name', 'value']
         }
      )
      if (USE_STATIC_OPTION_FALLBACKS && !diskRimDiameterOptions.value.length) {
         diskRimDiameterOptions.value = [...fallbackDiskRimDiameterOptions]
      }

      diskHoleCountOptions.value = normalizeCreateOptions(diskHoleCounts, {
         idKeys: ['id', 'disk_hole_count_id', 'hole_count_id', 'rim_bolt_id', 'bolt_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskHoleCountOptions.value.length) {
         diskHoleCountOptions.value = [...fallbackDiskHoleCountOptions]
      }

      diskHolePatternDiameterOptions.value = normalizeCreateOptions(diskHolePatternDiameters, {
         idKeys: ['id', 'disk_hole_diameter_id', 'hole_diameter_id', 'rim_bolt_diameter_id', 'bolt_diameter_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (
         USE_STATIC_OPTION_FALLBACKS &&
         !diskHolePatternDiameterOptions.value.length
      ) {
         diskHolePatternDiameterOptions.value = [...fallbackDiskHolePatternDiameterOptions]
      }

      diskTypeOptions.value = normalizeCreateOptions(diskTypes, {
         idKeys: [
            'id',
            'disk_type_id',
            'type_disk_id',
            'rim_type_id',
            'type_id',
            'value'
         ],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskTypeOptions.value.length) {
         diskTypeOptions.value = [...fallbackDiskTypeOptions]
      }

      diskDiaOptions.value = normalizeCreateOptions(diskDias, {
         idKeys: ['id', 'disk_dia_id', 'rim_dia_id', 'dia_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskDiaOptions.value.length) {
         diskDiaOptions.value = [...fallbackDiskDiaOptions]
      }

      diskEtOptions.value = normalizeCreateOptions(diskEts, {
         idKeys: [
            'id',
            'offset_et_id',
            'et_offset_id',
            'rim_offset_id',
            'offset_id',
            'value'
         ],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskEtOptions.value.length) {
         diskEtOptions.value = [...fallbackDiskEtOptions]
      }

      diskRimWidthOptions.value = normalizeCreateOptions(diskRimWidths, {
         idKeys: ['id', 'disk_width_id', 'rim_width_id', 'value'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskRimWidthOptions.value.length) {
         diskRimWidthOptions.value = [...fallbackDiskRimWidthOptions]
      }
   }

   const loadModels = async (brandId, { local = false } = {}) => {
      if (!brandId) {
         isModelLoading.value = false
         modelOptions.value = []
         if (local) {
            setLocalField('full_wheels_model_id', null)
         } else {
            updateField('full_wheels_model_id', null)
         }
         return
      }

      isModelLoading.value = true

      try {
         const models = await fetchOptionsDirect(() => getWheelModelOptions(brandId))

         modelOptions.value = normalizeCreateModelOptions(models, [
            'model_id',
            'wheel_model_id'
         ])

         if (
            !modelOptions.value.some(
               (option) =>
                  String(option.id) === String(createStore.full_wheels_model_id)
            )
         ) {
            if (local) {
               setLocalField('full_wheels_model_id', null)
            } else {
               updateField('full_wheels_model_id', null)
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

      updateField('full_wheels_brand_id', brandId)
      updateField('full_wheels_manufacturer', selectedBrand?.title || null)

      await loadModels(brandId)
   }

   const syncBrandSelectionFromStoredValues = async () => {
      await syncCreateBrandSelection({
         brandOptionsRef: brandOptions,
         initialBrandId: createStore.full_wheels_brand_id,
         manufacturer: createStore.full_wheels_manufacturer,
         setBrandId: (value) => setLocalField('full_wheels_brand_id', value),
         setManufacturer: (value) =>
            setLocalField('full_wheels_manufacturer', value),
         loadModels
      })
   }

   onMounted(async () => {
      await loadStaticOptions()
      await syncBrandSelectionFromStoredValues()
   })

   return {
      createStore,
      countOptions,
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
      diskRimDiameterOptions,
      diskHoleCountOptions,
      diskHolePatternDiameterOptions,
      diskTypeOptions,
      diskDiaOptions,
      diskEtOptions,
      diskRimWidthOptions,
      conditionOptions,
      staggeredSetOptions,
      seasonOptions,
      treadDepthOptions,
      yearOptions,
      runFlatOptions,
      isStaggeredSet,
      updateField,
      handleBrandUpdate
   }
}
