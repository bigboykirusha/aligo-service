export const mapCreateDraftsResponse = (response) => {
   if (!Array.isArray(response)) return []

   const hasValidId = (value) =>
      value !== null && value !== undefined && value !== ''

   return response
      .map((item) => {
         const payload = item?.ads_show || item
         if (!payload) return null
         const id = payload?.id ?? item?.id
         if (!hasValidId(id)) return null

         return {
            ...payload,
            id,
            ads_model: payload?.ads_model ?? item?.ads_model ?? null
         }
      })
      .filter(Boolean)
}

export const CREATE_AD_EDIT_PATH = '/create/'

const readDraftTextValue = (value) =>
   typeof value === 'string' ? value.trim() : value

const buildTitleFromParts = (parts = []) =>
   parts
      .map((part) => readDraftTextValue(part))
      .filter(Boolean)
      .join(', ')

const buildAutoDraftTitle = (draft) => {
   const specification = draft?.auto_technical_specifications?.[0] || {}
   return buildTitleFromParts([
      specification?.brand?.title || specification?.brand,
      specification?.model?.title || specification?.model,
      specification?.year_release?.title || specification?.year_release
   ])
}

const buildMotoDraftTitle = (draft) =>
   buildTitleFromParts([
      draft?.production?.brand?.title || draft?.production?.brand,
      draft?.production?.model?.title || draft?.production?.model,
      draft?.production?.type?.title || draft?.production?.type,
      draft?.year?.title || draft?.year
   ])

const buildAutogoodsDraftTitle = (draft) =>
   buildTitleFromParts([
      draft?.entity?.brand?.title || draft?.entity?.brand,
      draft?.entity?.model?.title || draft?.entity?.model,
      draft?.entity?.year?.title || draft?.entity?.year
   ])

export const getCreateDraftTitle = (draft) => {
   const title =
      buildAutoDraftTitle(draft) ||
      buildMotoDraftTitle(draft) ||
      buildAutogoodsDraftTitle(draft)
   return title || 'Без названия'
}

export const getCreateDraftDescription = (draft) =>
   draft?.ads_parameter?.ads_description || 'Без описания'

const normalizeDraftCategoryTitle = (value) =>
   typeof value === 'string' ? value.trim() : ''

export const getCreateDraftCategoryLabel = (draft) => {
   const lastCategory = normalizeDraftCategoryTitle(draft?.last_category?.title)
   if (lastCategory) return lastCategory

   const subCategory = normalizeDraftCategoryTitle(draft?.sub_category?.title)
   if (subCategory) return subCategory

   const mainCategory = normalizeDraftCategoryTitle(draft?.main_category?.title)
   if (mainCategory) return mainCategory

   return ''
}

export const getCreateDraftImagePath = (draft) =>
   draft?.photos?.[0]?.arr_title_size?.middle ||
   draft?.photos?.[0]?.arr_title_size?.preview ||
   null

export const buildCreateDraftRouteQuery = ({ draft, userId }) => {
   return buildCreateEditRouteQuery({ ad: draft, userId })
}

export const buildCreateDraftRouteLocation = ({ draft, userId } = {}) => {
   const query = buildCreateDraftRouteQuery({ draft, userId })
   if (!query) return null

   return {
      path: CREATE_AD_EDIT_PATH,
      query
   }
}

const firstPresentValue = (...values) => {
   for (const value of values) {
      if (value !== null && value !== undefined && value !== '') {
         return value
      }
   }
   return null
}

const resolveCarsDraftConditionQueryValue = (ad = {}) => {
   const directConditionToken = String(ad?.condition || '')
      .trim()
      .toLowerCase()
   if (directConditionToken === 'new' || directConditionToken === 'used') {
      return directConditionToken
   }

   const conditionId = Number(ad?.condition_id ?? ad?.condition?.id)
   if (conditionId === 1) return 'new'
   if (conditionId === 2) return 'used'

   const normalizedTitle = String(ad?.condition?.title || '')
      .trim()
      .toLowerCase()

   if (normalizedTitle === 'новые' || normalizedTitle === 'новое') return 'new'
   if (
      normalizedTitle === 'с пробегом' ||
      normalizedTitle === 'б/у' ||
      normalizedTitle === 'бу'
   ) {
      return 'used'
   }

   return ''
}

