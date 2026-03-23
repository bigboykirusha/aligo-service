<template>
   <div class="selection-area">
      <div v-if="!isMobile" class="category-col">
         <ul class="category-list">
            <li
               v-for="cat in categories"
               :key="cat.slug"
               :class="[
                  'category-item',
                  { 'is-active': selectedCategory?.slug === cat.slug }
               ]"
               @click="$emit('category-click', cat)"
            >
               <div class="category-item__content">
                  <img v-if="cat.icon" :src="cat.icon" class="category-icon">
                  <span>{{ cat.name }}</span>
               </div>
               <img v-if="cat.subcategories" :src="downIcon" class="arrow-icon">
            </li>
         </ul>
      </div>

      <div v-if="isMobile" class="category-col">
         <ul class="category-list">
            <li
               v-for="cat in currentCategories"
               :key="cat.slug"
               :class="[
                  'category-item',
                  { 'is-active': selectedCategory?.slug === cat.slug }
               ]"
               @click="$emit('category-click', cat)"
            >
               <div class="category-item__content">
                  <img v-if="cat.icon" :src="cat.icon" class="category-icon">
                  <span>{{ cat.name }}</span>
               </div>
               <img
                  v-if="cat.subcategories || cat.items"
                  :src="downIcon"
                  class="arrow-icon">
            </li>
         </ul>
      </div>

      <Transition name="slide">
         <div
            v-if="!isMobile && selectedCategory && subcategories.length"
            class="category-col with-border"
         >
            <ul class="category-list">
               <li
                  v-for="sub in subcategories"
                  :key="sub.slug"
                  :class="[
                     'category-item',
                     { 'is-active': selectedSub?.slug === sub.slug }
                  ]"
                  @click="$emit('sub-click', sub)"
               >
                  <span>{{ sub.name }}</span>
                  <img v-if="sub.items" :src="downIcon" class="arrow-icon">
               </li>
            </ul>
         </div>
      </Transition>

      <Transition name="slide">
         <div
            v-if="!isMobile && selectedSub && selectedSub.items"
            class="category-col with-border"
         >
            <ul class="category-list">
               <li
                  v-for="item in selectedSub.items"
                  :key="item.slug"
                  class="category-item no-chevron"
                  @click="$emit('final-select', item)"
               >
                  {{ item.name }}
               </li>
            </ul>
         </div>
      </Transition>
   </div>
</template>

<script setup>
defineOptions({
   name: 'CreateCatalogBrowser'
})

defineProps({
   isMobile: { type: Boolean, default: false },
   categories: { type: Array, default: () => [] },
   currentCategories: { type: Array, default: () => [] },
   selectedCategory: { type: Object, default: null },
   selectedSub: { type: Object, default: null },
   subcategories: { type: Array, default: () => [] },
   downIcon: { type: String, default: '' }
})

defineEmits(['category-click', 'sub-click', 'final-select'])
</script>

<style scoped lang="scss">
.selection-area {
   display: flex;
   background: #fff;
   overflow: hidden;
   flex: 1;
}

.category-col {
   width: 275px;
   background: #fff;
   overflow-y: auto;

   &.with-border {
      border-left: 1px solid #d6d6d6;
   }
}

.category-list {
   list-style: none;
   margin: 0;
   padding: 0;
}

.category-item {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 12px;
   cursor: pointer;
   color: #323232;
   font-weight: 400;
   font-size: 14px;
   transition: background-color 0.2s ease;

   &:hover,
   &.is-active {
      background: #eef9ff;
   }

   &.is-active {
      font-weight: 700;
   }

   &__content {
      display: flex;
      align-items: center;
      gap: 8px;
   }
}

.category-icon {
   width: 16px;
   height: 16px;
}

.arrow-icon {
   height: 12px;
}

.slide-enter-active,
.slide-leave-active {
   transition: all 0.2s ease-out;
}

.slide-enter-from {
   opacity: 0;
   transform: translateX(-10px);
}

.slide-leave-to {
   opacity: 0;
}

@media (max-width: 1024px) {
   .category-item {
      padding: 12px 0;

      &:hover,
      &.is-active {
         background: #fff;
      }
   }

   .selection-area {
      border: none;
   }

   .category-col {
      width: 100%;
   }
}
</style>
