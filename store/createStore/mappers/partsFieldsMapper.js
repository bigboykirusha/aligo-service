import { resolveCreateFlowFromPayload } from '../flowResolvers'
import { createInitialCreateState } from '../state'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../flows'
import {
   asObject,
   findNestedCreateFieldValue,
   findNestedRawValueByKey,
   normalizeNestedCreateFieldValue
} from './utils'
import { getAutogoodsApiAliasesByStoreField } from '../autogoodsFieldMap'

const CREATE_PARTS_FIELD_PREFIXES = [
   'tires_',
   'disks_',
   'moto_tires_',
   'full_wheels_',
   'motor_oil_',
   'moto_motorcycle_',
   'moto_scooter_'
]

const CREATE_PARTS_FIELD_KEYS = Object.keys(createInitialCreateState()).filter(
   (key) => CREATE_PARTS_FIELD_PREFIXES.some((prefix) => key.startsWith(prefix))
)

const CREATE_PARTS_FLOW_FIELD_PREFIXES = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: Object.freeze(['tires_']),
   [CREATE_FLOW_PARTS_CAR_DISKS]: Object.freeze(['disks_']),
   [CREATE_FLOW_PARTS_MOTO_TIRES]: Object.freeze(['moto_tires_']),
   [CREATE_FLOW_PARTS_FULL_WHEELS]: Object.freeze(['full_wheels_']),
   [CREATE_FLOW_PARTS_MOTOR_OIL]: Object.freeze(['motor_oil_']),
   [CREATE_FLOW_MOTO_MOTORCYCLES]: Object.freeze(['moto_motorcycle_']),
   [CREATE_FLOW_MOTO_SCOOTERS]: Object.freeze(['moto_scooter_'])
})

const getPartsFieldKeysByFlow = (flow) => {
   const prefixes = CREATE_PARTS_FLOW_FIELD_PREFIXES[flow]
   if (!prefixes?.length) return CREATE_PARTS_FIELD_KEYS

   return CREATE_PARTS_FIELD_KEYS.filter((key) =>
      prefixes.some((prefix) => key.startsWith(prefix))
   )
}

