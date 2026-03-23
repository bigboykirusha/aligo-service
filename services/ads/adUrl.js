import { getPartsCatalogRootCategories } from '../../composables/parts/domain/partsCatalogRegistry'

const CYRILLIC_TO_LATIN = Object.freeze({
   а: 'a',
   б: 'b',
   в: 'v',
   г: 'g',
   д: 'd',
   е: 'e',
   ё: 'e',
   ж: 'zh',
   з: 'z',
   и: 'i',
   й: 'i',
   к: 'k',
   л: 'l',
   м: 'm',
   н: 'n',
   о: 'o',
   п: 'p',
   р: 'r',
   с: 's',
   т: 't',
   у: 'u',
   ф: 'f',
   х: 'h',
   ц: 'c',
   ч: 'ch',
   ш: 'sh',
   щ: 'sch',
   ъ: '',
   ы: 'y',
   ь: '',
   э: 'e',
   ю: 'yu',
   я: 'ya'
})

const isRecord = (value) =>
   value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeText = (value) => {
   if (typeof value === 'number') return String(value)
   if (typeof value !== 'string') return ''
   return value.trim()
}

const transliterate = (value) =>
   String(value || '')
      .split('')
      .map((char) => {
         const lower = char.toLowerCase()
         const mapped = CYRILLIC_TO_LATIN[lower]
         if (mapped === undefined) return lower
         return mapped
      })
      .join('')

export const slugifyAdSegment = (value) => {
   const transliterated = transliterate(value)
   return transliterated
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-')
}

const resolveCitySegment = (ad, explicitCity = '') => {
   const city = ad?.ads_parameter?.city || ad?.city

   const fromCityTranslit = slugifyAdSegment(city?.translit || (typeof city === 'string' ? city : ''))
   if (fromCityTranslit) return fromCityTranslit

   const fromCityTitle = slugifyAdSegment(city?.title || city?.name)
   if (fromCityTitle) return fromCityTitle

   const fromArg = slugifyAdSegment(explicitCity)
   if (fromArg) return fromArg

   return ''
}

const resolveAdIdentifier = (ad) => {
   const uniqueCode = normalizeText(ad?.unique_code)
   if (uniqueCode) return uniqueCode

   const id = normalizeText(ad?.id)
   if (id) return id

   return ''
}

const resolveMainCategoryId = (ad) =>
   Number(ad?.main_category_id ?? ad?.main_category?.id) || 0

const normalizeTitleKey = (value) =>
   normalizeText(value)
      .toLowerCase()
      .replace(/ё/g, 'е')

const findPartsNodeByTitles = ({
   subCategoryTitle = '',
   lastCategoryTitle = '',
   nestedCategoryTitle = ''
}) => {
   const roots = getPartsCatalogRootCategories()
   const normalizedSub = normalizeTitleKey(subCategoryTitle)
   const normalizedLast = normalizeTitleKey(lastCategoryTitle)
   const normalizedNested = normalizeTitleKey(nestedCategoryTitle)

   const walk = (nodes, trail = []) => {
      for (const node of Array.isArray(nodes) ? nodes : []) {
         const nextTrail = [...trail, node]
         const nodeTitle = normalizeTitleKey(node?.title)
         const nodeChildren = Array.isArray(node?.children) ? node.children : []

         if (
            normalizedSub &&
            normalizedLast &&
            normalizedNested &&
            nextTrail.length >= 3 &&
            normalizeTitleKey(nextTrail[0]?.title) === normalizedSub &&
            normalizeTitleKey(nextTrail[1]?.title) === normalizedLast &&
            nodeTitle === normalizedNested
         ) {
            return node
         }

         if (
            normalizedSub &&
            normalizedLast &&
            !normalizedNested &&
            nextTrail.length >= 2 &&
            normalizeTitleKey(nextTrail[0]?.title) === normalizedSub &&
            nodeTitle === normalizedLast
         ) {
            return node
         }

         const nestedMatch = walk(nodeChildren, nextTrail)
         if (nestedMatch) return nestedMatch
      }

      return null
   }

   return walk(roots)
}

