import { defineStore } from 'pinia';
import { setCookie } from '../services/auth';
import { getCityesWhithDec } from '@/services/apiClient.js';

export const useCityStore = defineStore('city', {
  state: () => ({
    selectOption: null,
    selectedCity: { name: 'Москва', code: 365 },
  }),
  actions: {
    setSelectedCity(city) {
      if (!city || !city.name || !city.id) {
        console.error('Некорректные данные города:', city);
        return;
      }

      this.selectedCity = { name: city.name, id: city.id };
      setCookie('selectedCity', JSON.stringify(this.selectedCity), 7);
    },
    async getСities(id) {
      const response = await getCityesWhithDec(id);
      this.selectOption = response;
    },
  },
  getters: {
    getSelectOption: (state) => state.selectOption,
  },
});
