<template>
  <div
    class="dropdown-2"
    :class="{
      'dropdown-2--active': isActive,
      'dropdown-2--disabled': disabled,
      'dropdown-2--error': error,
    }"
  >
    <div
      class="dropdown-2__input"
      :class="{ 'dropdown-2__input--disabled': disabled }"
    >
      <div
        class="input-text-2 input-text-2--with-clear input-wrapper --check-fill"
      >
        <input
          class="input-text-2__input"
          type="text"
          v-model="searchQuery"
          placeholder="Выберите"
          :disabled="disabled"
          @input="filterOptions"
          @focus="activateDropdown"
        />
      </div>
      <ul class="dropdown-2__list">
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          class="dropdown-2__list-item"
          :class="{
            'dropdown-2__list-item--selected': modelValue === option.id,
            'dropdown-2__list-item--disabled': option.disabled,
          }"
          @click="!option.disabled && selectOption(option)"
        >
          {{ option.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  watch,
} from 'vue';

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },

  options: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'updateSort']);

const isActive = ref(false);
const searchQuery = ref('');
const hasUserTyped = ref(false);

const selectedOptionTitle = computed(() => {
  const selected = props.options.find((opt) => opt.id === props.modelValue);
  if (selected === undefined) {
    console.log('No option found with id:', props.modelValue);
  } else {
    console.log('Selected option:', selected);
  }
  return selected?.title || '';
});

const activateDropdown = () => {
  if (!props.disabled) {
    isActive.value = true;
    hasUserTyped.value = false;
  }
};

const filterOptions = () => {
  hasUserTyped.value = true;
};

const filteredOptions = computed(() => {
  if (!hasUserTyped.value) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => opt.title.toLowerCase().startsWith(q));
});

const selectOption = (option) => {
  if (props.disabled || option.disabled) return;
  isActive.value = false;
  console.log('Updating modelValue to:', option.id);
  emit('update:modelValue', option.id);
  emit('updateSort', option.id);
  searchQuery.value = option.title;
};

const handleClickOutside = (event) => {
  if (props.disabled) return;

  const dropdownEl = event.target.closest('.dropdown-2');
  if (!dropdownEl) {
    const matched = props.options.find(
      (opt) => opt.title === searchQuery.value
    );
    if (!matched) {
      searchQuery.value = selectedOptionTitle.value;
    }
    isActive.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  searchQuery.value = selectedOptionTitle.value;
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(
  () => props.modelValue,
  () => {
    searchQuery.value = selectedOptionTitle.value;
  }
);
watch(
  () => props.options,
  (newOptions) => {
    console.log('Options changed:', newOptions);
  },
  { deep: true }
);
</script>

<style lang="scss">
.dropdown-2 {
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  row-gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &__input {
    position: relative;
    width: 100%;
    height: 34px;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 100%;
    }

    &:focus {
      outline: none;
      border-color: var(--primary);
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
      background: url('@/assets/images/svg/arrow.svg') center center / contain
        no-repeat;
      transform: translate(0, -50%);
      transition: transform 0.2s ease;
    }

    input {
      width: 100%;
      font-size: 14px;
      position: relative;
      height: 34px;
      padding: 12px;
      border: 1px solid var(--color-stroke);
      border-radius: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background-color: var(--white);
      transition: border-color 0.3s ease;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: var(--primary);
      }

      &:disabled {
        background-color: var(--color-block);
        border-color: var(--color-block);
        pointer-events: none;
      }
    }
  }

  &__list {
    position: absolute;
    border: 1px solid var(--primary);
    border-top: 1px solid var(--color-stroke);
    right: 0;
    z-index: 8;
    display: flex;
    flex-direction: column;
    list-style: none;
    width: 100%;
    max-height: 310px;
    background: var(--white);
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
    color: var(--color-text-select);
    background: var(--white);
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #d6efff;
      color: var(--primary);
    }

    &--selected {
      background-color: #d6efff;
      color: var(--primary);
    }

    &--disabled {
      color: #b0b0b0;
      background-color: #f5f5f5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  &--active {
    .dropdown-2__input::before {
      transform: translate(0, -50%) rotate(-180deg);
    }

    .dropdown-2__list {
      border-radius: 0 0 6px 6px;
      transform: scaleY(1);
      opacity: 1;
    }

    .dropdown-2__input input {
      border-radius: 6px 6px 0 0;
      border: 1px solid var(--primary);
    }
  }
  &--error {
    border: 1px solid #ff5959;
  }
  &--disabled {
    .dropdown-2__input {
      background-color: var(--color-block);
      border-radius: 4px;
      border-color: var(--color-block);
      cursor: not-allowed;

      &::before {
        background: url('@/assets/icons/arrow-gray.svg') center top / contain
          no-repeat;
        transform: rotate(0);
      }

      input {
        background-color: var(--color-block);
        border-color: var(--color-block);
      }
    }

    .dropdown-2__list-item {
      color: var(--color-text-select);
      cursor: not-allowed;
    }
  }
}

.input-wrapper {
  width: 100%;
}
</style>
