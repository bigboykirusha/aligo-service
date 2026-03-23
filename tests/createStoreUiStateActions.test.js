import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_PARTS_CAR_TIRES
} from '../store/createStore/flows'
import {
   resetCreateStoreState,
   setCreateFlowState,
   setCreateStoreActiveTab
} from '../store/createStore/uiStateActions'
import {
   getCreateDraftInFlightPromise,
   setCreateDraftInFlightPromise
} from '../store/createStore/draftInFlight'

describe('create ui state actions', () => {
   it('sets create flow and resets active tab', () => {
      const store = {
         create_flow: CREATE_FLOW_CARS,
         activeTab: 3,
         tabs: [{ index: 1 }, { index: 2 }, { index: 3 }]
      }

      setCreateFlowState({ store, flow: CREATE_FLOW_PARTS_CAR_TIRES })

      expect(store.create_flow).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(store.activeTab).toBe(1)
      expect(store.tabs).toHaveLength(2)
   })

   it('normalizes active tab index inside available range', () => {
      const store = {
         activeTab: 1,
         tabs: [{ index: 1 }, { index: 2 }]
      }

      setCreateStoreActiveTab({ store, index: 10 })
      expect(store.activeTab).toBe(2)

      setCreateStoreActiveTab({ store, index: -1 })
      expect(store.activeTab).toBe(1)

      setCreateStoreActiveTab({ store, index: 'abc' })
      expect(store.activeTab).toBe(1)
   })

   it('resets state and clears in-flight draft promise', () => {
      const store = {
         id: 123,
         create_flow: CREATE_FLOW_PARTS_CAR_TIRES,
         activeTab: 2,
         tabs: [{ index: 1 }, { index: 2 }],
         amount: 5000
      }
      setCreateDraftInFlightPromise(store, Promise.resolve())
      expect(getCreateDraftInFlightPromise(store)).not.toBeNull()

      resetCreateStoreState({ store })

      expect(store.id).toBeNull()
      expect(store.create_flow).toBe(CREATE_FLOW_CARS)
      expect(store.activeTab).toBe(1)
      expect(store.tabs).toHaveLength(3)
      expect(getCreateDraftInFlightPromise(store)).toBeNull()
   })
})

