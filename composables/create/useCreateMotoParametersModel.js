import { computed, onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import { normalizeCreateOptions } from '~/store/createStore/optionsUtils'
import {
   normalizeCreateBrandOptions,
   normalizeCreateModelOptions
} from '~/composables/create/parts/brandModelOptions'
import { createStaticOptionsLoader } from '~/composables/create/shared/staticOptionsLoader'

const normalizeToken = (value) =>
   String(value ?? '')
      .trim()
      .toLowerCase()

const isNewConditionToken = (value) => {
   const token = normalizeToken(value)
   return (
      token === '1' ||
      token === 'new' ||
      token === 'новое' ||
      token === 'новые'
   )
}

const isNoPtsToken = (value) => {
   const token = normalizeToken(value)
   return token === '0' || token === 'none' || token === 'no' || token === 'нет'
}

const normalizeGenericOptions = (list) =>
   normalizeCreateOptions(list, {
      idKeys: ['id', 'value', 'type_id', 'brand_id', 'model_id'],
      titleKeys: ['title', 'name', 'label', 'value']
   })

const resolveBooleanByOption = ({ value, options, fallbackCheck }) => {
   const selectedOption = options.find(
      (option) => String(option.id) === String(value)
   )

   if (!selectedOption) return fallbackCheck(value)
   return fallbackCheck(selectedOption.title)
}

const MOTO_TYPE_OPTIONS_CACHE_REVISION = 'v2'

export const useCreateMotoParametersModel = ({
   flowKey,
   brandLoader,
   modelLoader,
   typeLoader,
   yearLoader,
   conditionLoader,
   availabilityLoader,
   engineTypeLoader,
   fuelFeedLoader,
   driveTypeLoader,
   strokeLoader,
   transmissionLoader,
   numberOfGearsLoader,
   engineCoolingLoader,
   ptsLoader,
   countOwnerLoader,
   extraLoaders = {}
}) => {
   const createStore = useCreateStore()
   const EXTRA_SELECT_SUFFIX_BY_KEY = Object.freeze({
      countCylinderOptions: 'count_cylinder_id',
      cylinderPositionOptions: 'cylinder_position_id'
   })

   const fieldName = (suffix) => `${flowKey}_${suffix}`

   const conditionOptions = ref([])
   const availabilityOptions = ref([])
   const brandOptions = ref([])
   const modelOptions = ref([])
   const isModelLoading = ref(false)
   const typeOptions = ref([])
   const engineTypeOptions = ref([])
   const fuelFeedOptions = ref([])
   const driveTypeOptions = ref([])
   const strokeOptions = ref([])
   const transmissionOptions = ref([])
   const numberOfGearsOptions = ref([])
   const engineCoolingOptions = ref([])
   const ptsOptions = ref([])
   const countOwnerOptions = ref([])

   const extraOptionsByKey = Object.keys(extraLoaders).reduce((acc, key) => {
      acc[key] = ref([])
      return acc
   }, {})

   const yearOptions = ref([])
   const { loadOptionGroups, safeFetchOptions, fetchOptionsDirect } = createStaticOptionsLoader({
      errorPrefix: 'Create moto options load failed'
   })

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   const setLocalField = (field, value) => {
      createStore[field] = value
   }

   const hasOptionWithId = (options, value) =>
      (Array.isArray(options) ? options : []).some(
         (option) => String(option?.id) === String(value)
      )

   const clearInvalidSelectValue = (suffix, options) => {
      const field = fieldName(suffix)
      const currentValue = createStore[field]
      if (currentValue === null || currentValue === undefined || currentValue === '') {
         return
      }
      if (hasOptionWithId(options, currentValue)) return
      setLocalField(field, null)
   }

   const selectedConditionIsNew = computed(() =>
      resolveBooleanByOption({
         value: createStore[fieldName('condition_id')],
         options: conditionOptions.value,
         fallbackCheck: isNewConditionToken
      })
   )

   const selectedPtsIsMissing = computed(() =>
      resolveBooleanByOption({
         value: createStore[fieldName('pts_id')],
         options: ptsOptions.value,
         fallbackCheck: isNoPtsToken
      })
   )

   const isMileageVisible = computed(() => !selectedConditionIsNew.value)
   const isOwnersVisible = computed(
      () => !selectedConditionIsNew.value && !selectedPtsIsMissing.value
   )

   const clearConditionDependentFields = () => {
      if (!isMileageVisible.value) {
         updateField(fieldName('mileage'), null)
      }
      if (!isOwnersVisible.value) {
         updateField(fieldName('count_owner_id'), null)
      }
   }

   const isModelSelectDisabled = computed(
      () => isModelLoading.value || modelOptions.value.length === 0
   )

   const loadModels = async (brandId, { local = false } = {}) => {
      const modelField = fieldName('model_id')

      if (!brandId) {
         isModelLoading.value = false
         modelOptions.value = []
         if (local) {
            setLocalField(modelField, null)
         } else {
            updateField(modelField, null)
         }
         return
      }

      isModelLoading.value = true

      try {
         const rawModels = await fetchOptionsDirect(() => modelLoader(brandId))
         modelOptions.value = normalizeCreateModelOptions(rawModels, ['model_id'])

         const currentModelValue = createStore[modelField]
         const hasCurrentModel = modelOptions.value.some(
            (option) => String(option.id) === String(currentModelValue)
         )
         if (hasCurrentModel) return

         if (local) {
            setLocalField(modelField, null)
         } else {
            updateField(modelField, null)
         }
      } finally {
         isModelLoading.value = false
      }
   }

   const handleBrandUpdate = async (brandId) => {
      updateField(fieldName('brand_id'), brandId)
      await loadModels(brandId)
   }

   const loadStaticOptions = async () => {
      const {
         conditions,
         availability,
         brands,
         types,
         years,
         engineTypes,
         fuelFeeds,
         driveTypes,
         strokes,
         transmissions,
         numberOfGears,
         engineCooling,
         ptsValues,
         ownerCounts
      } = await loadOptionGroups([
         {
            key: 'conditions',
            cacheKey: `moto:${flowKey}:condition`,
            request: conditionLoader
         },
         {
            key: 'availability',
            cacheKey: `moto:${flowKey}:availability`,
            request: availabilityLoader
         },
         {
            key: 'brands',
            cacheKey: `moto:${flowKey}:brand`,
            request: brandLoader
         },
         {
            key: 'types',
            cacheKey: `moto:${flowKey}:type:${MOTO_TYPE_OPTIONS_CACHE_REVISION}`,
            request: typeLoader
         },
         {
            key: 'years',
            cacheKey: `moto:${flowKey}:year`,
            request: yearLoader
         },
         {
            key: 'engineTypes',
            cacheKey: `moto:${flowKey}:engine-type`,
            request: engineTypeLoader
         },
         {
            key: 'fuelFeeds',
            cacheKey: `moto:${flowKey}:fuel-feed`,
            request: fuelFeedLoader
         },
         {
            key: 'driveTypes',
            cacheKey: `moto:${flowKey}:drive-type`,
            request: driveTypeLoader
         },
         {
            key: 'strokes',
            cacheKey: `moto:${flowKey}:stroke`,
            request: strokeLoader
         },
         {
            key: 'transmissions',
            cacheKey: `moto:${flowKey}:transmission`,
            request: transmissionLoader
         },
         {
            key: 'numberOfGears',
            cacheKey: `moto:${flowKey}:number-of-gears`,
            request: numberOfGearsLoader
         },
         {
            key: 'engineCooling',
            cacheKey: `moto:${flowKey}:engine-cooling`,
            request: engineCoolingLoader
         },
         {
            key: 'ptsValues',
            cacheKey: `moto:${flowKey}:pts`,
            request: ptsLoader
         },
         {
            key: 'ownerCounts',
            cacheKey: `moto:${flowKey}:count-owner`,
            request: countOwnerLoader
         }
      ])

      conditionOptions.value = normalizeGenericOptions(conditions)
      availabilityOptions.value = normalizeGenericOptions(availability)
      brandOptions.value = normalizeCreateBrandOptions(brands, ['brand_id'])
      typeOptions.value = normalizeGenericOptions(types)
      yearOptions.value = normalizeGenericOptions(years)
      engineTypeOptions.value = normalizeGenericOptions(engineTypes)
      fuelFeedOptions.value = normalizeGenericOptions(fuelFeeds)
      driveTypeOptions.value = normalizeGenericOptions(driveTypes)
      strokeOptions.value = normalizeGenericOptions(strokes)
      transmissionOptions.value = normalizeGenericOptions(transmissions)
      numberOfGearsOptions.value = normalizeGenericOptions(numberOfGears)
      engineCoolingOptions.value = normalizeGenericOptions(engineCooling)
      ptsOptions.value = normalizeGenericOptions(ptsValues)
      countOwnerOptions.value = normalizeGenericOptions(ownerCounts)

      await Promise.all(
         Object.entries(extraLoaders).map(async ([key, loader]) => {
            const list = await safeFetchOptions(`moto:${flowKey}:${key}`, loader)
            extraOptionsByKey[key].value = normalizeGenericOptions(list)
         })
      )

      clearInvalidSelectValue('condition_id', conditionOptions.value)
      clearInvalidSelectValue('availability_id', availabilityOptions.value)
      clearInvalidSelectValue('brand_id', brandOptions.value)
      clearInvalidSelectValue('type_id', typeOptions.value)
      clearInvalidSelectValue('year', yearOptions.value)
      clearInvalidSelectValue('engine_type_id', engineTypeOptions.value)
      clearInvalidSelectValue('fuel_feed_id', fuelFeedOptions.value)
      clearInvalidSelectValue('drive_type_id', driveTypeOptions.value)
      clearInvalidSelectValue('stroke_id', strokeOptions.value)
      clearInvalidSelectValue('transmission_id', transmissionOptions.value)
      clearInvalidSelectValue('number_of_gears_id', numberOfGearsOptions.value)
      clearInvalidSelectValue('engine_cooling_id', engineCoolingOptions.value)
      clearInvalidSelectValue('pts_id', ptsOptions.value)
      clearInvalidSelectValue('count_owner_id', countOwnerOptions.value)

      Object.entries(extraOptionsByKey).forEach(([key, optionsRef]) => {
         const fieldSuffix = EXTRA_SELECT_SUFFIX_BY_KEY[key]
         if (!fieldSuffix) return
         clearInvalidSelectValue(fieldSuffix, optionsRef.value)
      })
   }

   onMounted(async () => {
      await loadStaticOptions()
      await loadModels(createStore[fieldName('brand_id')], { local: true })
      clearConditionDependentFields()
   })

   return {
      createStore,
      fieldName,
      conditionOptions,
      availabilityOptions,
      brandOptions,
      modelOptions,
      isModelSelectDisabled,
      typeOptions,
      yearOptions,
      engineTypeOptions,
      fuelFeedOptions,
      driveTypeOptions,
      strokeOptions,
      transmissionOptions,
      numberOfGearsOptions,
      engineCoolingOptions,
      ptsOptions,
      countOwnerOptions,
      ...extraOptionsByKey,
      isMileageVisible,
      isOwnersVisible,
      updateField,
      handleBrandUpdate,
      clearConditionDependentFields
   }
}

