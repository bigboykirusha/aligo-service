import { onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import {
   getAutogoodsMotoTireCondition as getMotoTireConditionOptions,
   getAutogoodsMotoTireBrand as getMotoTireBrandOptions,
   getAutogoodsMotoTireWidth as getMotoTireWidthOptions,
   getAutogoodsMotoTireHeight as getMotoTireHeightOptions,
   getAutogoodsMotoTireDiameter as getMotoTireDiameterOptions,
   getAutogoodsMotoTireAxle as getMotoTireAxleOptions
} from '~/services/apiClient'
import {
   buildDescendingYearOptions,
   normalizeCreateOptions
} from '~/store/createStore/optionsUtils'
import { createStaticOptionsLoader } from '~/composables/create/shared/staticOptionsLoader'

const MOTO_TIRE_COUNT_OPTIONS = Object.freeze([
   Object.freeze({ id: 1, title: '1' }),
   Object.freeze({ id: 2, title: '2' })
])

export const useCreatePassengerMotoTiresParametersModel = () => {
   const createStore = useCreateStore()
   const conditionOptions = ref([])
   const brandOptions = ref([])
   const widthOptions = ref([])
   const heightOptions = ref([])
   const diameterOptions = ref([])
   const axleOptions = ref([])
   const yearOptions = ref(buildDescendingYearOptions())

   const countOptions = MOTO_TIRE_COUNT_OPTIONS
   const { loadOptionGroups } = createStaticOptionsLoader({
      errorPrefix: 'Create moto tires options load failed'
   })

   const loadStaticOptions = async () => {
      const {
         conditions,
         brands,
         widths,
         heights,
         diameters,
         axles
      } = await loadOptionGroups([
         {
            key: 'conditions',
            cacheKey: 'moto-tires:condition',
            request: getMotoTireConditionOptions
         },
         {
            key: 'brands',
            cacheKey: 'moto-tires:brand',
            request: getMotoTireBrandOptions
         },
         {
            key: 'widths',
            cacheKey: 'moto-tires:width',
            request: getMotoTireWidthOptions
         },
         {
            key: 'heights',
            cacheKey: 'moto-tires:height',
            request: getMotoTireHeightOptions
         },
         {
            key: 'diameters',
            cacheKey: 'moto-tires:diameter',
            request: getMotoTireDiameterOptions
         },
         {
            key: 'axles',
            cacheKey: 'moto-tires:axle',
            request: getMotoTireAxleOptions
         }
      ])

      conditionOptions.value = normalizeCreateOptions(conditions, {
         idKeys: ['id', 'condition_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      brandOptions.value = normalizeCreateOptions(brands, {
         idKeys: ['id', 'brand_id', 'moto_tire_brand_id', 'value'],
         titleKeys: ['title', 'name', 'brand', 'label', 'value']
      })

      widthOptions.value = normalizeCreateOptions(widths, {
         idKeys: ['id', 'width_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      heightOptions.value = normalizeCreateOptions(heights, {
         idKeys: ['id', 'height_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      diameterOptions.value = normalizeCreateOptions(diameters, {
         idKeys: ['id', 'diameter_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value'],
         titleFormatter: (value) => {
            const normalized = String(value)
            return normalized.toLowerCase().startsWith('r')
               ? normalized
               : `R${normalized}`
         }
      })

      axleOptions.value = normalizeCreateOptions(axles, {
         idKeys: ['id', 'axle_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
   }

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   onMounted(loadStaticOptions)

   return {
      createStore,
      conditionOptions,
      brandOptions,
      widthOptions,
      heightOptions,
      diameterOptions,
      countOptions,
      axleOptions,
      yearOptions,
      updateField
   }
}
