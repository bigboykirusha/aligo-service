import { onMounted, ref } from 'vue'
import { useCreateStore } from '@/store/create'
import {
   getCarsAudioSystem,
   getCarsClimate,
   getCarsElectricWindow,
   getCarsHeadlight,
   getCarsPowerSteering,
   getCarsSalon,
   getCarsWheels
} from '@/services/apiClient'
import { fetchDataWithCache } from '@/services/createUtils'

export const useCreateAutosOptionsModel = () => {
   const loading = ref(true)
   const createStore = useCreateStore()
   const powerSteeringOptions = ref([])
   const salonOptions = ref([])
   const electricWindowOptions = ref([])
   const audioSystemOptions = ref([])
   const wheelsOptions = ref([])
   const headlightOptions = ref([])
   const climateOptions = ref([])

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   const loadOptionsRef = async (targetRef, cacheKey, request) => {
      targetRef.value = await fetchDataWithCache(cacheKey, request)
   }

   const optionLoaders = [
      [salonOptions, 'salonOptions', getCarsSalon],
      [powerSteeringOptions, 'powerSteeringOptions', getCarsPowerSteering],
      [electricWindowOptions, 'electricWindowOptions', getCarsElectricWindow],
      [audioSystemOptions, 'audioSystemOptions', getCarsAudioSystem],
      [wheelsOptions, 'wheelsOptions', getCarsWheels],
      [climateOptions, 'climateOptions', getCarsClimate],
      [headlightOptions, 'headlightOptions', getCarsHeadlight]
   ]

   const loadOptions = async () => {
      loading.value = true
      try {
         await Promise.all(
            optionLoaders.map(([targetRef, cacheKey, request]) =>
               loadOptionsRef(targetRef, cacheKey, request)
            )
         )
      } catch (error) {
         console.error('Create: failed to load autos options:', error)
      } finally {
         loading.value = false
      }
   }

   onMounted(() => {
      loadOptions()
   })

   return {
      loading,
      createStore,
      powerSteeringOptions,
      salonOptions,
      electricWindowOptions,
      audioSystemOptions,
      wheelsOptions,
      headlightOptions,
      climateOptions,
      updateField
   }
}
