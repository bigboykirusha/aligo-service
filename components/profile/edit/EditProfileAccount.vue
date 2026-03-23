<template>
   <div class="edit-profile">
      <div class="edit-profile__form-container">
         <form class="edit-profile__form" @submit.prevent>
            <!-- Поле код -->
            <div class="simple-input">
               <label class="simple-input__label">Номер профиля (ID)</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__text">{{ profile.uniqueCode }}</div>
               </div>
            </div>

            <!-- Поле Username -->
            <div class="simple-input" :class="{ 'has-error': validationErrors.username }">
               <label class="simple-input__label">Имя</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__block">
                     <input v-if="editMode.username" id="username" v-model="profile.username" type="text"
                        class="simple-input__field" placeholder="Введите имя пользователя"
                        @input="markAsChanged('username')">
                     <div v-else class="simple-input__text">
                        {{ profile.username }}
                     </div>
                     <div v-if="validationErrors.username" class="simple-input__error-message">
                        {{ validationErrors.username }}
                     </div>
                     <div v-if="editMode.username" class="edit-input-actions">
                        <button type="button"
                           class="edit-input-actions__save-button edit-input-actions__save-button-common"
                           @click="saveField('username')">
                           <img :src="checkIcon" alt="">Отправить
                        </button>
                        <button type="button"
                           class="edit-input-actions__cancel-button edit-input-actions__cancel-button-common"
                           @click="cancelEdit('username')">
                           <img :src="cancelIcon" alt="">Отменить
                        </button>
                     </div>
                     <div v-if="!profile.username && !editMode.username" class="simple-input__text">
                        <button type="button" class="edit-button" @click="toggleEditMode('username')">
                           <img :src="plusIcon" alt="">
                           Добавить
                        </button>
                     </div>
                  </div>
                  <button v-if="!editMode.username && profile.username" type="button" class="edit-button"
                     @click="toggleEditMode('username')">
                     <img :src="editIcon" alt="Edit" class="edit-button__icon">
                     Изменить
                  </button>
               </div>
            </div>

            <div class="simple-input simple-input--phone" :class="{ 'has-error': validationErrors.phone }">
               <label class="simple-input__label simple-input__label--phone">Телефон</label>
               <div v-if="!(!profile.phone && !editMode.phone)"
                  class="simple-input__wrapper simple-input__wrapper--phone">
                  <div class="simple-input__block simple-input__block--phone">
                     <input v-if="editMode.phone" id="phone" :value="formattedPhone" type="tel"
                        class="simple-input__field" placeholder="Введите телефон" maxlength="18" @input="onPhoneInput"
                        @paste="onPhonePaste" @keydown="onPhoneKeydown" @focus="onPhoneFocus"
                        @keydown.backspace="handleBackspace">
                     <div v-else class="simple-input__text">
                        {{ profile.phone }}
                     </div>

                     <button v-if="!editMode.phone && profile.phone" type="button"
                        class="edit-button edit-button--phone" @click="toggleEditMode('phone')">
                        <img :src="editIcon" alt="Edit" class="edit-button__icon">
                        Изменить
                     </button>
                  </div>
                  <div v-if="phoneDescription" class="simple-input__description">
                     {{ phoneDescription }}
                  </div>
                  <div v-if="validationErrors.phone" class="simple-input__error-message">
                     {{ validationErrors.phone }}
                  </div>
                  <div v-if="editMode.phone" class="edit-input-actions">
                     <button type="button" class="edit-input-actions__save-button" @click="saveField('phone')">
                        <img :src="checkIcon" alt="">Отправить
                     </button>
                     <button type="button" class="edit-input-actions__cancel-button" @click="cancelEdit('phone')">
                        <img :src="cancelIcon" alt="">Отменить
                     </button>
                  </div>
                  <div v-if="codeInputVisible" class="simple-input__code-block">
                     <OtpInput v-model="code" :length="4" @complete="submitCode" />
                     <p v-if="timeLeft > 0" class="timer-message">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else type="button" class="timer-text" tabindex="0" @click.prevent="saveField('phone')">
                        Получить новый код
                     </button>
                  </div>
               </div>
               <div v-if="!profile.phone && !editMode.phone" class="simple-input__text simple-input__text--btn">
                  <button type="button" class="edit-button" @click="toggleEditMode('phone')">
                     <img :src="plusIcon" alt="">
                     Добавить
                  </button>
               </div>
            </div>

            <div class="simple-input" :class="{ 'has-error': validationErrors.address }">
               <label class="simple-input__label">Место осмотра</label>
               <div v-if="!(!profile.address && !editMode.address)" class="simple-input__wrapper">
                  <div class="simple-input__block">
                     <AutosAddressInput
                        v-if="editMode.address"
                        label=""
                        layout="column"
                        input-width="100%"
                        :option="profile.address"
                        :latitude="profile.latitude"
                        :longitude="profile.longitude"
                        :sync-store-coordinates="false"
                        class="simple-input__address-input"
                        @update:address="handleAddressChange"
                        @update:latitude="handleLatitudeChange"
                        @update:longitude="handleLongitudeChange"
                     />
                     <div v-else class="simple-input__text">
                        {{ profile.address }}
                     </div>
                     <div v-if="validationErrors.address" class="simple-input__error-message">
                        {{ validationErrors.address }}
                     </div>
                     <div v-if="editMode.address" class="edit-input-actions">
                        <button type="button"
                           class="edit-input-actions__save-button edit-input-actions__save-button-common"
                           @click="saveField('address')">
                           <img :src="checkIcon" alt="">Сохранить
                        </button>
                        <button type="button"
                           class="edit-input-actions__cancel-button edit-input-actions__cancel-button-common"
                           @click="cancelEdit('address')">
                           <img :src="cancelIcon" alt="">Отменить
                        </button>
                     </div>
                     <div v-if="!profile.address && !editMode.address" class="simple-input__text">
                        <button type="button" class="edit-button" @click="toggleEditMode('address')">
                           <img :src="plusIcon" alt="">
                           Добавить
                        </button>
                     </div>
                  </div>
                  <button v-if="!editMode.address && profile.address" type="button" class="edit-button"
                     @click="toggleEditMode('address')">
                     <img :src="editIcon" alt="Edit" class="edit-button__icon">
                     Изменить
                  </button>
               </div>
               <div v-if="!profile.address && !editMode.address" class="simple-input__text simple-input__text--btn">
                  <button type="button" class="edit-button" @click="toggleEditMode('address')">
                     <img :src="plusIcon" alt="">
                     Добавить
                  </button>
               </div>
            </div>

            <!-- Поле Email -->
            <div class="simple-input simple-input--phone" :class="{ 'has-error': validationErrors.email }">
               <label class="simple-input__label simple-input__label--phone">Почта</label>
               <div v-if="!(!profile.email && !editMode.email)"
                  class="simple-input__wrapper simple-input__wrapper--phone"
                  :class="{ 'simple-input__wrapper--confirm': !isConfirmed }">
                  <div class="simple-input__block simple-input__block--phone">
                     <input v-if="editMode.email" id="email" v-model="profile.email" type="email"
                        class="simple-input__field" placeholder="Введите email" @input="markAsChanged('email')">
                     <div v-else class="simple-input__text">
                        {{ profile.email }}
                        <div v-if="showEmailConfirmationNote" class="simple-input__confirmed">
                           Подтвердите почту
                        </div>
                        <button v-if="!isConfirmed && !emailCodeInputVisible" class="simple-input__button--confirm"
                           type="button" @click="saveField('email')">
                           Подтвердить
                        </button>
                     </div>
                     <button v-if="!editMode.email && profile.email" type="button"
                        class="edit-button edit-button--phone" @click="toggleEditMode('email')">
                        <img :src="editIcon" alt="Edit" class="edit-button__icon">
                        Изменить
                     </button>
                  </div>
                  <div v-if="emailDescription" class="simple-input__description">
                     {{ emailDescription }}
                  </div>
                  <div v-if="validationErrors.email" class="simple-input__error-message">
                     {{ validationErrors.email }}
                  </div>
                  <div v-if="editMode.email" class="edit-input-actions">
                     <button type="button" class="edit-input-actions__save-button" :class="{
                        'edit-input-actions__save-button--confirm':
                           !isConfirmed
                     }" @click="saveField('email')">
                        <img :src="checkIcon" alt="">Сохранить
                     </button>
                     <button type="button" class="edit-input-actions__cancel-button" :class="{
                        'edit-input-actions__cancel-button--confirm':
                           !isConfirmed
                     }" @click="cancelEdit('email')">
                        <img :src="cancelIcon" alt="">Отменить
                     </button>
                  </div>
                  <div v-if="emailCodeInputVisible" class="simple-input__code-block">
                     <OtpInput v-model="emailCode" :length="4" @complete="submitEmailCode" />
                     <p v-if="timeLeft > 0" class="timer-message">
                        Получить новый можно через {{ formattedTime }}
                     </p>
                     <button v-else type="button" class="timer-text" tabindex="0" @click.prevent="saveField('email')">
                        Получить новый код
                     </button>
                  </div>
               </div>
               <div v-if="!profile.email && !editMode.email" class="simple-input__text simple-input__text--btn">
                  <button type="button" class="edit-button" @click="toggleEditMode('email')">
                     <img :src="plusIcon" alt="">
                     Добавить
                  </button>
               </div>
            </div>

            <!-- Поле Город -->
            <div class="simple-input">
               <div class="simple-input__label">Город</div>
               <div class="simple-input__wrapper">
                  <button type="button" class="simple-input__changeable-block" @click="toggleModal">
                     {{ selectedCity }}
                  </button>
               </div>
            </div>

            <!-- Поле Дата регистрации -->
            <div class="simple-input">
               <label class="simple-input__label">Дата регистрации</label>
               <div class="simple-input__wrapper">
                  <div class="simple-input__text">{{ formattedDate }}</div>
               </div>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup>
