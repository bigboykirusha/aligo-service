import { defineNuxtPlugin, useRoute, useRouter, useState } from '#app'
import { watch } from 'vue'

const cloneRouteSnapshot = (route) => ({
   path: String(route?.path || '/'),
   fullPath: String(route?.fullPath || route?.path || '/'),
   params:
      route?.params && typeof route.params === 'object'
         ? structuredClone(route.params)
         : {},
   query:
      route?.query && typeof route.query === 'object'
         ? structuredClone(route.query)
         : {}
})

export default defineNuxtPlugin((nuxtApp) => {
   const router = useRouter()
   const route = useRoute()

   const isPageNavigating = useState('page-navigation-pending', () => false)
   const stableRouteSnapshot = useState('page-stable-route-snapshot', () =>
      cloneRouteSnapshot(route)
   )

   router.beforeEach(() => {
      isPageNavigating.value = true
   })

   router.afterEach((to, from, failure) => {
      if (failure) {
         stableRouteSnapshot.value = cloneRouteSnapshot(router.currentRoute.value)
         isPageNavigating.value = false
         return
      }

      const isQueryOrHashOnlyNavigation =
         String(to?.path || '') === String(from?.path || '') &&
         String(to?.fullPath || '') !== String(from?.fullPath || '')

      if (!isQueryOrHashOnlyNavigation) return

      stableRouteSnapshot.value = cloneRouteSnapshot(to)
      isPageNavigating.value = false
   })

   nuxtApp.hook('page:start', () => {
      isPageNavigating.value = true
   })

   nuxtApp.hook('page:finish', () => {
      stableRouteSnapshot.value = cloneRouteSnapshot(router.currentRoute.value)
      isPageNavigating.value = false
   })

   nuxtApp.hook('page:error', () => {
      stableRouteSnapshot.value = cloneRouteSnapshot(router.currentRoute.value)
      isPageNavigating.value = false
   })

   router.onError(() => {
      stableRouteSnapshot.value = cloneRouteSnapshot(router.currentRoute.value)
      isPageNavigating.value = false
   })

   watch(
      () => route.fullPath,
      () => {
         if (!isPageNavigating.value) {
            stableRouteSnapshot.value = cloneRouteSnapshot(route)
         }
      },
      { immediate: true }
   )
})
