const CREATE_DRAFT_IN_FLIGHT_KEY = '__createDraftInFlightPromise'

export const getCreateDraftInFlightPromise = (store) =>
   store?.[CREATE_DRAFT_IN_FLIGHT_KEY] || null

export const setCreateDraftInFlightPromise = (store, promise) => {
   if (!store) return
   store[CREATE_DRAFT_IN_FLIGHT_KEY] = promise || null
}

