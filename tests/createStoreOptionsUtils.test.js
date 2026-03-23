import { describe, expect, it } from 'vitest'
import { buildDescendingYearOptions, normalizeCreateOptions } from '../store/createStore/optionsUtils'

describe('createStore optionsUtils', () => {
   it('normalizes array options with custom id/title keys', () => {
      const result = normalizeCreateOptions(
         [
            { brand_id: 10, brand: 'Nokian' },
            { brand_id: 11, brand: 'Michelin' }
         ],
         {
            idKeys: ['id', 'brand_id'],
            titleKeys: ['title', 'brand']
         }
      )

      expect(result).toEqual([
         { id: 10, title: 'Nokian' },
         { id: 11, title: 'Michelin' }
      ])
   })

   it('normalizes options from api payload data array', () => {
      const result = normalizeCreateOptions(
         {
            success: true,
            data: [
               { id: 1, title: 'A' },
               { id: 2, title: 'B' }
            ]
         },
         {
            idKeys: ['id'],
            titleKeys: ['title']
         }
      )

      expect(result).toEqual([
         { id: 1, title: 'A' },
         { id: 2, title: 'B' }
      ])
   })

   it('normalizes options from api payload data object map', () => {
      const result = normalizeCreateOptions(
         {
            success: true,
            data: {
               15: 'Nokian',
               16: 'Pirelli'
            }
         },
         {
            idKeys: ['id'],
            titleKeys: ['title']
         }
      )

      expect(result).toEqual([
         { id: '15', title: 'Nokian' },
         { id: '16', title: 'Pirelli' }
      ])
   })

   it('extracts nested id/title values from option object fields', () => {
      const result = normalizeCreateOptions(
         [
            {
               tires_brand: { id: 44, title: 'Cordiant' }
            }
         ],
         {
            idKeys: ['tires_brand'],
            titleKeys: ['tires_brand']
         }
      )

      expect(result).toEqual([{ id: 44, title: 'Cordiant' }])
   })

   it('builds descending year options in requested range', () => {
      const result = buildDescendingYearOptions({ minYear: 2023, maxYear: 2025 })

      expect(result).toEqual([
         { id: 2025, title: '2025' },
         { id: 2024, title: '2024' },
         { id: 2023, title: '2023' }
      ])
   })
})
