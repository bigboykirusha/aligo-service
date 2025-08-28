<template>
  <div
    class="ui-switcher"
    :class="{
      'ui-switcher--on': modelValue,
      'ui-switcher--off': !modelValue,
      'ui-switcher--small': small,
      'ui-switcher--disabled': disabled,
    }"
  >
    <div
      class="ui-switcher__wrapper"
      role="checkbox"
      :aria-checked="modelValue"
      tabindex="0"
      @click="handleClick"
    >
      <div class="ui-switcher__background" />
      <div class="ui-switcher__indicator" :style="indicatorStyles" />
    </div>
    <span v-if="text" class="ui-switcher__text">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  small: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  text: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const indicatorStyles = computed(() => {
  const translateX = props.small ? '16px' : '12px';
  return {
    transform: props.modelValue ? `translateX(${translateX})` : `translateX(0)`,
  };
});

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
    emit('change');
  }
};
</script>
