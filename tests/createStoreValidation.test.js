import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../store/createStore/flows'
import {
   isAdFieldsFilled,
   isCharacteristicFieldsFilled,
   isRequiredValueFilled
} from '../store/createStore/validation'

const createBaseState = (createFlow) => ({
   create_flow: createFlow,
   photos: [],
   color_ids: [],
   country_id: null,
   vin: null,
   state_number: null,
   condition_id: null,
   state_id: null,
   brand_id: null,
   model_id: null,
   generation_id: null,
   modification_id: null,
   equipment_id: null,
   year_id: null,
   count_doors: null,
   car_body_type_id: null,
   transmission_id: null,
   engine_type_id: null,
   handlebar_id: null,
   drive_id: null,
   pts_id: null,

   tires_condition_id: null,
   tires_count: null,
   tires_brand_id: null,
   tires_manufacturer: null,
   tires_model_id: null,
   tires_season_id: null,
   tires_width_id: null,
   tires_height_id: null,
   tires_diameter_id: null,
   tires_load_index_id: null,
   tires_speed_index_id: null,
   tires_run_flat_id: null,
   tires_staggered_set_id: null,
   tires_rear_width_id: null,
   tires_rear_height_id: null,
   tires_rear_diameter_id: null,
   tires_tread_depth_id: null,
   tires_bulges_count_id: null,
   tires_side_repair_count_id: null,
   tires_defect_none: null,
   tires_defect_uneven_wear: null,
   tires_defect_tread_delamination: null,
   tires_defect_cracks: null,
   tires_defect_driven_flat: null,

   disks_condition_id: null,
   disks_count: null,
   disks_brand_id: null,
   disks_manufacturer: null,
   disks_model_id: null,
   disks_rim_diameter_id: null,
   disks_hole_count_id: null,
   disks_hole_pattern_diameter_id: null,
   disks_type_id: null,
   disks_dia_id: null,
   disks_et_id: null,
   disks_rim_width_id: null,
   disks_repair_status_id: null,
   disks_straightened_count_id: null,
   disks_welded_count_id: null,
   disks_cracks_count_id: null,
   disks_geometry_changes_count_id: null,
   disks_paint_type_id: null,
   disks_center_caps_id: null,
   disks_pressure_sensors_id: null,
   disks_defect_none: null,
   disks_defect_scratches: null,
   disks_defect_chips: null,
   disks_defect_coating_delamination: null,
   disks_defect_corrosion_rust: null,

   moto_tires_condition_id: null,
   moto_tires_width_id: null,
   moto_tires_height_id: null,
   moto_tires_diameter_id: null,
   moto_tires_count_id: null,
   moto_tires_axle_id: null,

   full_wheels_condition_id: null,
   full_wheels_staggered_set_id: null,
   full_wheels_front_width_id: null,
   full_wheels_front_height_id: null,
   full_wheels_front_diameter_id: null,
   full_wheels_rear_width_id: null,
   full_wheels_rear_height_id: null,
   full_wheels_rear_diameter_id: null,
   full_wheels_load_index_id: null,
   full_wheels_speed_index_id: null,
   full_wheels_season_id: null,
   full_wheels_run_flat_id: null,
   full_wheels_tread_depth_id: null,
   full_wheels_year_id: null,
   full_wheels_disk_rim_diameter_id: null,
   full_wheels_disk_hole_count_id: null,
   full_wheels_disk_hole_pattern_diameter_id: null,
   full_wheels_disk_type_id: null,
   full_wheels_disk_dia_id: null,
   full_wheels_disk_et_id: null,
   full_wheels_disk_rim_width_id: null,

   motor_oil_condition_id: null,
   motor_oil_brand_id: null,
   motor_oil_sae_id: null,
   motor_oil_volume_id: null,
   motor_oil_acea_id: null,
   motor_oil_api_id: null,
   motor_oil_oem_id: null,
   motor_oil_article_id: null,

   moto_motorcycle_condition_id: null,
   moto_motorcycle_availability_id: null,
   moto_motorcycle_brand_id: null,
   moto_motorcycle_model_id: null,
   moto_motorcycle_type_id: null,
   moto_motorcycle_year: null,
   moto_motorcycle_engine_type_id: null,
   moto_motorcycle_power_hp: null,
   moto_motorcycle_engine_volume: null,
   moto_motorcycle_fuel_feed_id: null,
   moto_motorcycle_drive_type_id: null,
   moto_motorcycle_stroke_id: null,
   moto_motorcycle_count_cylinder_id: null,
   moto_motorcycle_number_of_gears_id: null,
   moto_motorcycle_transmission_id: null,
   moto_motorcycle_cylinder_position_id: null,
   moto_motorcycle_engine_cooling_id: null,
   moto_motorcycle_top_speed: null,
   moto_motorcycle_battery_capacity: null,
   moto_motorcycle_electric_range: null,
   moto_motorcycle_charging_time: null,
   moto_motorcycle_mileage: null,
   moto_motorcycle_pts_id: null,
   moto_motorcycle_count_owner_id: null,

   moto_scooter_condition_id: null,
   moto_scooter_availability_id: null,
   moto_scooter_brand_id: null,
   moto_scooter_model_id: null,
   moto_scooter_type_id: null,
   moto_scooter_year: null,
   moto_scooter_engine_type_id: null,
   moto_scooter_power_hp: null,
   moto_scooter_engine_volume: null,
   moto_scooter_fuel_feed_id: null,
   moto_scooter_drive_type_id: null,
   moto_scooter_stroke_id: null,
   moto_scooter_number_of_gears_id: null,
   moto_scooter_transmission_id: null,
   moto_scooter_engine_cooling_id: null,
   moto_scooter_mileage: null,
   moto_scooter_pts_id: null,
   moto_scooter_count_owner_id: null,

   username: null,
   email: null,
   phone: null,
   ads_description: null,
   place_inspection: null,
   communication_method_id: null,
   amount: null
})

