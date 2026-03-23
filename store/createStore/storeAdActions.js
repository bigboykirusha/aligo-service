import {
   createAutogoodsAd,
   createCarAd,
   createMotoAd,
   getAutogoodsById,
   getCarById,
   getMotoById,
   updateAutogoodsAd,
   updateCarAd,
   updateMotoAd
} from '@/services/apiClient'
import { isAutogoodsCreateFlow, isMotoCreateFlow } from './flows'
import { createInitialCreateState } from './state'
import { remapMotoCreateFormDataForApi } from './motoPayload'
import { remapAutogoodsCreateFormDataForApi } from './autogoodsPayload'
import { applyCreateStoreFromApiData } from './orchestration'
import { sendCreateStoreAd, updateCreateStoreAd } from './publishActions'
import { resolveCreateFlowFromPayload } from './flowResolvers'
import { resolveCreateCategoryIdsByFlow } from './createCategoryFlowRouting'
import { resolveMotoFlowBySubCategoryPayload, resolveMotoSubCategoryIdByFlow } from './motoFlowResolver'

const hasCreateFormDataField = (formData, key) => {
   if (!formData || typeof formData.entries !== 'function') return false

   for (const [field] of formData.entries()) {
      if (field === key) return true
   }
   return false
}

const appendCreateFormDataField = ({ formData, key, value }) => {
   if (!formData || typeof formData.entries !== 'function') return formData
   if (value === null || value === undefined || value === '') return formData
   if (hasCreateFormDataField(formData, key)) return formData

   const nextFormData = new FormData()
   for (const [field, fieldValue] of formData.entries()) {
      nextFormData.append(field, fieldValue)
   }
   nextFormData.append(key, value)
   return nextFormData
}

const resolveMotoFlowFromPayload = ({ payload, fallbackFlow = null }) => {
   const flowByPayload = resolveCreateFlowFromPayload(payload, {
      fallbackFlow: null
   })
   if (isMotoCreateFlow(flowByPayload)) return flowByPayload

   const flowBySubCategory = resolveMotoFlowBySubCategoryPayload({
      payload,
      fallbackFlow: null
   })
   if (flowBySubCategory) return flowBySubCategory

   return isMotoCreateFlow(fallbackFlow) ? fallbackFlow : null
}

const readRouteQueryScalar = (query, key) => {
   const value = query?.[key]
   if (Array.isArray(value)) return value[0]
   return value
}

