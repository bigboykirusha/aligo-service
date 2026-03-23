<template>
   <div :class="[
      'vin-check',
      {
         'vin-check--compact': compact,
         'vin-check--profile-row': profileRow,
         'vin-check--form-only': formOnly
      }
   ]">
      <div v-if="!hideTitle" class="vin-check__title">
         <p class="vin-check__text">
            {{ displayTitle }}
         </p>

         <div v-if="showServiceLinks" class="vin-check__links">
            <nuxt-link to="/avtohistory" class="vin-check__more-link">
               {{ vinCheckLabels.serviceLink }}
            </nuxt-link>

            <VinHelpTooltip class="vin-check__link-wrapper" trigger-class="vin-check__link"
               :text="vinCheckLabels.helpTooltip" :icon="searchBlueIcon" />
         </div>
      </div>

      <div class="vin-check__form">
         <div class="vin-check__input-group input-group">
            <div class="vin-check__input-shell" :class="{ error: vinError }">
               <input v-model="vin" type="text" :placeholder="placeholder" class="vin-check__input"
                  @input="validateVINInput">

               <button type="button" class="vin-check__button" @click="handleCheckVIN">
                  <img :src="specIcon" alt="">
                  <span>{{ buttonText }}</span>
               </button>
            </div>
         </div>

         <p v-if="vinError" class="vin-check__error-message input-error-message">
            {{ vinCheckLabels.validationError }}
         </p>
      </div>
   </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import specIcon from '@/assets/icons/spec-check-icon-w.svg'
import searchBlueIcon from '@/assets/icons/search-blue.svg'
import VinHelpTooltip from '@/components/VinHelpTooltip.vue'
import { getFullReportPrice } from '@/services/apiClient'
import { resolveFullReportPrice } from '@/services/auto/adViewModel'
import { useTransactionStore } from '~/store/transaction'
import { useUserStore } from '~/store/user'
import { isValidGosNumber, validateVIN } from '~/utils/vinValidation'

const vinCheckLabels = Object.freeze({
   helpTooltip: '\u0413\u0434\u0435 \u043d\u0430\u0439\u0442\u0438 VIN \u043d\u043e\u043c\u0435\u0440?',
   serviceLink: '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e\u0431 \u0443\u0441\u043b\u0443\u0433\u0435',
   defaultTitle:
      '\u0423\u0437\u043d\u0430\u0439\u0442\u0435 \u043f\u043e\u043b\u043d\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e\u0431 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435 \u043f\u0435\u0440\u0435\u0434 \u043f\u043e\u043a\u0443\u043f\u043a\u043e\u0439',
   defaultPlaceholder:
      '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 VIN \u0438\u043b\u0438 \u0433\u043e\u0441\u043d\u043e\u043c\u0435\u0440',
   defaultButtonText:
      '\u041a\u0443\u043f\u0438\u0442\u044c \u043e\u0442\u0447\u0451\u0442',
   transactionTitle:
      '\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044f',
   validationError:
      '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 VIN \u0438\u043b\u0438 \u0433\u043e\u0441\u043d\u043e\u043c\u0435\u0440'
})

const props = defineProps({
   buttonText: {
      type: String,
      default: '\u041a\u0443\u043f\u0438\u0442\u044c \u043e\u0442\u0447\u0451\u0442'
   },
   compact: {
      type: Boolean,
      default: false
   },
   profileRow: {
      type: Boolean,
      default: false
   },
   placeholder: {
      type: String,
      default:
         '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 VIN \u0438\u043b\u0438 \u0433\u043e\u0441\u043d\u043e\u043c\u0435\u0440'
   },
   showServiceLinks: {
      type: Boolean,
      default: true
   },
   title: {
      type: String,
      default:
         '\u0423\u0437\u043d\u0430\u0439\u0442\u0435 \u043f\u043e\u043b\u043d\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e\u0431 \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435 \u043f\u0435\u0440\u0435\u0434 \u043f\u043e\u043a\u0443\u043f\u043a\u043e\u0439'
   },
   hideTitle: {
      type: Boolean,
      default: false
   },
   formOnly: {
      type: Boolean,
      default: false
   }
})

const route = useRoute()
const router = useRouter()
const transactionStore = useTransactionStore()
const userStore = useUserStore()

const vin = ref('')
const vinError = ref(false)
const reportPrice = ref(85)

const displayTitle = computed(() => {
   if (props.title !== vinCheckLabels.defaultTitle) {
      return props.title
   }

   return `${vinCheckLabels.defaultTitle} за ${reportPrice.value} ₽`
})

