<template>
  <div
    :class="{
      'ui-btn-select--open': isOpen,
      'ui-btn-select--scroll': showScroll,
      'ui-btn-select--error': error,
    }"
    class="ui-btn-select"
    @click="toggleOpen"
    ref="buttonRef"
  >
    <ButtonUI svg="setting-svg" :buttonClass="btnClass" />
    <Transition name="ui-option-select__options">
      <ul
        v-if="isOpen"
        v-click-outside="close"
        class="ui-option-select__options"
        ref="dropdownRef"
      >
        <li
          v-for="option in options"
          :key="option.code"
          :title="option.name"
          class="ui-option-select__option"
          @click="change(option)"
        >
          <component :is="getIconComponent(option.svg)" v-if="option.svg" />
          {{ option.name }}
        </li>
      </ul>
    </Transition>
    <span v-if="text" class="ui-btn-select__text">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import {
  ref,
  nextTick,
  onUnmounted,
  defineEmits,
  defineProps,
  defineAsyncComponent,
} from 'vue';
import { eventBus } from '@/eventBus/selectEvent.js';
import { autoUpdate, computePosition, flip, offset } from '@floating-ui/dom';
import ButtonUI from '@/components/UI/ButtonUI';

const emit = defineEmits(['update:model-value']);

defineProps({
  modelValue: {
    type: Object,
    default: () => ({ name: '', code: '' }),
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabledDefault: {
    type: Boolean,
    default: true,
  },
  btnClass: {
    type: String,
    default: 'btn--third',
    validator: function (value) {
      return ['btn--primary', 'btn--second', 'btn--third'].includes(value);
    },
  },
  text: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  CurrentId: {
    type: Number,
    default: 0,
  },
  selectId: {
    type: Number,
    default: 0,
  },
});

const showScroll = ref(false);
const isOpen = ref(false);
const dropdownRef = ref(null);
const buttonRef = ref(null);

let cleanupAutoUpdate;
let timeout;

const change = (option) => {
  emit('update:model-value', option);
};

const getIconComponent = (svg) => {
  return defineAsyncComponent(() => import(`@/assets/icons/${svg}.vue`));
};

const close = () => {
  clearTimeout(timeout);
  isOpen.value = false;
  showScroll.value = false;
  if (cleanupAutoUpdate) cleanupAutoUpdate();
};

const open = () => {
  eventBus.value.emit('close-dropdowns');
  isOpen.value = true;
  timeout = setTimeout(() => (showScroll.value = true), 300);
};

const toggleOpen = async () => {
  isOpen.value ? close() : open();
  await nextTick();

  if (buttonRef.value && dropdownRef.value) {
    cleanupAutoUpdate = autoUpdate(
      buttonRef.value,
      dropdownRef.value,
      async () => {
        const { x, y } = await computePosition(
          buttonRef.value,
          dropdownRef.value,
          {
            placement: 'bottom-start',
            strategy: 'fixed',
            middleware: [offset({ mainAxis: -30 }), flip()],
          }
        );

        dropdownRef.value.style.left = `${x}px`;
        dropdownRef.value.style.top = `${y}px`;
      }
    );
  }
};

eventBus.value.on('close-dropdowns', close);

onUnmounted(() => {
  if (cleanupAutoUpdate) cleanupAutoUpdate();
});
</script>
