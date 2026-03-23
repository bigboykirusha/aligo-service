<template>
   <div class="category-selection-wrapper">
      <div class="category-selection container">
         <div v-if="isMobile" class="category-selection__title-container">
            <img
               v-if="canGoBack"
               :src="downIcon"
               class="back-icon"
               @click="goBack"
            >
            <div class="category-selection__title">{{ selectCategoryTitle }}</div>
         </div>

         <div v-if="isCatalogLoading" class="category-selection__loader">
            <LoaderUI :size="44" />
         </div>

         <div v-else class="category-selection__columns">
            <div class="category-selection__browser-col">
               <div
                  v-if="!isMobile"
                  class="category-selection__title category-selection__title--desktop"
               >
                  {{ selectCategoryTitle }}
               </div>
               <CreateCatalogBrowser
                  :is-mobile="isMobile"
                  :categories="categories"
                  :current-categories="currentCategories"
                  :selected-category="selectedCategory"
                  :selected-sub="selectedSub"
                  :subcategories="subcategories"
                  :down-icon="downIcon"
                  @category-click="handleCategoryClick"
                  @sub-click="handleSubClick"
                  @final-select="finalSelect"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import CreateCatalogBrowser from '@/components/create/catalog/CreateCatalogBrowser.vue'
import LoaderUI from '@/components/ui/LoaderUI.vue'
import { useCreateCatalogPageModel } from '~/composables/create/useCreateCatalogPageModel'

const {
   downIcon,
   categories,
   isCatalogLoading,
   currentCategories,
   selectedCategory,
   selectedSub,
   subcategories,
   isMobile,
   canGoBack,
   handleCategoryClick,
   handleSubClick,
   finalSelect,
   goBack
} = useCreateCatalogPageModel()

const selectCategoryTitle = '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u044e'
</script>

<style scoped lang="scss">
.category-selection-wrapper {
   padding-top: var(--app-header-create-offset-desktop);
   min-height: 100vh;
   display: flex;

   @media (max-width: 768px) {
      padding-top: var(--app-header-create-offset-mobile);
   }
}

.category-selection {
   max-width: 1312px;
   width: 100%;
   min-height: calc(100vh - var(--app-header-create-offset-desktop));
   display: flex;
   flex-direction: column;
   margin: 0 auto;
   padding: 0 16px;

   @media (max-width: 768px) {
      min-height: calc(100vh - var(--app-header-create-offset-mobile));
   }

   &__title-container {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
   }

   &__title {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      color: #323232;

      @media (max-width: 768px) {
         font-size: 14px;
         line-height: 18px;
      }
   }

   &__title--desktop {
      margin-bottom: 16px;
   }

   &__columns {
      display: flex;
      justify-content: space-between;
      gap: 20px;
   }

   &__loader {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 170px);
   }

   &__browser-col {
      flex: 1;
      min-width: 0;
   }
}

.back-icon {
   height: 14px;
   cursor: pointer;
   transform: rotate(180deg);
}

@media (max-width: 1024px) {
   .category-selection {
      min-height: auto;
   }

   .category-selection__columns {
      flex-direction: column;
      height: auto;
   }

   .category-selection__browser-col {
      width: 100%;
   }
}
</style>
