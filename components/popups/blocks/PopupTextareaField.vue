<template>
   <textarea
      class="popup-textarea"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      @input="onInput"
   />
</template>

<script setup>
defineProps({
   modelValue: {
      type: String,
      default: ''
   },
   rows: {
      type: [String, Number],
      default: 4
   },
   placeholder: {
      type: String,
      default: ''
   }
})

const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
   emit('update:modelValue', event.target.value)
}
</script>

<style scoped lang="scss">
.popup-textarea {
   width: 100%;
   min-height: 120px;
   padding: 12px 16px;
   background: var(--popup-color-surface-soft, #f8fafc);
   border: 1px solid var(--popup-color-border, #d6d6d6);
   border-radius: var(--popup-radius, 6px);
   font-size: 14px;
   line-height: 18px;
   color: var(--popup-color-text, #323232);
   resize: none;
   transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
   box-sizing: border-box;

   &::placeholder {
      color: var(--popup-color-text-muted, #787878);
   }

   &:focus {
      outline: none;
      background: var(--popup-color-surface, #fff);
      border-color: var(--popup-color-primary, #3366ff);
   }
}
</style>
