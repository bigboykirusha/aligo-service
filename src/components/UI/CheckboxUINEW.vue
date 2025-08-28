<template>
  <label
    class="custom-checkbox"
    :class="{
      'custom-checkbox--checked': modelValue,
      'custom-checkbox--disabled': disabled,
    }"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
      class="custom-checkbox__input"
    />
    <div :class="['custom-checkbox__box', boxSizeClass]">
      <div v-if="modelValue" class="custom-checkbox__checkmark">
        <svg
          width="17"
          height="12"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 6L6 11L16 1"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <span v-if="showLabel" class="custom-checkbox__label">{{ label }}</span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const boxSizeClass = computed(() => {
  return props.size === '14'
    ? 'custom-checkbox__box--small'
    : 'custom-checkbox__box--default';
});

const onChange = () => emit('update:modelValue', !props.modelValue);
</script>

<style scoped lang="scss">
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 16px;
  outline: none;

  &:focus {
    outline: 2px solid var(--primary);
    border-radius: 4px;
  }
  &__input {
    display: none;
  }
  &__box {
    width: 16px;
    height: 16px;
    border: 1px solid var(--color-stroke);
    background-color: var(--white);
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
      background-color: var(--primary);
      border-color: var(--primary);
    }

    &:focus {
      outline: 2px solid #d6efff;
      border-radius: 4px;
    }
  }

  &__box--small {
    width: 14px;
    height: 14px;
  }

  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;

    .custom-checkbox__box {
      background-color: var(--color-explain);
      border-color: var(--color-explain);
    }
  }
}
</style>
