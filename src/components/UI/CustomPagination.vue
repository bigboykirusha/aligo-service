<template>
  <div v-if="totalPages > 1" class="ui-pagination">
    <!-- Кнопка "Назад" -->
    <button
      v-if="!isInFirstPage"
      class="ui-pagination__link"
      @click="gotoPrevious"
    >
      <ArrowSvg class="ui-pagination__arrow-prev" />
    </button>

    <!-- Первая страница -->
    <button
      class="ui-pagination__link"
      :class="{ active: currentPage === 1 }"
      @click="gotoPageNumber(1)"
    >
      1
    </button>

    <!-- Страница перед текущей -->
    <button
      v-if="currentPage > 2"
      class="ui-pagination__link"
      @click="gotoPageNumber(currentPage - 1)"
    >
      {{ currentPage - 1 }}
    </button>

    <!-- Текущая страница (не показываем, если она уже будет как последняя) -->
    <button
      v-if="currentPage !== 1 && currentPage !== totalPages"
      class="ui-pagination__link active"
    >
      {{ currentPage }}
    </button>

    <!-- Страница после текущей -->
    <button
      v-if="currentPage + 1 < totalPages"
      class="ui-pagination__link"
      @click="gotoPageNumber(currentPage + 1)"
    >
      {{ currentPage + 1 }}
    </button>

    <!-- Многоточие, если есть пропущенные страницы -->
    <span v-if="currentPage + 2 < totalPages - 1" class="ui-pagination__dots">
      ...
    </span>

    <!-- Пропуск на 10 страниц вперёд -->
    <button
      v-if="currentPage + 10 < totalPages"
      class="ui-pagination__link"
      @click="gotoPageNumber(currentPage + 10)"
    >
      {{ currentPage + 10 }}
    </button>

    <!-- Последняя страница -->
    <button
      v-if="totalPages > 1"
      class="ui-pagination__link"
      :class="{ active: currentPage === totalPages }"
      @click="gotoPageNumber(totalPages)"
    ></button>

    <!-- Кнопка "Вперёд" -->
    <button v-if="!isInLastPage" class="ui-pagination__link" @click="gotoNext">
      <ArrowSvg class="ui-pagination__arrow-next" />
    </button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import ArrowSvg from '@/assets/icons/arrow-svg.vue';

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 60 },
});

const emit = defineEmits(['update:current-page', 'change']);

const isInFirstPage = computed(() => props.currentPage === 1);
const isInLastPage = computed(() => props.currentPage === props.totalPages);

const gotoPrevious = () => gotoPageNumber(props.currentPage - 1);
const gotoNext = () => gotoPageNumber(props.currentPage + 1);

const gotoPageNumber = (pageNumber) => {
  emit('update:current-page', pageNumber);
  emit('change', pageNumber);
};
</script>
