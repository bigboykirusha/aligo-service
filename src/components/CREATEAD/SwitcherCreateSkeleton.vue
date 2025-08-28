<template>
   <div class="switcher-skeleton">
      <div class="switcher-skeleton__label"></div>
      <div class="switcher-skeleton__items">
         <div v-for="n in 2" :key="n" class="switcher-skeleton__item"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.switcher-skeleton {
   display: flex;
   align-items: center;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label {
      height: 14px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 70px;
      margin-right: 200px;

      animation: pulse 1.5s infinite ease-in-out;
   }

   &__items {
      display: flex;
      max-width: 310px;
      width: 100%;
      border: 1px solid #d6d6d6;
      border-radius: 6px;

      @media (max-width: 768px) {
         max-width: 100%;
      }

   }

   &__item {
      flex: 1;
      height: 32px;
      margin: 4px;
      background: #e0e0e0;
      border-radius: 6px;
      animation: pulse 1.5s infinite ease-in-out;
   }
}

@keyframes pulse {
   0% {
      background-color: #e0e0e0;
   }

   50% {
      background-color: #d6d6d6;
   }

   100% {
      background-color: #e0e0e0;
   }
}
</style>
