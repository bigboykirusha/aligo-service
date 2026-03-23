import { describe, expect, test } from 'vitest'
import { createMotoFilterPresets } from '../composables/filters/domain/motoFiltersPresets'

const createFieldFactories = () => {
   const field = (type) => (key, label, extra = {}) => ({
      type,
      key,
      label,
      ...extra
   })

   return {
      inputField: field('input'),
      rangeField: field('range'),
      selectField: field('select'),
      tabsField: field('tabs'),
      searchableListField: field('searchableCheckboxList'),
      checkboxListField: field('checkboxList')
   }
}

describe('motoFiltersPresets', () => {
   test('builds motorcycle preset with backend power range keys', () => {
      const presets = createMotoFilterPresets(createFieldFactories())
      const fields = presets['moto.motorcycles']()

      const powerHpField = fields.find((item) => item.key === 'powerHp')

      expect(powerHpField).toBeTruthy()
      expect(powerHpField.label).toBe('Мощность, л.с.')
      expect(powerHpField.payloadKeys).toEqual([
         'power_range_from',
         'power_range_to'
      ])
      expect(powerHpField.queryKeys).toEqual([
         'power_range_from',
         'power_range_to'
      ])
   })

   test('keeps button selector only for condition in moto presets', () => {
      const presets = createMotoFilterPresets(createFieldFactories())
      const motorcyclesFields = presets['moto.motorcycles']()
      const scootersFields = presets['moto.scooters']()

      const motorcyclesTabs = motorcyclesFields
         .filter((field) => field.type === 'tabs')
         .map((field) => field.key)
      const scootersTabs = scootersFields
         .filter((field) => field.type === 'tabs')
         .map((field) => field.key)

      expect(motorcyclesTabs).toEqual(['condition'])
      expect(scootersTabs).toEqual(['condition'])
   })

   test('uses checkbox/select controls matching moto backend filters', () => {
      const presets = createMotoFilterPresets(createFieldFactories())
      const motorcycleFields = presets['moto.motorcycles']()
      const scooterFields = presets['moto.scooters']()

      const motorcycleType = motorcycleFields.find(
         (field) => field.key === 'motoType'
      )
      const motorcycleBrand = motorcycleFields.find(
         (field) => field.key === 'motoBrand'
      )
      const motorcyclePts = motorcycleFields.find((field) => field.key === 'pts')
      const scooterType = scooterFields.find((field) => field.key === 'motoType')

      expect(motorcycleType?.type).toBe('checkboxList')
      expect(motorcycleBrand?.type).toBe('searchableCheckboxList')
      expect(motorcyclePts?.type).toBe('select')
      expect(scooterType?.type).toBe('checkboxList')
   })
})
