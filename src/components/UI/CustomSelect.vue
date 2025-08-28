<template>
  <div
    :class="{
      'ui-select--open': isOpen,
      'ui-select--scroll': showScroll,
      'ui-select--error': error,
      'ui-select--success': success,
      'ui-select--top': isDropdownAbove,
      'ui-select--disabled': disabled,
    }"
    class="ui-select"
    @click="toggleOpen"
  >
    {{ modelValue.value }}
    <div
      class="ui-select__label"
      ref="buttonRef"
      :class="{
        'ui-select__label--active': !isOpen && modelValue?.name,
      }"
    >
      <p v-if="!modelValue.name" class="ui-select__label-text">
        {{ placeholder }}
      </p>
      <p v-else class="ui-select__label-text">
        <CustomStatus v-if="priority" :level="modelValue?.code" />
        {{ modelValue.name }}
      </p>
      <!-- <SvgArrow class="ui-select__label-arrow" /> -->
    </div>
    <Transition name="ui-select__options">
      <ul
        v-if="isOpen"
        v-click-outside="close"
        ref="dropdownRef"
        class="ui-select__options"
      >
        <li
          v-if="!disabledDefault"
          :key="'default-empty'"
          title="не выбрано"
          class="ui-select__option"
          @click="change({ name: '', code: '' })"
        >
          не выбрано
        </li>
        <li
          v-for="option in options"
          :key="option.code"
          :title="option.name"
          :class="{
            'ui-select__option--active': option.code === modelValue.code,
            'ui-select__option--impossible': option.code === impossible?.code,
          }"
          class="ui-select__option"
          @click="change(option)"
        >
          <CustomStatus v-if="priority" :level="option.code" />
          {{ option.name }}
        </li>
      </ul>
    </Transition>
    <span v-if="text" class="ui-select__text">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, nextTick } from 'vue';

import { autoUpdate, computePosition, flip, offset } from '@floating-ui/dom';

const emit = defineEmits(['update:model-value', 'updateSort']);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ name: '', code: '' }),
  },
  impossible: {
    type: Object,
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  positioncalc: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDefault: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: '',
  },
  checkbox: {
    type: Boolean,
    default: false,
  },
  svg: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(false);
const showScroll = ref(false);
let timeout;
const isDropdownAbove = ref(null);
const dropdownRef = ref(null);
const buttonRef = ref(null);
let cleanupAutoUpdate;

const change = async (option) => {
  const OldValue = props.modelValue;

  if (option.code !== props.modelValue.code) {
    emit('update:model-value', option);
  }

  emit('updateSort', option.code, OldValue.code);

  // }
};

const toggleOpen = async () => {
  isOpen.value ? close() : open();
  await nextTick();

  if (buttonRef.value && dropdownRef.value && props.positioncalc) {
    cleanupAutoUpdate = autoUpdate(
      buttonRef.value,
      dropdownRef.value,
      async () => {
        const { x, y } = await computePosition(
          buttonRef.value,
          dropdownRef.value,
          {
            placement: 'bottom-start',
            middleware: [offset(), flip()],
          }
        );
        const buttonRect = buttonRef.value.getBoundingClientRect();
        isDropdownAbove.value = y < buttonRect.top;
        dropdownRef.value.style.left = `${x}px`;
        dropdownRef.value.style.top = `${y}px`;
      }
    );
  }
};

const close = () => {
  clearTimeout(timeout);
  isOpen.value = false;
  showScroll.value = false;
  if (cleanupAutoUpdate) cleanupAutoUpdate();
};

const open = () => {
  isOpen.value = true;
  timeout = setTimeout(() => (showScroll.value = true), 300);
};
</script>
