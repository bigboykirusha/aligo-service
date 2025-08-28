<template>
  <div class="popup__overlay" @click="closePopup">
    <div class="popup__content" @click.stop>
      <button class="popup__close-button" @click="closePopup">
        <img :src="closeIcon" alt="Close icon" />
      </button>
      <p class="popup__text">{{ message }}</p>
      <div class="popup__buttons">
        <button class="popup__button" @click="confirmAction">
          {{ confirmText }}
        </button>
        <button
          class="popup__button popup__button--cancel"
          @click="cancelAction"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  message: {
    type: String,
    required: true,
    default: 'Вы уверены?',
  },
  confirmText: {
    type: String,
    required: true,
    default: 'Да',
  },
  cancelText: {
    type: String,
    required: true,
    default: 'Нет',
  },
  closeIcon: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const closePopup = () => {
  emit('close');
};

const confirmAction = () => {
  emit('confirm');
};

const cancelAction = () => {
  emit('cancel');
};
</script>

<style lang="scss" scoped>
.popup__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 30000;
  animation: fade-in 0.2s ease-out;
}

.popup__content {
  background: var(--white);
  border-radius: 8px;
  padding: 32px;
  position: relative;
  max-width: 370px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slide-up 0.2s ease-out;
}

.popup__close-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: background-color 0.2s ease;

  img {
    height: 16px;
  }
}

.popup__text {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 24px;
}

.popup__buttons {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.popup__button {
  padding: 8px 16px;
  border: none;
  width: 100%;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease-in;
  color: var(--white);
  background-color: var(--primary);
}

.popup__button:hover {
  background-color: #274bcc;
}

.popup__button--cancel {
  background-color: #d6efff !important;
  color: var(--primary);
  transition: all 0.2s ease-in;
}

.popup__button--cancel:hover {
  background-color: #a4dcff !important;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slide-up {
  0% {
    transform: translateY(50px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
