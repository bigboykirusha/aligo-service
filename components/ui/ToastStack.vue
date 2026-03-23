<template>
   <div class="toast-stack">
      <TransitionGroup name="toast">
         <div
            v-for="toast in popupErrorStore.notifications"
            :key="toast.id"
            class="toast"
            :class="`toast--${toast.type}`"
         >
            <button
               v-if="toast.payload?.kind === 'chat-message'"
               type="button"
               class="toast__content toast__content--chat"
               @click="handleToastOpen(toast)"
            >
               <img
                  :src="toast.payload.avatarUrl || avatarFallback"
                  alt="avatar"
                  class="toast__avatar"
               >
               <div class="toast__body">
                  <div class="toast__title-row">
                     <p class="toast__title">
                        {{ toast.payload.title || toast.message }}
                     </p>
                  </div>
                  <p class="toast__text toast__text--chat">
                     {{ toast.payload.messageText || toast.message }}
                  </p>
               </div>
            </button>

            <p v-else class="toast__text">{{ toast.message }}</p>

            <button
               v-if="toast.payload?.kind === 'chat-message'"
               type="button"
               class="toast__action-button"
               aria-label="Перейти в чат"
               @click="handleToastAction(toast)"
            >
               <img :src="outIcon" alt="open chat">
            </button>

            <button
               v-if="toast.dismissible !== false"
               type="button"
               class="toast__close"
               aria-label="Закрыть уведомление"
               @click="popupErrorStore.removeNotification(toast.id)"
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M1.5 1.5L22.5 22.5M22.5 1.5L1.5 22.5"
                     stroke="#FFFFFF"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                  />
               </svg>
            </button>
         </div>
      </TransitionGroup>
   </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { useChatStore } from '~/store/chatStore'
import avatarFallback from '~/assets/icons/avatar-revers.svg'
import outIcon from '~/assets/icons/out.svg'

defineOptions({
   name: 'ToastStack'
})

const popupErrorStore = usePopupErrorStore()
const chatStore = useChatStore()
const router = useRouter()

const openToastChat = (toast) => {
   const payload = toast?.payload
   if (!payload || payload.kind !== 'chat-message') return

   if (payload.chat) {
      chatStore.setCurrentChat(payload.chat)
      chatStore.showChat()
      chatStore.openChat()
   }
}

const handleToastOpen = async (toast) => {
   if (import.meta.client && window.innerWidth > 768) {
      openToastChat(toast)
      popupErrorStore.removeNotification(toast.id)
      return
   }

   await handleToastAction(toast)
}

const handleToastAction = async (toast) => {
   openToastChat(toast)
   await router.push(toast?.payload?.href || '/profile/messages')
   popupErrorStore.removeNotification(toast.id)
}
</script>

<style lang="scss" scoped>
.toast-stack {
   position: fixed;
   right: 24px;
   bottom: 24px;
   display: flex;
   align-items: flex-end;
   flex-direction: column;
   gap: 12px;
   z-index: 100001;
   pointer-events: none;

   &.toast-stack--stacked {
      position: static;
      right: auto;
      bottom: auto;
      z-index: auto;
   }

   @media (max-width: 768px) {
      right: 16px;
      left: 16px;
      bottom: 86px;
      width: 100%;
      align-items: stretch;
   }
}

.toast {
   width: 420px;
   max-width: calc(100vw - 48px);
   min-height: 70px;
   border-radius: 6px;
   display: flex;
   align-items: center;
   gap: 16px;
   padding: 12px 14px;
   box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
   pointer-events: auto;

   @media (max-width: 768px) {
      width: 100%;
      padding: 16px;
      max-width: none;
      box-sizing: border-box;
   }

   &__content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: left;
      cursor: pointer;
   }

   &__content--chat:hover .toast__action {
      text-decoration: underline;
   }

   &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.18);
      border: 2px solid rgba(255, 255, 255, 0.95);
   }

   &__body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
   }

   &__title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
   }

   &__title {
      margin: 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
   }

   &__text {
      color: #fff;
      font-size: 14px;
      line-height: 18px;
      font-weight: 700;
      margin: 0;
      flex: 1;
      white-space: pre-line;
   }

   &__text--chat {
      font-weight: 500;
      opacity: 0.95;
   }

   &__close {
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      margin-bottom: auto;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
   }

   &__action-button {
      border: none;
      padding: 0;
      margin: 0;
      margin-bottom: auto;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #3366FF;
      cursor: pointer;
      flex-shrink: 0;

      img {
         width: 16px;
         height: 16px;
         filter: brightness(0) invert(1);
      }
   }
}

.toast--error {
   background: linear-gradient(135deg, #ff5f6d 0%, #ff3d57 100%);
}

.toast--warning {
   background: linear-gradient(135deg, #f9a825 0%, #f57f17 100%);
}

.toast--notification {
   background: linear-gradient(135deg, #3f7cff 0%, #2758ff 100%);
}

.toast-enter-active,
.toast-leave-active {
   transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
   opacity: 0;
   transform: translateY(8px);
}
</style>
