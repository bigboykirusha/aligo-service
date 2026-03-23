import { describe, expect, it, vi } from 'vitest'
import { useCreateStorePatchApplier } from '../composables/create/useCreateStorePatchApplier'

describe('create store patch applier', () => {
   it('applies local patch and returns changed count when persist is disabled', async () => {
      const createStore = {
         brand_id: 1,
         model_id: 2,
         setField: vi.fn()
      }

      const { applyCreateStorePatch } = useCreateStorePatchApplier(createStore)
      const result = await applyCreateStorePatch({
         brand_id: 1,
         model_id: 3
      })

      expect(result).toEqual({
         success: true,
         changedCount: 1
      })
      expect(createStore.model_id).toBe(3)
      expect(createStore.setField).not.toHaveBeenCalled()
   })

   it('persists only changed fields', async () => {
      const createStore = {
         brand_id: 1,
         model_id: 2,
         setField: vi.fn(async (field, value) => {
            createStore[field] = value
            return { success: true }
         })
      }

      const { applyCreateStorePatch } = useCreateStorePatchApplier(createStore)
      const result = await applyCreateStorePatch(
         {
            brand_id: 1,
            model_id: 3
         },
         { persist: true }
      )

      expect(result).toEqual({
         success: true,
         changedCount: 1
      })
      expect(createStore.setField).toHaveBeenCalledTimes(1)
      expect(createStore.setField).toHaveBeenCalledWith('model_id', 3)
      expect(createStore.model_id).toBe(3)
   })

   it('stops persisted patch and rolls back failed field when setField reports an error', async () => {
      const calls = []
      const createStore = {
         first: 1,
         second: 2,
         third: 3,
         setField: vi.fn(async (field, value) => {
            calls.push(field)
            createStore[field] = value
            if (field === 'second') {
               return { success: false, error: new Error('persist failed') }
            }
            return { success: true }
         })
      }

      const { applyCreateStorePatch } = useCreateStorePatchApplier(createStore)
      const result = await applyCreateStorePatch(
         {
            first: 10,
            second: 20,
            third: 30
         },
         { persist: true }
      )

      expect(result.success).toBe(false)
      expect(result.failedField).toBe('second')
      expect(calls).toEqual(['first', 'second'])
      expect(createStore.first).toBe(10)
      expect(createStore.second).toBe(2)
      expect(createStore.third).toBe(3)
   })

   it('stops persisted patch and rolls back field when setField throws', async () => {
      const createStore = {
         first: 1,
         second: 2,
         setField: vi.fn(async (field, value) => {
            createStore[field] = value
            if (field === 'second') {
               throw new Error('network')
            }
            return { success: true }
         })
      }

      const { applyCreateStorePatch } = useCreateStorePatchApplier(createStore)
      const result = await applyCreateStorePatch(
         {
            first: 10,
            second: 20
         },
         { persist: true }
      )

      expect(result.success).toBe(false)
      expect(result.failedField).toBe('second')
      expect(createStore.first).toBe(10)
      expect(createStore.second).toBe(2)
   })
})
