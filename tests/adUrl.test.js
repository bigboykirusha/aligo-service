import { describe, expect, it } from 'vitest'

import { buildAdPath, normalizeAdUrl } from '../services/ads/adUrl'

describe('adUrl', () => {
   it('builds moto url when backend url is missing', () => {
      expect(
         buildAdPath({
            id: 1004,
            unique_code: 'a6326a6fe74ea829ba763b49cb88ac95',
            main_category_id: 2,
            sub_category: { id: 1, title: 'Мотоциклы' },
            production: {
               brand: { title: 'Agiax' },
               model: { title: '250' }
            },
            ads_parameter: {
               city: { title: 'Москва' }
            }
         })
      ).toBe('/moskva/moto/motorcycles/brand-agiax/model-250/ads-a6326a6fe74ea829ba763b49cb88ac95')
   })

   it('builds autogoods url when backend url is missing', () => {
      expect(
         buildAdPath({
            id: 25,
            unique_code: '8c2cb43ef364754aaa1a576fb6b42d0b',
            main_category_id: 3,
            sub_category: { title: 'Шины, диски и колёса' },
            last_category: { title: 'Легковые шины' },
            entity: {
               brand: { title: 'Achilles' },
               model: { title: '2233' }
            },
            ads_parameter: {
               city: { title: 'Москва' }
            }
         })
      ).toBe('/moskva/parts/tires-disks-wheels/passenger-tires/brand-achilles/model-2233/ads-8c2cb43ef364754aaa1a576fb6b42d0b')
   })

   it('keeps provided url and strips host', () => {
      expect(
         normalizeAdUrl(
            'https://aligo.ru/moskva/parts/ads-8c2cb43ef364754aaa1a576fb6b42d0b/',
            { id: 25, main_category_id: 3 }
         )
      ).toBe('/moskva/parts/ads-8c2cb43ef364754aaa1a576fb6b42d0b/')
   })

   it('builds disk url with nested disk subtype when available', () => {
      expect(
         buildAdPath({
            unique_code: '53c40db1d030698fdc61e0de4b9e44cd',
            main_category_id: 3,
            sub_category: { title: 'Шины, диски и колёса' },
            last_category: { title: 'Диски' },
            entity: {
               brand: { title: '305 Forged' },
               model: { title: 'FT114' },
               type_disk: { title: 'Штампованные' }
            },
            ads_parameter: {
               city: { title: 'Москва' }
            }
         })
      ).toBe('/moskva/parts/tires-disks-wheels/disks/stamped/brand-305-forged/model-ft114/ads-53c40db1d030698fdc61e0de4b9e44cd')
   })

   it('builds motor oil url from oils category', () => {
      expect(
         buildAdPath({
            unique_code: '8295d04da5e49926fa08dbe165c8604e',
            main_category_id: 3,
            sub_category: { title: 'Масла и автохимия' },
            last_category: { title: 'Моторные масла' },
            entity: {
               brand: { title: 'Addinol' }
            },
            ads_parameter: {
               city: { title: 'Москва' }
            }
         })
      ).toBe('/moskva/parts/oils-and-chemistry/motor-oils/brand-addinol/ads-8295d04da5e49926fa08dbe165c8604e')
   })

   it('builds wheels url with category branch when backend url is missing', () => {
      expect(
         buildAdPath({
            unique_code: 'c1010ed7829bae5e13ea96a20150849e',
            main_category_id: 3,
            sub_category: { id: 1, title: 'РЁРёРЅС‹, РґРёСЃРєРё Рё РєРѕР»С‘СЃР°' },
            last_category: { id: 3, title: 'РљРѕР»С‘СЃР°' },
            entity: {
               brand: { title: 'Accelera' },
               model: { title: '651 Sport' }
            },
            ads_parameter: {
               city: { translit: 'sankt-peterburg' }
            }
         })
      ).toBe('/sankt-peterburg/parts/tires-disks-wheels/wheels/brand-accelera/model-651-sport/ads-c1010ed7829bae5e13ea96a20150849e')
   })
})
