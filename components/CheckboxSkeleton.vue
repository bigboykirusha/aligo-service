<template>
   <div class="checkbox-list-skeleton">
      <div class="checkbox-list-skeleton__label" />
      <div class="checkbox-list-skeleton__items">
         <div v-for="n in 4" :key="n" class="checkbox-list-skeleton__item">
            <div class="checkbox-skeleton__checkbox" />
            <div class="checkbox-skeleton__text" />
         </div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.checkbox-list-skeleton {
   display: flex;
   flex-direction: column;
   gap: 5px;

   &__label {
      height: 12px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 100px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
   }

   &__item {
      flex: 0 0 46%;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e0e0e0;
      border-radius: 6px;
      padding-left: 10px;
      animation: pulse 1.5s infinite ease-in-out;

      .checkbox-skeleton__checkbox {
         width: 20px;
         height: 20px;
         background: #e0e0e0;
         border-radius: 2px;
         animation: pulse 1.5s infinite ease-in-out;
      }

      .checkbox-skeleton__text {
         height: 12px;
         background: #e0e0e0;
         border-radius: 4px;
         flex: 1;
         animation: pulse 1.5s infinite ease-in-out;
      }
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
