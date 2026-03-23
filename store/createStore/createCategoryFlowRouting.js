import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL
} from './flows'
import { resolveMotoFlowBySubCategoryId } from './motoFlowResolver'

export const CREATE_MAIN_CATEGORY_ID_CARS = 1
export const CREATE_MAIN_CATEGORY_ID_MOTO = 2
export const CREATE_MAIN_CATEGORY_ID_AUTOGOODS = 3

const MOTO_FLOW_SUBCATEGORY_IDS = Object.freeze({
   [CREATE_FLOW_MOTO_MOTORCYCLES]: 1,
   [CREATE_FLOW_MOTO_SCOOTERS]: 2
})

const PARTS_FLOW_CATEGORY_IDS = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: Object.freeze({
      sub_category_id: 1,
      last_category_id: 1
   }),
   [CREATE_FLOW_PARTS_CAR_DISKS]: Object.freeze({
      sub_category_id: 1,
      last_category_id: 2
   }),
   [CREATE_FLOW_PARTS_FULL_WHEELS]: Object.freeze({
      sub_category_id: 1,
      last_category_id: 3
   }),
   [CREATE_FLOW_PARTS_MOTO_TIRES]: Object.freeze({
      sub_category_id: 1,
      last_category_id: 5
   }),
   [CREATE_FLOW_PARTS_MOTOR_OIL]: Object.freeze({
      sub_category_id: 10,
      last_category_id: 7
   })
})

const PARTS_FLOW_BY_LAST_CATEGORY_ID = Object.freeze({
   1: CREATE_FLOW_PARTS_CAR_TIRES,
   2: CREATE_FLOW_PARTS_CAR_DISKS,
   3: CREATE_FLOW_PARTS_FULL_WHEELS,
   5: CREATE_FLOW_PARTS_MOTO_TIRES,
   7: CREATE_FLOW_PARTS_MOTOR_OIL
})

const CREATE_FLOW_ROUTE_QUERY_MAP = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
      ...PARTS_FLOW_CATEGORY_IDS[CREATE_FLOW_PARTS_CAR_TIRES]
   }),
   [CREATE_FLOW_PARTS_CAR_DISKS]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
      ...PARTS_FLOW_CATEGORY_IDS[CREATE_FLOW_PARTS_CAR_DISKS]
   }),
   [CREATE_FLOW_PARTS_MOTO_TIRES]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
      ...PARTS_FLOW_CATEGORY_IDS[CREATE_FLOW_PARTS_MOTO_TIRES]
   }),
   [CREATE_FLOW_PARTS_FULL_WHEELS]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
      ...PARTS_FLOW_CATEGORY_IDS[CREATE_FLOW_PARTS_FULL_WHEELS]
   }),
   [CREATE_FLOW_PARTS_MOTOR_OIL]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
      ...PARTS_FLOW_CATEGORY_IDS[CREATE_FLOW_PARTS_MOTOR_OIL]
   }),
   [CREATE_FLOW_MOTO_MOTORCYCLES]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_MOTO,
      sub_category_id: MOTO_FLOW_SUBCATEGORY_IDS[CREATE_FLOW_MOTO_MOTORCYCLES]
   }),
   [CREATE_FLOW_MOTO_SCOOTERS]: Object.freeze({
      main_category_id: CREATE_MAIN_CATEGORY_ID_MOTO,
      sub_category_id: MOTO_FLOW_SUBCATEGORY_IDS[CREATE_FLOW_MOTO_SCOOTERS]
   })
})

const CREATE_ITEM_FLOW_MAP = Object.freeze({
   'car-tires': CREATE_FLOW_PARTS_CAR_TIRES,
   rims: CREATE_FLOW_PARTS_CAR_DISKS,
   'moto-tires': CREATE_FLOW_PARTS_MOTO_TIRES,
   'full-wheels': CREATE_FLOW_PARTS_FULL_WHEELS,
   'motor-oil': CREATE_FLOW_PARTS_MOTOR_OIL,
   motorcycles: CREATE_FLOW_MOTO_MOTORCYCLES,
   scooters: CREATE_FLOW_MOTO_SCOOTERS
})

