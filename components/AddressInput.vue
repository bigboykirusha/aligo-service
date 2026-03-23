<template>
   <div class="address-input">
      <div class="address-input__wrapper">
         <input
            v-model="inputValue"
            type="text"
            class="address-input__field"
            :placeholder="placeholder"
            @input="handleInput"
            @keydown.enter.prevent="handleEnterKey"
         >
         <ul v-if="suggestions.length" class="address-input__suggestions">
            <li
               v-for="(suggestion, index) in suggestions"
               :key="index"
               class="address-input__suggestion"
               @click="selectSuggestion(suggestion)"
            >
               {{ suggestion.fullAddress }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { fetchSuggestions } from '~/services/apiLocation'

defineProps({
   placeholder: {
      type: String,
      default: 'Введите адрес'
   }
})

const emit = defineEmits(['update:address'])

const inputValue = ref('')
const suggestions = ref([])

const fetchSuggestionsData = async (query) => {
   try {
      suggestions.value = await fetchSuggestions(query)
   } catch (error) {
      console.error('Ошибка получения предложений:', error)
   }
}

const debouncedFetchSuggestions = debounce(fetchSuggestionsData, 300)

const handleInput = () => {
   if (inputValue.value.length > 3) {
      debouncedFetchSuggestions(inputValue.value)
   } else {
      suggestions.value = []
   }
}

const selectSuggestion = (suggestion) => {
   inputValue.value = suggestion.fullAddress
   suggestions.value = []
   emit('update:address', inputValue.value)
}

const handleEnterKey = () => {
   if (suggestions.value.length > 0) {
      selectSuggestion(suggestions.value[0])
   } else {
      emit('update:address', inputValue.value)
   }
}

// Watch for changes in inputValue and emit them
watch(inputValue, (newValue) => {
   emit('update:address', newValue)
})
</script>

<style scoped>
/* Стили для вашего компонента AddressInput */
.address-input__wrapper {
   position: relative;
}

.address-input__suggestions {
   top: 100%;
   left: 0;
   width: 100%;
   background: white;
   border: 1px solid #ddd;
   z-index: 1000;
   max-height: 200px;
   overflow-y: auto;
}

.address-input__suggestion {
   padding: 10px;
   cursor: pointer;
}

.address-input__suggestion:hover {
   background-color: #f0f0f0;
}
</style>
