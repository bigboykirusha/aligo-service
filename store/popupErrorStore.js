import { defineStore } from 'pinia'

export const usePopupErrorStore = defineStore('popupErrorStore', {
   state: () => ({
      notifications: [],
      recentMessages: {},
      nextNotificationId: 1
   }),
   actions: {
      addNotification(message, type = 'notification', duration = 6000, options = {}) {
         if (!message) return

         const key =
            options.dedupeKey ||
            `${type}-${message}-${options.payload?.chat?.ads_id || ''}-${options.payload?.chat?.from_user_id || ''}`
         if (this.recentMessages[key]) return

         const id = this.nextNotificationId++
         this.notifications.push({
            id,
            message,
            type,
            payload: options.payload || null,
            actionLabel: options.actionLabel || '',
            dismissible: options.dismissible !== false
         })

         this.recentMessages[key] = true

         setTimeout(() => {
            this.removeNotification(id)
         }, duration)

         setTimeout(() => {
            delete this.recentMessages[key]
         }, 3000)
      },
      removeNotification(id) {
         this.notifications = this.notifications.filter((n) => n.id !== id)
      },
      clearNotifications() {
         this.notifications = []
         this.recentMessages = {}
      },
      showError(message) {
         this.addNotification(message, 'error')
      },
      showWarning(message) {
         this.addNotification(message, 'warning')
      },
      showNotification(message) {
         this.addNotification(message, 'notification')
      },
      showChatMessage(message, payload = {}) {
         this.addNotification(message, 'notification', 111000, {
            dedupeKey:
               payload?.dedupeKey ||
               `chat-message-${payload?.chat?.ads_id || ''}-${payload?.chat?.main_category_id || ''}-${payload?.chat?.from_user_id || ''}-${message}`,
            actionLabel: 'Перейти в чат',
            payload: {
               kind: 'chat-message',
               ...payload
            }
         })
      }
   }
})
