import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileSlug } from '~/composables/useProfileSlug'

const normalizeSegment = (value) => String(value || '').toLowerCase()

export const useProfileSectionTabs = ({
   sectionId,
   tabs,
   defaultTab,
   tabAliases = {},
   sectionAliases = [],
   routeBuilder,
   getRouteTab
}) => {
   const router = useRouter()
   const { route, slugSegments, isSection } = useProfileSlug()

   const normalizedSectionId = normalizeSegment(sectionId)
   const tabIds = new Set((tabs || []).map((tab) => normalizeSegment(tab?.id)))
   const normalizedSectionAliases = (sectionAliases || []).map(normalizeSegment)

   const isSectionRoute = () => {
      if (isSection(normalizedSectionId)) return true
      return normalizedSectionAliases.some((alias) => isSection(alias))
   }

   const normalizeTabId = (value) => {
      const normalized = normalizeSegment(value)
      const aliasResolved = tabAliases[normalized] || normalized
      return tabIds.has(aliasResolved) ? aliasResolved : defaultTab
   }

   const resolveTabFromRoute = () => {
      const rawTab =
         typeof getRouteTab === 'function'
            ? getRouteTab(slugSegments.value)
            : slugSegments.value[1]

      return normalizeTabId(rawTab)
   }

   const selectedTabId = ref(resolveTabFromRoute())

   const syncTabFromRoute = () => {
      const nextTab = resolveTabFromRoute()
      if (selectedTabId.value !== nextTab) {
         selectedTabId.value = nextTab
      }
      return nextTab
   }

   const buildRoute = (tabId) => {
      if (typeof routeBuilder === 'function') {
         return routeBuilder(tabId)
      }
      return `/profile/${normalizedSectionId}/${tabId}`
   }

   const handleSwitch = async (tabId) => {
      const normalizedTab = normalizeTabId(tabId)
      if (selectedTabId.value === normalizedTab) return

      selectedTabId.value = normalizedTab
      await router.replace(buildRoute(normalizedTab))
   }

   const watchRouteTab = (handler, options = {}) => {
      const { immediate = true } = options

      return watch(
         () => route.path,
         async () => {
            if (!isSectionRoute()) return
            const tabId = syncTabFromRoute()
            await handler(tabId)
         },
         { immediate }
      )
   }

   return {
      route,
      slugSegments,
      selectedTabId,
      handleSwitch,
      syncTabFromRoute,
      resolveTabFromRoute,
      watchRouteTab,
      isSectionRoute,
      isValidTab: (tabId) => tabIds.has(normalizeSegment(tabId))
   }
}
