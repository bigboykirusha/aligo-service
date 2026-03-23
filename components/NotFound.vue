<template>
   <div class="error">
      <img class="error__image" src="@/assets/images/aligo-banner.png" alt="Aligo">

      <div class="error__text">
         <h2>Страница не найдена</h2>
         <p class="error__code">Ошибка {{ statusCodeText }}</p>
      </div>

      <div class="error__buttons">
         <button type="button" @click="reloadPage">
            <img src="@/assets/icons/refresh.svg" alt="">
            Обновить страницу
         </button>
         <button type="button" @click="goHome">
            <img src="@/assets/icons/house-icon.svg" alt="">
            На главную
         </button>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue'
import { navigateTo } from '#app'

const props = defineProps({
   statusCode: {
      type: [Number, String],
      default: 404
   },
   statusMessage: {
      type: String,
      default: ''
   },
   onReload: {
      type: Function,
      default: null
   },
   onHome: {
      type: Function,
      default: null
   }
})

const statusCodeText = computed(() => props.statusCode || 404)

const reloadPage = () => {
   if (typeof props.onReload === 'function') {
      props.onReload()
      return
   }

   if (import.meta.client) {
      window.location.reload()
   }
}

const goHome = async () => {
   if (typeof props.onHome === 'function') {
      props.onHome()
      return
   }

   await navigateTo('/')
}
</script>

<style scoped lang="scss">
.error {
   background-color: #3366ff;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 24px;
   text-align: center;
   min-height: 100vh;
   min-height: 100dvh;

   &__image {
      width: min(100%, 520px);
      height: auto;
      object-fit: contain;
      margin-bottom: 24px;
   }

   &__text {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #ffffff;

      h2 {
         font-size: 20px;
         line-height: 24px;
         color: #ffffff;
      }
   }

   &__code {
      font-size: 12px;
      line-height: 16px;
      margin: 0;
   }

   &__buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;

      @media (max-width: 768px) {
         gap: 8px;
      }

      button {
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 8px;
         min-height: 34px;
         padding: 0 14px;
         font-size: 14px;
         line-height: 18px;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         background: transparent;
         color: #fff;
         transition:
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;

         &:hover {
            background: #144DF8;
         }
      }

      img {
         width: 16px;
         height: 16px;
      }
   }

   @media (max-width: 640px) {
      &__buttons {
         width: 100%;
         max-width: 360px;

         button {
            width: 100%;
         }
      }

      &__text h2 {
         font-size: 20px;
      }
   }
}
</style>
