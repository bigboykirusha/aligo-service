import { describe, expect, it } from 'vitest'
import {
   isAffirmativeOptionByValue,
   isUsedOptionByValue,
   titlesMatch
} from '../composables/create/parts/optionsPredicates'

describe('create parts options predicates', () => {
   it('resolves affirmative option by title and id fallback', () => {
      expect(
         isAffirmativeOptionByValue(1, [{ id: 1, title: 'Да' }])
      ).toBe(true)
      expect(
         isAffirmativeOptionByValue(2, [{ id: 2, title: 'Нет' }])
      ).toBe(false)

      expect(isAffirmativeOptionByValue(1, [])).toBe(true)
      expect(isAffirmativeOptionByValue(0, [])).toBe(false)
   })

   it('resolves used-condition option by title and id fallback', () => {
      expect(
         isUsedOptionByValue(2, [{ id: 2, title: 'Б/у' }])
      ).toBe(true)
      expect(
         isUsedOptionByValue(1, [{ id: 1, title: 'Новый' }])
      ).toBe(false)

      expect(isUsedOptionByValue(2, [])).toBe(true)
      expect(isUsedOptionByValue(1, [])).toBe(false)
   })

   it('compares titles by normalized text', () => {
      expect(titlesMatch('  Бренд А  ', 'бренд а')).toBe(true)
      expect(titlesMatch('Brand A', 'brand a')).toBe(true)
      expect(titlesMatch('Brand A', 'Brand B')).toBe(false)
   })
})
