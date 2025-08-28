<template>
  <div
    class="dropdown"
    :class="{
      'dropdown--active': isActive,
      'dropdown--disabled': disabled,
      'dropdown--error': error,
    }"
  >
    <div
      class="dropdown__input"
      :class="{ 'dropdown__input--disabled': disabled }"
    >
      <div class="input-text input-text--with-clear input-wrapper--check-fill">
        <input
          class="input-text__input"
          type="text"
          v-model="searchQuery"
          placeholder="Нажмите для выбора"
          :disabled="disabled"
          @input="onInput"
          @focus="activateDropdown"
        />
      </div>
      <ul class="dropdown__list">
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          class="dropdown__list-item"
          :class="{
            'dropdown__list-item--selected': modelValue?.code === option.id,
          }"
          @click="selectOption(option)"
        >
          {{ option.title }}
        </li>
      </ul>
    </div>
    <span class="dropdown__text-desc">{{ text }}</span>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';

import { debounce } from 'lodash';

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
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
    type: Object,
    default: () => ({ code: null, title: '' }),
  },
});

const emit = defineEmits(['update:modelValue', 'updateSort', 'input-change']);

const isActive = ref(false);
const searchQuery = ref('');
const hasUserTyped = ref(false);

const activateDropdown = () => {
  if (!props.disabled) {
    isActive.value = true;
    hasUserTyped.value = false;
  }
};

const debouncedEmit = debounce(() => {
  emit('input-change', searchQuery.value);
}, 400);

const onInput = () => {
  hasUserTyped.value = true;
  debouncedEmit();
};

const filteredOptions = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return hasUserTyped.value
    ? props.options.filter((opt) => opt.title.toLowerCase().includes(q))
    : props.options;
});

const selectOption = (option) => {
  const selected = {
    title: option.title,
    code: option.id,
  };

  if (option.prepositional_case) {
    selected.dec = option.prepositional_case;
  }

  if (option.translit) {
    selected.translit = option.translit;
  }

  emit('update:modelValue', selected);
  emit('updateSort', selected);

  searchQuery.value = option.title;
  isActive.value = false;
  hasUserTyped.value = false;
};

const handleClickOutside = (event) => {
  if (props.disabled) return;

  const dropdownEl = event.target.closest('.dropdown');
  if (!dropdownEl) {
    if (Array.isArray(props.options)) {
      const matched = props.options.find(
        (opt) => opt.title === searchQuery.value
      );
      if (!matched) {
        searchQuery.value = props.modelValue?.title || '';
      }
    } else {
      searchQuery.value = props.modelValue?.title || '';
    }
    isActive.value = false;
  }
};
watch(
  () => props.modelValue,
  (newVal) => {
    if (!hasUserTyped.value) {
      searchQuery.value = newVal?.title || '';
    }
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  searchQuery.value = props.modelValue?.title || '';
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss">
.dropdown {
  // display: flex;
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
    .dropdown__input::before {
      transform: translate(0, -50%) rotate(-180deg);
    }

    .dropdown__list {
      border-radius: 0 0 6px 6px;
      transform: scaleY(1);
      opacity: 1;
    }

    .dropdown__input input {
      border-radius: 6px 6px 0 0;
      border: 1px solid var(--primary);
    }
  }

  &--disabled {
    .dropdown__input {
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

    .dropdown__list-item {
      color: var(--color-text-select);
      cursor: not-allowed;
    }
  }
  &--error {
    .dropdown {
      &__input {
        color: #ff5959;
        border-radius: 6px;
        input {
          border: 1px solid #ff5959;
        }
        .dropdown--active {
          input {
            border: 1px solid #ff5959;
          }

          .dropdown__input input {
            border-radius: 6px 6px 0 0;
            border: 1px solid #ff5959;
          }
        }
      }
      &__text-desc {
        font-size: 14px;
        color: #ff5959;
      }
      &__list {
        border: 1px solid #ff5959;
      }
    }
  }
}

.input-wrapper {
  width: 100%;
}
</style>
