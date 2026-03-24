import { describe, expect, it } from 'vitest'
import { createInitialCreateState } from '../store/createStore/state'
import {
   buildCreateDirtyCheckSnapshot,
   getCreateChangedFieldLabels,
   hasCreateUnsavedChanges,
   isAnyCreateFieldFilled
} from '../store/createStore/getters'

describe('createStore getters', () => {
   it('keeps isAnyFieldFilled disabled for default store state', () => {
      const state = {
         ...createInitialCreateState(),
         activeTab: 1,
         tabs: [{ index: 1 }],
         currency_id: 1
      }
      expect(isAnyCreateFieldFilled(state)).toBe(false)
   })

   it('does not treat default false flags as filled fields', () => {
      const state = createInitialCreateState()
      state.is_service_book = 0
      state.is_serviced_dealer = 0
      state.is_under_warranty = 0

      expect(isAnyCreateFieldFilled(state)).toBe(false)
   })

   it('returns true when user entered any meaningful field', () => {
      const state = createInitialCreateState()
      state.brand_id = 10
      expect(isAnyCreateFieldFilled(state)).toBe(true)
   })

   it('ignores autosave technical fields for fill detection', () => {
      const state = createInitialCreateState()
      state.autosave_pending_count = 1
      state.autosave_last_error = 'Network timeout'
      state.autosave_last_error_field = 'vin'
      state.autosave_last_success_at = Date.now()

      expect(isAnyCreateFieldFilled(state)).toBe(false)
   })

   it('does not treat service-only store changes as unsaved user changes', () => {
      const state = createInitialCreateState()
      state.initialStateSnapshot = buildCreateDirtyCheckSnapshot(state)
      state.$id = 'create'
      state.$patch = () => {}
      state.some_runtime_helper = true

      expect(hasCreateUnsavedChanges(state)).toBe(false)
      expect(getCreateChangedFieldLabels(state)).toEqual([])
   })

   it('reports only meaningful field labels for dirty state', () => {
      const initialState = createInitialCreateState()
      initialState.power_range = 249

      const state = {
         ...createInitialCreateState(),
         power_range: 300,
         initialStateSnapshot: {
            ...initialState
         }
      }

      expect(hasCreateUnsavedChanges(state)).toBe(true)
      expect(getCreateChangedFieldLabels(state)).toEqual(['Мощность'])
   })
})
