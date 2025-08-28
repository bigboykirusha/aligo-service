<template>
   <div class="categories">
      <p class="categories__title">Выберите категорию:</p>

      <button class="category-btn" @click="nextTab">
         <img src="@/assets/icons/car.svg" alt="Автомобили" class="category-icon" />
         Автомобили
      </button>

      <button class="category-btn" @click="nextTab">
         <img src="@/assets/icons/disc.svg" alt="Автотовары" class="category-icon" />
         Автотовары
      </button>

      <button class="category-btn" @click="nextTab">
         <img src="@/assets/icons/moto.svg" alt="Мототехника" class="category-icon" />
         Мототехника
      </button>
   </div>
</template>

<script setup>
import { useTabsStore } from '@/store/tabsStore'

const tabsStore = useTabsStore()

const nextTab = () => {
   tabsStore.setActiveTab(2)
}
</script>

<style scoped>
.categories {
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 16px;
}

.categories__title {
   font-size: 16px;
   font-weight: 700;
   color: #323232;
}

.category-btn {
   display: flex;
   align-items: center;
   gap: 12px;
   background: #fff;
   border: none;
   font-size: 14px;
   color: #323232;
   cursor: pointer;
   padding: 6px;
   border-radius: 8px;
}

.category-btn:hover {
   background: #eaf5ff; 
}

.category-icon {
   width: 16px;
   height: 16px;
}
</style>
