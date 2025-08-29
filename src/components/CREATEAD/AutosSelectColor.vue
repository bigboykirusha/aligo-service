<template>
   <div class="address-input">
      <label v-if="label" class="address-input__label">{{ label }}</label>
      <div class="address-input__wrapper">
         <input type="text" class="address-input__field" :class="{ 'address-input__field--error': shouldShowError }"
            :placeholder="placeholder" v-model="inputValue" @input="handleInput" @keydown.enter.prevent="handleEnterKey"
            @focus="handleFocus" @blur="handleBlur" />
         <img v-if="inputValue" :src="closeIcon" alt="Clear" class="address-input__clear" @click="clearInput" />
         <ul v-if="suggestions.length" class="address-input__suggestions">
            <li v-for="(suggestion, index) in suggestions" :key="index" class="address-input__suggestion"
               @click="selectSuggestion(suggestion)">
               {{ suggestion.fullAddress }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineEmits, defineProps } from 'vue';
import { useCreateStore } from '@/store/create';
import { debounce } from 'lodash';
import { fetchSuggestions } from '@/services/apiLocation';
import closeIcon from '@/assets/icons/close-gray.svg';

const props = defineProps({
   label: String,
   placeholder: {
      type: String,
      default: 'Введите адрес',
   },
   option: {
      type: String,
   },
});

const emit = defineEmits(['update:address']);

const inputValue = ref(props.option);
const suggestions = ref([]);
const isSuggestionSelected = ref(true);
const isFocused = ref(false);

const country = ref('');
const city = ref('');
const street = ref('');
const latitude = ref(null);
const longitude = ref(null);

const createStore = useCreateStore();

const fetchSuggestionsData = async (query) => {
   try {
      suggestions.value = await fetchSuggestions(query);
   } catch (error) {
      console.error('Ошибка получения предложений:', error);
   }
};

const debouncedFetchSuggestions = debounce(fetchSuggestionsData, 300);

const handleInput = () => {
   isSuggestionSelected.value = false;

   if (inputValue.value.length > 3) {
      emit('update:address', inputValue.value);
      debouncedFetchSuggestions(inputValue.value);
   } else {
      suggestions.value = [];
   }
};

const selectSuggestion = (suggestion) => {
   inputValue.value = suggestion.fullAddress;
   suggestions.value = [];
   isSuggestionSelected.value = true;

   parseAddress(suggestion.geoObject);

   if (latitude.value && longitude.value) {
      createStore.setField('latitude', latitude.value);
      createStore.setField('longitude', longitude.value);
   }

   emit('update:address', inputValue.value);
};

const shouldShowError = computed(() => {
   return !isSuggestionSelected.value && inputValue.value.length > 0 && !isFocused.value;
});

const confirmAddress = () => {

   if (latitude.value && longitude.value) {
      createStore.setField('latitude', latitude.value);
      createStore.setField('longitude', longitude.value);
   }

   emit('update:address', inputValue.value);
};

const parseAddress = (geoObject) => {
   const components = geoObject.metaDataProperty.GeocoderMetaData.Address.Components;

   country.value = '';
   city.value = '';
   street.value = '';
   latitude.value = geoObject.Point.pos.split(' ')[1];
   longitude.value = geoObject.Point.pos.split(' ')[0];

   components.forEach((component) => {
      switch (component.kind) {
         case 'country':
            country.value = component.name;
            break;
         case 'locality':
         case 'province':
            city.value = component.name;
            break;
         case 'street':
            street.value = component.name;
            break;
      }
   });

   if (!city.value && geoObject.description) {
      const descriptionParts = geoObject.description.split(', ');
      city.value = descriptionParts[0];
   }
};

const handleEnterKey = async () => {
   if (suggestions.value.length > 0) {
      selectSuggestion(suggestions.value[0]);
   } else {
      confirmAddress();
   }
};

const clearInput = () => {
   inputValue.value = '';
   suggestions.value = [];
   emit('update:address', null);
};

const handleFocus = () => {
   isFocused.value = true;
};

const handleBlur = () => {
   isFocused.value = false;
};

const handleClickOutside = (event) => {
   const component = document.querySelector('.address-input');
   if (component && !component.contains(event.target)) {
      suggestions.value = [];
   }
};

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
   document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.address-input {
   display: flex;
   align-items: center;

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      margin-bottom: 8px;
      min-width: 270px;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__wrapper {
      position: relative;
      width: 340px;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;

      &--error {
         border-color: #FF5959;
      }

      &:focus {
         outline: none;
         border-radius: 6px 6px 0 0;
      }
   }

   &__suggestions {
      position: absolute;
      top: calc(100% - 1px);
      left: 0;
      right: 0;
      background-color: #fff;
      border: 1px solid #d6d6d6;
      border-radius: 0 0 6px 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;
      transition: opacity 0.3s ease;
   }

   &__clear {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      width: 14px;
      height: 14px;

      &:hover {
         opacity: 0.7;
      }
   }

   &__suggestion {
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
         background-color: #f0f0f0;
      }
   }

   button {
      outline: none;
      text-decoration: none;
      border: none;
      border-radius: 50%;
      background-color: #3366FF;
      color: white;
      width: 30px;
      height: 30px;
      margin-left: 10px;
   }

   &__parts {
      margin-top: 16px;

      p {
         margin: 4px 0;
      }
   }
}
</style>
