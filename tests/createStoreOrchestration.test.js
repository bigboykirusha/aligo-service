import { describe, expect, it, vi } from 'vitest'
import {
   applyConditionDependentCreateFields,
   applyCreateStoreFromApiData,
   getConditionDependentCreateFieldEntries,
   loadCreateStoreFromApi,
   sendCreateAdRequestWithValidation,
   updateCreateAdRequestWithValidation
} from '../store/createStore/orchestration'

describe('createStore orchestration', () => {
   it('builds condition-dependent field entries only for used cars and non-null values', () => {
      expect(
         getConditionDependentCreateFieldEntries({
            condition_id: 1,
            mileage: 100
         })
      ).toEqual([])

      expect(
         getConditionDependentCreateFieldEntries({
            condition_id: 2,
            mileage: 100,
            count_owners: null,
            state_id: 5
         })
      ).toEqual([
         ['mileage', 100],
         ['state_id', 5]
      ])

      expect(
         getConditionDependentCreateFieldEntries({
            condition_id: 2,
            mileage: '',
            count_owners: undefined,
            state_id: 0
         })
      ).toEqual([['state_id', 0]])
   })

   it('applies condition-dependent fields via injected setField in order', async () => {
      const calls = []
      await applyConditionDependentCreateFields({
         store: {
            condition_id: 2,
            mileage: 123,
            count_owners: 2,
            state_id: null
         },
         setField: async (field, value) => {
            calls.push([field, value])
         }
      })

      expect(calls).toEqual([
         ['mileage', 123],
         ['count_owners', 2]
      ])
   })

   it('validates create/update API mutations and throws on unsuccessful response', async () => {
      await expect(
         sendCreateAdRequestWithValidation({
            formData: new FormData(),
            createAdRequest: vi.fn(async () => ({ success: true, id: 10 }))
         })
      ).resolves.toEqual({ success: true, id: 10 })

      await expect(
         updateCreateAdRequestWithValidation({
            id: 7,
            formData: new FormData(),
            updateAdRequest: vi.fn(async () => ({
               success: false,
               message: 'Bad update'
            }))
         })
      ).rejects.toThrow('Bad update')

      await expect(
         sendCreateAdRequestWithValidation({
            formData: new FormData(),
            createAdRequest: vi.fn(async () => null)
         })
      ).rejects.toThrow('Failed to create advertisement.')
   })

   it('applies mapped api data to store and restores tabs/active tab', () => {
      const store = {
         activeTab: 2,
         create_flow: null,
         tabs: [],
         setActiveTab: vi.fn(),
         condition_id: null
      }

      const patch = applyCreateStoreFromApiData({
         store,
         carData: {
            id: 101,
            condition: { id: 2 },
            auto_technical_specifications: [{ brand: { id: 5 } }]
         },
         userStore: { username: 'tester' }
      })

      expect(patch.id).toBe(101)
      expect(store.id).toBe(101)
      expect(store.condition_id).toBe(2)
      expect(store.brand_id).toBe(5)
      expect(Array.isArray(store.tabs)).toBe(true)
      expect(store.tabs.length).toBeGreaterThan(0)
      expect(store.setActiveTab).toHaveBeenCalledWith(2)
   })

   it('loads and applies store data through injected getCarById request', async () => {
      const store = {
         activeTab: 1,
         tabs: [],
         setActiveTab: vi.fn()
      }
      const userStore = { username: 'u' }
      const carData = { id: 55, auto_technical_specifications: [] }
      const getCarByIdRequest = vi.fn(async (id) => ({ ...carData, id }))

      const result = await loadCreateStoreFromApi({
         id: 55,
         store,
         userStore,
         getCarByIdRequest
      })

      expect(getCarByIdRequest).toHaveBeenCalledWith(55)
      expect(result.id).toBe(55)
      expect(store.id).toBe(55)
      expect(store.setActiveTab).toHaveBeenCalledWith(1)
   })
})
