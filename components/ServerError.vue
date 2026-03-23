<template>
   <div class="error">
      <div class="error__content">
         <div class="error__left">
            <h1>Ошибка {{ statusCodeText }}</h1>
            <h2>Ошибка сервера</h2>
            <p v-if="statusMessage" class="error__message">{{ statusMessage }}</p>

            <div class="error__buttons">
               <button type="button" @click="reloadPage">
                  <img src="@/assets/icons/refresh-blue.svg" alt="">
                  Обновить страницу
               </button>
               <button type="button" @click="goHome">
                  <img src="@/assets/icons/house-icon-blue.svg" alt="">
                  На главную
               </button>
            </div>

            <img class="error__logo" src="@/assets/images/logo.svg" alt="Aligo">
         </div>

         <div class="error__right">
            <img src="@/assets/images/bg/404.png" alt="Server error">
         </div>
      </div>

      <div class="error__blue-bar" />
   </div>
</template>

<script setup>
import { computed } from 'vue'
import { navigateTo } from '#app'

const props = defineProps({
   statusCode: {
      type: [Number, String],
      default: 500
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

const statusCodeText = computed(() => props.statusCode || 500)

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
   max-width: 760px;
   margin: 0 auto;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 30px 20px 40px;
   width: 100%;
   min-height: 100vh;
   min-height: 100dvh;

   &__content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 24px;
      width: 100%;
      align-items: center;

      @media (max-width: 640px) {
         display: flex;
         flex-direction: column-reverse;
         gap: 16px;
      }
   }

   &__left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;

      h1 {
         font-size: 24px;
         color: #3366ff;
         line-height: 1.2;
         margin: 0 0 8px;
      }

      h2 {
         font-size: 18px;
         color: #3366ff;
         line-height: 1.25;
         margin: 0 0 14px;
      }
   }

   &__message {
      font-size: 14px;
      line-height: 1.35;
      color: #323232;
      margin: 0 0 18px;
   }

   &__right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      img {
         width: min(100%, 340px);
         height: auto;
      }
   }

   &__buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      button {
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 8px;
         min-height: 38px;
         padding: 0 14px;
         font-size: 14px;
         border: 1px solid #d6d6d6;
         border-radius: 10px;
         background-color: #ffffff;
         color: #3366ff;
         cursor: pointer;

         &:hover {
            border-color: #3366ff;
         }
      }

      img {
         width: 16px;
         height: 16px;
      }

      @media (max-width: 640px) {
         width: 100%;

         button {
            width: 100%;
         }
      }
   }

   &__logo {
      height: 16px;
      margin-top: 22px;
   }

   &__blue-bar {
      margin-top: 20px;
      height: 10px;
      background-color: #d6efff;
      width: 100%;
      border-radius: 10px;
   }
}
</style>
