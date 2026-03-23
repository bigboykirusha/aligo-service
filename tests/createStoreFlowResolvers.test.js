import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../store/createStore/flows'
import { resolveCreateFlowFromPayload } from '../store/createStore/flowResolvers'

describe('create flow resolvers', () => {
   it('resolves direct create flow fields', () => {
      expect(
         resolveCreateFlowFromPayload({ create_flow: CREATE_FLOW_PARTS_CAR_TIRES })
      ).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(
         resolveCreateFlowFromPayload({ flow: CREATE_FLOW_PARTS_MOTOR_OIL })
      ).toBe(CREATE_FLOW_PARTS_MOTOR_OIL)
   })

   it('resolves nested flow fields and falls back to cars', () => {
      expect(
         resolveCreateFlowFromPayload({
            ads_parameter: { create_flow: CREATE_FLOW_PARTS_CAR_TIRES }
         })
      ).toBe(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(resolveCreateFlowFromPayload({})).toBe(CREATE_FLOW_CARS)
      expect(resolveCreateFlowFromPayload(null)).toBe(CREATE_FLOW_CARS)
      expect(resolveCreateFlowFromPayload({}, { fallbackFlow: null })).toBeNull()
      expect(resolveCreateFlowFromPayload({ disks_condition_id: 2 })).toBe(
         CREATE_FLOW_PARTS_CAR_DISKS
      )
      expect(
         resolveCreateFlowFromPayload({
            payload: {
               meta: {
                  fields: [{ full_wheels_disk_type_id: 2 }]
               }
            }
         })
      ).toBe(CREATE_FLOW_PARTS_FULL_WHEELS)
      expect(
         resolveCreateFlowFromPayload({ moto_motorcycle_brand_id: 10 })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(
         resolveCreateFlowFromPayload({ moto_scooter_brand_id: 11 })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)
      expect(
         resolveCreateFlowFromPayload(
            { main_category_id: 1 },
            { fallbackFlow: CREATE_FLOW_PARTS_CAR_TIRES }
         )
      ).toBe(CREATE_FLOW_CARS)
   })

   it('infers moto flow from non-prefixed moto payload shape', () => {
      expect(
         resolveCreateFlowFromPayload({
            sub_category_id: 1,
            type_id: 2,
            availability_id: 1,
            fuel_feed_id: 1,
            engine_capacity: 125
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)

      expect(
         resolveCreateFlowFromPayload({
            sub_category_id: 2,
            type_id: 3,
            availability_id: 1,
            fuel_feed_id: 1,
            engine_capacity: 50
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)

      expect(
         resolveCreateFlowFromPayload({
            sub_category: {
               id: 1,
               title: 'motorcycles'
            },
            fields_only_for_motorcycle: {
               drive_type: { id: 1, title: 'chain' }
            },
            production: {
               brand: { id: 17, title: 'American Eagle' },
               model: { id: 111, title: 'Raptor' }
            }
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)

      // drive_type alone is shared and should not force motorcycle flow
      expect(
         resolveCreateFlowFromPayload({
            type_id: 3,
            availability_id: 1,
            fuel_feed_id: 1,
            engine_capacity: 50,
            drive_type: { id: 1, title: 'chain' }
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)
   })
})
