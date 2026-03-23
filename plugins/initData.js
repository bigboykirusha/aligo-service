import { defineNuxtPlugin, useCookie } from '#app'
import { useUserStore } from '@/store/user'

export default defineNuxtPlugin(async (nuxtApp) => {
   const userStore = useUserStore()
   const token = useCookie('token').value

   if (!token) return

   await nuxtApp.runWithContext(() => userStore.bootstrapSession({ token }))
})
