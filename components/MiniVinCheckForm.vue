<template>
   <section class="vin-banner">
      <div class="vin-banner__content">
         <h1 class="vin-banner__title">
            Автоотчет
            <span class="vin-banner__sale">
               <img class="vin-banner__logo" src="@/assets/icons/minivinlogo.svg" alt="">
               Каждый 5 отчет бесплатно
            </span>
         </h1>
         <p class="vin-banner__desc">
            Мы проверяем множество баз, включая закрытые и базу ГИБДД. В отчет
            входит информация, которую необходимо знать перед покупкой автомобиля.
         </p>

         <div class="vin-banner__form">
            <VinCheckForm
               compact
               form-only
               hide-title
               :show-service-links="false"
               button-text="Проверить"
               placeholder="Введите VIN или госномер"
            />
         </div>
      </div>
   </section>
</template>

<script setup>
import VinCheckForm from '@/components/VinCheckForm.vue'
</script>

<style scoped lang="scss">
.vin-banner {
   position: relative;
   background: linear-gradient(90deg, #d6efff, #afcdfb);
   border-radius: 6px;
   height: 100%;
   padding: 40px;
   overflow: hidden;
   box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);

   &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50%;
      height: 100%;
      opacity: 0.6;
      pointer-events: none;
      background: url('@/assets/icons/report-bg.svg') no-repeat bottom right;
      background-size: contain;
   }

   @media (max-width: 768px) {
      padding: 32px;

      &::after {
         width: 100%;
         height: 150px;
         opacity: 0.2;
         background-position: center bottom;
      }
   }
}

.vin-banner__content {
   position: relative;
   z-index: 1;
   max-width: 640px;
}

.vin-banner__title {
   display: flex;
   align-items: center;
   gap: 24px;
   margin-bottom: 24px;
   color: var(--color-text-accent);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
   font-weight: 700;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
   }
}

.vin-banner__sale {
   display: flex;
   max-width: 180px;
   align-items: flex-start;
   gap: 8px;
   color: var(--color-text-accent);
   font-size: var(--font-size-14);
   line-height: var(--line-height-14);
}

.vin-banner__desc {
   margin-bottom: 24px;
   color: var(--color-text-primary);
   font-size: var(--font-size-16);
   line-height: var(--line-height-16);
   font-weight: 700;
}

.vin-banner__form {
   width: 350px;
   max-width: 100%;

   @media (max-width: 768px) {
      width: 100%;
   }
}

.vin-banner__form :deep(.vin-check__form) {
   width: 100%;
}
</style>
