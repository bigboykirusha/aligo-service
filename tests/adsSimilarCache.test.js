import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiGet = vi.fn()
const executeApiRequest = vi.fn(async (request) => await request())
const getApiClient = vi.fn(() => ({ get: apiGet }))
const getResponseBody = vi.fn(() => ({}))
const getResponseDataField = vi.fn((response) => response?.data?.data)
const getResponseTotalCount = vi.fn((response) => response?.data?.total_count ?? 0)

vi.mock('../services/apiUtils', () => ({
   executeApiRequest,
   getApiClient,
   getResponseBody,
   getResponseDataField,
   getResponseTotalCount
}))

describe('getAdsSimilar cache', () => {
   beforeEach(() => {
      vi.resetModules()
      vi.clearAllMocks()
   })

   it('deduplicates simultaneous identical requests', async () => {
      apiGet.mockResolvedValue({
         data: {
            data: [{ id: 11 }],
            total_count: 1
         }
      })

      const { getAdsSimilar } = await import('../services/api/listingsApi')

      const payload = {
         main_category_id: 3,
         page: 1,
         count: 10,
         order_by: 'desc'
      }

      const [left, right] = await Promise.all([
         getAdsSimilar(payload),
         getAdsSimilar({ ...payload })
      ])

      expect(apiGet).toHaveBeenCalledTimes(1)
      expect(left).toEqual(right)
      expect(left.totalCount).toBe(1)
   })
})