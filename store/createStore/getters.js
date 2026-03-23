const CREATE_ANY_FIELD_IGNORED_KEYS = new Set([
   'id',
   'id_user_owner_ads',
   'is_draft',
   'is_published',
   'create_flow',
   'activeTab',
   'tabs',
   'currency_id',
   'autosave_pending_count',
   'autosave_last_error',
   'autosave_last_error_field',
   'autosave_last_success_at',
   'isDraftEditMode',
   'isUserDataInitializing',
   'isUserDataInitialized'
])

export const isAnyCreateFieldFilled = (state = {}) =>
   Object.entries(state).some(([key, value]) => {
      if (CREATE_ANY_FIELD_IGNORED_KEYS.has(key)) return false
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.keys(value).length > 0
      if ((key.startsWith('is_') || key.includes('_is_')) && Number(value) === 0)
         return false
      return true
   })
