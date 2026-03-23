import { createOptionsLoader } from '~/composables/create/parts/optionsLoader'

export const createStaticOptionsLoader = ({
   useStaticFallbacks = false,
   errorPrefix = 'Create options load failed'
} = {}) => {
   const { safeFetchOptions, fetchOptionsDirect } = createOptionsLoader({
      useStaticFallbacks,
      errorPrefix
   })

   const loadOptionGroups = async (entries = []) => {
      const results = await Promise.all(
         entries.map(async ({ key, cacheKey, request, fallback = [] }) => {
            const data = await safeFetchOptions(cacheKey, request, fallback)
            return [key, data]
         })
      )

      return Object.fromEntries(results)
   }

   return {
      safeFetchOptions,
      fetchOptionsDirect,
      loadOptionGroups
   }
}