describe('create validation by flow', () => {
   it('treats empty object and NaN as not-filled required values', () => {
      expect(isRequiredValueFilled({})).toBe(false)
      expect(isRequiredValueFilled(Number.NaN)).toBe(false)
      expect(isRequiredValueFilled({ id: 1 })).toBe(true)
      expect(isRequiredValueFilled(0)).toBe(true)
   })

   it('supports russian semantic values in moto and parts condition-dependent validation', () => {
      const motorcycleState = createBaseState(CREATE_FLOW_MOTO_MOTORCYCLES)
      Object.assign(motorcycleState, {
         vin: 'JH2SC59057M000001',
         moto_motorcycle_condition_id: 'б/у',
         moto_motorcycle_availability_id: 1,
         moto_motorcycle_brand_id: 1,
         moto_motorcycle_model_id: 10,
         moto_motorcycle_type_id: 2,
         moto_motorcycle_year: 2021,
         moto_motorcycle_engine_type_id: 1,
         moto_motorcycle_power_hp: 120,
         moto_motorcycle_engine_volume: 1000,
         moto_motorcycle_fuel_feed_id: 1,
         moto_motorcycle_drive_type_id: 1,
         moto_motorcycle_stroke_id: 2,
         moto_motorcycle_count_cylinder_id: 2,
         moto_motorcycle_number_of_gears_id: 6,
         moto_motorcycle_transmission_id: 1,
         moto_motorcycle_cylinder_position_id: 1,
         moto_motorcycle_engine_cooling_id: 1,
         moto_motorcycle_mileage: 12000,
         moto_motorcycle_pts_id: 'нет'
      })

      expect(isCharacteristicFieldsFilled(motorcycleState)).toBe(true)

      const disksState = createBaseState(CREATE_FLOW_PARTS_CAR_DISKS)
      Object.assign(disksState, {
         disks_condition_id: 'б/у',
         disks_count: 4,
         disks_brand_id: 1,
         disks_manufacturer: 'Brand',
         disks_model_id: 2,
         disks_rim_diameter_id: 17,
         disks_hole_count_id: 5,
         disks_hole_pattern_diameter_id: 114,
         disks_type_id: 1,
         disks_dia_id: 67,
         disks_et_id: 45,
         disks_rim_width_id: 7.5,
         disks_repair_status_id: 'да',
         disks_straightened_count_id: 1,
         disks_welded_count_id: 1,
         disks_cracks_count_id: 0,
         disks_geometry_changes_count_id: 0,
         disks_paint_type_id: 1,
         disks_center_caps_id: 1,
         disks_pressure_sensors_id: 1,
         disks_defect_none: 1
      })

      expect(isCharacteristicFieldsFilled(disksState)).toBe(true)
   })

   it('validates cars required fields and conditional state_number/state_id', () => {
      const state = createBaseState(CREATE_FLOW_CARS)
      Object.assign(state, {
         photos: [{ id: 1 }],
         color_ids: [1],
         country_id: 2,
         vin: 'VIN',
         state_number: 'A123AA',
         condition_id: 2,
         state_id: 5,
         brand_id: 1,
         model_id: 2,
         generation_id: 3,
         modification_id: 4,
         equipment_id: 5,
         year_id: 2020,
         count_doors: 4,
         car_body_type_id: 2,
         transmission_id: 2,
         engine_type_id: 1,
         handlebar_id: 1,
         drive_id: 3,
         pts_id: 2
      })

      expect(isCharacteristicFieldsFilled(state)).toBe(true)

      state.state_number = null
      expect(isCharacteristicFieldsFilled(state)).toBe(false)
   })

   it('validates tires flow including used-only defects and staggered rear size', () => {
      const state = createBaseState(CREATE_FLOW_PARTS_CAR_TIRES)
      Object.assign(state, {
         tires_condition_id: 2,
         tires_count: 4,
         tires_brand_id: 1,
         tires_manufacturer: 'Brand',
         tires_model_id: 2,
         tires_season_id: 1,
         tires_width_id: 205,
         tires_height_id: 55,
         tires_diameter_id: 17,
         tires_load_index_id: 91,
         tires_speed_index_id: 1,
         tires_run_flat_id: 1,
         tires_staggered_set_id: 1,
         tires_rear_width_id: 225,
         tires_rear_height_id: 50,
         tires_rear_diameter_id: 17,
         tires_tread_depth_id: 7,
         tires_bulges_count_id: 0,
         tires_side_repair_count_id: 0,
         tires_defect_none: 1
      })

      expect(isCharacteristicFieldsFilled(state)).toBe(true)

      state.tires_defect_none = 0
      expect(isCharacteristicFieldsFilled(state)).toBe(false)
   })

   it('validates disks flow including repair-specific fields and defects', () => {
      const state = createBaseState(CREATE_FLOW_PARTS_CAR_DISKS)
      Object.assign(state, {
         disks_condition_id: 2,
         disks_count: 4,
         disks_brand_id: 1,
         disks_manufacturer: 'Brand',
         disks_model_id: 2,
         disks_rim_diameter_id: 17,
         disks_hole_count_id: 5,
         disks_hole_pattern_diameter_id: 114,
         disks_type_id: 1,
         disks_dia_id: 67,
         disks_et_id: 45,
         disks_rim_width_id: 7.5,
         disks_repair_status_id: 1,
         disks_straightened_count_id: 1,
         disks_welded_count_id: 1,
         disks_cracks_count_id: 0,
         disks_geometry_changes_count_id: 0,
         disks_paint_type_id: 1,
         disks_center_caps_id: 1,
         disks_pressure_sensors_id: 1,
         disks_defect_none: 1
      })

      expect(isCharacteristicFieldsFilled(state)).toBe(true)

      state.disks_defect_none = 0
      expect(isCharacteristicFieldsFilled(state)).toBe(false)
   })

   it('validates moto tires and full wheels minimal required fields', () => {
      const motoState = createBaseState(CREATE_FLOW_PARTS_MOTO_TIRES)
      Object.assign(motoState, {
         moto_tires_condition_id: 1,
         moto_tires_brand_id: 1,
         moto_tires_width_id: 120,
         moto_tires_height_id: 70,
         moto_tires_diameter_id: 17,
         moto_tires_count_id: 2,
         moto_tires_axle_id: 1
      })
      expect(isCharacteristicFieldsFilled(motoState)).toBe(true)

      const fullWheelsState = createBaseState(CREATE_FLOW_PARTS_FULL_WHEELS)
      Object.assign(fullWheelsState, {
         full_wheels_condition_id: 1,
         full_wheels_count: 4,
         full_wheels_brand_id: 1,
         full_wheels_manufacturer: 'Brand',
         full_wheels_model_id: 2,
         full_wheels_staggered_set_id: 0,
         full_wheels_front_width_id: 205,
         full_wheels_front_height_id: 55,
         full_wheels_front_diameter_id: 16,
         full_wheels_load_index_id: 91,
         full_wheels_speed_index_id: 1,
         full_wheels_season_id: 1,
         full_wheels_run_flat_id: 1,
         full_wheels_tread_depth_id: 6,
         full_wheels_year_id: 2021,
         full_wheels_disk_hole_count_id: 5,
         full_wheels_disk_hole_pattern_diameter_id: 114,
         full_wheels_disk_type_id: 1,
         full_wheels_disk_dia_id: 67,
         full_wheels_disk_et_id: 45,
         full_wheels_disk_rim_width_id: 7
      })
      expect(isCharacteristicFieldsFilled(fullWheelsState)).toBe(true)

      fullWheelsState.full_wheels_disk_rim_width_id = null
      expect(isCharacteristicFieldsFilled(fullWheelsState)).toBe(false)
   })

   it('validates motor oil minimal required fields', () => {
      const state = createBaseState(CREATE_FLOW_PARTS_MOTOR_OIL)
      Object.assign(state, {
         motor_oil_condition_id: 1,
         motor_oil_brand_id: 1,
         motor_oil_sae_id: 1,
         motor_oil_volume_id: 1,
         motor_oil_acea_id: 1,
         motor_oil_api_id: 1,
         motor_oil_oem_id: 1
      })
      expect(isCharacteristicFieldsFilled(state)).toBe(true)
   })

   it('validates motorcycles and scooters with condition-dependent fields', () => {
      const motorcycleState = createBaseState(CREATE_FLOW_MOTO_MOTORCYCLES)
      Object.assign(motorcycleState, {
         vin: 'JH2SC59057M000001',
         moto_motorcycle_condition_id: 2,
         moto_motorcycle_availability_id: 1,
         moto_motorcycle_brand_id: 1,
         moto_motorcycle_model_id: 10,
         moto_motorcycle_type_id: 2,
         moto_motorcycle_year: 2021,
         moto_motorcycle_engine_type_id: 1,
         moto_motorcycle_power_hp: 120,
         moto_motorcycle_engine_volume: 1000,
         moto_motorcycle_fuel_feed_id: 1,
         moto_motorcycle_drive_type_id: 1,
         moto_motorcycle_stroke_id: 2,
         moto_motorcycle_count_cylinder_id: 2,
         moto_motorcycle_number_of_gears_id: 6,
         moto_motorcycle_transmission_id: 1,
         moto_motorcycle_cylinder_position_id: 1,
         moto_motorcycle_engine_cooling_id: 1,
         moto_motorcycle_mileage: 12000,
         moto_motorcycle_pts_id: 1,
         moto_motorcycle_count_owner_id: 1
      })
      expect(isCharacteristicFieldsFilled(motorcycleState)).toBe(true)

      const scooterState = createBaseState(CREATE_FLOW_MOTO_SCOOTERS)
      Object.assign(scooterState, {
         vin: 'JH2SC59057M000002',
         moto_scooter_condition_id: 1,
         moto_scooter_availability_id: 1,
         moto_scooter_brand_id: 2,
         moto_scooter_model_id: 22,
         moto_scooter_type_id: 3,
         moto_scooter_year: 2023,
         moto_scooter_engine_type_id: 1,
         moto_scooter_power_hp: 18,
         moto_scooter_engine_volume: 300,
         moto_scooter_fuel_feed_id: 1,
         moto_scooter_stroke_id: 2,
         moto_scooter_transmission_id: 2,
         moto_scooter_pts_id: 1
      })
      expect(isCharacteristicFieldsFilled(scooterState)).toBe(true)

      scooterState.moto_scooter_pts_id = 1
      scooterState.moto_scooter_condition_id = 2
      scooterState.moto_scooter_mileage = null
      expect(isCharacteristicFieldsFilled(scooterState)).toBe(false)
   })
})

