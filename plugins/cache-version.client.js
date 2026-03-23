import { defineNuxtPlugin } from '#app'

const VERSION_KEY = 'cacheVersion'
const CACHE_VERSION = '1.5.0'

const MIGRATION_ORDER = ['1.5.0']

const MIGRATIONS = {
   '1.5.0': () => {
      const keysToRemove = ['regions', 'footerDocuments']

      for (const key of keysToRemove) {
         localStorage.removeItem(key)
      }
   }
}

function compareVersions(a, b) {
   const left = String(a).split('.').map((part) => Number(part) || 0)
   const right = String(b).split('.').map((part) => Number(part) || 0)
   const maxLength = Math.max(left.length, right.length)

   for (let i = 0; i < maxLength; i += 1) {
      const l = left[i] ?? 0
      const r = right[i] ?? 0
      if (l > r) return 1
      if (l < r) return -1
   }

   return 0
}

export default defineNuxtPlugin(() => {
   try {
      const storedVersion = localStorage.getItem(VERSION_KEY)

      if (!storedVersion) {
         localStorage.setItem(VERSION_KEY, CACHE_VERSION)
         return
      }

      for (const version of MIGRATION_ORDER) {
         if (compareVersions(storedVersion, version) < 0) {
            MIGRATIONS[version]?.()
         }
      }

      if (storedVersion !== CACHE_VERSION) {
         localStorage.setItem(VERSION_KEY, CACHE_VERSION)
      }
   } catch (error) {
      console.warn('[cache-version] migration failed:', error)
   }
})
