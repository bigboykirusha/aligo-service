<template>
   <div class="switcher-skeleton">
      <div class="switcher-skeleton__label" />
      <div class="switcher-skeleton__items">
         <div v-for="n in 2" :key="n" class="switcher-skeleton__item" />
      </div>
   </div>
</template>

<style scoped lang="scss">
.switcher-skeleton {
   display: flex;
   flex-direction: column;
   max-width: 260px;
   gap: 10px;

   @media (max-width: 1250px) {
      max-width: 100%;
      width: 100%;
   }

   &__label {
      height: 12px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 80px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__items {
      display: flex;
      border: 1px solid #d6d6d6;
      border-radius: 6px;
   }

   &__item {
      flex: 1;
      height: 26px;
      margin: 2px;
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
