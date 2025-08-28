<template>
  <div class="popup__content">
    <ClosureSvg class="popup__svg-closure" @click="$emit('closing')" />
    <!-- <div class="popup__icon">
      <img src="@/assets/AligoID.png" alt="Menu" />
    </div> -->

    <h2 class="popup__title small-title medium-text">Введите код</h2>
    <p class="popup__paragraph medium-text">
      Вы собираетесь изменить настройки городов и регионов. Для подтверждения
      данного действия на номер {{ maskedPhoneNumber }} отправлен проверочный
      код.
    </p>
    <AutosTextTemplate
      v-model="code"
      placeholder="введите код"
      @update:option="(value) => handleFieldUpdate(value)"
    />
    <p class="popup__paragraph medium-text" v-if="countdownText">
      {{ countdownText }}
    </p>

    <div class="menu__btn-box" v-if="code || !countdownText">
      <ButtonUI
        v-if="!countdownText"
        text="Получить новый код"
        @action="getCode"
      />
      <ButtonUI text="Отправить" @action="sendCode" />
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  computed,
} from 'vue';
import AutosTextTemplate from '@/components/UI/AutosTextTemplate';
import ClosureSvg from '@/assets/icons/close-gray';
import ButtonUI from '@/components/UI/ButtonUI';
import { popupCodeStore } from '@/store/popupCode.js';

defineProps({
  id: String,
  data: Object,
});
defineEmits(['closing']);

const popUpCode = popupCodeStore();
const code = ref('');
const countdownText = ref('Получить новый можно через 2:00');
const phoneNumber = ref('+7-999 999 18-18');

let intervalId = null;
const maskedPhoneNumber = computed(() => {
  const digits = phoneNumber.value.replace(/\D/g, '');

  if (digits.length >= 4) {
    const lastFourDigits = digits.slice(-4);
    return `***** ${lastFourDigits.slice(0, 2)}-${lastFourDigits.slice(2)}`;
  }
  return digits;
});

const handleFieldUpdate = (value) => {
  code.value = value;
};
const startCountdown = (seconds = 20) => {
  let remaining = seconds;

  updateText(remaining);

  intervalId = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(intervalId);
      countdownText.value = '';
      return;
    }
    updateText(remaining);
  }, 1000);
};
const getCode = () => {
  popUpCode.receiveCode();
};
const sendCode = () => {
  console.log('отправить кода', code.value);
};
const updateText = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedSecs = secs < 10 ? `0${secs}` : secs;
  countdownText.value = `Получить новый можно через ${mins}:${paddedSecs}`;
};
onMounted(() => {
  startCountdown(120);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
<style scoped lang="scss">
.popup {
  &__content {
    justify-content: space-between;
  }
  &__icon {
    width: 152px;
    height: 32px;
    border: 1px solid var(--color-block);
    margin-bottom: 32px;
  }
  &__title {
    color: var(--text-main);
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  &__paragraph {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 16px;
  }
}
.simple-input {
  margin-bottom: 16px;
}
</style>
