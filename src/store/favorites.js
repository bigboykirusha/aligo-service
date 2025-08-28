import { defineStore } from 'pinia';
import { addFavorites, getFavorites } from '../services/apiClient';
import { useUserStore } from '../store/user';

export const useFavoritesStore = defineStore('favorites', {
   state: () => ({
      items: [],
      countFavorites: 0,
   }),
   actions: {
      async fetchFavorites() {
         const userStore = useUserStore();
         if (!userStore.isLoggedIn) {
            console.warn('Пользователь не авторизован. Запрос избранных не выполнен.');
            return; 
         }
         try {
            const response = await getFavorites();
            this.items = response.map(item => item.ads_show.id);
            this.countFavorites = this.items.length;
         } catch (error) {
            console.error('Ошибка при получении избранных: ', error);
         }
      },
      async toggleFavorite(itemId) {
         const userStore = useUserStore();
         if (!userStore.isLoggedIn) {
            console.warn('Пользователь не авторизован. Запрос на изменение избранного не выполнен.');
            return; 
         }
         try {
            const isFavorite = this.items.includes(itemId);
            if (isFavorite) {
               await addFavorites({ ads_id: itemId, main_category_id: 1 });
               this.items = this.items.filter(id => id !== itemId);
            } else {
               await addFavorites({ ads_id: itemId, main_category_id: 1 });
               this.items.push(itemId);
            }
         } catch (error) {
            console.error('Ошибка при изменении избранного: ', error);
         } finally {
            this.countFavorites = this.items.length;
         }
      },
   },
});
