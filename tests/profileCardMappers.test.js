import { describe, expect, it } from 'vitest'

import {
   mapFavoriteAdCardProps,
   mapFavoriteSearchCardProps,
   mapMyPublicationCardProps,
   normalizeProfileAdRecord
} from '../services/profile/profileCardMappers'

const nestedAdFixture = {
   id: 3939,
   user_id: 1337,
   ads_model: 'App\\Models\\Auto',
   ads_show: {
      id: 3939,
      user_id: 1337,
      url: 'https://aligo.ru/moskva/auto/type-used/brand-bmw/model-3-seriia/ads-2f1dd8f22f8d10b63a674bd6a1e97903/',
      is_published: 1,
      is_moderation: 0,
      is_cancelled: 0,
      is_closed: 0,
      is_in_archive: 0,
      is_not_confirmed_email: 0,
      is_in_favorites: 1,
      date_published_string: '3 месяца назад',
      created_at: '2025-11-22 00:19:53',
      ads_parameter: {
         ads_description: 'BMW 328i f30',
         place_inspection: 'Россия, Москва',
         amount: 1550000,
         username: 'Собственник'
      },
      auto_technical_specifications: [
         {
            brand: { title: 'BMW' },
            model: { title: '3 серия' },
            year_release: { title: '2012' }
         }
      ],
      statistic_view: {
         count_who_view_seller_contact: 4,
         count_add_to_favorite: 5,
         count_go_ad_page: 6
      },
      photos: [
         {
            arr_title_size: {
               preview: 'storage/images/preview.webp'
            }
         }
      ]
   }
}

