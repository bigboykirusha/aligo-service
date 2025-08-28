<template>
   <div class="favorites-admin">
      <div class="favorites-admin__main">
         <!-- Скелетоны -->
         <template v-if="loading">
            <FavoritesCardSkeleton v-for="index in 4" :key="index" />
         </template>

         <!-- Карточки -->
         <template v-else-if="favorites.length">
            <FavoritesCard v-for="ad in favorites" :key="ad.id" :id="ad.id"
               :description="ad.ads_parameter.ads_description" :price="ad.ads_parameter.amount"
               :place="ad.ads_parameter.place_inspection || 'Не указано'" :callNumber="ad.ads_parameter.phone"
               :messageEmail="ad.ads_parameter.email" :brand="ad.auto_technical_specifications[0].brand.title"
               :model="ad.auto_technical_specifications[0].model.title"
               :year="ad.auto_technical_specifications[0].year_release.title"
               :username="ad.ads_parameter?.username || ad.ads_parameter?.login || 'Имя не указано'"
               :is_in_favorites="ad.is_in_favorites" :images="ad.photos" :created_at="ad.created_at" isAdmin />
         </template>

         <!-- Плейсхолдер -->
         <template v-else>
            <PlaceholderUI :image="favoritesPlaceholderIcon" title="Избранных пока нет"
               description="Здесь будут отображаться все избранные пользователя." />
         </template>

      </div>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import PlaceholderUI from '@/components/UI/PlaceholderUI.vue';
import FavoritesCard from '@/components/USER/FavoritesCard.vue';
import FavoritesCardSkeleton from '@/components/USER/FavoritesCardSkeleton.vue';

import favoritesPlaceholderIcon from '@/assets/icons/favorites-t.svg';

const favorites = ref([]);
const loading = ref(false);
</script>

<style scoped lang="scss">
.favorites-admin {
   width: 100%;
   height: 100%;

   &__main {
      display: grid;
      height: 100%;
      grid-template-columns: 1fr;
      gap: 24px;
      width: 100%;
      overflow-y: auto;
   }
}
</style>