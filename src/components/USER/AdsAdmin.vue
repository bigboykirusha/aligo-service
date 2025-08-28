<template>
   <div class="ads-admin">
      <div class="ads-admin__main">

         <div class="ads-admin__header">
            <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Все" />
         </div>

         <!-- Скелетоны -->
         <template v-if="loading">
            <MyPublicationsCardSkeleton v-for="i in 3" :key="i" />
         </template>

         <!-- Карточки -->
         <template v-else-if="ads.length">
            <MyPublicationsCard v-for="ad in ads" :key="ad.id" :id="ad.id" :images="ad.photos"
               :description="ad.ads_parameter.ads_description" :price="ad.ads_parameter.amount || 'Цена не указана'"
               :place="ad.ads_parameter.place_inspection" :brand="ad.auto_technical_specifications[0]?.brand?.title"
               :model="ad.auto_technical_specifications[0]?.model?.title"
               :year="ad.auto_technical_specifications[0]?.year_release?.title" :is_published="ad.is_published"
               :count_go_ad_page="ad.statistic_view.count_go_ad_page"
               :count_add_to_favorite="ad.statistic_view.count_add_to_favorite"
               :count_who_view_seller_contact="ad.statistic_view.count_who_view_seller_contact" :main_id="ad.main_id"
               :created_at="ad.created_at" />
         </template>

         <template v-else>
            <PlaceholderUI :image="adPlaceholderIcon" title="Объявлений пока нет"
               description="Здесь будут отображаться все объявления пользователя." />
         </template>
      </div>
   </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import PlaceholderUI from '@/components/UI/PlaceholderUI.vue';
import AdsDropdown from '@/components/AdsDropdown.vue';
import MyPublicationsCard from '@/components/USER/MyPublicationsCard.vue';
import MyPublicationsCardSkeleton from '@/components/USER/MyPublicationsCardSkeleton.vue';
import adPlaceholderIcon from '@/assets/icons/ad-sad.svg';

defineProps({
   userId: {
      type: String,
      required: true,
   },
});

const ads = ref([]);
const loading = ref(false);

const sortOptions = [
   { label: 'Все', value: 'desc' },
   { label: 'Опубликованные', value: 'asc' },
   { label: 'На модерации', value: 'asc' },
   { label: 'Снятые с публикации', value: 'asc' },
   { label: 'Архивированные', value: 'asc' },
];

</script>

<style scoped lang="scss">
.ads-admin {
   width: 100%;
   height: 100%;

   &__header {
      display: flex;
      gap: 16px;
   }

   &__main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      width: 100%;
      overflow-y: auto;
   }
}
</style>