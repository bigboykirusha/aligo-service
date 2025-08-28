<template>
   <div class="review-list">
      <!-- Заголовок -->
      <div class="review-list__header">
         <AdsDropdown :options="sortOptions" @updateSort="handleSortUpdate" placeholder="Все" />
         <CustomSerch v-model="searchQuery" placeholder="Поиск по отзывам..." @clickIcon="serchAction" />
      </div>

      <!-- Скелетоны -->
      <template v-if="loading">
         <ReviewCardSkeleton v-for="i in 3" :key="i" />
      </template>

      <!-- Карточки -->
      <template v-else-if="reviews.length">
         <div class="review-list__cards">
            <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
         </div>
      </template>

      <!-- Плейсхолдер -->
      <template v-else>
         <PlaceholderUI :image="reviewsPlaceholderIcon" title="Комментариев пока нет"
            description="Здесь будут отображаться все комментарии пользователя." />
      </template>
   </div>
</template>

<script setup>
import { ref } from 'vue';
import AdsDropdown from '@/components/AdsDropdown.vue';
import ReviewCard from '@/components/USER/ReviewCard.vue';
import ReviewCardSkeleton from '@/components/USER/ReviewCard.vue';
import PlaceholderUI from '@/components/UI/PlaceholderUI.vue';
import CustomSerch from '@/components/UI/CustomSerch.vue';

import reviewsPlaceholderIcon from '@/assets/icons/reviews-sad.svg';

const reviews = ref([]);
const loading = ref(false);

const searchQuery = ref('')

const sortOptions = [
   { label: 'Все', value: 'desc' },
   { label: 'О пользователе', value: 'desc' },
   { label: 'Оставленные пользователем', value: 'asc' },
];

const handleSortUpdate = (order_by) => {
   console.log(order_by);
};
</script>

<style scoped lang="scss">
.review-list {
   display: flex;
   flex-direction: column;
   gap: 24px;

   &__header {
      display: flex;
      gap: 16px;
   }

   &__cards {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 16px;
   }
}
</style>
