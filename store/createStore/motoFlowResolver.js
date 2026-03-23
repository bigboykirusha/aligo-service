import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   isMotoCreateFlow
} from './flows'

export const MOTO_SUBCATEGORY_ID_BY_FLOW = Object.freeze({
   [CREATE_FLOW_MOTO_MOTORCYCLES]: 1,
   [CREATE_FLOW_MOTO_SCOOTERS]: 2
})

const normalizeMotoToken = (value) =>
   String(value ?? '')
      .trim()
      .toLowerCase()

const MOTO_MOTORCYCLE_TITLE_TOKENS = Object.freeze([
   'мотоцикл',
   'мотоциклы',
   'motorcycle',
   'motorcycles'
])

const MOTO_SCOOTER_TITLE_TOKENS = Object.freeze([
   'скутер',
   'скутеры',
   'мопед',
   'мопеды',
   'scooter',
   'scooters',
   'moped',
   'mopeds'
])

const includesAnyToken = (value, tokens = []) =>
   tokens.some((token) => value.includes(token))

const isValuePresent = (value) =>
   value !== null && value !== undefined && value !== ''

export const resolveMotoSubCategoryIdByFlow = (
   flow,
   { fallbackSubCategoryId = null } = {}
) => {
   const id = MOTO_SUBCATEGORY_ID_BY_FLOW[flow]
   if (isValuePresent(id)) return id
   return isValuePresent(fallbackSubCategoryId) ? Number(fallbackSubCategoryId) : null
}

export const resolveMotoFlowBySubCategoryId = (
   subCategoryId,
   { fallbackFlow = null } = {}
) => {
   const normalizedId = Number(subCategoryId)
   if (normalizedId === MOTO_SUBCATEGORY_ID_BY_FLOW[CREATE_FLOW_MOTO_MOTORCYCLES]) {
      return CREATE_FLOW_MOTO_MOTORCYCLES
   }
   if (normalizedId === MOTO_SUBCATEGORY_ID_BY_FLOW[CREATE_FLOW_MOTO_SCOOTERS]) {
      return CREATE_FLOW_MOTO_SCOOTERS
   }

   return isMotoCreateFlow(fallbackFlow) ? fallbackFlow : null
}

export const resolveMotoFlowBySubCategoryTitle = (
   subCategoryTitle,
   { fallbackFlow = null } = {}
) => {
   const token = normalizeMotoToken(subCategoryTitle)
   if (!token) return isMotoCreateFlow(fallbackFlow) ? fallbackFlow : null

   if (includesAnyToken(token, MOTO_MOTORCYCLE_TITLE_TOKENS)) {
      return CREATE_FLOW_MOTO_MOTORCYCLES
   }
   if (includesAnyToken(token, MOTO_SCOOTER_TITLE_TOKENS)) {
      return CREATE_FLOW_MOTO_SCOOTERS
   }

   return isMotoCreateFlow(fallbackFlow) ? fallbackFlow : null
}

export const resolveMotoFlowBySubCategory = ({
   subCategoryId = null,
   subCategoryTitle = '',
   fallbackFlow = null
} = {}) => {
   const byId = resolveMotoFlowBySubCategoryId(subCategoryId, {
      fallbackFlow: null
   })
   if (byId) return byId

   return resolveMotoFlowBySubCategoryTitle(subCategoryTitle, { fallbackFlow })
}

export const resolveMotoFlowBySubCategoryPayload = ({
   payload,
   fallbackFlow = null
} = {}) => {
   const subCategoryId = payload?.sub_category_id ?? payload?.sub_category?.id
   const subCategoryTitle =
      payload?.sub_category?.title ??
      payload?.sub_category?.name ??
      payload?.sub_category

   return resolveMotoFlowBySubCategory({
      subCategoryId,
      subCategoryTitle,
      fallbackFlow
   })
}
