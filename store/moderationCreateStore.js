import { defineStore } from 'pinia'

const createInitialState = () => ({
   create_by_user_id: null,
   locked_contact_fields: []
})

export const useModerationCreateStore = defineStore('moderationCreate', {
   state: createInitialState,
   actions: {
      applyUserPreset(user = {}) {
         const userId = Number(user?.id)
         this.create_by_user_id = Number.isFinite(userId) ? userId : null
         this.locked_contact_fields = ['username', 'phone', 'email']
      },
      reset() {
         Object.assign(this, createInitialState())
      },
      isFieldLocked(field) {
         return this.locked_contact_fields.includes(field)
      }
   }
})
