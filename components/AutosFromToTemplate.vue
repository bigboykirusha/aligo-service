<template>
   <div class="range-input">
      <div class="range-input__label">{{ label }}</div>
      <div class="range-input__fields">
         <input
            v-model="minValue"
            type="number"
            placeholder="от"
            class="range-input__field"
            :disabled="props.dis"
            min="0"
            @input="handleMinInput"
         >
         <input
            v-model="maxValue"
            type="number"
            placeholder="до"
            class="range-input__field"
            :disabled="props.dis"
            min="0"
            @input="handleMaxInput"
         >
         <span v-if="label === 'Цена'" class="range-input__currency">₽</span>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
   label: { type: String, default: '' },
   initialMinValue: { type: Number, default: null },
   initialMaxValue: { type: Number, default: null },
   dis: { type: Boolean, default: false }
})

const emit = defineEmits(['updateRange'])

const minValue = ref(props.initialMinValue)
const maxValue = ref(props.initialMaxValue)

const handleMinInput = (event) => {
   const value = parseFloat(event.target.value)
   if (isNaN(value) || value < 0) {
      minValue.value = null
   } else {
      minValue.value = value
      if (maxValue.value !== null && maxValue.value < value) {
         maxValue.value = value
      }
   }
}

const handleMaxInput = (event) => {
   const value = parseFloat(event.target.value)
   if (isNaN(value) || value < 0) {
      maxValue.value = null
   } else {
      maxValue.value = Math.max(value, minValue.value ?? 0)
   }
}

watch([minValue, maxValue], ([newMin, newMax]) => {
   emit('updateRange', { min: newMin, max: newMax })
})

watch(
   () => props.initialMinValue,
   (newVal) => {
      minValue.value = newVal
   }
)
watch(
   () => props.initialMaxValue,
   (newVal) => {
      maxValue.value = newVal
   }
)
</script>

<style scoped lang="scss">
.range-input {
   display: flex;
   max-width: 260px;
   flex-direction: column;
   gap: 5px;

   @media (max-width: 1250px) {
      max-width: 100%;
   }

   &__label {
      font-size: 12px;
      font-weight: 400;
      color: #323232;
   }

   &__fields {
      display: flex;
      gap: 10px;
   }

   &__currency {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #323232;
   }

   &__field {
      width: 50%;
      height: 34px;
      padding: 8px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      outline: none;
      font-size: 14px;
      color: #323232;

      &:focus {
         border-color: #3366ff;
      }

      &::placeholder {
         color: #a8a8a8;
      }
   }
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

input[type='number'] {
   -moz-appearance: textfield;
}
</style>
