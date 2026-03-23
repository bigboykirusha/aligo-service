<template>
   <section class="authorization-page">
      <div class="authorization-page__backdrop" />

      <div class="authorization-page__layout">
         <div class="authorization-page__visual">
            <img class="authorization-page__image" src="@/assets/images/aligo-banner.png" alt="Aligo">
         </div>
         <div class="authorization-card">
            <div class="authorization-card__header">
               <img src="@/assets/icons/a-id.svg" alt="Aligo ID">
            </div>

            <form class="authorization-form" @submit.prevent="sendCodeRequest" @keydown.enter="handleEnter">
               <div class="authorization-form__section">
                  <Transition name="modal-instant">
                     <div v-show="!showCodeInput" class="input-wrapper">
                        <p class="input-wrapper__title">
                           Введите номер телефона
                        </p>
                        <p class="input-wrapper__description">
                           Мы отправим вам код подтверждения для входа в аккаунт.
                        </p>

                        <input ref="phoneInput" type="tel" :value="formattedPhone" class="phone-input"
                           autocomplete="tel" autofocus @input="onPhoneInput" @paste="onPhonePaste"
                           @keydown="onPhoneKeydown" @focus="onPhoneFocus">

                        <p v-if="contactInfoError && !showCodeInput" class="error-message">
                           {{ contactInfoError }}
                        </p>
                     </div>
                  </Transition>

                  <Transition name="modal-instant">
                     <div v-show="showCodeInput" class="input-wrapper">
                        <p class="input-wrapper__title">Введите код</p>
                        <p class="input-wrapper__description">
                           Мы отправили вам код подтверждения на номер
                           {{ formattedPhoneNumber }}
                           <span class="input-wrapper__description--link" @click.prevent="switchTab">
                              <br>
                              Изменить номер
                           </span>
                        </p>

                        <OtpInput ref="otpRef" v-model="code" :length="4" :error="hasError" :full-width="true"
                           @complete="confirmCode" />

                        <div class="modal-loading-state" :class="{ 'modal-loading-state--visible': isLoading }"
                           aria-live="polite">
                           <LoaderUI :size="20" />
                           <span>Проверяем код...</span>
                        </div>
                     </div>
                  </Transition>
               </div>
            </form>

            <div v-if="!showCodeInput" class="authorization-card__footer">
               <p v-if="timeLeft > 0" class="timer-message">
                  Отправить повторно можно через {{ formattedTime }}
               </p>

               <UIButton v-show="!showCodeInput && !(timeLeft > 0)" :disabled="isContactInfoInvalid || isLoading"
                  :loading="isLoading" variant="primary" @click="sendCodeRequest">
                  Отправить
               </UIButton>

               <p class="agreement-text">
                  Вы также соглашаетесь с
                  <a class="agreement-link" :href="termsLink" target="_blank" rel="noopener">
                     правилами Aligo
                  </a>
                  и
                  <a class="agreement-link" :href="privacyLink" target="_blank" rel="noopener">
                     политикой обработки персональных данных
                  </a>.
               </p>

            </div>

            <div v-else class="authorization-card__footer authorization-card__footer--otp">
               <p v-if="timeLeft > 0" class="timer-message">
                  Получить новый код можно через {{ formattedTime }}
               </p>

               <UIButton v-else variant="ghost" :loading="isLoading" :disabled="isLoading"
                  @click.prevent="sendCodeRequest">
                  Получить новый код
               </UIButton>
            </div>
         </div>
      </div>
   </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCookie, useRuntimeConfig } from '#app'
import { useRoute, useRouter } from 'vue-router'
import { loginUserByPhone, confirmPhoneCode } from '~/services/apiClient'
import { usePhoneMask } from '~/composables/usePhoneMask'
import { useResendTimer } from '~/composables/useResendTimer'
import { useOtpError } from '~/composables/useOtpError'
import { usePopupErrorStore } from '~/store/popupErrorStore'
import { useDocumentsStore } from '~/store/documents'
import { useUserStore } from '~/store/user'
import { getApiResponseMessage, isApiRequestSuccessful } from '@/services/apiUtils'
import OtpInput from '~/components/ui/OtpInput.vue'
import UIButton from '~/components/ui/UIButton.vue'
import LoaderUI from '~/components/ui/LoaderUI.vue'

