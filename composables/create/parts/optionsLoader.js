import { fetchDataWithCache } from '~/services/createUtils'

export const createOptionsLoader = ({
   useStaticFallbacks = false,
   errorPrefix = 'Create options load failed'
} = {}) => {
   const safeFetchOptions = async (cacheKey, request, fallback = []) => {
      try {
         const data = await fetchDataWithCache(cacheKey, request)
         if (data !== null && data !== undefined) return data
         return useStaticFallbacks ? fallback : []
      } catch (error) {
         console.error(`${errorPrefix} (${cacheKey}):`, error)
         return useStaticFallbacks ? fallback : []
      }
   }

   const fetchOptionsDirect = async (request, fallback = []) => {
      try {
         const data = await request()
         if (data !== null && data !== undefined) return data
         return useStaticFallbacks ? fallback : []
      } catch (error) {
         console.error(`${errorPrefix} (direct):`, error)
         return useStaticFallbacks ? fallback : []
      }
   }

   return {
      safeFetchOptions,
      fetchOptionsDirect
   }
}