import {
   ref,
   computed,
   watch,
   onMounted,
   onBeforeUnmount,
   onActivated,
   onDeactivated
} from 'vue'
import { useUserStore } from '@/store/user'
import { useCityStore } from '@/store/city'
import { useModalStore } from '@/store/modalStore'
import { confirmCode } from '~/services/apiClient'
import {
   validateEmail,
   validatePhoneNumber,
   validateUsername
} from '~/services/validation'
import AutosAddressInput from '~/components/AutosAddressInput.vue'
import OtpInput from '~/components/ui/OtpInput.vue'
import { usePhoneMask } from '~/composables/usePhoneMask'
import checkIcon from '@/assets/icons/check-icon.svg'
import cancelIcon from '@/assets/icons/cancel.svg'
import editIcon from '@/assets/icons/edit.svg'
import plusIcon from '@/assets/icons/plus.svg'

const cityStore = useCityStore()
const userStore = useUserStore()
const modalStore = useModalStore()

const TIMER_END_KEY = 'editProfileTimerEndTime'
const FIRST_TIMER_KEY = 'editProfileFirstTimerStartedAt'
const FIRST_TIMER_TTL = 24 * 60 * 60 * 1000
const FIRST_TIMER_SECONDS = 60
const DEFAULT_TIMER_SECONDS = 180

