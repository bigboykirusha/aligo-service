<template>
   <div class="dropdown-2" :class="{ 'dropdown-2--active': isActive, 'dropdown-2--disabled': disabled }" ref="dropdown">
      <div v-if="label" class="dropdown-2__label">{{ label }}</div>
      <div class="dropdown-2__input" @click="toggleDropdown" :class="{ 'dropdown-2__input--disabled': disabled }">
         <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
            <input class="input-text-2__input" type="text" :value="displayedSelectedOptionTitle"
               :placeholder="placeholder" readonly :disabled="disabled" />
         </div>
      </div>
      <ul class="dropdown-2__list" :class="{ 'dropdown-2__list--no-label': !label }" v-if="isActive">
         <li v-for="option in sortedOptions" :key="option.id" class="dropdown-2__list-item"
            :class="{ 'dropdown-2__list-item--selected': selectedOption === option.id }"
            @click="selectOption(option.id)">
            {{ option.title }}
         </li>
      </ul>
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps,  defineEmits } from 'vue';

const props = defineProps({
   options: {
      type: Array,
      required: true,
   },
   label: {
      type: String,
      default: null,
   },
   disabled: {
      type: Boolean,
      default: false,
   },
   initialSelectedOption: {
      type: Number,
      default: null,
   },
   placeholder: {
      type: String,
      default: 'Нажмите',
   },
   isRevers: {
      type: Boolean,
      default: false,
   }
});

const emit = defineEmits(['updateSort']);
const selectedOption = ref(props.initialSelectedOption);
const isActive = ref(false);

const toggleDropdown = () => {
   if (!props.disabled) {
      isActive.value = !isActive.value;
   }
};

watch(
   () => props.initialSelectedOption,
   (newValue) => {
      selectedOption.value = newValue;
   },
   { immediate: true }
);

const displayedSelectedOptionTitle = computed(() => {
   const option = props.options.find((o) => o.id === selectedOption.value);
   return option ? option.title : '';
});

const sortedOptions = computed(() => {
   return props.isRevers ? [...props.options].reverse() : props.options;
});

const selectOption = (id) => {
   selectedOption.value = id;
   isActive.value = false;
   emit('updateSort', selectedOption.value);
};

const handleClickOutside = (event) => {
   if (!props.disabled && !event.target.closest('.dropdown-2')) {
      isActive.value = false;
   }
};

onMounted(() => {
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
   flex-direction: column;
   gap: 8px;

   &__label {
      font-size: 12px;
      color: #323232;
   }

   &__input {
      position: relative;
      height: 34px;
      width: 310px;

      @media screen and (max-width: 768px) {
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
            border: 1px solid #3366FF;
         }
      }
   }

   &__list {
      position: absolute;
      border: 1px solid #3366FF;
      border-top: 1px solid #D6D6D6;
      left: 0;
      top: 58px;
      z-index: 8;
      display: flex;
      flex-direction: column;
      list-style: none;
      width: 310px;
      max-height: 187px;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;


      @media screen and (max-width: 768px) {
         width: 100%;
      }

      &--no-label {
         top: 33px;
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

   &--disabled .dropdown-2__input input {
      pointer-events: none;
      background: #eeeeee;
      color: #a8a8a8;

      &::before {
         filter: grayscale(1) brightness(1.5);
      }
   }
}
</style>