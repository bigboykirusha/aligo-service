<template>
  <!-- Основной контейнер модального окна -->
  <div v-if="isLoginModalOpen" id="main-login-modal" class="modal"
    :class="{ 'authorization-page': isAuthorizationPage }" @click.self="closeModal" @keydown="handleTabKeydown">
    <!-- Анимация для модального контента -->
    <transition name="modal-fade">
      <div class="modal__content">
        <!-- Кнопка закрытия модального окна -->
        <button v-if="!isAuthorizationPage" class="modal__close-button" @click="closeModal" aria-label="Close"
          tabindex="0">
          <img :src="closeIcon" alt="close icon" />
        </button>

        <!-- Заголовок модального окна -->
        <div class="modal__header">
          <!-- Логотип и иконка в заголовке -->
          <div class="modal__header-image">
            <img src="../assets/icons/a-id.svg" alt="header image" />
          </div>
          <!-- Разделительная линия -->
          <div class="modal__header-bar"></div>
        </div>

        <!-- Форма входа -->
        <form class="modal__form" @submit.prevent="submitForm" @keydown.enter="handleEnter">
          <!-- Секция формы: ввод телефона или email -->
          <div class="modal__form-section">

            <!-- Поле ввода телефона или email -->
            <div v-show="!showCodeInput" class="input-wrapper">
              <p class="input-wrapper__title">
                {{ isAuthorizationPage ? `Эту страницу могут просматривать только авторизованные
                пользователи` : 'Введите номер телефона' }}
              </p>
              <p class="input-wrapper__description">
                {{ isAuthorizationPage
                  ? 'Введите номер телефона и мы отправим вам код по СМС для входа в аккаунт'
                  : 'Мы отправим вам проверочный код для входа в аккаунт'
                }}
              </p>
              <!-- Ввод телефона -->
              <input type="tel" :value="formattedPhone" @input="onPhoneInput" @paste="onPhonePaste"
                @keydown="onPhoneKeydown" class="phone-input" />
              <!-- Чекбокс "Вход через Telegram" -->
              <p v-if="contactInfoError && !showCodeInput" class="error-message">{{ contactInfoError }}</p>
              <label class="input-wrapper__telegram-checkbox">
                <CheckboxUI v-model="loginWithTelegram" size="16" tabindex="0" />
                <div class="input-wrapper__telegram-container">
                  <span>Отправить код в</span>
                  <img src="../assets/icons/tgshka.svg" alt="" />
                  <span class="checkbox-wrapper--tg">Telegram</span>
                </div>
              </label>
            </div>

            <!-- Поле ввода кода подтверждения -->
            <div class="input-wrapper" v-if="showCodeInput">
              <p class="input-wrapper__title">Введите код</p>
              <p class="input-wrapper__description">
                Мы отправили вам код для подтверждения на номер {{ formattedPhoneNumber }}
                <span @click.prevent="switchTab" class="input-wrapper__description--link">
                  <br /> Изменить номер
                </span>
              </p>

              <!-- Компонент ввода кода (VueOtpInput) -->
              <OTPInput v-model="code" :maxlength="4" inputmode="tel" autofocus autocomplete="one-time-code"
                @complete="requestCode" @input="resetSendCodeFlag">
                <template #default="{ slots }">
                  <div class="otp-container">
                    <div v-for="(slot, idx) in slots" :key="idx" v-bind="slot" class="otp-input" :class="{
                      'otp-input--active': slot.isActive,
                      'otp-input--filled': slot.char,
                      'otp-input--error': hasError
                    }" @click="focusSlot(idx)">
                      <span v-if="slot.char">{{ slot.char }}</span>
                      <span v-else-if="slot.isActive" class="otp-caret"></span>
                    </div>
                  </div>
                </template>
              </OTPInput>
              <!-- Таймер до получения нового кода -->
              <p class="timer-message" v-if="timeLeft > 0">
                Получить новый можно через {{ formattedTime }}
              </p>
              <button v-else @click.prevent="submitForm" class="modal__button modal__button--revers" tabindex="0">
                Получить новый код
              </button>
            </div>
          </div>

          <!-- Нижняя часть модального окна (кнопки и чекбоксы) -->
          <div v-if="!showCodeInput" class="modal__footer">
            <!-- Таймер до повторного входа -->
            <p class="timer-message" v-if="timeLeft > 0">
              Войти снова можно через {{ formattedTime }}
            </p>
            <!-- Кнопка "Отправить" -->
            <button v-show="!showCodeInput && !(timeLeft > 0)"
              :disabled="(isAuthorizationPage ? isContactInfoInvalid : isContactInfoRegInvalid) || isLoading"
              class="modal__button"
              :class="{ '--disabled': (isAuthorizationPage ? isContactInfoInvalid : isContactInfoRegInvalid) || isLoading }"
              tabindex="0">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Отправить</span>
            </button>
            <p v-if="isAuthorizationPage" class="agreement-text">
              Вы также соглашаетесь с <a class="agreement-link">правилами Aligo</a> и
              <a class="agreement-link">политикой обработки персональных
                данных</a>.
            </p>
            <!-- Чекбоксы согласия с правилами -->
            <div v-if="!showCodeInput && !isAuthorizationPage && !(timeLeft > 0)" class="checkbox-wrapper">
              <label>
                <CheckboxUI v-model="checkbox1" size="16" tabindex="0" />
                <span>Согласен с <a class="checkbox-wrapper--blue">правилами Aligo</a></span>
              </label>
              <label>
                <CheckboxUI v-model="checkbox2" size="16" tabindex="0" />
                <span>Принимаю <a class="checkbox-wrapper--blue">политику обработки персональных
                    данных</a></span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import closeIcon from '@/assets/icons/close.svg';
