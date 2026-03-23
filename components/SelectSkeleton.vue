<template>
   <div class="dropdown-skeleton" :class="{ 'dropdown-skeleton--row': layout === 'row' }">
      <div class="dropdown-skeleton__label" />
      <div class="dropdown-skeleton__input">
         <div class="input-text-skeleton">
            <div class="input-text-skeleton__input" />
         </div>
      </div>
   </div>
</template>

<script setup>
defineProps({
   layout: {
      type: String,
      default: 'column'
   }
})
</script>

<style scoped lang="scss">
.dropdown-skeleton {
   position: relative;
   width: 100%;
   max-width: 262px;
   width: 260px;
   display: flex;
   flex-direction: column;

   &--row {
      max-width: none;
      width: auto;
      flex-direction: row;
      align-items: center;

      @media (max-width: 768px) {
         flex-direction: column;
         gap: 8px;
         align-items: flex-start;
         width: 100%;
      }

      .dropdown-skeleton__label {
         width: 70px;
         margin-right: 200px;
         margin-bottom: 0;
      }

      .dropdown-skeleton__input {
         width: 350px;

         @media (max-width: 768px) {
            width: 100%;
         }
      }
   }

   @media screen and (max-width: 1250px) {
      max-width: 100%;
      width: 100%;
   }

   &__label {
      height: 12px;
      background: #e0e0e0;
      border-radius: 4px;
      width: 50%;
      margin-bottom: 5px;
      animation: pulse 1.5s infinite ease-in-out;
   }

   &__input {
      height: 34px;
      background: #e0e0e0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 12px;
      animation: pulse 1.5s infinite ease-in-out;

      .input-text-skeleton {
         width: 100%;
         height: 100%;
         display: flex;
         align-items: center;
         background: #e0e0e0;
         border-radius: 6px;
         animation: pulse 1.5s infinite ease-in-out;

         &__input {
            width: 100%;
            height: 100%;
            background: #e0e0e0;
            border-radius: 6px;
         }
      }
   }

   &__list {
      position: absolute;
      bottom: 0;
      border: 1px solid #d6d6d6;
      border-top: none;
      left: 1px;
      z-index: 5;
      display: flex;
      flex-direction: column;
      transform: translate(-1px, 100%);
      list-style: none;
      width: 100%;
      max-height: 187px;
      background: #ffffff;
      border-radius: 6px;
      overflow-y: auto;
   }

   &__list-item {
      display: flex;
      align-items: center;
      padding: 12px;
      font-size: 14px;
      line-height: 1.29em;
      gap: 10px;
      background: white;
      animation: pulse 1.5s infinite ease-in-out;

      .checkbox-skeleton {
         width: 16px;
         height: 16px;
         background: #e0e0e0;
         border-radius: 2px;
         margin-right: 10px;
         animation: pulse 1.5s infinite ease-in-out;
      }

      .text-skeleton {
         height: 14px;
         background: #e0e0e0;
         border-radius: 4px;
         width: 100%;
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
