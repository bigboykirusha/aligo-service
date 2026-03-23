const toSafePendingCount = (value) => {
   const normalized = Number.parseInt(String(value ?? 0), 10)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : 0
}

const resolveAutosaveErrorMessage = (error) => {
   if (typeof error?.message === 'string' && error.message.trim() !== '') {
      return error.message
   }

   return 'Autosave failed.'
}

export const beginCreateAutosaveTracking = (state) => {
   if (!state) return

   const pendingCount = toSafePendingCount(state.autosave_pending_count)
   state.autosave_pending_count = pendingCount + 1
   state.autosave_last_error = null
   state.autosave_last_error_field = null
}

export const completeCreateAutosaveTrackingSuccess = (state) => {
   if (!state) return
   state.autosave_last_success_at = Date.now()
}

export const completeCreateAutosaveTrackingError = (state, { field, error }) => {
   if (!state) return
   state.autosave_last_error_field = field || null
   state.autosave_last_error = resolveAutosaveErrorMessage(error)
}

export const finalizeCreateAutosaveTracking = (state) => {
   if (!state) return

   const pendingCount = toSafePendingCount(state.autosave_pending_count)
   state.autosave_pending_count = pendingCount > 0 ? pendingCount - 1 : 0
}
