import { computed, ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useChatStore } from '~/store/chatStore'
import { getUser, seeContact } from '~/services/apiClient'
import {
   formatCardPhone,
   formatCardUsername
} from '~/services/cards/cardPresentation'

export function useAdCardActions(cardSource) {
   const route = useRoute()
   const router = useRouter()
   const userStore = useUserStore()
   const chatStore = useChatStore()

   const phone = ref('')
   const showPhone = ref(false)

   const card = computed(() => unref(cardSource) || {})
   const isLoggedIn = computed(() => userStore.isLoggedIn)
   const isOwnAd = computed(
      () => Number(card.value?.userId) === Number(userStore.userId)
   )
   const isNotOwnAd = computed(() => !isOwnAd.value)
   const formattedPhone = computed(() => formatCardPhone(phone.value))

   const toggleLoginModal = () => {
      router.push({
         path: '/authorization',
         query: { redirect: route.fullPath || '/' }
      })
   }

   const prepareChatData = async () => {
      if (!card.value?.userId || !card.value?.id) return

      const userData = await getUser(card.value.userId)

      chatStore.setCurrentChat({
         ads_info: card.value.displayTitle,
         ads_photo: [
            {
               arr_title_size: {
                  preview: card.value.images?.[0]?.arr_title_size?.preview
               }
            }
         ],
         for_user: {
            id: card.value.userId,
            photo: {
               arr_title_size: {
                  preview: userData?.photo?.arr_title_size?.preview
               }
            },
            username: formatCardUsername(card.value.username)
         },
         from_user: {
            id: userStore.userId
         },
         ads_id: card.value.id,
         ads_amount: card.value.price,
         main_category_id: Number(card.value.mainCategoryId) || 1
      })

      chatStore.openChat(router)

      if (import.meta.client && window.innerWidth < 768) {
         router.push('/profile/messages')
      }
   }

   const fetchPhoneNumber = async () => {
      if (!card.value?.id) return

      const response = await seeContact({
         ads_id: card.value.id,
         main_category_id: Number(card.value.mainCategoryId) || 1
      })

      if (response?.success && response?.phone) {
         phone.value = response.phone
         showPhone.value = true
      }
   }

   const makeCall = () => {
      if (!phone.value || !import.meta.client) return

      window.location.href = `tel:${phone.value}`
   }

   const handleMessageClick = async () => {
      try {
         await prepareChatData()
      } catch (error) {
         console.error('Ошибка при подготовке данных чата:', error)
      }
   }

   const handleCallClick = async ({ autoCallAfterFetch = true } = {}) => {
      try {
         if (showPhone.value) {
            makeCall()
            return
         }

         await fetchPhoneNumber()

         if (autoCallAfterFetch) {
            makeCall()
         }
      } catch (error) {
         console.error('Ошибка при получении телефона продавца:', error)
      }
   }

   return {
      formattedPhone,
      handleCallClick,
      handleMessageClick,
      isLoggedIn,
      isNotOwnAd,
      showPhone,
      toggleLoginModal
   }
}
