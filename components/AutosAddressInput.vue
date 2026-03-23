<template>
   <div class="address-input" :class="{ 'address-input--error': shouldShowError }">
      <SelectUI
         ref="addressSelectRef"
         :label="label"
         :placeholder="placeholder"
         :options="selectOptions"
         :initial-selected-option="selectedOptionId"
         :layout="layout"
         :label-width="labelWidth"
         :input-width="inputWidth"
         searchable
         search-mode="includes"
         preserve-search-value-on-close
         :loading="isFetchingSuggestions"
         :disabled="disabled"
         loading-text="Ищем адрес..."
         class="address-input__select"
         @updateSort="handleSelect"
         @search-input="handleSearchInput"
         @open="handleOpen"
         @close="handleClose"
      />
   </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import SelectUI from '~/components/ui/SelectUI.vue'
import { useCreateStore } from '~/store/create'
import { fetchSuggestions } from '~/services/apiLocation'

const MIN_QUERY_LENGTH = 3

const props = defineProps({
   label: {
      type: String,
      default: ''
   },
   placeholder: {
      type: String,
      default: 'Введите адрес'
   },
   option: {
      type: String,
      default: ''
   },
   latitude: {
      type: [String, Number],
      default: undefined
   },
   longitude: {
      type: [String, Number],
      default: undefined
   },
   syncStoreCoordinates: {
      type: Boolean,
      default: true
   },
   layout: {
      type: String,
      default: 'row'
   },
   labelWidth: {
      type: String,
      default: '270px'
   },
   inputWidth: {
      type: String,
      default: '510px'
   },
   disabled: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits([
   'update:address',
   'update:latitude',
   'update:longitude'
])

const createStore = useCreateStore()
const addressSelectRef = ref(null)
const suggestions = ref([])
const initialAddress = String(props.option || '').trim()
const currentQuery = ref(initialAddress)
const selectedSuggestion = ref(
   initialAddress ? { fullAddress: initialAddress } : null
)
const isDropdownOpen = ref(false)
const isFetchingSuggestions = ref(false)

let suggestionsRequestId = 0

const invalidateSuggestionsRequests = () => {
   suggestionsRequestId += 1
   isFetchingSuggestions.value = false
}

const normalizeCoordinate = (value) => {
   const parsed = Number(value)
   return Number.isFinite(parsed) ? String(parsed) : null
}

const saveCoordinates = (lat, lon) => {
   const normalizedLat = normalizeCoordinate(lat)
   const normalizedLon = normalizeCoordinate(lon)

   emit('update:latitude', normalizedLat)
   emit('update:longitude', normalizedLon)

   if (props.syncStoreCoordinates) {
      void createStore.setField('latitude', normalizedLat)
      void createStore.setField('longitude', normalizedLon)
   }
}

const clearCoordinates = () => {
   emit('update:latitude', null)
   emit('update:longitude', null)

   if (props.syncStoreCoordinates) {
      void createStore.setField('latitude', null)
      void createStore.setField('longitude', null)
   }
}

const buildOptionId = (value, index = 0) =>
   `address:${index}:${String(value || '').trim()}`

const selectedOptionId = computed(() => {
   const title = String(selectedSuggestion.value?.fullAddress || '').trim()
   return title ? buildOptionId(title, 0) : null
})

const selectOptions = computed(() => {
   const options = []
   const seen = new Set()

   const selectedTitle = String(selectedSuggestion.value?.fullAddress || '').trim()
   if (selectedTitle) {
      options.push({
         id: selectedOptionId.value,
         title: selectedTitle,
         raw: selectedSuggestion.value
      })
      seen.add(selectedTitle)
   }

   suggestions.value.forEach((suggestion, index) => {
      const title = String(suggestion?.fullAddress || '').trim()
      if (!title || seen.has(title)) return

      options.push({
         id: buildOptionId(title, index + 1),
         title,
         raw: suggestion
      })
      seen.add(title)
   })

   return options
})

const shouldShowError = computed(
   () =>
      !selectedSuggestion.value &&
      currentQuery.value.trim().length >= MIN_QUERY_LENGTH &&
      !isDropdownOpen.value
)

const clearSuggestions = () => {
   suggestions.value = []
}

const syncAddress = (value) => {
   currentQuery.value = String(value || '').trim()
   emit('update:address', currentQuery.value || null)
}

const fetchSuggestionsData = async (query) => {
   const normalizedQuery = String(query || '').trim()
   if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      invalidateSuggestionsRequests()
      clearSuggestions()
      return
   }

   const requestId = ++suggestionsRequestId
   isFetchingSuggestions.value = true

   try {
      const response = await fetchSuggestions(normalizedQuery, { results: 6 })
      if (requestId !== suggestionsRequestId) return
      if (!isDropdownOpen.value) return
      if (currentQuery.value.trim() !== normalizedQuery) return
      suggestions.value = Array.isArray(response) ? response : []
   } catch {
      if (requestId === suggestionsRequestId) {
         clearSuggestions()
      }
   } finally {
      if (requestId === suggestionsRequestId) {
         isFetchingSuggestions.value = false
      }
   }
}

const debouncedFetchSuggestions = debounce(fetchSuggestionsData, 250)

const handleSearchInput = (value) => {
   if (props.disabled) return

   const query = String(value || '')
   syncAddress(query)

   if (
      selectedSuggestion.value &&
      query.trim() !== String(selectedSuggestion.value.fullAddress || '').trim()
   ) {
      selectedSuggestion.value = null
      clearCoordinates()
   }

   if (!query.trim()) {
      invalidateSuggestionsRequests()
      clearSuggestions()
      clearCoordinates()
      return
   }

   debouncedFetchSuggestions(query)
}

const handleSelect = (optionId) => {
   if (props.disabled) return

   const option = selectOptions.value.find(
      (item) => String(item.id) === String(optionId)
   )

   if (!option?.raw) return

   selectedSuggestion.value = option.raw
   syncAddress(option.raw.fullAddress)
   saveCoordinates(option.raw.lat, option.raw.lon)
   invalidateSuggestionsRequests()
   clearSuggestions()
   isDropdownOpen.value = false
   addressSelectRef.value?.closeDropdown?.()
}

const handleOpen = () => {
   if (props.disabled) return

   isDropdownOpen.value = true
   const query = currentQuery.value.trim()

   if (query.length >= MIN_QUERY_LENGTH) {
      void fetchSuggestionsData(query)
   }
}

const handleClose = () => {
   isDropdownOpen.value = false
   invalidateSuggestionsRequests()
   clearSuggestions()
}

watch(
   () => props.option,
   (newValue) => {
      const normalizedValue = String(newValue || '').trim()
      currentQuery.value = normalizedValue
      selectedSuggestion.value = normalizedValue
         ? { fullAddress: normalizedValue }
         : null

      if (!normalizedValue) {
         invalidateSuggestionsRequests()
         clearSuggestions()
         clearCoordinates()
      }
   },
   { immediate: true }
)

watch(
   () => [props.latitude, props.longitude],
   ([lat, lon]) => {
      if (lat === undefined && lon === undefined) return

      if (!normalizeCoordinate(lat) || !normalizeCoordinate(lon)) {
         if (!selectedSuggestion.value) {
            clearCoordinates()
         }
      }
   }
)

onBeforeUnmount(() => {
   debouncedFetchSuggestions.cancel()
   invalidateSuggestionsRequests()
})
</script>

<style scoped lang="scss">
.address-input {
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 6px;

   &__select {
      width: 100%;
   }

   :deep(.select-field__control::before) {
      display: none;
   }

   &--error :deep(.select-field__control input) {
      border-color: #ff5959;
   }
}
</style>
