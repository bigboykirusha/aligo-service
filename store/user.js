import { defineStore } from 'pinia'
import { profileActions } from './userStore/profileActions'
import { sessionActions } from './userStore/sessionActions'
import { createUserState, userGetters } from './userStore/state'

export const useUserStore = defineStore('user', {
   state: createUserState,
   getters: userGetters,
   actions: {
      ...profileActions,
      ...sessionActions
   }
})
