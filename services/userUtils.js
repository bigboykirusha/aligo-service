import { useCookie } from '#app'

// Reads active user id from cookie.
export const getUserId = () => {
   const userIdCookie = useCookie('user_id')
   return userIdCookie.value ?? null
}

// Returns the counterpart user in a chat message object.
export const relevantUser = (message) => {
   if (!message) return {}
   const { for_user, from_user } = message
   if (!for_user) return from_user || {}
   if (!from_user) return for_user || {}

   const userId = getUserId()
   if (userId === null || userId === undefined) return for_user

   return isSameUserId(for_user.id, userId) ? from_user : for_user
}

// Returns display name (username/login) of the counterpart user.
export const relevantUserInfo = (message) => {
   const user = relevantUser(message)
   return user.username || user.login
}

const normalizeId = (value) => {
   if (value === null || value === undefined || value === '') return null
   const numeric = Number(value)
   return Number.isNaN(numeric) ? value : numeric
}

const isSameUserId = (left, right) => {
   const leftId = normalizeId(left)
   const rightId = normalizeId(right)
   if (leftId === null || rightId === null) return false
   return leftId === rightId
}

export const getChatTargetUserId = (chat, currentUserId = null) => {
   if (!chat) return null

   const forUserId = chat?.for_user?.id ?? chat?.for_user_id ?? null
   const fromUserId = chat?.from_user?.id ?? chat?.from_user_id ?? null

   if (forUserId === null && fromUserId === null) return null
   if (forUserId === null) return fromUserId ?? null
   if (fromUserId === null) return forUserId ?? null

   const activeUserId =
      currentUserId !== null && currentUserId !== undefined
         ? currentUserId
         : getUserId()

   if (activeUserId === null || activeUserId === undefined) return forUserId

   return isSameUserId(forUserId, activeUserId)
      ? fromUserId ?? null
      : forUserId
}
