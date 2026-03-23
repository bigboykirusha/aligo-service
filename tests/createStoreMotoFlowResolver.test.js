import { describe, expect, it } from 'vitest'
import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS
} from '../store/createStore/flows'
import {
   resolveMotoFlowBySubCategory,
   resolveMotoFlowBySubCategoryPayload,
   resolveMotoSubCategoryIdByFlow
} from '../store/createStore/motoFlowResolver'

describe('create moto flow resolver', () => {
   it('maps flow to sub category id', () => {
      expect(resolveMotoSubCategoryIdByFlow(CREATE_FLOW_MOTO_MOTORCYCLES)).toBe(1)
      expect(resolveMotoSubCategoryIdByFlow(CREATE_FLOW_MOTO_SCOOTERS)).toBe(2)
      expect(resolveMotoSubCategoryIdByFlow('unknown')).toBeNull()
      expect(
         resolveMotoSubCategoryIdByFlow('unknown', {
            fallbackSubCategoryId: 2
         })
      ).toBe(2)
   })

   it('resolves flow by sub category id and title', () => {
      expect(
         resolveMotoFlowBySubCategory({
            subCategoryId: 1
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
      expect(
         resolveMotoFlowBySubCategory({
            subCategoryId: 2
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)
      expect(
         resolveMotoFlowBySubCategory({
            subCategoryTitle: 'scooters and mopeds'
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)
      expect(
         resolveMotoFlowBySubCategory({
            subCategoryTitle: 'Мотоциклы'
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
   })

   it('resolves flow by payload and fallback', () => {
      expect(
         resolveMotoFlowBySubCategoryPayload({
            payload: {
               sub_category: {
                  id: 2,
                  title: 'Scooters'
               }
            }
         })
      ).toBe(CREATE_FLOW_MOTO_SCOOTERS)

      expect(
         resolveMotoFlowBySubCategoryPayload({
            payload: {
               sub_category: {
                  title: 'Мотоциклы'
               }
            }
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)

      expect(
         resolveMotoFlowBySubCategoryPayload({
            payload: {},
            fallbackFlow: CREATE_FLOW_MOTO_MOTORCYCLES
         })
      ).toBe(CREATE_FLOW_MOTO_MOTORCYCLES)
   })
})
