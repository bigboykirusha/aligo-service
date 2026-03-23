import { describe, expect, it } from 'vitest'

import { mapAdToCardProps } from '../composables/useCardPropsMapper'

describe('useCardPropsMapper', () => {
   it('maps nested ads_show payload for generic cards', () => {
      const props = mapAdToCardProps({
         id: 1,
         ads_show: {
            id: 2,
            user_id: 7,
            url: 'https://aligo.ru/test/ads-abc/',
            date_published_string: '2 дня назад',
            ads_parameter: {
               ads_description: 'Test ad',
               amount: 1000,
               place_inspection: 'Moscow',
               username: 'Owner'
            },
            auto_technical_specifications: [
               {
                  brand: { title: 'BMW' },
                  model: { title: '3 series' },
                  year_release: { title: '2012' }
               }
            ],
            photos: [{ id: 1 }]
         }
      })

      expect(props).toMatchObject({
         id: 2,
         description: 'Test ad',
         price: 1000,
         place: 'Moscow',
         brand: 'BMW',
         model: '3 series',
         year: '2012',
         displayTitle: 'BMW 3 series, 2012',
         username: 'Owner',
         userId: 7,
         datePublishedString: '2 дня назад',
         url: '/test/ads-abc/'
      })
      expect(props.images).toHaveLength(1)
   })

   it('maps autogoods entity payload for generic cards', () => {
      const props = mapAdToCardProps({
         id: 25,
         main_category_id: 3,
         id_user_owner_ads: 106,
         url: 'https://aligo.ru/moskva/parts/tires-disks-wheels/passenger-tires/ads-test/',
         ads_parameter: {
            ads_description: 'Легковая шина тест',
            amount: 4784,
            place_inspection: 'Россия, Москва',
            username: 'Собственник'
         },
         entity: {
            brand: { id: 7, title: 'Achilles' },
            model: { id: 48, title: '2233' },
            year: { id: 4, title: 2005 }
         },
         photos: [{ id: 1 }]
      })

      expect(props).toMatchObject({
         id: 25,
         description: 'Легковая шина тест',
         price: 4784,
         place: 'Россия, Москва',
         brand: 'Achilles',
         model: '2233',
         year: '2005',
         displayTitle: 'Achilles 2233, 2005',
         username: 'Собственник',
         userId: 106,
         mainCategoryId: 3,
         url: '/moskva/parts/tires-disks-wheels/passenger-tires/ads-test/'
      })
      expect(props.images).toHaveLength(1)
   })
   it('builds autogoods moto tire title without placeholder model and year', () => {
      const props = mapAdToCardProps({
         id: 28,
         main_category_id: 3,
         ads_parameter: {
            ads_description: 'Moto tires',
            amount: 14999,
            place_inspection: 'Moscow',
            username: 'Owner'
         },
         entity: {
            brand: { id: 3, title: 'Arashi' }
         }
      })

      expect(props).toMatchObject({
         brand: 'Arashi',
         model: '',
         year: '',
         displayTitle: 'Arashi'
      })
   })

   it('builds autogoods disk title without placeholder year', () => {
      const props = mapAdToCardProps({
         id: 26,
         main_category_id: 3,
         ads_parameter: {
            ads_description: 'Disks test',
            amount: 3455,
            place_inspection: 'Moscow'
         },
         entity: {
            brand: { id: 4, title: '305 Forged' },
            model: { id: 22, title: 'FT114' }
         }
      })

      expect(props).toMatchObject({
         brand: '305 Forged',
         model: 'FT114',
         year: '',
         displayTitle: '305 Forged FT114'
      })
   })

   it('builds autogoods motor oil title from brand only', () => {
      const props = mapAdToCardProps({
         id: 29,
         main_category_id: 3,
         ads_parameter: {
            ads_description: 'Motor oil',
            amount: 2999,
            place_inspection: 'Moscow'
         },
         entity: {
            brand: { id: 7, title: 'Addinol' }
         }
      })

      expect(props).toMatchObject({
         brand: 'Addinol',
         model: '',
         year: '',
         displayTitle: 'Addinol'
      })
   })

   it('maps moto production payload for generic cards', () => {
      const props = mapAdToCardProps({
         id: 1004,
         main_category_id: 2,
         id_user_owner_ads: 106,
         ads_parameter: {
            ads_description: 'тест мотоцикл форма',
            amount: 544433,
            place_inspection: 'Россия, Москва',
            username: 'Артем'
         },
         production: {
            brand: { id: 10, title: 'Agiax' },
            model: { id: 86, title: '250' }
         },
         year: { id: 112, title: '2001' },
         photos: [{ id: 12540 }]
      })

      expect(props).toMatchObject({
         id: 1004,
         description: 'тест мотоцикл форма',
         price: 544433,
         place: 'Россия, Москва',
         brand: 'Agiax',
         model: '250',
         year: '2001',
         displayTitle: 'Agiax 250, 2001',
         username: 'Артем',
         userId: 106,
         mainCategoryId: 2
      })
      expect(props.images).toHaveLength(1)
   })

   it('maps scooter production payload for generic cards', () => {
      const props = mapAdToCardProps({
         id: 1005,
         main_category_id: 2,
         user: { id: 106 },
         ads_parameter: {
            ads_description: 'мопед тест',
            amount: 44555,
            place_inspection: 'Россия, Москва',
            username: 'Артем'
         },
         production: {
            brand: { id: 9, title: 'Aima' },
            model: { id: 40, title: 'Mix D350' }
         },
         year: { id: 64, title: '1953' },
         photos: [{ id: 12543 }]
      })

      expect(props).toMatchObject({
         id: 1005,
         description: 'мопед тест',
         price: 44555,
         place: 'Россия, Москва',
         brand: 'Aima',
         model: 'Mix D350',
         year: '1953',
         displayTitle: 'Aima Mix D350, 1953',
         username: 'Артем',
         userId: 106,
         mainCategoryId: 2
      })
      expect(props.images).toHaveLength(1)
   })

   it('maps owner id from nested ads_show id_user_owner_ads', () => {
      const props = mapAdToCardProps({
         ads_show: {
            id: 31,
            main_category_id: 3,
            id_user_owner_ads: 77,
            ads_parameter: {
               ads_description: 'test',
               amount: 1,
               place_inspection: 'Moscow'
            },
            entity: {
               brand: { title: 'Brand' }
            }
         }
      })

      expect(props.userId).toBe(77)
   })

   it('builds autogoods url when backend url is empty', () => {
      const props = mapAdToCardProps({
         id: 25,
         unique_code: '8c2cb43ef364754aaa1a576fb6b42d0b',
         main_category_id: 3,
         ads_parameter: {
            city: { title: 'Москва' },
            ads_description: 'test'
         },
         entity: {
            brand: { title: 'Achilles' }
         }
      })

      expect(props.url).toBe('/moskva/parts/brand-achilles/ads-8c2cb43ef364754aaa1a576fb6b42d0b')
   })

   it('builds autogoods title with numeric year from entity payload', () => {
      const props = mapAdToCardProps({
         id: 25,
         main_category_id: 3,
         ads_parameter: {
            ads_description: 'test',
            amount: 4784,
            place_inspection: 'Россия, Москва'
         },
         entity: {
            brand: { title: 'Achilles' },
            model: { title: '2233' },
            year: { title: 2005 }
         }
      })

      expect(props.displayTitle).toBe('Achilles 2233, 2005')
   })
})
