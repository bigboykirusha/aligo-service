import { beforeEach, describe, expect, it, vi } from 'vitest'

const getAutogoodsFiltered = vi.fn()

vi.mock('@/services/apiClient', () => ({
   getAutogoodsFiltered
}))

describe('autogoodsSearchService', () => {
   beforeEach(() => {
      vi.resetModules()
      vi.clearAllMocks()
   })

   it('deduplicates simultaneous requests with the same payload', async () => {
      getAutogoodsFiltered.mockResolvedValue({
         data: [{ id: 1 }],
         totalCount: 1,
         seo: null
      })

      const { fetchFilteredAutogoodsByPayload } = await import(
         '../services/autogoodsSearchService'
      )

      const payload = {
         page: 1,
         count: 15,
         sub_category_id: 10,
         last_category_id: 7,
         amount_from: 1,
         amount_to: 2000
      }

      const [left, right] = await Promise.all([
         fetchFilteredAutogoodsByPayload(payload),
         fetchFilteredAutogoodsByPayload({ ...payload })
      ])

      expect(getAutogoodsFiltered).toHaveBeenCalledTimes(1)
      expect(left).toEqual(right)
      expect(left.totalCount).toBe(1)
   })
})
