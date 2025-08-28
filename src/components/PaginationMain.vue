<!-- <template>
  <div class="pagination">
    <button
      :disabled="currentPage <= 1"
      @click="emitChangePage(currentPage - 1)"
      class="pagination-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="emitChangePage(page)"
      class="pagination-button"
    >
      {{ page }}
    </button>
    <button
      :disabled="currentPage >= totalPages"
      @click="emitChangePage(currentPage + 1)"
      class="pagination-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { computed } from 'vue';

const props = defineProps({
  totalItems: Number,
  pageSize: Number,
  currentPage: Number,
});

const emit = defineEmits(['changePage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize));

const emitChangePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  emit('changePage', page);
};
</script>

<style lang="scss" scoped>
.pagination {
  margin: 24px 0;
  margin-bottom: 72px;
  display: flex;
  justify-content: center;

  .pagination-button {
    width: 34px;
    height: 34px;
    font-size: 16px;
    font-weight: 700;
    margin: 0 8px;
    border: none;
    border-radius: 4px;
    background-color: white;
    color: var(--primary);
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, transform 0.3s,
      box-shadow 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;

    &:disabled {
      background-color: #e9ecef;
      border-color: #e9ecef;
      color: #6c757d;
      cursor: not-allowed;
      box-shadow: none;
    }

    &.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }

    &:not(:disabled):hover {
      background-color: #0044cc;
      color: white;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(51, 102, 255, 0.3);
    }

    .icon {
      width: 20px;
      height: 20px;
      color: inherit;
    }
  }
}
</style> -->
