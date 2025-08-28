<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div class="dropdown-2__label">{{ label }}</div>
      <div class="dropdown-2__input" @click="activateDropdown" :class="{ 'dropdown-2__input--disabled': disabled }">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" v-model="searchQuery" placeholder="Нажмите для выбора"
               :disabled="disabled" @input="filterOptions" @focus="activateDropdown" />
         </div>
      </div>
      <ul class="dropdown-2__list" v-if="isActive">
         <li v-for="option in filteredOptions" :key="option.id" class="dropdown-2__list-item"
            :class="{ 'dropdown-2__list-item--selected': selectedOption === option.id }" @click="selectOption(option)">
            {{ capitalize(option.title) }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
   options: {
      type: Array,
      required: true,
   },
   label: {
      type: String,
      default: '',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
   initialSelectedOption: {
      type: Array,
      default: () => [],
   },
});

const emit = defineEmits(['updateSort']);
const selectedOption = ref(props.initialSelectedOption.length ? props.initialSelectedOption[0] : null);
const isActive = ref(false);
const searchQuery = ref('');
const hasUserTyped = ref(false);

const sortedOptions = computed(() => {
   return (props.label === 'Год выпуска' || props.label === 'Шины и диски')
      ? [...props.options].reverse()
      : props.options;
});

const activateDropdown = () => {
   if (!props.disabled) {
      isActive.value = true;
      hasUserTyped.value = false;
   }
};

const filteredOptions = computed(() => {
   if (!hasUserTyped.value) return sortedOptions.value;

   const query = searchQuery.value.toLowerCase();
   return sortedOptions.value.filter(option => option.title.toLowerCase().startsWith(query));
});

const filterOptions = () => {
   hasUserTyped.value = true;
};

const selectOption = (option) => {
   selectedOption.value = option.id;
   searchQuery.value = displayedSelectedOptionTitle.value;
   isActive.value = false;
};

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      isActive.value = false;
      searchQuery.value = displayedSelectedOptionTitle.value;
   }
};

const displayedSelectedOptionTitle = computed(() => {
   const option = props.options.find(o => o.id === selectedOption.value);
   return option ? capitalize(option.title) : '';
});

const capitalize = (text) => {
   return text.charAt(0).toUpperCase() + text.slice(1);
};

onMounted(() => {
   document.addEventListener('click', handleClickOutside);
   searchQuery.value = displayedSelectedOptionTitle.value;
});

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside);
});

watch(() => props.initialSelectedOption, (newOption) => {
   if (newOption.length && newOption[0] !== selectedOption.value) {
      selectedOption.value = newOption[0];
   }
});

watch(selectedOption, (newOption) => {
   emit('updateSort', [newOption]);
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
         transform: translate(0, -50%) rotate(90deg);
         transition: 0.3s;
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

      .dropdown-2__input::before {
         background: url('@/assets/icons/arrow-gray.svg') center center / contain no-repeat;
         transform: translate(0, -50%);
      }

      &::placeholder {
         color: #787878;
      }
   }
}
</style>