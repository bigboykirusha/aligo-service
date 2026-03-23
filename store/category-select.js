import { defineStore } from 'pinia';

export const useCategorySelectStore = defineStore('categorySelect', {
  state: () => ({
    selectedCategories: [],
    history: [],
  }),
  actions: {
    addSelectedCategory(category) {
      this.selectedCategories.push(category);
    },
    clearSelectedCategories() {
      this.selectedCategories = [];
    },
    goBack() {
      this.selectedCategories.pop();
    },
    setHistory(history) {
      this.history = history;
    },
    clearHistory() {
      this.history = [];
    }
  },
});