const fetchPrice = async () => {
   try {
      const response = await getFullReportPrice(null)
      reportPrice.value = resolveFullReportPrice(response, reportPrice.value)
   } catch (error) {
      console.error('Не удалось загрузить актуальную цену отчета:', error)
   }
}

onMounted(() => {
   void fetchPrice()
})

const validateVINInput = () => {
   if (vinError.value) vinError.value = false
}

const isValidSearchValue = (value) => {
   const trimmed = value.trim().toUpperCase()
   if (!trimmed) return false

   const isLikelyVIN = trimmed.length === 17
   const isLikelyGosNumber = trimmed.length >= 6 && trimmed.length <= 10

   if (isLikelyVIN) return validateVIN(trimmed)
   if (isLikelyGosNumber) return isValidGosNumber(trimmed)

   return false
}

const handleCheckVIN = () => {
   const trimmed = vin.value.trim().toUpperCase()

   if (!isValidSearchValue(trimmed)) {
      vinError.value = true
      return
   }

   vinError.value = false

   if (!userStore.isLoggedIn) {
      router.push({
         path: '/authorization',
         query: { redirect: route.fullPath || '/' }
      })
      return
   }

   transactionStore.setTransaction({
      kind: 'report',
      title: vinCheckLabels.transactionTitle,
      subtitle: `VIN/\u0413\u043e\u0441\u043d\u043e\u043c\u0435\u0440: ${trimmed}`,
      requiredAmount: reportPrice.value,
      vin: trimmed
   })

   router.push('/transaction')
}
</script>

<style scoped lang="scss">
.vin-check {
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   gap: 12px;
   width: 100%;
   padding: 24px;
   border-radius: 6px;
   background: linear-gradient(135deg, #d6efff 0%, #b3d9ff 100%);

   @media (max-width: 1312px) {
      flex-direction: column;
   }

   &--form-only {
      display: block;
      padding: 0 !important;
      border-radius: 0;
      background: transparent;
   }

   @media (max-width: 480px) {
      padding: 16px;
   }

   &__text {
      margin: 0;
      color: #323232;
      font-size: 20px;
      line-height: 24px;
      font-weight: 700;
   }

   &__form {
      display: flex;
      flex-direction: column;
      width: 100%;
   }

   &__input-group {
      display: flex;
      width: 100%;
   }

   &__input-shell {
      position: relative;
      width: 100%;
      height: 34px;
   }

   &__input {
      width: 100%;
      height: 34px;
      padding: 8px 124px 8px 12px;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
      font-size: 14px;
      outline: none;

      &:focus {
         border-color: #3366ff;
      }
   }

   &__button {
      position: absolute;
      top: 3px;
      right: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 28px;
      max-width: calc(100% - 6px);
      height: 28px;
      padding: 0 8px;
      border: none;
      border-radius: 4px;
      background-color: #3366ff;
      color: #ffffff;
      font-size: 14px;
      line-height: 18px;
      white-space: nowrap;
      cursor: pointer;
      transition: background-color 0.2s ease;

      @media (max-width: 768px) {
         font-size: 12px;
         line-height: 16px;
      }

      &:hover {
         background-color: #144df8;
      }

      &:disabled {
         background-color: #d6d6d6;
         cursor: not-allowed;
      }

      img {
         height: 14px;
         flex: 0 0 auto;
      }
   }

   &__error-message {
      margin-top: 4px;
      font-size: 12px;
      color: #ff4d4f;
   }

   &__links {
      display: flex;
      gap: 16px;
      margin: 8px 0;

      @media (max-width: 480px) {
         align-items: flex-start;
      }
   }

   &__more-link {
      display: inline-block;
      color: #3366ff;
      font-size: 12px;
      cursor: pointer;

      &:hover {
         color: #144df8;
      }
   }

   &--compact {
      flex-direction: column;
      padding: 16px;

      .vin-check__text {
         font-size: 20px;
         line-height: 24px;

         @media (max-width: 768px) {
            font-size: 16px;
            line-height: 20px;
         }
      }

      .vin-check__input-group {
         width: 100%;
      }

      .vin-check__links {
         flex-wrap: wrap;
      }
   }

   &--profile-row {
      .vin-check__input-group {
         flex-direction: row;
         gap: 0;
      }
   }
}

.vin-check__input-shell.error .vin-check__input {
   border-color: #ff4d4f !important;
}

:deep(.vin-check__link) {
   display: flex;
   align-items: center;
   gap: 8px;
   color: #3366ff;
   font-size: 12px;
   text-decoration: none;
   cursor: pointer;
}

:deep(.vin-check__link img) {
   height: 12px;
}
</style>
