import { useCookie, useNuxtApp, tryUseNuxtApp } from '#app'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { runUnauthorizedSessionReset } from '@/services/authSessionEvents'

export const readCookieFromString = (rawCookie = '', key) => {
   if (!rawCookie || !key) return ''
   const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
   const match = rawCookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`))
   return match ? decodeURIComponent(match[1]) : ''
}

export const getResponseBody = (response) => response?.data ?? response ?? null

export const getResponseDataField = (response) => {
   const body = getResponseBody(response)
   return body && typeof body === 'object' ? body.data : undefined
}

export const getResponsePayload = (response) => {
   const body = getResponseBody(response)
   const dataField = getResponseDataField(response)
   return dataField !== undefined ? dataField : body
}

export const getResponseTotalCount = (response) => {
   const body = getResponseBody(response)
   if (!body || typeof body !== 'object') return 0
   if (typeof body.total_count === 'number') return body.total_count
   if (typeof body.totalCount === 'number') return body.totalCount
   return 0
}

export const isApiRequestSuccessful = (response) => {
   if (!response) return false
   if (typeof response === 'object' && 'success' in response) {
      return response.success !== false
   }
   return true
}

export const getApiResponseMessage = (response, fallback = '') => {
   if (!response || typeof response !== 'object') return fallback
   if (typeof response.message === 'string' && response.message.trim()) {
      return response.message
   }
   if (
      response.data &&
      typeof response.data === 'object' &&
      typeof response.data.message === 'string' &&
      response.data.message.trim()
   ) {
      return response.data.message
   }
   return fallback
}

export const isClientRuntime = () =>
   import.meta.client || typeof window !== 'undefined'

const DEFAULT_TIMEOUT = 15000
const UNKNOWN_ERROR_MESSAGE = 'Неизвестная ошибка'
const DEFAULT_ERROR_MESSAGE =
   'Сервер временно недоступен, повторите попытку через 1 минуту.'

const getPopupErrorStoreSafe = () => {
   if (!isClientRuntime()) return null
   try {
      return usePopupErrorStore()
   } catch {
      return null
   }
}

let unauthorizedSessionResetInFlight = null

const cachedApiClients = {
   apiClient: null,
   apiClientData: null
}

const resetUnauthorizedSessionClient = async () => {
   if (!isClientRuntime()) return
   if (unauthorizedSessionResetInFlight) return unauthorizedSessionResetInFlight

   unauthorizedSessionResetInFlight = (async () => {
      try {
         useCookie('token', { path: '/' }).value = null
         useCookie('user_id', { path: '/' }).value = null
         await runUnauthorizedSessionReset({ reason: 'unauthorized' })
      } catch (error) {
         console.error('Не удалось сбросить неавторизованную сессию:', error)
      } finally {
         unauthorizedSessionResetInFlight = null
      }
   })()

   return unauthorizedSessionResetInFlight
}

export function handleApiError(
   error,
   defaultMessage = DEFAULT_ERROR_MESSAGE,
   showPopup = true
) {
   const popupErrorStore = getPopupErrorStoreSafe()
   let errorMessage = defaultMessage

   if (error.response?.status === 429) {
      errorMessage = 'Слишком много запросов, попробуйте позже.'
      if (showPopup && popupErrorStore) popupErrorStore.showError(errorMessage)
   } else if (error.response?.status >= 500) {
      if (showPopup && popupErrorStore) popupErrorStore.showError(errorMessage)
   } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
   }

   return {
      success: false,
      message: errorMessage,
      status: error?.response?.status ?? null,
      error,
      ...error.response?.data
   }
}

export async function executeApiRequest(requestFn, options = {}) {
   const {
      timeout = DEFAULT_TIMEOUT,
      errorMessage = DEFAULT_ERROR_MESSAGE,
      showTimeoutWarning = true,
      throwError = false
   } = options

   const popupErrorStore = getPopupErrorStoreSafe()
   let timeoutId = null

   try {
      if (showTimeoutWarning && popupErrorStore) {
         timeoutId = setTimeout(() => {
            popupErrorStore.showWarning(
               'Пожалуйста, подождите, сервер отвечает дольше обычного...'
            )
         }, timeout)
      }

      const result = await requestFn()

      if (timeoutId) {
         clearTimeout(timeoutId)
      }

      return result
   } catch (error) {
      if (timeoutId) {
         clearTimeout(timeoutId)
      }

      const safeError = {
         message: error?.message || UNKNOWN_ERROR_MESSAGE,
         status: error?.response?.status || null,
         url: error?.config?.url || null,
         method: error?.config?.method || null
      }
      const shouldLogApiError =
         import.meta.client ||
         ![401, 403, 404].includes(Number(safeError.status || 0))

      if (shouldLogApiError) {
         console.error('API Error:', safeError)
      }

      if (error?.response?.status === 401) {
         void resetUnauthorizedSessionClient()
      }

      if (throwError) {
         throw error
      }

      return handleApiError(error, errorMessage)
   }
}

export function getApiClient(clientType = 'apiClient') {
   const normalizedType =
      clientType === 'apiClientData' ? 'apiClientData' : 'apiClient'
   const nuxtApp = typeof tryUseNuxtApp === 'function' ? tryUseNuxtApp() : null

   if (nuxtApp) {
      const client =
         normalizedType === 'apiClientData'
            ? nuxtApp.$apiClientData
            : nuxtApp.$apiClient

      if (client) {
         cachedApiClients[normalizedType] = client
         return client
      }
   }

   if (cachedApiClients[normalizedType]) {
      return cachedApiClients[normalizedType]
   }

   const activeNuxtApp = useNuxtApp()
   const client =
      normalizedType === 'apiClientData'
         ? activeNuxtApp.$apiClientData
         : activeNuxtApp.$apiClient

   if (!client) {
      throw new Error(
         `API client "${normalizedType}" is not available in Nuxt app context`
      )
   }

   return client
}
