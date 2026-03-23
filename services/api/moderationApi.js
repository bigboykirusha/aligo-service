import {
   executeApiRequest,
   getApiClient,
   getApiResponseMessage,
   getResponseBody,
   getResponseDataField,
   getResponseTotalCount,
   isApiRequestSuccessful
} from '../apiUtils'
import { getCarById } from './carsApi'

const DEFAULT_ADS_PAGE_SIZE = 20

const toOptionalString = (value) => {
   if (value === null || value === undefined) return ''
   return String(value).trim()
}

const toOptionalNumber = (value) => {
   if (value === null || value === undefined || value === '') return null
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const pickFirstDefined = (...values) =>
   values.find((value) => value !== undefined && value !== null && value !== '')

const ensureArray = (value) => {
   if (Array.isArray(value)) return value
   if (!value || typeof value !== 'object') return []

   const nestedCandidates = [
      value.items,
      value.rows,
      value.results,
      value.list,
      value.users,
      value.ads,
      value.data
   ]

   for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) return candidate
   }

   return []
}

const resolveCollectionPayload = (response) => {
   const body = getResponseBody(response)
   const dataField = getResponseDataField(response)
   const arrayCandidates = [
      dataField,
      body?.items,
      body?.rows,
      body?.results,
      body?.list,
      body?.users,
      body?.ads,
      body
   ]

   for (const candidate of arrayCandidates) {
      if (Array.isArray(candidate)) {
         return {
            items: candidate,
            total:
               getResponseTotalCount(response) ||
               toOptionalNumber(body?.pagination?.total) ||
               toOptionalNumber(body?.meta?.total) ||
               candidate.length
         }
      }
   }

   return {
      items: ensureArray(dataField || body),
      total:
         getResponseTotalCount(response) ||
         toOptionalNumber(body?.pagination?.total) ||
         toOptionalNumber(body?.meta?.total) ||
         0
   }
}

const resolveStatusDescriptor = (source = {}) => {
   const flags = {
      is_deleted: Number(source?.is_deleted) === 1,
      is_draft: Number(source?.is_draft) === 1,
      is_in_archive: Number(source?.is_in_archive) === 1,
      is_published: Number(source?.is_published) === 1,
      is_closed: Number(source?.is_closed) === 1,
      is_moderation: Number(source?.is_moderation) === 1,
      is_cancelled: Number(source?.is_cancelled) === 1,
      is_dismissed_from_publication:
         Number(source?.is_dismissed_from_publication) === 1
   }

   if (flags.is_deleted) return { label: 'Удалено', tone: 'danger', flags }
   if (flags.is_draft) return { label: 'Черновик', tone: 'muted', flags }
   if (flags.is_in_archive) return { label: 'Архив', tone: 'muted', flags }
   if (flags.is_closed) return { label: 'Закрыто', tone: 'neutral', flags }
   if (flags.is_cancelled) return { label: 'Отклонено', tone: 'danger', flags }
   if (flags.is_dismissed_from_publication) {
      return { label: 'Снято с публикации', tone: 'warning', flags }
   }
   if (flags.is_moderation) return { label: 'На модерации', tone: 'info', flags }
   if (flags.is_published) return { label: 'Опубликовано', tone: 'success', flags }

   const textStatus = toOptionalString(
      pickFirstDefined(source?.status, source?.status_name, source?.state)
   )
   if (textStatus) {
      return { label: textStatus, tone: 'neutral', flags }
   }

   return { label: 'Без статуса', tone: 'muted', flags }
}

const normalizeUser = (item, index = 0) => {
   const id = pickFirstDefined(item?.id, item?.user_id, item?.uuid, index + 1)
   const cityLabel = pickFirstDefined(
      item?.city_name,
      item?.city?.name,
      item?.city?.title,
      item?.city_title,
      item?.city_id ? `Город #${item.city_id}` : ''
   )
   const countAds = item?.count_ads || {}
   const countPublished =
      toOptionalNumber(
         pickFirstDefined(countAds?.count_published, item?.count_published)
      ) ?? 0
   const countOffPublished =
      toOptionalNumber(
         pickFirstDefined(
            countAds?.count_off_published,
            item?.count_off_published
         )
      ) ?? 0
   const countInArchive =
      toOptionalNumber(
         pickFirstDefined(countAds?.count_in_archive, item?.count_in_archive)
      ) ?? 0
   const isBlocked = Number(item?.is_blocked) === 1
   const isActive = Number(item?.is_active) === 1

   return {
      id,
      userId: id,
      statusLabel: isBlocked ? 'Заблокирован' : isActive ? 'Активен' : 'Неактивен',
      statusTone: isBlocked ? 'danger' : isActive ? 'success' : 'muted',
      username: toOptionalString(
         pickFirstDefined(item?.username, item?.name, item?.full_name, item?.fio)
      ),
      address: toOptionalString(item?.address),
      login: toOptionalString(item?.login),
      email: toOptionalString(item?.email),
      phone: toOptionalString(item?.phone),
      cityId: toOptionalString(item?.city_id),
      cityLabel: toOptionalString(cityLabel),
      latitude: toOptionalString(item?.latitude),
      longitude: toOptionalString(item?.longitude),
      adsCount: countPublished + countOffPublished + countInArchive,
      adsCountPublished: countPublished,
      adsCountOffPublished: countOffPublished,
      adsCountInArchive: countInArchive,
      createdAt: toOptionalString(
         pickFirstDefined(item?.created_at, item?.createdAt)
      ),
      photo: pickFirstDefined(item?.photo, item?.avatar, item?.image, ''),
      isActive,
      isBlocked,
      city: item?.city || null,
      raw: item
   }
}

