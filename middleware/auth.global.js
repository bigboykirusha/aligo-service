import { useCookie, navigateTo, defineNuxtRouteMiddleware } from '#app'
import { useUserStore } from '@/store/user'

export default defineNuxtRouteMiddleware(async (to) => {
   const token = useCookie('token')
   const isAuthenticated = Boolean(token.value)

   const requiresAuth = Boolean(to.meta?.requiresAuth)
   if (!requiresAuth) return

   const redirectToLogin = () =>
      navigateTo(
         `/authorization?redirect=${encodeURIComponent(to.fullPath)}`
      )

   if (!isAuthenticated) {
      return redirectToLogin()
   }

   const userStore = useUserStore()
   const isSessionValid = await userStore.ensureAuthenticated()
   if (!isSessionValid) {
      return redirectToLogin()
   }
})
