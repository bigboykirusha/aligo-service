<template>
   <div class="pagination">
      <button
         :disabled="currentPage <= 1"
         class="pagination-button"
         aria-label="Предыдущая страница"
         @click="emitChangePage(currentPage - 1)"
      >
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
         v-for="(page, index) in visiblePages"
         :key="index"
         :class="{ active: page === currentPage }"
         :disabled="page === '...'"
         class="pagination-button"
         @click="typeof page === 'number' ? emitChangePage(page) : null"
      >
         {{ page }}
      </button>

      <button
         :disabled="currentPage >= totalPages"
         class="pagination-button"
         aria-label="Следующая страница"
         @click="emitChangePage(currentPage + 1)"
      >
         <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
import { computed } from 'vue'

defineOptions({
   name: 'PaginationControl'
})

const props = defineProps({
   totalItems: { type: Number, default: 0 },
   pageSize: { type: Number, default: 10 },
   currentPage: { type: Number, default: 1 }
})

const emit = defineEmits(['changePage'])

const totalPages = computed(() =>
   Math.max(1, Math.ceil(props.totalItems / Math.max(props.pageSize, 1)))
)

const visiblePages = computed(() => {
   const total = totalPages.value
   const current = props.currentPage
   const delta = 0
   const range = []

   for (let i = 1; i <= total; i++) {
      if (
         i === 1 ||
         i === total ||
         (i >= current - delta && i <= current + delta)
      ) {
         range.push(i)
      } else if (range[range.length - 1] !== '...') {
         range.push('...')
      }
   }

   return range
})

const emitChangePage = (page) => {
   if (page < 1 || page > totalPages.value) return
   emit('changePage', page)
}
</script>

<style lang="scss" scoped>
.pagination {
   display: flex;
   align-items: center;
   gap: 6px;
   flex-wrap: wrap;
}

.pagination-button {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   min-width: 34px;
   height: 34px;
   padding: 0 10px;
   border: 1px solid #d6d6d6;
   border-radius: 8px;
   background: #fff;
   color: #323232;
   cursor: pointer;
   transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;

   &:disabled {
      color: #b0b0b0;
      cursor: not-allowed;
      background: #fafafa;
   }

   &.active {
      border-color: #3366ff;
      background: #f1f6ff;
      color: #3366ff;
   }

   &:hover:not(:disabled):not(.active) {
      border-color: #bfdcff;
      background: #f8fbff;
   }
}

.icon {
   width: 16px;
   height: 16px;
}
</style>
