const ROOT_PATH = '/'
const CANONICAL_ROOT_ALIASES = new Set(['/moskva'])

export const hasFileExtensionSegment = (path = ROOT_PATH) => {
   const lastSegment = String(path).split('/').pop() || ''
   return lastSegment.includes('.')
}

export const shouldSkipTrailingSlashRedirect = (path = ROOT_PATH) => {
   const normalizedPath = String(path || ROOT_PATH)

   if (normalizedPath === ROOT_PATH) return true
   if (CANONICAL_ROOT_ALIASES.has(normalizedPath)) return true
   if (normalizedPath.includes('/ads-')) return true
   if (normalizedPath.endsWith('/')) return true
   if (hasFileExtensionSegment(normalizedPath)) return true
   if (normalizedPath.startsWith('/_')) return true
   if (normalizedPath.startsWith('/api')) return true

   return false
}

export const buildTrailingSlashPath = (path = ROOT_PATH) =>
   shouldSkipTrailingSlashRedirect(path) ? String(path || ROOT_PATH) : `${path}/`
