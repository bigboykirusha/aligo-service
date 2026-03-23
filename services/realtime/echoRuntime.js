import avatarFallback from '~/assets/icons/avatar-revers.svg'
import { CHAT_UI_TEXT, resolveChatAdInfo } from '~/services/chat/chatPresentation'
import {
   extractRealtimeChatMessages,
   isSameConversationForChat
} from '~/services/chat/chatRealtime'
import { getImageUrl } from '~/services/imageUtils'
import { relevantUser } from '~/services/userUtils.js'

const ECHO_PUSHER_KEY = 'keyForWSAligo20052012***!!!'

export const getEchoErrorStatus = (error) =>
   Number(
      error?.status ??
      error?.error?.status ??
      error?.data?.status ??
      error?.response?.status ??
      error?.code ??
      0
   ) || null

export const getEchoErrorText = (error) => {
   try {
      if (typeof error === 'string') return error
      if (error?.message) return String(error.message)
      if (error?.error?.message) return String(error.error.message)
      return JSON.stringify(error || {})
   } catch {
      return ''
   }
}

export const isEchoAuthError = (error) => {
   const status = getEchoErrorStatus(error)
   if (status === 401 || status === 403) return true

   const text = getEchoErrorText(error).toLowerCase()
   return (
      text.includes('unauth') ||
      text.includes('forbidden') ||
      text.includes('authoriz') ||
      text.includes('token')
   )
}

export const resolveEchoSessionKey = ({ userId, token }) =>
   userId && token ? `${userId}:${token}` : null

export const buildEchoConnectionOptions = ({ apiBaseUrl, token }) => ({
   broadcaster: 'pusher',
   key: ECHO_PUSHER_KEY,
   cluster: 'eu',
   wsHost: String(apiBaseUrl || '').replace(/^https?:\/\//, ''),
   wsPort: 6001,
   wssPort: 6001,
   encrypted: true,
   forceTLS: true,
   disableStats: true,
   enabledTransports: ['ws', 'wss'],
   authEndpoint: `${apiBaseUrl}/api/broadcasting/auth`,
   auth: {
      headers: {
         Accept: 'application/json',
         Authorization: `Bearer ${token}`
      }
   }
})

const findChatPreviewForMessage = (lastMessages, message) =>
   (Array.isArray(lastMessages) ? lastMessages : []).find((chat) =>
      isSameConversationForChat(chat, message)
   )

export const showIncomingChatToast = ({
   popupErrorStore,
   lastMessages,
   message
}) => {
   const matchedChat = findChatPreviewForMessage(lastMessages, message)
   const counterpart = matchedChat ? relevantUser(matchedChat) : null
   const messageText =
      String(message?.message || '').trim() || CHAT_UI_TEXT.attachment

   popupErrorStore.showChatMessage(CHAT_UI_TEXT.newMessageReceived, {
      title:
         counterpart?.username ||
         counterpart?.login ||
         CHAT_UI_TEXT.newMessageReceived,
      messageText,
      avatarUrl: getImageUrl(
         counterpart?.photo?.arr_title_size?.preview || counterpart?.photo?.path,
         avatarFallback
      ),
      chat: matchedChat
         ? {
              ...matchedChat,
              ads_info: resolveChatAdInfo(matchedChat)
           }
         : {
              ads_id: message?.ads_id ?? null,
              main_category_id: message?.main_category_id ?? null,
              from_user_id: message?.from_user_id ?? null,
              for_user_id: message?.for_user_id ?? null
           },
      href: '/profile/messages',
      dedupeKey: `chat-message-${message?.id || ''}-${message?.ads_id || ''}-${message?.from_user_id || ''}`
   })
}

const createAuthAwareErrorHandler = (label, onAuthFailure) => (error) => {
   console.error(`echo ${label} channel error:`, error)
   if (isEchoAuthError(error)) {
      onAuthFailure(error)
   }
}

export const bindEchoConnectionEvents = ({ echo, onAuthFailure }) => {
   const connection = echo?.connector?.pusher?.connection
   if (!connection?.bind) return

   connection.bind('unavailable', () => {
      console.warn('echo connection unavailable')
   })
   connection.bind('failed', () => {
      console.warn('echo connection failed')
   })
   connection.bind('disconnected', () => {
      console.warn('echo connection disconnected')
   })
   connection.bind('error', (error) => {
      console.error('echo connection error:', error)
      if (isEchoAuthError(error)) {
         onAuthFailure(error)
      }
   })
}

export const bindEchoUserChannels = ({
   echo,
   userId,
   onMessageBatch,
   onReadReceiptBatch,
   onNotification,
   onAuthFailure
}) => {
   echo.channel(`store_message.${userId}`)
      .listen('.store_message', (payload) => {
         onMessageBatch(extractRealtimeChatMessages(payload))
      })
      .error(createAuthAwareErrorHandler('message', onAuthFailure))

   echo.channel(`show_message.${userId}`)
      .listen('.show_message', (payload) => {
         onReadReceiptBatch(extractRealtimeChatMessages(payload))
      })
      .error(createAuthAwareErrorHandler('read receipt', onAuthFailure))

   echo.channel(`App.Models.User.${userId}`)
      .notification((notification) => {
         onNotification(notification)
      })
      .error(createAuthAwareErrorHandler('notifications', onAuthFailure))
}
