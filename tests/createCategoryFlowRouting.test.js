import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from '../store/createStore/flows'
import {
   buildCarsCreateRouteQuery,
   buildCreateRouteQueryForFlow,
   isCarsConditionCatalogItem,
   resolveCreateFlowFromCatalogItem,
   resolveCreateFlowFromCategoryContext
} from '../store/createStore/createCategoryFlowRouting'

describe('create category flow routing', () => {
   it('resolves flow from catalog item slug', () => {
      expect(resolveCreateFlowFromCatalogItem({ slug: 'car-tires' })).toBe(
         CREATE_FLOW_PARTS_CAR_TIRES
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'rims' })).toBe(
         CREATE_FLOW_PARTS_CAR_DISKS
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'moto-tires' })).toBe(
         CREATE_FLOW_PARTS_MOTO_TIRES
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'full-wheels' })).toBe(
         CREATE_FLOW_PARTS_FULL_WHEELS
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'motor-oil' })).toBe(
         CREATE_FLOW_PARTS_MOTOR_OIL
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'motorcycles' })).toBe(
         CREATE_FLOW_MOTO_MOTORCYCLES
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'scooters' })).toBe(
         CREATE_FLOW_MOTO_SCOOTERS
      )
      expect(resolveCreateFlowFromCatalogItem({ slug: 'unknown' })).toBeNull()
   })

   it('builds immutable route query for mapped flow', () => {
      const tiresQuery = buildCreateRouteQueryForFlow(CREATE_FLOW_PARTS_CAR_TIRES)
      expect(tiresQuery).toEqual({
         main_category_id: 3,
         sub_category_id: 1,
         last_category_id: 1
      })

      tiresQuery.main_category_id = 999
      expect(
         buildCreateRouteQueryForFlow(CREATE_FLOW_PARTS_CAR_TIRES).main_category_id
      ).toBe(3)
      expect(buildCreateRouteQueryForFlow(CREATE_FLOW_MOTO_MOTORCYCLES)).toEqual({
         main_category_id: 2,
         sub_category_id: 1
      })
      expect(buildCreateRouteQueryForFlow('unknown')).toBeNull()
   })

   it('builds cars query and detects cars condition options', () => {
      expect(buildCarsCreateRouteQuery('used')).toEqual({ main_category_id: 1 })
      expect(buildCarsCreateRouteQuery()).toEqual({
         main_category_id: 1
      })

      expect(
         isCarsConditionCatalogItem({
            item: { slug: 'new' },
            rootCategorySlug: 'cars'
         })
      ).toBe(true)
      expect(
         isCarsConditionCatalogItem({
            item: { id: 2 },
            rootCategorySlug: 'cars'
         })
      ).toBe(true)
      expect(
         isCarsConditionCatalogItem({
            item: { slug: 'new' },
            rootCategorySlug: 'parts'
         })
      ).toBe(false)
   })

   it('resolves flow by main/sub/last category context', () => {
      expect(
         resolveCreateFlowFromCategoryContext({
            mainCategoryId: 3,
            subCategoryId: 1,
            lastCategoryId: 2
         })
      ).toBe(CREATE_FLOW_PARTS_CAR_DISKS)

      expect(
         resolveCreateFlowFromCategoryContext({
            mainCategoryId: 2,
            subCategoryId: 1
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)

      expect(
         resolveCreateFlowFromCategoryContext({
            mainCategoryId: 2,
            subCategoryId: 2
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)

      expect(
         resolveCreateFlowFromCategoryContext({
            mainCategoryId: 3,
            subCategoryId: 10
         })
      ).toBe(CREATE_FLOW_PARTS_MOTOR_OIL)
   })
})
