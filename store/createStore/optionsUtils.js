const hasOptionValue = (value) =>
   value !== null && value !== undefined && value !== ''

const OPTION_SOURCE_CONTAINER_KEYS = Object.freeze([
   'data',
   'items',
   'list',
   'results',
   'options',
   'rows'
])

const OPTION_SOURCE_META_KEYS = new Set([
   'success',
   'message',
   'status',
   'error',
   'errors',
   'meta',
   'seo',
   'pagination'
])

const isPlainObject = (value) =>
   Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const pickNestedOptionId = (value, fallback = null) => {
   if (!hasOptionValue(value)) return fallback
   if (typeof value !== 'object') return value

   const nestedId = [value.id, value.value, value.key].find(hasOptionValue)
   return hasOptionValue(nestedId) ? nestedId : fallback
}

const pickNestedOptionTitle = (value, fallback = null) => {
   if (!hasOptionValue(value)) return fallback
   if (typeof value !== 'object') return value

   const nestedTitle = [
      value.title,
      value.name,
      value.label,
      value.value,
      value.brand,
      value.manufacturer,
      value.model
   ].find(hasOptionValue)
   return hasOptionValue(nestedTitle) ? nestedTitle : fallback
}

const mapObjectToOptionList = (source) => {
   if (!isPlainObject(source)) return []

   return Object.entries(source)
      .filter(([key]) => !OPTION_SOURCE_META_KEYS.has(key))
      .map(([key, value]) => {
         if (Array.isArray(value)) return null

         if (isPlainObject(value)) {
            const id = pickNestedOptionId(value, key)
            const title = pickNestedOptionTitle(value, key)
            if (!hasOptionValue(id) || !hasOptionValue(title)) return null
            return { ...value, id, title }
         }

         if (typeof value === 'string' || typeof value === 'number') {
            return { id: key, title: String(value) }
         }

         return null
      })
      .filter(Boolean)
}

const resolveOptionSourceList = (source) => {
   if (Array.isArray(source)) return source
   if (!isPlainObject(source)) return []

   for (const key of OPTION_SOURCE_CONTAINER_KEYS) {
      const candidate = source[key]
      if (Array.isArray(candidate)) return candidate

      if (isPlainObject(candidate)) {
         for (const nestedKey of OPTION_SOURCE_CONTAINER_KEYS) {
            if (Array.isArray(candidate[nestedKey])) {
               return candidate[nestedKey]
            }
         }

         const mappedCandidate = mapObjectToOptionList(candidate)
         if (mappedCandidate.length) {
            return mappedCandidate
         }
      }
   }

   return mapObjectToOptionList(source)
}

export const normalizeCreateOptions = (
   sourceList,
   {
      idKeys = ['id'],
      titleKeys = ['title', 'name', 'value', 'label'],
      titleFormatter = (value) => String(value)
   } = {}
) => {
   const list = resolveOptionSourceList(sourceList)
   if (!Array.isArray(list)) return []

   return list
      .map((item) => {
         if (typeof item === 'string' || typeof item === 'number') {
            return {
               id: item,
               title: titleFormatter(item)
            }
         }

         const id = idKeys
            .map((key) => pickNestedOptionId(item?.[key]))
            .find(hasOptionValue)
         const rawTitle = titleKeys
            .map((key) => pickNestedOptionTitle(item?.[key]))
            .find(hasOptionValue)

         if (!hasOptionValue(id) || !hasOptionValue(rawTitle)) {
            return null
         }

         return {
            id,
            title: titleFormatter(rawTitle)
         }
      })
      .filter(Boolean)
}

export const buildDescendingYearOptions = ({
   minYear = 1990,
   maxYear = new Date().getFullYear()
} = {}) => {
   if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) return []
   if (maxYear < minYear) return []

   return Array.from({ length: maxYear - minYear + 1 }, (_, index) => {
      const year = maxYear - index
      return { id: year, title: String(year) }
   })
}
