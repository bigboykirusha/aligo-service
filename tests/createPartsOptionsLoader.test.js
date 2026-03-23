import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
   fetchDataWithCache: vi.fn()
}))

vi.mock(
   '~/services/createUtils',
   () => ({
      fetchDataWithCache: hoisted.fetchDataWithCache
   }),
   { virtual: true }
)

describe('create parts options loader', () => {
   beforeEach(() => {
      hoisted.fetchDataWithCache.mockReset()
      vi.resetModules()
   })

   it('returns cached options when fetchDataWithCache resolves data', async () => {
      const options = [{ id: 1, title: 'A' }]
      hoisted.fetchDataWithCache.mockResolvedValue(options)

      const { createOptionsLoader } = await import(
         '../composables/create/parts/optionsLoader'
      )
      const { safeFetchOptions } = createOptionsLoader()

      await expect(
         safeFetchOptions('key', async () => options)
      ).resolves.toEqual(options)
   })

   it('returns empty array when static fallbacks are disabled', async () => {
      hoisted.fetchDataWithCache.mockResolvedValue(null)

      const { createOptionsLoader } = await import(
         '../composables/create/parts/optionsLoader'
      )
      const { safeFetchOptions } = createOptionsLoader({
         useStaticFallbacks: false
      })

      await expect(
         safeFetchOptions('key', async () => [], [{ id: 9 }])
      ).resolves.toEqual([])
   })

   it('returns fallback when static fallbacks are enabled and request fails', async () => {
      hoisted.fetchDataWithCache.mockRejectedValue(new Error('network'))

      const { createOptionsLoader } = await import(
         '../composables/create/parts/optionsLoader'
      )
      const { safeFetchOptions } = createOptionsLoader({
         useStaticFallbacks: true
      })

      await expect(
         safeFetchOptions('key', async () => [], [{ id: 9 }])
      ).resolves.toEqual([{ id: 9 }])
   })

   it('handles direct request fallback according to strategy', async () => {
      const { createOptionsLoader } = await import(
         '../composables/create/parts/optionsLoader'
      )

      const { fetchOptionsDirect: fetchNoFallback } = createOptionsLoader({
         useStaticFallbacks: false
      })
      await expect(
         fetchNoFallback(async () => {
            throw new Error('boom')
         }, [{ id: 1 }])
      ).resolves.toEqual([])

      const { fetchOptionsDirect: fetchWithFallback } = createOptionsLoader({
         useStaticFallbacks: true
      })
      await expect(
         fetchWithFallback(async () => {
            throw new Error('boom')
         }, [{ id: 2 }])
      ).resolves.toEqual([{ id: 2 }])
   })
})