const AUTOGOODS_DISK_TYPE_SEGMENT_BY_ID = Object.freeze({
   1: 'forged',
   2: 'alloy',
   3: 'stamped',
   4: 'spoked',
   5: 'composite'
})

const AUTOGOODS_MOTO_TIRE_AXLE_SEGMENT_BY_ID = Object.freeze({
   1: 'front',
   2: 'rear'
})

const resolveAutogoodsCategoryTrailByIds = (ad) => {
   const subCategoryId = Number(ad?.sub_category?.id ?? ad?.sub_category_id)
   const lastCategoryId = Number(ad?.last_category?.id ?? ad?.last_category_id)

   if (subCategoryId === 1 && lastCategoryId === 1) {
      return ['tires-disks-wheels', 'passenger-tires']
   }

   if (subCategoryId === 1 && lastCategoryId === 2) {
      const diskTypeId = Number(
         ad?.entity?.type_disk?.id ??
         ad?.entity?.type_disk_id ??
         ad?.type_disk_id
      )
      const diskTypeSegment = AUTOGOODS_DISK_TYPE_SEGMENT_BY_ID[diskTypeId]

      return diskTypeSegment
         ? ['tires-disks-wheels', 'disks', diskTypeSegment]
         : ['tires-disks-wheels', 'disks']
   }

   if (subCategoryId === 1 && lastCategoryId === 3) {
      return ['tires-disks-wheels', 'wheels']
   }

   if (subCategoryId === 1 && lastCategoryId === 5) {
      const axleId = Number(
         ad?.entity?.axle?.id ??
         ad?.entity?.axle_id ??
         ad?.axle_id
      )
      const axleSegment = AUTOGOODS_MOTO_TIRE_AXLE_SEGMENT_BY_ID[axleId]

      return axleSegment
         ? ['tires-disks-wheels', 'moto-tires', axleSegment]
         : ['tires-disks-wheels', 'moto-tires']
   }

   if (subCategoryId === 10 && lastCategoryId === 7) {
      return ['oils-and-chemistry', 'motor-oils']
   }

   return []
}

const resolveAutogoodsCategoryTrail = (ad) => {
   const trailByIds = resolveAutogoodsCategoryTrailByIds(ad)
   if (trailByIds.length) return trailByIds

   const subCategoryTitle = ad?.sub_category?.title
   const lastCategoryTitle = ad?.last_category?.title
   const nestedCategoryTitle =
      ad?.entity?.type_disk?.title ||
      ad?.entity?.axle?.title

   const matchedNode = findPartsNodeByTitles({
      subCategoryTitle,
      lastCategoryTitle,
      nestedCategoryTitle
   })

   return Array.isArray(matchedNode?.trail) ? matchedNode.trail : []
}

const resolveAutoPath = (ad, citySegment) => {
   const spec = Array.isArray(ad?.auto_technical_specifications)
      ? ad.auto_technical_specifications[0]
      : {}
   const conditionId = Number(
      ad?.condition_id ??
      ad?.condition?.id ??
      ad?.auto_history_conditions?.[0]?.condition?.id ??
      ad?.auto_history_conditions?.[0]?.state?.id
   )
   const conditionSegment = conditionId === 1 ? 'type-new' : 'type-used'
   const brand = slugifyAdSegment(spec?.brand?.title)
   const model = slugifyAdSegment(spec?.model?.title)
   const identifier = resolveAdIdentifier(ad)

   if (!identifier) return ''

   const segments = [citySegment, 'auto', conditionSegment]
   if (brand) segments.push(`brand-${brand}`)
   if (model) segments.push(`model-${model}`)
   segments.push(`ads-${identifier}`)
   return `/${segments.filter(Boolean).join('/')}`
}

