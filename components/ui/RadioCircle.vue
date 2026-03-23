<template>
   <label class="ui-radio-circle" :class="{ 'ui-radio-circle--disabled': disabled }">
      <input
         class="ui-radio-circle__input"
         type="radio"
         :name="name"
         :checked="modelValue === value"
         :disabled="disabled"
         @change="handleChange"
      >
      <span class="ui-radio-circle__control" aria-hidden="true" />
      <span v-if="label" class="ui-radio-circle__label">{{ label }}</span>
      <slot v-else />
   </label>
</template>

<script setup>
const props = defineProps({
   modelValue: {
      type: [String, Number, null],
      default: null
   },
   value: {
      type: [String, Number],
      required: true
   },
   label: {
      type: String,
      default: ''
   },
   name: {
      type: String,
      default: 'ui-radio-circle'
   },
   disabled: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = () => {
   emit('update:modelValue', props.value)
   emit('change', props.value)
}
</script>

<style scoped lang="scss">
.ui-radio-circle {
   display: inline-flex;
   align-items: center;
   gap: 14px;
   cursor: pointer;
   user-select: none;

   &--disabled {
      cursor: not-allowed;
      opacity: 0.6;
   }

   &__input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
   }

   &__control {
      position: relative;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #d6d6d6;
      background: #fff;
      box-sizing: border-box;
      transition: border-color 0.2s ease, border-width 0.2s ease, box-shadow 0.2s ease;
   }

   &__input:focus-visible + &__control {
      box-shadow: 0 0 0 3px rgba(51, 102, 255, 0.16);
   }

   &__input:checked + &__control {
      border: 4px solid #3366ff;
      background: #fff;
   }

   &__label {
      color: #323232;
      font-size: 14px;
      line-height: 18px;
   }
}
</style>
