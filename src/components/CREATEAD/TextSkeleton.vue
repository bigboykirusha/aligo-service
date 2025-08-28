<template>
   <div class="simple-input-skeleton">
      <div class="simple-input-skeleton__label"></div>
      <div class="simple-input-skeleton__wrapper">
         <div class="simple-input-skeleton__field"></div>
         <div class="simple-input-skeleton__clear"></div>
      </div>
   </div>
</template>

<style scoped lang="scss">
.simple-input-skeleton {
   display: flex;
   flex-direction: row;
   align-items: center;

   @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__label,
   &__field,
   &__clear {
      background-color: #e0e0e0;
      border-radius: 4px;
      animation: pulse 1.5s infinite;
   }

   &__label {
      height: 14px;
      width: 70px;
      margin-right: 200px;
   }

   &__wrapper {
      position: relative;
      width: 310px;

      @media screen and (max-width: 768px) {
         width: 100%;
      }
   }

   &__field {
      height: 34px;
      width: 100%;
   }

   &__clear {
      position: absolute;
      top: 10px;
      right: 10px;
      height: 14px;
      width: 14px;
   }

   @keyframes pulse {
      0% {
         opacity: 1;
      }

      50% {
         opacity: 0.5;
      }

      100% {
         opacity: 1;
      }
   }
}
</style>