const resolveMotoSubCategorySegment = (ad) => {
   const subCategoryId = Number(ad?.sub_category_id ?? ad?.sub_category?.id)
   if (subCategoryId === 1) return 'motorcycles'
   if (subCategoryId === 2) return 'scooters'

   const title = normalizeText(ad?.sub_category?.title).toLowerCase()
   if (title.includes('мотоцикл')) return 'motorcycles'
   if (title.includes('мопед') || title.includes('скутер')) return 'scooters'
   return ''
}

const resolveMotoPath = (ad, citySegment) => {
   const brand = slugifyAdSegment(ad?.production?.brand?.title)
   const model = slugifyAdSegment(ad?.production?.model?.title)
   const category = resolveMotoSubCategorySegment(ad)
   const identifier = resolveAdIdentifier(ad)

   if (!identifier) return ''

   const segments = [citySegment, 'moto']
   if (category) segments.push(category)
   if (brand) segments.push(`brand-${brand}`)
   if (model) segments.push(`model-${model}`)
   segments.push(`ads-${identifier}`)
   return `/${segments.filter(Boolean).join('/')}`
}

const resolveAutogoodsPath = (ad, citySegment) => {
   const identifier = resolveAdIdentifier(ad)
   if (!identifier) return ''

   const trail = resolveAutogoodsCategoryTrail(ad)
   const brand = slugifyAdSegment(ad?.entity?.brand?.title)
   const model = slugifyAdSegment(ad?.entity?.model?.title)

   const segments = [citySegment, 'parts', ...trail]
   if (brand) segments.push(`brand-${brand}`)
   if (model) segments.push(`model-${model}`)
   segments.push(`ads-${identifier}`)
   return `/${segments.filter(Boolean).join('/')}`
}

export const buildAdPath = (ad, options = {}) => {
   const normalizedAd = isRecord(ad) ? ad : {}
   const citySegment = resolveCitySegment(normalizedAd, options.city)
   const mainCategoryId = resolveMainCategoryId(normalizedAd)

   if (mainCategoryId === 1) return resolveAutoPath(normalizedAd, citySegment)
   if (mainCategoryId === 2) return resolveMotoPath(normalizedAd, citySegment)
   if (mainCategoryId === 3) return resolveAutogoodsPath(normalizedAd, citySegment)

   return ''
}

export const normalizeAdUrl = (url, ad, options = {}) => {
   const normalizedUrl = normalizeText(url)
   if (normalizedUrl) {
      try {
         const rawPath = normalizedUrl.startsWith('http')
            ? new URL(normalizedUrl).pathname
            : normalizedUrl
         const hasTrailingSlash = rawPath.length > 1 && /\/+$/.test(rawPath)
         const path = rawPath.replace(/\/+$/, '')
         const normalizedPath = path
            ? path.startsWith('/')
               ? path
               : `/${path}`
            : '/'
         const finalPath =
            hasTrailingSlash && normalizedPath !== '/'
               ? `${normalizedPath}/`
               : normalizedPath

         if (ad && !finalPath.includes('/ads-')) {
            const fallbackPath = buildAdPath(ad, options)
            if (fallbackPath) return fallbackPath
         }

         if (ad && finalPath.includes('/ads-')) {
            const expectedCity = resolveCitySegment(ad, options.city)
            if (expectedCity) {
               const firstSegment =
                  finalPath.split('/').filter(Boolean)[0] || ''
               if (firstSegment && firstSegment !== expectedCity) {
                  const fallbackPath = buildAdPath(ad, options)
                  if (fallbackPath) return fallbackPath
               }
            }
         }

         return finalPath
      } catch {
         const hasTrailingSlash =
            normalizedUrl.length > 1 && /\/+$/.test(normalizedUrl)
         const path = normalizedUrl.replace(/\/+$/, '')
         const normalizedPath = path.startsWith('/') ? path : `/${path}`

         return hasTrailingSlash && normalizedPath !== '/'
            ? `${normalizedPath}/`
            : normalizedPath
      }
   }

   return buildAdPath(ad, options)
}
