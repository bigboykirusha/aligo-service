import { useCookie } from '#app'

export const UNKNOWN_ERROR_MESSAGE = 'Неизвестная ошибка'

export const createUserState = () => ({
   login: null,
   userId: null,
   email: null,
   unconfirmed_email: null,
   phoneNumber: null,
   isLoggedIn: false,
   username: null,
   uniqueCode: null,
   latitude: null,
   longitude: null,
   city_id: null,
   city_name: null,
   address: null,
   photo: null,
   createdAt: null,
   grade: 0,
   countAds: 0,
   countFavorites: 0,
   countUnreadNotify: 0,
   count_new_messages: 0,
   countDrafts: 0,
   countReviews: 0,
   count_new_reviews_about_myself: 0,
   hasLoadedCounts: false,
   favoritesItems: [],
   favoritesPendingItemIds: [],
   isFavoritesLoaded: false,
   isFetchingUser: false,
   cachedUserData: null
})

export const normalizeFavoriteId = (value) => {
   if (value === null || value === undefined) return null
   const raw = String(value).trim()
   if (!raw || raw === '0') return null
   return raw
}

export const normalizeMainCategoryId = (value) => {
   const parsed = Number(value)
   return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export const extractFavoriteId = (item) =>
   normalizeFavoriteId(item?.ads_show?.id ?? item?.ads_id ?? item?.id ?? item)

export const readAuthTokenCookie = () =>
   useCookie('token', { path: '/' }).value || null

export const waitForUserFetchFinish = (store, timeoutMs = 5000) =>
   new Promise((resolve) => {
      if (!store?.isFetchingUser) {
         resolve()
         return
      }

      const startedAt = Date.now()
      const tick = () => {
         if (!store.isFetchingUser || Date.now() - startedAt >= timeoutMs) {
            resolve()
            return
         }
         setTimeout(tick, 25)
      }

      tick()
   })

export const sanitizeUserDataPatch = (data) =>
   Object.fromEntries(
      Object.entries(data || {}).filter(([, value]) => value !== undefined)
   )

export const hasHydratedUserSession = (store) =>
   Boolean(store?.isLoggedIn && (store?.cachedUserData || store?.userId))

export const applyUserCounts = (store, data) => {
   if (!data || !data.success) return

   store.countAds = data.count_ads ?? store.countAds
   store.countFavorites = data.count_favorites ?? store.countFavorites
   store.countUnreadNotify =
      data.count_unread_notify ?? store.countUnreadNotify
   store.count_new_messages =
      data.count_new_messages ?? store.count_new_messages
   store.countDrafts = data.count_drafts ?? store.countDrafts
   store.countReviews =
      data.count_reviews_about_myself ?? store.countReviews
   store.count_new_reviews_about_myself =
      data.count_new_reviews_about_myself ??
      store.count_new_reviews_about_myself
}