definePageMeta({
   requiresAuth: false
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const userStore = useUserStore()
const popupErrorStore = usePopupErrorStore()
const documentsStore = useDocumentsStore()

const sanitizeRedirectPath = (value) => {
   const raw = typeof value === 'string' ? value.trim() : ''
   if (!raw) return '/'
   if (!raw.startsWith('/')) return '/'
   if (raw.startsWith('//')) return '/'
   return raw
}

const redirectPath = computed(() => sanitizeRedirectPath(route.query.redirect))

const {
   phoneRaw: phoneNumberRaw,
   formattedPhone,
   onInput: onPhoneInput,
   onPaste: onPhonePaste,
   onKeydown: onPhoneKeydown,
   onFocus: onPhoneFocus,
   removeFormatting,
   validatePhone
} = usePhoneMask('')

const { timeLeft, formattedTime, start: startTimer, restore: restoreTimer, stop: stopTimer } =
   useResendTimer({ keyPrefix: 'login_phone' })
const { hasError, flash: flashOtpError } = useOtpError()

const phoneInput = ref(null)
const otpRef = ref(null)
const code = ref('')
const showCodeInput = ref(false)
const isLoading = ref(false)
const contactInfoError = ref('')

const validatePhoneNumber = (phone) => validatePhone(phone)

const termsLink = computed(() => {
   const doc = documentsStore.documentByTitle('Условия использования сервиса Aligo')
   return doc?.path
      ? `${config.public.apiBaseUrl}/${doc.path}`
      : `${config.public.apiBaseUrl}/documents/terms-of-use-16-09-25.pdf`
})

const privacyLink = computed(() => {
   const doc = documentsStore.documentByTitle('Политика конфиденциальности')
   return doc?.path
      ? `${config.public.apiBaseUrl}/${doc.path}`
      : `${config.public.apiBaseUrl}/documents/privacy-policy-16-09-25.pdf`
})

const formattedPhoneNumber = computed(() => {
   let raw = formattedPhone.value.replace(/\D/g, '')

   if (raw.startsWith('8')) raw = `7${raw.slice(1)}`
   if (!raw.startsWith('7')) raw = `7${raw}`
   if (raw.length < 11) return formattedPhone.value

   const last4 = raw.slice(7, 11)
   return `+7 (***) ***-${last4.slice(0, 2)}-${last4.slice(2)}`
})

const isContactInfoInvalid = computed(
   () => !validatePhoneNumber(formattedPhone.value)
)

const focusPhoneInputWithRetry = (attempt = 0) => {
   const input = phoneInput.value
   if (!input) {
      if (attempt < 8) {
         setTimeout(() => focusPhoneInputWithRetry(attempt + 1), 70)
      }
      return
   }

   input.focus()

   if (document.activeElement !== input && attempt < 8) {
      setTimeout(() => focusPhoneInputWithRetry(attempt + 1), 70)
   }
}

const setFocusOnInput = () => {
   const focusTarget = () => {
      if (showCodeInput.value) {
         if (otpRef.value?.focusFirst) {
            otpRef.value.focusFirst()
         } else {
            document.querySelector('.otp-input')?.focus()
         }
      } else {
         focusPhoneInputWithRetry()
      }
   }

   nextTick(() => {
      focusTarget()
      setTimeout(focusTarget, 80)
   })
}

const clearFormFields = () => {
   code.value = ''
   contactInfoError.value = ''
}

const resetToPhoneStep = () => {
   clearFormFields()
   showCodeInput.value = false
}

const switchTab = () => {
   resetToPhoneStep()
   setFocusOnInput()
}

const DEV_ALERT_PHONE = '+79306642255'

const extractLoginCode = (response) => {
   const candidates = [
      response?.code,
      response?.sms_code,
      response?.otp_code,
      response?.debug_code,
      response?.data?.code,
      response?.data?.sms_code,
      response?.data?.otp_code,
      response?.data?.debug_code,
      response?.data?.data?.code
   ]

   const value = candidates.find(
      (item) => item !== null && item !== undefined && String(item).trim() !== ''
   )

   return value ? String(value).trim() : null
}

const buildPhoneRequestData = () => {
   let cleanedPhone = removeFormatting(phoneNumberRaw.value)
   if (!cleanedPhone.startsWith('+7')) {
      cleanedPhone = `+7${cleanedPhone}`
   }

   return {
      requestData: { phone: cleanedPhone },
      cleanedPhone
   }
}

const sendCodeRequest = async () => {
   if (isLoading.value || isContactInfoInvalid.value || timeLeft.value > 0) return

   isLoading.value = true
   contactInfoError.value = ''

   try {
      const { requestData, cleanedPhone } = buildPhoneRequestData()
      const response = await loginUserByPhone(requestData)

      if (isApiRequestSuccessful(response)) {
         if (import.meta.client && cleanedPhone === DEV_ALERT_PHONE) {
            const codeValue = extractLoginCode(response)
            if (codeValue) {
               alert(`Код: ${codeValue}`)
            }
         }

         showCodeInput.value = true
         startTimer()
         setFocusOnInput()
      } else {
         contactInfoError.value = getApiResponseMessage(
            response,
            'Не удалось отправить код.'
         )
      }
   } catch (error) {
      contactInfoError.value = error?.message || 'Не удалось отправить код.'
   } finally {
      isLoading.value = false
   }
}

const handleSuccessfulLogin = async (data, cleanedPhone) => {
   const { token, user_id } = data
   const cookieOptions = {
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
      path: '/',
      secure: !import.meta.dev
   }

   useCookie('token', cookieOptions).value = token
   useCookie('user_id', cookieOptions).value = user_id
   useCookie('phoneNumber', cookieOptions).value = cleanedPhone

   clearFormFields()
   await userStore.fetchAndSetUserdata({ useCache: false, token })
   stopTimer()
   await router.push(redirectPath.value)
}

const confirmCode = async () => {
   if (isLoading.value || code.value.length !== 4) return

   isLoading.value = true

   try {
      const { requestData, cleanedPhone } = buildPhoneRequestData()
      const response = await confirmPhoneCode({
         ...requestData,
         code: code.value
      })

      if (isApiRequestSuccessful(response)) {
         await handleSuccessfulLogin(response.data, cleanedPhone)
      } else {
         flashOtpError()
         code.value = ''
         contactInfoError.value = getApiResponseMessage(
            response,
            'Неверный код.'
         )
         popupErrorStore.showError(contactInfoError.value)
         setFocusOnInput()
      }
   } catch (error) {
      contactInfoError.value = error?.message || 'Не удалось подтвердить код.'
      popupErrorStore.showError(contactInfoError.value)
   } finally {
      isLoading.value = false
   }
}

const handleEnter = (event) => {
   if (
      isLoading.value ||
      (timeLeft.value > 0 && !showCodeInput.value) ||
      isContactInfoInvalid.value
   ) {
      event.preventDefault()
   }
}

onMounted(() => {
   documentsStore.fetchDocuments()
   restoreTimer()

   const savedPhoneNumber = useCookie('phoneNumber').value
   phoneNumberRaw.value = savedPhoneNumber?.replace(/\D/g, '').slice(1) || ''

   nextTick(() => {
      setFocusOnInput()
      setTimeout(setFocusOnInput, 120)
   })
})

onBeforeUnmount(() => {
   stopTimer()
})

watch(showCodeInput, () => {
   setFocusOnInput()
})
</script>

<style scoped lang="scss">
.authorization-page {
   position: relative;
   display: flex;
   align-items: center;
   overflow: hidden;
   min-height: 100dvh;
   padding: 16px;
   background:
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 26%),
      radial-gradient(circle at bottom left, rgba(17, 24, 39, 0.14), transparent 30%),
      #3366ff;
}

.authorization-page__backdrop {
   position: absolute;
   inset: 0;
   background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 38%),
      linear-gradient(315deg, rgba(10, 20, 60, 0.16), transparent 44%);
   pointer-events: none;
}