describe('create ad-step validation', () => {
   const fillCommonAdFields = (state) => {
      Object.assign(state, {
         username: 'tester',
         email: 't@test.dev',
         phone: '+79990000000',
         ads_description: 'desc',
         place_inspection: 'Moscow',
         communication_method_id: 1,
         amount: 100000
      })
   }

   it('requires photos for autogoods and moto flows', () => {
      const tiresState = createBaseState(CREATE_FLOW_PARTS_CAR_TIRES)
      fillCommonAdFields(tiresState)
      expect(isAdFieldsFilled(tiresState)).toBe(false)

      tiresState.photos = [{ id: 1 }]
      expect(isAdFieldsFilled(tiresState)).toBe(true)

      const motorOilState = createBaseState(CREATE_FLOW_PARTS_MOTOR_OIL)
      fillCommonAdFields(motorOilState)
      expect(isAdFieldsFilled(motorOilState)).toBe(false)
      motorOilState.photos = [{ id: 1 }]
      expect(isAdFieldsFilled(motorOilState)).toBe(true)

      const motorcycleState = createBaseState(CREATE_FLOW_MOTO_MOTORCYCLES)
      fillCommonAdFields(motorcycleState)
      expect(isAdFieldsFilled(motorcycleState)).toBe(false)
      motorcycleState.photos = [{ id: 1 }]
      expect(isAdFieldsFilled(motorcycleState)).toBe(true)
   })
})

