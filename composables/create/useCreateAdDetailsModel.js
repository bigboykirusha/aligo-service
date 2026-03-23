import { computed, onMounted, ref } from 'vue'
import { useCreateStore } from '@/store/create'
import { useModerationCreateStore } from '@/store/moderationCreateStore'
import { useUserStore } from '@/store/user'
import { useModalStore } from '@/store/modalStore'
import { getCommunicationMethod } from '@/services/apiClient'
import { fetchDataWithCache } from '@/services/createUtils'
import { useDraftRequiredFieldHighlight } from '@/composables/create/useDraftRequiredFieldHighlight'

const DEFAULT_PRICE_LABEL = 'Цена, ₽'

const parsePositiveInteger = (value) => {
   const parsed = Number.parseInt(String(value ?? ''), 10)
   return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const buildFlowPriceLabel = (count) => {
   if (!count) return DEFAULT_PRICE_LABEL
   return `Цена за ${count} шт., ₽`
}

export const useCreateAdDetailsModel = () => {
   const loading = ref(true)
   const createStore = useCreateStore()
   const moderationCreateStore = useModerationCreateStore()
   const userStore = useUserStore()
   const modalStore = useModalStore()
   const communicationMethodOptions = ref([])

   const isDraftEditMode = computed(() => Boolean(createStore.isDraftEditMode))
   const { shouldHighlightRequiredField, dismissRequiredField } =
      useDraftRequiredFieldHighlight(isDraftEditMode)

   const priceLabel = computed(() => {
      if (createStore.isPassengerTiresFlow) {
         return buildFlowPriceLabel(parsePositiveInteger(createStore.tires_count))
      }

      if (createStore.isPassengerDisksFlow) {
         return buildFlowPriceLabel(parsePositiveInteger(createStore.disks_count))
      }

      return DEFAULT_PRICE_LABEL
   })

   const selectedCityLabel = computed(
      () => createStore.city_name || 'Выберите город'
   )

   const updateField = (field, value) => {
      createStore.setField(field, value)
   }

   const openCityModal = () => {
      modalStore.open('location', {
         title: 'Выберите город',
         confirmText: 'Выбрать',
         persistSelection: false,
         onSelect: (city) => {
            void createStore.setField('city_id', city?.id || null)
            void createStore.setField(
               'city_name',
               String(city?.name || city?.title || '').trim() || null
            )
         }
      })
   }

   const fetchCommunicationMethodOptions = async () => {
      communicationMethodOptions.value = await fetchDataWithCache(
         'communicationMethodOptions',
         getCommunicationMethod
      )
   }

   const loadAdFormOptions = async () => {
      try {
         await fetchCommunicationMethodOptions()
      } catch (error) {
         console.error('Create ad form options load failed:', error)
      } finally {
         loading.value = false
      }
   }

   onMounted(() => {
      void loadAdFormOptions()
   })

   return {
      loading,
      createStore,
      moderationCreateStore,
      userStore,
      communicationMethodOptions,
      priceLabel,
      selectedCityLabel,
      shouldHighlightRequiredField,
      dismissRequiredField,
      updateField,
      openCityModal
   }
}
