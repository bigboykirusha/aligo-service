import { describe, expect, it } from 'vitest'
import {
   appendCreateFieldToFormData,
   isCreateFieldEmpty,
   toCreateApiError
} from '../store/createStore/helpers'
import {
   appendCreateAutosaveContextToFormData,
   appendCreateAutosaveFieldToFormData
} from '../store/createStore/autosave'
import {
   buildCreateUserInitializationData,
   finalizeCreateAutosaveCreateResponse,
   shouldSkipCreateSetFieldAutosave
} from '../store/createStore/actionHelpers'
import { resolveCreateDraftOwnerId } from '../store/createStore/createCatalogHelpers'
import { getCreateTabsByFlow } from '../store/createStore/tabs'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_PARTS_CAR_TIRES
} from '../store/createStore/flows'

describe('createStore helpers', () => {
   it('appends scalar and array values to FormData', () => {
      const formData = new FormData()

      appendCreateFieldToFormData(formData, 'title', 'abc')
      appendCreateFieldToFormData(formData, 'ids', [1, 2])
      appendCreateFieldToFormData(formData, 'nullable', null)

      expect(formData.get('title')).toBe('abc')
      expect(formData.getAll('ids[]')).toEqual(['1', '2'])
      expect(formData.get('nullable')).toBe('')
   })

   it('detects empty values and maps API error shape', () => {
      expect(isCreateFieldEmpty(null)).toBe(true)
      expect(isCreateFieldEmpty(undefined)).toBe(true)
      expect(isCreateFieldEmpty('')).toBe(true)
      expect(isCreateFieldEmpty('   ')).toBe(true)
      expect(isCreateFieldEmpty([])).toBe(true)
      expect(isCreateFieldEmpty([1])).toBe(false)
      expect(isCreateFieldEmpty('x')).toBe(false)

      const error = toCreateApiError({ success: false, message: 'Bad request' })
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Bad request')
      expect(error.response).toEqual({ success: false, message: 'Bad request' })
      expect(toCreateApiError({ success: true }, 'fallback')).toBeNull()
      expect(toCreateApiError(null, 'fallback')?.message).toBe('fallback')
   })
})

describe('create autosave helpers', () => {
   it('appends autosave context fields for create and update modes', () => {
      const createFormData = new FormData()
      appendCreateAutosaveContextToFormData(createFormData, {
         field: 'title',
         isDraft: 1,
         id: null,
         conditionId: 2
      })

      expect(createFormData.get('is_draft')).toBe('1')
      expect(createFormData.get('condition_id')).toBe('2')
      expect(createFormData.get('id')).toBeNull()

      const updateFormData = new FormData()
      appendCreateAutosaveContextToFormData(updateFormData, {
         field: 'title',
         isDraft: 0,
         id: 55,
         conditionId: 2
      })

      expect(updateFormData.get('is_draft')).toBe('0')
      expect(updateFormData.get('id')).toBe('55')
      expect(updateFormData.get('is_cancelled')).toBe('0')
      expect(updateFormData.get('condition_id')).toBeNull()
   })

   it('handles special autosave fields and falls back to generic append', () => {
      const formData = new FormData()

      appendCreateAutosaveFieldToFormData(formData, 'ids_delete_photos', 9)
      appendCreateAutosaveFieldToFormData(formData, 'color_ids', 4)
      appendCreateAutosaveFieldToFormData(formData, 'tags', ['a', 'b'])
      appendCreateAutosaveFieldToFormData(formData, 'title', 'hello')

      expect(formData.getAll('ids_delete_photos[]')).toEqual(['9'])
      expect(formData.getAll('color_ids[]')).toEqual(['4'])
      expect(formData.getAll('tags[]')).toEqual(['a', 'b'])
      expect(formData.get('title')).toBe('hello')
   })
})

