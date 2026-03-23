<template>
   <div class="simple-input">
      <label v-if="label" class="simple-input__label">{{ label }}</label>
      <div class="simple-input__wrapper">
         <input
            :value="formattedPhone"
            disabled
            type="text"
            class="simple-input__field"
            :placeholder="placeholder"
         >
         <div class="simple-input__subtext">
            Чтобы ваши номера не попали в базы мошенников, мы показываем его
            только зарегистрированным и проверенным пользователям сервиса.
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePhoneMask } from '~/composables/usePhoneMask'

defineOptions({
   name: 'CreatePhoneDisplayField'
})

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
   }
})

const emit = defineEmits(['update:option'])
const displayValue = ref(props.option || '')
const { phoneRaw, formattedPhone } = usePhoneMask('')

watch(
  () => props.option,
  (newValue) => {
    const digits = (newValue || '').replace(/\D/g, '')
    phoneRaw.value = digits.startsWith('7') ? digits.slice(1, 11) : digits.slice(0, 10)
    displayValue.value = newValue || ''
  },
  { immediate: true }
)

watch(formattedPhone, (newValue) => {
   const cleanValue = (newValue || '').replace(/\D/g, '')
   emit('update:option', cleanValue)
})

watch(
   () => props.option,
   (newValue) => {
      displayValue.value = newValue || ''
   }
)
</script>

<style scoped lang="scss">
.simple-input {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__label {
      font-size: 14px;
      color: #323232;
      min-width: 270px;
   }

   &__subtext {
      font-size: 14px;
      color: #ffffff;
      padding-top: 8px;
   }

   &__wrapper {
      position: relative;
      padding: 16px;
      width: 310px;
      border-radius: 6px;
      background-color: #3366ff;

      @media (max-width: 768px) {
         width: 100%;
      }

      &.valid {
         background-color: #3bbc71;

         .simple-input__field {
            border-color: #3bbc71;
         }
      }
   }

   &__field {
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
      border: none;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;

      &:focus {
         outline: none;
         border-color: #3366ff;
      }

      &:disabled {
         background-color: #3366ff;
         color: #ffffff;
      }
   }

   &__clear {
      position: absolute;
      top: 35px;
      right: 25px;
      transform: translateY(-50%);
      cursor: pointer;
      width: 14px;
      height: 14px;

      &:hover {
         opacity: 0.7;
      }
   }
}
</style>
