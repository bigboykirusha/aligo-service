<template>
  <div
    class="ui-input"
    :class="{
      'ui-input--error': error,
      'ui-input--number': isNumber,
      'ui-input--status': status,
      'ui-input--success': success,
      'ui-input--empty': !modelValue && !isFocus,
      'ui-input--label-on-top': (label && modelValue) || (label && placeholder),
      'ui-input--disabled': disabled,
    }"
  >
    <label class="ui-input__box">
      <!--  v-mask="mask" -->
      <input
        v-if="mask"
        v-mask="mask"
        :name="name"
        :placeholder="placeholder"
        :type="type"
        :readonly="readonly"
        :value="modelValue"
        :disabled="disabled"
        :maxlength="maxLenght"
        class="ui-input__field"
        @focus="onFocus"
        @blur="outFocus"
        @input="onInput($event.target.value)"
      />
      <input
        v-else
        autocomplete="off"
        :name="name"
        :readonly="readonly"
        :placeholder="placeholder"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :maxlength="maxLenght"
        class="ui-input__field"
        @focus="onFocus"
        @blur="outFocus"
        @input="onInput($event.target.value)"
      />
      <span v-if="label" class="ui-input__label">
        {{ label }}
      </span>
      <!-- <div
          v-if="modelValue && !disabled"
          class="ui-input__icon"
          @click="clickIcon"
        >
          <IconInputClear />
        </div> -->
    </label>
    <div v-if="text" class="ui-input__text">
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
// import { mask } from 'vue-the-mask';

// import IconInputClear from '@/assets/svg/InputClear';
// import VarningInputSvg from '@/assets/svg/VarningInputSvg';
// import SuccessInputSvg from '@/assets/svg/SuccessInputSvg';
// directives: { mask
const emit = defineEmits([
  'onFocus',
  'OutFocus',
  'update:model-value',
  'updata-input',
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
  readonly: {
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
  mask: {
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
  emit('updata-input', value);
  emit('update:model-value', value);
};
// const clickIcon = () => emit('clickIcon');

onMounted(() => {
  if (props.phoneInput) maxLenght.value = 18;
});

onBeforeUnmount(() => {
  maxLenght.value = false;
});
</script>
