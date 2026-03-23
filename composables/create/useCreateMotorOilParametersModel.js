import { onMounted, ref } from 'vue'
import { useCreateStore } from '~/store/create'
import {
   getAutogoodsMotorOilCondition as getMotorOilConditionOptions,
   getAutogoodsMotorOilBrand as getMotorOilBrandOptions,
   getAutogoodsMotorOilViscosityClassSae as getMotorOilSaeOptions,
   getAutogoodsMotorOilVolume as getMotorOilVolumeOptions,
   getAutogoodsMotorOilStandartAcea as getMotorOilAceaOptions,
   getAutogoodsMotorOilStandartApi as getMotorOilApiOptions,
   getAutogoodsMotorOilAllowOem as getMotorOilOemOptions
} from '~/services/apiClient'
import { normalizeCreateOptions } from '~/store/createStore/optionsUtils'
import { createStaticOptionsLoader } from '~/composables/create/shared/staticOptionsLoader'

export const useCreateMotorOilParametersModel = () => {
   const createStore = useCreateStore()

   const conditionOptions = ref([])
   const brandOptions = ref([])
   const saeOptions = ref([])
   const volumeOptions = ref([])
   const aceaOptions = ref([])
   const apiOptions = ref([])
   const oemOptions = ref([])
   const { loadOptionGroups } = createStaticOptionsLoader({
      errorPrefix: 'Create motor oil options load failed'
   })

   const updateField = (field, value) => {
      if (field === 'motor_oil_article' || field === 'motor_oil_article_id') {
         const normalizedValue = String(value || '').trim()
         createStore.setField('motor_oil_article', normalizedValue)
         createStore.setField('motor_oil_article_id', normalizedValue)
         return
      }

      createStore.setField(field, value)
   }

   const loadStaticOptions = async () => {
      const {
         conditions,
         brands,
         saeValues,
         volumes,
         aceaValues,
         apiValues,
         oemValues
      } = await loadOptionGroups([
         {
            key: 'conditions',
            cacheKey: 'motor-oil:condition',
            request: getMotorOilConditionOptions
         },
         {
            key: 'brands',
            cacheKey: 'motor-oil:brand',
            request: getMotorOilBrandOptions
         },
         {
            key: 'saeValues',
            cacheKey: 'motor-oil:sae',
            request: getMotorOilSaeOptions
         },
         {
            key: 'volumes',
            cacheKey: 'motor-oil:volume',
            request: getMotorOilVolumeOptions
         },
         {
            key: 'aceaValues',
            cacheKey: 'motor-oil:acea',
            request: getMotorOilAceaOptions
         },
         {
            key: 'apiValues',
            cacheKey: 'motor-oil:api',
            request: getMotorOilApiOptions
         },
         {
            key: 'oemValues',
            cacheKey: 'motor-oil:oem',
            request: getMotorOilOemOptions
         }
      ])

      conditionOptions.value = normalizeCreateOptions(conditions, {
         idKeys: ['id', 'condition_id', 'state_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      brandOptions.value = normalizeCreateOptions(brands, {
         idKeys: ['id', 'brand_id', 'motor_oil_brand_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      saeOptions.value = normalizeCreateOptions(saeValues, {
         idKeys: ['id', 'sae_id', 'viscosity_class_sae_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      volumeOptions.value = normalizeCreateOptions(volumes, {
         idKeys: ['id', 'volume_id', 'motor_oil_volume_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      aceaOptions.value = normalizeCreateOptions(aceaValues, {
         idKeys: ['id', 'acea_id', 'standart_acea_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      apiOptions.value = normalizeCreateOptions(apiValues, {
         idKeys: ['id', 'api_id', 'standart_api_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })

      oemOptions.value = normalizeCreateOptions(oemValues, {
         idKeys: ['id', 'oem_id', 'allow_oem_id', 'value'],
         titleKeys: ['title', 'name', 'label', 'value']
      })
   }

   onMounted(async () => {
      await loadStaticOptions()
   })

   return {
      createStore,
      conditionOptions,
      brandOptions,
      saeOptions,
      volumeOptions,
      aceaOptions,
      apiOptions,
      oemOptions,
      updateField
   }
}