describe('create tabs helpers', () => {
   it('returns correct tabs for cars and parts and clones arrays', () => {
      const carsTabs = getCreateTabsByFlow(CREATE_FLOW_CARS)
      const partsTabs = getCreateTabsByFlow(CREATE_FLOW_PARTS_CAR_TIRES)

      expect(carsTabs).toHaveLength(3)
      expect(partsTabs).toHaveLength(2)

      carsTabs[0].label = 'mutated'

      const carsTabsAgain = getCreateTabsByFlow(CREATE_FLOW_CARS)
      expect(carsTabsAgain[0].label).not.toBe('mutated')
   })
})

describe('create action helpers', () => {
   it('builds initialization fields from user profile data', () => {
      const result = buildCreateUserInitializationData({
         store: { currency_id: 1 },
         userStore: {
            username: 'u',
            unconfirmed_email: null,
            email: 'u@mail.test',
            phoneNumber: '+7000',
            latitude: 55.7,
            longitude: 37.6
         }
      })

      expect(result.localUserFields).toEqual({
         username: 'u',
         email: 'u@mail.test',
         phone: '+7000'
      })
      expect(result.fieldsToSave).toEqual({
         latitude: 55.7,
         longitude: 37.6
      })
   })

   it('keeps partial coordinates and does not require both lat/lon', () => {
      const result = buildCreateUserInitializationData({
         store: { currency_id: 1 },
         userStore: {
            username: null,
            unconfirmed_email: null,
            email: null,
            phoneNumber: null,
            latitude: null,
            longitude: 37.6
         }
      })

      expect(result.fieldsToSave).toEqual({
         longitude: 37.6
      })
   })

   it('does not overwrite already entered store values during initialization', () => {
      const result = buildCreateUserInitializationData({
         store: {
            username: 'draft-user',
            email: 'draft@mail.test',
            phone: '+7888',
            latitude: 59.9,
            longitude: 30.3
         },
         userStore: {
            username: 'profile-user',
            unconfirmed_email: null,
            email: 'profile@mail.test',
            phoneNumber: '+7999',
            latitude: 55.7,
            longitude: 37.6
         }
      })

      expect(result.localUserFields).toEqual({
         username: 'draft-user',
         email: 'draft@mail.test',
         phone: '+7888'
      })
      expect(result.fieldsToSave).toEqual({})
   })

   it('decides when setField autosave should be skipped', () => {
      expect(
         shouldSkipCreateSetFieldAutosave({
            field: 'photos',
            value: [],
            id: 1
         })
      ).toBe(true)
      expect(
         shouldSkipCreateSetFieldAutosave({
            field: 'title',
            value: '',
            id: null
         })
      ).toBe(true)
      expect(
         shouldSkipCreateSetFieldAutosave({
            field: 'condition_id',
            value: 2,
            id: null
         })
      ).toBe(true)
      expect(
         shouldSkipCreateSetFieldAutosave({
            field: 'title',
            value: 'hello',
            id: 10
         })
      ).toBe(false)
   })

   it('finalizes created autosave response and triggers user initialization', async () => {
      const store = {
         id: null,
         id_user_owner_ads: null,
         initializeUserData: () => Promise.resolve()
      }
      const response = { id: 42, id_user_owner_ads: 7 }

      const result = finalizeCreateAutosaveCreateResponse({ store, response })

      expect(result).toBe(response)
      expect(store.id).toBe(42)
      expect(store.id_user_owner_ads).toBe(7)
   })

   it('throws when create autosave response has no id', () => {
      expect(() =>
         finalizeCreateAutosaveCreateResponse({
            store: { initializeUserData: () => Promise.resolve() },
            response: {}
         })
      ).toThrow()
   })

   it('resolves draft owner id from moderation and ads payload fields', () => {
      expect(
         resolveCreateDraftOwnerId({
            ads_parameter: { user_id: '15' }
         })
      ).toBe(15)

      expect(
         resolveCreateDraftOwnerId({
            create_by_user_id: 27
         })
      ).toBe(27)
   })
})
