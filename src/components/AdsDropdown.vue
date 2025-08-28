<template>
  <div class="dropdown-2" :class="{
    'dropdown-2--active': isActive,
    'dropdown-2--up': dropDirection === 'up',
  }" ref="dropdown">
    <div class="dropdown-2__input" @click="toggleDropdown">
      <div class="input-text-2 input-text-2--with-clear input-wrapper --check-fill">
        <input class="input-text-2__input" type="text" v-model="selectedOptionLabel" :class="{
          'placeholder-text': !selectedOption,
          'input-focused': isInputFocused,
        }" readonly @focus="handleFocus" @blur="handleBlur" />
      </div>
    </div>

    <ul class="dropdown-2__list" :class="{ 'input-focused': isInputFocused }">
      <li v-for="option in options" :key="option.value" class="dropdown-2__list-item" :class="{
        'dropdown-2__list-item--active': option.label === selectedOptionLabel,
      }" @click="selectOption(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineEmits,
  defineProps,
  nextTick,
} from 'vue';

const emit = defineEmits(['updateSort']);

const props = defineProps({
  options: {
    type: Array,
    default: () => [
      { label: 'Сначала свежие', value: 'desc' },
      { label: 'Сначала старые', value: 'asc' },
    ],
  },
  placeholder: {
    type: String,
    default: '',
  },
  defaultValue: {
    type: [String, Number],
    default: null,
  },
});

const selectedOption = ref(null);
const selectedOptionLabel = ref(props.placeholder || props.options[0].label);
const isActive = ref(false);
const dropdown = ref(null);
const isInputFocused = ref(false);
const dropDirection = ref('down');

const handleFocus = () => {
  isInputFocused.value = true;
};

const handleBlur = () => {
  isInputFocused.value = false;
};

const toggleDropdown = async () => {
  isActive.value = !isActive.value;

  if (isActive.value) {
    await nextTick();
    const rect = dropdown.value.getBoundingClientRect();
    const listHeight = 120;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    dropDirection.value =
      spaceBelow < listHeight && spaceAbove > listHeight ? 'up' : 'down';
  }
};

const selectOption = (option) => {
  selectedOption.value = option.value;
  selectedOptionLabel.value = option.label;
  isActive.value = false;
  emit('updateSort', option.value);
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isActive.value = false;
  }
};

onMounted(() => {
  if (props.defaultValue !== null) {
    const defaultOption = props.options.find(
      (option) => option.value === props.defaultValue
    );
    if (defaultOption) {
      selectedOption.value = defaultOption.value;
      selectedOptionLabel.value = defaultOption.label;
    }
  }
  document.addEventListener('click', handleClickOutside);
});

watch(
  () => props.defaultValue,
  (newValue) => {
    const defaultOption = props.options.find(
      (option) => option.value === newValue
    );
    if (defaultOption) {
      selectedOption.value = defaultOption.value;
      selectedOptionLabel.value = defaultOption.label;
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.dropdown-2 {
  position: relative;
  max-width: 320px;
  height: 34px;
  width: 100%;

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }

  &__input {
    position: relative;
    height: 34px;

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
      transform: translateY(-50%);
    }

    input {
      cursor: pointer;
      font-size: 14px;
      height: 34px;
      width: 100%;
      padding: 12px;
      border: 1px solid var(--color-stroke);
      border-radius: 6px;
      background: var(--white);

      @media (max-width: 480px) {
        width: 100%;
      }

      &.input-focused {
        outline: none;
        border: 1px solid var(--primary);
      }
    }

    .placeholder-text {
      color: var(--text-main);
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    overflow: hidden;
    transform-origin: top;
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
    background: var(--white);
    border-radius: 0 0 6px 6px;
    z-index: 9;
  }

  &__list-item {
    display: block;
    padding: 12px;
    font-size: 14px;
    line-height: 18px;
    border-radius: 6px;
    color: var(--color-text-select);
    background-color: var(--white);
    cursor: pointer;
    transition: background-color 0.1s ease, color 0.1s ease;

    &:hover {
      background-color: #eef9ff;
      color: var(--text-main);
    }

    &--active {
      color: var(--text-main);
      background: #eef9ff;
    }
  }

  &--active {
    .dropdown-2__list {
      transform: scaleY(1);
      opacity: 1;
      pointer-events: auto;
      border: 1px solid var(--primary);
      border-top: none;
    }

    .dropdown-2__input::before {
      transform: translateY(-50%) rotate(180deg);
    }

    .dropdown-2__input input {
      border-radius: 6px 6px 0 0;
    }

    &.dropdown-2--up {
      .dropdown-2__list {
        top: auto;
        bottom: 100%;
        border-top: 1px solid var(--primary);
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        transform-origin: bottom;
      }

      .dropdown-2__input input {
        border-radius: 0 0 6px 6px;
      }
    }
  }

  &--disabled .dropdown-2__input .input-text-2 input {
    pointer-events: none;
    background: var(--color-block);
    color: var(--color-explain);

    &::before {
      filter: grayscale(1) brightness(1.5);
    }
  }
}
</style>
