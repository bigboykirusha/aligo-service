import { computed, ref, watch } from 'vue'
import { getImageUrl, isRenderableImagePath } from '@/services/imageUtils'

const failedImageUrlCache = new Set()
const loadedImageUrlCache = new Set()

const resolveImageCandidateUrl = (path, placeholder) => {
   if (!isRenderableImagePath(path)) return placeholder

   const resolvedUrl = getImageUrl(path, placeholder)

   if (!resolvedUrl || failedImageUrlCache.has(resolvedUrl)) {
      return placeholder
   }

   return resolvedUrl
}

export const useCardImageState = ({
   firstImageUrl,
   placeholder
}) => {
   const isPrimaryImageReady = ref(false)
   const hasPrimaryImageError = ref(false)
   const failedImageIndexes = ref({})
   let preloadRequestId = 0

   const hasCardImage = computed(() => Boolean(firstImageUrl.value))
   const resolvedFirstImageUrl = computed(() =>
      hasPrimaryImageError.value ? placeholder : firstImageUrl.value
   )
   const showImageSkeleton = computed(
      () =>
         hasCardImage.value &&
         !isPrimaryImageReady.value &&
         !hasPrimaryImageError.value
   )

   watch(
      firstImageUrl,
      (nextUrl) => {
         const requestId = ++preloadRequestId
         failedImageIndexes.value = {}

         if (!nextUrl) {
            isPrimaryImageReady.value = true
            hasPrimaryImageError.value = false
            return
         }

         // During SSR there is no actual image loading; keep card stable.
         if (!import.meta.client) {
            isPrimaryImageReady.value = true
            hasPrimaryImageError.value = false
            return
         }

         if (failedImageUrlCache.has(nextUrl)) {
            hasPrimaryImageError.value = true
            isPrimaryImageReady.value = true
            return
         }

         if (loadedImageUrlCache.has(nextUrl)) {
            hasPrimaryImageError.value = false
            isPrimaryImageReady.value = true
            return
         }

         isPrimaryImageReady.value = false
         hasPrimaryImageError.value = false

         const preloader = new Image()
         preloader.onload = () => {
            if (requestId !== preloadRequestId) return
            loadedImageUrlCache.add(nextUrl)
            hasPrimaryImageError.value = false
            isPrimaryImageReady.value = true
         }
         preloader.onerror = () => {
            if (requestId !== preloadRequestId) return
            failedImageUrlCache.add(nextUrl)
            hasPrimaryImageError.value = true
            isPrimaryImageReady.value = true
         }
         preloader.src = nextUrl
      },
      { immediate: true }
   )

   const getSlideImageUrl = (image, index) => {
      if (failedImageIndexes.value[index]) return placeholder
      const imagePath =
         image?.arr_title_size?.middle ||
         image?.arr_title_size?.preview ||
         image?.arr_title_size?.default ||
         image?.path

      return resolveImageCandidateUrl(imagePath, placeholder)
   }

   const handleImageLoad = (index, imageUrl = '') => {
      if (imageUrl) {
         loadedImageUrlCache.add(imageUrl)
      }

      if (index !== 0) return

      const isFallbackLoad =
         Boolean(firstImageUrl.value) && imageUrl && imageUrl !== firstImageUrl.value

      if (isFallbackLoad) {
         hasPrimaryImageError.value = true
         isPrimaryImageReady.value = true
         return
      }

      hasPrimaryImageError.value = false
      isPrimaryImageReady.value = true
   }

   const handleImageError = (index, imageUrl = '') => {
      if (imageUrl) {
         failedImageUrlCache.add(imageUrl)
      }

      failedImageIndexes.value = {
         ...failedImageIndexes.value,
         [index]: true
      }
      if (index !== 0) return
      hasPrimaryImageError.value = true
      isPrimaryImageReady.value = true
   }

   return {
      isPrimaryImageReady,
      showImageSkeleton,
      resolvedFirstImageUrl,
      getSlideImageUrl,
      handleImageLoad,
      handleImageError
   }
}
