<template>
   <section class="table-shell">
      <div class="table-shell__surface">
         <div class="table-shell__surface-inner">
            <div v-if="loading" class="table-shell__state">
               <strong>Загрузка данных...</strong>
               <span>Собираем актуальный список.</span>
            </div>

            <div v-else-if="!rows.length" class="table-shell__state">
               <strong>{{ emptyTitle }}</strong>
               <span>{{ emptyText }}</span>
            </div>

            <table v-else class="table-shell__table">
               <colgroup>
                  <col
                     v-for="column in columns"
                     :key="column.key"
                     :style="getColumnStyle(column)"
                  />
               </colgroup>

               <thead class="table-shell__head">
                  <tr>
                     <th
                        v-for="column in columns"
                        :key="column.key"
                        class="table-shell__th"
                        :class="resolveHeaderClasses(column)"
                        scope="col"
                     >
                        <span class="table-shell__th-label">{{
                           column.label
                        }}</span>
                        <span
                           v-if="column.helper"
                           class="table-shell__th-helper"
                        >
                           {{ column.helper }}
                        </span>
                     </th>
                  </tr>
               </thead>

               <tbody>
                  <CustomTableItem
                     v-for="row in rows"
                     :key="resolveRowKey(row)"
                     :row="row"
                     :columns="columns"
                     @row-action="handleRowAction"
                     @row-click="emit('rowClick', $event)"
                  />
               </tbody>
            </table>
         </div>
      </div>

      <div
         v-if="tablePagination && rows.length"
         class="table-shell__pagination"
      >
         <div class="table-shell__pagination-meta">
            <SelectUI
               label="На странице"
               :options="pageSizeOptions"
               :initial-selected-option="perPage"
               layout="row"
               label-width="auto"
               input-width="88px"
               :block="false"
               @updateSort="emit('update:perPage', Number($event))"
            />
         </div>

         <Pagination
            :total-items="total"
            :page-size="perPage"
            :current-page="currentPage"
            @changePage="emit('update:currentPage', $event)"
         />
      </div>
   </section>
</template>

<script setup>
import { computed } from 'vue'
import Pagination from '@/components/Pagination.vue'
import SelectUI from '@/components/ui/SelectUI.vue'
import CustomTableItem from './CustomTableItem.vue'

const props = defineProps({
   columns: { type: Array, default: () => [] },
   rows: { type: Array, default: () => [] },
   rowKey: { type: String, default: 'id' },
   loading: { type: Boolean, default: false },
   emptyTitle: { type: String, default: 'Пусто' },
   emptyText: {
      type: String,
      default: 'Подходящих записей пока нет.'
   },
   tablePagination: { type: Boolean, default: true },
   currentPage: { type: Number, default: 1 },
   total: { type: Number, default: 0 },
   perPage: { type: Number, default: 20 },
   pageSizes: { type: Array, default: () => [10, 20, 50] }
})

const emit = defineEmits([
   'rowAction',
   'rowClick',
   'update:currentPage',
   'update:perPage'
])

const pageSizeOptions = computed(() =>
   (Array.isArray(props.pageSizes) ? props.pageSizes : []).map((size) => ({
      id: size,
      title: String(size)
   }))
)

const SIMPLE_WIDTH_RE = /^\d+(\.\d+)?(px|rem|em|%|ch|vw|vh|vmin|vmax)$/i

const resolveRowKey = (row) => row?.[props.rowKey] ?? JSON.stringify(row)

const getColumnStyle = (column) => {
   const width = typeof column?.width === 'string' ? column.width.trim() : ''
   return SIMPLE_WIDTH_RE.test(width) ? { width } : {}
}

const resolveHeaderClasses = (column) => [
   column.align === 'center' && 'table-shell__th--center',
   column.nowrap && 'table-shell__th--nowrap',
   column.columnClass && `table-shell__th--${column.columnClass}`
]

const handleRowAction = (actionKey, row) => {
   emit('rowAction', actionKey, row)
}
</script>

<style scoped lang="scss">
.table-shell {
   display: flex;
   flex-direction: column;
   gap: 12px;
}

.table-shell__surface {
   flex: 1 1 auto;
   overflow: visible;
}

.table-shell__surface-inner {
   overflow: hidden;
   border: 1px solid var(--color-border);
   border-radius: 12px;
   background: var(--color-surface);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.08);
}

.table-shell__table {
   width: 100%;
   border-collapse: collapse;
   table-layout: auto;
}

.table-shell__head {
   background: linear-gradient(180deg, #fcfcfc 0%, #f7f7f7 100%);
}

.table-shell__th {
   box-sizing: border-box;
   padding: 12px 16px;
   border-bottom: 1px solid #e7e7e7;
   border-right: 1px solid #f0f0f0;
   text-align: left;
   vertical-align: bottom;
   white-space: normal;
}

.table-shell__th:last-child {
   border-right: 0;
}

.table-shell__th--center {
   text-align: center;
}

.table-shell__th--nowrap {
   white-space: nowrap;
}

.table-shell__th-label {
   display: block;
  color: #3366FF;
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   font-weight: 800;
   letter-spacing: 0.08em;
   text-transform: uppercase;
}

.table-shell__th-helper {
   display: block;
   margin-top: 4px;
   color: var(--color-text-muted);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   white-space: normal;
}

.table-shell__state {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 8px;
   min-height: 180px;
   padding: 24px;
   background: var(--color-surface);
   text-align: center;
}

.table-shell__state strong {
   color: var(--color-text-primary);
   font-size: var(--font-size-16);
   line-height: var(--line-height-16);
}

.table-shell__state span {
   max-width: 360px;
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.table-shell__pagination {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 12px;
   flex-wrap: wrap;
   padding: 10px 14px;
   border: 1px solid var(--color-border);
   border-radius: 12px;
   background: var(--color-surface);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
}

.table-shell__pagination-meta {
   display: flex;
   align-items: center;
   gap: 12px;
   flex-wrap: wrap;
   color: var(--color-text-secondary);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
}

.table-shell__pagination-meta :deep(.select-field--row) {
   display: grid;
   grid-template-columns: auto minmax(76px, 88px);
   align-items: center;
   column-gap: 8px;
}

@media (min-width: 961px) {
   .table-shell__surface-inner {
      min-height: 320px;
   }

   .table-shell__pagination {
      position: sticky;
      bottom: 0;
      z-index: 5;
      margin-top: auto;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
   }
}

@media (max-width: 960px) {
   .table-shell__surface,
   .table-shell__surface-inner {
      overflow: visible !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
   }

   .table-shell__table,
   .table-shell__head,
   .table-shell__table tbody {
      display: block;
      min-width: 0;
      background: transparent !important;
   }

   .table-shell__head {
      display: none;
   }

   .table-shell__table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: transparent !important;
   }

   .table-shell__table tbody {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 0;
      margin: 0;
      background: transparent !important;
   }

   .table-shell__pagination {
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
   }

   .table-shell__pagination-meta {
      flex-wrap: nowrap;
      justify-content: flex-start;
      width: auto;
   }
}

@media (max-width: 640px) {
   .table-shell__pagination {
      align-items: stretch;
      flex-direction: column;
      gap: 10px;
   }

   .table-shell__pagination-meta {
      justify-content: space-between;
      width: 100%;
   }

   .table-shell__pagination-meta :deep(.select-field--row) {
      grid-template-columns: auto minmax(72px, 84px);
      column-gap: 6px;
   }
}
</style>
