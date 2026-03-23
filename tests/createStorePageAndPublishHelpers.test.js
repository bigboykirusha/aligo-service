import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   isTwoStepCreateFlow,
   shouldShowPhotosOnCreateAdStep
} from '../store/createStore/flows'
import {
   canLoadCreateDraftForUser,
   resolveCreateFlowFromRouteQuery,
   shouldHydrateCreateDraftFromRoute
} from '../store/createStore/routeHelpers'
import {
   buildCreateAdRequiredFieldsMessage,
   buildCreatePrePublishUserProfileUpdates,
   isCreateUserProfileUpdateSuccessful,
   shouldRequestCreateEmailConfirmation
} from '../store/createStore/publishHelpers'

describe('create flow ui helpers', () => {
   it('classifies two-step flows and photo visibility', () => {
      expect(isTwoStepCreateFlow(CREATE_FLOW_CARS)).toBe(false)
      expect(isTwoStepCreateFlow(CREATE_FLOW_PARTS_MOTOR_OIL)).toBe(true)
      expect(isTwoStepCreateFlow(CREATE_FLOW_PARTS_CAR_TIRES)).toBe(true)
      expect(isTwoStepCreateFlow(CREATE_FLOW_MOTO_MOTORCYCLES)).toBe(true)
      expect(isTwoStepCreateFlow(CREATE_FLOW_MOTO_SCOOTERS)).toBe(true)

      expect(shouldShowPhotosOnCreateAdStep(CREATE_FLOW_CARS)).toBe(false)
      expect(shouldShowPhotosOnCreateAdStep(CREATE_FLOW_PARTS_MOTOR_OIL)).toBe(true)
      expect(shouldShowPhotosOnCreateAdStep(CREATE_FLOW_PARTS_FULL_WHEELS)).toBe(true)
      expect(shouldShowPhotosOnCreateAdStep(CREATE_FLOW_MOTO_MOTORCYCLES)).toBe(
         true
      )
   })
})

describe('create route helpers', () => {
   it('resolves flow by category ids', () => {
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 2
         })
      )
         .toBe(CREATE_FLOW_PARTS_CAR_DISKS)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 1
         })
      )
         .toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 5
         })
      )
         .toBe(CREATE_FLOW_PARTS_MOTO_TIRES)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            sub_category_id: 10,
            last_category_id: 7
         })
      )
         .toBe(CREATE_FLOW_PARTS_MOTOR_OIL)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 2,
            sub_category_id: 1
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(resolveCreateFlowFromRouteQuery({})).toBe(CREATE_FLOW_CARS)
   })

   it('supports array query values from router', () => {
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: ['3'],
            sub_category_id: ['1'],
            last_category_id: ['1']
         })
      ).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(
         canLoadCreateDraftForUser({
            routeQuery: { id: ['10'], id_user_owner_ads: ['5'] },
            userId: 5
         })
      ).toEqual({
         canLoad: true,
         routeId: '10'
      })
   })

   it('checks whether route draft can be loaded for current user', () => {
      expect(canLoadCreateDraftForUser({ routeQuery: {}, userId: 1 })).toEqual({
         canLoad: false,
         routeId: null
      })

      expect(
         canLoadCreateDraftForUser({
            routeQuery: { id: 10, id_user_owner_ads: 5 },
            userId: 5
         })
      ).toEqual({
         canLoad: true,
         routeId: 10
      })

      expect(
         canLoadCreateDraftForUser({
            routeQuery: { id: 10, id_user_owner_ads: 6 },
            userId: 5
         })
      ).toEqual({
         canLoad: false,
         routeId: 10
      })
   })

   it('decides whether route draft hydration is needed', () => {
      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: 10,
            storeId: null
         })
      ).toBe(true)

      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: '10',
            storeId: 10
         })
      ).toBe(false)

      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: 10,
            storeId: 11
         })
      ).toBe(true)
   })

})

describe('create publish helpers', () => {
   it('builds minimal profile updates before publish', () => {
      const updates = buildCreatePrePublishUserProfileUpdates({
         createStore: {
            username: 'newname',
            place_inspection: 'addr'
         },
         userStore: {
            username: '',
            address: null
         }
      })

      expect(updates).toEqual([
         { username: 'newname' },
         { address: 'addr' }
      ])
   })

   it('builds profile updates when values differ from current profile', () => {
      const updates = buildCreatePrePublishUserProfileUpdates({
         createStore: {
            username: 'newname',
            place_inspection: 'new address'
         },
         userStore: {
            username: 'oldname',
            address: 'old address'
         }
      })

      expect(updates).toEqual([
         { username: 'newname' },
         { address: 'new address' }
      ])
   })

   it('does not build profile updates when values are equal after trim', () => {
      const updates = buildCreatePrePublishUserProfileUpdates({
         createStore: {
            username: ' same-user ',
            place_inspection: ' same address '
         },
         userStore: {
            username: 'same-user',
            address: 'same address'
         }
      })

      expect(updates).toEqual([])
   })

   it('decides when email confirmation is required', () => {
      expect(
         shouldRequestCreateEmailConfirmation({
            createStore: { email: 'x@test.dev' },
            isEmailConfirmed: false
         })
      ).toBe(true)

      expect(
         shouldRequestCreateEmailConfirmation({
            createStore: { email: 'x@test.dev' },
            isEmailConfirmed: true
         })
      ).toBe(false)

      expect(
         shouldRequestCreateEmailConfirmation({
            createStore: { email: '' },
            isEmailConfirmed: false
         })
      ).toBe(false)
   })

   it('treats explicit failed updateProfile response as failed', () => {
      expect(isCreateUserProfileUpdateSuccessful()).toBe(true)
      expect(isCreateUserProfileUpdateSuccessful({ success: true })).toBe(true)
      expect(isCreateUserProfileUpdateSuccessful({ success: false })).toBe(false)
   })

   it('formats required fields message with stable readable list markers', () => {
      const message = buildCreateAdRequiredFieldsMessage({
         create_flow: CREATE_FLOW_CARS,
         username: '',
         email: '',
         phone: '',
         ads_description: '',
         place_inspection: '',
         communication_method_id: null,
         city_id: null,
         amount: null
      })

      expect(message).toContain('Заполните обязательные поля:')
      expect(message).toContain('- Имя')
      expect(message).toContain('- Email')
      expect(message).not.toContain('вЂў')
   })
})
