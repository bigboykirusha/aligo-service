import { describe, expect, it } from 'vitest'

import {
   buildAdDisplayTitle,
   getAdCharacteristics
} from '../services/ads/adDetailsViewModel'

describe('adDetailsViewModel', () => {
   it('builds autogoods title with numeric year', () => {
      expect(
         buildAdDisplayTitle({
            main_category_id: 3,
            entity: {
               brand: { title: 'Achilles' },
               model: { title: '2233' },
               year: { title: 2005 }
            }
         })
      ).toBe('Achilles 2233, 2005')
   })

   it('omits empty model and year from title', () => {
      expect(
         buildAdDisplayTitle({
            main_category_id: 3,
            entity: {
               brand: { title: 'Addinol' },
               model: null,
               year: null
            }
         })
      ).toBe('Addinol')
   })

   it('includes entity fields and condition details for autogoods characteristics', () => {
      const items = getAdCharacteristics({
         main_category_id: 3,
         last_category: { title: 'Диски' },
         entity: {
            condition: { title: 'Б/у' },
            brand: { title: '305 Forged' },
            model: { title: 'FT114' },
            type_disk: { title: 'Штампованные' },
            rim_width: { title: '3' },
            condition_detail: [
               {
                  key_string: 'Тип покраски:',
                  title_string: 'Заводской'
               }
            ]
         }
      })

      expect(items).toEqual(
         expect.arrayContaining([
            { label: 'Бренд', value: '305 Forged' },
            { label: 'Модель', value: 'FT114' },
            { label: 'Категория', value: 'Диски' },
            { label: 'Тип диска', value: 'Штампованные' },
            { label: 'Ширина обода', value: '3' },
            { label: 'Тип покраски', value: 'Заводской' }
         ])
      )
   })

   it('maps tire and oil fields to russian labels', () => {
      const items = getAdCharacteristics({
         main_category_id: 3,
         entity: {
            brand: { title: 'Achilles' },
            season: { title: 'Всесезонные' },
            run_flat: { title: 'Нет' },
            load_index: { title: '21' },
            viscosity_sae: { title: '0W-12' },
            allow_oem: { title: 'BMW High Performance Diesel Oil' }
         }
      })

      expect(items).toEqual(
         expect.arrayContaining([
            { label: 'Сезонность', value: 'Всесезонные' },
            { label: 'Run Flat', value: 'Нет' },
            { label: 'Индекс нагрузки', value: '21' },
            { label: 'Класс вязкости SAE', value: '0W-12' },
            { label: 'Допуски OEM', value: 'BMW High Performance Diesel Oil' }
         ])
      )
   })
})
