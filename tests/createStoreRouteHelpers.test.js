import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../store/createStore/flows'
import {
   buildCreateDraftRouteSyncQuery,
   canLoadCreateDraftForUser,
   resolveCreateFlowFromRouteQuery,
   shouldHydrateCreateDraftFromRoute
} from '../store/createStore/routeHelpers'

describe('create route helpers', () => {
   it('resolves flow from query flow and parts item', () => {
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            last_category_id: 2
         })
      ).toBe(
         CREATE_FLOW_PARTS_CAR_DISKS
      )
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            last_category_id: 1
         })
      ).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 3,
            sub_category_id: 10
         })
      ).toBe(CREATE_FLOW_PARTS_MOTOR_OIL)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 2,
            sub_category_id: 1
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 2,
            sub_category_id: 2
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)
      expect(
         resolveCreateFlowFromRouteQuery({
            main_category_id: 1
         })
      ).toBe(CREATE_FLOW_CARS)
      expect(resolveCreateFlowFromRouteQuery({})).toBe(CREATE_FLOW_CARS)
   })

   it('detects draft load availability by route ownership', () => {
      expect(
         canLoadCreateDraftForUser({
            routeQuery: { id: 15, id_user_owner_ads: 5 },
            userId: 5
         })
      ).toEqual({
         canLoad: true,
         routeId: 15
      })

      expect(
         canLoadCreateDraftForUser({
            routeQuery: { id: 15, id_user_owner_ads: 7 },
            userId: 5
         })
      ).toEqual({
         canLoad: false,
         routeId: 15
      })
   })

   it('hydrates route draft only when route id differs from store id', () => {
      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: false,
            routeId: 15,
            storeId: null
         })
      ).toBe(false)

      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: 15,
            storeId: null
         })
      ).toBe(true)

      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: 15,
            storeId: 15
         })
      ).toBe(false)

      expect(
         shouldHydrateCreateDraftFromRoute({
            canLoad: true,
            routeId: '15',
            storeId: 22
         })
      ).toBe(true)
   })

   it('builds canonical route query for draft edit synchronization', () => {
      expect(
         buildCreateDraftRouteSyncQuery({
            routeQuery: {
               id: 997,
               id_user_owner_ads: 106
            },
            store: {
               id: 997,
               id_user_owner_ads: 106,
               create_flow: CREATE_FLOW_CARS,
               main_category_id: 1
            }
         })
      ).toEqual({
         id: 997,
         id_user_owner_ads: 106,
         main_category_id: 1
      })

      expect(
         buildCreateDraftRouteSyncQuery({
            routeQuery: {
               id: 997,
               id_user_owner_ads: 106
            },
            store: {
               id: 997,
               id_user_owner_ads: 106,
               create_flow: CREATE_FLOW_MOTO_SCOOTERS,
               main_category_id: 2,
               sub_category_id: 2
            }
         })
      ).toEqual({
         id: 997,
         id_user_owner_ads: 106,
         main_category_id: 2,
         sub_category_id: 2
      })
   })
})