import { useRoute, useRouter } from 'vue-router';
import { loginUserByPhone, confirmPhoneCode, getSiteDocumentById } from '@/services/apiClient';
import { useUserStore } from '@/store/user';
import { OTPInput } from 'vue-input-otp'
import { useLoginModalStore } from '@/store/loginModal.js';

const loginModalStore = useLoginModalStore();
const route = useRoute();
const router = useRouter();
import { setCookie } from '@/services/auth';

const redirectPath = route.query.redirect || '/users/';

const isAuthorizationPage = computed(() => route.path.startsWith('/authorization'));

const isLoginModalOpen = computed(() => loginModalStore.isOpen);

const userStore = useUserStore();
const loginWithTelegram = ref(false);
const phoneNumber = ref('');
const code = ref('');
const showCodeInput = computed(() => loginModalStore.showCodeInput);
const isLoading = ref(false);
const hasError = ref(false)
const canResendCode = ref(true);
const documents = ref([]);

const phoneNumberRaw = ref('');

const formattedPhone = computed(() => {
  const numbers = phoneNumberRaw.value.replace(/\D/g, '').slice(0, 10);
  const parts = [];

  if (numbers.length > 0) parts.push('(' + numbers.slice(0, 3));
  if (numbers.length >= 3) parts[0] += ')';
  if (numbers.length > 3) parts.push(' ' + numbers.slice(3, 6));
  if (numbers.length > 6) parts.push('-' + numbers.slice(6, 8));
  if (numbers.length > 8) parts.push('-' + numbers.slice(8, 10));

  return '+7 ' + parts.join('');
});

const onPhoneInput = (e) => {
  let raw = e.target.value.replace(/\D/g, '');

  if (raw.startsWith('8') || raw.startsWith('7')) {
    raw = raw.slice(1);
  } else if (raw.startsWith('007')) {
    raw = raw.slice(3);
  }

  if (raw.length > 10) {
    raw = raw.slice(0, 10);
  }

  phoneNumberRaw.value = raw;
};

const onPhonePaste = (e) => {
  e.preventDefault();
  const clipboard = e.clipboardData.getData('text');
  let raw = clipboard.replace(/\D/g, '');

  if (raw.startsWith('8')) raw = raw.slice(1);
  else if (raw.startsWith('7')) raw = raw.slice(1);
  else if (raw.startsWith('007')) raw = raw.slice(3);

  phoneNumberRaw.value = raw.slice(0, 10);
};

const onPhoneKeydown = (e) => {
  const target = e.target;
  const selectionStart = target.selectionStart;

  if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart <= 3) {
    e.preventDefault();
    return;
  }

  const isDigit = /^[0-9]$/.test(e.key);
  if (isDigit && phoneNumberRaw.value.length >= 10 && target.selectionStart === target.selectionEnd) {
    e.preventDefault();
  }
};

