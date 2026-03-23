import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS
} from '../store/createStore/flows'
import {
   mapCreateMotoFieldKeyToApiKey,
   remapMotoCreateFormDataForApi
} from '../store/createStore/motoPayload'

describe('create moto payload mapper', () => {
   it('maps prefixed motorcycle fields to /motos contract keys', () => {
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_motorcycle_year',
            flow: CREATE_FLOW_MOTO_MOTORCYCLES
         })
      ).toBe('year_id')
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_motorcycle_power_hp',
            flow: CREATE_FLOW_MOTO_MOTORCYCLES
         })
      ).toBe('power_range')
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_motorcycle_is_start_stop',
            flow: CREATE_FLOW_MOTO_MOTORCYCLES
         })
      ).toBe('is_start_stop_system')
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_motorcycle_is_windshield',
            flow: CREATE_FLOW_MOTO_MOTORCYCLES
         })
      ).toBe('is_windscreen')
   })

   it('maps prefixed scooter fields and keeps shared keys', () => {
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_scooter_brand_id',
            flow: CREATE_FLOW_MOTO_SCOOTERS
         })
      ).toBe('brand_id')
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'moto_scooter_number_of_gears_id',
            flow: CREATE_FLOW_MOTO_SCOOTERS
         })
      ).toBe('number_gear_id')
      expect(
         mapCreateMotoFieldKeyToApiKey({
            field: 'is_draft',
            flow: CREATE_FLOW_MOTO_SCOOTERS
         })
      ).toBe('is_draft')
   })

   it('remaps FormData only for moto flows', () => {
      const motoFormData = new FormData()
      motoFormData.append('moto_motorcycle_brand_id', '21')
      motoFormData.append('moto_motorcycle_year', '133')
      motoFormData.append('is_draft', '1')

      const mappedMoto = remapMotoCreateFormDataForApi({
         formData: motoFormData,
         flow: CREATE_FLOW_MOTO_MOTORCYCLES
      })
      const entries = Array.from(mappedMoto.entries())
      expect(entries).toEqual([
         ['brand_id', '21'],
         ['year_id', '133'],
         ['is_draft', '1']
      ])

      const carsFormData = new FormData()
      carsFormData.append('brand_id', '10')

      const mappedCars = remapMotoCreateFormDataForApi({
         formData: carsFormData,
         flow: CREATE_FLOW_CARS
      })
      expect(mappedCars).toBe(carsFormData)
   })
})
