import { defineStore } from 'pinia';

export const useTabsStore = defineStore('tabs', {
   state: () => ({
      activeTab: 1,
      tabs: [
         { index: 1, label: 'Характеристики' },
         { index: 2, label: 'Опции' },
         { index: 3, label: 'Объявление' },
      ],
   }),

   actions: {
      setActiveTab(index) {
         this.activeTab = index;
      },
      updateTabs(newTabs) {
         this.tabs = newTabs;
      },
      resetTabs() {
         this.activeTab = 1;
      },
   },

   getters: {
      activeTabIndex: (state) => state.activeTab,
   },
});
