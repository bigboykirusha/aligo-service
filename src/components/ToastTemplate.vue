<template>
  <transition name="popup-fade">
    <div
      v-if="popupErrorStore.isVisible"
      class="popup"
      :class="popupErrorStore.type"
    >
      <div class="popup__content">
        <p class="popup__text">{{ popupErrorStore.message }}</p>
        <img
          @click.prevent="popupErrorStore.hidePopup"
          class="popup__close-btn"
          src="../assets/icons/close-white.svg"
          alt="Close"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch } from 'vue';
import { usePopupErrorStore } from '@/store/popupErrorStore';

const popupErrorStore = usePopupErrorStore();

watch(
  () => popupErrorStore.isVisible,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        popupErrorStore.hidePopup();
      }, 6000);
    }
  }
);
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  right: 24px;
  bottom: 24px;
  // width: 420px;
  color: var(--white);
  z-index: 999999;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px;
    gap: 16px;
    padding: 16px 24px;
  }

  &.error .popup__content {
    background: linear-gradient(135deg, #ff6a6a, #ff2e2e);
  }

  &.warning .popup__content {
    background: linear-gradient(135deg, #ffa500, #ff7b00);
  }

  &.info .popup__content {
    background: linear-gradient(135deg, #3366ff, #0033cc);
  }

  &__close-btn {
    cursor: pointer;
    height: 16px;
    width: 16px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  &__close-btn:hover {
    opacity: 1;
  }

  &__text {
    font-size: 14px;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    left: 16px;
    right: 16px;
    width: calc(100% - 32px);
    bottom: 86px;
  }
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}
</style>
