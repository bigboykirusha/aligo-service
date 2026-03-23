import { getMotosFilters } from '@/services/apiClient'

const createEmptyFilteredMotosResponse = () => ({
   data: [],
   totalCount: 0
})

const MOTO_SEARCH_CACHE_TTL_MS = 15_000
const motoSearchCache = new Map()
const motoSearchPending = new Map()

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

const buildMotoPayloadCacheKey = (payload) =>
   JSON.stringify(normalizeCacheValue(payload && typeof payload === 'object' ? payload : {}))

export const fetchFilteredMotosByPayload = async (payload) => {
   const cacheKey = buildMotoPayloadCacheKey(payload)
   const cachedEntry = motoSearchCache.get(cacheKey)
   const now = Date.now()

   if (cachedEntry && now - cachedEntry.timestamp <= MOTO_SEARCH_CACHE_TTL_MS) {
      return cachedEntry.value
   }

   if (motoSearchPending.has(cacheKey)) {
      return motoSearchPending.get(cacheKey)
   }

   const pending = (async () => {
      try {
         const filteredMotos = await getMotosFilters(payload)
         const normalized = {
            data: Array.isArray(filteredMotos?.data) ? filteredMotos.data : [],
            totalCount: Number(filteredMotos?.totalCount || 0)
         }

         motoSearchCache.set(cacheKey, {
            timestamp: Date.now(),
            value: normalized
         })

         return normalized
      } catch (error) {
         console.error('Failed to fetch filtered motos.', error)
         return createEmptyFilteredMotosResponse()
      } finally {
         motoSearchPending.delete(cacheKey)
      }
   })()

   motoSearchPending.set(cacheKey, pending)

   try {
      return await pending
   } finally {
      if (motoSearchCache.size > 50) {
         const oldestKey = motoSearchCache.keys().next().value
         if (oldestKey) motoSearchCache.delete(oldestKey)
      }
   }
}
