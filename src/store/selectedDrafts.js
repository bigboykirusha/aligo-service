import { defineStore } from 'pinia';
import { deleteAds } from '../services/apiClient.js';

export const useSelectedDraftsStore = defineStore('selectedDrafts', {
   state: () => ({
      selectedAdIds: [],
   }),
   actions: {
      toggleAd(id) {
         const index = this.selectedAdIds.indexOf(id);
         if (index > -1) {
            this.selectedAdIds.splice(index, 1);
         } else {
            this.selectedAdIds.push(id);
         }
      },
      selectAll(ids) {
         this.selectedAdIds = ids;
      },
      deselectAll() {
         this.selectedAdIds = [];
      },
      async deleteAds(ids) {
         try {
            await deleteAds(
               ids.map(id => ({
                  ads_id: id,
                  main_category_id: 1
               }))
            );
            this.deselectAll();
         } catch (error) {
            console.error('Ошибка удаления:', error);
         }
      },
   },
});