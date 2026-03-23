import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/apiClient.js', () => ({
   deleteAds: vi.fn(),
   takeOffPublication: vi.fn(),
   dismissFromPublicationByOwnerAds: vi.fn(),
   publishAgainSelected: vi.fn()
}))

describe('selectedAds payload normalization', () => {
   beforeEach(() => {
      vi.resetModules()
   })

   it('preserves main category id from entries', async () => {
      const { normalizeAdsPayload } = await import('../store/selectedAds')

      expect(
         normalizeAdsPayload([
            { ads_id: 1004, main_category_id: 2 },
            { id: 25, mainCategoryId: 3 }
         ])
      ).toEqual([
         { ads_id: 1004, main_category_id: 2 },
         { ads_id: 25, main_category_id: 3 }
      ])
   })

   it('keeps backward-compatible fallback for plain ids', async () => {
      const { normalizeAdsPayload } = await import('../store/selectedAds')

      expect(normalizeAdsPayload([42])).toEqual([
         { ads_id: 42, main_category_id: 1 }
      ])
   })
})
