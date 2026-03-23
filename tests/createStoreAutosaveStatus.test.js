import { describe, expect, it } from 'vitest'
import {
   beginCreateAutosaveTracking,
   completeCreateAutosaveTrackingError,
   completeCreateAutosaveTrackingSuccess,
   finalizeCreateAutosaveTracking
} from '../store/createStore/autosaveStatus'

describe('create autosave status helpers', () => {
   it('tracks pending autosave requests', () => {
      const state = { autosave_pending_count: 0 }

      beginCreateAutosaveTracking(state)
      beginCreateAutosaveTracking(state)
      expect(state.autosave_pending_count).toBe(2)

      finalizeCreateAutosaveTracking(state)
      finalizeCreateAutosaveTracking(state)
      finalizeCreateAutosaveTracking(state)
      expect(state.autosave_pending_count).toBe(0)
   })

   it('stores autosave success metadata', () => {
      const state = { autosave_last_success_at: null }
      completeCreateAutosaveTrackingSuccess(state)

      expect(typeof state.autosave_last_success_at).toBe('number')
      expect(state.autosave_last_success_at).toBeGreaterThan(0)
   })

   it('stores autosave error metadata', () => {
      const state = {
         autosave_last_error: null,
         autosave_last_error_field: null
      }

      completeCreateAutosaveTrackingError(state, {
         field: 'vin',
         error: new Error('Network timeout')
      })
      expect(state.autosave_last_error_field).toBe('vin')
      expect(state.autosave_last_error).toBe('Network timeout')

      completeCreateAutosaveTrackingError(state, {
         field: '',
         error: null
      })
      expect(state.autosave_last_error_field).toBeNull()
      expect(state.autosave_last_error).toBe('Autosave failed.')
   })
})
