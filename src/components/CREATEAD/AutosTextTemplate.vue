<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__block">
         <div class="simple-input__wrapper">
            <input type="text"
               :inputmode="props.validationType === 'number' || props.validationType === 'doors' ? 'numeric' : null"
               class="simple-input__field" :class="{
                  'simple-input__field--error': shouldShowError,
                  'simple-input__field--highlighted': isHighlighted
               }" :placeholder="placeholder" v-model="displayValue" :disabled="isInputDisabled" @blur="handleBlur"
               @focus="handleFocus" @keypress="restrictNonNumericInput" />
            <img v-if="optionValue && showClearIcon" :src="closeIcon" alt="Clear" class="simple-input__clear"
               @click="clearInput" />
         </div>
         <div v-if="hasInput && props.validationType && hasBlurred && !isValid && isErrorDisplayed"
            :class="{ 'simple-input__error': !isValid, 'simple-input__success': isValid }">
            {{ isValid ? 'Значение введено корректно' : errorMessage }}
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineProps } from 'vue';
import { validateUsername } from '@/services/validation';
import closeIcon from '@/assets/icons/close-gray.svg';

const props = defineProps({
   option: {
      type: [String, Number],
   },
   label: {
      type: String,
   },
   placeholder: {
      type: String,
      default: 'Введите текст',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
   validationType: {
      type: String,
   },
   isEmpty: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(['update:option']);
const optionValue = ref(props.option ? String(props.option).trim() : '');
const hasInput = ref(false);
const isHighlighted = ref(props.isEmpty);
const hasBlurred = ref(false);
const isErrorDisplayed = ref(false);

// Функция для форматирования числа с разделением на разряды
const formatNumber = (value) => {
   const numValue = value.replace(/\D/g, '');
   return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const displayValue = computed({
   get() {
      if (props.validationType === 'number') {
         return formatNumber(optionValue.value);
      }
      return optionValue.value;
   },
   set(newValue) {
      if (props.validationType === 'number') {
         optionValue.value = newValue.replace(/\s/g, '');
      } else {
         optionValue.value = newValue;
      }
   }
});

const isInputDisabled = computed(() => {
   return props.option !== null && (props.label === 'Email');
});

const showClearIcon = computed(() => {
   return !isInputDisabled.value && optionValue.value.trim() !== '';
});

const validRegions = new Set([
   '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
   '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42',
   '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63',
   '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '83', '84', '86', '87', '88',
   '89', '91', '92', '97', '98', '99', '102', '113', '116', '121', '123', '124', '125', '126', '134', '136', '138', '142',
   '150', '152', '154', '159', '161', '163', '164', '173', '174', '177', '178', '186', '190', '196', '197', '198', '199',
   '750', '716', '761', '763', '777', '790', '797', '799', '877', '897', '926', '930', '938', '977', '982', '983', '984',
   '985', '996'
]);

function isValidLicensePlate(value) {
   const regex = /^[АВЕКМНОРСТУХABEKMHOPCTYX](?!000)\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}(\d{2,3})$/u;
   const match = value.match(regex);
   if (!match) return false;

   const region = match[1];
   return validRegions.has(region);
}

const isValid = computed(() => {
   switch (props.validationType) {
      case 'number':
         return !isNaN(optionValue.value) && Number(optionValue.value) > 0;
      case 'email':
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionValue.value);
      case 'doors':
         return Number.isInteger(optionValue.value) && optionValue.value >= 2 && optionValue.value <= 12;
      case 'vin':
         return validateVIN(optionValue.value);
      case 'licensePlate':
         return isValidLicensePlate(optionValue.value);
      case 'name':
         return validateUsername(optionValue.value);
      default:
         return true;
   }
});

// Функция валидации VIN
const validateVIN = (vin, isNorthAmerican = false) => {
   const vinRegex = /^[A-HJ-NPR-Za-hj-npr-z\d]{17}$/;

   if (!vinRegex.test(vin)) return false;

   if (/^([A-HJ-NPR-Za-hj-npr-z\d])\1*$/.test(vin)) return false;

   const transliterationTable = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
      S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
   };

   const weights = [8, 7, 6, 5, 4, 3, 2, 10, 1, 9, 8, 7, 6, 5, 4, 3, 2];

   const getTransliteratedValue = (char) => {
      if (!isNaN(char)) return parseInt(char);
      return transliterationTable[char.toUpperCase()] || 0;
   };

   const validateCheckDigit = () => {
      let sum = 0;
      for (let i = 0; i < vin.length; i++) {
         const char = vin[i];
         const value = getTransliteratedValue(char);
         const weight = weights[i];
         const weightedValue = value * weight;
         sum += weightedValue;
      }

      const remainder = sum % 11;
      const calculatedCheckDigit = remainder === 10 ? 'X' : remainder.toString();
      return vin[8].toUpperCase() === calculatedCheckDigit;
   };

   if (isNorthAmerican && !validateCheckDigit()) return false;

   return true;
};

const errorMessage = computed(() => {
   if (!props.validationType) return '';
   if (isValid.value) return '';
   switch (props.validationType) {
      case 'number':
         return 'Используйте только цифры для ввода';
      case 'email':
         return 'Проверьте адрес электронной почты';
      case 'url':
         return 'Проверьте правильность ввода URL';
      case 'doors':
         return 'Введите количество дверей от 2 до 12';
      case 'vin':
         return 'Проверьте правильность ввода VIN';
      case 'licensePlate':
         return 'Государственный номер может содержать только буквы (А, В, Е, К, М, Н, О, Р, С, Т, У, Х) и цифры (0-9) в определенном порядке, например Х123ХХ123.';
      case 'name':
         return 'Имя должно содержать только буквы одного алфавита и быть длиной от 2 до 20 символов';
      default:
         return 'Некорректное значение';
   }
});

const shouldShowError = computed(() => props.validationType && !isValid.value && hasInput.value && hasBlurred.value && isErrorDisplayed.value);

const restrictNonNumericInput = (event) => {
   if (['number', 'doors'].includes(props.validationType) && !/[0-9]/.test(event.key)) {
      event.preventDefault();
   }
};

const handleBlur = () => {
   hasBlurred.value = true;
   isErrorDisplayed.value = true;
   const trimmedValue = optionValue.value.trim();
   if (hasInput.value && props.validationType) {
      if (isValid.value) {
         emit('update:option', trimmedValue);
      } else {
         emit('update:option', null);
      }
   } else {
      emit('update:option', null);
   }
};

const handleFocus = () => {
   isErrorDisplayed.value = false;
};

const clearInput = () => {
   optionValue.value = '';
   hasInput.value = false;
};

watch(() => optionValue.value, (newValue) => {
   const trimmedValue = newValue.trim();
   hasInput.value = trimmedValue !== '';
   optionValue.value = trimmedValue;
});

watch(() => props.option, (newValue) => {
   optionValue.value = newValue ? String(newValue).trim() : '';
   hasInput.value = !!optionValue.value;
});
</script>

<style scoped lang="scss">
.simple-input {
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
      height: 34px;
      padding-right: 28px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;
      transition: border 0.2s ease;

      &:focus {
         outline: none;
         border: 1px solid #3366FF;
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