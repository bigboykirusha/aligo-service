import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../store/createStore/flows'
import { remapAutogoodsCreateFormDataForApi } from '../store/createStore/autogoodsPayload'

describe('create autogoods payload remapper', () => {
   it('remaps tires fields and strips prefixed-only fields', () => {
      const formData = new FormData()
      formData.append('tires_condition_id', '2')
      formData.append('tires_count', '4')
      formData.append('tires_brand_id', '15')
      formData.append('tires_model_id', '77')
      formData.append('tires_manufacturer', 'Nokian')
      formData.append('ads_description', 'desc')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_CAR_TIRES,
         store: {}
      })

      expect(mapped.get('condition_id')).toBe('2')
      expect(mapped.get('count_id')).toBe('4')
      expect(mapped.get('brand_id')).toBe('15')
      expect(mapped.get('model_id')).toBe('77')
      expect(mapped.get('ads_description')).toBe('desc')
      expect(mapped.get('tires_condition_id')).toBeNull()
      expect(mapped.get('tires_manufacturer')).toBeNull()
   })

   it('injects category condition_id when not present in formData', () => {
      const formData = new FormData()
      formData.append('is_draft', '1')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_MOTOR_OIL,
         store: {
            motor_oil_condition_id: 1
         }
      })

      expect(mapped.get('is_draft')).toBe('1')
      expect(mapped.get('condition_id')).toBe('1')
   })

    it('remaps motor oil fields to latest autogoods API contract', () => {
      const formData = new FormData()
      formData.append('motor_oil_condition_id', '2')
      formData.append('motor_oil_brand_id', '7')
      formData.append('motor_oil_sae_id', '4')
      formData.append('motor_oil_volume_id', '7')
      formData.append('motor_oil_acea_id', '7')
      formData.append('motor_oil_api_id', '21')
      formData.append('motor_oil_oem_id', '9')
      formData.append('motor_oil_article_id', 'AB-123')
      formData.append('ads_description', 'oil')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_MOTOR_OIL,
         store: {}
      })

      expect(mapped.get('condition_id')).toBe('2')
      expect(mapped.get('brand_id')).toBe('7')
      expect(mapped.get('viscosity_sae_id')).toBe('4')
      expect(mapped.get('volume_id')).toBe('7')
      expect(mapped.get('standart_acea_id')).toBe('7')
      expect(mapped.get('standart_api_id')).toBe('21')
      expect(mapped.get('allow_oem_id')).toBe('9')
      expect(mapped.get('article')).toBe('AB-123')
      expect(mapped.get('ads_description')).toBe('oil')
      expect(mapped.get('motor_oil_condition_id')).toBeNull()
   })

   it('remaps disks fields to latest autogoods API contract', () => {
      const formData = new FormData()
      formData.append('disks_condition_id', '2')
      formData.append('disks_count', '3')
      formData.append('disks_brand_id', '4')
      formData.append('disks_model_id', '22')
      formData.append('disks_rim_diameter_id', '3')
      formData.append('disks_hole_count_id', '4')
      formData.append('disks_hole_pattern_diameter_id', '5')
      formData.append('disks_type_id', '3')
      formData.append('disks_dia_id', '4')
      formData.append('disks_et_id', '4')
      formData.append('disks_rim_width_id', '3')
      formData.append('disks_repair_status_id', '1')
      formData.append('disks_geometry_changes_count_id', '1')
      formData.append('disks_pressure_sensors_id', '1')
      formData.append('disks_defect_scratches', '1')
      formData.append('disks_year_id', '2020')
      formData.append('ads_description', 'disks')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_CAR_DISKS,
         store: {}
      })

      expect(mapped.get('condition_id')).toBe('2')
      expect(mapped.get('count_id')).toBe('3')
      expect(mapped.get('brand_id')).toBe('4')
      expect(mapped.get('model_id')).toBe('22')
      expect(mapped.get('diameter_id')).toBe('3')
      expect(mapped.get('hole_count_id')).toBe('4')
      expect(mapped.get('hole_diameter_id')).toBe('5')
      expect(mapped.get('type_disk_id')).toBe('3')
      expect(mapped.get('dia_id')).toBe('4')
      expect(mapped.get('et_offset_id')).toBe('4')
      expect(mapped.get('rim_width_id')).toBe('3')
      expect(mapped.get('repair_id')).toBe('1')
      expect(mapped.get('change_geometry_id')).toBe('1')
      expect(mapped.get('pressure_sensor_id')).toBe('1')
      expect(mapped.get('defect_scratch')).toBe('1')
      expect(mapped.get('ads_description')).toBe('disks')
      expect(mapped.get('disks_condition_id')).toBeNull()
      expect(mapped.get('disks_year_id')).toBeNull()
   })

   it('remaps full wheels fields to latest autogoods API contract', () => {
      const formData = new FormData()
      formData.append('full_wheels_condition_id', '2')
      formData.append('full_wheels_count', '2')
      formData.append('full_wheels_brand_id', '6')
      formData.append('full_wheels_model_id', '12')
      formData.append('full_wheels_staggered_set_id', '2')
      formData.append('full_wheels_front_width_id', '3')
      formData.append('full_wheels_front_height_id', '3')
      formData.append('full_wheels_front_diameter_id', '3')
      formData.append('full_wheels_rear_width_id', '')
      formData.append('full_wheels_rear_height_id', '')
      formData.append('full_wheels_rear_diameter_id', '')
      formData.append('full_wheels_load_index_id', '4')
      formData.append('full_wheels_speed_index_id', '4')
      formData.append('full_wheels_season_id', '2')
      formData.append('full_wheels_run_flat_id', '1')
      formData.append('full_wheels_tread_depth_id', '3')
      formData.append('full_wheels_year_id', '4')
      formData.append('full_wheels_disk_hole_count_id', '3')
      formData.append('full_wheels_disk_hole_pattern_diameter_id', '4')
      formData.append('full_wheels_disk_type_id', '2')
      formData.append('full_wheels_disk_dia_id', '2')
      formData.append('full_wheels_disk_et_id', '2')
      formData.append('full_wheels_disk_rim_width_id', '2')
      formData.append('full_wheels_disk_rim_diameter_id', '17')
      formData.append('ads_description', 'wheels')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_FULL_WHEELS,
         store: {}
      })

      expect(mapped.get('condition_id')).toBe('2')
      expect(mapped.get('count_id')).toBe('2')
      expect(mapped.get('brand_id')).toBe('6')
      expect(mapped.get('model_id')).toBe('12')
      expect(mapped.get('staggered_set_id')).toBe('2')
      expect(mapped.get('width_id')).toBe('3')
      expect(mapped.get('height_id')).toBe('3')
      expect(mapped.get('diameter_id')).toBe('3')
      expect(mapped.get('rear_width_id')).toBe('')
      expect(mapped.get('rear_height_id')).toBe('')
      expect(mapped.get('rear_diameter_id')).toBe('')
      expect(mapped.get('load_index_id')).toBe('4')
      expect(mapped.get('speed_index_id')).toBe('4')
      expect(mapped.get('season_id')).toBe('2')
      expect(mapped.get('run_flat_id')).toBe('1')
      expect(mapped.get('tread_depth_id')).toBe('3')
      expect(mapped.get('year_id')).toBe('4')
      expect(mapped.get('hole_count_id')).toBe('3')
      expect(mapped.get('hole_diameter_id')).toBe('4')
      expect(mapped.get('type_disk_id')).toBe('2')
      expect(mapped.get('dia_id')).toBe('2')
      expect(mapped.get('et_offset_id')).toBe('2')
      expect(mapped.get('rim_width_id')).toBe('2')
      expect(mapped.get('wheel_disk_diameter_id')).toBe('17')
      expect(mapped.get('full_wheels_disk_rim_diameter_id')).toBeNull()
      expect(mapped.get('ads_description')).toBe('wheels')
   })

   it('remaps moto tires fields to latest autogoods API contract', () => {
      const formData = new FormData()
      formData.append('moto_tires_condition_id', '2')
      formData.append('moto_tires_brand_id', '3')
      formData.append('moto_tires_width_id', '4')
      formData.append('moto_tires_height_id', '3')
      formData.append('moto_tires_diameter_id', '4')
      formData.append('moto_tires_axle_id', '3')
      formData.append('moto_tires_count_id', '2')
      formData.append('moto_tires_year_id', '2024')
      formData.append('ads_description', 'moto tires')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_PARTS_MOTO_TIRES,
         store: {}
      })

      expect(mapped.get('condition_id')).toBe('2')
      expect(mapped.get('brand_id')).toBe('3')
      expect(mapped.get('width_id')).toBe('4')
      expect(mapped.get('height_id')).toBe('3')
      expect(mapped.get('diameter_id')).toBe('4')
      expect(mapped.get('axle_id')).toBe('3')
      expect(mapped.get('moto_tires_count_id')).toBeNull()
      expect(mapped.get('moto_tires_year_id')).toBeNull()
      expect(mapped.get('ads_description')).toBe('moto tires')
   })

   it('keeps untouched payload for non-autogoods flows', () => {
      const formData = new FormData()
      formData.append('condition_id', '2')

      const mapped = remapAutogoodsCreateFormDataForApi({
         formData,
         flow: CREATE_FLOW_CARS,
         store: {}
      })

      expect(mapped).toBe(formData)
      expect(mapped.get('condition_id')).toBe('2')
   })
})
