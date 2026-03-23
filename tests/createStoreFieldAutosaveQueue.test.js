import { describe, expect, it, vi } from 'vitest'
import { enqueueCreateFieldAutosave } from '../store/createStore/fieldAutosaveQueue'

describe('create field autosave queue', () => {
   it('coalesces repeated updates for the same field', async () => {
      const store = {}
      const persist = vi.fn(async () => ({ success: true }))

      const first = enqueueCreateFieldAutosave({
         store,
         field: 'amount',
         value: 100,
         persist
      })
      const second = enqueueCreateFieldAutosave({
         store,
         field: 'amount',
         value: 200,
         persist
      })

      await Promise.all([first, second])

      expect(persist).toHaveBeenCalledTimes(1)
      expect(persist).toHaveBeenCalledWith('amount', 200)
   })

   it('batches different fields into a single persistBatch mutation', async () => {
      const store = {}
      const persist = vi.fn(async () => ({ success: true }))
      const persistBatch = vi.fn(async (entries) => ({
         success: true,
         entries
      }))

      const first = enqueueCreateFieldAutosave({
         store,
         field: 'brand_id',
         value: 10,
         persist,
         persistBatch
      })
      const second = enqueueCreateFieldAutosave({
         store,
         field: 'model_id',
         value: 20,
         persist,
         persistBatch
      })

      const [firstResponse, secondResponse] = await Promise.all([first, second])

      expect(persistBatch).toHaveBeenCalledTimes(1)
      expect(persistBatch).toHaveBeenCalledWith([
         ['brand_id', 10],
         ['model_id', 20]
      ])
      expect(persist).not.toHaveBeenCalled()
      expect(firstResponse).toEqual(secondResponse)
   })
})
