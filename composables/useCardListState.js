import { computed } from 'vue'

const readSourceValue = (source, fallback) => {
   if (typeof source === 'function') return source()
   if (source && typeof source === 'object' && 'value' in source) {
      return source.value
   }
   return source ?? fallback
}

const toPositiveInteger = (value, fallback = 0) => {
   const parsed = Number(value)
   if (!Number.isFinite(parsed)) return fallback
   return Math.max(0, Math.trunc(parsed))
}

export const useCardListState = ({
   adsSource,
   isLoadingSource,
   requestedSkeletonCountSource,
   fallbackSkeletonCountSource,
   maxSkeletonsSource = 20,
   showSkeletonsWhenEmptyOnly = true
}) => {
   const normalizedAds = computed(() => {
      const ads = readSourceValue(adsSource, [])
      return Array.isArray(ads) ? ads : []
   })

   const hasAds = computed(() => normalizedAds.value.length > 0)

   const showSkeletons = computed(() => {
      const isLoading = Boolean(readSourceValue(isLoadingSource, false))
      if (!isLoading) return false
      return showSkeletonsWhenEmptyOnly ? !hasAds.value : true
   })

   const skeletonCount = computed(() => {
      const requested = toPositiveInteger(
         readSourceValue(requestedSkeletonCountSource, 0),
         0
      )
      const fallback = toPositiveInteger(
         readSourceValue(fallbackSkeletonCountSource, 1),
         1
      )
      const maxSkeletons = Math.max(
         1,
         toPositiveInteger(readSourceValue(maxSkeletonsSource, 20), 20)
      )
      const target = requested > 0 ? requested : fallback
      return Math.max(1, Math.min(target, maxSkeletons))
   })

   return {
      normalizedAds,
      hasAds,
      showSkeletons,
      skeletonCount
   }
}
