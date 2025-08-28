<template>
   <div class="tabs__title">Новое объявление от имени «Сергей Олегович #7237 8348 0132»</div>
   <div class="tabs">
      
      <div v-for="(tab, index) in tabs" :key="tab.index" class="tabs__item">
         <div class="tabs__tab" :class="{
            'tabs__tab--active': activeTab === tab.index,
            'tabs__tab--completed': activeTab > tab.index,
         }" @click="selectTab(tab.index)">
            <transition name="fade-scale" mode="out-in">
               <img v-if="tab.index < activeTab" key="check" src="@/assets/icons/check.svg" alt="check icon"
                  class="tabs__tab-icon" />
               <b v-else key="number">{{ tab.index }}</b>
            </transition>
            <span v-if="tab.index === activeTab" class="tabs__label"> •&nbsp;&nbsp;{{ tab.label }}</span>
         </div>
         <div v-if="index < tabs.length - 1" class="tabs__arrow" :class="{ 'tabs__arrow--active': activeTab > index }">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M15 7L1 7" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 1" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
               <path d="M15 7L9 13" :stroke="activeTab > index ? '#3366FF' : '#D6D6D6'" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
            </svg>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTabsStore } from '@/store/tabsStore';
import { useCreateStore } from '@/store/create';
import { usePopupErrorStore } from '@/store/popupErrorStore';

const popupErrorStore = usePopupErrorStore();
const tabsStore = useTabsStore();
const createStore = useCreateStore();

const activeTab = computed(() => tabsStore.activeTab);
const tabs = computed(() => tabsStore.tabs);

const selectTab = (index) => {
   if ([2, 3].includes(index) && !createStore.isCharacteristicFieldsFilled) {
      popupErrorStore.showError('Пожалуйста, заполните обязательные поля!');
      return;
   }
   tabsStore.setActiveTab(index);
};
</script>

<style lang="scss" scoped>
.tabs {
   display: flex;
   align-items: center;
   gap: 8px;
   padding: 16px 24px;
   background-color: white;
   border-bottom: 1px solid #D6D6D6;
}

.tabs__item {
   display: flex;
   align-items: center;
   gap: 8px;
}

.tabs__title {
   font-size: 20px;
   padding-top: 16px;
   padding-left: 24px;
   font-weight: 700;
   color: #003BCE;
}

.tabs__tab {
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 2px 10px;
   height: 26px;
   border-radius: 12px;
   background-color: #eeeeee;
   color: #757575;
   font-weight: 400;
   transition: background-color 0.3s, color 0.3s, width 0.3s ease-in-out;
   overflow: hidden;
   white-space: nowrap;
   width: 40px;

   img {
      width: 16px;
      height: 16px;
   }

   b {
      font-size: 16px;
   }

   .tabs__label {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      padding-left: 6px;
   }

   &--active {
      background-color: #3366ff;
      color: #ffffff;
      width: auto;
      padding: 2px 14px;

      .tabs__label {
         opacity: 1;
      }
   }

   &--completed {
      background-color: #3366ff;
      color: #ffffff;
   }
}

.tabs__arrow {
   display: flex;
   align-items: center;
   justify-content: center;
   color: #a8a8a8;
   transition: color 0.3s;

   &--active {
      color: #3366ff;
   }

   svg {
      width: 16px;
      height: 14px;
   }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
   transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
   opacity: 0;
   transform: scale(0.8);
}
</style>