const resolveCreateEditIdentifier = (source = {}) => {
   const id = source?.id
   if (id !== null && id !== undefined && id !== '') {
      const numericId = Number(id)
      if (!Number.isNaN(numericId) && numericId !== 0) {
         return id
      }
      if (typeof id === 'string' && id.trim()) {
         return id.trim()
      }
   }

   const uniqueCode = source?.unique_code
   if (typeof uniqueCode === 'string' && uniqueCode.trim()) {
      return uniqueCode.trim()
   }

   return null
}

export const resolveCreateDraftOwnerId = (draft = {}) => {
   const ownerId = firstPresentValue(
      draft?.idUserOwnerAds,
      draft?.id_user_owner_ads,
      draft?.user_id,
      draft?.user?.id,
      draft?.ads_parameter?.user_id,
      draft?.create_by_user_id
   )

   if (ownerId === null || ownerId === undefined || ownerId === '') {
      return null
   }

   const numericOwnerId = Number(ownerId)
   return Number.isFinite(numericOwnerId) ? numericOwnerId : null
}

export const buildCreateEditRouteDto = ({ source, userId } = {}) => {
   const id = resolveCreateEditIdentifier(source)
   if (!id) return null

   const ownerId = firstPresentValue(
      source?.idUserOwnerAds,
      source?.id_user_owner_ads,
      source?.user_id,
      source?.user?.id,
      userId,
      ''
   )

   const dto = {
      id,
      idUserOwnerAds: ownerId,
      mainCategoryId: firstPresentValue(
         source?.mainCategoryId,
         source?.main_category_id,
         source?.main_category?.id
      ),
      subCategoryId: firstPresentValue(
         source?.subCategoryId,
         source?.sub_category_id,
         source?.sub_category?.id
      ),
      lastCategoryId: firstPresentValue(
         source?.lastCategoryId,
         source?.last_category_id,
         source?.last_category?.id
      )
   }

   const condition = firstPresentValue(
      source?.condition,
      source?.conditionQueryValue,
      resolveCarsDraftConditionQueryValue(source)
   )

   if (condition !== null) {
      dto.condition = condition
   }

   return dto
}

export const buildCreateEditRouteQueryFromDto = (dto) => {
   if (!dto?.id) return null

   return buildCreateEditRouteQuery({
      ad: {
         id: dto.id,
         id_user_owner_ads: dto.idUserOwnerAds,
         main_category_id: dto.mainCategoryId,
         sub_category_id: dto.subCategoryId,
         last_category_id: dto.lastCategoryId,
         condition: dto.condition
      },
      userId: dto.idUserOwnerAds
   })
}

export const buildCreateEditRouteLocation = ({ source, userId } = {}) => {
   const dto = buildCreateEditRouteDto({ source, userId })
   const query = buildCreateEditRouteQueryFromDto(dto)
   if (!query) return null

   return {
      path: CREATE_AD_EDIT_PATH,
      query
   }
}

export const buildCreateEditRouteQuery = ({ ad, userId }) => {
   const id = ad?.id
   if (!id) return null

   const ownerId =
      ad?.id_user_owner_ads ||
      ad?.user_id ||
      ad?.user?.id ||
      ad?.create_by_user_id ||
      userId ||
      ''

   const query = {
      id,
      id_user_owner_ads: ownerId
   }

   const mainCategoryId = ad?.main_category_id ?? ad?.main_category?.id ?? null
   if (
      mainCategoryId !== null &&
      mainCategoryId !== undefined &&
      mainCategoryId !== ''
   ) {
      query.main_category_id = mainCategoryId
   }

   const subCategoryId = ad?.sub_category_id ?? ad?.sub_category?.id ?? null
   if (
      subCategoryId !== null &&
      subCategoryId !== undefined &&
      subCategoryId !== ''
   ) {
      query.sub_category_id = subCategoryId
   }

   const lastCategoryId = ad?.last_category_id ?? ad?.last_category?.id ?? null
   if (
      lastCategoryId !== null &&
      lastCategoryId !== undefined &&
      lastCategoryId !== ''
   ) {
      query.last_category_id = lastCategoryId
   }

   const condition = resolveCarsDraftConditionQueryValue(ad)
   if (condition) {
      query.condition = condition
   }

   return query
}

