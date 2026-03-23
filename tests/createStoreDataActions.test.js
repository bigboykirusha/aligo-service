import { describe, expect, it, vi } from 'vitest'
import {
   autoSaveCreateField,
   autoSaveCreateFields,
   initializeCreateUserData,
   setCreateFieldWithAutosave
} from '../store/createStore/dataActions'

describe('create data actions', () => {
   it('initializes user fields from profile data', async () => {
      const store = {
         username: null,
         email: null,
         phone: null,
         latitude: null,
         longitude: null,
         currency_id: 1,
         isUserDataInitializing: false,
         isUserDataInitialized: false,
         setField: vi.fn(async (field, value) => {
            store[field] = value
            return { success: true }
         })
      }
      const userStore = {
         username: 'tester',
         unconfirmed_email: null,
         email: 'tester@mail.dev',
         phoneNumber: '+79990000000',
         latitude: 55.75,
         longitude: 37.61
      }

      await initializeCreateUserData({
         store,
         userStore
      })

      expect(store.username).toBe('tester')
      expect(store.email).toBe('tester@mail.dev')
      expect(store.phone).toBe('+79990000000')
      expect(store.latitude).toBe(55.75)
      expect(store.longitude).toBe(37.61)
      expect(store.isUserDataInitialized).toBe(true)
   })

   it('skips autosave when field does not require server setField autosave', async () => {
      const store = {
         id: 1,
         autoSaveField: vi.fn(),
         updateConditionDependentFields: vi.fn()
      }

      const result = await setCreateFieldWithAutosave({
         store,
         field: 'photos',
         value: ['file-a']
      })

      expect(result).toEqual({ success: true, skipped: true })
      expect(store.photos).toEqual(['file-a'])
      expect(store.autoSaveField).not.toHaveBeenCalled()
   })

   it('skips autosave when field value is unchanged', async () => {
      const store = {
         id: 25,
         tires_rear_width_id: null,
         autoSaveField: vi.fn(),
         updateConditionDependentFields: vi.fn()
      }

      const result = await setCreateFieldWithAutosave({
         store,
         field: 'tires_rear_width_id',
         value: null
      })

      expect(result).toEqual({ success: true, skipped: true })
      expect(store.autoSaveField).not.toHaveBeenCalled()
   })

   it('updates condition-dependent fields after successful condition autosave', async () => {
      const store = {
         id: 1,
         autoSaveField: vi.fn(async () => ({ success: true })),
         updateConditionDependentFields: vi.fn(async () => {})
      }

      await setCreateFieldWithAutosave({
         store,
         field: 'condition_id',
         value: 2
      })

      expect(store.autoSaveField).toHaveBeenCalledWith('condition_id', 2)
      expect(store.updateConditionDependentFields).toHaveBeenCalledTimes(1)
   })

   it('rolls back is_draft when autosave fails', async () => {
      const saveError = new Error('autosave failed')
      const store = {
         id: 1,
         is_draft: 1,
         autoSaveField: vi.fn(async () => {
            throw saveError
         }),
         updateConditionDependentFields: vi.fn(async () => {})
      }

      const result = await setCreateFieldWithAutosave({
         store,
         field: 'is_draft',
         value: 0
      })

      expect(result.success).toBe(false)
      expect(store.is_draft).toBe(1)
   })

   it('queues autosave calls and coalesces repeated updates for the same field', async () => {
      let resolveFirstRequest
      const firstRequest = new Promise((resolve) => {
         resolveFirstRequest = resolve
      })

      const store = {
         id: 1,
         autoSaveField: vi
            .fn()
            .mockReturnValueOnce(firstRequest)
            .mockResolvedValue({ success: true }),
         updateConditionDependentFields: vi.fn(async () => {})
      }

      const firstCallPromise = setCreateFieldWithAutosave({
         store,
         field: 'is_rain_sensor',
         value: 1
      })
      const secondCallPromise = setCreateFieldWithAutosave({
         store,
         field: 'is_rain_sensor',
         value: 0
      })
      const thirdCallPromise = setCreateFieldWithAutosave({
         store,
         field: 'is_light_sensor',
         value: 1
      })

      await Promise.resolve()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(store.autoSaveField).toHaveBeenCalledTimes(1)
      expect(store.autoSaveField).toHaveBeenNthCalledWith(
         1,
         'is_rain_sensor',
         0
      )

      resolveFirstRequest({ success: true })
      await Promise.all([firstCallPromise, secondCallPromise, thirdCallPromise])

      expect(store.autoSaveField).toHaveBeenCalledTimes(2)
      expect(store.autoSaveField).toHaveBeenNthCalledWith(
         2,
         'is_light_sensor',
         1
      )
   })

   it('returns skipped result when autosave patch is empty', async () => {
      const store = {
         id: 1,
         updateAd: vi.fn()
      }

      const response = await autoSaveCreateFields({
         store,
         patch: {}
      })

      expect(response).toEqual({ success: true, skipped: true })
      expect(store.updateAd).not.toHaveBeenCalled()
   })

   it('uses updateAd/sendAd methods for autosave mutations', async () => {
      const updateAd = vi.fn(async () => ({ success: true }))
      const sendAd = vi.fn(async () => ({
         success: true,
         id: 42,
         id_user_owner_ads: 7
      }))

      const store = {
         id: 11,
         is_draft: 1,
         condition_id: 2,
         initializeUserData: vi.fn(async () => {}),
         updateAd,
         sendAd
      }

      await autoSaveCreateField({
         store,
         field: 'amount',
         value: 1000
      })

      expect(updateAd).toHaveBeenCalledTimes(1)

      store.id = null
      await autoSaveCreateField({
         store,
         field: 'amount',
         value: 1100
      })

      expect(sendAd).toHaveBeenCalledTimes(1)
   })

   it('persists multiple fields through batched autosave request', async () => {
      const updateAd = vi.fn(async () => ({ success: true }))

      const store = {
         id: 11,
         is_draft: 1,
         condition_id: 2,
         updateAd,
         sendAd: vi.fn(async () => ({ success: true }))
      }

      await autoSaveCreateFields({
         store,
         patch: {
            brand_id: 21,
            model_id: 118
         }
      })

      expect(updateAd).toHaveBeenCalledTimes(1)
      const [requestFormData] = updateAd.mock.calls[0]
      expect(requestFormData).toBeInstanceOf(FormData)
      expect(requestFormData.get('brand_id')).toBe('21')
      expect(requestFormData.get('model_id')).toBe('118')
      expect(requestFormData.get('id')).toBe('11')
      expect(requestFormData.get('is_cancelled')).toBe('0')
   })

   it('includes create_by_user_id in autosave context for moderation create flow', async () => {
      const sendAd = vi.fn(async () => ({
         success: true,
         id: 42,
         id_user_owner_ads: 99
      }))

      const store = {
         id: null,
         is_draft: 1,
         condition_id: 2,
         create_by_user_id: 99,
         initializeUserData: vi.fn(async () => {}),
         updateAd: vi.fn(async () => ({ success: true })),
         sendAd
      }

      await autoSaveCreateFields({
         store,
         patch: {
            amount: 1500000
         }
      })

      expect(sendAd).toHaveBeenCalledTimes(1)
      const [requestFormData] = sendAd.mock.calls[0]
      expect(requestFormData.get('create_by_user_id')).toBe('99')
      expect(requestFormData.get('amount')).toBe('1500000')
   })
})
