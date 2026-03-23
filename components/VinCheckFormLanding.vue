<template>
   <div class="vin-banner">
      <div class="vin-banner__left">
         <h1 class="vin-banner__title">ПРОВЕРЬТЕ ИСТОРИЮ АВТОМОБИЛЯ</h1>
         <h5 class="vin-banner__desc">
            Узнайте полную историю автомобиля перед покупкой. Мы найдём для вас
            информацию о ДТП, ремонте, пробеге, обслуживании, владельцах,
            юридической чистоте, истории эксплуатации и многом другом.
         </h5>

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

         <div class="vin-banner__links">
            <VinHelpTooltip
               class="vin-banner__link-wrapper"
               trigger-class="vin-banner__link"
               text="Где найти VIN номер?"
               :icon="searchBlueIcon"
            />
            <a href="/report" target="_blank" rel="noopener" class="vin-banner__link">
               <img src="@/assets/icons/orders.svg" alt="report">
               Пример отчета
            </a>
         </div>
      </div>

      <div class="vin-banner__right">
         <img src="@/assets/images/main-banner.png" alt="car" class="vin-banner__image">
      </div>
   </div>
</template>

<script setup>
import searchBlueIcon from '@/assets/icons/search-blue.svg'
import VinHelpTooltip from '@/components/VinHelpTooltip.vue'
import VinCheckForm from '@/components/VinCheckForm.vue'
</script>

<style scoped lang="scss">
.vin-banner {
   display: flex;
   justify-content: space-between;
   gap: 32px;
   flex-wrap: wrap;
   padding: 40px;
   border-radius: 4px;
   background: linear-gradient(90deg, #d6efff, #afcdfb);
   box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);

   @media (max-width: 991px) {
      padding: 32px;
   }

   @media (max-width: 480px) {
      flex-direction: column;
   }
}

.vin-banner__left {
   flex: 1;
   min-width: 300px;
}

.vin-banner__title {
   margin-bottom: 8px;
   color: var(--color-text-accent);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
   font-weight: 700;
   text-transform: uppercase;
}

.vin-banner__desc {
   margin-bottom: 24px;
   color: var(--color-text-primary);
   font-size: var(--font-size-16);
   line-height: var(--line-height-16);
   font-weight: 400;
}

.vin-banner__form {
   max-width: 426px;

   @media (max-width: 991px) {
      max-width: 100%;
   }
}

.vin-banner__links {
   display: flex;
   gap: 12px;
   margin-top: 8px;

   @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
   }
}

:deep(.vin-banner__link) {
   display: flex;
   align-items: center;
   gap: 8px;
   color: var(--color-text-accent);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   text-decoration: none;
   cursor: pointer;
}

:deep(.vin-banner__link img) {
   height: 12px;
}

.vin-banner__right {
   display: flex;
   flex: 1;
   align-items: center;
   justify-content: center;
}

.vin-banner__image {
   width: 100%;
   object-fit: contain;
}

.vin-banner__form :deep(.vin-check__form) {
   width: 100%;
}
</style>
