import { normalizeAdUrl } from '../ads/adUrl'

const UNKNOWN_VALUE = 'Не указано'
const UNKNOWN_USER = 'Имя не указано'
const UNKNOWN_ADDRESS = 'Адрес не указан'

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const toNumber = (value, fallback = 0) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : fallback
}

const toNullableNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const toPositiveNullableNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) && normalized > 0 ? normalized : null
}

const normalizeText = (value, fallback = '') => {
   if (typeof value !== 'string') return fallback
   const normalized = value.trim()
   return normalized || fallback
}

const normalizeScalarText = (value, fallback = '') => {
   if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
   }
   return normalizeText(value, fallback)
}

const normalizeArray = (value) => (Array.isArray(value) ? value : [])
const safeSpecValue = (value) => (value === UNKNOWN_VALUE ? '' : value)

const buildAdTitleFromSpec = ({
   brand = '',
   model = '',
   year = '',
   type = ''
} = {}) => {
   const parts = [normalizeText(brand, ''), normalizeText(model, '')].filter(Boolean)

   const normalizedType = normalizeText(type, '')
   if (normalizedType && !parts.includes(normalizedType)) {
      parts.push(normalizedType)
   }

   const title = parts.join(' ')
   const normalizedYear = normalizeText(year, '')

   if (title && normalizedYear) return `${title}, ${normalizedYear}`
   if (title) return title
   if (normalizedYear) return normalizedYear
   return 'Без названия'
}