const FIELD_LABELS = Object.freeze({
   email: 'email',
   phone: 'номер',
   username: 'имя',
   address: 'место осмотра'
})

const createProfileDraft = () => ({
   createdAt: userStore.createdAt,
   username: userStore.username || '',
   email: userStore.unconfirmed_email || userStore.email || '',
   phone: userStore.phoneNumber || '',
   uniqueCode: userStore.uniqueCode || '',
   city_id: userStore.city_id || null,
   city_name: userStore.city_name || '',
   address: userStore.address || '',
   latitude: userStore.latitude || null,
   longitude: userStore.longitude || null
})

const selectedCity = computed(
   () => cityStore.selectedCity.name || 'Выберите город'
)

const profile = ref(createProfileDraft())

const changedFields = ref({})
const editMode = ref({
   username: false,
   email: false,
   phone: false,
   address: false
})

const {
   phoneRaw,
   formattedPhone,
   onInput: onPhoneInput,
   onPaste: onPhonePaste,
   onKeydown: onPhoneKeydown,
   onFocus: onPhoneFocus
} = usePhoneMask('')

const isConfirmed = computed(() => !userStore.unconfirmed_email)

const toggleModal = () => modalStore.toggle('location')

let timer = null
const timeLeft = ref(0)

const syncProfileDraft = () => {
   profile.value = createProfileDraft()
}

