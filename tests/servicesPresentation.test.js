import { describe, expect, it } from 'vitest'

import {
   mapPaidServiceItem,
   mapPaidServiceItems,
   mapProfileServiceAdOption,
   mapProfileServiceAdOptions
} from '../services/profile/servicesPresentation'

describe('servicesPresentation', () => {
   it('maps auto ad option for paid services selection', () => {
      expect(
         mapProfileServiceAdOption({
            id: 11,
            main_category_id: 1,
            ads_parameter: { amount: 1550000 },
            auto_technical_specifications: [
               {
                  brand: { title: 'BMW' },
                  model: { title: '3 серия' },
                  year_release: { title: '2012' }
               }
            ],
            photos: [
               {
                  arr_title_size: {
                     preview: 'storage/images/bmw-preview.webp'
                  }
               }
            ]
         })
      ).toEqual({
         id: 11,
         mainCategoryId: 1,
         image: 'storage/images/bmw-preview.webp',
         title: 'BMW 3 серия, 2012',
         price: '1 550 000'
      })
   })

   it('maps moto and autogoods ads without losing title', () => {
      expect(
         mapProfileServiceAdOptions([
            {
               id: 12,
               main_category_id: 2,
               production: {
                  brand: { title: 'AJP' },
                  model: { title: 'PR3 SUPERMOTO 240' }
               },
               year: { title: '1897' },
               ads_parameter: { amount: 235543 }
            },
            {
               id: 13,
               main_category_id: 3,
               entity: {
                  brand: { title: 'Addinol' }
               },
               ads_parameter: { amount: 2999 }
            }
         ])
      ).toEqual([
         {
            id: 12,
            mainCategoryId: 2,
            image: '',
            title: 'AJP PR3 SUPERMOTO 240, 1897',
            price: '235 543'
         },
         {
            id: 13,
            mainCategoryId: 3,
            image: '',
            title: 'Addinol',
            price: '2 999'
         }
      ])
   })

   it('normalizes paid promotion services from backend payload', () => {
      expect(
         mapPaidServiceItem({
            id: 2,
            title: 'Закрепление в разделе',
            subtitle: 'Первое место',
            description: '  Показ выше других   объявлений ',
            period: 30,
            date_from: '20.03.2026',
            date_before: '19.04.2026',
            cost: 50000,
            is_first_place: 1,
            is_promotion: 1
         })
      ).toMatchObject({
         id: 2,
         category: 'promotion',
         title: 'Закрепление в разделе',
         subtitle: 'Первое место',
         description: 'Показ выше других объявлений',
         cost: 50000,
         priceLabel: '50 000',
         period: 30,
         periodLabel: '30 дней',
         dateRangeLabel: '20.03.2026 — 19.04.2026',
         flags: {
            isFirstPlace: true,
            isPromotion: true
         }
      })
   })

   it('keeps decoration choice options from backend arrays', () => {
      expect(
         mapPaidServiceItem({
            id: 29,
            title: 'Цветные рамки',
            cost: 3000,
            is_frame_color: 1,
            is_decoration: 1,
            color: ['Синий', 'Оранжевый'],
            color_code: [
               { from: '#2462FF', to: '#6A94FF' },
               { from: '#FF8C1A', to: '#FFD166' }
            ]
         })
      ).toMatchObject({
         id: 29,
         category: 'decor',
         subtitle: 'Рамка',
         hasChoices: true,
         colorValues: ['Синий', 'Оранжевый'],
         colorOptions: [
            {
               label: 'Синий',
               value: 'Синий',
               preview: 'linear-gradient(135deg, #2462FF 0%, #6A94FF 100%)'
            },
            {
               label: 'Оранжевый',
               value: 'Оранжевый',
               preview: 'linear-gradient(135deg, #FF8C1A 0%, #FFD166 100%)'
            }
         ]
      })
   })

   it('filters normalized paid services by category', () => {
      expect(
         mapPaidServiceItems(
            [
               {
                  id: 5,
                  title: 'Поднятие объявления',
                  is_up: 1,
                  is_promotion: 1,
                  cost: 70
               },
               {
                  id: 6,
                  title: 'VIP карточка',
                  is_vip: 1,
                  is_decoration: 1,
                  cost: 800
               }
            ],
            { category: 'decor' }
         )
      ).toEqual([
         expect.objectContaining({
            id: 6,
            category: 'decor',
            subtitle: 'VIP'
         })
      ])
   })

   it('groups similar decoration badges into compact cards', () => {
      expect(
         mapPaidServiceItems(
            [
               {
                  id: 7,
                  title: 'Обычные бейджи',
                  subtitle: 'Без ДТП',
                  description: 'Описание',
                  period: 7,
                  cost: 50,
                  is_badge: 1,
                  is_decoration: 1
               },
               {
                  id: 8,
                  title: 'Обычные бейджи',
                  subtitle: '1 хозяин',
                  description: 'Описание',
                  period: 7,
                  cost: 50,
                  is_badge: 1,
                  is_decoration: 1
               },
               {
                  id: 18,
                  title: 'Цветные бейджи',
                  subtitle: 'Без ДТП',
                  description: 'Описание',
                  period: 7,
                  cost: 100,
                  color: ['green', 'yellow'],
                  color_code: ['#AFF1CA', '#FFEEAC'],
                  is_badge: 1,
                  is_decoration: 1
               },
               {
                  id: 19,
                  title: 'Цветные бейджи',
                  subtitle: '1 хозяин',
                  description: 'Описание',
                  period: 7,
                  cost: 100,
                  color: ['green', 'yellow'],
                  color_code: ['#AFF1CA', '#FFEEAC'],
                  is_badge: 1,
                  is_decoration: 1
               }
            ],
            { category: 'decor' }
         )
      ).toEqual([
         expect.objectContaining({
            id: 7,
            title: 'Обычные бейджи',
            subtitle: '',
            choiceLabel: 'Вид бейджа',
            choiceOptions: [
               expect.objectContaining({
                  label: 'Без ДТП',
                  paidServiceId: 7
               }),
               expect.objectContaining({
                  label: '1 хозяин',
                  paidServiceId: 8
               })
            ],
            colorOptions: []
         }),
         expect.objectContaining({
            id: 18,
            title: 'Цветные бейджи',
            subtitle: '',
            choiceLabel: 'Вид бейджа',
            colorChoiceLabel: 'Цвет',
            choiceOptions: [
               expect.objectContaining({
                  label: 'Без ДТП',
                  paidServiceId: 18
               }),
               expect.objectContaining({
                  label: '1 хозяин',
                  paidServiceId: 19
               })
            ],
            colorOptions: [
               expect.objectContaining({
                  label: 'Зелёный',
                  value: 'green'
               }),
               expect.objectContaining({
                  label: 'Жёлтый',
                  value: 'yellow'
               })
            ]
         })
      ])
   })
})