export const resolveCreateFlowFromCatalogItem = (item) => {
   const slug =
      typeof item?.slug === 'string' ? item.slug.trim().toLowerCase() : ''

   return CREATE_ITEM_FLOW_MAP[slug] || null
}

export const resolveCreateFlowFromCategoryContext = ({
   mainCategoryId = null,
   subCategoryId = null,
   lastCategoryId = null,
   slug = ''
} = {}) => {
   const normalizedMainCategoryId = Number(mainCategoryId)

   if (normalizedMainCategoryId === CREATE_MAIN_CATEGORY_ID_AUTOGOODS) {
      const partsFlow = resolvePartsFlowByCategoryIds({
         subCategoryId,
         lastCategoryId
      })
      if (partsFlow) return partsFlow
   }

   if (normalizedMainCategoryId === CREATE_MAIN_CATEGORY_ID_MOTO) {
      const motoFlow = resolveMotoFlowBySubCategoryId(subCategoryId, {
         fallbackFlow: null
      })
      if (motoFlow) return motoFlow
   }

   if (normalizedMainCategoryId === CREATE_MAIN_CATEGORY_ID_CARS) {
      return null
   }

   if (!slug) return null
   return resolveCreateFlowFromCatalogItem({ slug })
}

export const buildCreateRouteQueryForFlow = (flow) => {
   const query = CREATE_FLOW_ROUTE_QUERY_MAP[flow]
   return query ? { ...query } : null
}

export const resolveCreateCategoryIdsByFlow = (flow) => {
   if (flow === CREATE_FLOW_MOTO_MOTORCYCLES || flow === CREATE_FLOW_MOTO_SCOOTERS) {
      return {
         main_category_id: CREATE_MAIN_CATEGORY_ID_MOTO,
         sub_category_id: MOTO_FLOW_SUBCATEGORY_IDS[flow] || null
      }
   }

   const partsCategoryIds = PARTS_FLOW_CATEGORY_IDS[flow]
   if (partsCategoryIds) {
      return {
         main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
         ...partsCategoryIds
      }
   }

   return { main_category_id: CREATE_MAIN_CATEGORY_ID_CARS }
}

export const resolvePartsFlowByCategoryIds = ({
   subCategoryId = null,
   lastCategoryId = null
} = {}) => {
   const hasLastCategoryId =
      lastCategoryId !== null && lastCategoryId !== undefined && lastCategoryId !== ''
   if (hasLastCategoryId) {
      const normalizedLastCategoryId = Number(lastCategoryId)
      if (Number.isFinite(normalizedLastCategoryId)) {
         return PARTS_FLOW_BY_LAST_CATEGORY_ID[normalizedLastCategoryId] || null
      }
   }

   const normalizedSubCategoryId = Number(subCategoryId)
   if (normalizedSubCategoryId === 10) {
      return CREATE_FLOW_PARTS_MOTOR_OIL
   }

   return null
}

const resolveCarsCreateConditionQueryValue = (conditionOption) => {
   const id = Number(conditionOption?.id)
   if (id === 1) return 'new'
   if (id === 2) return 'used'

   const slug = String(conditionOption?.slug || '')
      .trim()
      .toLowerCase()
   if (slug === 'new' || slug === 'used') return slug

   return ''
}

export const buildCarsCreateRouteQuery = (conditionOption = null) => {
   const query = {
      main_category_id: CREATE_MAIN_CATEGORY_ID_CARS
   }

   const condition = resolveCarsCreateConditionQueryValue(conditionOption)
   if (condition) {
      query.condition = condition
   }

   return query
}

export const isCarsConditionCatalogItem = ({ item, rootCategorySlug }) => {
   if (rootCategorySlug !== 'cars') return false
   if (!item) return false

   return (
      item.slug === 'new' ||
      item.slug === 'used' ||
      item.id === 1 ||
      item.id === 2
   )
}