const resetTimer = () => {
   clearInterval(timer)
   timer = null
}

const clearStoredTimer = () => {
   resetTimer()
   if (import.meta.client) {
      localStorage.removeItem(TIMER_END_KEY)
   }
}

const getOriginalFieldValue = (field) => {
   switch (field) {
      case 'phone':
         return userStore.phoneNumber || ''
      case 'email':
         return userStore.unconfirmed_email || userStore.email || ''
      case 'username':
         return userStore.username || ''
      case 'address':
         return userStore.address || ''
      case 'latitude':
         return userStore.latitude || null
      case 'longitude':
         return userStore.longitude || null
      default:
         return profile.value[field] || ''
   }
}

const clearChangedField = (field) => {
   changedFields.value = Object.fromEntries(
      Object.entries(changedFields.value).filter(([key]) => key !== field)
   )
}

const resetVerificationState = (field) => {
   if (field === 'phone') {
      codeInputVisible.value = false
      code.value = ''
      return
   }

   if (field === 'email') {
      emailCodeInputVisible.value = false
      emailCode.value = ''
   }
}

const startTimer = () => {
   if (!import.meta.client) return

   const firstTime = Number(localStorage.getItem(FIRST_TIMER_KEY))
   const isFirstTime =
      !firstTime || Number.isNaN(firstTime) || Date.now() - firstTime > FIRST_TIMER_TTL

   if (isFirstTime) {
      localStorage.setItem(FIRST_TIMER_KEY, String(Date.now()))
   }

   resetTimer()

   const duration = isFirstTime ? FIRST_TIMER_SECONDS : DEFAULT_TIMER_SECONDS
   const endTime = Date.now() + duration * 1000

   localStorage.setItem(TIMER_END_KEY, String(endTime))

   updateRemainingTime(endTime)

   timer = setInterval(() => {
      updateRemainingTime(endTime)
   }, 1000)
}

const checkAndRestoreTimer = () => {
   if (!import.meta.client) return

   resetTimer()

   const endTime = Number.parseInt(localStorage.getItem(TIMER_END_KEY), 10)

   if (endTime && endTime > Date.now()) {
      updateRemainingTime(endTime)

      timer = setInterval(() => {
         updateRemainingTime(endTime)
      }, 1000)
   }
}

const updateRemainingTime = (endTime) => {
   const remainingTime = Math.max(Math.floor((endTime - Date.now()) / 1000), 0)

   timeLeft.value = remainingTime

   if (remainingTime === 0) {
      clearStoredTimer()
   }
}

