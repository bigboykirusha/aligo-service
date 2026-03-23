<template>
   <label class="toggle-wrapper">
      <input
         type="checkbox"
         class="toggle-input"
         :checked="modelValue"
         @change="$emit('update:modelValue', $event.target.checked)"
      >
      <span class="toggle-switch" />
   </label>
</template>

<script setup>
defineProps({
   modelValue: Boolean
})
defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.toggle-wrapper {
   display: inline-flex;
   align-items: center;
   cursor: pointer;
}

.toggle-input {
   display: none;
}

.toggle-switch {
   position: relative;
   width: 32px;
   height: 16px;
   background-color: #ccc;
   border-radius: 999px;
   transition: background-color 0.2s ease;

   &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      background-color: #fff;
      border-radius: 50%;
      transition: transform 0.2s ease;
   }
}

.toggle-input:checked + .toggle-switch {
   background-color: #3366ff;
}

.toggle-input:checked + .toggle-switch::before {
   transform: translateX(16px);
}
</style>