const toOptionalNumber = (value) => {
   if (value === null || value === undefined || value === '') return null
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const isMotoMainCategoryPayload = (payload) =>
   Number(payload?.main_category_id) === 2 ||
   Number(payload?.main_category?.id) === 2

const isAutogoodsMainCategoryPayload = (payload) =>
   Number(payload?.main_category_id) === 3 ||
   Number(payload?.main_category?.id) === 3

const resolveRouteCategoryHint = ({ routeMainCategoryId, routeQuery }) =>
   toOptionalNumber(
      routeMainCategoryId ?? readRouteQueryScalar(routeQuery, 'main_category_id')
   )

const assertLookupPayload = (payload, fallbackMessage) => {
   if (payload === null || payload === undefined) {
      throw new Error(fallbackMessage)
   }

   if (payload?.success === false) {
      throw new Error(payload?.message || fallbackMessage)
   }
   return payload
}

const loadCarByIdOrThrow = async (id) =>
   assertLookupPayload(
      await getCarById(id),
      'Failed to load car advertisement by id.'
   )

const loadMotoByIdOrThrow = async (id) =>
   assertLookupPayload(
      await getMotoById(id),
      'Failed to load moto advertisement by id.'
   )

const loadAutogoodsByIdOrThrow = async (id) =>
   assertLookupPayload(
      await getAutogoodsById(id),
      'Failed to load autogoods advertisement by id.'
   )

const appendCreateCategoryContextToFormData = ({
   formData,
   flow,
   store
}) => {
   let requestFormData = formData
   const flowCategoryIds = resolveCreateCategoryIdsByFlow(flow)
   const fallbackMotoSubCategoryId = isMotoCreateFlow(flow)
      ? resolveMotoSubCategoryIdByFlow(flow)
      : null

   const mainCategoryId = toOptionalNumber(
      store?.main_category_id ?? flowCategoryIds.main_category_id
   )
   const subCategoryId = toOptionalNumber(
      store?.sub_category_id ??
         flowCategoryIds.sub_category_id ??
         fallbackMotoSubCategoryId
   )
   const lastCategoryId = toOptionalNumber(
      store?.last_category_id ?? flowCategoryIds.last_category_id
   )

   requestFormData = appendCreateFormDataField({
      formData: requestFormData,
      key: 'main_category_id',
      value: mainCategoryId
   })
   requestFormData = appendCreateFormDataField({
      formData: requestFormData,
      key: 'sub_category_id',
      value: subCategoryId
   })
   requestFormData = appendCreateFormDataField({
      formData: requestFormData,
      key: 'last_category_id',
      value: lastCategoryId
   })
   requestFormData = appendCreateFormDataField({
      formData: requestFormData,
      key: 'create_by_user_id',
      value: toOptionalNumber(store?.create_by_user_id)
   })

   return requestFormData
}

const buildCreateRequestFormData = ({ flow, formData, store }) => {
   let requestFormData = remapMotoCreateFormDataForApi({
      formData,
      flow
   })

   requestFormData = remapAutogoodsCreateFormDataForApi({
      formData: requestFormData,
      flow,
      store
   })

   requestFormData = appendCreateCategoryContextToFormData({
      formData: requestFormData,
      flow,
      store
   })

   return requestFormData
}

export const sendCreateStoreAdByFlow = async ({ store, formData }) => {
   const createAdRequest = isMotoCreateFlow(store.create_flow)
      ? createMotoAd
      : isAutogoodsCreateFlow(store.create_flow)
         ? createAutogoodsAd
         : createCarAd
   const requestFormData = buildCreateRequestFormData({
      flow: store.create_flow,
      formData,
      store
   })

   return sendCreateStoreAd({
      formData: requestFormData,
      createAdRequest
   })
}

export const updateCreateStoreAdByFlow = async ({ store, formData }) => {
   const updateAdRequest = isMotoCreateFlow(store.create_flow)
      ? updateMotoAd
      : isAutogoodsCreateFlow(store.create_flow)
         ? updateAutogoodsAd
         : updateCarAd
   const requestFormData = buildCreateRequestFormData({
      flow: store.create_flow,
      formData,
      store
   })

   return updateCreateStoreAd({
      id: store.id,
      formData: requestFormData,
      updateAdRequest
   })
}

export const hydrateCreateStoreFromApiById = async ({
   store,
   id,
   userStore,
   routeMainCategoryId = null,
   routeQuery = {}
}) => {
   const hydrateFromPayload = async (payload, flow = null) => {
      const nextFlow = flow || store.create_flow
      Object.assign(store, createInitialCreateState())
      store.setCreateFlow(nextFlow)
      applyCreateStoreFromApiData({
         store,
         carData: payload,
         userStore
      })
      return payload
   }

   const routeMainCategoryHint = resolveRouteCategoryHint({
      routeMainCategoryId,
      routeQuery
   })

   if (routeMainCategoryHint === 2) {
      const motoData = await loadMotoByIdOrThrow(id)
      const motoFlow = resolveMotoFlowFromPayload({
         payload: motoData,
         fallbackFlow: store.create_flow
      })
      return hydrateFromPayload(motoData, motoFlow)
   }

   if (routeMainCategoryHint === 1) {
      const carData = await loadCarByIdOrThrow(id)
      if (isMotoMainCategoryPayload(carData)) {
         throw new Error('Draft category mismatch: expected cars payload')
      }
      return hydrateFromPayload(carData, store.create_flow)
   }

   if (routeMainCategoryHint === 3) {
      try {
         const autogoodsData = await loadAutogoodsByIdOrThrow(id)
         return hydrateFromPayload(autogoodsData, store.create_flow)
      } catch {
         const carData = await loadCarByIdOrThrow(id)
         if (isMotoMainCategoryPayload(carData)) {
            throw new Error('Draft category mismatch: expected autogoods payload')
         }
         return hydrateFromPayload(carData, store.create_flow)
      }
   }

   if (isMotoCreateFlow(store.create_flow)) {
      const motoData = await loadMotoByIdOrThrow(id)
      const motoFlow = resolveMotoFlowFromPayload({
         payload: motoData,
         fallbackFlow: store.create_flow
      })
      return hydrateFromPayload(motoData, motoFlow)
   }

   if (isAutogoodsCreateFlow(store.create_flow)) {
      try {
         const autogoodsData = await loadAutogoodsByIdOrThrow(id)
         return hydrateFromPayload(autogoodsData, store.create_flow)
      } catch {
         // fallback to legacy autos endpoint for compatibility
      }
   }

   try {
      const carData = await loadCarByIdOrThrow(id)
      const isMotoMainCategory = isMotoMainCategoryPayload(carData)
      const isAutogoodsMainCategory = isAutogoodsMainCategoryPayload(carData)

      if (isMotoMainCategory) {
         const motoData = await loadMotoByIdOrThrow(id).catch(() => carData)
         const motoFlow = resolveMotoFlowFromPayload({
            payload: motoData,
            fallbackFlow: null
         })
         return hydrateFromPayload(motoData, motoFlow)
      }

      if (isAutogoodsMainCategory) {
         const autogoodsData = await loadAutogoodsByIdOrThrow(id).catch(
            () => carData
         )
         return hydrateFromPayload(autogoodsData, store.create_flow)
      }

      return hydrateFromPayload(carData, store.create_flow)
   } catch (carDraftError) {
      try {
         const autogoodsData = await loadAutogoodsByIdOrThrow(id)
         return hydrateFromPayload(autogoodsData, store.create_flow)
      } catch {
         // keep next fallback for moto to preserve old behavior
      }
      try {
         const motoData = await loadMotoByIdOrThrow(id)
         const motoFlow = resolveMotoFlowFromPayload({
            payload: motoData,
            fallbackFlow: null
         })
         return hydrateFromPayload(motoData, motoFlow)
      } catch {
         throw carDraftError
      }
   }
}
