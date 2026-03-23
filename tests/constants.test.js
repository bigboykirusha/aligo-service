import { describe, it, expect } from 'vitest'
import {
   PAGE_SIZE,
   FRESH_ADS_COUNT,
   DEFAULT_CITY
} from '../utils/constants'

describe('Constants', () => {
   it('should have correct PAGE_SIZE', () => {
      expect(PAGE_SIZE).toBe(16)
   })

   it('should have correct FRESH_ADS_COUNT', () => {
      expect(FRESH_ADS_COUNT).toBe(5)
   })

   it('should have correct DEFAULT_CITY', () => {
      expect(DEFAULT_CITY).toEqual({ name: 'Москва', translit: 'moskva' })
   })
})
