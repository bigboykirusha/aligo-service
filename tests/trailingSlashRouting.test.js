import { describe, expect, it } from 'vitest'

import {
   buildTrailingSlashPath,
   hasFileExtensionSegment,
   shouldSkipTrailingSlashRedirect
} from '../services/routing/trailingSlash'

describe('trailingSlash routing helpers', () => {
   it('skips redirects for routes that must stay untouched', () => {
      expect(shouldSkipTrailingSlashRedirect('/')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/moskva')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/moskva/moto/ads-123')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/favicon.ico')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/_nuxt/app.js')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/api/location/ip')).toBe(true)
      expect(shouldSkipTrailingSlashRedirect('/profile/')).toBe(true)
   })

   it('detects file-like last segments', () => {
      expect(hasFileExtensionSegment('/robots.txt')).toBe(true)
      expect(hasFileExtensionSegment('/moskva/auto')).toBe(false)
   })

   it('builds canonical path with trailing slash for regular pages', () => {
      expect(buildTrailingSlashPath('/profile')).toBe('/profile/')
      expect(buildTrailingSlashPath('/moskva/auto')).toBe('/moskva/auto/')
      expect(buildTrailingSlashPath('/moskva/auto/')).toBe('/moskva/auto/')
   })
})
