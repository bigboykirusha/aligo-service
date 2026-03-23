import {
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from './flows'

const freezeRecord = (record) => Object.freeze({ ...record })

export const AUTOGOODS_STORE_FIELD_PREFIXES = Object.freeze([
   'tires_',
   'disks_',
   'moto_tires_',
   'full_wheels_',
   'motor_oil_'
])

export const AUTOGOODS_FLOW_CONDITION_STORE_FIELD = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: 'tires_condition_id',
   [CREATE_FLOW_PARTS_CAR_DISKS]: 'disks_condition_id',
   [CREATE_FLOW_PARTS_MOTO_TIRES]: 'moto_tires_condition_id',
   [CREATE_FLOW_PARTS_FULL_WHEELS]: 'full_wheels_condition_id',
   [CREATE_FLOW_PARTS_MOTOR_OIL]: 'motor_oil_condition_id'
})

export const AUTOGOODS_FLOW_STORE_TO_API_FIELD_MAP = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: freezeRecord({
      tires_condition_id: 'condition_id',
      tires_count: 'count_id',
      tires_brand_id: 'brand_id',
      tires_model_id: 'model_id',
      tires_season_id: 'season_id',
      tires_year_id: 'year_id',
      tires_staggered_set_id: 'staggered_set_id',
      tires_run_flat_id: 'run_flat_id',
      tires_width_id: 'width_id',
      tires_height_id: 'height_id',
      tires_diameter_id: 'diameter_id',
      tires_rear_width_id: 'rear_width_id',
      tires_rear_height_id: 'rear_height_id',
      tires_rear_diameter_id: 'rear_diameter_id',
      tires_load_index_id: 'load_index_id',
      tires_speed_index_id: 'speed_index_id',
      tires_tread_depth_id: 'tread_depth_id',
      tires_bulges_count_id: 'bulge_count_id',
      tires_side_repair_count_id: 'side_repair_count_id',
      tires_defect_none: 'defect_without',
      tires_defect_uneven_wear: 'defect_irregular_wear',
      tires_defect_tread_delamination: 'defect_peeling_tread',
      tires_defect_cracks: 'defect_cracks',
      tires_defect_driven_flat: 'defect_go_on_flat'
   }),
   [CREATE_FLOW_PARTS_CAR_DISKS]: freezeRecord({
      disks_condition_id: 'condition_id',
      disks_count: 'count_id',
      disks_brand_id: 'brand_id',
      disks_model_id: 'model_id',
      disks_rim_diameter_id: 'diameter_id',
      disks_hole_count_id: 'hole_count_id',
      disks_hole_pattern_diameter_id: 'hole_diameter_id',
      disks_type_id: 'type_disk_id',
      disks_dia_id: 'dia_id',
      disks_et_id: 'et_offset_id',
      disks_rim_width_id: 'rim_width_id',
      disks_repair_status_id: 'repair_id',
      disks_straightened_count_id: 'straighten_count_id',
      disks_welded_count_id: 'brew_count_id',
      disks_cracks_count_id: 'crack_count_id',
      disks_geometry_changes_count_id: 'change_geometry_id',
      disks_paint_type_id: 'coloring_type_id',
      disks_center_caps_id: 'central_cap_id',
      disks_pressure_sensors_id: 'pressure_sensor_id',
      disks_defect_none: 'defect_without',
      disks_defect_scratches: 'defect_scratch',
      disks_defect_chips: 'defect_shard',
      disks_defect_coating_delamination: 'defect_peeling_of_coating',
      disks_defect_corrosion_rust: 'defect_corrosion_rust'
   }),
   [CREATE_FLOW_PARTS_MOTO_TIRES]: freezeRecord({
      moto_tires_condition_id: 'condition_id',
      moto_tires_brand_id: 'brand_id',
      moto_tires_width_id: 'width_id',
      moto_tires_height_id: 'height_id',
      moto_tires_diameter_id: 'diameter_id',
      moto_tires_axle_id: 'axle_id'
   }),
   [CREATE_FLOW_PARTS_FULL_WHEELS]: freezeRecord({
      full_wheels_condition_id: 'condition_id',
      full_wheels_count: 'count_id',
      full_wheels_brand_id: 'brand_id',
      full_wheels_model_id: 'model_id',
      full_wheels_staggered_set_id: 'staggered_set_id',
      full_wheels_front_width_id: 'width_id',
      full_wheels_front_height_id: 'height_id',
      full_wheels_front_diameter_id: 'diameter_id',
      full_wheels_rear_width_id: 'rear_width_id',
      full_wheels_rear_height_id: 'rear_height_id',
      full_wheels_rear_diameter_id: 'rear_diameter_id',
      full_wheels_load_index_id: 'load_index_id',
      full_wheels_speed_index_id: 'speed_index_id',
      full_wheels_season_id: 'season_id',
      full_wheels_run_flat_id: 'run_flat_id',
      full_wheels_tread_depth_id: 'tread_depth_id',
      full_wheels_year_id: 'year_id',
      full_wheels_disk_rim_diameter_id: 'wheel_disk_diameter_id',
      full_wheels_disk_hole_count_id: 'hole_count_id',
      full_wheels_disk_hole_pattern_diameter_id: 'hole_diameter_id',
      full_wheels_disk_type_id: 'type_disk_id',
      full_wheels_disk_dia_id: 'dia_id',
      full_wheels_disk_et_id: 'et_offset_id',
      full_wheels_disk_rim_width_id: 'rim_width_id'
   }),
   [CREATE_FLOW_PARTS_MOTOR_OIL]: freezeRecord({
      motor_oil_condition_id: 'condition_id',
      motor_oil_brand_id: 'brand_id',
      motor_oil_sae_id: 'viscosity_sae_id',
      motor_oil_volume_id: 'volume_id',
      motor_oil_acea_id: 'standart_acea_id',
      motor_oil_api_id: 'standart_api_id',
      motor_oil_oem_id: 'allow_oem_id',
      motor_oil_article: 'article',
      motor_oil_article_id: 'article'
   })
})

const AUTOGOODS_FLOW_API_ALIASES_BY_STORE_FIELD = Object.create(null)

const toApiAliasesByStoreField = (flow) => {
   const storeToApiMap = AUTOGOODS_FLOW_STORE_TO_API_FIELD_MAP[flow]
   if (!storeToApiMap) return null

   if (AUTOGOODS_FLOW_API_ALIASES_BY_STORE_FIELD[flow]) {
      return AUTOGOODS_FLOW_API_ALIASES_BY_STORE_FIELD[flow]
   }

   const aliasesByStoreField = {}
   Object.entries(storeToApiMap).forEach(([storeField, apiField]) => {
      if (typeof apiField !== 'string') return
      aliasesByStoreField[storeField] = Object.freeze([apiField])
   })

   const frozen = Object.freeze(aliasesByStoreField)
   AUTOGOODS_FLOW_API_ALIASES_BY_STORE_FIELD[flow] = frozen
   return frozen
}

export const getAutogoodsStoreToApiFieldMap = (flow) =>
   AUTOGOODS_FLOW_STORE_TO_API_FIELD_MAP[flow] || null

export const getAutogoodsApiAliasesByStoreField = (flow) =>
   toApiAliasesByStoreField(flow)

export const isAutogoodsStoreFieldKey = (field) =>
   AUTOGOODS_STORE_FIELD_PREFIXES.some((prefix) =>
      String(field || '').startsWith(prefix)
   )
