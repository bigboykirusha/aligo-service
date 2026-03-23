import { normalizeAdUrl } from '../services/ads/adUrl'

const BADGE_DIVISORS = {
   isBordered: 6,
   isCreditBadge: 3,
   isNoAccidentBadge: 4,
   isOwnerBadge: 5
}

const UNKNOWN_VALUE = 'Not specified'
const UNKNOWN_YEAR = 'Year not specified'
const UNTITLED_VALUE = 'Untitled'

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeAd = (ad) => {
   const source = isRecord(ad) ? ad : {}
   const payload = isRecord(source.ads_show) ? source.ads_show : source
   const resolvedUserId =
      payload?.user_id ??
      source?.user_id ??
      payload?.id_user_owner_ads ??
      source?.id_user_owner_ads ??
      payload?.user?.id ??
      source?.user?.id

   return {
      ...source,
      ...payload,
      id: payload?.id ?? source?.id,
      user_id: resolvedUserId,
      photos: Array.isArray(payload?.photos)
         ? payload.photos
         : Array.isArray(source?.photos)
            ? source.photos
            : []
   }
}

const normalizeText = (value, fallback) => {
   if (typeof value === 'string' && value.trim()) return value
   return fallback
}

const normalizeScalarText = (value, fallback) => {
   if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
   }
   return normalizeText(value, fallback)
}

const resolveAutoSpec = (ad) => {
   const spec = Array.isArray(ad?.auto_technical_specifications)
      ? ad.auto_technical_specifications[0]
      : null

   return {
      brand: normalizeText(spec?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(spec?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(spec?.year_release?.title, UNKNOWN_YEAR)
   }
}

const resolveAutogoodsEntitySpec = (ad) => {
   const entity =
      ad?.entity && typeof ad.entity === 'object' && !Array.isArray(ad.entity)
         ? ad.entity
         : {}

   return {
      brand: normalizeText(entity?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(entity?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(entity?.year?.title ?? entity?.year, UNKNOWN_YEAR),
      type: ''
   }
}

const resolveMotoProductionSpec = (ad) => {
   const production =
      ad?.production &&
      typeof ad.production === 'object' &&
      !Array.isArray(ad.production)
         ? ad.production
         : {}

   return {
      brand: normalizeText(production?.brand?.title, UNKNOWN_VALUE),
      model: normalizeText(production?.model?.title, UNKNOWN_VALUE),
      year: normalizeScalarText(ad?.year?.title ?? ad?.year, UNKNOWN_YEAR),
      type: normalizeText(production?.type?.title, ''),
      categoryLabel: ''
   }
}

const resolveCardSpec = (ad) => {
   const autoSpec = resolveAutoSpec(ad)
   if (
      autoSpec.brand !== UNKNOWN_VALUE ||
      autoSpec.model !== UNKNOWN_VALUE ||
      autoSpec.year !== UNKNOWN_YEAR
   ) {
      return autoSpec
   }

   const autogoodsSpec = resolveAutogoodsEntitySpec(ad)
   if (
      autogoodsSpec.brand !== UNKNOWN_VALUE ||
      autogoodsSpec.model !== UNKNOWN_VALUE ||
      autogoodsSpec.year !== UNKNOWN_YEAR
   ) {
      return autogoodsSpec
   }

   return resolveMotoProductionSpec(ad)
}

const sanitizeSpecValue = (value) =>
   value === UNKNOWN_VALUE || value === UNKNOWN_YEAR ? '' : value

const buildDisplayTitle = ({ brand, model, year, type }) => {
   const safeBrand = sanitizeSpecValue(brand)
   const safeModel = sanitizeSpecValue(model)
   const safeYear = sanitizeSpecValue(year)
   const parts = [safeBrand, safeModel].filter(Boolean)
   const safeType = sanitizeSpecValue(type)

   if (safeType && !parts.includes(safeType)) {
      parts.push(safeType)
   }

   const brandModel = parts.join(' ')

   if (brandModel && safeYear) return `${brandModel}, ${safeYear}`
   if (brandModel) return brandModel
   if (safeYear) return safeYear
   return UNTITLED_VALUE
}

const buildBadgeFlags = (ad) => {
   const mainCategoryId = Number(
      ad?.main_category_id ?? ad?.main_category?.id ?? 0
   )

   if (mainCategoryId === 3) {
      return {
         isBordered: false,
         isCreditBadge: false,
         isNoAccidentBadge: false,
         isOwnerBadge: false,
         showPublishedDate: true
      }
   }

   const backendFlags = ad?.badge_flags

   if (backendFlags && typeof backendFlags === 'object') {
      return {
         isBordered: Boolean(backendFlags.isBordered),
         isCreditBadge: Boolean(backendFlags.isCreditBadge),
         isNoAccidentBadge: Boolean(backendFlags.isNoAccidentBadge),
         isOwnerBadge: Boolean(backendFlags.isOwnerBadge),
         showPublishedDate: backendFlags.showPublishedDate !== false
      }
   }

   // Temporary deterministic placeholders until backend starts sending badge flags.
   const seed = Math.abs(Number(ad?.id) || 0)

   return {
      isBordered: seed > 0 && seed % BADGE_DIVISORS.isBordered === 0,
      isCreditBadge: seed > 0 && seed % BADGE_DIVISORS.isCreditBadge === 0,
      isNoAccidentBadge: seed > 0 && seed % BADGE_DIVISORS.isNoAccidentBadge === 0,
      isOwnerBadge: seed > 0 && seed % BADGE_DIVISORS.isOwnerBadge === 0,
      showPublishedDate: true
   }
}

export const mapAdToCardProps = (ad, options = {}) => {
   const normalizedAd = normalizeAd(ad)
   const spec = resolveCardSpec(normalizedAd)
   const adsParameter = normalizedAd?.ads_parameter || {}
   const brand = sanitizeSpecValue(spec.brand)
   const model = sanitizeSpecValue(spec.model)
   const year = sanitizeSpecValue(spec.year)

   return {
      id: normalizedAd?.id,
      description: normalizeText(adsParameter.ads_description, 'No description'),
      price: adsParameter.amount ?? null,
      place: normalizeText(
         adsParameter.place_inspection || adsParameter.city?.title,
         'Address not specified'
      ),
      brand,
      model,
      year,
      displayTitle: buildDisplayTitle({
         brand,
         model,
         year,
         type: spec.type
      }),
      username: normalizeText(
         adsParameter.username ||
            adsParameter.login ||
            normalizedAd?.user?.username ||
            normalizedAd?.user?.login,
         'User'
      ),
      horizontal: Boolean(options.horizontal),
      images: Array.isArray(normalizedAd?.photos) ? normalizedAd.photos : [],
      datePublishedString: normalizeText(normalizedAd?.date_published_string, ''),
      userId: normalizedAd?.user_id ?? null,
      mainCategoryId:
         normalizedAd?.main_category_id ?? normalizedAd?.main_category?.id ?? 1,
      url: normalizeAdUrl(normalizedAd?.url, normalizedAd),
      badgeFlags: buildBadgeFlags(normalizedAd)
   }
}