let timer = null;
const timeLeft = ref(0);

const validatePhoneNumber = (phone) => /^\+79\d{9}$/.test(removePhoneFormatting(phone));
const removePhoneFormatting = (phone) => phone.replace(/[^\d+]/g, '');

const loadAgreementDocuments = async () => {
  const storageKey = 'siteDocuments';
  const storedData = localStorage.getItem(storageKey);
  const lastUpdated = localStorage.getItem(`${storageKey}_timestamp`);
  const oneDay = 24 * 60 * 60 * 1000;

  if (storedData && lastUpdated && Date.now() - lastUpdated < oneDay) {
    documents.value = JSON.parse(storedData);
    return;
  }

  try {
    const { data } = await getSiteDocumentById();
    if (data && Array.isArray(data)) {
      documents.value = data;
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(`${storageKey}_timestamp`, Date.now());
    } else {
      console.warn('Документы не найдены или в неправильном формате');
    }
  } catch (error) {
    console.error('Ошибка при загрузке документов:', error);
  }
};

const startTimer = () => {
  const firstTimeKey = 'firstTimeTimestamp';
  const firstTimeDuration = 24 * 60 * 60 * 1000;

  const firstTime = localStorage.getItem(firstTimeKey);
  const isFirstTime = !firstTime || Date.now() - firstTime > firstTimeDuration;

  if (isFirstTime) {
    localStorage.setItem(firstTimeKey, Date.now());
  }

  clearInterval(timer);

  const duration = isFirstTime ? 60 : 180;
  const endTime = Date.now() + duration * 1000;

  localStorage.setItem('timerEndTime', endTime);
  updateRemainingTime(endTime);

  timer = setInterval(() => {
    updateRemainingTime(endTime);
  }, 1000);
};

const checkAndRestoreTimer = () => {
  const endTime = parseInt(localStorage.getItem('timerEndTime'), 10);
  if (!endTime || endTime <= Date.now()) return;

  updateRemainingTime(endTime);
  timer = setInterval(() => updateRemainingTime(endTime), 1000);
};

const updateRemainingTime = (endTime) => {
  const remainingTime = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);

  timeLeft.value = remainingTime;

  if (remainingTime === 0) {
    clearInterval(timer);
    localStorage.removeItem('timerEndTime');
  }
};

const contactInfoError = ref('');
const generalError = ref('');

const phoneInput = ref(null);
const checkbox1 = ref(false);
const checkbox2 = ref(false);

const formattedPhoneNumber = computed(() => {
  let raw = formattedPhone.value.replace(/\D/g, '');

  if (raw.startsWith('8')) raw = '7' + raw.slice(1);
  if (!raw.startsWith('7')) raw = '7' + raw;
  if (raw.length < 11) return phoneNumber.value;

  const last4 = raw.slice(7, 11);

  return `+7 (***) ***-${last4.slice(0, 2)}-${last4.slice(2)}`;
});

function resetErrorOtp() {
  hasError.value = false
}

const resetSendCodeFlag = () => {
  canResendCode.value = true;
  resetErrorOtp();
}

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const isContactInfoInvalid = computed(() => {
  const isInvalid = !validatePhoneNumber(formattedPhone.value);
  return isInvalid;
});

const isContactInfoRegInvalid = computed(() => {
  return isContactInfoInvalid.value || (!checkbox1.value || !checkbox2.value);
});

const setFocusOnInput = () => {
  if (showCodeInput.value) {
    document.querySelector('.otp-input')?.focus();
  } else {
    phoneInput.value?.focus();
  }
};

