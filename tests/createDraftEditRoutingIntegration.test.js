import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS
} from '../store/createStore/flows'
import {
   CREATE_AD_EDIT_PATH,
   buildCreateEditRouteLocation
} from '../store/createStore/createCatalogHelpers'
import {
   buildCreateDraftRouteSyncQuery,
   resolveCreateFlowFromRouteQuery
} from '../store/createStore/routeHelpers'

describe('create draft edit routing integration', () => {
   it.each([
      {
         name: 'cars draft route',
         source: {
            id: 4230,
            id_user_owner_ads: 106,
            main_category_id: 1
         },
         expectedFlow: CREATE_FLOW_CARS,
         expectedQuery: {
            id: 4230,
            id_user_owner_ads: 106,
            main_category_id: 1
         }
      },
      {
         name: 'moto motorcycles draft route',
         source: {
            id: 997,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 1
         },
         expectedFlow: CREATE_FLOW_MOTO_MOTORCYCLES,
         expectedQuery: {
            id: 997,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 1
         }
      },
      {
         name: 'moto scooters draft route',
         source: {
            id: 998,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 2
         },
         expectedFlow: CREATE_FLOW_MOTO_SCOOTERS,
         expectedQuery: {
            id: 998,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 2
         }
      }
   ])('$name resolves to expected flow and query', ({ source, expectedFlow, expectedQuery }) => {
      const location = buildCreateEditRouteLocation({ source })
      expect(location).toEqual({
         path: CREATE_AD_EDIT_PATH,
         query: expectedQuery
      })
      expect(resolveCreateFlowFromRouteQuery(location.query)).toBe(expectedFlow)

      // Keep LK -> create query minimal and deterministic.
      expect(location.query).not.toHaveProperty('ads_model')
      expect(location.query).not.toHaveProperty('sub_category_title')
   })

   it('keeps stable sync-query shape while preserving category context', () => {
      const query = buildCreateDraftRouteSyncQuery({
         routeQuery: {
            id: 997,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 2,
            ads_model: 'App\\Models\\Moto',
            sub_category_title: 'scooters'
         },
         store: {
            id: 997,
            id_user_owner_ads: 106,
            create_flow: CREATE_FLOW_MOTO_SCOOTERS
         }
      })

      expect(query).toEqual({
         id: 997,
         id_user_owner_ads: 106,
         main_category_id: 2,
         sub_category_id: 2
      })
   })
})
