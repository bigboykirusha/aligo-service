export const CITY_EXCLUDED_PATHS = [
   '/profile',
   '/user',
   '/report',
   '/authorization',
   '/avtohistory',
   '/business',
   '/create',
   '/wip',
   '/transaction',
   '/_nuxt'
]

export const CITY_RESERVED_ROOT_SEGMENTS = [
   'ads',
   'api',
   'authorization',
   'auto',
   'avtohistory',
   'business',
   'car',
   'create',
   'main',
   'moto',
   'parts',
   'profile',
   'report',
   'search',
   'transaction',
   'user',
   'wip'
]

export const isCityPathExcluded = (path) =>
   CITY_EXCLUDED_PATHS.some((prefix) => path.startsWith(prefix)) ||
   path.includes('.')

export const isReservedRootSegment = (segment) =>
   CITY_RESERVED_ROOT_SEGMENTS.includes(String(segment || '').toLowerCase())
