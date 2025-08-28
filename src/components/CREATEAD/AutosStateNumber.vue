<template>
   <div class="number-input">
      <label v-if="label" class="number-input__label">{{ label }}</label>
      <div class="number-input__block">
         <div class="number-input__wrapper">
            <input type="text" v-mask="{ mask: 'Y ### YY | ###', tokens: customTokens }" class="number-input__field"
               :class="{
                  'number-input__field--error': shouldShowError,
                  'number-input__field--success': shouldShowSuccess
               }" :placeholder="placeholder" v-model="optionValue" :disabled="disabled" @input="handleInput"
               @blur="handleBlur" @focus="handleFocus" />
            <img v-if="hasInput" :src="closeIcon" alt="Clear" class="number-input__clear" @click="clearInput" />
         </div>
         <div v-if="hasInput && hasBlurred && isErrorDisplayed"
            :class="{ 'number-input__error': !isValid, 'number-input__success': isValid }">
            {{ isValid ? 'Госномер введён корректно' : errorMessage }}
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import vueTheMask from 'vue-the-mask';

const { mask: vMask } = vueTheMask;
import closeIcon from '@/assets/icons/close-gray.svg';

const props = defineProps({
   option: {
      type: String,
      default: '',
   },
   label: {
      type: String,
   },
   placeholder: {
      type: String,
      default: 'Введите госномер',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:option']);
const optionValue = ref(props.option ? props.option.trim() : '');
const hasInput = ref(false);
const hasBlurred = ref(false);
const isErrorDisplayed = ref(false);

const cleanValue = (value) => {
   return value.replace(/[ |]/g, '').trim();
};

const customTokens = {
   'Y': {
      pattern: /[АВЕКМНОРСТУХABEKMHOPCTYX]/i,
      transform: v => v.toLocaleUpperCase()
   },
   '#': { pattern: /\d/ },
};

// Регулярное выражение для валидации
const numberRegex = /^[АВЕКМНОРСТУХABEKMHOPCTYX]{1}\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/;

// Валидация на основе очищенного значения
const isValid = computed(() => numberRegex.test(cleanValue(optionValue.value)));

const errorMessage = computed(() => 'Госномер должен соответствовать формату: А 123 ВС 45');

const shouldShowError = computed(() => !isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);
const shouldShowSuccess = computed(() => isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);

const handleInput = (event) => {
   const rawValue = event.target.value;
   optionValue.value = rawValue;
   hasInput.value = rawValue.trim() !== '';
};

const clearInput = () => {
   optionValue.value = '';
   hasInput.value = false;
   emit('update:option', null);
};

const handleBlur = () => {
   hasBlurred.value = true;
   isErrorDisplayed.value = true;
   const cleanedValue = cleanValue(optionValue.value);
   if (isValid.value) {
      emit('update:option', cleanedValue);
   } else {
      emit('update:option', null);
   }
};

const handleFocus = () => {
   isErrorDisplayed.value = false;
};
</script>

<style scoped lang="scss">
.number-input {
   display: flex;
   align-items: flex-start;
   width: 100%;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__wrapper {
      position: relative;
      width: 100%;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__block {
      width: 100%;
      max-width: 310px;

      @media (max-width: 768px) {
         max-width: 100%;
      }
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      padding-right: 28px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      &:focus {
         outline: none;
      }

      &:disabled {
         background-color: #f0f0f0;
         color: #a8a8a8;
      }

      &--error {
         border-color: #FF5959;
         color: #FF5959;
      }

      &--success {
         border-color: #3BBC71;
         color: #3BBC71;
      }

      &--highlighted {
         box-shadow: 0px 0px 16px 1px #D1F5FF;
      }
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

   &__error {
      color: #FF5959;
      font-size: 12px;
      margin-top: 4px;
   }

   &__success {
      color: #3BBC71;
      font-size: 12px;
      margin-top: 4px;
   }
}
</style>
