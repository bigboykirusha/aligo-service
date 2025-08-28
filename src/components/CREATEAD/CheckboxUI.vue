<template>
   <div class="custom-checkbox" @click="toggleCheckbox" @keydown.enter="toggleCheckbox"
      :class="{ 'custom-checkbox--checked': checked }">
      <div :class="['custom-checkbox__box', boxSizeClass]">
         <div v-if="checked" class="custom-checkbox__checkmark">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1 6L6 11L16 1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
            </svg>
         </div>
      </div>
      <span v-if="showLabel" class="custom-checkbox__label">{{ label }}</span>
   </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
   modelValue: {
      type: Boolean,
      default: false,
   },
   label: {
      type: String,
      default: '',
   },
   showLabel: {
      type: Boolean,
      default: false,
   },
   size: {
      type: String,
      default: '16',
   },
});

const emit = defineEmits(['update:modelValue']);
const checked = ref(props.modelValue);

const boxSizeClass = computed(() => {
   return props.size === '14' ? 'custom-checkbox__box--small' : 'custom-checkbox__box--default';
});

const toggleCheckbox = () => {
   checked.value = !checked.value;
   emit('update:modelValue', checked.value);
};

watch(
   () => props.modelValue,
   (newVal) => {
      checked.value = newVal;
   }
);
</script>

<style scoped lang="scss">
.custom-checkbox {
   display: flex;
   align-items: center;
   cursor: pointer;
   gap: 16px;
   outline: none;

   &:focus {
      outline: 2px solid #3366FF;
      border-radius: 4px;
   }

   &__box {
      width: 16px;
      height: 16px;
      border: 1px solid #D6D6D6;
      background-color: #FFFFFF;
      border-radius: 4px;
      position: relative;
      transition: background-color 0.2s ease, border 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
   }

   &__checkmark {
      display: flex;
      width: 10px;
      height: 8px;
      justify-content: center;
      align-items: center;
   }

   &__label {
      font-size: 14px;
      color: #333;
   }

   &--checked {
      .custom-checkbox__box {
         background-color: #3366FF;
         border-color: #3366FF;
      }

      &:focus {
         outline: 2px solid #D6EFFF;
         border-radius: 4px;
      }
   }

   &__box--small {
      width: 14px;
      height: 14px;
   }
}
</style>
