import { useCookie, useRuntimeConfig } from '#app'

const SYNC_COOKIE_KEY = 'user_city_synced_id'

export const syncCityToBackendIfNeeded = async ({ city, userStore }) => {
   if (!import.meta.client) return false

   const tokenCookie = useCookie('token', { path: '/' })
   const tokenValue = String(tokenCookie.value || '')
   if (!tokenValue || !city?.id) return false

   const nextCityId = String(city.id)
   const currentUserCityId = String(userStore?.city_id || '')

   const syncedCityIdCookie = useCookie(SYNC_COOKIE_KEY, { path: '/' })
   const lastSyncedCityId = String(syncedCityIdCookie.value || '')

   if (lastSyncedCityId === nextCityId) return false

   if (currentUserCityId && currentUserCityId === nextCityId) {
      syncedCityIdCookie.value = nextCityId
      return false
   }

   const config = useRuntimeConfig()
   const formData = new FormData()
   formData.append('city_id', nextCityId)

   await $fetch(`${config.public.apiBaseUrl}/api/user/update`, {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${tokenValue}`
      },
      body: formData
   })

   if (userStore) {
      userStore.city_id = nextCityId
      userStore.city_name = String(city.name || '')
   }

   syncedCityIdCookie.value = nextCityId
   return true
}
