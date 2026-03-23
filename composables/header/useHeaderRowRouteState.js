import { computed } from 'vue'

export const useHeaderRowRouteState = ({ route, section, isAdPage }) => {
   const normalizePath = (value) => {
      const path = String(value || '/').replace(/\/+$/, '')
      return path || '/'
   }

   const getPathSegments = (value) =>
      normalizePath(value)
         .split('/')
         .filter(Boolean)
         .map((segment) => segment.toLowerCase())

   const getRouteQueryScalar = (query, key) => {
      const value = query?.[key]
      return Array.isArray(value) ? value[0] : value
   }

   const hasCreateFormQuery = (query = {}) => {
      const createFormQueryKeys = [
         'id',
         'main_category_id',
         'sub_category_id',
         'last_category_id'
      ]

      return createFormQueryKeys.some((key) => {
         const value = getRouteQueryScalar(query, key)
         return value !== null && value !== undefined && value !== ''
      })
   }

   const isAuthorizationPage = computed(() =>
      normalizePath(route.path).includes('/authorization')
   )

   const isProfilePage = computed(() =>
      normalizePath(route.path).includes('/profile')
   )

   const isCreatePage = computed(() => normalizePath(route.path).includes('/create'))
   const isCreateAdPage = computed(() => {
      const path = normalizePath(route.path)
      if (!path.includes('/create')) return false
      return hasCreateFormQuery(route.query)
   })

   const normalizedPath = computed(() => normalizePath(route.path))
   const normalizedPathSegments = computed(() => getPathSegments(route.path))

   const matchesTopLevelPath = (segment) =>
      computed(() => normalizedPathSegments.value.includes(segment))

   const isReportPage = computed(() => {
      const path = normalizedPath.value.toLowerCase()

      return (
         path === '/report' ||
         path.startsWith('/report/') ||
         path === '/avtohistory' ||
         path.startsWith('/avtohistory/')
      )
   })

   const isCarPage = computed(() => section.value === 'auto' && isAdPage.value)
   const isAutoPage = computed(() => section.value === 'auto' && !isAdPage.value)

   const isPurchaseTransactionPage = computed(() => {
      const path = normalizedPath.value.toLowerCase()
      return path === '/transaction' || path.startsWith('/transaction/')
   })

   const isWalletTransactionPage = computed(() => {
      const path = normalizedPath.value.toLowerCase()
      return path.startsWith('/profile/wallet/transaction/')
   })

   const isTransactionPage = computed(
      () => isPurchaseTransactionPage.value || isWalletTransactionPage.value
   )

   const isSearchPage = computed(() => {
      const path = normalizedPath.value
      return path === '/search' || path.endsWith('/search')
   })

   const isBusinessPage = computed(() => {
      const path = normalizedPath.value
      return path === '/business' || path.startsWith('/business/')
   })

   const isPartsPage = matchesTopLevelPath('parts')
   const isMotoPage = matchesTopLevelPath('moto')
   const isCatalogPage = computed(
      () => isAutoPage.value || isPartsPage.value || isMotoPage.value
   )

   const isUserPage = computed(
      () =>
         normalizedPath.value === '/user' ||
         normalizedPath.value.startsWith('/user/')
   )

  const isNoMobileOffsetPage = computed(
      () =>
         isReportPage.value ||
         isProfilePage.value ||
         isPartsPage.value ||
         isMotoPage.value ||
         isUserPage.value ||
         isBusinessPage.value ||
         normalizedPath.value === '/wip'
   )

   const isHomePage = computed(() => {
      if (normalizedPath.value === '/') return true

      const cityParam = String(route.params?.city || '').toLowerCase()
      if (!cityParam) return false

      const segments = normalizedPath.value.split('/').filter(Boolean)
      return segments.length === 1 && segments[0].toLowerCase() === cityParam
   })

   return {
      isAuthorizationPage,
      isProfilePage,
      isCreatePage,
      isCreateAdPage,
      isReportPage,
      isCarPage,
      isAutoPage,
      isPurchaseTransactionPage,
      isWalletTransactionPage,
      isTransactionPage,
      isSearchPage,
      isBusinessPage,
      isCatalogPage,
      normalizedPath,
      normalizedPathSegments,
      isPartsPage,
      isMotoPage,
      isUserPage,
      isNoMobileOffsetPage,
      isHomePage
   }
}
