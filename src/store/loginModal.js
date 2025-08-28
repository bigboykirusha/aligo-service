import { defineStore } from 'pinia';

export const useLoginModalStore = defineStore('loginModal', {
   state: () => ({
      isOpen: false,
      showCodeInput: false,
   }),
   actions: {
      toggleLoginModal() {
         this.isOpen = !this.isOpen;
      },
      openLoginModal() {
         this.isOpen = true;
      },
      closeLoginModal() {
         this.isOpen = false;
      },
      showCodeField() {
         this.showCodeInput = true;
      },
      hideCodeField() {
         this.showCodeInput = false;
      },
   },
});