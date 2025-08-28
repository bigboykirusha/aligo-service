<template>
   <div class="checkbox" @click="toggleCheckbox">
      <CheckboxUI :modelValue="isChecked" @update:modelValue="updateCheckbox" size="16" tabindex="0" @click.stop />
      <label class="checkbox__label">{{ label }}</label>
   </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';
import CheckboxUI from './CheckboxUI.vue';

const emit = defineEmits(['updateChecked']);
const props = defineProps({
   label: {
      type: String,
      required: true
   },
   checked: {
      type: [Number, Boolean],
      default: 0
   }
});

const isChecked = ref(props.checked === 1);

watch(() => props.checked, (newVal) => {
   isChecked.value = newVal === 1;
});

const updateCheckbox = (val) => {
   isChecked.value = val;
   emit('updateChecked', val ? 1 : 0);
};

const toggleCheckbox = () => {
   updateCheckbox(!isChecked.value);
};
</script>

<style scoped lang="scss">
.checkbox {
   display: flex;
   align-items: center;
   gap: 8px;

   label {
      font-size: 14px;
      color: #323232;
   }
}
</style>
