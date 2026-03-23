import {
   CREATE_FLOW_CARS,
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   resolveCreateFlow
} from './flows'
import { CREATE_MAIN_CATEGORY_ID_AUTOGOODS, resolvePartsFlowByCategoryIds } from './createCategoryFlowRouting'
import { resolveMotoFlowBySubCategoryPayload } from './motoFlowResolver'

const readFlowCandidate = (source) =>
   source?.create_flow ??
   source?.flow ??
   source?.createFlow ??
   source?.ads_parameter?.create_flow ??
   source?.ads_parameter?.flow

const readToken = (value) =>
   String(value?.title ?? value?.name ?? value ?? '')
      .trim()
      .toLowerCase()

const hasMatchingKeyDeep = (source, keyMatcher, visited = new WeakSet()) => {
   if (!source || typeof source !== 'object') return false
   if (visited.has(source)) return false
   visited.add(source)

   if (Array.isArray(source)) {
      return source.some((item) =>
         hasMatchingKeyDeep(item, keyMatcher, visited)
      )
   }

   const keys = Object.keys(source)
   if (keys.some((key) => keyMatcher(key))) return true

   return keys.some((key) =>
      hasMatchingKeyDeep(source[key], keyMatcher, visited)
   )
}

const hasKeyDeep = (source, targetKey) =>
   hasMatchingKeyDeep(source, (key) => key === targetKey)

const hasAnyKeyDeep = (source, keys = []) =>
   keys.some((key) => hasKeyDeep(source, key))

const resolveMotoFlowByPayloadShape = (source) => {
   const flowBySubCategory = resolveMotoFlowBySubCategoryPayload({
      payload: source,
      fallbackFlow: null
   })
   if (flowBySubCategory) return flowBySubCategory

   if (
      source?.fields_only_for_motorcycle &&
      typeof source.fields_only_for_motorcycle === 'object'
   ) {
      return CREATE_FLOW_MOTO_MOTORCYCLES
   }

   const hasMotoSignature = hasAnyKeyDeep(source, [
      'availability_id',
      'availability',
      'engine_capacity',
      'engine_type',
      'fuel_feed',
      'fuel_feed_id',
      'type_id',
      'production'
   ])
   if (!hasMotoSignature) return null

   const hasMotorcycleSpecificFields = hasAnyKeyDeep(source, [
      'fields_only_for_motorcycle',
      'cylinder_position_id',
      'cylinder_position',
      'cylinder_id',
      'cylinder',
      'count_cylinder_id'
   ])

   return hasMotorcycleSpecificFields
      ? CREATE_FLOW_MOTO_MOTORCYCLES
      : CREATE_FLOW_MOTO_SCOOTERS
}

const resolveFlowByPayloadMeta = (source) => {
   const mainCategoryId = Number(
      source?.main_category_id ?? source?.main_category?.id ?? NaN
   )
   const adsModelToken = readToken(source?.ads_model ?? source?.adsModel)
   const subCategoryId = source?.sub_category_id ?? source?.sub_category?.id
   const lastCategoryId =
      source?.last_category_id ?? source?.last_category?.id

   if (mainCategoryId === 1) {
      return CREATE_FLOW_CARS
   }

   if (mainCategoryId === 2) {
      return resolveMotoFlowByPayloadShape(source) || CREATE_FLOW_MOTO_MOTORCYCLES
   }

   if (mainCategoryId === CREATE_MAIN_CATEGORY_ID_AUTOGOODS) {
      return (
         resolvePartsFlowByCategoryIds({
            subCategoryId,
            lastCategoryId
         }) || null
      )
   }

   if (adsModelToken.includes('models\\moto')) {
      return resolveMotoFlowByPayloadShape(source) || CREATE_FLOW_MOTO_MOTORCYCLES
   }

   if (adsModelToken.includes('models\\auto')) {
      return CREATE_FLOW_CARS
   }

   return null
}

const PARTS_FLOW_MARKERS = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: ['tires_condition_id', 'tires_brand_id', 'tires_width_id'],
   [CREATE_FLOW_PARTS_CAR_DISKS]: ['disks_condition_id', 'disks_brand_id', 'disks_type_id'],
   [CREATE_FLOW_PARTS_MOTO_TIRES]: [
      'moto_tires_condition_id',
      'moto_tires_brand_id',
      'moto_tires_width_id'
   ],
   [CREATE_FLOW_PARTS_FULL_WHEELS]: [
      'full_wheels_condition_id',
      'full_wheels_front_width_id',
      'full_wheels_disk_type_id'
   ],
   [CREATE_FLOW_PARTS_MOTOR_OIL]: ['motor_oil_condition_id', 'motor_oil_brand_id']
})

const resolveFlowByPartsFields = (source) => {
   for (const [flow, markers] of Object.entries(PARTS_FLOW_MARKERS)) {
      if (hasAnyKeyDeep(source, markers)) return flow
   }
   return null
}

const resolveFlowByFieldHints = (source) => {
   if (hasMatchingKeyDeep(source, (key) => key.startsWith('moto_motorcycle_'))) {
      return CREATE_FLOW_MOTO_MOTORCYCLES
   }
   if (hasMatchingKeyDeep(source, (key) => key.startsWith('moto_scooter_'))) {
      return CREATE_FLOW_MOTO_SCOOTERS
   }

   const partsFlow = resolveFlowByPartsFields(source)
   if (partsFlow) return partsFlow

   const metaFlow = resolveFlowByPayloadMeta(source)
   if (metaFlow) return metaFlow

   const motoFlow = resolveMotoFlowByPayloadShape(source)
   if (motoFlow) return motoFlow

   return null
}

export const resolveCreateFlowFromPayload = (
   source,
   { fallbackFlow = CREATE_FLOW_CARS } = {}
) => {
   const inferredFlow = resolveFlowByFieldHints(source)
   const rawFlow = readFlowCandidate(source)
   const flow = inferredFlow || rawFlow

   if (!flow) {
      if (fallbackFlow === null || fallbackFlow === undefined) return null
      return resolveCreateFlow(fallbackFlow)
   }

   return resolveCreateFlow(flow)
}
