import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'

export const useAdRoute = (routeOverride = null) => {
   const liveRoute = useRoute()
   const routeSource = computed(() => unref(routeOverride) || liveRoute)
   const route = new Proxy(
      {},
      {
         get(_, key) {
            return routeSource.value?.[key]
         }
      }
   )

   const pathSegments = computed(() =>
      String(route.path || '')
         .split('/')
         .filter(Boolean)
   )

   const slugSegments = computed(() => {
      const slug = route.params?.slug
      if (Array.isArray(slug)) return slug.filter(Boolean).map((item) => String(item))
      if (slug) return [String(slug)]
      return []
   })

   const allSegments = computed(() => [
      ...slugSegments.value,
      ...pathSegments.value
   ])

   const paramId = computed(() => {
      const raw = route.params?.id
      if (Array.isArray(raw)) return raw[0] ? String(raw[0]) : ''
      return raw ? String(raw) : ''
   })

   const adSegment = computed(
      () =>
         allSegments.value.find((segment) =>
            String(segment).toLowerCase().startsWith('ads-')
         ) || ''
   )

   const adId = computed(() => {
      if (paramId.value) return paramId.value
      return adSegment.value ? String(adSegment.value).replace(/^ads-/i, '') : ''
   })

   const isAdPage = computed(() => Boolean(adId.value))

   const section = computed(() => {
      const segments = pathSegments.value.map((segment) =>
         String(segment).toLowerCase()
      )
      if (segments.includes('auto')) return 'auto'
      if (segments.includes('moto')) return 'moto'
      if (segments.includes('parts')) return 'parts'
      return ''
   })

   return {
      route,
      pathSegments,
      slugSegments,
      allSegments,
      adSegment,
      adId,
      paramId,
      isAdPage,
      section
   }
}
