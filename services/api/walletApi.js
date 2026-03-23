/**
 * API for wallet and transactions
 */

import { executeApiRequest, getApiClient, getResponseBody } from '../apiUtils'

const normalizeOrderBy = (value, fallback = 'desc') =>
   String(value || fallback).toLowerCase() === 'asc' ? 'asc' : 'desc'

const normalizePositiveInteger = (value, fallback = 20) => {
   const normalized = Number(value)
   if (!Number.isFinite(normalized) || normalized <= 0) {
      return fallback
   }
   return Math.trunc(normalized)
}

const normalizeMoneyAmount = (value) => {
   const normalized = Number(value)
   if (!Number.isFinite(normalized) || normalized <= 0) {
      return 0
   }
   return Number(normalized.toFixed(2))
}

const normalizeFlag = (value) => {
   if (value === true || value === 1 || value === '1') return 1
   if (value === false || value === 0 || value === '0') return 0
   return null
}

export const getWallet = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get('/paid_services/get_wallet')
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u043a\u043e\u0448\u0435\u043b\u044c\u043a\u0430.'
      }
   )
}

export const getWalletTransactions = async ({
   transactionId = null,
   page = 1,
   count = 20,
   isAdd = null,
   isOff = null,
   orderBy = 'desc'
} = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const endpoint = transactionId
            ? `/paid_services/get_transactions/${encodeURIComponent(String(transactionId))}`
            : '/paid_services/get_transactions'

         const params = {
            page: normalizePositiveInteger(page, 1),
            count: normalizePositiveInteger(count, 20),
            order_by: normalizeOrderBy(orderBy, 'desc')
         }

         const normalizedIsAdd = normalizeFlag(isAdd)
         const normalizedIsOff = normalizeFlag(isOff)

         if (normalizedIsAdd !== null) {
            params.is_add = normalizedIsAdd
         }

         if (normalizedIsOff !== null) {
            params.is_off = normalizedIsOff
         }

         const response = await apiClient.get(endpoint, { params })
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u0438 \u043a\u043e\u0448\u0435\u043b\u044c\u043a\u0430.'
      }
   )
}

export const downloadWalletTransaction = async (transactionId) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            `/paid_services/download_transactions/${encodeURIComponent(String(transactionId))}`,
            {
               responseType: 'blob'
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u0430\u0447\u0430\u0442\u044c \u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446\u0438\u044e.'
      }
   )
}

export const depositWallet = async (payment) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            '/paid_services/deposit_wallet',
            {
               payment: normalizeMoneyAmount(payment)
            }
         )
         return getResponseBody(response)
      },
      {
         errorMessage:
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 \u043f\u043e\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u043a\u043e\u0448\u0435\u043b\u044c\u043a\u0430.'
      }
   )
}
