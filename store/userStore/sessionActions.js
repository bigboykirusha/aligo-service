import { useCookie } from '#app'
import { useCreateStore } from '../create'
import { emitAuthSessionInvalidated } from '@/services/authSessionEvents'
import { loadUserProfile } from '@/services/userService'
import {
   UNKNOWN_ERROR_MESSAGE,
   hasHydratedUserSession,
   readAuthTokenCookie,
   waitForUserFetchFinish
} from './shared'

const resetFavoritesState = (store) => {
   store.favoritesItems = []
   store.favoritesPendingItemIds = []
   store.isFavoritesLoaded = false
   store.countFavorites = 0
}

export const sessionActions = {
   invalidateSession({
      clearCookies = true,
      resetCreateStore = false,
      reason = 'manual'
   } = {}) {
      const hadSession =
         Boolean(this.isLoggedIn) ||
         Boolean(this.cachedUserData) ||
         Boolean(this.userId)

      if (clearCookies) {
         useCookie('token', { path: '/' }).value = null
         useCookie('user_id', { path: '/' }).value = null
      }

      if (resetCreateStore) {
         useCreateStore().resetParams()
      }

      resetFavoritesState(this)
      this.$reset()

      if (hadSession || reason === 'unauthorized') {
         emitAuthSessionInvalidated({ reason })
      }
   },

   async bootstrapSession({
      token: passedToken = null,
      force = false,
      useCache = true
   } = {}) {
      const effectiveToken = passedToken || readAuthTokenCookie()

      if (!effectiveToken) {
         if (this.isLoggedIn || this.cachedUserData) {
            this.invalidateSession({
               clearCookies: false,
               reason: 'unauthorized'
            })
         }
         return false
      }

      if (!force && hasHydratedUserSession(this)) {
         if (!this.hasLoadedCounts || !this.isFavoritesLoaded) {
            await this.ensureProfileSupportData()
         }
         return true
      }

      await this.fetchAndSetUserdata({
         useCache: !force && useCache,
         token: effectiveToken
      })

      return this.isLoggedIn
   },

   async fetchAndSetUserdata({
      useCache = true,
      token: passedToken = null
   } = {}) {
      const effectiveToken = passedToken || readAuthTokenCookie()
      if (this.isFetchingUser) {
         await waitForUserFetchFinish(this)
         return
      }

      try {
         if (!effectiveToken && !this.cachedUserData) {
            this.isLoggedIn = false
            resetFavoritesState(this)
            return
         }

         if (useCache && this.cachedUserData) {
            this.setUserData(this.cachedUserData)
            await this.ensureProfileSupportData()
            return
         }

         this.isFetchingUser = true

         const { user } = await loadUserProfile()

         this.setUserData(user)
         this.cachedUserData = user

         await this.ensureProfileSupportData({ force: true })
      } catch (error) {
         console.error('user data load error:', {
            message: error?.message || UNKNOWN_ERROR_MESSAGE
         })
         this.isLoggedIn = false
         this.cachedUserData = null
         resetFavoritesState(this)
      } finally {
         this.isFetchingUser = false
      }
   },

   async ensureAuthenticated({ force = false } = {}) {
      const token = readAuthTokenCookie()

      if (!token) {
         if (this.isLoggedIn || this.cachedUserData) {
            this.invalidateSession({
               clearCookies: false,
               reason: 'unauthorized'
            })
         }
         return false
      }

      if (this.isLoggedIn && !force) {
         return true
      }

      await this.bootstrapSession({
         token,
         force,
         useCache: true
      })

      if (!this.isLoggedIn) {
         this.invalidateSession({
            clearCookies: true,
            reason: 'unauthorized'
         })
      }

      return this.isLoggedIn
   }
}
