import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCityStore } from '~/store/city'
import { getCarsSearch, getCars } from '~/services/apiClient'
import { useAsyncData } from '#app'
import { debounce } from '~/utils/performance'

export const usePaginatedSearch = async () => {
   const route = useRoute()
   const cityStore = useCityStore()

   const savedCity = computed(() => cityStore.selectedCity)
   const query = ref(route.query.query || '')

   const currentPage = ref(1)
   const totalItems = ref(0)
   const pageSize = ref(20)
   const cityKey = computed(() => String(savedCity.value?.id || savedCity.value?.translit || 'default'))
   const mainAdsKey = computed(() => `search-main-ads-${cityKey.value}`)
   const freshAdsKey = computed(() => `search-fresh-ads-${cityKey.value}`)

   const {
      data: asyncMainAds,
      status: statusMain,
      refresh: refreshMainAds
   } = await useAsyncData(
      () => mainAdsKey.value,
      async () => {
         if (!query.value) {
            totalItems.value = 0
            return { data: [], totalCount: 0 }
         }

         const { data, totalCount } = await getCarsSearch({
            searchQuery: query.value,
            page: currentPage.value,
            count: pageSize.value
         })

         totalItems.value = totalCount
         return { data, totalCount }
      },
      {
         server: false,
         immediate: false
      }
   )

   const isLoadingMain = computed(() => statusMain.value === 'pending')
   const adsMain = computed(() => asyncMainAds.value?.data || [])

   const { data: asyncFreshAds, status: statusFresh } = await useAsyncData(
      () => freshAdsKey.value,
      async () => {
         const { data } = await getCars({ count: 10 })
         return data
      },
      {
         watch: [savedCity]
      }
   )

   const isLoadingFresh = computed(() => statusFresh.value === 'pending')
   const ads = computed(() => asyncFreshAds.value || [])

   const changePage = async (page) => {
      if (page < 1 || page > Math.ceil(totalItems.value / pageSize.value)) return
      currentPage.value = page
      await refreshMainAds()
   }

   const debouncedSearch = debounce(async (newQuery) => {
      query.value = newQuery || ''
      currentPage.value = 1
      await refreshMainAds()
   }, 300)

   watch(
      () => route.query.query,
      debouncedSearch
   )

   watch(savedCity, async () => {
      if (!query.value) return
      currentPage.value = 1
      await refreshMainAds()
   })

   onMounted(async () => {
      if (query.value) {
         await refreshMainAds()
      }
   })

   return {
      savedCity,
      query,
      currentPage,
      totalItems,
      pageSize,
      isLoadingMain,
      adsMain,
      isLoadingFresh,
      ads,
      changePage
   }
}