const buildAdTitle = (item) => {
   const directTitle = toOptionalString(
      pickFirstDefined(item?.title, item?.name, item?.ads_title)
   )
   if (directTitle) return directTitle

   const nestedBrand = toOptionalString(
      pickFirstDefined(
         item?.auto_technical_specifications?.[0]?.brand?.title,
         item?.auto_technical_specifications?.[0]?.brand_standart?.title
      )
   )
   const nestedModel = toOptionalString(
      pickFirstDefined(
         item?.auto_technical_specifications?.[0]?.model?.title,
         item?.auto_technical_specifications?.[0]?.model_standart?.title
      )
   )
   const nestedYear = toOptionalString(
      pickFirstDefined(
         item?.auto_technical_specifications?.[0]?.year_release?.title,
         item?.year_release?.title
      )
   )
   const nestedTitle = [nestedBrand, nestedModel, nestedYear].filter(Boolean).join(' ')
   if (nestedTitle) return nestedTitle

   const brand = toOptionalString(
      pickFirstDefined(item?.brand, item?.brand_name, item?.mark)
   )
   const model = toOptionalString(
      pickFirstDefined(item?.model, item?.model_name, item?.auto_model)
   )
   const composedTitle = [brand, model].filter(Boolean).join(' ')
   if (composedTitle) return composedTitle

   const autoId = pickFirstDefined(item?.auto_id, item?.id, item?.ads_id)
   return autoId ? `Объявление #${autoId}` : 'Без названия'
}

const normalizeAd = (item, index = 0) => {
   const autoId = pickFirstDefined(item?.auto_id, item?.ads_id, item?.id, index + 1)
   const status = resolveStatusDescriptor(item)
   const userName = toOptionalString(
      pickFirstDefined(
         item?.username,
         item?.user?.username,
         item?.user_name,
         item?.owner_name,
         item?.user?.name
      )
   )

   return {
      autoId,
      id: autoId,
      mainCategoryId: pickFirstDefined(
         item?.main_category_id,
         item?.main_category?.id,
         1
      ),
      title: buildAdTitle(item),
      userId: pickFirstDefined(
         item?.user_id,
         item?.id_user_owner_ads,
         item?.user?.id,
         item?.owner_id,
         ''
      ),
      userName,
      price: pickFirstDefined(
         item?.price,
         item?.amount,
         item?.cost,
         item?.ads_parameter?.amount,
         null
      ),
      cityLabel: toOptionalString(
         pickFirstDefined(
            item?.city_name,
            item?.city?.name,
            item?.ads_parameter?.city?.title,
            item?.ads_parameter?.place_inspection,
            item?.address,
            item?.location
         )
      ),
      createdAt: toOptionalString(
         pickFirstDefined(item?.created_at, item?.createdAt)
      ),
      updatedAt: toOptionalString(
         pickFirstDefined(
            item?.updated_at,
            item?.updatedAt,
            item?.published_at,
            item?.date_published
         )
      ),
      url: toOptionalString(item?.url),
      uniqueCode: toOptionalString(item?.unique_code),
      description: toOptionalString(item?.ads_parameter?.ads_description),
      viewsCount:
         toOptionalNumber(item?.statistic_view?.count_go_ad_page) ?? 0,
      contactsCount:
         toOptionalNumber(item?.statistic_view?.count_who_view_seller_contact) ?? 0,
      historyChangeStatus: Array.isArray(item?.history_change_status)
         ? item.history_change_status
         : [],
      photos: Array.isArray(item?.photos) ? item.photos : [],
      statusLabel: status.label,
      statusTone: status.tone,
      statusFlags: status.flags,
      raw: item
   }
}

const buildModerationAdActionPayload = (payload = {}) => {
   const adsId = pickFirstDefined(
      payload?.ads_id,
      payload?.id,
      payload?.autoId,
      payload?.uniqueCode,
      payload?.unique_code
   )
   const mainCategoryId = pickFirstDefined(
      payload?.main_category_id,
      payload?.mainCategoryId,
      payload?.main_category?.id,
      1
   )

   return {
      ads_id: adsId,
      main_category_id: mainCategoryId
   }
}

