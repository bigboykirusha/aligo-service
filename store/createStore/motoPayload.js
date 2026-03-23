import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   isMotoCreateFlow
} from './flows'

const MOTO_FIELD_PREFIX_BY_FLOW = Object.freeze({
   [CREATE_FLOW_MOTO_MOTORCYCLES]: 'moto_motorcycle_',
   [CREATE_FLOW_MOTO_SCOOTERS]: 'moto_scooter_'
})

const MOTO_API_FIELD_BY_SUFFIX = Object.freeze({
   year: 'year_id',
   power_hp: 'power_range',
   engine_volume: 'engine_capacity',
   count_owner_id: 'count_owners',
   count_cylinder_id: 'cylinder_id',
   number_of_gears_id: 'number_gear_id',
   is_start_stop: 'is_start_stop_system',
   is_windshield: 'is_windscreen'
})

export const mapCreateMotoFieldKeyToApiKey = ({ field, flow }) => {
   if (typeof field !== 'string' || !field) return field

   const prefix = MOTO_FIELD_PREFIX_BY_FLOW[flow]
   if (!prefix || !field.startsWith(prefix)) return field

   const suffix = field.slice(prefix.length)
   return MOTO_API_FIELD_BY_SUFFIX[suffix] || suffix
}

export const remapMotoCreateFormDataForApi = ({ formData, flow }) => {
   if (!isMotoCreateFlow(flow)) return formData
   if (!formData || typeof formData.entries !== 'function') return formData

   const mappedFormData = new FormData()
   for (const [field, value] of formData.entries()) {
      const apiField = mapCreateMotoFieldKeyToApiKey({ field, flow })
      mappedFormData.append(apiField, value)
   }

   return mappedFormData
}
