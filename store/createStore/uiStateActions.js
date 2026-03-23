import { CREATE_FLOW_CARS, resolveCreateFlow } from './flows'
import { createResetCreateState } from './state'
import { getCreateTabsByFlow } from './tabs'
import { setCreateDraftInFlightPromise } from './draftInFlight'

export const setCreateFlowState = ({ store, flow = CREATE_FLOW_CARS }) => {
   const resolvedFlow = resolveCreateFlow(flow)
   store.create_flow = resolvedFlow
   store.tabs = getCreateTabsByFlow(resolvedFlow)
   store.activeTab = 1
}

export const resetCreateStoreState = ({ store }) => {
   setCreateDraftInFlightPromise(store, null)
   const baseState = createResetCreateState()
   Object.assign(store, baseState)
   store.tabs = getCreateTabsByFlow(CREATE_FLOW_CARS)
   store.activeTab = 1
}

export const setCreateStoreActiveTab = ({ store, index }) => {
   const normalized = Number(index)
   if (!Number.isFinite(normalized)) {
      store.activeTab = 1
      return
   }

   const maxTab = Math.max(1, store.tabs.length)
   store.activeTab = Math.min(maxTab, Math.max(1, Math.trunc(normalized)))
}