.authorization-page__layout {
   position: relative;
   z-index: 1;
   display: grid;
   grid-template-columns: minmax(0, 520px);
   justify-content: center;
   gap: 20px;
   flex: 1 1 auto;
   width: 100%;
   max-width: 552px;
   margin: 0 auto;
   padding: 0 16px;
}

.authorization-page__visual {
   display: flex;
   align-items: center;
   justify-content: center;
   min-height: 310px;
}

.authorization-page__image {
   display: block;
   width: min(100%, 760px);
   height: auto;
   object-fit: contain;
   filter: drop-shadow(0 24px 54px rgba(10, 20, 60, 0.32));
}

.authorization-card {
   display: flex;
   flex-direction: column;
   min-height: 310px;
   padding: 24px;
   border: 1px solid rgba(255, 255, 255, 0.18);
   border-radius: 28px;
   background: rgba(255, 255, 255, 0.96);
   box-shadow: 0 24px 80px rgba(8, 23, 74, 0.28);
}

.authorization-form {
   flex: 1 1 auto;
}

.authorization-card__header {
   display: flex;
   justify-content: flex-start;
   margin-bottom: 24px;
}

.authorization-card__footer {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 16px;
   width: 100%;
   margin-top: 8px;
}

.authorization-card__footer--otp {
   gap: 24px;
}

