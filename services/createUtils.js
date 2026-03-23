export const CREATE_OPTIONS_CACHE_SCHEMA_VERSION = 'create-options-cache-v1'
export const DEFAULT_CREATE_OPTIONS_CACHE_TTL_MS = 1000 * 60 * 60 * 6

const isCacheValueExpired = ({ timestamp, now, ttlMs }) => {
   if (!Number.isFinite(timestamp) || !Number.isFinite(ttlMs)) return true
   if (ttlMs <= 0) return true
   return now - timestamp > ttlMs
}

const readCacheEnvelope = ({
   key,
   isClient,
   storage,
   now,
   ttlMs
}) => {
   if (!isClient || !key || !storage) return null

   try {
      const raw = storage.getItem(key)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
         storage.removeItem(key)
         return null
      }

      if (
         parsed.version !== CREATE_OPTIONS_CACHE_SCHEMA_VERSION ||
         isCacheValueExpired({
            timestamp: Number(parsed.timestamp),
            now,
            ttlMs
         })
      ) {
         storage.removeItem(key)
         return null
      }

      return parsed.data ?? null
   } catch {
      storage.removeItem(key)
      return null
   }
}

const writeCacheEnvelope = ({
   key,
   value,
   isClient,
   storage,
   now
}) => {
   if (!isClient || !key || !storage) return

   try {
      storage.setItem(
         key,
         JSON.stringify({
            version: CREATE_OPTIONS_CACHE_SCHEMA_VERSION,
            timestamp: now,
            data: value
         })
      )
   } catch {
      // Ignore storage quota/privacy mode errors and keep runtime flow alive.
   }
}

export const fetchDataWithCache = async (
   key,
   apiFunction,
   {
      ttlMs = DEFAULT_CREATE_OPTIONS_CACHE_TTL_MS,
      forceRefresh = false,
      isClient = import.meta.client,
      storage = typeof localStorage !== 'undefined' ? localStorage : null,
      now = Date.now()
   } = {}
) => {
   try {
      if (!forceRefresh) {
         const cachedData = readCacheEnvelope({
            key,
            isClient,
            storage,
            now,
            ttlMs
         })
         if (cachedData !== null) {
            return cachedData
         }
      }

      if (typeof apiFunction !== 'function') return []

      const fetchedData = await apiFunction()
      writeCacheEnvelope({
         key,
         value: fetchedData,
         isClient,
         storage,
         now
      })
      return fetchedData
   } catch (error) {
      console.error(`Error while loading cached data for ${key}:`, error)
      return []
   }
}
