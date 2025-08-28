<template>
  <div class="table-pagination" v-if="totalPages > 1">
    <div class="ui-pagination">
      <!-- Кнопка "Назад" -->
      <button
        v-if="!isInFirstPage"
        class="ui-pagination__link"
        @click="gotoPrevious"
      >
        <ArrowSvg class="ui-pagination__arrow-prev" />
      </button>

      <button
        class="ui-pagination__link"
        :class="{ active: currentPage === 1 }"
        @click="gotoPageNumber(1)"
      >
        1
      </button>

      <button
        v-if="currentPage > 2"
        class="ui-pagination__link"
        @click="gotoPageNumber(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </button>

      <button
        v-if="currentPage !== 1 && currentPage !== totalPages"
        class="ui-pagination__link active"
      >
        {{ currentPage }}
      </button>

      <button
        v-if="currentPage + 1 < totalPages"
        class="ui-pagination__link"
        @click="gotoPageNumber(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </button>

      <span v-if="currentPage + 2 < totalPages - 1" class="ui-pagination__dots">
        ...
      </span>

      <button
        v-if="currentPage + 10 < totalPages"
        class="ui-pagination__link"
        @click="gotoPageNumber(currentPage + 10)"
      >
        {{ currentPage + 10 }}
      </button>

      <button
        v-if="totalPages > 1"
        class="ui-pagination__link"
        :class="{ active: currentPage === totalPages }"
        @click="gotoPageNumber(totalPages)"
      >
        {{ totalPages }}
      </button>

      <!-- Кнопка "Вперед" -->
      <button
        v-if="!isInLastPage"
        class="ui-pagination__link"
        @click="gotoNext"
      >
        <ArrowSvg class="ui-pagination__arrow-next" />
      </button>
    </div>

    <div class="table-pagination__text" v-if="allOption">
      <p>Всего {{ total }} строк по</p>
      <AdsDropdown
        :options="options"
        :defaultValue="perPage"
        @updateSort="handlePageSizeChange"
      />
      <p>На странице.</p>
      Перейти на стр.
      <div>
        <AutosTextTemplate
          @update:option="(value) => gotoPageNumber(value)"
          validationType="number"
          :placeholder="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import ArrowSvg from '@/assets/icons/arrow-svg.vue';
import AdsDropdown from '@/components/AdsDropdown';
import AutosTextTemplate from '@/components/UI/AutosTextTemplate.vue';

const props = defineProps({
  allOption: { type: Boolean, default: false },
  total: { type: Number },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 60 },
  perPage: { type: [Number, String], default: 20 },
});

const emit = defineEmits(['change', 'changePerPage']);

const defaultOptions = [
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

const options = computed(() => {
  const existingOptions = defaultOptions.map((option) => option.value);
  if (!existingOptions.includes(props.perPage)) {
    return [
      { label: String(props.perPage), value: props.perPage },
      ...defaultOptions,
    ];
  }
  return defaultOptions;
});

const isInFirstPage = computed(() => props.currentPage === 1);
const isInLastPage = computed(() => props.currentPage === props.totalPages);

const gotoPrevious = () => gotoPageNumber(props.currentPage - 1);
const gotoNext = () => gotoPageNumber(props.currentPage + 1);

const gotoPageNumber = (pageNumber) => {
  if (pageNumber < 1) {
    emit('change', 1);
  } else if (pageNumber > props.totalPages) {
    emit('change', props.totalPages);
  } else {
    emit('change', pageNumber);
  }
};

const handlePageSizeChange = (val) => {
  const newSize = Number(val);
  emit('changePerPage', newSize);
  emit('change', 1);
};
</script>
