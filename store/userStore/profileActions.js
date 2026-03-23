import {
   loadUserCounts,
   updateUserProfile,
   logoutCurrentUser
} from '@/services/userService'
import {
   UNKNOWN_ERROR_MESSAGE,
   applyUserCounts,
   sanitizeUserDataPatch
} from './shared'

const USER_COPY = Object.freeze({
   updateProfileFailed: 'Не удалось обновить профиль.',
   emptyUsername: 'Имя не может быть пустым'
})

export const profileActions = {
   setUserData(data) {
      this.$patch({
         ...sanitizeUserDataPatch(data),
         isLoggedIn: true
      })
   },

   setCounts(data) {
      applyUserCounts(this, data)
   },

   async fetchUserCounts({ force = false } = {}) {
      if (this.hasLoadedCounts && !force) return

      try {
         const data = await loadUserCounts()
         this.setCounts(data)
         this.hasLoadedCounts = true
      } catch (error) {
         console.error('fetchUserCounts error:', {
            message: error?.message || UNKNOWN_ERROR_MESSAGE
         })
      }
   },

   async ensureProfileSupportData({ force = false } = {}) {
      await this.fetchUserCounts({ force })
   },

   async updateProfile(fields) {
      try {
         await updateUserProfile(fields)
         await this.fetchAndSetUserdata({ useCache: false })
         return { success: true }
      } catch (error) {
         console.error('updateProfile error:', error)
         return {
            success: false,
            error,
            message: error?.message || USER_COPY.updateProfileFailed
         }
      }
   },

   async updateUsername(username) {
      if (!username.trim()) throw new Error(USER_COPY.emptyUsername)
      await this.updateProfile({ username })
   },

   setCountNewMessages() {
      this.count_new_messages += 1
   },

   setCountUnreadNotify() {
      this.countUnreadNotify += 1
   },

   decCountUnreadNotify() {
      this.countUnreadNotify = Math.max(0, this.countUnreadNotify - 1)
   },

   async clearUserdata() {
      try {
         await logoutCurrentUser()
         this.invalidateSession({
            resetCreateStore: true,
            reason: 'logout'
         })
      } catch (error) {
         console.error('clearUserdata error:', error)
      }
   }
}