const resolveAutoSpec = (ad) => {
   const spec = Array.isArray(ad?.auto_technical_specifications)
      ? ad.auto_technical_specifications[0]
      : null

   return {
      brand: normalizeText(spec?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(spec?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(spec?.year_release?.title, UNKNOWN_VALUE),
      type: '',
      categoryLabel: ''
   }
}

const resolveAutogoodsEntitySpec = (ad) => {
   const entity = isRecord(ad?.entity) ? ad.entity : {}

   return {
      brand: normalizeText(entity?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(entity?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(entity?.year?.title ?? entity?.year, UNKNOWN_VALUE),
      type: '',
      categoryLabel: ''
   }
}

const resolveMotoProductionSpec = (ad) => {
   const production = isRecord(ad?.production) ? ad.production : {}

   return {
      brand: normalizeText(production?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(production?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(ad?.year?.title ?? ad?.year, UNKNOWN_VALUE),
      type: normalizeText(production?.type?.title, ''),
      categoryLabel: ''
   }
}

const resolvePublicationSpec = (ad) => {
   const autoSpec = resolveAutoSpec(ad)
   const hasAutoSpecData =
      autoSpec.brand !== UNKNOWN_VALUE ||
      autoSpec.model !== UNKNOWN_VALUE ||
      autoSpec.year !== UNKNOWN_VALUE

   if (hasAutoSpecData) {
      return autoSpec
   }

   const autogoodsSpec = resolveAutogoodsEntitySpec(ad)
   const hasAutogoodsSpecData =
      autogoodsSpec.brand !== UNKNOWN_VALUE ||
      autogoodsSpec.model !== UNKNOWN_VALUE ||
      autogoodsSpec.year !== UNKNOWN_VALUE ||
      Boolean(autogoodsSpec.categoryLabel)

   if (hasAutogoodsSpecData) {
      return autogoodsSpec
   }

   return resolveMotoProductionSpec(ad)
}

export const normalizeProfileAdRecord = (
   item,
   { useSourceIdAsMainId = false } = {}
) => {
   const source = isRecord(item) ? item : {}
   const payload = isRecord(source.ads_show) ? source.ads_show : source
   const merged = { ...source, ...payload }

   const resolvedId = toNumber(merged?.id ?? payload?.id ?? source?.id, 0)
   const sourceId = toNumber(source?.id, 0)
   const resolvedMainId = useSourceIdAsMainId
      ? sourceId || toNumber(merged?.main_id, 0)
      : toNumber(merged?.main_id, 0)

   return {
      ...merged,
      id: resolvedId,
      main_id: resolvedMainId || null,
      url: normalizeAdUrl(merged?.url, merged),
      ads_model: normalizeText(
         merged?.ads_model || payload?.ads_model || source?.ads_model,
         ''
      ),
      user_id: toNullableNumber(
         merged?.user_id ??
            payload?.user_id ??
            source?.user_id ??
            merged?.user?.id
      ),
      id_user_owner_ads: toNullableNumber(
         merged?.id_user_owner_ads ??
            payload?.id_user_owner_ads ??
            source?.id_user_owner_ads ??
            merged?.id_user_owner_ads ??
            merged?.user_id ??
            merged?.user?.id
      ),
      ads_parameter: isRecord(merged?.ads_parameter) ? merged.ads_parameter : {},
      auto_technical_specifications: normalizeArray(
         merged?.auto_technical_specifications
      ),
      photos: normalizeArray(merged?.photos),
      statistic_view: isRecord(merged?.statistic_view) ? merged.statistic_view : {},
      main_category_id: toNullableNumber(
         merged?.main_category_id ?? merged?.main_category?.id
      ),
      sub_category_id: toNullableNumber(
         merged?.sub_category_id ?? merged?.sub_category?.id
      ),
      last_category_id: toNullableNumber(
         merged?.last_category_id ?? merged?.last_category?.id
      ),
      is_cancelled: toNumber(merged?.is_cancelled, 0),
      is_closed: toNumber(merged?.is_closed, 0),
      is_in_archive: toNumber(merged?.is_in_archive, 0),
      is_published: toNumber(merged?.is_published, 0),
      is_moderation: toNumber(merged?.is_moderation, 0),
      is_not_confirmed_email: toNumber(merged?.is_not_confirmed_email, 0),
      is_in_favorites: toNumber(merged?.is_in_favorites, 0),
      created_at: normalizeText(merged?.created_at, ''),
      date_published_string: normalizeText(merged?.date_published_string, ''),
      delete_after_days: toPositiveNullableNumber(merged?.delete_after_days)
   }
}

export const mapFavoriteAdCardProps = (item) => {
   const ad = normalizeProfileAdRecord(item)
   const adsParameter = ad?.ads_parameter || {}
   const spec = resolvePublicationSpec(ad)

   const brand = safeSpecValue(spec.brand)
   const model = safeSpecValue(spec.model)
   const year = safeSpecValue(spec.year)
   const displayTitle = buildAdTitleFromSpec({
      brand,
      model,
      year,
      type: spec.type
   })

   const username = normalizeText(
      adsParameter?.username ||
         adsParameter?.login ||
         ad?.user?.username ||
         ad?.user?.login,
      UNKNOWN_USER
   )

   return {
      id: toNumber(ad?.id, 0),
      idUserOwnerAds: toNumber(ad?.id_user_owner_ads || ad?.user_id || ad?.user?.id, 0),
      mainCategoryId: toNullableNumber(
         ad?.main_category_id ?? ad?.main_category?.id
      ),
      description: normalizeText(adsParameter?.ads_description, ''),
      price: toNumber(adsParameter?.amount, 0),
      place: normalizeText(
         adsParameter?.place_inspection || adsParameter?.city?.title,
         UNKNOWN_ADDRESS
      ),
      callNumber: normalizeText(
         adsParameter?.phone ||
            adsParameter?.call_number ||
            ad?.phone ||
            ad?.call_number ||
            ad?.user?.phone,
         ''
      ),
      messageEmail: normalizeText(adsParameter?.email, ''),
      brand,
      model,
      year,
      displayTitle,
      username,
      isInFavorites: toNumber(ad?.is_in_favorites, 0),
      images: normalizeArray(ad?.photos),
      isPublished: toNumber(ad?.is_published, 0),
      createdAt: normalizeText(ad?.created_at, ''),
      datePublishedString: normalizeText(ad?.date_published_string, ''),
      url: normalizeAdUrl(ad?.url, ad)
   }
}

export const mapMyPublicationCardProps = (item) => {
   const ad = normalizeProfileAdRecord(item)
   const adsParameter = ad?.ads_parameter || {}
   const spec = resolvePublicationSpec(ad)

   const brand = safeSpecValue(spec.brand)
   const model = safeSpecValue(spec.model)
   const year = safeSpecValue(spec.year)
   const displayTitle = buildAdTitleFromSpec({
      brand,
      model,
      year,
      type: spec.type
   })

   return {
      id: toNumber(ad?.id, 0),
      uniqueCode: normalizeText(ad?.unique_code, ''),
      url: normalizeAdUrl(ad?.url, ad),
      idUserOwnerAds: toNumber(ad?.id_user_owner_ads || ad?.user_id || ad?.user?.id, 0),
      mainCategoryId: toNullableNumber(
         ad?.main_category_id ?? ad?.main_category?.id
      ),
      subCategoryId: toNullableNumber(ad?.sub_category_id ?? ad?.sub_category?.id),
      lastCategoryId: toNullableNumber(
         ad?.last_category_id ?? ad?.last_category?.id
      ),
      images: normalizeArray(ad?.photos),
      description: normalizeText(adsParameter?.ads_description, ''),
      price: toNumber(adsParameter?.amount, 0),
      place: normalizeText(
         adsParameter?.place_inspection || adsParameter?.city?.title,
         UNKNOWN_ADDRESS
      ),
      brand,
      model,
      year,
      displayTitle,
      isPublished: toNumber(ad?.is_published, 0),
      isModeration: toNumber(ad?.is_moderation, 0),
      isCancelled: toNumber(ad?.is_cancelled, 0),
      isClosed: toNumber(ad?.is_closed, 0),
      isInArchive: toNumber(ad?.is_in_archive, 0),
      isNotConfirmedEmail: toNumber(ad?.is_not_confirmed_email, 0),
      countGoAdPage: toNumber(ad?.statistic_view?.count_go_ad_page, 0),
      countAddToFavorite: toNumber(ad?.statistic_view?.count_add_to_favorite, 0),
      countWhoViewSellerContact: toNumber(
         ad?.statistic_view?.count_who_view_seller_contact,
         0
      ),
      mainId: toNumber(ad?.main_id, 0),
      createdAt: normalizeText(ad?.created_at, ''),
      deleteAfterDays: toPositiveNullableNumber(ad?.delete_after_days)
   }
}

export const mapFavoriteSearchCardProps = (search) => {
   return {
      id: toNumber(search?.id, 0),
      title: normalizeText(search?.title, ''),
      url: normalizeText(search?.url, ''),
      city: normalizeText(
         search?.city?.title ?? search?.city_name ?? search?.city_title,
         UNKNOWN_VALUE
      ),
      isEmail: toNumber(search?.is_email, 0),
      isTelegram: toNumber(search?.is_telegram, 0),
      mainCategoryId: toNumber(
         search?.main_category_id ?? search?.main_category?.id,
         12
      ),
      createdAt: normalizeText(search?.created_at, '')
   }
}
