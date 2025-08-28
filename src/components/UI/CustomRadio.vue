<template>
  <label
    class="ui-radio"
    :class="{
      'ui-radio--error': error,
      'ui-radio--disabled': disabled,
      'ui-radio--small': small,
    }"
  >
    12 {{ code }}
    <input
      :name="name"
      :checked="modelValue === code"
      :value="code"
      :disabled="disabled"
      type="radio"
      class="ui-radio__input"
      @change="onChange"
    />
    <span class="ui-radio__label" v-if="labelText">{{ labelText }}</span>
    <div class="ui-radio__body" :class="{ 'ui-radio--small': small }">
      <span class="ui-radio__box" />
      <span class="ui-radio__text">
        <slot />
      </span>
    </div>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['update:model-value']);
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  code: {
    type: [String, Number],
    default: '',
  },
  small: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelText: {
    type: String,
    default: '',
  },
});

const onChange = () => emit('update:model-value', props.code);
</script>
