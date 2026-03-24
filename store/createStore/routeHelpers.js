import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   resolveCreateFlow
} from './flows'
import {
   CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
   CREATE_MAIN_CATEGORY_ID_MOTO,
   resolveCreateCategoryIdsByFlow,
   resolveCreateFlowFromCatalogItem,
   resolveCreateFlowFromCategoryContext
} from './createCategoryFlowRouting'
import { resolveMotoFlowBySubCategory } from './motoFlowResolver'

const getRouteQueryScalar = (query, key) => {
   const value = query?.[key]
   if (Array.isArray(value)) return value[0]
   return value
}

const readRouteQueryNumber = (query, key) => {
   const value = getRouteQueryScalar(query, key)
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const readRouteQueryString = (query, key) => {
   const value = getRouteQueryScalar(query, key)
   return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

const resolveCreateFlowFromRouteMeta = (query = {}) => {
   const mainCategoryId = readRouteQueryNumber(query, 'main_category_id')
   const subCategoryId = readRouteQueryNumber(query, 'sub_category_id')
   const lastCategoryId = readRouteQueryNumber(query, 'last_category_id')
   const subCategoryTitle = readRouteQueryString(query, 'sub_category_title')
   const adsModel = readRouteQueryString(query, 'ads_model')

   if (mainCategoryId === CREATE_MAIN_CATEGORY_ID_MOTO || adsModel.includes('moto')) {
      return resolveMotoFlowBySubCategory({
         subCategoryId,
         subCategoryTitle,
         fallbackFlow: CREATE_FLOW_MOTO_MOTORCYCLES
      })
   }

   return resolveCreateFlowFromCategoryContext({
      mainCategoryId,
      subCategoryId,
      lastCategoryId
   })
}

export const resolveCreateFlowFromRouteQuery = (query = {}) => {
   const queryFlow = readRouteQueryString(query, 'flow')
   const queryCategory = readRouteQueryString(query, 'category')
   const queryItem = readRouteQueryString(query, 'item')

   const routeMetaFlow = resolveCreateFlowFromRouteMeta(query)
   if (routeMetaFlow) return routeMetaFlow

   const resolvedFlowByQuery = queryFlow ? resolveCreateFlow(queryFlow) : null
   if (resolvedFlowByQuery && resolvedFlowByQuery !== CREATE_FLOW_CARS) {
      return resolvedFlowByQuery
   }

   if ((queryCategory === 'parts' || queryCategory === 'moto') && queryItem) {
      return resolveCreateFlowFromCatalogItem({ slug: queryItem }) || CREATE_FLOW_CARS
   }

   return CREATE_FLOW_CARS
}

export const readCreateRouteQueryNumber = (query, key) =>
   readRouteQueryNumber(query, key)

export const resolveCreateConditionIdFromRouteQuery = (query = {}) => {
   const queryCondition = readRouteQueryString(query, 'condition')
   if (queryCondition === 'new') return 1
   if (queryCondition === 'used') return 2
   if (queryCondition === '1') return 1
   if (queryCondition === '2') return 2
   return null
}

const resolveCreateConditionQueryValue = ({ routeQuery = {}, store } = {}) => {
   const storeConditionId = Number(store?.condition_id)
   if (storeConditionId === 1) return 'new'
   if (storeConditionId === 2) return 'used'

   const routeCondition = readRouteQueryString(routeQuery, 'condition')
   if (
      routeCondition === 'new' ||
      routeCondition === 'used' ||
      routeCondition === '1' ||
      routeCondition === '2'
   ) {
      return routeCondition === '1' ? 'new' : routeCondition === '2' ? 'used' : routeCondition
   }

   return ''
}

export const canLoadCreateDraftForUser = ({ routeQuery = {}, userId }) => {
   const routeId = getRouteQueryScalar(routeQuery, 'id')

   if (!routeId) {
      return { canLoad: false, routeId: routeId || null }
   }

   const moderationOwnerId = getRouteQueryScalar(
      routeQuery,
      'create_by_user_id'
   )
   if (
      moderationOwnerId !== undefined &&
      moderationOwnerId !== null &&
      moderationOwnerId !== ''
   ) {
      return {
         canLoad: true,
         routeId
      }
   }

   const routeOwnerId = getRouteQueryScalar(routeQuery, 'id_user_owner_ads')
   if (routeOwnerId === undefined || routeOwnerId === null || routeOwnerId === '') {
      return {
         canLoad: false,
         routeId
      }
   }

   return {
      canLoad: String(routeOwnerId) === String(userId),
      routeId
   }
}

export const shouldHydrateCreateDraftFromRoute = ({
   canLoad,
   routeId,
   storeId
}) => {
   if (!canLoad || !routeId) return false
   if (storeId === null || storeId === undefined || storeId === '') return true
   return String(storeId) !== String(routeId)
}

const resolveCreateSubCategoryIdByFlow = (flow) =>
   resolveCreateCategoryIdsByFlow(flow).sub_category_id || null

const appendRouteQueryNumberIfPresent = (query, key, value) => {
   if (value === null || value === undefined || value === '') return
   query[key] = Number(value)
}

const toOptionalNumber = (value) => {
   if (value === null || value === undefined || value === '') return null
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

export const buildCreateDraftRouteSyncQuery = ({
   routeQuery = {},
   store,
   fallbackUserId = null
}) => {
   const id = store?.id ?? getRouteQueryScalar(routeQuery, 'id')
   if (!id) return null

   const routeFlow = resolveCreateFlowFromRouteQuery(routeQuery)
   const flow = resolveCreateFlow(store?.create_flow || routeFlow || CREATE_FLOW_CARS)

   const ownerId =
      store?.id_user_owner_ads ??
      getRouteQueryScalar(routeQuery, 'id_user_owner_ads') ??
      fallbackUserId ??
      ''

   const query = {
      id,
      id_user_owner_ads: ownerId
   }

   const routeMainCategoryId = readRouteQueryNumber(routeQuery, 'main_category_id')
   const routeSubCategoryId = readRouteQueryNumber(routeQuery, 'sub_category_id')
   const routeLastCategoryId = readRouteQueryNumber(routeQuery, 'last_category_id')
   const categoryIdsByFlow = resolveCreateCategoryIdsByFlow(flow)
   const storeMainCategoryId = toOptionalNumber(store?.main_category_id)
   const storeSubCategoryId = toOptionalNumber(store?.sub_category_id)
   const storeLastCategoryId = toOptionalNumber(store?.last_category_id)
   const mainCategoryId =
      storeMainCategoryId ??
      categoryIdsByFlow.main_category_id ??
      routeMainCategoryId

   appendRouteQueryNumberIfPresent(query, 'main_category_id', mainCategoryId)

   const conditionQueryValue = resolveCreateConditionQueryValue({
      routeQuery,
      store
   })
   if (conditionQueryValue) {
      query.condition = conditionQueryValue
   }

   if (mainCategoryId === CREATE_MAIN_CATEGORY_ID_MOTO) {
      const subCategoryId =
         storeSubCategoryId ??
         resolveCreateSubCategoryIdByFlow(flow) ??
         routeSubCategoryId
      appendRouteQueryNumberIfPresent(query, 'sub_category_id', subCategoryId)
   }

   if (mainCategoryId === CREATE_MAIN_CATEGORY_ID_AUTOGOODS) {
      const subCategoryId =
         storeSubCategoryId ??
         categoryIdsByFlow.sub_category_id ??
         routeSubCategoryId
      const lastCategoryId =
         storeLastCategoryId ??
         categoryIdsByFlow.last_category_id ??
         routeLastCategoryId
      appendRouteQueryNumberIfPresent(query, 'sub_category_id', subCategoryId)
      appendRouteQueryNumberIfPresent(
         query,
         'last_category_id',
         lastCategoryId
      )
   }

   return query
}

export const syncCreateStoreCategoryIdsFromRoute = ({
   store,
   routeQuery = {},
   flow
}) => {
   if (!store) return

   const categoryIdsByFlow = resolveCreateCategoryIdsByFlow(flow)
   const routeMainCategoryId = readRouteQueryNumber(routeQuery, 'main_category_id')
   const routeSubCategoryId = readRouteQueryNumber(routeQuery, 'sub_category_id')
   const routeLastCategoryId = readRouteQueryNumber(routeQuery, 'last_category_id')

   store.main_category_id =
      routeMainCategoryId ?? categoryIdsByFlow.main_category_id ?? null
   store.sub_category_id =
      routeSubCategoryId ?? categoryIdsByFlow.sub_category_id ?? null
   store.last_category_id =
      routeLastCategoryId ?? categoryIdsByFlow.last_category_id ?? null
}

const toRouteComparableValue = (value) => {
   const scalar = Array.isArray(value) ? value[0] : value
   if (scalar === null || scalar === undefined || scalar === '') return ''
   return String(scalar)
}

export const hasCreateDraftRouteSyncChanged = ({
   routeQuery = {},
   nextQuery = {},
   comparableKeys = [
      'id',
      'id_user_owner_ads',
      'main_category_id',
      'sub_category_id',
      'last_category_id',
      'condition'
   ]
}) => {
   return comparableKeys.some(
      (key) =>
         toRouteComparableValue(routeQuery[key]) !==
         toRouteComparableValue(nextQuery[key])
   )
}

