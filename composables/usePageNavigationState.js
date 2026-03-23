import { computed } from 'vue'
import { useState } from '#app'
import { useRoute } from 'vue-router'

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

export const usePageNavigationState = () => {
   const liveRoute = useRoute()
   const isPageNavigating = useState('page-navigation-pending', () => false)
   const stableRouteSnapshot = useState('page-stable-route-snapshot', () =>
      cloneRouteSnapshot(liveRoute)
   )

   const stableRoute = computed(() => stableRouteSnapshot.value)

   return {
      isPageNavigating,
      stableRoute
   }
}