const CREATE_PARTS_FIELD_ALIASES = Object.freeze({
   tires_condition_id: Object.freeze(['condition']),
   tires_count: Object.freeze(['count']),
   tires_brand_id: Object.freeze(['tires_brand', 'brand']),
   tires_season_id: Object.freeze(['season']),
   tires_year_id: Object.freeze(['year']),
   tires_staggered_set_id: Object.freeze(['staggered_set']),
   tires_width_id: Object.freeze(['width']),
   tires_height_id: Object.freeze(['height']),
   tires_diameter_id: Object.freeze(['diameter']),
   tires_rear_width_id: Object.freeze(['width_rear']),
   tires_rear_height_id: Object.freeze(['height_rear']),
   tires_rear_diameter_id: Object.freeze(['diameter_rear']),
   tires_load_index_id: Object.freeze(['load_index']),
   tires_speed_index_id: Object.freeze(['speed_index']),
   tires_run_flat_id: Object.freeze(['run_flat']),
   tires_tread_depth_id: Object.freeze(['tread_depth']),
   tires_bulges_count_id: Object.freeze(['bulge_count']),
   tires_side_repair_count_id: Object.freeze(['side_repair_count']),
   tires_defect_none: Object.freeze(['defect_without']),
   tires_defect_uneven_wear: Object.freeze(['defect_irregular_wear']),
   tires_defect_tread_delamination: Object.freeze(['defect_peeling_tread']),
   tires_defect_driven_flat: Object.freeze(['defect_go_on_flat']),
   tires_model_id: Object.freeze(['tires_model', 'model']),
   tires_manufacturer: Object.freeze(['tires_brand', 'brand']),
   disks_condition_id: Object.freeze(['condition']),
   disks_count: Object.freeze(['count']),
   disks_brand_id: Object.freeze(['disks_brand', 'brand']),
   disks_rim_diameter_id: Object.freeze(['diameter', 'rim_diameter']),
   disks_hole_count_id: Object.freeze(['hole_count']),
   disks_hole_pattern_diameter_id: Object.freeze(['hole_diameter']),
   disks_type_id: Object.freeze(['type_disk']),
   disks_dia_id: Object.freeze(['dia']),
   disks_et_id: Object.freeze(['et_offset']),
   disks_rim_width_id: Object.freeze(['rim_width']),
   disks_repair_status_id: Object.freeze(['repair']),
   disks_straightened_count_id: Object.freeze(['straighten_count']),
   disks_welded_count_id: Object.freeze(['brew_count']),
   disks_cracks_count_id: Object.freeze(['crack_count']),
   disks_geometry_changes_count_id: Object.freeze([
      'change_geometry',
      'change_geometry_count'
   ]),
   disks_paint_type_id: Object.freeze(['coloring_type']),
   disks_center_caps_id: Object.freeze(['central_cap']),
   disks_pressure_sensors_id: Object.freeze(['pressure_sensor']),
   disks_defect_none: Object.freeze(['defect_without']),
   disks_defect_scratches: Object.freeze(['defect_scratch']),
   disks_defect_chips: Object.freeze(['defect_shard']),
   disks_defect_coating_delamination: Object.freeze([
      'defect_peeling_of_coating'
   ]),
   disks_defect_corrosion_rust: Object.freeze(['defect_corrosion_rust']),
   disks_model_id: Object.freeze(['disks_model', 'model']),
   disks_manufacturer: Object.freeze(['disks_brand', 'brand']),
   moto_tires_condition_id: Object.freeze(['condition']),
   moto_tires_brand_id: Object.freeze(['moto_tires_brand', 'brand']),
   moto_tires_width_id: Object.freeze(['width']),
   moto_tires_height_id: Object.freeze(['height']),
   moto_tires_diameter_id: Object.freeze(['diameter']),
   moto_tires_axle_id: Object.freeze(['axle']),
   moto_tires_year_id: Object.freeze(['moto_tires_year']),
   full_wheels_condition_id: Object.freeze(['condition']),
   full_wheels_count: Object.freeze(['full_wheels_count_id', 'count']),
   full_wheels_brand_id: Object.freeze(['full_wheels_brand', 'brand']),
   full_wheels_staggered_set_id: Object.freeze(['staggered_set']),
   full_wheels_front_width_id: Object.freeze(['width']),
   full_wheels_front_height_id: Object.freeze(['height']),
   full_wheels_front_diameter_id: Object.freeze(['diameter']),
   full_wheels_rear_width_id: Object.freeze(['width_rear']),
   full_wheels_rear_height_id: Object.freeze(['height_rear']),
   full_wheels_rear_diameter_id: Object.freeze(['diameter_rear']),
   full_wheels_load_index_id: Object.freeze(['load_index']),
   full_wheels_speed_index_id: Object.freeze(['speed_index']),
   full_wheels_season_id: Object.freeze(['season']),
   full_wheels_run_flat_id: Object.freeze(['run_flat']),
   full_wheels_tread_depth_id: Object.freeze(['tread_depth']),
   full_wheels_year_id: Object.freeze(['year']),
   full_wheels_disk_rim_diameter_id: Object.freeze([
      'disk_diameter',
      'diameter_disk'
   ]),
   full_wheels_disk_hole_count_id: Object.freeze([
      'hole_count',
      'disk_hole_count'
   ]),
   full_wheels_disk_hole_pattern_diameter_id: Object.freeze([
      'hole_diameter',
      'disk_hole_diameter'
   ]),
   full_wheels_disk_type_id: Object.freeze(['type_disk', 'disk_type']),
   full_wheels_disk_dia_id: Object.freeze(['dia', 'disk_dia']),
   full_wheels_disk_et_id: Object.freeze(['et_offset', 'disk_et_offset']),
   full_wheels_disk_rim_width_id: Object.freeze(['rim_width', 'disk_rim_width']),
   full_wheels_model_id: Object.freeze(['full_wheels_model', 'model']),
   full_wheels_manufacturer: Object.freeze(['full_wheels_brand', 'brand']),
   motor_oil_condition_id: Object.freeze(['condition']),
   motor_oil_brand_id: Object.freeze(['brand']),
   motor_oil_sae_id: Object.freeze(['viscosity_sae']),
   motor_oil_volume_id: Object.freeze(['volume']),
   motor_oil_acea_id: Object.freeze(['standart_acea']),
   motor_oil_api_id: Object.freeze(['standart_api']),
   motor_oil_oem_id: Object.freeze(['allow_oem']),
   motor_oil_article: Object.freeze(['article']),
   motor_oil_article_id: Object.freeze(['article']),
   moto_motorcycle_condition_id: Object.freeze(['condition_id', 'condition']),
   moto_motorcycle_availability_id: Object.freeze(['availability_id', 'availability']),
   moto_motorcycle_brand_id: Object.freeze(['brand_id', 'brand']),
   moto_motorcycle_model_id: Object.freeze(['model_id', 'model']),
   moto_motorcycle_type_id: Object.freeze(['type_id', 'type']),
   moto_motorcycle_year: Object.freeze(['year_id', 'year']),
   moto_motorcycle_engine_type_id: Object.freeze(['engine_type_id', 'engine_type']),
   moto_motorcycle_power_hp: Object.freeze(['power_range', 'power_hp']),
   moto_motorcycle_engine_volume: Object.freeze([
      'engine_capacity',
      'engine_volume'
   ]),
   moto_motorcycle_fuel_feed_id: Object.freeze(['fuel_feed_id', 'fuel_feed']),
   moto_motorcycle_drive_type_id: Object.freeze(['drive_type_id', 'drive_type']),
   moto_motorcycle_stroke_id: Object.freeze(['stroke_id', 'stroke']),
   moto_motorcycle_count_cylinder_id: Object.freeze([
      'cylinder_id',
      'count_cylinder_id',
      'cylinder'
   ]),
   moto_motorcycle_number_of_gears_id: Object.freeze([
      'number_gear_id',
      'number_of_gears_id',
      'number_gear'
   ]),
   moto_motorcycle_transmission_id: Object.freeze(['transmission_id', 'transmission']),
   moto_motorcycle_cylinder_position_id: Object.freeze([
      'cylinder_position_id',
      'cylinder_position'
   ]),
   moto_motorcycle_engine_cooling_id: Object.freeze([
      'engine_cooling_id',
      'engine_cooling'
   ]),
   moto_motorcycle_top_speed: Object.freeze(['top_speed']),
   moto_motorcycle_battery_capacity: Object.freeze(['battery_capacity']),
   moto_motorcycle_electric_range: Object.freeze(['electric_range']),
   moto_motorcycle_charging_time: Object.freeze(['charging_time']),
   moto_motorcycle_mileage: Object.freeze(['mileage']),
   moto_motorcycle_pts_id: Object.freeze(['pts_id', 'pts', 'technical_passport']),
   moto_motorcycle_count_owner_id: Object.freeze([
      'count_owners',
      'count_owner_id'
   ]),
   moto_motorcycle_is_electric_starter: Object.freeze(['is_electric_starter']),
   moto_motorcycle_is_abs: Object.freeze(['is_abs']),
   moto_motorcycle_is_tcs: Object.freeze(['is_tcs']),
   moto_motorcycle_is_start_stop: Object.freeze([
      'is_start_stop_system',
      'is_start_stop'
   ]),
   moto_motorcycle_is_windshield: Object.freeze([
      'is_windscreen',
      'is_windshield'
   ]),
   moto_motorcycle_is_trunk: Object.freeze(['is_trunk']),
   moto_scooter_condition_id: Object.freeze(['condition_id', 'condition']),
   moto_scooter_availability_id: Object.freeze(['availability_id', 'availability']),
   moto_scooter_brand_id: Object.freeze(['brand_id', 'brand']),
   moto_scooter_model_id: Object.freeze(['model_id', 'model']),
   moto_scooter_type_id: Object.freeze(['type_id', 'type']),
   moto_scooter_year: Object.freeze(['year_id', 'year']),
   moto_scooter_engine_type_id: Object.freeze(['engine_type_id', 'engine_type']),
   moto_scooter_power_hp: Object.freeze(['power_range', 'power_hp']),
   moto_scooter_engine_volume: Object.freeze(['engine_capacity', 'engine_volume']),
   moto_scooter_fuel_feed_id: Object.freeze(['fuel_feed_id', 'fuel_feed']),
   moto_scooter_drive_type_id: Object.freeze(['drive_type_id']),
   moto_scooter_stroke_id: Object.freeze(['stroke_id', 'stroke']),
   moto_scooter_number_of_gears_id: Object.freeze([
      'number_gear_id',
      'number_of_gears_id',
      'number_gear'
   ]),
   moto_scooter_transmission_id: Object.freeze(['transmission_id', 'transmission']),
   moto_scooter_engine_cooling_id: Object.freeze([
      'engine_cooling_id',
      'engine_cooling'
   ]),
   moto_scooter_mileage: Object.freeze(['mileage']),
   moto_scooter_pts_id: Object.freeze(['pts_id', 'pts', 'technical_passport']),
   moto_scooter_count_owner_id: Object.freeze(['count_owners', 'count_owner_id']),
   moto_scooter_is_electric_starter: Object.freeze(['is_electric_starter']),
   moto_scooter_is_abs: Object.freeze(['is_abs']),
   moto_scooter_is_tcs: Object.freeze(['is_tcs']),
   moto_scooter_is_start_stop: Object.freeze([
      'is_start_stop_system',
      'is_start_stop'
   ]),
   moto_scooter_is_windshield: Object.freeze(['is_windscreen', 'is_windshield']),
   moto_scooter_is_trunk: Object.freeze(['is_trunk'])
})

