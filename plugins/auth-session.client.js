import { defineNuxtPlugin, useRoute, useRouter } from '#app'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { useUserStore } from '@/store/user'
import {
   buildAuthorizationRedirectPath,
   onAuthSessionInvalidated,
   registerUnauthorizedSessionResetHandler
} from '@/services/authSessionEvents'

const REDIRECT_COOLDOWN_MS = 1200
const AUTH_REQUIRED_PREFIXES = Object.freeze([
   '/profile',
   '/create',
   '/transaction'
])

export default defineNuxtPlugin(() => {
   const route = useRoute()
   const router = useRouter()
   const popupErrorStore = usePopupErrorStore()
   const userStore = useUserStore()

   let redirectInFlight = false
   let lastUnauthorizedRedirectAt = 0

   registerUnauthorizedSessionResetHandler(({ reason = 'unauthorized' } = {}) => {
      userStore.invalidateSession({
         clearCookies: false,
         reason
      })
   })

   const routeRequiresAuth = () => {
      if (route.meta?.requiresAuth) return true

      const path = String(route.path || '').toLowerCase()
      return AUTH_REQUIRED_PREFIXES.some(
         (prefix) => path === prefix || path.startsWith(`${prefix}/`)
      )
   }

   onAuthSessionInvalidated(async ({ reason } = {}) => {
      if (reason !== 'unauthorized') return
      if (route.path.startsWith('/authorization')) return
      if (!routeRequiresAuth()) return

      const now = Date.now()
      if (
         redirectInFlight ||
         now - lastUnauthorizedRedirectAt < REDIRECT_COOLDOWN_MS
      ) {
         return
      }
      lastUnauthorizedRedirectAt = now

      popupErrorStore.showWarning('РЎРµСЃСЃРёСЏ РёСЃС‚РµРєР»Р°. Р’РѕР№РґРёС‚Рµ СЃРЅРѕРІР°.')

      const target = buildAuthorizationRedirectPath(route.fullPath || '/')
      if (target === route.fullPath) return

      redirectInFlight = true
      try {
         await router.replace(target)
      } catch (error) {
         console.error('auth session redirect error:', error)
      } finally {
         setTimeout(() => {
            redirectInFlight = false
         }, 300)
      }
   })
})
