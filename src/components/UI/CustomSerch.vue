<template>
  <div
    class="ui-input-serch"
    :class="{
      'ui-input-serch--error': error,
      'ui-input-serch--number': isNumber,
      'ui-input-serch--status': status,
      'ui-input-serch--success': success,
      'ui-input-serch--empty': !modelValue && !isFocus,
      'ui-input-serch--label-on-top':
        (label && modelValue) || (label && placeholder),
      'ui-input-serch--disabled': disabled,
    }"
  >
    <label class="ui-input-serch__box">
      <div
        class="ui-input-serch__icon"
        @click="clickIcon('serch')"
        :class="{ 'ui-input-serch__icon--active': modelValue && !disabled }"
      >
        <SerchSvg />
      </div>
      <input
        autocomplete="off"
        :name="name"
        :placeholder="placeholder"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :maxlength="maxLenght"
        class="ui-input-serch__field"
        @focus="onFocus"
        @blur="outFocus"
        @input="onInput($event.target.value)"
      />
      <span v-if="label" class="ui-input-serch__label">
        {{ label }}
      </span>
      <div
        v-if="modelValue && !disabled"
        class="ui-input-serch__icon-clear"
        @click="clickIcon('cler')"
      >
        <IconInputClear />
      </div>
    </label>
    <div v-if="text" class="ui-input-serch__text">
      <span>
        {{ text }}
      </span>
    </div>
  </div>
</template>
<script setup>
import {
  nextTick,
  ref,
  onMounted,
  onBeforeUnmount,
  defineEmits,
  defineProps,
} from 'vue';

import SerchSvg from '@/assets/icons/search-svg';
import IconInputClear from '@/assets/icons/input-clear';

const emit = defineEmits([
  'onFocus',
  'OutFocus',
  'update:model-value',
  'clickIcon',
]);
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },

  isNumber: {
    type: Boolean,
    default: false,
  },
});

const maxLenght = ref(false);
const isFocus = ref(false);
const onFocus = () => {
  isFocus.value = true;
  emit('onFocus');
};
const outFocus = () => {
  isFocus.value = false;
  emit('OutFocus');
};
const onInput = async (value) => {
  if (props.isNumber) {
    value = value.replace(/[^\d]/g, '');
    emit('update:model-value', value + ' ');
    await nextTick();
  }

  emit('update:model-value', value);
};
const clickIcon = (event) => emit('clickIcon', event);

onMounted(() => {
  if (props.phoneInput) maxLenght.value = 18;
});

onBeforeUnmount(() => {
  maxLenght.value = false;
});
</script>
