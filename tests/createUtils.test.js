import { describe, expect, it, vi } from 'vitest'
import {
   CREATE_OPTIONS_CACHE_SCHEMA_VERSION,
   DEFAULT_CREATE_OPTIONS_CACHE_TTL_MS,
   fetchDataWithCache
} from '../services/createUtils'

const createMemoryStorage = () => {
   const map = new Map()
   return {
      getItem: (key) => (map.has(key) ? map.get(key) : null),
      setItem: (key, value) => map.set(key, value),
      removeItem: (key) => map.delete(key),
      has: (key) => map.has(key)
   }
}

describe('create utils cache', () => {
   it('returns cached payload when schema and ttl are valid', async () => {
      const storage = createMemoryStorage()
      const now = Date.now()
      storage.setItem(
         'cache:key',
         JSON.stringify({
            version: CREATE_OPTIONS_CACHE_SCHEMA_VERSION,
            timestamp: now,
            data: [{ id: 1, title: 'A' }]
         })
      )

      const request = vi.fn(async () => [{ id: 2, title: 'B' }])
      const result = await fetchDataWithCache('cache:key', request, {
         isClient: true,
         storage,
         now
      })

      expect(result).toEqual([{ id: 1, title: 'A' }])
      expect(request).not.toHaveBeenCalled()
   })

   it('drops stale cache payload and refreshes from API', async () => {
      const storage = createMemoryStorage()
      const now = Date.now()
      storage.setItem(
         'cache:key',
         JSON.stringify({
            version: CREATE_OPTIONS_CACHE_SCHEMA_VERSION,
            timestamp: now - DEFAULT_CREATE_OPTIONS_CACHE_TTL_MS - 1,
            data: [{ id: 1 }]
         })
      )

      const request = vi.fn(async () => [{ id: 3 }])
      const result = await fetchDataWithCache('cache:key', request, {
         isClient: true,
         storage,
         now
      })

      expect(result).toEqual([{ id: 3 }])
      expect(request).toHaveBeenCalledTimes(1)
   })

   it('forces refresh even when cache is valid', async () => {
      const storage = createMemoryStorage()
      const now = Date.now()
      storage.setItem(
         'cache:key',
         JSON.stringify({
            version: CREATE_OPTIONS_CACHE_SCHEMA_VERSION,
            timestamp: now,
            data: [{ id: 1 }]
         })
      )

      const request = vi.fn(async () => [{ id: 4 }])
      const result = await fetchDataWithCache('cache:key', request, {
         isClient: true,
         storage,
         now,
         forceRefresh: true
      })

      expect(result).toEqual([{ id: 4 }])
      expect(request).toHaveBeenCalledTimes(1)
   })
})