const findAliasValueWithEntityPriority = (source, alias) => {
   const entityValue = findNestedRawValueByKey(source?.entity, alias)
   if (entityValue !== undefined) {
      return entityValue
   }

   return findNestedRawValueByKey(source, alias)
}

export const mapPartsFieldsPatch = (carData, fallbackFlow) => {
   const source = asObject(carData)
   const patch = {}

   const flow = resolveCreateFlowFromPayload(source, { fallbackFlow })
   if (flow === CREATE_FLOW_CARS) return patch
   const flowFieldKeys = getPartsFieldKeysByFlow(flow)
   const flowAutogoodsAliases = getAutogoodsApiAliasesByStoreField(flow) || {}

   flowFieldKeys.forEach((key) => {
      const directValue = findNestedCreateFieldValue(source, key)
      if (directValue !== undefined) {
         patch[key] = directValue
         return
      }

      const aliases = [
         ...(CREATE_PARTS_FIELD_ALIASES[key] || []),
         ...(flowAutogoodsAliases[key] || [])
      ]
      for (const alias of aliases) {
         const aliasValue = findAliasValueWithEntityPriority(source, alias)
         const normalizedAliasValue = normalizeNestedCreateFieldValue(
            key,
            aliasValue
         )
         if (normalizedAliasValue !== undefined) {
            patch[key] = normalizedAliasValue
            break
         }
      }
   })

   return patch
}
