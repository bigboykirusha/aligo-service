import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'
import { useWalletStore } from '~/store/wallet'
import { PROFILE_MENU_BASE } from '@/services/profile/profileSections'

const formatCounterValue = (value) =>
   new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 2
   }).format(Number(value) || 0)

const buildWalletCounters = (counts) => {
   const counters = []
   const balance = Number(counts.walletBalance.value || 0)
   const bonuses = Number(counts.walletBonuses.value || 0)

   if (balance > 0) {
      counters.push({
         value: balance,
         displayValue: formatCounterValue(balance),
         unit: '\u20BD'
      })
   }

   if (bonuses > 0) {
      counters.push({
         value: bonuses,
         displayValue: formatCounterValue(bonuses),
         unit: '\u0411'
      })
   }

   return counters
}

const buildDefaultCounters = (id, counts) => {
   if (id === 'ads') return Number(counts.countAds.value || 0)
   if (id === 'messages') return Number(counts.countNewMessages.value || 0)
   if (id === 'notifications') {
      return Number(counts.countUnreadNotify.value || 0)
   }
   if (id === 'reviews') return Number(counts.countNewReviews.value || 0)
   return 0
}

const countersById = (id, counts) => {
   if (id === 'wallet') {
      return buildWalletCounters(counts)
   }

   const count = buildDefaultCounters(id, counts)
   return count > 0 ? [{ value: count, unit: '' }] : []
}

export const isProfileMenuItemActive = (path, item) => {
   if (!path || !item?.id) return false

   const normalizedPath = String(path).toLowerCase()

   if (item.id === 'ads') return normalizedPath.startsWith('/profile/ads')
   return normalizedPath.startsWith(String(item.link || '').toLowerCase())
}

export const useProfileMenuItems = (icons = {}) => {
   const userStore = useUserStore()
   const walletStore = useWalletStore()
   const {
      isLoggedIn,
      countAds,
      count_new_messages: countNewMessages,
      countUnreadNotify,
      count_new_reviews_about_myself: countNewReviews
   } = storeToRefs(userStore)
   const { balance: walletBalance, bonuses: walletBonuses } =
      storeToRefs(walletStore)

   const counts = {
      countAds,
      countNewMessages,
      countUnreadNotify,
      countNewReviews,
      walletBalance,
      walletBonuses
   }

   if (
      import.meta.client &&
      isLoggedIn.value &&
      !walletStore.hasWallet &&
      !walletStore.walletLoading
   ) {
      void walletStore.fetchWallet().catch(() => {})
   }

   return computed(() =>
      PROFILE_MENU_BASE.map((item) => ({
         ...item,
         icon: icons[item.id] || null,
         counters: countersById(item.id, counts),
         dividerAfter: Boolean(item.dividerAfter)
      }))
   )
}

export const pluralizeReview = (count) => {
   const normalized = Number(count || 0)
   const lastDigit = normalized % 10
   const lastTwoDigits = normalized % 100

   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return '\u043e\u0442\u0437\u044b\u0432\u043e\u0432'
   }
   if (lastDigit === 1) return '\u043e\u0442\u0437\u044b\u0432'
   if (lastDigit >= 2 && lastDigit <= 4)
      return '\u043e\u0442\u0437\u044b\u0432\u0430'
   return '\u043e\u0442\u0437\u044b\u0432\u043e\u0432'
}
