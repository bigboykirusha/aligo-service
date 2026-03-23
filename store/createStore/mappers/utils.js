export const asObject = (value) =>
   value && typeof value === 'object' ? value : {}

export const first = (value) => (Array.isArray(value) ? value[0] || {} : {})

export const coalesce = (...values) => {
   for (const value of values) {
      if (value !== null && value !== undefined) return value
   }
   return null
}

export const normalizeNestedCreateFieldValue = (key, value) => {
   if (value === undefined) return undefined
   if (value === null) return null

   if (Array.isArray(value)) {
      if (!value.length) return null
      if (value.length === 1) {
         return normalizeNestedCreateFieldValue(key, value[0])
      }
      return value
   }

   if (typeof value === 'object') {
      if (key.endsWith('_id') && value.id !== undefined) {
         return value.id
      }
      if (key.endsWith('_count') && value.id !== undefined) {
         return value.id
      }
      if (key.endsWith('_year') && value.id !== undefined) {
         return value.id
      }
      if (key.endsWith('_manufacturer')) {
         if (typeof value.title === 'string' && value.title.trim()) {
            return value.title
         }
         if (typeof value.name === 'string' && value.name.trim()) {
            return value.name
         }
         if (typeof value.brand === 'string' && value.brand.trim()) {
            return value.brand
         }
      }
      return undefined
   }

   return value
}

export const findNestedRawValueByKey = (source, key, visited = new WeakSet()) => {
   if (!source || typeof source !== 'object') return undefined
   if (visited.has(source)) return undefined
   visited.add(source)

   if (Array.isArray(source)) {
      for (const item of source) {
         const nestedValue = findNestedRawValueByKey(item, key, visited)
         if (nestedValue !== undefined) return nestedValue
      }
      return undefined
   }

   if (Object.prototype.hasOwnProperty.call(source, key)) {
      return source[key]
   }

   for (const nestedValue of Object.values(source)) {
      const result = findNestedRawValueByKey(nestedValue, key, visited)
      if (result !== undefined) return result
   }

   return undefined
}

export const findNestedCreateFieldValue = (source, key) => {
   const rawValue = findNestedRawValueByKey(source, key)
   return normalizeNestedCreateFieldValue(key, rawValue)
}