describe('profileCardMappers', () => {
   it('normalizes nested ads_show payload', () => {
      const ad = normalizeProfileAdRecord(nestedAdFixture)

      expect(ad.id).toBe(3939)
      expect(ad.user_id).toBe(1337)
      expect(ad.ads_parameter.ads_description).toBe('BMW 328i f30')
      expect(ad.auto_technical_specifications[0].brand.title).toBe('BMW')
      expect(ad.photos).toHaveLength(1)
      expect(ad.url).toContain('/ads-2f1dd8f22f8d10b63a674bd6a1e97903/')
   })

   it('maps favorite ad props from nested payload', () => {
      const card = mapFavoriteAdCardProps(nestedAdFixture)

      expect(card).toMatchObject({
         id: 3939,
         idUserOwnerAds: 1337,
         description: 'BMW 328i f30',
         price: 1550000,
         place: 'Россия, Москва',
         brand: 'BMW',
         model: '3 серия',
         year: '2012',
         username: 'Собственник',
         isPublished: 1,
         isInFavorites: 1,
         datePublishedString: '3 месяца назад'
      })
      expect(card.images).toHaveLength(1)
      expect(card.url).toContain('/ads-2f1dd8f22f8d10b63a674bd6a1e97903/')
   })

   it('maps my-publications card props from nested payload', () => {
      const card = mapMyPublicationCardProps(nestedAdFixture)

      expect(card).toMatchObject({
         id: 3939,
         idUserOwnerAds: 1337,
         description: 'BMW 328i f30',
         price: 1550000,
         place: 'Россия, Москва',
         brand: 'BMW',
         model: '3 серия',
         year: '2012',
         isPublished: 1,
         isModeration: 0,
         isCancelled: 0,
         isClosed: 0,
         isInArchive: 0,
         isNotConfirmedEmail: 0,
         countGoAdPage: 6,
         countAddToFavorite: 5,
         countWhoViewSellerContact: 4
      })
      expect(card.images).toHaveLength(1)
      expect(card.url).toContain('/ads-2f1dd8f22f8d10b63a674bd6a1e97903/')
   })

   it('maps autogoods publication card props from entity payload', () => {
      const card = mapMyPublicationCardProps({
         id: 25,
         unique_code: 'c7d17739ea12aa9647c2cb88bc502b86',
         main_category_id: 3,
         sub_category: { id: 1, title: 'Шины, диски и колёса' },
         last_category: { id: 1, title: 'Легковые шины' },
         id_user_owner_ads: 106,
         entity: {
            brand: { id: 7, title: 'Achilles' },
            model: { id: 48, title: '2233' },
            year: { id: 4, title: 2005 }
         },
         ads_parameter: {
            ads_description: 'Легковая шина тест',
            amount: 4784,
            place_inspection: 'Россия, Москва'
         }
      })

      expect(card).toMatchObject({
         id: 25,
         uniqueCode: 'c7d17739ea12aa9647c2cb88bc502b86',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 1,
         lastCategoryId: 1,
         brand: 'Achilles',
         model: '2233',
         year: '2005',
         description: 'Легковая шина тест',
         price: 4784
      })
   })

   it('maps autogoods disks publication card props from entity payload', () => {
      const card = mapMyPublicationCardProps({
         id: 26,
         unique_code: '53c40db1d030698fdc61e0de4b9e44cd',
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 2, title: 'Disks' },
         id_user_owner_ads: 106,
         entity: {
            brand: { id: 4, title: '305 Forged' },
            model: { id: 22, title: 'FT114' }
         },
         ads_parameter: {
            ads_description: 'Disks test',
            amount: 3455,
            place_inspection: 'Moscow'
         }
      })

      expect(card).toMatchObject({
         id: 26,
         uniqueCode: '53c40db1d030698fdc61e0de4b9e44cd',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 1,
         lastCategoryId: 2,
         brand: '305 Forged',
         model: 'FT114',
         year: '',
         description: 'Disks test',
         price: 3455
      })
   })

   it('maps autogoods full wheels publication card props from entity payload', () => {
      const card = mapMyPublicationCardProps({
         id: 27,
         unique_code: 'c1010ed7829bae5e13ea96a20150849e',
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 3, title: 'Wheels' },
         id_user_owner_ads: 106,
         entity: {
            brand: { id: 6, title: 'Accelera' },
            model: { id: 12, title: '651 Sport' },
            year: { id: 4, title: 2005 }
         },
         ads_parameter: {
            ads_description: 'wheels form test',
            amount: 5737,
            place_inspection: 'Saint Petersburg'
         }
      })

      expect(card).toMatchObject({
         id: 27,
         uniqueCode: 'c1010ed7829bae5e13ea96a20150849e',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 1,
         lastCategoryId: 3,
         brand: 'Accelera',
         model: '651 Sport',
         year: '2005',
         description: 'wheels form test',
         price: 5737
      })
   })

   it('maps autogoods moto tires publication card props from entity payload', () => {
      const card = mapMyPublicationCardProps({
         id: 28,
         unique_code: 'ec81a608831c6bf601c443807dba5036',
         main_category_id: 3,
         sub_category: { id: 1, title: 'Tires and wheels' },
         last_category: { id: 5, title: 'Moto tires' },
         id_user_owner_ads: 106,
         entity: {
            brand: { id: 3, title: 'Arashi' }
         },
         ads_parameter: {
            ads_description: 'moto tires form test',
            amount: 14999,
            place_inspection: 'Moscow'
         }
      })

      expect(card).toMatchObject({
         id: 28,
         uniqueCode: 'ec81a608831c6bf601c443807dba5036',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 1,
         lastCategoryId: 5,
         brand: 'Arashi',
         model: '',
         year: '',
         description: 'moto tires form test',
         price: 14999
      })
   })

   it('maps autogoods motor oil publication card props from entity payload', () => {
      const card = mapMyPublicationCardProps({
         id: 29,
         unique_code: '8295d04da5e49926fa08dbe165c8604e',
         main_category_id: 3,
         sub_category: { id: 10, title: 'Oils and chemistry' },
         last_category: { id: 7, title: 'Motor oils' },
         id_user_owner_ads: 106,
         entity: {
            brand: { id: 7, title: 'Addinol' }
         },
         ads_parameter: {
            ads_description: 'motor oil form test',
            amount: 2999,
            place_inspection: 'Moscow'
         }
      })

      expect(card).toMatchObject({
         id: 29,
         uniqueCode: '8295d04da5e49926fa08dbe165c8604e',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 10,
         lastCategoryId: 7,
         brand: 'Addinol',
         model: '',
         year: '',
         description: 'motor oil form test',
         price: 2999
      })
   })

   it('maps moto publication card props from production payload', () => {
      const card = mapMyPublicationCardProps({
         id: 30,
         unique_code: 'moto-code-30',
         main_category_id: 2,
         sub_category: { id: 1, title: 'Motorcycles' },
         id_user_owner_ads: 106,
         production: {
            brand: { id: 17, title: 'American Eagle' },
            model: { id: 111, title: 'Raptor' }
         },
         year: { id: 133, title: '2022' },
         ads_parameter: {
            ads_description: 'moto test',
            amount: 777000,
            place_inspection: 'Moscow'
         }
      })

      expect(card).toMatchObject({
         id: 30,
         uniqueCode: 'moto-code-30',
         idUserOwnerAds: 106,
         mainCategoryId: 2,
         subCategoryId: 1,
         brand: 'American Eagle',
         model: 'Raptor',
         year: '2022',
         description: 'moto test',
         price: 777000
      })
   })

   it('maps moto publication card props from nested ads_show payload', () => {
      const card = mapMyPublicationCardProps({
         ads_model: 'App\\Models\\Moto',
         ads_show: {
            id: 997,
            unique_code: 'cdc7010be1c0ba2a1eb3eb463cb35752',
            main_category_id: 2,
            sub_category: { id: 1, title: 'Мотоциклы' },
            id_user_owner_ads: 106,
            production: {
               brand: { id: 4, title: 'AJP' },
               model: { id: 32, title: 'PR3 SUPERMOTO 240' }
            },
            year: { id: 8, title: '1897' },
            ads_parameter: {
               ads_description: 'Мотоцикл продается',
               amount: 235543,
               place_inspection: 'Россия, Москва'
            }
         }
      })

      expect(card).toMatchObject({
         id: 997,
         uniqueCode: 'cdc7010be1c0ba2a1eb3eb463cb35752',
         idUserOwnerAds: 106,
         mainCategoryId: 2,
         subCategoryId: 1,
         brand: 'AJP',
         model: 'PR3 SUPERMOTO 240',
         year: '1897',
         description: 'Мотоцикл продается',
         price: 235543
      })
   })

   it('maps favorite moto card props from production payload', () => {
      const card = mapFavoriteAdCardProps({
         id: 1004,
         unique_code: 'a6326a6fe74ea829ba763b49cb88ac95',
         main_category_id: 2,
         sub_category: { id: 1, title: 'Мотоциклы' },
         id_user_owner_ads: 106,
         user: { id: 106 },
         is_in_favorites: 1,
         production: {
            brand: { id: 10, title: 'Agiax' },
            model: { id: 86, title: '250' }
         },
         year: { id: 112, title: '2001' },
         ads_parameter: {
            ads_description: 'тест мотоцикл форма',
            amount: 544433,
            place_inspection: 'Россия, Москва',
            username: 'Артем'
         },
         photos: [{ id: 12540 }]
      })

      expect(card).toMatchObject({
         id: 1004,
         idUserOwnerAds: 106,
         mainCategoryId: 2,
         description: 'тест мотоцикл форма',
         price: 544433,
         place: 'Россия, Москва',
         brand: 'Agiax',
         model: '250',
         year: '2001',
         username: 'Артем',
         isInFavorites: 1
      })
      expect(card.images).toHaveLength(1)
   })

   it('maps favorite scooter card props from production payload', () => {
      const card = mapFavoriteAdCardProps({
         id: 1005,
         unique_code: '8648599f89a1098c2a477be3bf33b4d4',
         main_category_id: 2,
         sub_category: { id: 2, title: 'Мопеды и скутеры' },
         id_user_owner_ads: 106,
         user: { id: 106 },
         is_in_favorites: 0,
         production: {
            brand: { id: 9, title: 'Aima' },
            model: { id: 40, title: 'Mix D350' }
         },
         year: { id: 64, title: '1953' },
         ads_parameter: {
            ads_description: 'мопед тест',
            amount: 44555,
            place_inspection: 'Россия, Москва',
            username: 'Артем'
         },
         photos: [{ id: 12543 }]
      })

      expect(card).toMatchObject({
         id: 1005,
         idUserOwnerAds: 106,
         mainCategoryId: 2,
         description: 'мопед тест',
         price: 44555,
         place: 'Россия, Москва',
         brand: 'Aima',
         model: 'Mix D350',
         year: '1953',
         username: 'Артем',
         isInFavorites: 0
      })
      expect(card.images).toHaveLength(1)
   })

   it('normalizes delete_after_days to null when value is zero or negative', () => {
      const withZero = mapMyPublicationCardProps({
         ...nestedAdFixture,
         ads_show: {
            ...nestedAdFixture.ads_show,
            delete_after_days: 0
         }
      })

      const withPositive = mapMyPublicationCardProps({
         ...nestedAdFixture,
         ads_show: {
            ...nestedAdFixture.ads_show,
            delete_after_days: 3
         }
      })

      expect(withZero.deleteAfterDays).toBeNull()
      expect(withPositive.deleteAfterDays).toBe(3)
   })

   it('maps favorite search props with notify flags and main category id', () => {
      const searchCard = mapFavoriteSearchCardProps({
         id: 11,
         title: 'BMW X5',
         url: '/search?query=bmw',
         city: { title: 'Москва' },
         is_email: 1,
         is_telegram: 0,
         main_category_id: 12,
         created_at: '2026-03-10 12:00:00'
      })

      expect(searchCard).toMatchObject({
         id: 11,
         title: 'BMW X5',
         url: '/search?query=bmw',
         city: 'Москва',
         isEmail: 1,
         isTelegram: 0,
         mainCategoryId: 12,
         createdAt: '2026-03-10 12:00:00'
      })
   })
})
