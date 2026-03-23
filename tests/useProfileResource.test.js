import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import {
   clearProfileResourceCache,
   useProfileResource
} from '../composables/profile/useProfileResource'

describe('useProfileResource', () => {
   it('loads data and exposes success state', async () => {
      clearProfileResourceCache()

      const resource = useProfileResource({
         cacheKey: 'resource-success',
         loader: async () => ['a', 'b'],
         initialData: []
      })

      await resource.load()
      await nextTick()

      expect(resource.data.value).toEqual(['a', 'b'])
      expect(resource.status.value).toBe('success')
      expect(resource.hasError.value).toBe(false)
      expect(resource.isEmpty.value).toBe(false)
   })

   it('uses cache between loads while ttl is valid', async () => {
      clearProfileResourceCache()

      const loader = vi.fn(async () => ['cached'])

      const first = useProfileResource({
         cacheKey: 'resource-cache',
         loader,
         initialData: [],
         cacheTtlMs: 60000
      })

      await first.load()
      await nextTick()

      const second = useProfileResource({
         cacheKey: 'resource-cache',
         loader,
         initialData: [],
         cacheTtlMs: 60000
      })

      await second.load()
      await nextTick()

      expect(loader).toHaveBeenCalledTimes(1)
      expect(second.data.value).toEqual(['cached'])
   })

   it('sets error on failure and can recover on reload', async () => {
      clearProfileResourceCache()

      let shouldFail = true
      const loader = vi.fn(async () => {
         if (shouldFail) {
            throw new Error('network')
         }
         return ['ok']
      })

      const resource = useProfileResource({
         cacheKey: 'resource-error',
         loader,
         initialData: []
      })

      await expect(resource.load()).rejects.toThrow('network')
      await nextTick()

      expect(resource.hasError.value).toBe(true)
      expect(resource.status.value).toBe('error')

      shouldFail = false
      await resource.reload()
      await nextTick()

      expect(resource.data.value).toEqual(['ok'])
      expect(resource.hasError.value).toBe(false)
      expect(resource.status.value).toBe('success')
   })
})
