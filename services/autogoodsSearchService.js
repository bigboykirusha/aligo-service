import { getAutogoodsFiltered } from '@/services/apiClient'

const createEmptyFilteredAutogoodsResponse = () => ({
   data: [],
   totalCount: 0,
   seo: null
})

const AUTOGOODS_SEARCH_CACHE_TTL_MS = 15_000
const autogoodsSearchCache = new Map()
const autogoodsSearchPending = new Map()

const normalizeCacheValue = (value) => {
   if (Array.isArray(value)) {
      return value.map((item) => normalizeCacheValue(item))
   }
   if (value && typeof value === 'object') {
      return Object.keys(value)
         .sort()
         .reduce((acc, key) => {
            acc[key] = normalizeCacheValue(value[key])
            return acc
         }, {})
   }
   return value ?? null
}

const buildAutogoodsPayloadCacheKey = (payload) =>
   JSON.stringify(normalizeCacheValue(payload && typeof payload === 'object' ? payload : {}))

export const fetchFilteredAutogoodsByPayload = async (payload) => {
   const cacheKey = buildAutogoodsPayloadCacheKey(payload)
   const cachedEntry = autogoodsSearchCache.get(cacheKey)
   const now = Date.now()

   if (cachedEntry && now - cachedEntry.timestamp <= AUTOGOODS_SEARCH_CACHE_TTL_MS) {
      return cachedEntry.value
   }

   if (autogoodsSearchPending.has(cacheKey)) {
      return autogoodsSearchPending.get(cacheKey)
   }

   const pending = (async () => {
      try {
         const filteredAutogoods = await getAutogoodsFiltered(payload)
         const normalized = {
            data: Array.isArray(filteredAutogoods?.data)
               ? filteredAutogoods.data
               : [],
            totalCount: Number(filteredAutogoods?.totalCount || 0),
            seo: filteredAutogoods?.seo || null
         }

         autogoodsSearchCache.set(cacheKey, {
            timestamp: Date.now(),
            value: normalized
         })

         return normalized
      } catch (error) {
         console.error('Failed to fetch filtered autogoods.', error)
         return createEmptyFilteredAutogoodsResponse()
      } finally {
         autogoodsSearchPending.delete(cacheKey)
      }
   })()

   autogoodsSearchPending.set(cacheKey, pending)

   try {
      return await pending
   } finally {
      if (autogoodsSearchCache.size > 50) {
         const oldestKey = autogoodsSearchCache.keys().next().value
         if (oldestKey) autogoodsSearchCache.delete(oldestKey)
      }
   }
}
