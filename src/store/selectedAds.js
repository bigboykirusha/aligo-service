import { defineStore } from 'pinia';
import { deleteAds, takeOffPublication, publishAgainSelected } from '../services/apiClient.js';

export const useSelectedAdsStore = defineStore('selectedAds', {
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
      async takeOffPublication(ids) {
         try {
            await takeOffPublication(
               ids.map(id => ({
                  ads_id: id,
                  main_category_id: 1
               }))
            );
            this.deselectAll();
         } catch (error) {
            console.error('Ошибка снятия с публикации:', error);
         }
      },
      async republish(ids) {
         try {
            await publishAgainSelected(
               ids.map(id => ({
                  ads_id: id,
                  main_category_id: 1
               }))
            );
            this.deselectAll();
         } catch (error) {
            console.error('Ошибка снятия с публикации:', error);
         }
      },
   },

});