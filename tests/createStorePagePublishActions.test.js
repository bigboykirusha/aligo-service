import { describe, expect, it, vi } from 'vitest'
import {
   createCreateNavigationController,
   runCreateDraftMutationAction
} from '../store/createStore/pagePublishActions'

describe('create page publish actions', () => {
   it('schedules router navigation and calls callback after push', async () => {
      vi.useFakeTimers()
      const push = vi.fn(async () => {})
      const router = { push }
      const onAfterNavigate = vi.fn()

      const { scheduleCreateNavigation } = createCreateNavigationController({
         router,
         delayMs: 500,
         isClient: true
      })

      scheduleCreateNavigation('/ads?tab=published', onAfterNavigate)
      expect(push).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(500)
      await Promise.resolve()

      expect(push).toHaveBeenCalledWith('/ads?tab=published')
      expect(onAfterNavigate).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
   })

   it('cancels previous scheduled navigation when called repeatedly', async () => {
      vi.useFakeTimers()
      const push = vi.fn(async () => {})
      const router = { push }

      const { scheduleCreateNavigation } = createCreateNavigationController({
         router,
         delayMs: 500,
         isClient: true
      })

      scheduleCreateNavigation('/first')
      scheduleCreateNavigation('/second')

      await vi.advanceTimersByTimeAsync(500)
      await Promise.resolve()

      expect(push).toHaveBeenCalledTimes(1)
      expect(push).toHaveBeenCalledWith('/second')
      vi.useRealTimers()
   })

   it('runs draft mutation successfully and schedules redirect', async () => {
      const pendingRef = { value: false }
      const createStore = {
         setField: vi.fn(async () => ({ success: true }))
      }
      const popupErrorStore = { showError: vi.fn() }
      const scheduleCreateNavigation = vi.fn((path, cb) => cb?.())

      const result = await runCreateDraftMutationAction({
         draftValue: 0,
         pendingRef,
         redirectPath: '/ads?tab=published',
         errorLogPrefix: 'Create publish failed:',
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: 'save failed',
         scheduleCreateNavigation
      })

      expect(result.success).toBe(true)
      expect(createStore.setField).toHaveBeenCalledWith('is_draft', 0)
      expect(scheduleCreateNavigation).toHaveBeenCalledWith(
         '/ads?tab=published',
         expect.any(Function),
         { delayMs: undefined }
      )
      expect(popupErrorStore.showError).not.toHaveBeenCalled()
      expect(pendingRef.value).toBe(false)
   })

   it('shows save error and resets pending flag on mutation failure', async () => {
      const pendingRef = { value: false }
      const error = new Error('mutation failed')
      const createStore = {
         setField: vi.fn(async () => {
            throw error
         })
      }
      const popupErrorStore = { showError: vi.fn() }
      const scheduleCreateNavigation = vi.fn()
      const onMutationError = vi.fn()

      const result = await runCreateDraftMutationAction({
         draftValue: 0,
         pendingRef,
         redirectPath: '/ads?tab=published',
         errorLogPrefix: 'Create publish failed:',
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: 'save failed',
         scheduleCreateNavigation,
         onMutationError
      })

      expect(result.success).toBe(false)
      expect(scheduleCreateNavigation).not.toHaveBeenCalled()
      expect(onMutationError).toHaveBeenCalledWith('Create publish failed:', error)
      expect(popupErrorStore.showError).toHaveBeenCalledWith('save failed')
      expect(pendingRef.value).toBe(false)
   })

   it('passes custom navigation delay to scheduled redirect', async () => {
      const pendingRef = { value: false }
      const createStore = {
         setField: vi.fn(async () => ({ success: true }))
      }
      const popupErrorStore = { showError: vi.fn() }
      const scheduleCreateNavigation = vi.fn((path, cb) => cb?.())

      await runCreateDraftMutationAction({
         draftValue: 0,
         pendingRef,
         redirectPath: '/ads?tab=published',
         errorLogPrefix: 'Create publish failed:',
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: 'save failed',
         scheduleCreateNavigation,
         navigationDelayMs: 1600
      })

      expect(scheduleCreateNavigation).toHaveBeenCalledWith(
         '/ads?tab=published',
         expect.any(Function),
         { delayMs: 1600 }
      )
   })

   it('does not schedule navigation when success redirect is disabled', async () => {
      const pendingRef = { value: false }
      const createStore = {
         setField: vi.fn(async () => ({ success: true }))
      }
      const popupErrorStore = { showError: vi.fn() }
      const scheduleCreateNavigation = vi.fn()

      const result = await runCreateDraftMutationAction({
         draftValue: 0,
         pendingRef,
         redirectPath: '/ads?tab=published',
         errorLogPrefix: 'Create publish failed:',
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: 'save failed',
         scheduleCreateNavigation,
         scheduleNavigationOnSuccess: false
      })

      expect(result.success).toBe(true)
      expect(scheduleCreateNavigation).not.toHaveBeenCalled()
      expect(pendingRef.value).toBe(false)
   })
})
