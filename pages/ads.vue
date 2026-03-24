<template>
   <section class="ads-page">
      <header class="admin-page__hero">
         <div>
            <h1 class="admin-page__title">Объявления</h1>
            <p class="admin-page__description">
               Все основные фильтры и действия по объявлениям в одном экране.
            </p>
         </div>
      </header>

      <form class="filters-panel" @submit.prevent="applyFilters">
         <label class="filters-panel__field filters-panel__field--wide">
            <span>Поиск</span>
            <input
               v-model.trim="filters.search"
               type="text"
               placeholder="Бренд, модель и т.п."
            />
         </label>

         <label class="filters-panel__field">
            <span>User ID</span>
            <input
               v-model.trim="filters.user_id"
               type="text"
               placeholder="107"
            />
         </label>

         <div class="filters-panel__field">
            <SelectUI
               label="Сортировка"
               :options="orderByOptions"
               :initial-selected-option="filters.order_by"
               @updateSort="filters.order_by = String($event)"
            />
         </div>

         <div class="filters-panel__field filters-panel__field--statuses">
            <SelectUI
               label="Статусы"
               :options="statusMultiOptions"
               :initial-selected-options="selectedStatusKeys"
               selection-mode="multi"
               searchable
               search-mode="includes"
               :show-actions="true"
               @updateSort="handleStatusesChange"
            />
         </div>

         <div class="filters-panel__actions">
            <UIButton
               type="submit"
               :block="false"
               variant="primary"
               class="filters-panel__action-button"
            >
               <span class="button-inline">
                  <img :src="searchIcon" alt="" class="button-inline__icon" />
                  <span>Показать</span>
               </span>
            </UIButton>

            <UIButton
               type="button"
               :block="false"
               variant="secondary"
               class="filters-panel__action-button"
               @click="resetFilters"
            >
               <span class="button-inline">
                  <img :src="refreshIcon" alt="" class="button-inline__icon" />
                  <span>Сбросить</span>
               </span>
            </UIButton>
         </div>
      </form>

      <section v-if="errorMessage" class="notice notice--error">
         {{ errorMessage }}
      </section>

      <CustomTable
         :columns="columns"
         :rows="ads"
         :loading="isLoading"
         :total="totalAds"
         :per-page="filters.count"
         :current-page="currentPage"
         row-key="autoId"
         empty-title="Объявления не найдены"
         empty-text="Проверь фильтры или загрузи другой статус."
         @row-action="handleRowAction"
         @update:current-page="loadAds"
         @update:per-page="handlePerPageChange"
      />
   </section>
</template>

<script setup>
import refreshIcon from '@/assets/icons/clear.svg'
import searchIcon from '@/assets/icons/search.svg'
import CustomTable from '@/components/table/CustomTable.vue'
import UIButton from '@/components/ui/UIButton.vue'
import SelectUI from '@/components/ui/SelectUI.vue'
import { useModerationAdsTable } from '@/composables/useModerationAdsTable'

definePageMeta({
   requiresAuth: true
})

const {
   ads,
   applyFilters,
   columns,
   currentPage,
   errorMessage,
   filters,
   handlePerPageChange,
   handleRowAction,
   handleStatusesChange,
   isLoading,
   loadAds,
   orderByOptions,
   selectedStatusKeys,
   statusMultiOptions,
   totalAds
} = useModerationAdsTable()

const resetFilters = async () => {
   filters.search = ''
   filters.user_id = ''
   filters.order_by = 'desc'
   handleStatusesChange([])
   await loadAds(1)
}
</script>

<style scoped lang="scss">
.ads-page {
   display: flex;
   flex-direction: column;
   gap: 24px;
   max-width: 1312px;
   margin: 0 auto;
   padding: 0 16px;
}

.admin-page__hero {
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
   gap: 20px;
}

.admin-page__title {
   margin: 0 0 8px;
   color: var(--color-text-primary);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
}

.admin-page__description {
   max-width: 760px;
   margin: 0;
   color: var(--color-text-secondary);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.filters-panel {
   display: flex;
   flex-wrap: nowrap;
   align-items: flex-end;
   gap: 12px;
   padding: 16px;
   border: 1px solid #d6d6d6;
   border-radius: 12px;
   background: #ffffff;
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.08);
}

.filters-panel__field {
   display: flex;
   flex-direction: column;
   gap: 8px;
   font-size: 14px;
   min-width: 0;
   flex: 1 1 0;
}

.filters-panel__field--wide {
   min-width: 0;
   flex: 1.2 1 0;
}

.filters-panel__field--statuses {
   min-width: 0;
   flex: 1.1 1 0;
}

.filters-panel__field span {
   color: #323232;
   font-size: 12px;
}

.filters-panel__field input {
   min-height: 34px;
   padding: 0 12px;
   border: 1px solid #d6d6d6;
   border-radius: 6px;
   background: #fff;
}

.filters-panel__field input:focus {
   outline: none;
   border-color: #3366ff;
}

.filters-panel__field :deep(.select-field) {
   width: 100%;
}

.filters-panel__actions {
   display: flex;
   gap: 10px;
   flex-wrap: nowrap;
   align-items: center;
   flex: 0 0 auto;
   margin-left: auto;
}

.filters-panel__action-button {
   flex: 0 0 auto;
   white-space: nowrap;
}

.button-inline {
   display: inline-flex;
   align-items: center;
   gap: 8px;
}

.button-inline__icon {
   width: 16px;
   height: 16px;
   flex-shrink: 0;
}

.notice {
   padding: 16px;
   border: 1px solid #ffd4d4;
   border-radius: 12px;
   color: #ff5959;
   background: #fff8f8;
}

@media (max-width: 768px) {
   .filters-panel {
      flex-wrap: wrap;
   }

   .admin-page__hero {
      align-items: stretch;
      flex-direction: column;
   }

   .filters-panel__field {
      width: 100%;
      flex-basis: 100%;
   }

   .filters-panel__actions {
      width: 100%;
      flex-basis: 100%;
      margin-top: 2px;
      margin-left: 0;
      flex-wrap: wrap;
   }

   .filters-panel__action-button {
      width: calc(50% - 5px);
   }
}
</style>
