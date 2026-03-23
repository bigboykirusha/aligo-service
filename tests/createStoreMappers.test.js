import { describe, expect, it } from 'vitest'
import { mapCreateStoreFromCarData } from '../store/createStore/mappers'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   CREATE_FLOW_MOTO_MOTORCYCLES
} from '../store/createStore/flows'

describe('createStore mappers', () => {
   it('handles undefined backend payload safely', () => {
      const patch = mapCreateStoreFromCarData(undefined, undefined)

      expect(patch.create_flow).toBe(CREATE_FLOW_CARS)
      expect(patch.id).toBeUndefined()
      expect(patch.isDraftEditMode).toBe(false)
      expect(patch.photos).toEqual([])
      expect(patch.color_ids).toEqual([])
      expect(patch.color_custom).toBeNull()
      expect(patch.is_service_book).toBe(0)
      expect(patch.is_serviced_dealer).toBe(0)
      expect(patch.is_under_warranty).toBe(0)
      expect(patch.city_name).toBeNull()
      expect(patch.communication_method_id).toBeNull()
      expect(patch.username).toBeNull()
      expect(patch.email).toBeNull()
      expect(patch.phone).toBeNull()
      expect(patch.isUserDataInitialized).toBe(true)
   })

   it('maps partial nested payload and user fallback fields', () => {
      const patch = mapCreateStoreFromCarData(
         {
            id: 101,
            id_user_owner_ads: 7,
            is_draft: 1,
            is_published: 0,
            condition: { id: 2 },
            photos: [{ id: 1 }],
            auto_appearances: [{ color: [{ id: 55 }], color_custom: 'graphite' }],
            auto_registration_data: [
               { country: { id: 999 }, vin: 'VIN123', state_number: 'A123BC' }
            ],
            auto_technical_specifications: [
               {
                  brand: { id: 1 },
                  model: { id: 2 },
                  generation_standart: { id: 3 },
                  modification_standart: { id: 4 },
                  year_release: { id: 2020 },
                  engine_capacity: 2.5,
                  power: 249,
                  drive: { id: 8 }
               }
            ],
            auto_history_conditions: [
               {
                  mileage: 15000,
                  count_owners: { id: 1 },
                  state: { id: 6 },
                  pts: { id: 2 }
               }
            ],
            maintenance_data: [{ is_service_book: 1 }],
            auto_additional_options: [
               {
                  power_steering: { id: 12 },
                  electric_windows: { id: 13 },
                  audio_systems: { id: 14 }
               }
            ],
            auto_additional_options_heating: [{ is_front_seats: 1 }],
            auto_additional_options_driving_assistance: [{ is_rain_sensor: 1 }],
            auto_additional_multimedia_navigation: [{ is_USB: 1 }],
            auto_additional_tires_wheels: [
               { tires_wheels: [{ id: 88 }], is_winter_included: 1 }
            ],
            ads_parameter: {
               ads_description: 'desc',
               amount: 1200000,
               city: { id: 365, title: 'Москва' },
               latitude: 55.7,
               longitude: 37.6,
               communication_method_id: { id: 4 }
            }
         },
         {
            username: 'tester',
            unconfirmed_email: null,
            email: 'mail@example.com',
            phoneNumber: '+79990000000'
         }
      )

      expect(patch.id).toBe(101)
      expect(patch.id_user_owner_ads).toBe(7)
      expect(patch.isDraftEditMode).toBe(true)
      expect(patch.condition_id).toBe(2)
      expect(patch.photos).toEqual([{ id: 1 }])
      expect(patch.color_ids).toEqual([55])
      expect(patch.color_custom).toBe('graphite')
      expect(patch.country_id).toBe(999)
      expect(patch.vin).toBe('VIN123')
      expect(patch.state_number).toBe('A123BC')
      expect(patch.brand_id).toBe(1)
      expect(patch.model_id).toBe(2)
      expect(patch.generation_id).toBe(3)
      expect(patch.modification_id).toBe(4)
      expect(patch.engine_volume).toBe(2.5)
      expect(patch.power_range).toBe(249)
      expect(patch.drive_id).toBe(8)
      expect(patch.mileage).toBe(15000)
      expect(patch.count_owners).toBe(1)
      expect(patch.state_id).toBe(6)
      expect(patch.pts_id).toBe(2)
      expect(patch.is_service_book).toBe(1)
      expect(patch.is_serviced_dealer).toBe(0)
      expect(patch.power_steering_id).toBe(12)
      expect(patch.electric_windows_id).toBe(13)
      expect(patch.audio_systems_id).toBe(14)
      expect(patch.tires_wheels_id).toBe(88)
      expect(patch.is_front_seats).toBe(1)
      expect(patch.is_rain_sensor).toBe(1)
      expect(patch.is_USB).toBe(1)
      expect(patch.is_winter_included).toBe(1)
      expect(patch.ads_description).toBe('desc')
      expect(patch.amount).toBe(1200000)
      expect(patch.city_id).toBe(365)
      expect(patch.city_name).toBe('Москва')
      expect(patch.latitude).toBe(55.7)
      expect(patch.longitude).toBe(37.6)
      expect(patch.communication_method_id).toBe(4)
      expect(patch.username).toBe('tester')
      expect(patch.email).toBe('mail@example.com')
      expect(patch.phone).toBe('+79990000000')
      expect(patch.isUserDataInitialized).toBe(true)
   })

   it('maps scalar communication method id from legacy api shape', () => {
      const patch = mapCreateStoreFromCarData(
         {
            ads_parameter: {
               communication_method_id: 3
            }
         },
         {}
      )

      expect(patch.communication_method_id).toBe(3)
   })

   it('uses root technical fields and ad contact fallback from api payload', () => {
      const patch = mapCreateStoreFromCarData(
         {
            engine_volume: 2.3,
            power_range: 136,
            auto_technical_specifications: [
               {
                  generation: null,
                  generation_standart: { id: 217 },
                  modification: null,
                  modification_standart: { id: 750 },
                  equipment: { id: 99 },
                  equipment_standart: null
               }
            ],
            ads_parameter: {
               amount: 0,
               username: 'Артем',
               email: 'mail@example.com',
               phone: '+79990000000'
            },
            auto_additional_options: [],
            auto_additional_audio_system: [{ audio_system: [{ id: 17 }] }]
         },
         {
            username: 'profile-user',
            email: 'profile@mail.dev',
            phoneNumber: '+70000000000'
         }
      )

      expect(patch.engine_volume).toBe(2.3)
      expect(patch.power_range).toBe(136)
      expect(patch.generation_id).toBe(217)
      expect(patch.modification_id).toBe(750)
      expect(patch.equipment_id).toBe(99)
      expect(patch.amount).toBe(0)
      expect(patch.username).toBe('Артем')
      expect(patch.email).toBe('mail@example.com')
      expect(patch.phone).toBe('+79990000000')
      expect(patch.audio_systems_id).toBe(17)
   })

   it('extracts disks form fields from nested payload structures', () => {
      const patch = mapCreateStoreFromCarData(
         {
            main_category_id: 3,
            sub_category_id: 1,
            last_category_id: 2,
            payload: {
               parts: {
                  disks: {
                     condition_id: 2,
                     count_id: 4,
                     brand_id: 15,
                     model_id: 77,
                     type_disk_id: 3,
                     rim_width_id: 7.5,
                     et_offset_id: 45
                  }
               }
            }
         },
         {}
      )

      expect(patch.create_flow).toBe('parts-car-disks')
      expect(patch.disks_condition_id).toBe(2)
      expect(patch.disks_count).toBe(4)
      expect(patch.disks_brand_id).toBe(15)
      expect(patch.disks_model_id).toBe(77)
      expect(patch.disks_type_id).toBe(3)
      expect(patch.disks_rim_width_id).toBe(7.5)
      expect(patch.disks_et_id).toBe(45)
   })

   it('maps brand and manufacturer from alias payload keys for parts flows', () => {
      const patch = mapCreateStoreFromCarData({
         create_flow: 'parts-car-tires',
         nested: {
            tires_brand: {
               id: 19,
               title: 'Nokian'
            },
            tires_model: {
               id: 305,
               title: 'Hakkapeliitta'
            }
         }
      })

      expect(patch.tires_brand_id).toBe(19)
      expect(patch.tires_model_id).toBe(305)
      expect(patch.tires_manufacturer).toBe('Nokian')
   })

   it('maps generic autogoods API fields into tires store fields', () => {
      const patch = mapCreateStoreFromCarData({
         main_category_id: 3,
         sub_category_id: 1,
         last_category_id: 1,
         condition_id: 2,
         count_id: 4,
         brand_id: 15,
         model_id: 77,
         season_id: 1,
         year_id: 2022,
         width_id: 225,
         height_id: 55,
         diameter_id: 17,
         load_index_id: 98,
         speed_index_id: 2,
         run_flat_id: 1,
         tread_depth_id: 7,
         bulge_count_id: 0,
         side_repair_count_id: 0,
         defect_without: 1
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(patch.tires_condition_id).toBe(2)
      expect(patch.tires_count).toBe(4)
      expect(patch.tires_brand_id).toBe(15)
      expect(patch.tires_model_id).toBe(77)
      expect(patch.tires_season_id).toBe(1)
      expect(patch.tires_year_id).toBe(2022)
      expect(patch.tires_width_id).toBe(225)
      expect(patch.tires_height_id).toBe(55)
      expect(patch.tires_diameter_id).toBe(17)
      expect(patch.tires_load_index_id).toBe(98)
      expect(patch.tires_speed_index_id).toBe(2)
      expect(patch.tires_run_flat_id).toBe(1)
      expect(patch.tires_tread_depth_id).toBe(7)
      expect(patch.tires_bulges_count_id).toBe(0)
      expect(patch.tires_side_repair_count_id).toBe(0)
      expect(patch.tires_defect_none).toBe(1)
   })

   it('maps autogoods entity payload fields into tires store fields', () => {
      const patch = mapCreateStoreFromCarData({
         id: 25,
         main_category_id: 3,
         sub_category: { id: 1, title: 'Шины, диски и колёса' },
         last_category: { id: 1, title: 'Легковые шины' },
         entity: {
            condition: { id: 2, title: 'Б/у' },
            count: { id: 3, title: '3 шт.' },
            brand: { id: 7, title: 'Achilles' },
            model: { id: 48, title: '2233' },
            season: { id: 1, title: 'Всесезонные' },
            year: { id: 4, title: 2005 },
            width: { id: 3, title: '3.75' },
            height: { id: 3, title: '6' },
            diameter: { id: 3, title: '5.5' },
            load_index: { id: 3, title: '21' },
            speed_index: { id: 5, title: 'F' },
            run_flat: { id: 2, title: 'Нет' },
            defect_without: 1,
            defect_irregular_wear: 0,
            defect_peeling_tread: 0,
            defect_cracks: 0,
            defect_go_on_flat: 0
         }
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(patch.tires_condition_id).toBe(2)
      expect(patch.tires_count).toBe(3)
      expect(patch.tires_brand_id).toBe(7)
      expect(patch.tires_manufacturer).toBe('Achilles')
      expect(patch.tires_model_id).toBe(48)
      expect(patch.tires_season_id).toBe(1)
      expect(patch.tires_year_id).toBe(4)
      expect(patch.tires_width_id).toBe(3)
      expect(patch.tires_height_id).toBe(3)
      expect(patch.tires_diameter_id).toBe(3)
      expect(patch.tires_load_index_id).toBe(3)
      expect(patch.tires_speed_index_id).toBe(5)
      expect(patch.tires_run_flat_id).toBe(2)
      expect(patch.tires_defect_none).toBe(1)
   })

   it('maps autogoods entity payload fields into disks store fields', () => {
      const patch = mapCreateStoreFromCarData({
         id: 26,
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 2, title: 'Disks' },
         entity: {
            condition: { id: 2, title: 'Used' },
            brand: { id: 4, title: '305 Forged' },
            model: { id: 22, title: 'FT114' },
            count: { id: 3, title: '3' },
            repair: { id: 1, title: 'Yes' },
            straighten_count: { id: 1, title: 'None' },
            brew_count: { id: 1, title: 'None' },
            crack_count: { id: 1, title: 'None' },
            change_geometry_count: { id: 1, title: 'None' },
            coloring_type: { id: 1, title: 'Factory' },
            central_cap: { id: 2, title: 'Not all' },
            rim_diameter: { id: 3, title: '6' },
            hole_count: { id: 4, title: '5' },
            hole_diameter: { id: 5, title: '108' },
            type_disk: { id: 3, title: 'Steel' },
            dia: { id: 4, title: '12' },
            et_offset: { id: 4, title: '-6' },
            rim_width: { id: 3, title: '3' },
            pressure_sensor: { id: 1, title: 'Yes' },
            defect_without: 0,
            defect_scratch: 1,
            defect_shard: 1,
            defect_peeling_of_coating: 0,
            defect_corrosion_rust: 0
         }
      })

      expect(patch.create_flow).toBe('parts-car-disks')
      expect(patch.disks_condition_id).toBe(2)
      expect(patch.disks_brand_id).toBe(4)
      expect(patch.disks_manufacturer).toBe('305 Forged')
      expect(patch.disks_model_id).toBe(22)
      expect(patch.disks_count).toBe(3)
      expect(patch.disks_repair_status_id).toBe(1)
      expect(patch.disks_straightened_count_id).toBe(1)
      expect(patch.disks_welded_count_id).toBe(1)
      expect(patch.disks_cracks_count_id).toBe(1)
      expect(patch.disks_geometry_changes_count_id).toBe(1)
      expect(patch.disks_paint_type_id).toBe(1)
      expect(patch.disks_center_caps_id).toBe(2)
      expect(patch.disks_rim_diameter_id).toBe(3)
      expect(patch.disks_hole_count_id).toBe(4)
      expect(patch.disks_hole_pattern_diameter_id).toBe(5)
      expect(patch.disks_type_id).toBe(3)
      expect(patch.disks_dia_id).toBe(4)
      expect(patch.disks_et_id).toBe(4)
      expect(patch.disks_rim_width_id).toBe(3)
      expect(patch.disks_pressure_sensors_id).toBe(1)
      expect(patch.disks_defect_none).toBe(0)
      expect(patch.disks_defect_scratches).toBe(1)
      expect(patch.disks_defect_chips).toBe(1)
      expect(patch.disks_defect_coating_delamination).toBe(0)
      expect(patch.disks_defect_corrosion_rust).toBe(0)
   })

   it('maps autogoods entity payload fields into full wheels store fields', () => {
      const patch = mapCreateStoreFromCarData({
         id: 27,
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 3, title: 'Wheels' },
         entity: {
            condition: { id: 2, title: 'Used' },
            brand: { id: 6, title: 'Accelera' },
            model: { id: 12, title: '651 Sport' },
            count: { id: 2, title: 'for 2 pcs' },
            staggered_set: { id: 2, title: 'No' },
            width: { id: 3, title: '125' },
            height: { id: 3, title: '30' },
            diameter: { id: 3, title: '7' },
            width_rear: null,
            height_rear: null,
            diameter_rear: null,
            load_index: { id: 4, title: '22' },
            speed_index: { id: 4, title: 'E' },
            season: { id: 2, title: 'Summer' },
            run_flat: { id: 1, title: 'Yes' },
            tread_depth: { id: 3, title: '1.2' },
            year: { id: 4, title: 2005 },
            hole_count: { id: 3, title: '4' },
            hole_diameter: { id: 4, title: '108' },
            type_disk: { id: 2, title: 'Alloy' },
            dia: { id: 2, title: '10' },
            rim_width: { id: 2, title: '4' },
            et_offset: { id: 2, title: '-98' }
         }
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_PARTS_FULL_WHEELS)
      expect(patch.full_wheels_condition_id).toBe(2)
      expect(patch.full_wheels_count).toBe(2)
      expect(patch.full_wheels_brand_id).toBe(6)
      expect(patch.full_wheels_manufacturer).toBe('Accelera')
      expect(patch.full_wheels_model_id).toBe(12)
      expect(patch.full_wheels_staggered_set_id).toBe(2)
      expect(patch.full_wheels_front_width_id).toBe(3)
      expect(patch.full_wheels_front_height_id).toBe(3)
      expect(patch.full_wheels_front_diameter_id).toBe(3)
      expect(patch.full_wheels_rear_width_id).toBeNull()
      expect(patch.full_wheels_rear_height_id).toBeNull()
      expect(patch.full_wheels_rear_diameter_id).toBeNull()
      expect(patch.full_wheels_load_index_id).toBe(4)
      expect(patch.full_wheels_speed_index_id).toBe(4)
      expect(patch.full_wheels_season_id).toBe(2)
      expect(patch.full_wheels_run_flat_id).toBe(1)
      expect(patch.full_wheels_tread_depth_id).toBe(3)
      expect(patch.full_wheels_year_id).toBe(4)
      expect(patch.full_wheels_disk_hole_count_id).toBe(3)
      expect(patch.full_wheels_disk_hole_pattern_diameter_id).toBe(4)
      expect(patch.full_wheels_disk_type_id).toBe(2)
      expect(patch.full_wheels_disk_dia_id).toBe(2)
      expect(patch.full_wheels_disk_rim_width_id).toBe(2)
      expect(patch.full_wheels_disk_et_id).toBe(2)
   })

   it('maps autogoods entity payload fields into moto tires store fields', () => {
      const patch = mapCreateStoreFromCarData({
         id: 28,
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 5, title: 'Moto tires' },
         entity: {
            condition: { id: 2, title: 'Used' },
            brand: { id: 3, title: 'Arashi' },
            width: { id: 4, title: '3.5' },
            height: { id: 3, title: '9' },
            diameter: { id: 4, title: '8' },
            axle: { id: 3, title: 'Any' }
         }
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_PARTS_MOTO_TIRES)
      expect(patch.moto_tires_condition_id).toBe(2)
      expect(patch.moto_tires_brand_id).toBe(3)
      expect(patch.moto_tires_width_id).toBe(4)
      expect(patch.moto_tires_height_id).toBe(3)
      expect(patch.moto_tires_diameter_id).toBe(4)
      expect(patch.moto_tires_axle_id).toBe(3)
      expect(patch.moto_tires_count_id).toBeUndefined()
      expect(patch.moto_tires_year_id).toBeUndefined()
   })

   it('maps autogoods entity payload fields into motor oil store fields', () => {
      const patch = mapCreateStoreFromCarData({
         id: 29,
         main_category_id: 3,
         sub_category: { id: 10, title: 'Oils and chemistry' },
         last_category: { id: 7, title: 'Motor oils' },
         entity: {
            condition: { id: 2, title: 'Used' },
            brand: { id: 7, title: 'Addinol' },
            viscosity_sae: { id: 4, title: '0W-12' },
            volume: { id: 7, title: '2.5 l' },
            standart_acea: { id: 7, title: 'A3/B4' },
            standart_api: { id: 21, title: 'GF-5' },
            allow_oem: {
               id: 9,
               title: 'BMW High Performance Diesel Oil'
            },
            article: null
         }
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_PARTS_MOTOR_OIL)
      expect(patch.motor_oil_condition_id).toBe(2)
      expect(patch.motor_oil_brand_id).toBe(7)
      expect(patch.motor_oil_sae_id).toBe(4)
      expect(patch.motor_oil_volume_id).toBe(7)
      expect(patch.motor_oil_acea_id).toBe(7)
      expect(patch.motor_oil_api_id).toBe(21)
      expect(patch.motor_oil_oem_id).toBe(9)
      expect(patch.motor_oil_article_id).toBeNull()
   })

   it('maps moto payload fields with fallback flow when response has no prefixed keys', () => {
      const patch = mapCreateStoreFromCarData(
         {
            brand_id: 21,
            model_id: 118,
            type_id: 3,
            year_id: 133,
            condition_id: 2,
            transmission_id: 2,
            power_range: 136,
            engine_type_id: 1,
            pts_id: 1,
            mileage: 23234,
            count_owners: 2,
            engine_capacity: 2300,
            fuel_feed_id: 1,
            stroke_id: 2,
            drive_type_id: 1,
           cylinder_id: 4,
           number_gear_id: 6,
           cylinder_position_id: 3,
           engine_cooling_id: 2,
           top_speed: 280,
           battery_capacity: 21,
           electric_range: 140,
           charging_time: 4,
           is_start_stop_system: 1,
           is_windscreen: 1
        },
         {},
         { fallbackFlow: CREATE_FLOW_MOTO_MOTORCYCLES }
      )

      expect(patch.create_flow).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(patch.moto_motorcycle_brand_id).toBe(21)
      expect(patch.moto_motorcycle_model_id).toBe(118)
      expect(patch.moto_motorcycle_type_id).toBe(3)
      expect(patch.moto_motorcycle_year).toBe(133)
      expect(patch.moto_motorcycle_condition_id).toBe(2)
      expect(patch.moto_motorcycle_transmission_id).toBe(2)
      expect(patch.moto_motorcycle_power_hp).toBe(136)
      expect(patch.moto_motorcycle_engine_type_id).toBe(1)
      expect(patch.moto_motorcycle_pts_id).toBe(1)
      expect(patch.moto_motorcycle_mileage).toBe(23234)
      expect(patch.moto_motorcycle_count_owner_id).toBe(2)
      expect(patch.moto_motorcycle_engine_volume).toBe(2300)
      expect(patch.moto_motorcycle_fuel_feed_id).toBe(1)
      expect(patch.moto_motorcycle_stroke_id).toBe(2)
      expect(patch.moto_motorcycle_drive_type_id).toBe(1)
      expect(patch.moto_motorcycle_count_cylinder_id).toBe(4)
      expect(patch.moto_motorcycle_number_of_gears_id).toBe(6)
      expect(patch.moto_motorcycle_cylinder_position_id).toBe(3)
      expect(patch.moto_motorcycle_engine_cooling_id).toBe(2)
      expect(patch.moto_motorcycle_top_speed).toBe(280)
      expect(patch.moto_motorcycle_battery_capacity).toBe(21)
      expect(patch.moto_motorcycle_electric_range).toBe(140)
      expect(patch.moto_motorcycle_charging_time).toBe(4)
      expect(patch.moto_motorcycle_is_start_stop).toBe(1)
      expect(patch.moto_motorcycle_is_windshield).toBe(1)
   })

   it('infers moto flow and hydrates moto fields without fallback flow', () => {
      const patch = mapCreateStoreFromCarData({
         vin: 'JH2SC59057M000010',
         brand_id: 21,
         model_id: 118,
         type_id: 3,
         year_id: 133,
         availability_id: 1,
         condition_id: 2,
         transmission_id: 2,
         power_range: 136,
         engine_type_id: 1,
         pts_id: 1,
         mileage: 23234,
         count_owners: 2,
         engine_capacity: 2300,
         fuel_feed_id: 1,
         stroke_id: 2,
         drive_type_id: 1,
         cylinder_id: 4,
         number_gear_id: 6,
         cylinder_position_id: 3,
         engine_cooling_id: 2
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(patch.vin).toBe('JH2SC59057M000010')
      expect(patch.moto_motorcycle_availability_id).toBe(1)
      expect(patch.moto_motorcycle_brand_id).toBe(21)
      expect(patch.moto_motorcycle_model_id).toBe(118)
      expect(patch.moto_motorcycle_type_id).toBe(3)
      expect(patch.moto_motorcycle_year).toBe(133)
   })

   it('maps moto api draft payload with production and fields_only_for_motorcycle shape', () => {
      const patch = mapCreateStoreFromCarData({
         is_draft: 1,
         sub_category: {
            id: 1,
            title: 'Мотоциклы'
         },
         production: {
            brand: { id: 17, title: 'American Eagle' },
            model: { id: 111, title: 'Raptor' },
            type: { id: 5, title: 'Sport' }
         },
         condition: { id: 2, title: 'Б/у' },
         year: { id: 133, title: '2022' },
         engine_type: { id: 1, title: 'Бензин' },
         fuel_feed: { id: 2, title: 'Инжектор' },
         stroke: { id: 1, title: '2' },
         transmission: { id: 3, title: 'Робот' },
         technical_passport: { id: 1, title: 'Оригинал' },
         count_owners: { id: 3, title: '3' },
         mileage: 23324,
         power_range: 1111,
         engine_capacity: 998,
         fields_only_for_motorcycle: {
            drive_type: { id: 1, title: 'Цепь' },
            cylinder: { id: 4, title: '4' },
            number_gear: { id: 3, title: '5' },
            cylinder_position: { id: 2, title: 'Оппозитное' },
            engine_cooling: { id: 1, title: 'Воздушное' }
         }
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(patch.moto_motorcycle_brand_id).toBe(17)
      expect(patch.moto_motorcycle_model_id).toBe(111)
      expect(patch.moto_motorcycle_type_id).toBe(5)
      expect(patch.moto_motorcycle_condition_id).toBe(2)
      expect(patch.moto_motorcycle_year).toBe(133)
      expect(patch.moto_motorcycle_engine_type_id).toBe(1)
      expect(patch.moto_motorcycle_fuel_feed_id).toBe(2)
      expect(patch.moto_motorcycle_stroke_id).toBe(1)
      expect(patch.moto_motorcycle_transmission_id).toBe(3)
      expect(patch.moto_motorcycle_pts_id).toBe(1)
      expect(patch.moto_motorcycle_count_owner_id).toBe(3)
      expect(patch.moto_motorcycle_mileage).toBe(23324)
      expect(patch.moto_motorcycle_power_hp).toBe(1111)
      expect(patch.moto_motorcycle_engine_volume).toBe(998)
      expect(patch.moto_motorcycle_drive_type_id).toBe(1)
      expect(patch.moto_motorcycle_count_cylinder_id).toBe(4)
      expect(patch.moto_motorcycle_number_of_gears_id).toBe(3)
      expect(patch.moto_motorcycle_cylinder_position_id).toBe(2)
      expect(patch.moto_motorcycle_engine_cooling_id).toBe(1)
   })

   it('maps real motorcycle response shape for edit form hydration', () => {
      const patch = mapCreateStoreFromCarData({
         id: 1004,
         main_category_id: 2,
         sub_category: { id: 1, title: 'Мотоциклы' },
         is_draft: 0,
         is_published: 1,
         vin: 'ZZZMT02B1R0000456',
         production: {
            brand: { id: 10, title: 'Agiax' },
            model: { id: 86, title: '250' },
            type: { id: 10, title: 'Кроссовый' }
         },
         condition: { id: 2, title: 'Б/у' },
         availability: { id: 1, title: 'В наличии' },
         year: { id: 112, title: '2001' },
         power_range: 3,
         engine_capacity: 4,
         engine_type: { id: 1, title: 'Бензин' },
         fuel_feed: { id: 1, title: 'Карбюратор' },
         stroke: { id: 1, title: '2' },
         transmission: { id: 3, title: 'Робот' },
         pts: { id: 1, title: 'Оригинал' },
         mileage: 2343,
         count_owners: { id: 2, title: '2' },
         fields_only_for_motorcycle: {
            drive_type: { id: 2, title: 'Ремень' },
            cylinder: { id: 3, title: '3' },
            number_gear: { id: 3, title: '5' },
            cylinder_position: { id: 2, title: 'Оппозитное' },
            engine_cooling: { id: 1, title: 'Воздушное' },
            top_speed: 333,
            battery_capacity: 23,
            electric_range: 32,
            charging_time: 43
         },
         additional_options: {
            is_electric_starter: 0,
            is_abs: 0,
            is_tcs: 1,
            is_start_stop_system: 1,
            is_windscreen: 0,
            is_trunk: 0
         },
         ads_parameter: {
            ads_description: 'тест мотоцикл форма',
            city: { id: 365, title: 'Москва' },
            latitude: '55.755864',
            longitude: '37.617698',
            place_inspection: 'Россия, Москва',
            amount: 544433,
            communication_method_id: {
               id: 1,
               title: 'По телефону и в сообщениях'
            },
            username: 'Артем',
            login: 'login111',
            email: 'bigboykirusha32333@gmail.com'
         },
         photos: [{ id: 12540 }, { id: 12541 }, { id: 12542 }]
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(patch.photos).toHaveLength(3)
      expect(patch.vin).toBe('ZZZMT02B1R0000456')
      expect(patch.moto_motorcycle_brand_id).toBe(10)
      expect(patch.moto_motorcycle_model_id).toBe(86)
      expect(patch.moto_motorcycle_type_id).toBe(10)
      expect(patch.moto_motorcycle_condition_id).toBe(2)
      expect(patch.moto_motorcycle_availability_id).toBe(1)
      expect(patch.moto_motorcycle_year).toBe(112)
      expect(patch.moto_motorcycle_power_hp).toBe(3)
      expect(patch.moto_motorcycle_engine_volume).toBe(4)
      expect(patch.moto_motorcycle_engine_type_id).toBe(1)
      expect(patch.moto_motorcycle_fuel_feed_id).toBe(1)
      expect(patch.moto_motorcycle_stroke_id).toBe(1)
      expect(patch.moto_motorcycle_transmission_id).toBe(3)
      expect(patch.moto_motorcycle_pts_id).toBe(1)
      expect(patch.moto_motorcycle_mileage).toBe(2343)
      expect(patch.moto_motorcycle_count_owner_id).toBe(2)
      expect(patch.moto_motorcycle_drive_type_id).toBe(2)
      expect(patch.moto_motorcycle_count_cylinder_id).toBe(3)
      expect(patch.moto_motorcycle_number_of_gears_id).toBe(3)
      expect(patch.moto_motorcycle_cylinder_position_id).toBe(2)
      expect(patch.moto_motorcycle_engine_cooling_id).toBe(1)
      expect(patch.moto_motorcycle_top_speed).toBe(333)
      expect(patch.moto_motorcycle_battery_capacity).toBe(23)
      expect(patch.moto_motorcycle_electric_range).toBe(32)
      expect(patch.moto_motorcycle_charging_time).toBe(43)
      expect(patch.moto_motorcycle_is_tcs).toBe(1)
      expect(patch.moto_motorcycle_is_start_stop).toBe(1)
      expect(patch.ads_description).toBe('тест мотоцикл форма')
      expect(patch.city_id).toBe(365)
      expect(patch.place_inspection).toBe('Россия, Москва')
      expect(patch.amount).toBe(544433)
      expect(patch.communication_method_id).toBe(1)
      expect(patch.username).toBe('Артем')
      expect(patch.email).toBe('bigboykirusha32333@gmail.com')
   })

   it('maps real scooter response shape for edit form hydration', () => {
      const patch = mapCreateStoreFromCarData({
         id: 1005,
         main_category_id: 2,
         sub_category: { id: 2, title: 'Мопеды и скутеры' },
         is_draft: 0,
         is_published: 0,
         is_cancelled: 1,
         vin: 'ZZZMT02B1R0000456',
         production: {
            brand: { id: 9, title: 'Aima' },
            model: { id: 40, title: 'Mix D350' },
            type: { id: 3, title: 'Мопед' }
         },
         condition: { id: 2, title: 'Б/у' },
         availability: { id: 1, title: 'В наличии' },
         year: { id: 64, title: '1953' },
         power_range: 232,
         engine_capacity: 32,
         engine_type: { id: 1, title: 'Бензин' },
         fuel_feed: { id: 1, title: 'Карбюратор' },
         stroke: { id: 1, title: '2' },
         transmission: { id: 1, title: 'Механика' },
         pts: { id: 1, title: 'Оригинал' },
         mileage: 23233,
         count_owners: { id: 1, title: '1' },
         fields_only_for_motorcycle: null,
         additional_options: {
            is_electric_starter: 1,
            is_abs: 0,
            is_tcs: 0,
            is_start_stop_system: 1,
            is_windscreen: 1,
            is_trunk: 0
         },
         ads_parameter: {
            ads_description: 'мопед тест',
            city: { id: 365, title: 'Москва' },
            latitude: '55.755864',
            longitude: '37.617698',
            place_inspection: 'Россия, Москва',
            amount: 44555,
            communication_method_id: {
               id: 1,
               title: 'По телефону и в сообщениях'
            },
            username: 'Артем',
            login: 'login111',
            email: 'bigboykirusha32333@gmail.com'
         },
         photos: [{ id: 12543 }, { id: 12544 }, { id: 12545 }]
      })

      expect(patch.create_flow).toBe(CREATE_FLOW_MOTO_SCOOTERS)
      expect(patch.photos).toHaveLength(3)
      expect(patch.vin).toBe('ZZZMT02B1R0000456')
      expect(patch.moto_scooter_brand_id).toBe(9)
      expect(patch.moto_scooter_model_id).toBe(40)
      expect(patch.moto_scooter_type_id).toBe(3)
      expect(patch.moto_scooter_condition_id).toBe(2)
      expect(patch.moto_scooter_availability_id).toBe(1)
      expect(patch.moto_scooter_year).toBe(64)
      expect(patch.moto_scooter_power_hp).toBe(232)
      expect(patch.moto_scooter_engine_volume).toBe(32)
      expect(patch.moto_scooter_engine_type_id).toBe(1)
      expect(patch.moto_scooter_fuel_feed_id).toBe(1)
      expect(patch.moto_scooter_stroke_id).toBe(1)
      expect(patch.moto_scooter_transmission_id).toBe(1)
      expect(patch.moto_scooter_pts_id).toBe(1)
      expect(patch.moto_scooter_mileage).toBe(23233)
      expect(patch.moto_scooter_count_owner_id).toBe(1)
      expect(patch.moto_scooter_is_electric_starter).toBe(1)
      expect(patch.moto_scooter_is_start_stop).toBe(1)
      expect(patch.moto_scooter_is_windshield).toBe(1)
      expect(patch.moto_scooter_drive_type_id).toBeUndefined()
      expect(patch.moto_scooter_number_of_gears_id).toBeUndefined()
      expect(patch.moto_scooter_engine_cooling_id).toBeUndefined()
      expect(patch.ads_description).toBe('мопед тест')
      expect(patch.city_id).toBe(365)
      expect(patch.place_inspection).toBe('Россия, Москва')
      expect(patch.amount).toBe(44555)
      expect(patch.communication_method_id).toBe(1)
      expect(patch.username).toBe('Артем')
      expect(patch.email).toBe('bigboykirusha32333@gmail.com')
   })
})
