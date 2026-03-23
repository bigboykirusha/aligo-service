<template>
   <div class="car-unpublished">Объявление снято с публикации</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.car-unpublished {
   background-color: #d6efff;
   color: #3366ff;
   font-size: 24px;
   line-height: 30px;
   font-weight: 700;
   padding: 24px;
   border-radius: 6px;
   max-width: 1280px;
   width: 100%;
   margin: 0 auto;
   display: flex;
   align-items: center;
   flex-direction: column;
   gap: 16px;
   margin-bottom: 24px;

   @media (max-width: 768px) {
      gap: 16px;
      margin: 0 16px;
      width: calc(100% - 32px);
      padding: 24px 16px;
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 20px;
   }
}
</style>
