<template>
   <label class="popup-checkbox-row">
      <CheckboxUI
         :model-value="modelValue"
         size="16"
         @update:model-value="emit('update:modelValue', $event)"
      />
      <span class="popup-checkbox-row__label">
         <slot>{{ label }}</slot>
      </span>
   </label>
</template>

<script setup>
import CheckboxUI from '~/components/CheckboxUI.vue'

defineProps({
   modelValue: {
      type: Boolean,
      default: false
   },
   label: {
      type: String,
      default: ''
   }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.popup-checkbox-row {
   display: flex;
   align-items: center;
   gap: 12px;
   cursor: pointer;
   min-width: 0;

   &__label {
      font-size: 14px;
      line-height: 18px;
      color: var(--popup-color-text, #323232);
      min-width: 0;
   }
}
</style>
