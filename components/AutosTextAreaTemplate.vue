<template>
   <div class="simple-textarea">
      <label v-if="label" class="simple-textarea__label">
         {{ label }}
         <span class="simple-textarea__char-count">
            <span class="desktop"
               >({{ remainingCharacters }} / {{ maxLength }})</span
            >
            <span class="mobile"
               >{{ remainingCharacters }} / {{ maxLength }}</span
            >
         </span>
      </label>
      <div class="simple-textarea__wrapper">
         <div class="simple-textarea__field-wrapper">
            <textarea
               v-model="optionValue"
               class="simple-textarea__field"
               :placeholder="placeholder"
               :disabled="disabled"
               :maxlength="maxLength"
               @blur="handleBlur"
            />
         </div>
         <div class="simple-textarea__subtext">
            Не указывайте в сообщении телефон и другие персональные данные — для
            этого есть отдельные поля.
         </div>
         <img
            v-if="optionValue && optionValue.length > 0"
            :src="closeIcon"
            alt="Clear"
            class="simple-textarea__clear"
            @click="clearInput"
         >
      </div>
   </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import closeIcon from '@/assets/icons/close-gray.svg'

const props = defineProps({
   option: {
      type: String,
      default: ''
   },
   label: {
      type: String,
      default: ''
   },
   placeholder: {
      type: String,
      default: 'Введите текст'
   },
   disabled: {
      type: Boolean,
      default: false
   },
   maxLength: {
      type: Number,
      default: 3000
   }
})

const emit = defineEmits(['update:option'])
const optionValue = ref(props.option || '')

const remainingCharacters = computed(() => optionValue.value.length)

const clearInput = () => {
   optionValue.value = ''
}

const handleBlur = () => {
   emit('update:option', optionValue.value)
}

watch(
   () => props.option,
   (newValue) => {
      optionValue.value = newValue || ''
   }
)
</script>

<style scoped lang="scss">
.simple-textarea {
   display: flex;
   align-items: flex-start;
   flex-direction: row;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 270px;

      @media (max-width: 768px) {
         width: 100%;
         justify-content: space-between;
      }
   }

   &__char-count {
      font-size: 12px;
      color: #787878;

      @media (max-width: 768px) {
         font-size: 14px;
      }
   }

   .desktop {
      display: inline;

      @media (max-width: 768px) {
         display: none;
      }
   }

   .mobile {
      display: none;

      @media (max-width: 768px) {
         display: inline;
      }
   }

   &__wrapper {
      position: relative;
      max-width: 310px;

      @media (max-width: 768px) {
         width: 100%;
         max-width: 100%;
      }
   }

   &__field-wrapper {
      position: relative;
   }

   &__field {
      font-size: 14px;
      padding: 8px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      resize: vertical;

      @media (max-width: 768px) {
         height: 130px;
      }

      &:focus {
         outline: none;
         border-color: #3366ff;
      }

      &:disabled {
         background-color: #f0f0f0;
         color: #a8a8a8;
      }
   }

   &__subtext {
      font-size: 12px;
      color: #787878;
      margin-top: 5px;
   }

   &__clear {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      width: 14px;
      height: 14px;

      @media (hover: hover) and (pointer: fine) {
         &:hover {
            opacity: 0.7;
         }
      }
   }
}
</style>