.authorization-form {
   width: 100%;
}

.authorization-form__section {
   padding: 0;
}

.input-wrapper {
   display: flex;
   flex-direction: column;
   font-size: 12px;
}

.input-wrapper__title {
   margin: 0 0 8px;
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
   font-weight: 700;
   color: var(--color-text-primary);
   text-align: left;
}

.input-wrapper__description {
   margin: 0 0 24px;
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
   color: var(--color-text-primary);
}

.input-wrapper__description--link {
   color: var(--color-text-accent);
   cursor: pointer;
   margin-top: 8px;
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.phone-input {
   width: 100%;
   height: 34px;
   padding: 0 12px;
   border: 1px solid var(--color-border);
   border-radius: 6px;
   box-sizing: border-box;
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.phone-input:focus {
   outline: none;
   border-color: var(--color-text-accent);
}

.timer-message {
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
   text-align: center;
}

.modal-loading-state {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
   min-height: 20px;
   margin-top: 16px;
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
   opacity: 0;
   visibility: hidden;
   pointer-events: none;
   transition: opacity 0.12s ease;
}

.modal-loading-state--visible {
   opacity: 1;
   visibility: visible;
}

.error-message {
   margin-top: 4px;
   color: #ff5959;
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.agreement-text {
   margin: 0;
   font-size: var(--font-size-12);
   color: var(--color-text-secondary);
   line-height: var(--line-height-12);
   text-align: center;
}

.agreement-link {
   color: var(--color-text-secondary);
   text-decoration: underline;
}

.modal-instant-enter-active,
.modal-instant-leave-active {
   transition: opacity 80ms linear;
}

.modal-instant-enter-from,
.modal-instant-leave-to {
   opacity: 0;
}

@media (max-width: 960px) {
   .authorization-page {
      display: flex;
      align-items: stretch;
      box-sizing: border-box;
      padding: 120px 16px;
   }

   .authorization-page__layout {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
      align-content: stretch;
      gap: 24px;
      min-height: 100%;
      max-width: 100%;
      padding: 0;
   }

   .authorization-page__visual {
      min-height: 220px;
      padding: 20px;
      border-radius: 24px;
   }

   .authorization-card {
      min-height: 0;
      height: 100%;
      padding: 24px;
      border-radius: 24px;
   }

}
</style>
