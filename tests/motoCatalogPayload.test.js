import { describe, expect, it } from 'vitest'
import { normalizeMotoCatalogPayloadForApi } from '../composables/catalog/pages/motoCatalogPayload'

describe('motoCatalogPayload', () => {
   it('normalizes moto filter payload to backend contract', () => {
      const payload = normalizeMotoCatalogPayloadForApi({
         payload: {
            condition_id: '2',
            brand_id: ['1', '2'],
            model_id: ['3', '5'],
            type_id: ['7'],
            amount_from: '200',
            amount_to: '3000',
            mileage_from: '10',
            mileage_to: '500',
            year_from: '1950',
            year_to: '2019',
            power_range_from: '1',
            power_range_to: '50',
            engine_volume_from: '10',
            engine_volume_to: '100',
            search_title: 'AJ',
            availability_id: '1',
            all_ads: '1'
         },
         page: 2,
         count: 10,
         orderBy: 'asc',
         city: 'Рост',
         subCategoryId: 2
      })

      expect(payload).toEqual({
         page: 2,
         count: 10,
         order_by: 'asc',
         sub_category_id: 2,
         search_title: 'AJ',
         condition_id: [2],
         brand_id: [1, 2],
         model_id: [3, 5],
         type_id: [7],
         amount_from: 200,
         amount_to: 3000,
         mileage_from: 10,
         mileage_to: 500,
         year_from: 1950,
         year_to: 2019,
         power_range_from: 1,
         power_range_to: 50,
         engine_volume_from: 10,
         engine_volume_to: 100,
         availability_id: 1,
         all_ads: 1
      })
   })

   it('uses fallback subcategory and does not pass city', () => {
      const payload = normalizeMotoCatalogPayloadForApi({
         payload: {},
         city: 'Москва',
         subCategoryId: 1
      })

      expect(payload.sub_category_id).toBe(1)
      expect(payload).not.toHaveProperty('city')
      expect(payload.order_by).toBe('desc')
   })

   it('does not pass default city slug moskva', () => {
      const payload = normalizeMotoCatalogPayloadForApi({
         payload: {},
         city: 'moskva',
         subCategoryId: 1
      })

      expect(payload.sub_category_id).toBe(1)
      expect(payload).not.toHaveProperty('city')
   })
})
