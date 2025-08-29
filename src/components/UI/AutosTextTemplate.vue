<template>
  <div class="simple-input" :class="{ 'simple-input--special': props.isSpecial }">
    <label v-if="label" class="simple-input__label">{{ label }}</label>
    <div class="simple-input__wrapper">
      <input type="text" :inputmode="props.validationType === 'number' || props.validationType === 'doors'
          ? 'numeric'
          : null
        " class="simple-input__field" :class="{
          'simple-input__field--error': shouldShowError,
          'simple-input__field--success': shouldShowSuccess,
          'simple-input__field--highlighted': isHighlighted,
        }" :placeholder="placeholder" v-model="displayValue" :disabled="isInputDisabled" @blur="handleBlur"
        @focus="handleFocus" @keypress="restrictNonNumericInput" />
      <!-- <img
          v-if="optionValue && showClearIcon"
          src="../assets/icons/close-gray.svg"
          alt="Clear"
          class="simple-input__clear"
          @click="clearInput"
        /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

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
  isSpecial: {
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

    emit('update:option', optionValue.value);
  },
});

const isInputDisabled = computed(() => {
  return props.option !== null && props.label === 'Email';
});

// const showClearIcon = computed(() => {
//   return !isInputDisabled.value && optionValue.value.trim() !== '';
// });
const isValid = computed(() => {
  switch (props.validationType) {
    case 'number':
      return !isNaN(optionValue.value) && Number(optionValue.value) > 0;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(optionValue.value);
    case 'url':
      return /^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)(\/[\w\d\-._~:/?#[@!$&'()*+,;=]*)?$/.test(
        optionValue.value
      );
    case 'autoId': {
      const value = optionValue.value.toUpperCase();

      // VIN всегда ровно 17 символов
      if (value.length === 17) {
        return validateVIN(value);
      }

      // Госномер — от 8 до 9 символов (например: А123ВС77 или А123ВС777)
      const licensePlateRegex = /^[АВЕКМНОРСТУХABEKMHOPCTYX]\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/;
      return licensePlateRegex.test(value);
    }
    case 'doors': {
      const numberValue = Number(optionValue.value);
      return (
        Number.isInteger(numberValue) && numberValue >= 2 && numberValue <= 12
      );
    }
    case 'vin':
      return validateVIN(optionValue.value);
    case 'licensePlate':
      return /^[АВЕКМНОРСТУХABEKMHOPCTYX]{1}\d{3}[АВЕКМНОРСТУХABEKMHOPCTYX]{2}\d{2,3}$/.test(
        optionValue.value
      );
    // case 'name':
    //   return validateUsername(optionValue.value);
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
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
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

const shouldShowError = computed(
  () =>
    props.validationType &&
    !isValid.value &&
    hasInput.value &&
    hasBlurred.value &&
    isErrorDisplayed.value
);
const shouldShowSuccess = computed(
  () =>
    props.validationType &&
    isValid.value &&
    hasInput.value &&
    hasBlurred.value &&
    isErrorDisplayed.value
);

const restrictNonNumericInput = (event) => {
  if (
    ['number', 'doors'].includes(props.validationType) &&
    !/[0-9]/.test(event.key)
  ) {
    event.preventDefault();
  }
};

const handleBlur = () => {
  hasBlurred.value = true;
  isErrorDisplayed.value = true;
  const trimmedValue = optionValue.value.trim();

  if (!props.validationType) {
    emit('update:option', trimmedValue);
    return;
  }

  if (hasInput.value) {
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

watch(
  () => optionValue.value,
  (newValue) => {
    const trimmedValue = newValue.trim();
    hasInput.value = trimmedValue !== '';
    optionValue.value = trimmedValue;
  }
);

watch(
  () => props.option,
  (newValue) => {
    optionValue.value = newValue ? String(newValue).trim() : '';
    hasInput.value = !!optionValue.value;
  }
);
</script>

<style lang="scss">
.simple-input {
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    align-items: flex-start;
  }

  &--special {
    background-color: #eef9ff;
    border-radius: 6px;
    padding: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    color: var(--text-main);
    min-width: 147px;
  }

  &__wrapper {
    position: relative;
    width: 100%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__field {
    font-size: 14px;
    padding: 8px 12px;
    padding-right: 28px;
    border: 1px solid var(--color-stroke);
    border-radius: 6px;
    width: 100%;
    max-width: 460px;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }

    &:disabled {
      background-color: #f0f0f0;
      color: var(--color-explain);
    }

    &--error {
      //  border-color: #ff5959;
      //  color: #ff5959;
    }

    &--success {
      //  border-color: #3bbc71;
      //  color: #3bbc71;
    }

    &--highlighted {
      box-shadow: 0px 0px 16px 1px #d1f5ff;
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
    color: #ff5959;
    font-size: 12px;
    margin-top: 4px;
  }

  &__success {
    color: #3bbc71;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
