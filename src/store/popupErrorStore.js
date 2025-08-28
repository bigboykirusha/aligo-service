import { defineStore } from 'pinia';

export const usePopupErrorStore = defineStore('popupErrorStore', {
  state: () => ({
    isVisible: false,
    message: '',
    type: '',
  }),
  actions: {
    showError(message) {
      this.message = message;
      this.type = 'error';
      this.isVisible = true;
    },
    showWarning(message = 'Ваш запрос обрабатывается, подождите немного') {
      this.message = message;
      this.type = 'warning';
      this.isVisible = true;
    },
    showNotification(message) {
      this.message = message;
      this.type = 'notification';
      this.isVisible = true;
    },
    hidePopup() {
      this.isVisible = false;
      this.message = '';
      this.type = '';
    },
  },
});
