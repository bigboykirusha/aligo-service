<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div class="dropdown-2__label">Город</div>
      <div class="dropdown-2__input" :class="{ 'dropdown__input--disabled': disabled }">
         <div class="input-wrapper">
            <input class="input" type="text" v-model="searchQuery" placeholder="Начните вводить название города"
               :disabled="disabled" @input="filterOptions" @focus="activateDropdown" />
         </div>
      </div>
      <ul class="dropdown-2__list" v-if="isActive && cities.length">
         <li v-for="city in cities" :key="city.id" class="dropdown-2__list-item" @click="selectCity(city)">
            {{ city.title }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineEmits, defineProps } from 'vue';
import { debounce } from 'lodash';
import { searchCitiesByName } from '@/services/apiClient';
import { useCreateStore } from '@/store/create';

const createStore = useCreateStore();

const props = defineProps({
   disabled: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['updateCity']);
const searchQuery = ref(createStore.city_name || '');
const cities = ref([]);
const isActive = ref(false);

const activateDropdown = () => {
   if (!props.disabled) {
      isActive.value = true;
   }
};

const searchCities = async (query) => {
   const q = query ?? '';
   if (q.length >= 1) {
      try {
         cities.value = await searchCitiesByName(q);
      } catch (error) {
         console.error('Ошибка поиска городов:', error);
      }
   } else {
      cities.value = [];
   }
};

const debouncedSearch = debounce((newQuery) => {
   searchCities(newQuery);
}, 300);

watch(searchQuery, (newQuery) => {
   debouncedSearch(newQuery);
});

const selectCity = (city) => {
   searchQuery.value = city.title;
   isActive.value = false;
   emit('updateCity', city);
};

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      isActive.value = false;
      searchQuery.value = createStore.city_name;
   }
};

onMounted(() => {
   searchQuery.value = createStore.city_name;
   document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped lang="scss">
.dropdown-2 {
   display: flex;
   position: relative;
   width: auto;
   align-items: center;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__input {
      position: relative;
      height: 34px;
      width: 310px;

      @media (max-width: 768px) {
         width: 100%;
      }

      &:focus {
         outline: none;
      }

      input {
         cursor: pointer;
         width: 100%;
         font-size: 14px;
         height: 34px;
         padding: 12px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;

         &:focus {
            outline: none;
         }
      }
   }

   &__list {
      position: absolute;
      border: 1px solid #3366FF;
      border-top: 1px solid #D6D6D6;
      left: 270px;
      top: 33px;
      z-index: 8;
      display: flex;
      flex-direction: column;
      list-style: none;
      width: 310px;
      max-height: 187px;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;

      @media (max-width: 768px) {
         width: 100%;
         left: 0;
         top: 60px;
      }
   }

   &__list-item {
      display: flex;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      line-height: 1.29em;
      gap: 10px;
      color: #787878;
      background: white;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
         background: #D6EFFF;
         color: #3366FF;
      }
   }

   &--active {
      .dropdown-2__input::before {
         transform: translate(0, -50%) rotate(-90deg);
      }

      .dropdown-2__list {
         border-radius: 0 0 6px 6px;
      }

      .dropdown-2__input input {
         border-radius: 6px 6px 0 0;
         border: 1px solid #3366FF;
      }
   }

   &--disabled {
      .dropdown-2__input {
         background: #EEEEEE;
         border-radius: 6px;
      }

      input {
         background: #EEEEEE;
         pointer-events: none;
         border: 1px solid #EEEEEE;
         border-radius: 6px;
      }

      &::placeholder {
         color: #787878;
      }
   }
}
</style>