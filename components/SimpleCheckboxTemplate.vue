<template>
   <div
      class="checkbox"
      role="checkbox"
      :aria-checked="isChecked ? 'true' : 'false'"
      tabindex="0"
      @click="toggleCheckbox"
      @keydown.space.prevent="toggleCheckbox"
      @keydown.enter.prevent="toggleCheckbox"
   >
      <CheckboxUI
         :model-value="isChecked"
         size="16"
         tabindex="0"
         @update:model-value="updateCheckbox"
         @click.stop
      />
      <label class="checkbox__label">{{ label }}</label>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['updateChecked'])
const props = defineProps({
   label: {
      type: String,
      required: true
   },
   checked: {
      type: [Number, Boolean],
      default: 0
   }
})

const isChecked = ref(Boolean(Number(props.checked)))

watch(
   () => props.checked,
   (newVal) => {
      isChecked.value = Boolean(Number(newVal))
   }
)

const updateCheckbox = (val) => {
   isChecked.value = val
   emit('updateChecked', val ? 1 : 0)
}

const toggleCheckbox = () => {
   updateCheckbox(!isChecked.value)
}
</script>

<style scoped lang="scss">
.checkbox {
   display: flex;
   align-items: center;
   gap: 8px;
   cursor: pointer;
   user-select: none;

   label {
      font-size: 14px;
      color: #323232;
   }
}
</style>
