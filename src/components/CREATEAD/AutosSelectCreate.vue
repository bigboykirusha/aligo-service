<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div class="dropdown-2__label">{{ label }}</div>
      <div class="dropdown-2__input" :class="{ 'dropdown-2__input--disabled': disabled }">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" v-model="searchQuery" placeholder="Нажмите для выбора"
               :disabled="disabled" @input="filterOptions" @focus="activateDropdown" />
         </div>
         <ul class="dropdown-2__list">
            <li v-for="option in filteredOptions" :key="option.id" class="dropdown-2__list-item"
               :class="{ 'dropdown-2__list-item--selected': selectedOption === option.id }"
               @click="selectOption(option)">
               {{ option.title }}
            </li>
         </ul>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineEmits, defineProps } from 'vue';
import { useDropdownStore } from '@/store/dropdownStore';

const props = defineProps({
   options: { type: Array, required: true },
   label: { type: String, default: '' },
   disabled: { type: Boolean, default: false },
   initialSelectedOption: { type: Number, default: null },
});

const emit = defineEmits(['updateSort']);

const dropdownStore = useDropdownStore();
const dropdownId = Math.random().toString(36).substr(2, 9);

const selectedOption = ref(props.initialSelectedOption);
const isActive = ref(false);
const searchQuery = ref('');
const hasUserTyped = ref(false);

const sortedOptions = computed(() => {
   return (props.label === 'Год выпуска' || props.label === 'Шины и диски')
      ? [...props.options].reverse()
      : props.options;
});

const filteredOptions = computed(() => {
   if (!hasUserTyped.value) return sortedOptions.value;
   const query = searchQuery.value.toLowerCase();
   return sortedOptions.value.filter(option =>
      option.title.toLowerCase().startsWith(query)
   );
});

const displayedSelectedOptionTitle = computed(() => {
   const option = props.options.find(o => o.id === selectedOption.value);
   return option ? option.title : '';
});

const activateDropdown = () => {
   if (!props.disabled) {
      dropdownStore.open(dropdownId);
      hasUserTyped.value = false;
   }
};

const filterOptions = () => {
   hasUserTyped.value = true;
};

const selectOption = (option) => {
   dropdownStore.close();
   selectedOption.value = option.id;
   searchQuery.value = option.title;
   emit('updateSort', selectedOption.value);
};

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      if (props.options.some(option => option.title === searchQuery.value)) {
         dropdownStore.close();
      } else {
         searchQuery.value = displayedSelectedOptionTitle.value;
         dropdownStore.close();
      }
   }
};

watch(() => dropdownStore.activeDropdownId, (newId) => {
   isActive.value = newId === dropdownId;
});

watch(selectedOption, (newOption) => {
   if (newOption !== props.initialSelectedOption) {
      emit('updateSort', newOption);
   }
});

watch(() => props.initialSelectedOption, (newSelectedOption) => {
   selectedOption.value = newSelectedOption;
   searchQuery.value = displayedSelectedOptionTitle.value;
}, { immediate: true });

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
   if (selectedOption.value) {
      searchQuery.value = displayedSelectedOptionTitle.value;
   }
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
   row-gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__input {
      position: relative;
      width: 310px;
      height: 34px;
      cursor: pointer;

      @media (max-width: 768px) {
         width: 100%;
      }

      &:focus {
         outline: none;
         border-color: #3366FF;
      }

      &::before {
         pointer-events: none;
         position: absolute;
         right: 14px;
         top: 50%;
         z-index: 1;
         content: '';
         width: 11px;
         height: 11px;
         background: url('@/assets/images/svg/arrow.svg') center center / contain no-repeat;
         transform: translate(0, -50%);
         transition: transform 0.2s ease;
      }

      input {
         width: 100%;
         font-size: 14px;
         position: relative;
         height: 34px;
         padding: 12px;
         border: 1px solid #d6d6d6;
         border-radius: 6px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         background-color: white;
         transition: border-color 0.3s ease;
         cursor: pointer;

         &:focus {
            outline: none;
            border-color: #3366FF;
         }

         &:disabled {
            background-color: #EEEEEE;
            border-color: #EEEEEE;
            pointer-events: none;
         }
      }
   }

   &__list {
      position: absolute;
      border: 1px solid #3366FF;
      border-top: 1px solid #D6D6D6;
      right: 0;
      z-index: 8;
      display: flex;
      flex-direction: column;
      list-style: none;
      width: 100%;
      max-height: 310px;
      width: 310px;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;

      transform-origin: top;
      transform: scaleY(0);
      transition: transform 0.2s ease, opacity 0.2s ease;
      opacity: 0;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__list-item {
      display: flex;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      color: #787878;
      background: white;
      transition: background-color 0.3s, color 0.3s;
      cursor: pointer;

      &:hover {
         background-color: #D6EFFF;
         color: #3366FF;
      }

      &--selected {
         background-color: #D6EFFF;
         color: #3366FF;
      }
   }

   &--active {
      .dropdown-2__input::before {
         transform: translate(0, -50%) rotate(-90deg);
      }

      .dropdown-2__list {
         border-radius: 0 0 6px 6px;
         transform: scaleY(1);
         opacity: 1;
      }

      .dropdown-2__input input {
         border-radius: 6px 6px 0 0;
         border: 1px solid #3366FF;
      }
   }

   &--disabled {
      .dropdown-2__input {
         background-color: #EEEEEE;
         border-radius: 4px;
         border-color: #EEEEEE;
         cursor: not-allowed;

         &::before {
            background: url('@/assets/icons/arrow-gray.svg') center top / contain no-repeat;
            transform: rotate(0);
         }

         input {
            background-color: #EEEEEE;
            border-color: #EEEEEE;
         }
      }

      .dropdown-2__list-item {
         color: #787878;
         cursor: not-allowed;
      }
   }
}
</style>