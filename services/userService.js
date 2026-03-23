import { logoutUser, updateUserInfo, getUserCount } from '@/services/apiClient'
import {
   executeApiRequest,
   getApiClient,
   getResponsePayload
} from '@/services/apiUtils'

const formatPhoneNumber = (phone) => {
   const cleaned = String(phone || '').replace(/\D/g, '')
   const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{2})(\d{2})$/)
   return match
      ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
      : phone
}

const formatUniqueCode = (code) => code?.match(/.{1,4}/g)?.join(' ') || ''

const extractUserPayload = (response) => {
   const payload = getResponsePayload(response)
   if (!payload || typeof payload !== 'object') return null
   if (payload.user && typeof payload.user === 'object') return payload.user
   return payload
}

export const loadUserProfile = async () => {
   const response = await executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         return await apiClient.get('/user/get_myself')
      },
      {
         errorMessage: 'Не удалось загрузить профиль пользователя.',
         throwError: true
      }
   )

   const data = extractUserPayload(response)
   if (!data) {
      throw new Error('Профиль пользователя недоступен')
   }

   return {
      user: {
         userId: data.id ?? null,
         username: data.username ?? null,
         uniqueCode: formatUniqueCode(data.unique_code),
         login: data.login ?? null,
         email: data.email ?? null,
         unconfirmed_email: data.unconfirmed_email ?? null,
         phoneNumber: data.phone ? formatPhoneNumber(data.phone) : null,
         address: data.address ?? null,
         latitude: data.latitude ?? null,
         longitude: data.longitude ?? null,
         city_id: data.city?.id ?? null,
         city_name: data.city?.title ?? null,
         photo: data.photo ?? null,
         createdAt: data.created_at ?? null,
         grade: data.grade || 0
      }
   }
}

export const loadUserCounts = async () => getUserCount()

export const updateUserProfile = async (fields) => {
   const formData = new FormData()
   Object.entries(fields).forEach(([k, v]) => {
      const normalizedValue = v == null ? '' : v
      formData.append(
         k,
         k === 'phone'
            ? String(normalizedValue).replace(/[^\d+]/g, '')
            : normalizedValue
      )
   })
   await updateUserInfo(formData)
}

export const logoutCurrentUser = async () => {
   await logoutUser()
}
