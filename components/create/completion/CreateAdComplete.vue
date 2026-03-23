<template>
   <div class="business" :class="{ 'business--embedded': embedded }">
      <div class="business__block">
         <div class="business__block-right">
            <img class="business__block-right--logo" :src="logo" alt="" >
            <img :src="sendComplete" alt="Картинка" >
         </div>
         <div class="business__block-left">
            <div class="business__block-left--text">
               Поздравляем! Ваше объявление будет опубликовано в ближайшее время после небольшой проверки.
               <br>
               Следить за  объявления можно не только на сайте, но и через бота в Telegram.
            </div>
            <UIButton class="business__button" variant="primary" @click="openTelegram">
               Перейти в Telegram
            </UIButton>
            <UIButton class="business__button" variant="secondary" @click="goHome">
               <span class="business__button-content">
                  <img :src="houseIcon" alt="" class="business__button-icon">
                  <span>{{ $t('business.homeLink') }}</span>
               </span>
            </UIButton>
         </div>
      </div>
   </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import UIButton from '~/components/ui/UIButton.vue'
import logo from '@/assets/images/logo.svg'
import sendComplete from '@/assets/icons/send-complite.svg'
import houseIcon from '@/assets/icons/new/house-icon.svg'

const TELEGRAM_URL = 'https://t.me/freebigboykirusha'
const router = useRouter()

defineProps({
   embedded: {
      type: Boolean,
      default: false
   }
})

defineOptions({
   name: 'CreateAdComplete'
})

const goHome = () => {
   router.push('/').catch((error) => {
      console.error('Failed to navigate home from create completion:', error)
   })
}

const openTelegram = () => {
   if (!import.meta.client) return
   window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
.business {
   position: absolute;
   background-color: #fff;
   z-index: 2000;

   &--embedded {
      position: relative;
      width: 100%;
      height: 100%;
      top: 0;
      z-index: auto;
   }

   &__block {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 40px;
      padding-top: 0;
      height: 100%;

      @media (max-width: 768px) {
         display: flex;
         padding: 24px;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         width: 100%;
      }
   }

   &__block-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: left;
      width: 100%;
      max-width: 320px;

      &--text {
         font-size: 16px;
         line-height: 20px;
         color: #323232;
         font-weight: 700;
         margin-bottom: 40px;
         text-align: center;
      }

   }

   &__block-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;

      &--logo {
         display: block;
         height: 24px;
         margin-bottom: 24px;
         max-width: 150px;
      }
   }

   &__button {
      width: 100%;

      & + & {
         margin-top: 16px;
      }
   }

   &__button-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
   }

   &__button-icon {
      width: 16px;
      height: 16px;
   }
}
</style>
