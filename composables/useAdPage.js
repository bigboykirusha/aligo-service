import { computed, ref, watch, unref } from 'vue'
import { useAsyncData, createError } from '#app'
import { useRoute } from 'vue-router'
import { useSeoMeta } from '#imports'
import { useUserStore } from '~/store/user'
import {
   getAdsSimilar,
   getAutogoodsById,
   getCarById,
   getMotoById
} from '~/services/apiClient'
import { getImageUrl } from '~/services/imageUtils'
import { buildCreateEditRouteDto } from '@/store/createStore/createCatalogHelpers'
import {
   buildAdContactProps,
   buildSeoDescription,
   buildSeoTitle,
   getAdMainCategoryId,
   getAdOwnerId,
   getListingCityId
} from '@/services/ads/adDetailsViewModel'
import desktopImage from '~/assets/images/banner-main.png'

const SITE_URL = 'https://aligo.ru'

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const getFetchRequest = (section) => {
   if (section === 'moto') return getMotoById
   if (section === 'parts' || section === 'autogoods') return getAutogoodsById
   return getCarById
}

const getPhotoPath = (photo) =>
   photo?.arr_title_size?.default ||
   photo?.arr_title_size?.preview ||
   photo?.path ||
   photo?.url ||
   ''

export function useAdPage(section = 'auto') {
   const userStore = useUserStore()
   const route = useRoute()
   const resolvedSection = computed(() =>
      String(unref(section) || 'auto').toLowerCase()
   )

   const asyncKey = computed(
      () => `adDetails-${resolvedSection.value}-${route.path}`
   )
   const fetchRequest = computed(() => getFetchRequest(resolvedSection.value))

   const {
      data: ad,
      error: fetchError,
      status
   } = useAsyncData(
      () => asyncKey.value,
      async () => {
         const rawId = route.params.id
         const adId = Array.isArray(rawId)
            ? String(rawId[0] || '').trim()
            : String(rawId || '').trim()

         if (!adId) {
            throw createError({ statusCode: 404, message: 'Объявление не найдено' })
         }

         if (!/^[a-z0-9-]+$/i.test(adId)) {
            throw createError({
               statusCode: 400,
               message: 'Некорректный идентификатор объявления'
            })
         }

         const result = await fetchRequest.value(adId)

         if (!result || result?.success === false) {
            const statusCode = Number(result?.status) || 404
            const message = result?.message || 'Объявление не найдено'
            throw createError({ statusCode, message })
         }

         return result
      },
      {
         watch: [() => route.path, () => resolvedSection.value]
      }
   )

   const adData = computed(() => (isRecord(ad.value) ? ad.value : null))
   const hasAd = computed(() => Number(adData.value?.id) > 0)
   const isOwner = computed(() => {
      const ownerId = getAdOwnerId(adData.value)
      const currentUserId = Number(userStore.userId)
      return ownerId > 0 && currentUserId > 0 && ownerId === currentUserId
   })
   const adContactProps = computed(() => buildAdContactProps(adData.value))
   const toolbarProps = computed(() =>
      adData.value
         ? {
              ...buildCreateEditRouteDto({ source: adData.value }),
              isPublished: adData.value.is_published,
              isInArchive: adData.value.is_in_archive,
              isModeration: adData.value.is_moderation,
              countGoAdPage: adData.value.statistic_view?.count_go_ad_page,
              countAddToFavorite: adData.value.statistic_view?.count_add_to_favorite,
              countWhoViewSellerContact:
                 adData.value.statistic_view?.count_who_view_seller_contact
           }
         : {}
   )

   const titleSimilar = 'Похожие объявления'
   const bannerContent = computed(() => ({
      headerText: 'Автомобили <br> под заказ из Грузии',
      desktopImage,
      altText: 'Подборка автомобилей',
      titleText: 'Посмотреть предложения'
   }))

   const adsSimilar = ref([])
   const isLoadingSimilar = ref(true)

   const loadSimilar = async () => {
      const adId = Number(adData.value?.id)
      if (!Number.isFinite(adId) || adId <= 0) {
         adsSimilar.value = []
         isLoadingSimilar.value = false
         return
      }

      const cityId = getListingCityId(adData.value)
      if (!cityId) {
         adsSimilar.value = []
         isLoadingSimilar.value = false
         return
      }

      isLoadingSimilar.value = true

      try {
         const { data } = await getAdsSimilar({
            city: cityId,
            main_category_id: getAdMainCategoryId(adData.value),
            not_this_ad_id: adId,
            page: 1,
            count: 5,
            order_by: 'desc'
         })
         adsSimilar.value = Array.isArray(data) ? data : []
      } catch (error) {
         adsSimilar.value = []
         console.error('similar ads load error', error)
      } finally {
         isLoadingSimilar.value = false
      }
   }

   watch(
      () => adData.value?.id,
      () => {
         loadSimilar()
      },
      { immediate: true }
   )

   const canonicalUrl = computed(() => {
      const normalizedPath =
         route.path === '/' ? '/' : `${route.path.replace(/\/+$/, '')}/`
      return `${SITE_URL}${normalizedPath}`
   })

   const seoImage = computed(() => {
      const firstPhoto = adData.value?.photos?.[0]
      const path = getPhotoPath(firstPhoto)
      return path ? getImageUrl(path) : ''
   })

   const seoTitle = computed(() => buildSeoTitle(adData.value))
   const seoDescription = computed(() => buildSeoDescription(adData.value))

   useSeoMeta(() => ({
      title: seoTitle.value,
      description: seoDescription.value,
      ogTitle: seoTitle.value,
      ogDescription: seoDescription.value,
      ogType: 'product',
      ogUrl: canonicalUrl.value,
      ogImage: seoImage.value || undefined,
      ogSiteName: 'Aligo',
      ogLocale: 'ru_RU',
      twitterCard: seoImage.value ? 'summary_large_image' : 'summary',
      twitterTitle: seoTitle.value,
      twitterDescription: seoDescription.value,
      twitterImage: seoImage.value || undefined
   }))

   return {
      ad: adData,
      hasAd,
      fetchError,
      status,
      isOwner,
      adContactProps,
      toolbarProps,
      titleSimilar,
      bannerContent,
      adsSimilar,
      isLoadingSimilar
   }
}
