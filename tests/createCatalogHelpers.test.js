import { describe, expect, it } from 'vitest'
import {
   CREATE_AD_EDIT_PATH,
   buildCreateDraftRouteLocation,
   buildCreateEditRouteDto,
   buildCreateEditRouteLocation,
   buildCreateEditRouteQueryFromDto,
   buildCreateEditRouteQuery,
   buildCreateDraftRouteQuery,
   getCreateDraftCategoryLabel,
   getCreateDraftDescription,
   getCreateDraftImagePath,
   getCreateDraftTitle,
   mapCreateDraftsResponse
} from '../store/createStore/createCatalogHelpers'

describe('create catalog helpers', () => {
   it('normalizes drafts response from nested ads_show payload', () => {
      const response = [
         { ads_model: 'App\\Models\\Moto', ads_show: { id: 1 } },
         { id: 2 },
         null,
         { ads_model: 'App\\Models\\Auto', ads_show: {} },
         {}
      ]
      expect(mapCreateDraftsResponse(response)).toEqual([
         { id: 1, ads_model: 'App\\Models\\Moto' },
         { id: 2, ads_model: null }
      ])
      expect(mapCreateDraftsResponse(null)).toEqual([])
   })

   it('builds draft title, description and image fallback values', () => {
      const draft = {
         auto_technical_specifications: [
            {
               brand: { title: 'Audi' },
               model: { title: '90' },
               year_release: { title: '2022' }
            }
         ],
         ads_parameter: {
            ads_description: 'Desc'
         },
         photos: [{ arr_title_size: { middle: 'storage/middle.webp' } }]
      }

      expect(getCreateDraftTitle(draft)).toBe('Audi, 90, 2022')
      expect(
         getCreateDraftTitle({
            production: {
               brand: { title: 'American Eagle' },
               model: { title: 'Raptor' }
            },
            year: { title: '2020' }
         })
      ).toBe('American Eagle, Raptor, 2020')
      expect(getCreateDraftDescription(draft)).toBe('Desc')
      expect(getCreateDraftImagePath(draft)).toBe('storage/middle.webp')
      expect(getCreateDraftTitle({})).toBe('Без названия')
      expect(getCreateDraftDescription({})).toBe('Без описания')
      expect(getCreateDraftImagePath({})).toBeNull()
      expect(
         getCreateDraftTitle({
            entity: {
               brand: { title: 'Addinol' },
               model: { title: 'Ultra' },
               year: { title: '2024' }
            }
         })
      ).toBe('Addinol, Ultra, 2024')
      expect(
         getCreateDraftImagePath({
            photos: [{ arr_title_size: { preview: 'storage/preview.webp' } }]
         })
      ).toBe('storage/preview.webp')
      expect(
         getCreateDraftCategoryLabel({
            main_category: { title: 'Автомобили' },
            sub_category: { title: 'Мотоциклы' },
            last_category: { title: 'Колёса' }
         })
      ).toBe('Колёса')
      expect(
         getCreateDraftCategoryLabel({
            main_category: { title: 'Автомобили' },
            sub_category: { title: 'Мотоциклы' }
         })
      ).toBe('Мотоциклы')
      expect(
         getCreateDraftCategoryLabel({
            main_category: { title: 'Автомобили' }
         })
      ).toBe('Автомобили')
      expect(getCreateDraftCategoryLabel({})).toBe('')
   })

   it('builds route query for editing without forcing flow', () => {
      expect(
         buildCreateEditRouteQuery({
            ad: {
               id: 77,
               id_user_owner_ads: 5,
               main_category_id: 2,
               sub_category: { id: 1, title: 'Мотоциклы' },
               ads_model: 'App\\Models\\Moto'
            },
            userId: 9
         })
      ).toEqual({
         id: 77,
         id_user_owner_ads: 5,
         main_category_id: 2,
         sub_category_id: 1
      })

      expect(
         buildCreateDraftRouteQuery({
            draft: {
               id: 10,
               id_user_owner_ads: 5,
               disks_condition_id: 2
            },
            userId: 9
         })
      ).toEqual({
         id: 10,
         id_user_owner_ads: 5
      })

      expect(
         buildCreateDraftRouteQuery({
            draft: {
               id: 10
            },
            userId: 9
         })
      ).toEqual({
         id: 10,
         id_user_owner_ads: 9
      })

      expect(
         buildCreateDraftRouteQuery({
            draft: {
               id: 11,
               id_user_owner_ads: 9,
               type_id: 2,
               availability_id: 1,
               fuel_feed_id: 1,
               engine_capacity: 650,
               cylinder_id: 2
            },
            userId: 9
         })
      ).toEqual({
         id: 11,
         id_user_owner_ads: 9
      })

      expect(
         buildCreateDraftRouteQuery({
            draft: {},
            userId: 9
         })
      ).toBeNull()

      expect(
         buildCreateDraftRouteLocation({
            draft: {
               id: 11,
               id_user_owner_ads: 9,
               main_category_id: 2,
               sub_category_id: 1
            },
            userId: 9
         })
      ).toEqual({
         path: CREATE_AD_EDIT_PATH,
         query: {
            id: 11,
            id_user_owner_ads: 9,
            main_category_id: 2,
            sub_category_id: 1
         }
      })
   })

   it('builds edit route DTO and query from mixed payload shape', () => {
      const dto = buildCreateEditRouteDto({
         source: {
            id: 88,
            id_user_owner_ads: 106,
            main_category: { id: 2 },
            sub_category: { id: 1 }
         }
      })

      expect(dto).toEqual({
         id: 88,
         idUserOwnerAds: 106,
         mainCategoryId: 2,
         subCategoryId: 1,
         lastCategoryId: null
      })

      expect(buildCreateEditRouteQueryFromDto(dto)).toEqual({
         id: 88,
         id_user_owner_ads: 106,
         main_category_id: 2,
         sub_category_id: 1
      })

      expect(buildCreateEditRouteDto({ source: {} })).toBeNull()
      expect(buildCreateEditRouteQueryFromDto(null)).toBeNull()

      expect(
         buildCreateEditRouteDto({
            source: {
               id: 0,
               unique_code: 'c7d17739ea12aa9647c2cb88bc502b86',
               id_user_owner_ads: 106,
               main_category_id: 3,
               sub_category_id: 1,
               last_category_id: 1
            }
         })
      ).toEqual({
         id: 'c7d17739ea12aa9647c2cb88bc502b86',
         idUserOwnerAds: 106,
         mainCategoryId: 3,
         subCategoryId: 1,
         lastCategoryId: 1
      })

      expect(
         buildCreateEditRouteLocation({
            source: {
               id: 88,
               id_user_owner_ads: 106,
               main_category_id: 2,
               sub_category_id: 1
            }
         })
      ).toEqual({
         path: CREATE_AD_EDIT_PATH,
         query: {
            id: 88,
            id_user_owner_ads: 106,
            main_category_id: 2,
            sub_category_id: 1
         }
      })
   })
})
