import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useAsyncData, useCookie } from '#app'
import { getAdsHistory, getAdsSimilar } from '@/services/apiClient'
import { useCityStore } from '~/store/city'
import { useUserStore } from '~/store/user'

const MAIN_PAGE_FETCH_SIZE = 19
const MAIN_PAGE_DISPLAY_SIZE = 20
const SIMILAR_PAGE_SIZE = 10
const DEFAULT_CITY_ID = '365'

const normalizeAdsPayload = (response) => ({
   ads: Array.isArray(response?.data) ? response.data : [],
   totalCount: Number(response?.totalCount || 0)
})

const mergeAdsById = (currentAds, nextAds) => {
   const seenIds = new Set()

   return [...(Array.isArray(currentAds) ? currentAds : []), ...(Array.isArray(nextAds) ? nextAds : [])].filter((ad, index) => {
      const key = ad?.id ?? `index-${index}`

      if (seenIds.has(key)) return false

      seenIds.add(key)
      return true
   })
}

export function useMainPageModel() {
   const route = useRoute()
   const cityStore = useCityStore()
   const userStore = useUserStore()

   const currentPage = ref(1)
   const isLoadingMoreMain = ref(false)
   const adsHistory = ref({ ads: [], totalCount: 0 })
   const isLoadingHistory = ref(false)
   const isDeferredReady = ref(false)
   const historyRequested = ref(false)

   const cityIdCookie = useCookie('city_id')
   const effectiveCityId = computed(() =>
      String(cityStore.selectedCity.id || cityIdCookie.value || DEFAULT_CITY_ID)
   )
   const isLoggedIn = computed(() => userStore.isLoggedIn)
   const adsDataKey = computed(
      () => `ads-main-page-${route.path}-${effectiveCityId.value}`
   )

   const fetchMainAdsPage = async (page = 1) =>
      getAdsSimilar({
         city: effectiveCityId.value,
         page,
         count: page === 1 ? MAIN_PAGE_FETCH_SIZE : MAIN_PAGE_DISPLAY_SIZE,
         order_by: 'desc'
      })

   const fetchMainPagePayload = async () => {
      const [mainRes, similarRes] = await Promise.all([
         fetchMainAdsPage(1),
         getAdsSimilar({
            not_in_this_city: effectiveCityId.value,
            count: SIMILAR_PAGE_SIZE
         })
      ])

      return {
         adsMain: normalizeAdsPayload(mainRes),
         adsSimilar: normalizeAdsPayload(similarRes)
      }
   }

   const { data: adsData, status, refresh } = useAsyncData(
      () => adsDataKey.value,
      fetchMainPagePayload,
      {
         watch: [effectiveCityId],
         server: true,
         default: () => ({
            adsMain: { ads: [], totalCount: 0 },
            adsSimilar: { ads: [], totalCount: 0 }
         })
      }
   )

   const adsMain = computed(
      () => adsData.value?.adsMain || { ads: [], totalCount: 0 }
   )
   const adsSimilar = computed(
      () => adsData.value?.adsSimilar || { ads: [], totalCount: 0 }
   )
   const isLoadingMain = computed(() => status.value === 'pending')
   const isLoadingSimilar = computed(
      () => !isDeferredReady.value || status.value === 'pending'
   )
   const mainXTotalCount = computed(() =>
      isLoadingMain.value || isLoadingMoreMain.value
         ? Math.max(MAIN_PAGE_DISPLAY_SIZE, adsMain.value.ads?.length || 0)
         : adsMain.value.totalCount
   )
   const similarXTotalCount = computed(() =>
      isLoadingSimilar.value ? SIMILAR_PAGE_SIZE : adsSimilar.value.totalCount
   )
   const showLoadMoreButton = computed(
      () =>
         !isLoadingMain.value &&
         Array.isArray(adsMain.value.ads) &&
         adsMain.value.ads.length > 0 &&
         adsMain.value.ads.length < adsMain.value.totalCount
   )
   const primaryAd = computed(() => {
      const mainAds = adsMain.value?.ads

      if (!Array.isArray(mainAds) || mainAds.length === 0) return null

      return mainAds[0]
   })
   const showPrimaryCard = computed(
      () => isLoadingMain.value || Boolean(primaryAd.value)
   )
   const showSimilarSection = computed(
      () => isDeferredReady.value || isLoadingSimilar.value || adsSimilar.value.ads.length > 0
   )
   const historySectionLoading = computed(
      () => isLoggedIn.value && (!isDeferredReady.value || isLoadingHistory.value)
   )
   const showHistorySection = computed(() => {
      if (!isLoggedIn.value) return false

      return (
         historySectionLoading.value ||
         adsHistory.value.ads.length > 0
      )
   })
   const showDeferredBannerSkeleton = computed(() => !isDeferredReady.value)
   const showDeferredInfoSkeleton = computed(() => !isDeferredReady.value)

   let deferredTimerId = null
   let idleCallbackId = null

   const revealDeferredSections = () => {
      cancelDeferredSchedule()
      isDeferredReady.value = true
   }

   const scheduleDeferredSections = () => {
      if (typeof window === 'undefined') return

      cancelDeferredSchedule()

      if ('requestIdleCallback' in window) {
         idleCallbackId = window.requestIdleCallback(revealDeferredSections, {
            timeout: 1500
         })
         return
      }

      deferredTimerId = window.setTimeout(revealDeferredSections, 300)
   }

   const cancelDeferredSchedule = () => {
      if (typeof window === 'undefined') return

      if (idleCallbackId !== null && 'cancelIdleCallback' in window) {
         window.cancelIdleCallback(idleCallbackId)
         idleCallbackId = null
      }

      if (deferredTimerId !== null) {
         window.clearTimeout(deferredTimerId)
         deferredTimerId = null
      }
   }

   const fetchHistoryAds = async () => {
      if (!isLoggedIn.value || historyRequested.value) return

      historyRequested.value = true
      isLoadingHistory.value = true

      try {
         const response = await getAdsHistory({ withHeaders: true })
         adsHistory.value = {
            ads: response.data?.map((item) => item.ads_show) || [],
            totalCount: Number(response.totalCount || 0)
         }
      } catch (error) {
         console.error('ads-history error:', error)
      } finally {
         isLoadingHistory.value = false
      }
   }

   const loadMoreMainAds = async () => {
      if (isLoadingMoreMain.value || !showLoadMoreButton.value) return

      isLoadingMoreMain.value = true

      try {
         const nextPage = currentPage.value + 1
         const response = await fetchMainAdsPage(nextPage)
         const nextPayload = normalizeAdsPayload(response)

         if (!nextPayload.ads.length) return

         adsData.value = {
            ...adsData.value,
            adsMain: {
               ads: mergeAdsById(adsMain.value.ads, nextPayload.ads),
               totalCount: nextPayload.totalCount || adsMain.value.totalCount
            }
         }

         currentPage.value = nextPage
      } catch (error) {
         console.error('ads load more error:', error)
      } finally {
         isLoadingMoreMain.value = false
      }
   }

   watch(effectiveCityId, () => {
      currentPage.value = 1
      historyRequested.value = false
      adsHistory.value = { ads: [], totalCount: 0 }
   })

   watch(
      [isDeferredReady, isLoggedIn],
      ([deferredReady, loggedIn]) => {
         if (deferredReady && loggedIn) {
            void fetchHistoryAds()
         }
      },
      { immediate: true }
   )

   onMounted(() => {
      scheduleDeferredSections()

      if (!adsMain.value.ads?.length) {
         void refresh()
      }
   })

   onBeforeUnmount(() => {
      cancelDeferredSchedule()
   })

   return {
      adsHistory,
      adsMain,
      adsSimilar,
      currentPage,
      effectiveCityId,
      isDeferredReady,
      isLoadingHistory,
      isLoadingMain,
      isLoadingMoreMain,
      isLoadingSimilar,
      isLoggedIn,
      historySectionLoading,
      loadMoreMainAds,
      mainXTotalCount,
      pageSize: MAIN_PAGE_DISPLAY_SIZE,
      primaryAd,
      refresh,
      showDeferredBannerSkeleton,
      showDeferredInfoSkeleton,
      showHistorySection,
      showLoadMoreButton,
      showPrimaryCard,
      showSimilarSection,
      similarXTotalCount
   }
}
