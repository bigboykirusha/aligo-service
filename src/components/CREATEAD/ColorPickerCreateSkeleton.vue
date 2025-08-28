<template>
   <div class="color-picker-skeleton">
      <div class="color-picker-skeleton__options">
         <div v-for="n in 8" :key="n" class="color-picker-skeleton__option"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.color-picker-skeleton {
   display: flex;
   flex-direction: row;
   align-items: flex-start;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__title {
      height: 14px;
      background: #e0e0e0;
      border-radius: 4px;
      min-width: 70px;
      margin-right: 200px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__options {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      gap: 20px;
      flex-wrap: wrap;
   }

   &__option {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: #e0e0e0;
      border: 1px solid #d6d6d6;
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
