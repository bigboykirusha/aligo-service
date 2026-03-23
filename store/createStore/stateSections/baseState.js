import { CREATE_FLOW_CARS } from '../flows'

export const createMetaSection = () => ({
   id: null,
   id_user_owner_ads: null,
   create_by_user_id: null,
   main_category_id: null,
   sub_category_id: null,
   last_category_id: null,
   is_draft: 1,
   is_finished: null,
   is_published: 0,
   condition_id: null,
   create_flow: CREATE_FLOW_CARS
})

export const createCommonCharacteristicsSection = () => ({
   photos: [],
   ids_delete_photos: [],
   color_ids: [],
   color_custom: null
})

export const createAdSection = () => ({
   ads_description: null,
   place_inspection: null,
   amount: null,
   currency_id: 1,
   phone: null,
   email: null,
   city_id: null,
   city_name: null,
   latitude: null,
   longitude: null,
   communication_method_id: null,
   username: null,
   autosave_pending_count: 0,
   autosave_last_error: null,
   autosave_last_error_field: null,
   autosave_last_success_at: null,
   isDraftEditMode: false,
   isUserDataInitializing: false,
   isUserDataInitialized: false
})