const buildAdsParams = (filters = {}) => {
   const params = {
      page: toOptionalNumber(filters.page) ?? 1,
      count: toOptionalNumber(filters.count) ?? DEFAULT_ADS_PAGE_SIZE,
      order_by: toOptionalString(filters.order_by || 'desc') || 'desc'
   }

   const mappedFlags = [
      'user_id',
      'search',
      'is_deleted',
      'is_draft',
      'is_in_archive',
      'is_published',
      'is_closed',
      'is_moderation',
      'is_cancelled',
      'is_dismissed_from_publication'
   ]

   for (const key of mappedFlags) {
      const value = filters[key]
      if (value === true) {
         params[key] = 1
         continue
      }
      if (value === false || value === null || value === undefined || value === '') {
         continue
      }
      params[key] = value
   }

   return params
}

const buildCreateUserFormData = (payload = {}) => {
   if (typeof FormData === 'undefined') {
      throw new Error('FormData is not available in the current runtime.')
   }

   const formData = new FormData()
   const fields = [
      'username',
      'address',
      'email',
      'phone',
      'city_id',
      'latitude',
      'longitude'
   ]

   for (const field of fields) {
      const value = payload[field]
      if (value === null || value === undefined || value === '') continue
      formData.append(field, value)
   }

   const hasBrowserFile =
      typeof File !== 'undefined' && payload.photo instanceof File

   if (hasBrowserFile) {
      formData.append('photo', payload.photo)
   }

   return formData
}

export const getModerationUsers = async () => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            '/moderations/action_with_users/get_all_users'
         )
         const { items } = resolveCollectionPayload(response)
         return items.map(normalizeUser)
      },
      {
         errorMessage: 'Ошибка при загрузке списка пользователей.'
      }
   )
}

export const getModerationUserById = async (userId) => {
   const result = await getModerationUsers()
   if (result?.success === false) return result

   const normalizedUserId = String(userId || '').trim()
   const matchedUser = (Array.isArray(result) ? result : []).find(
      (item) => String(item.userId || item.id) === normalizedUserId
   )

   if (!matchedUser) {
      return {
         success: false,
         message: `Пользователь #${normalizedUserId} не найден.`
      }
   }

   return matchedUser
}

export const createModerationUser = async (payload) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient('apiClientData')
         const response = await apiClient.post(
            '/moderations/action_with_users/add',
            buildCreateUserFormData(payload),
            {
               headers: { 'Content-Type': 'multipart/form-data' }
            }
         )

         return {
            success: isApiRequestSuccessful(getResponseBody(response)),
            message: getApiResponseMessage(
               getResponseBody(response),
               'Пользователь создан.'
            ),
            data: getResponseDataField(response) || getResponseBody(response)
         }
      },
      {
         errorMessage: 'Ошибка при создании пользователя.'
      }
   )
}

export const getModerationAds = async (filters = {}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.get(
            '/moderations/all_ads/get_exists_ads',
            {
               params: buildAdsParams(filters)
            }
         )
         const { items, total } = resolveCollectionPayload(response)
         return {
            items: items.map(normalizeAd),
            total
         }
      },
      {
         errorMessage: 'Ошибка при загрузке объявлений.'
      }
   )
}

export const getModerationAd = async (autoId) => {
   const result = await getCarById(autoId)
   if (!result || result?.success === false) return result
   if (typeof result !== 'object') return null
   return normalizeAd(result)
}

const executeModerationAdAction = async ({
   endpoint,
   payload,
   successMessage
}) => {
   return executeApiRequest(
      async () => {
         const apiClient = getApiClient()
         const response = await apiClient.post(
            endpoint,
            buildModerationAdActionPayload(payload)
         )
         const body = getResponseBody(response)

         return {
            success: isApiRequestSuccessful(body),
            message: getApiResponseMessage(body, successMessage),
            data: getResponseDataField(response) || body
         }
      },
      {
         errorMessage: successMessage
      }
   )
}

export const deleteModerationAd = async (payload = {}) =>
   executeModerationAdAction({
      endpoint: '/moderations/all_ads/delete',
      payload,
      successMessage: 'Не удалось удалить объявление.'
   })

export const archiveModerationAd = async (payload = {}) =>
   executeModerationAdAction({
      endpoint: '/moderations/all_ads/add_to_archive',
      payload,
      successMessage: 'Не удалось архивировать объявление.'
   })

export const publishAgainModerationAd = async (payload = {}) =>
   executeModerationAdAction({
      endpoint: '/moderations/all_ads/publish_again',
      payload,
      successMessage: 'Не удалось повторно опубликовать объявление.'
   })

export const takeOffPublicationModerationAd = async (payload = {}) =>
   executeModerationAdAction({
      endpoint: '/moderations/all_ads/take_off_publication',
      payload,
      successMessage: 'Не удалось снять объявление с публикации.'
   })
