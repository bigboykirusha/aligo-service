import { defineStore } from 'pinia';
// import { apiClient } from '../services/apiClient.js';

export const popupCodeStore = defineStore('popupCodeStore', {
  state: () => ({
    isVisible: false,
    saveMassage: null,
    message: '',
    type: '',
    isCodeValid: false,
  }),
  actions: {
    showError(message) {
      this.message = message;
      this.type = 'error';
      this.isVisible = true;
    },
    async sendCode(value) {
      if (/^\d{4}$/.test(value)) {
        console.log('Код корректен.');
        //       const response = await getCarById(route.params.id);
        // if (response.status) {
        //   this.isCodeValid = true;
        //   setTimeout(() => {
        //     this.isCodeValid = false;
        //   }, 15000);
        // }
      } else {
        console.log(
          'Код некорректен. Убедитесь, что значение состоит из 4 цифр.'
        );
      }
    },
    async receiveCode() {
      console.log('обновить код');
      //       const response = await getCarById(route.params.id);
    },
    needCode() {
      this.isVisible = true;
      //       const response = await getCarById(route.params.id);
    },

    closePopUp() {
      this.isVisible = false;
    },
  },
  getters: {
    getisCodeValid: (state) => state.isCodeValid,
    getSaveMassage: (state) => state.saveMassage,
    getisVisible: (state) => state.isVisible,
  },
});
