import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => {
   const cookieRefs = new Map()
   const popupStore = {
      showError: vi.fn(),
      showWarning: vi.fn()
   }
   const runUnauthorizedSessionReset = vi.fn()

   const useCookie = vi.fn((name) => {
      if (!cookieRefs.has(name)) {
         cookieRefs.set(name, { value: undefined })
      }
      return cookieRefs.get(name)
   })

   const useNuxtApp = vi.fn(() => ({
      $apiClient: { name: 'api' },
      $apiClientData: { name: 'data' }
   }))

   const tryUseNuxtApp = vi.fn(() => ({
      $apiClient: { name: 'api' },
      $apiClientData: { name: 'data' }
   }))

   return {
      cookieRefs,
      popupStore,
      runUnauthorizedSessionReset,
      useCookie,
      useNuxtApp,
      tryUseNuxtApp
   }
})

vi.mock(
   '#app',
   () => ({
      useCookie: hoisted.useCookie,
      useNuxtApp: hoisted.useNuxtApp,
      tryUseNuxtApp: hoisted.tryUseNuxtApp
   }),
   { virtual: true }
)

vi.mock(
   '@/store/popupErrorStore',
   () => ({
      usePopupErrorStore: () => hoisted.popupStore
   }),
   { virtual: true }
)

vi.mock(
   '@/services/authSessionEvents',
   () => ({
      runUnauthorizedSessionReset: hoisted.runUnauthorizedSessionReset
   }),
   { virtual: true }
)

const flushAsync = async () => {
   await Promise.resolve()
   if (typeof vi.dynamicImportSettled === 'function') {
      await vi.dynamicImportSettled()
   }
   await new Promise((resolve) => setTimeout(resolve, 0))
   await Promise.resolve()
}

describe('apiUtils', () => {
   beforeEach(() => {
      hoisted.cookieRefs.clear()
      hoisted.useCookie.mockClear()
      hoisted.useNuxtApp.mockReset()
      hoisted.useNuxtApp.mockReturnValue({
         $apiClient: { name: 'api' },
         $apiClientData: { name: 'data' }
      })
      hoisted.tryUseNuxtApp.mockReset()
      hoisted.tryUseNuxtApp.mockReturnValue({
         $apiClient: { name: 'api' },
         $apiClientData: { name: 'data' }
      })
      hoisted.popupStore.showError.mockClear()
      hoisted.popupStore.showWarning.mockClear()
      hoisted.runUnauthorizedSessionReset.mockClear()
      vi.resetModules()
   })

   afterEach(() => {
      delete global.window
   })

   it('parses and normalizes API response helpers', async () => {
      const apiUtils = await import('../services/apiUtils.js')

      expect(apiUtils.readCookieFromString('a=1; token=abc%20123', 'token')).toBe(
         'abc 123'
      )
      expect(apiUtils.getResponseBody({ data: { data: [1], total_count: 2 } })).toEqual(
         { data: [1], total_count: 2 }
      )
      expect(apiUtils.getResponseDataField({ data: { data: [1, 2] } })).toEqual([
         1,
         2
      ])
      expect(apiUtils.getResponsePayload({ data: { data: ['x'] } })).toEqual(['x'])
      expect(apiUtils.getResponsePayload({ data: { ok: true } })).toEqual({ ok: true })
      expect(apiUtils.getResponseTotalCount({ data: { total_count: 12 } })).toBe(12)
      expect(apiUtils.getResponseTotalCount({ data: { totalCount: 5 } })).toBe(5)
      expect(apiUtils.getResponseTotalCount({ data: {} })).toBe(0)
      expect(apiUtils.isApiRequestSuccessful({ success: true })).toBe(true)
      expect(apiUtils.isApiRequestSuccessful({ success: false })).toBe(false)
      expect(apiUtils.isApiRequestSuccessful({ any: 'shape' })).toBe(true)
      expect(
         apiUtils.getApiResponseMessage(
            { data: { message: 'Nested error' } },
            'Fallback'
         )
      ).toBe('Nested error')
      expect(apiUtils.getApiResponseMessage({}, 'Fallback')).toBe('Fallback')
   })

   it('returns request-scoped injected clients and throws without Nuxt injection', async () => {
      const apiUtils = await import('../services/apiUtils.js')

      expect(apiUtils.getApiClient()).toEqual({ name: 'api' })
      expect(apiUtils.getApiClient('apiClientData')).toEqual({ name: 'data' })

      hoisted.tryUseNuxtApp.mockReturnValue(null)
      hoisted.useNuxtApp.mockReturnValue({})
      vi.resetModules()

      const reloadedApiUtils = await import('../services/apiUtils.js')
      expect(() => reloadedApiUtils.getApiClient()).toThrow(
         'API client "apiClient" is not available in Nuxt app context'
      )
   })

   it('clears auth cookies and invalidates user session on 401', async () => {
      global.window = {}

      const apiUtils = await import('../services/apiUtils.js')

      hoisted.cookieRefs.set('token', { value: 'token-value' })
      hoisted.cookieRefs.set('user_id', { value: 'user-1' })

      const result = await apiUtils.executeApiRequest(
         async () => {
            const error = new Error('Unauthorized')
            error.response = { status: 401, data: { message: 'Unauthorized' } }
            throw error
         },
         {
            showTimeoutWarning: false
         }
      )

      expect(result.success).toBe(false)
      expect(result.status).toBe(401)

      await flushAsync()

      expect(hoisted.cookieRefs.get('token')?.value).toBeNull()
      expect(hoisted.cookieRefs.get('user_id')?.value).toBeNull()
      expect(hoisted.runUnauthorizedSessionReset).toHaveBeenCalledWith({
         reason: 'unauthorized'
      })
   })

})
