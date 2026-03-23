export const AUTH_SESSION_INVALIDATED_EVENT = 'auth:session-invalidated'
let unauthorizedSessionResetHandler = null

export const buildAuthorizationRedirectPath = (fullPath = '/') =>
   `/authorization?redirect=${encodeURIComponent(fullPath || '/')}`

export const emitAuthSessionInvalidated = (detail = {}) => {
   if (!import.meta.client || typeof window === 'undefined') return
   if (typeof window.dispatchEvent !== 'function') return

   window.dispatchEvent(
      new CustomEvent(AUTH_SESSION_INVALIDATED_EVENT, { detail })
   )
}

export const registerUnauthorizedSessionResetHandler = (handler) => {
   unauthorizedSessionResetHandler =
      typeof handler === 'function' ? handler : null

   return () => {
      if (unauthorizedSessionResetHandler === handler) {
         unauthorizedSessionResetHandler = null
      }
   }
}

export const runUnauthorizedSessionReset = async (detail = {}) => {
   if (typeof unauthorizedSessionResetHandler !== 'function') return

   try {
      await unauthorizedSessionResetHandler(detail)
   } catch (error) {
      console.error('unauthorized session reset handler error:', error)
   }
}

export const onAuthSessionInvalidated = (handler) => {
   if (
      !import.meta.client ||
      typeof window === 'undefined' ||
      typeof window.addEventListener !== 'function'
   ) {
      return () => {}
   }

   const listener = (event) => {
      try {
         handler?.(event?.detail || {})
      } catch (error) {
         console.error('auth session invalidation listener error:', error)
      }
   }

   window.addEventListener(AUTH_SESSION_INVALIDATED_EVENT, listener)
   return () =>
      window.removeEventListener(AUTH_SESSION_INVALIDATED_EVENT, listener)
}