const handleTabKeydown = (event) => {
  const focusableElements = Array.from(
    document.querySelectorAll(
      '#main-login-modal .modal__content button:not([disabled]), ' +
      '#main-login-modal .modal__content input:not([disabled]), ' +
      '#main-login-modal .modal__content select:not([disabled]), ' +
      '#main-login-modal .modal__content textarea:not([disabled]), ' +
      '#main-login-modal .modal__content a[href]:not([disabled]), ' +
      '#main-login-modal .modal__content [tabindex]:not([tabindex="-1"]):not([disabled])'
    )
  );

  const visibleElements = focusableElements.filter(el => el.offsetParent !== null);
  if (visibleElements.length === 0) return;

  const firstElement = visibleElements[0];
  const lastElement = visibleElements[visibleElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
};

const switchTab = () => {
  loginModalStore.hideCodeField();
  startTimer();
  setFocusOnInput();
};

const clearFormFields = () => {
  code.value = '';
  generalError.value = '';
};

const closeModal = () => {
  if (!isAuthorizationPage.value) {
    document.body.style.overflow = '';
    clearFormFields();
    loginModalStore.closeLoginModal();
  }
};

const sendPhoneRequest = async (withCode = false) => {
  if (isLoading.value || isContactInfoInvalid.value || !canResendCode.value) return;

  isLoading.value = true;
  contactInfoError.value = '';

  try {
    let cleanedPhone = removePhoneFormatting(phoneNumberRaw.value);

    if (!cleanedPhone.startsWith('+7')) {
      cleanedPhone = '+7' + cleanedPhone;
    }

    const requestData = { phone: cleanedPhone };

    if (loginWithTelegram.value) {
      requestData.is_send_code_telegram = 1;
    }

    if (withCode) {
      const response = await loginUserByPhone(requestData);
      if (response.success) {
        loginModalStore.showCodeField();
        startTimer();
      } else {
        contactInfoError.value = response.message || 'Ошибка при отправке кода.';
      }
    } else {
      const response = await confirmPhoneCode({ ...requestData, code: code.value });
      if (response.success) {
        handleSuccessfulLogin(response.data, cleanedPhone);
      } else {
        hasError.value = true;
        canResendCode.value = false;
        contactInfoError.value = response.data.message || 'Неверный код.';
      }
    }
  } catch (error) {
    contactInfoError.value = error.message;
    console.error('Ошибка при отправке запроса:', contactInfoError.value);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = () => sendPhoneRequest(true);
const requestCode = () => sendPhoneRequest(false);

const handleEnter = (event) => {
  if (isLoading.value || (isAuthorizationPage.value ? isContactInfoInvalid.value : isContactInfoRegInvalid.value)) {
    event.preventDefault();
  }
};

const focusSlot = (index) => document.querySelectorAll('.otp-input')?.[index]?.focus();

const handleSuccessfulLogin = (data, cleanedPhone) => {
  const { token, user_id } = data;
  setCookie(
    'userData',
    JSON.stringify({
      token,
      user_id,
      phoneNumber: cleanedPhone,
    }),
    7
  );
  clearFormFields();
  userStore.isLoggedIn = true;
  userStore.fetchAndSetUserdata();
  router.push(redirectPath);
  clearFormFields();
};

onMounted(() => {
  checkAndRestoreTimer();
  loadAgreementDocuments();
});
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  z-index: 1222;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  &__content {
    background: #fff;
    border-radius: 8px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    animation: slide-up 0.3s ease-out;
    transition: height 0.3s ease-out;
  }

  &__close-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.1s ease-in-out, scale 0.2s ease-in-out;
    top: 0px;
    padding: 8px;
    right: 0px;
    z-index: 15;
    border-radius: 0 0 0 8px;
    background: none;
    border: none;
    cursor: pointer;

    &:focus-within {
      background-color: #D6EFFF;
      outline: none;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    flex-direction: column;

    &-image {
      width: auto;
      display: flex;
      gap: 8px;
      max-height: 200px;
      padding: 32px 40px;
      margin-right: auto;

      img {
        width: 100%;
        min-height: 32px;
      }
    }

    &-bar {
      width: 100%;
      height: 2px;
      background-color: #eeeeee;
    }

    &-switcher {
      display: flex;
      position: relative;
      justify-content: space-between;
      width: calc(100% - 84px);
      border: 1px solid #d6d6d6;
      padding: 4px;
      border-radius: 4px;
      margin-top: 24px;

      .switcher {
        position: absolute;
        bottom: 2;
        left: 2;
        width: calc(50% - 4px);
        border-radius: 4px;
        height: 27px;
        background-color: #3366FF;
        transition: transform 0.2s ease;
        z-index: 0;
      }

      button {
        padding: 4px 6px;
        z-index: 111;
        background-color: transparent;
        width: 50%;
        cursor: pointer;
        font-size: 14px;
        border: none;

        @media (max-width: 480px) {
          font-size: 12px;
          height: 27px;
        }

        &.active {
          color: #fff;
        }
      }
    }
  }

  &__form {
    width: 100%;
    padding: 24px 0;
    padding-bottom: 0;
    display: flex;
    position: relative;
    flex-direction: column;

    &-section {
      padding: 0;

      .input-wrapper {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        padding: 0 40px;
        font-size: 12px;

        label {
          margin-bottom: 5px;
          font-size: 12px;
          color: #323232;
        }

        &__title {
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 700;
          color: #323232;
        }

        &__description {
          font-size: 14px;
          line-height: 18px;
          color: #323232;
          margin-bottom: 24px;
          margin-top: 0;

          &--link {
            color: #3366ff;
            cursor: pointer;
            margin-top: 8px;
            font-size: 14px;
            line-height: 18px;
          }
        }

        input {
          border: 1px solid #d6d6d6;
          border-radius: 4px;
          height: 34px;
          line-height: 18px;
          width: 100%;
          font-size: 14px;
          padding: 0 12px;
          box-sizing: border-box;

          &:focus {
            outline: 1px solid #3366FF;
          }
        }

        &__telegram-container {
          display: flex;
          gap: 6px;
        }

        &__telegram-checkbox {
          display: flex;
          align-items: center;
          margin-top: 8px;
          gap: 6px;

          input {
            height: 14px;
            width: 14px;
          }

          span {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 18px;
            color: #323232;

            img {
              margin-left: 8px;
              margin-right: 4px;
            }
          }
        }

        .forgot-password-link {
          display: inline-block;
          text-decoration: none;
          font-size: 14px;
          color: #3366ff;
          margin-top: 6px;
          margin-bottom: 0;
          margin-left: auto;
        }
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding: 0 42px;
    padding-bottom: 24px;
  }
}

.authorization-page {
  position: static;
  z-index: 0;
  background: none;
  backdrop-filter: none;
  height: auto;
  padding: 0;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: calc(100vh - 70px);
    min-height: calc(100dvh - 70px);
  }

  .modal__header-image {
    padding: 32px 0;
  }

  .modal__content {
    background: #fff;
    border-radius: 0;
    width: 100%;
    max-width: 300px;
    box-shadow: none;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }

  .input-wrapper {
    padding: 0;
  }

  .modal__footer {
    border-top: 1px solid #D6D6D6;
    padding: 0;
    padding-bottom: 24px;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.timer-message {
  margin-top: 24px;
  color: #787878;
  font-size: 14px;
  text-align: center;
}

.modal__button {
  width: 100%;
  height: 38px;
  margin-top: 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: #3366ff;
  color: #fff;

  &:focus {
    outline: 2px solid #D6EFFF;
  }

  &--revers {
    background-color: #fff;
    color: #3366ff;
    height: auto;
  }

  &--change {
    padding-top: 24px;
    border-top: 1px solid #EEEEEE;
  }

  &.--disabled {
    background-color: #EEEEEE;
    color: #A8A8A8;
  }
}

.checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    display: flex;
    gap: 6px;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1;
  }

  span {
    font-size: 14px;
    line-height: 18px;
    color: #323232;
  }

  &--blue {
    color: #3366FF;
  }
}

.checkbox-wrapper--tg {
  color: #31A8DF !important;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(1px);
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3366FF;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.input-error {
  outline: 1px solid red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.otp-container {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}

.otp-input {
  width: 52px;
  height: 62px;
  color: #323232;
  font-size: 32px;
  border: 1px solid #D6D6D6;
  border-radius: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 0.3s ease;
  position: relative;
  cursor: text;
  user-select: none;
}

.otp-input:hover {
  border-color: #A6A6A6;
}

.otp-input--active {
  border-color: #3366FF;
  box-shadow: 0 0 12px rgba(51, 102, 255, 0.4);
}

.otp-input--filled {
  border-color: #3366FF;
}

.otp-input--error {
  border-color: #FF5959;
}

.otp-caret {
  width: 2px;
  height: 40%;
  background-color: #3366FF;
  animation: blink 1s step-end infinite;
}

.agreement-text {
  font-size: 12px;
  color: #787878;
  line-height: 16px;
  text-align: center;
}

.agreement-link {
  text-decoration: underline;
  color: #787878;
}

.main-page-button {
  display: inline-block;
  background-color: #fff;
  color: #3366FF;
  padding: 12px 24px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  box-shadow: none;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
