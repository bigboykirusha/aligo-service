import { describe, expect, it } from 'vitest'

import {
   normalizeAutogoodsCatalogPayloadForApi,
   resolveAutogoodsLastCategoryPrefix
} from '../composables/catalog/pages/autogoodsCatalogPayload'
import { createTirePresetFactories } from '../composables/filters/domain/catalogFiltersTirePresets'
import { createPartsPresetFactories } from '../composables/filters/domain/catalogFiltersPartsPresets'
import { getPartsCatalogCategoryByPathKey } from '../composables/parts/domain/partsCatalogRegistry'

describe('autogoodsCatalogPayload', () => {
   const field = (type) => (key, label, extra = {}) => ({
      type,
      key,
      label,
      ...extra
   })
   const selectField = field('select')
   const checkboxListField = field('checkbox-list')
   const rangeField = (key, label, extra = {}) => ({
      type: 'range',
      key,
      label,
      defaultValue: { min: null, max: null },
      payloadKeys: [`${key}_from`, `${key}_to`],
      queryKeys: [`${key}_from`, `${key}_to`],
      ...extra
   })
   const searchableListField = (key, label, options = [], extra = {}) => ({
      type: 'searchable-checkbox-list',
      key,
      label,
      options,
      defaultValue: [],
      ...extra
   })
   const mappedStateField = (extra = {}) => ({
      type: 'tabs',
      key: 'state',
      label: 'Состояние',
      options: [],
      defaultValue: 'all',
      ...extra
   })
   const priceAndQueryFields = () => []
   const tiresBrandModelFields = () => [
      searchableListField('brand', 'Бренд / производитель', [], {
         payloadKey: 'tires_brand_id'
      }),
      searchableListField('model', 'Модель', [], {
         payloadKey: 'tires_model_id'
      })
   ]
   const disksBrandModelFields = () => [
      searchableListField('brand', 'Бренд / производитель', [], {
         payloadKey: 'disks_brand_id'
      }),
      searchableListField('model', 'Модель', [], {
         payloadKey: 'disks_model_id'
      })
   ]
   const tireFactories = createTirePresetFactories({
      mappedStateField,
      selectField,
      checkboxListField,
      priceAndQueryFields,
      tiresBrandModelFields,
      disksBrandModelFields,
      searchableListField,
      rangeField,
      nums: (items) => items.map((item) => ({ id: item, title: String(item) })),
      opts: (items) => items.map((item) => ({ id: item, title: String(item) }))
   })
   const partsFactories = createPartsPresetFactories({
      tabsField: field('tabs'),
      selectField,
      searchableSelectField: field('select'),
      searchableListField,
      checkboxListField,
      rangeField,
      vehicleChainFields: () => [],
      baseFields: () => [],
      mappedStateField,
      priceAndQueryFields,
      opts: (items) => items.map((item) => ({ id: item, title: String(item) })),
      nums: (items) => items.map((item) => ({ id: item, title: String(item) })),
      COMMON_BRANDS: []
   })

   it('maps root parts payload to generic autogoods filters contract', () => {
      expect(
         normalizeAutogoodsCatalogPayloadForApi({
            payload: {
               amount_from: '500',
               amount_to: '1000',
               query: 'осмотр'
            },
            page: 2,
            count: 15,
            orderBy: 'asc'
         })
      ).toMatchObject({
         page: 2,
         count: 15,
         order_by: 'asc',
         amount_from: 500,
         amount_to: 1000,
         search_description: 'осмотр'
      })
   })

   it('maps tires payload to backend singular keys', () => {
      expect(
         normalizeAutogoodsCatalogPayloadForApi({
            payload: {
               sub_category_id: 1,
               last_category_id: 1,
               amount_from: 200,
               amount_to: 1000,
               query: 'РѕРїРёСЃР°',
               tires_width_id: '3',
               tires_height_id: '4',
               tires_diameter_id: '5',
               tires_season_id: ['1', '2'],
               tires_brand_id: '5',
               tires_model_id: '6',
               tires_run_flat_id: '2',
               tires_count: '1',
               tires_condition_id: '1',
               tires_year_id: '5'
            },
         })
      ).toMatchObject({
         sub_category_id: 1,
         last_category_id: 1,
         tire_amount_from: 200,
         tire_amount_to: 1000,
         tire_search_description: 'РѕРїРёСЃР°',
         tire_width_id: 3,
         tire_height_id: 4,
         tire_diameter_id: 5,
         tire_season_id: [1, 2],
         tire_brand_id: [5],
         tire_model_id: [6],
         tire_run_flat_id: 2,
         tire_count_id: 1,
         tire_condition_id: 1,
         tire_year_id: 5
      })
      expect(
         normalizeAutogoodsCatalogPayloadForApi({
            payload: {
               sub_category_id: 1,
               last_category_id: 1,
               amount_from: 200,
               amount_to: 1000,
               query: 'РѕРїРёСЃР°'
            }
         }).amount_from
      ).toBeUndefined()
   })

   it('maps disks, wheels and motor oil payloads to backend filter keys', () => {
      const disksPayload = normalizeAutogoodsCatalogPayloadForApi({
         payload: {
            sub_category_id: 1,
            last_category_id: 2,
            amount_from: 360,
            amount_to: 900,
            query: 'РґРёСЃРєРё',
            disks_type_id: '1',
            disks_rim_diameter_id: '5',
            disks_rim_width_id: '3',
            disks_hole_count_id: '3',
            disks_hole_pattern_diameter_id: ['2', '3'],
            disks_dia_id: ['4', '5'],
            disks_brand_id: ['2', '3'],
            disks_model_id: ['5', '6'],
            disks_et_id: ['2', '3'],
            disks_condition_id: '1',
            disks_repair_status_id: '1',
            disks_straightened_count_id: '2',
            disks_welded_count_id: '3',
            disks_cracks_count_id: '4',
            disks_geometry_changes_count_id: '5',
            disks_paint_type_id: '6',
            disks_center_caps_id: '1',
            disks_pressure_sensors_id: '0'
         }
      })

      expect(disksPayload).toMatchObject({
         disk_amount_from: 360,
         disk_amount_to: 900,
         disk_search_description: 'РґРёСЃРєРё',
         disk_type_disk_id: 1,
         disk_diameter_id: 5,
         disk_rim_width_id: 3,
         disk_hole_count_id: 3,
         disk_hole_diameter_id: [2, 3],
         disk_dia_id: [4, 5],
         disk_brand_id: [2, 3],
         disk_model_id: [5, 6],
         disk_et_offset_id: [2, 3],
         disk_condition_id: 1,
         disk_repair_id: 1,
         disk_straighten_count_id: 2,
         disk_brew_count_id: 3,
         disk_crack_count_id: 4,
         disk_change_geometry_id: 5,
         disk_coloring_type_id: 6,
         disk_central_cap_id: 1,
         disk_pressure_sensor_id: 0
      })
      expect(disksPayload.amount_from).toBeUndefined()
      expect(disksPayload.search_description).toBeUndefined()

      const wheelsPayload = normalizeAutogoodsCatalogPayloadForApi({
         payload: {
            sub_category_id: 1,
            last_category_id: 3,
            amount_from: 360,
            amount_to: 900,
            query: 'колеса',
            all_ads: '1',
            full_wheels_front_width_id: '3',
            full_wheels_front_height_id: '3',
            full_wheels_front_diameter_id: '1',
            full_wheels_brand_id: ['5', '6'],
            full_wheels_model_id: ['8', '9'],
            full_wheels_staggered_set_id: '1',
            full_wheels_rear_width_id: '10',
            full_wheels_rear_height_id: '11',
            full_wheels_rear_diameter_id: '12',
            full_wheels_load_index_id: '14',
            full_wheels_speed_index_id: '15',
            full_wheels_run_flat_id: '6',
            full_wheels_disk_rim_width_id: '5',
            full_wheels_disk_rim_diameter_id: '16',
            full_wheels_disk_hole_count_id: '4',
            full_wheels_disk_hole_pattern_diameter_id: ['6', '7'],
            full_wheels_disk_dia_id: ['1', '2'],
            wheel_et_offset_id_from: '3',
            wheel_et_offset_id_to: '8',
            full_wheels_condition_id: '1',
            full_wheels_year_id: '6',
            full_wheels_tread_depth_id: '9',
            full_wheels_season_id: ['2']
         }
      })

      expect(wheelsPayload).toMatchObject({
         all_ads: 1,
         wheel_amount_from: 360,
         wheel_amount_to: 900,
         wheel_search_description: 'колеса',
         wheel_width_id: 3,
         wheel_height_id: 3,
         wheel_diameter_id: 1,
         wheel_brand_id: [5, 6],
         wheel_model_id: [8, 9],
         wheel_staggered_set_id: 1,
         wheel_rear_width_id: 10,
         wheel_rear_height_id: 11,
         wheel_rear_diameter_id: 12,
         wheel_load_index_id: 14,
         wheel_speed_index_id: 15,
         wheel_run_flat_id: 6,
         wheel_disk_diameter_id: 16,
         wheel_rim_width_id: 5,
         wheel_hole_count_id: 4,
         wheel_hole_diameter_id: [6, 7],
         wheel_dia_id: [1, 2],
         wheel_et_offset_id_from: 3,
         wheel_et_offset_id_to: 8,
         wheel_condition_id: 1,
         wheel_year_id: 6,
         wheel_tread_depth_id: 9,
         wheel_season_id: [2]
      })
      expect(wheelsPayload.amount_from).toBeUndefined()
      expect(wheelsPayload.search_description).toBeUndefined()

      const motorOilPayload = normalizeAutogoodsCatalogPayloadForApi({
         payload: {
            sub_category_id: 10,
            last_category_id: 7,
            amount_from: 70,
            amount_to: 490,
            query: 'запч',
            motor_oil_brand_id: ['8', '10'],
            motor_oil_sae_id: ['2', '3'],
            motor_oil_volume_id: ['2', '3'],
            motor_oil_acea_id: ['3', '2'],
            motor_oil_api_id: ['6', '7'],
            motor_oil_oem_id: ['5', '6'],
            motor_oil_condition_id: '1'
         }
      })

      expect(motorOilPayload).toMatchObject({
         motor_oil_amount_from: 70,
         motor_oil_amount_to: 490,
         motor_oil_search_description: 'запч',
         motor_oil_brand_id: [8, 10],
         motor_oil_viscosity_sae_id: [2, 3],
         motor_oil_volume_id: [2, 3],
         motor_oil_standart_acea_id: [3, 2],
         motor_oil_standart_api_id: [6, 7],
         motor_oil_allow_oem_id: [5, 6],
         motor_oil_condition_id: 1
      })
      expect(motorOilPayload.amount_from).toBeUndefined()
      expect(motorOilPayload.search_description).toBeUndefined()
   })

   it('exposes category payload patches for parts routes', () => {
      expect(getPartsCatalogCategoryByPathKey('tires-disks-wheels')?.payloadPatch)
         .toMatchObject({ sub_category_id: 1 })
      expect(
         getPartsCatalogCategoryByPathKey('tires-disks-wheels/disks')?.payloadPatch
      ).toMatchObject({ sub_category_id: 1, last_category_id: 2 })
      expect(
         getPartsCatalogCategoryByPathKey('oils-and-chemistry/motor-oils')
            ?.payloadPatch
      ).toMatchObject({ sub_category_id: 10, last_category_id: 7 })
   })

   it('resolves backend prefix by last category id', () => {
      expect(resolveAutogoodsLastCategoryPrefix(1)).toBe('tire')
      expect(resolveAutogoodsLastCategoryPrefix(2)).toBe('disk')
      expect(resolveAutogoodsLastCategoryPrefix(3)).toBe('wheel')
      expect(resolveAutogoodsLastCategoryPrefix(5)).toBe('moto_tire')
      expect(resolveAutogoodsLastCategoryPrefix(7)).toBe('motor_oil')
      expect(resolveAutogoodsLastCategoryPrefix(999)).toBeNull()
   })

   it('does not pass city to autogoods filters payload', () => {
      const payload = normalizeAutogoodsCatalogPayloadForApi({
         payload: {
            city: 'moskva',
            sub_category_id: 1,
            last_category_id: 1,
            amount_from: 200
         }
      })

      expect(payload.sub_category_id).toBe(1)
      expect(payload.last_category_id).toBe(1)
      expect(payload.tire_amount_from).toBe(200)
      expect(payload).not.toHaveProperty('city')
   })

   it('exposes multiselect and range controls for backend-capable parts filters', () => {
      const disksSchema = tireFactories.tiresDisksFields()
      const wheelsSchema = tireFactories.tiresWheelsFields()
      const motorOilSchema = partsFactories.fluidsEngineOilFields()

      expect(disksSchema.find((field) => field.key === 'brand')?.type).toBe(
         'searchable-checkbox-list'
      )
      expect(disksSchema.find((field) => field.key === 'model')?.type).toBe(
         'searchable-checkbox-list'
      )
      expect(disksSchema.find((field) => field.key === 'et')?.type).toBe(
         'searchable-checkbox-list'
      )
      expect(wheelsSchema.find((field) => field.key === 'wheelBrand')?.type).toBe(
         'searchable-checkbox-list'
      )
      expect(wheelsSchema.find((field) => field.key === 'wheelModel')?.type).toBe(
         'searchable-checkbox-list'
      )
      expect(
         wheelsSchema.find((field) => field.key === 'wheelDiskEtOffset')
            ?.payloadKeys
      ).toEqual(['wheel_et_offset_id_from', 'wheel_et_offset_id_to'])
      expect(
         motorOilSchema.find((field) => field.key === 'motorOilBrand')?.type
      ).toBe('searchable-checkbox-list')
   })
})

