import { computed, onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import {
   getAutogoodsDiskBrand as getDiskBrandOptions,
   getAutogoodsDiskCondition as getDiskConditionOptions,
   getAutogoodsDiskCount as getDiskCountOptions,
   getAutogoodsDiskModel as getDiskModels,
   getAutogoodsDiskRepairStatus as getDiskRepairStatusOptions,
   getAutogoodsDiskStraightenedCount as getDiskStraightenedCountOptions,
   getAutogoodsDiskWeldedCount as getDiskWeldedCountOptions,
   getAutogoodsDiskCrackCount as getDiskCrackCountOptions,
   getAutogoodsDiskGeometryChangeCount as getDiskGeometryChangeCountOptions,
   getAutogoodsDiskColoringType as getDiskColoringTypeOptions,
   getAutogoodsDiskCentralCap as getDiskCentralCapOptions,
   getAutogoodsDiskPressureSensor as getDiskPressureSensorOptions,
   getAutogoodsDiskRimBolt as getDiskBoltCountOptions,
   getAutogoodsDiskRimBoltDiameter as getDiskBoltDiameterOptions,
   getAutogoodsDiskRimDia as getDiskDiaOptions,
   getAutogoodsDiskRimDiameter as getDiskDiameterOptions,
   getAutogoodsDiskRimOffset as getDiskEtOptions,
   getAutogoodsDiskRimType as getDiskTypeOptions,
   getAutogoodsDiskRimWidth as getDiskRimWidthOptions
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
   CREATE_DAMAGE_COUNT_OPTIONS,
   CREATE_DISKS_PAINT_TYPE_OPTIONS,
   CREATE_DISKS_REPAIR_STATUS_OPTIONS,
   CREATE_PARTS_CONDITION_OPTIONS,
   CREATE_YES_NO_UNKNOWN_OPTIONS
} from '~/store/createStore/partsOptionCatalog'

const fallbackRimWidthOptions = Object.freeze([
   Object.freeze({ id: 6, title: '6' }),
   Object.freeze({ id: 6.5, title: '6.5' }),
   Object.freeze({ id: 7, title: '7' }),
   Object.freeze({ id: 7.5, title: '7.5' })
])

const fallbackRimDiameterOptions = Object.freeze([
   Object.freeze({ id: 15, title: '15' }),
   Object.freeze({ id: 16, title: '16' }),
   Object.freeze({ id: 17, title: '17' }),
   Object.freeze({ id: 18, title: '18' })
])

const fallbackEtOptions = Object.freeze([
   Object.freeze({ id: 35, title: '35' }),
   Object.freeze({ id: 40, title: '40' }),
   Object.freeze({ id: 45, title: '45' })
])

const fallbackHoleCountOptions = Object.freeze([
   Object.freeze({ id: 4, title: '4' }),
   Object.freeze({ id: 5, title: '5' }),
   Object.freeze({ id: 6, title: '6' })
])

const fallbackHolePatternDiameterOptions = Object.freeze([
   Object.freeze({ id: 98, title: '98' }),
   Object.freeze({ id: 100, title: '100' }),
   Object.freeze({ id: 112, title: '112' })
])

const fallbackDiaOptions = Object.freeze([
   Object.freeze({ id: 57.1, title: '57.1' }),
   Object.freeze({ id: 66.6, title: '66.6' }),
   Object.freeze({ id: 67.1, title: '67.1' })
])

const fallbackDiskTypeOptions = Object.freeze([
   Object.freeze({ id: 1, title: 'Литой' }),
   Object.freeze({ id: 2, title: 'Штампованный' }),
   Object.freeze({ id: 3, title: 'Кованый' })
])

const fallbackDiskCountOptions = Object.freeze([
   Object.freeze({ id: 1, title: '1' }),
   Object.freeze({ id: 2, title: '2' }),
   Object.freeze({ id: 3, title: '3' }),
   Object.freeze({ id: 4, title: '4' })
])
const USE_STATIC_OPTION_FALLBACKS = false

const DEFECT_NONE_FIELD = 'disks_defect_none'

const defectsOptions = Object.freeze([
   Object.freeze({ field: DEFECT_NONE_FIELD, label: 'Без дефектов' }),
   Object.freeze({ field: 'disks_defect_scratches', label: 'Царапины' }),
   Object.freeze({ field: 'disks_defect_chips', label: 'Сколы' }),
   Object.freeze({
      field: 'disks_defect_coating_delamination',
      label: 'Отслоение покрытия'
   }),
   Object.freeze({
      field: 'disks_defect_corrosion_rust',
      label: 'Коррозия и ржавчина'
   })
])

export const useCreatePassengerDisksParametersModel = () => {
   const createStore = useCreateStore()

   const brandOptions = ref([])
   const modelOptions = ref([])
   const isModelLoading = ref(false)
   const rimWidthOptions = ref([])
   const rimDiameterOptions = ref([])
   const etOptions = ref([])
   const holeCountOptions = ref([])
   const holePatternDiameterOptions = ref([])
   const diaOptions = ref([])
   const diskTypeOptions = ref([])

   const conditionOptions = ref([...CREATE_PARTS_CONDITION_OPTIONS])
   const countOptions = ref([...fallbackDiskCountOptions])
   const repairStatusOptions = ref([...CREATE_DISKS_REPAIR_STATUS_OPTIONS])
   const straightenedCountOptions = ref([...CREATE_DAMAGE_COUNT_OPTIONS])
   const weldedCountOptions = ref([...CREATE_DAMAGE_COUNT_OPTIONS])
   const cracksCountOptions = ref([...CREATE_DAMAGE_COUNT_OPTIONS])
   const geometryChangesCountOptions = ref([...CREATE_DAMAGE_COUNT_OPTIONS])
   const paintTypeOptions = ref([...CREATE_DISKS_PAINT_TYPE_OPTIONS])
   const centerCapsOptions = ref([...CREATE_YES_NO_UNKNOWN_OPTIONS])
   const pressureSensorsOptions = ref([...CREATE_YES_NO_UNKNOWN_OPTIONS])

   const yearOptions = computed(() => buildDescendingYearOptions())

   const isUsedCondition = computed(
      () => Number(createStore.disks_condition_id) === 2
   )

   const isRepairYes = computed(() =>
      isAffirmativeOptionByValue(
         createStore.disks_repair_status_id,
         repairStatusOptions.value
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
      errorPrefix: 'Create disks options load failed'
   })

   const {
      clearFields,
      clearOptionFields,
      watchWhenFalseReset,
      createExclusiveDefectUpdater
   } = useCreatePartsFieldSync(updateField)

   const resetRepairOnlyFields = () => {
      clearFields(['disks_straightened_count_id', 'disks_welded_count_id'])
   }

   const resetUsedOnlyFields = () => {
      clearFields([
         'disks_repair_status_id',
         'disks_cracks_count_id',
         'disks_geometry_changes_count_id',
         'disks_paint_type_id',
         'disks_center_caps_id',
         'disks_pressure_sensors_id'
      ])
      resetRepairOnlyFields()
      clearOptionFields(defectsOptions)
   }

   watchWhenFalseReset(isUsedCondition, resetUsedOnlyFields)
   watchWhenFalseReset(isRepairYes, resetRepairOnlyFields)

   const handleDefectUpdate = createExclusiveDefectUpdater({
      noneField: DEFECT_NONE_FIELD,
      defectOptions: defectsOptions
   })

   const loadStaticOptions = async () => {
      const [
         brands,
         conditions,
         counts,
         rimWidths,
         rimDiameters,
         ets,
         holeCounts,
         holePatternDiameters,
         dias,
         types,
         repairStatuses,
         straightenedCounts,
         weldedCounts,
         crackCounts,
         geometryChangeCounts,
         coloringTypes,
         centralCapOptions,
         pressureSensorOptions
      ] = await Promise.all([
         safeFetchOptions('disks:brands', getDiskBrandOptions),
         safeFetchOptions('disks:condition', getDiskConditionOptions),
         safeFetchOptions('disks:count', getDiskCountOptions),
         safeFetchOptions(
            'disks:rim-width',
            getDiskRimWidthOptions,
            fallbackRimWidthOptions
         ),
         safeFetchOptions(
            'disks:rim-diameter',
            getDiskDiameterOptions,
            fallbackRimDiameterOptions
         ),
         safeFetchOptions('disks:et', getDiskEtOptions, fallbackEtOptions),
         safeFetchOptions(
            'disks:hole-count',
            getDiskBoltCountOptions,
            fallbackHoleCountOptions
         ),
         safeFetchOptions(
            'disks:hole-diameter',
            getDiskBoltDiameterOptions,
            fallbackHolePatternDiameterOptions
         ),
         safeFetchOptions('disks:dia', getDiskDiaOptions, fallbackDiaOptions),
         safeFetchOptions('disks:type', getDiskTypeOptions, fallbackDiskTypeOptions),
         safeFetchOptions('disks:repair-status', getDiskRepairStatusOptions),
         safeFetchOptions(
            'disks:straightened-count',
            getDiskStraightenedCountOptions
         ),
         safeFetchOptions('disks:welded-count', getDiskWeldedCountOptions),
         safeFetchOptions('disks:crack-count', getDiskCrackCountOptions),
         safeFetchOptions(
            'disks:geometry-change-count',
            getDiskGeometryChangeCountOptions
         ),
         safeFetchOptions('disks:coloring-type', getDiskColoringTypeOptions),
         safeFetchOptions('disks:central-cap', getDiskCentralCapOptions),
         safeFetchOptions('disks:pressure-sensor', getDiskPressureSensorOptions)
      ])

      brandOptions.value = normalizeCreateBrandOptions(brands, [
         'brand_id',
         'disk_brand_id',
         'tire_brand_id'
      ])
      if (!brandOptions.value.length) {
         const liveBrands = await fetchOptionsDirect(getDiskBrandOptions)
         brandOptions.value = normalizeCreateBrandOptions(liveBrands, [
            'brand_id',
            'disk_brand_id',
            'tire_brand_id'
         ])
      }

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
      if (USE_STATIC_OPTION_FALLBACKS && !countOptions.value.length) {
         countOptions.value = [...fallbackDiskCountOptions]
      }

      rimWidthOptions.value = normalizeCreateOptions(rimWidths, {
         idKeys: ['id', 'rim_width_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !rimWidthOptions.value.length) {
         rimWidthOptions.value = [...fallbackRimWidthOptions]
      }

      rimDiameterOptions.value = normalizeCreateOptions(rimDiameters, {
         idKeys: ['id', 'rim_diameter_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !rimDiameterOptions.value.length) {
         rimDiameterOptions.value = [...fallbackRimDiameterOptions]
      }

      etOptions.value = normalizeCreateOptions(ets, {
         idKeys: ['id', 'rim_offset_id', 'offset_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !etOptions.value.length) {
         etOptions.value = [...fallbackEtOptions]
      }

      holeCountOptions.value = normalizeCreateOptions(holeCounts, {
         idKeys: ['id', 'rim_bolt_id', 'bolt_id', 'hole_count_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !holeCountOptions.value.length) {
         holeCountOptions.value = [...fallbackHoleCountOptions]
      }

      holePatternDiameterOptions.value = normalizeCreateOptions(
         holePatternDiameters,
         {
            idKeys: ['id', 'rim_bolt_diameter_id', 'bolt_diameter_id'],
            titleKeys: ['title', 'name', 'value']
         }
      )
      if (
         USE_STATIC_OPTION_FALLBACKS &&
         !holePatternDiameterOptions.value.length
      ) {
         holePatternDiameterOptions.value = [...fallbackHolePatternDiameterOptions]
      }

      diaOptions.value = normalizeCreateOptions(dias, {
         idKeys: ['id', 'rim_dia_id', 'dia_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diaOptions.value.length) {
         diaOptions.value = [...fallbackDiaOptions]
      }

      diskTypeOptions.value = normalizeCreateOptions(types, {
         idKeys: ['id', 'rim_type_id', 'type_id'],
         titleKeys: ['title', 'name', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !diskTypeOptions.value.length) {
         diskTypeOptions.value = [...fallbackDiskTypeOptions]
      }

      repairStatusOptions.value = normalizeCreateOptions(repairStatuses, {
         idKeys: ['id', 'repair_status_id', 'repair_disk_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !repairStatusOptions.value.length) {
         repairStatusOptions.value = [...CREATE_DISKS_REPAIR_STATUS_OPTIONS]
      }

      straightenedCountOptions.value = normalizeCreateOptions(straightenedCounts, {
         idKeys: ['id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (
         USE_STATIC_OPTION_FALLBACKS &&
         !straightenedCountOptions.value.length
      ) {
         straightenedCountOptions.value = [...CREATE_DAMAGE_COUNT_OPTIONS]
      }

      weldedCountOptions.value = normalizeCreateOptions(weldedCounts, {
         idKeys: ['id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !weldedCountOptions.value.length) {
         weldedCountOptions.value = [...CREATE_DAMAGE_COUNT_OPTIONS]
      }

      cracksCountOptions.value = normalizeCreateOptions(crackCounts, {
         idKeys: ['id', 'count_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !cracksCountOptions.value.length) {
         cracksCountOptions.value = [...CREATE_DAMAGE_COUNT_OPTIONS]
      }

      geometryChangesCountOptions.value = normalizeCreateOptions(
         geometryChangeCounts,
         {
            idKeys: ['id', 'count_id', 'value'],
            titleKeys: ['title', 'name', 'label', 'value']
         }
      )
      if (
         USE_STATIC_OPTION_FALLBACKS &&
         !geometryChangesCountOptions.value.length
      ) {
         geometryChangesCountOptions.value = [...CREATE_DAMAGE_COUNT_OPTIONS]
      }

      paintTypeOptions.value = normalizeCreateOptions(coloringTypes, {
         idKeys: ['id', 'paint_type_id', 'coloring_type_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !paintTypeOptions.value.length) {
         paintTypeOptions.value = [...CREATE_DISKS_PAINT_TYPE_OPTIONS]
      }

      centerCapsOptions.value = normalizeCreateOptions(centralCapOptions, {
         idKeys: ['id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
      if (USE_STATIC_OPTION_FALLBACKS && !centerCapsOptions.value.length) {
         centerCapsOptions.value = [...CREATE_YES_NO_UNKNOWN_OPTIONS]
      }

      pressureSensorsOptions.value = normalizeCreateOptions(
         pressureSensorOptions,
         {
            idKeys: ['id', 'value'],
            titleKeys: ['title', 'name', 'label', 'value']
         }
      )
      if (
         USE_STATIC_OPTION_FALLBACKS &&
         !pressureSensorsOptions.value.length
      ) {
         pressureSensorsOptions.value = [...CREATE_YES_NO_UNKNOWN_OPTIONS]
      }
   }

   const loadModels = async (brandId, { local = false } = {}) => {
      if (!brandId) {
         isModelLoading.value = false
         modelOptions.value = []
         if (local) {
            setLocalField('disks_model_id', null)
         } else {
            updateField('disks_model_id', null)
         }
         return
      }

      isModelLoading.value = true

      try {
         const models = await fetchOptionsDirect(() => getDiskModels(brandId))

         modelOptions.value = normalizeCreateModelOptions(models, [
            'model_id',
            'disk_model_id'
         ])

         if (
            !modelOptions.value.some(
               (option) => String(option.id) === String(createStore.disks_model_id)
            )
         ) {
            if (local) {
               setLocalField('disks_model_id', null)
            } else {
               updateField('disks_model_id', null)
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

      updateField('disks_brand_id', brandId)
      updateField('disks_manufacturer', selectedBrand?.title || null)

      await loadModels(brandId)
   }

   const syncBrandSelectionFromStoredValues = async () => {
      await syncCreateBrandSelection({
         brandOptionsRef: brandOptions,
         initialBrandId: createStore.disks_brand_id,
         manufacturer: createStore.disks_manufacturer,
         setBrandId: (value) => setLocalField('disks_brand_id', value),
         setManufacturer: (value) =>
            setLocalField('disks_manufacturer', value),
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
      rimWidthOptions,
      rimDiameterOptions,
      etOptions,
      holeCountOptions,
      holePatternDiameterOptions,
      diaOptions,
      diskTypeOptions,
      conditionOptions,
      countOptions,
      repairStatusOptions,
      straightenedCountOptions,
      weldedCountOptions,
      cracksCountOptions,
      geometryChangesCountOptions,
      paintTypeOptions,
      centerCapsOptions,
      pressureSensorsOptions,
      defectsOptions,
      yearOptions,
      isUsedCondition,
      isRepairYes,
      updateField,
      handleDefectUpdate,
      handleBrandUpdate
   }
}