const formattedTime = computed(() => {
   const minutes = Math.floor(timeLeft.value / 60)
   const seconds = timeLeft.value % 60
   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const codeInputVisible = ref(false)
const code = ref('')
const emailCodeInputVisible = ref(false)
const emailCode = ref('')

const phoneDescription = computed(() =>
   codeInputVisible.value
      ? 'Введите код, отправленный на новый номер телефона.'
      : 'При изменение номера потребуется подтверждение через SMS - код.'
)

const showEmailConfirmationNote = computed(
   () => !isConfirmed.value && !emailCodeInputVisible.value
)

const emailDescription = computed(() => {
   if (emailCodeInputVisible.value) {
      return 'Введите проверочный код, отправленный на указанную почту:'
   }

   if (!isConfirmed.value) {
      return 'Это необходимо для повышения безопасности вашего аккаунта и получения важных оповещений'
   }

   return 'При изменение почты потребуется подтверждение через код.'
})

onMounted(() => {
   syncProfileDraft()
   checkAndRestoreTimer()
})

watch(
   () => editMode.value.phone,
   (isEditing) => {
      if (isEditing) {
         phoneRaw.value = (profile.value.phone || '')
            .replace(/\D/g, '')
            .slice(1)
      }
   }
)

watch(formattedPhone, (v) => {
   if (editMode.value.phone) {
      profile.value.phone = v
      markAsChanged('phone')
   }
})

onActivated(() => {
   checkAndRestoreTimer()
})

onDeactivated(() => {
   resetTimer()
})

onBeforeUnmount(() => {
   resetTimer()
})

const handleBackspace = () => {
   const value = profile.value['phone']
   const lengthBefore = value.length

   if (['-', '('].includes(value[lengthBefore - 2])) {
      profile.value['phone'] = value.slice(0, lengthBefore - 1)
   }
}

const submitEmailCode = async () => {
   try {
      await confirmCode({ email: profile.value.email, code: emailCode.value })
      emailCodeInputVisible.value = false
      emailCode.value = ''
      clearStoredTimer()
      await userStore.fetchAndSetUserdata({ useCache: false })
      clearChangedField('email')
      syncProfileDraft()
   } catch (error) {
      console.error('Ошибка при подтверждении кода email', error)
   }
}

const submitCode = async () => {
   try {
      const formattedPhone = profile.value.phone.replace(/[^\d+]/g, '')

      await confirmCode({ phone: formattedPhone, code: code.value })
      codeInputVisible.value = false
      code.value = ''
      clearStoredTimer()
      await userStore.fetchAndSetUserdata({ useCache: false })
      clearChangedField('phone')
      syncProfileDraft()
   } catch (error) {
      console.error('Ошибка при подтверждении кода', error)
   }
}

const validationErrors = ref({
   username: '',
   email: '',
   phone: '',
   address: ''
})

const formattedDate = computed(() => {
   if (profile.value && profile.value.createdAt) {
      const date = new Date(profile.value.createdAt)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('ru-RU', options)
   }
   return ''
})

const markAsChanged = (field) => {
   if (profile.value[field] !== getOriginalFieldValue(field)) {
      changedFields.value[field] = profile.value[field]
   } else {
      clearChangedField(field)
   }

   validationErrors.value[field] = ''
}

const syncLocationChangedFields = () => {
   ;['address', 'latitude', 'longitude'].forEach((field) => {
      if (profile.value[field] !== getOriginalFieldValue(field)) {
         changedFields.value[field] = profile.value[field]
      } else {
         clearChangedField(field)
      }
   })

   validationErrors.value.address = ''
}

const handleAddressChange = (value) => {
   profile.value.address = String(value || '').trim()
   syncLocationChangedFields()
}

const handleLatitudeChange = (value) => {
   profile.value.latitude = value || null
   syncLocationChangedFields()
}

const handleLongitudeChange = (value) => {
   profile.value.longitude = value || null
   syncLocationChangedFields()
}

const toggleEditMode = (field) => {
   editMode.value[field] = !editMode.value[field]

   validationErrors.value[field] = ''

   if (editMode.value[field]) {
      resetVerificationState(field)
   }
}

const validateField = (field) => {
   let isValid = true
   let errorMessage = ''
   const hasLocationChanges = () =>
      ['address', 'latitude', 'longitude'].some((key) =>
         Object.prototype.hasOwnProperty.call(changedFields.value, key)
      )

   if (field === 'address' ? !hasLocationChanges() : !changedFields.value[field]) {
      validationErrors.value[field] = `Вы не изменили ${FIELD_LABELS[field] || 'значение'}.`
      return false
   }

   if (
      field === 'username' &&
      !validateUsername(profile.value.username)
   ) {
      isValid = false
      errorMessage =
         'Имя может содержать только латинские или только кириллические буквы, пробел и тире.'
   } else if (field === 'email' && !validateEmail(profile.value.email)) {
      isValid = false
      errorMessage = 'Пожалуйста, введите корректный email.'
   } else if (
      field === 'phone' &&
      (!profile.value.phone ||
         !validatePhoneNumber(profile.value.phone.replace(/[^\d+]/g, '')))
   ) {
      isValid = false
      errorMessage = 'Пожалуйста, введите корректный номер телефона.'
   }

   validationErrors.value[field] = errorMessage

   return isValid
}

const requestFieldConfirmation = async (field) => {
   const response = await userStore.updateProfile({
      [field]: profile.value[field]
   })

   if (!response.success) {
      validationErrors.value[field] = response.message || response
      return false
   }

   if (field === 'phone') {
      codeInputVisible.value = true
   } else if (field === 'email') {
      emailCodeInputVisible.value = true
   }

   clearChangedField(field)
   startTimer()
   return true
}

const saveField = async (field) => {
   if (field === 'email' && !isConfirmed.value && !editMode.value.email) {
      await requestFieldConfirmation(field)
      return
   }

   if (field === 'phone' && codeInputVisible.value && !editMode.value.phone) {
      await requestFieldConfirmation(field)
      return
   }

   if (field === 'email' && emailCodeInputVisible.value && !editMode.value.email) {
      await requestFieldConfirmation(field)
      return
   }

   if (!editMode.value[field]) return

   if (!validateField(field)) return

   if (field === 'phone' || field === 'email') {
      const isConfirmedRequestSent = await requestFieldConfirmation(field)
      if (!isConfirmedRequestSent) return
   } else {
      const response = await handleSubmit()

      if (!response.success) {
         validationErrors.value[field] = response.message || response
         return
      }

      syncProfileDraft()
   }

   editMode.value[field] = false
}

const cancelEdit = (field) => {
   if (field === 'address') {
      profile.value.address = getOriginalFieldValue('address')
      profile.value.latitude = getOriginalFieldValue('latitude')
      profile.value.longitude = getOriginalFieldValue('longitude')
      clearChangedField('address')
      clearChangedField('latitude')
      clearChangedField('longitude')
      editMode.value.address = false
      validationErrors.value.address = ''
      return
   }

   profile.value[field] = getOriginalFieldValue(field)
   clearChangedField(field)
   editMode.value[field] = false
   resetVerificationState(field)
   validationErrors.value[field] = ''
}

const handleSubmit = async () => {
   if (Object.keys(changedFields.value).length > 0) {
      const response = await userStore.updateProfile(changedFields.value)
      if (response.success) {
         changedFields.value = {}
      } else {
         console.warn(
            'Ошибка при обновлении профиля:',
            response.message || response
         )
      }
      return response
   }

   return {
      success: false,
      message: 'Нет изменений для сохранения'
   }
}

watch(
   () => [
      userStore.createdAt,
      userStore.username,
      userStore.email,
      userStore.unconfirmed_email,
      userStore.phoneNumber,
      userStore.uniqueCode,
      userStore.city_id,
      userStore.city_name,
      userStore.address,
      userStore.latitude,
      userStore.longitude
   ],
   () => {
      if (
         editMode.value.username ||
         editMode.value.email ||
         editMode.value.phone ||
         editMode.value.address ||
         codeInputVisible.value ||
         emailCodeInputVisible.value
      ) {
         return
      }

      syncProfileDraft()
   }
)
</script>

<style scoped lang="scss" src="./EditProfileAccount.scss"></style>
