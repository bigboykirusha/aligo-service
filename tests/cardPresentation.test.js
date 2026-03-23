import { describe, expect, it } from 'vitest'

import {
   buildCardBadges,
   buildCardTitle,
   CARD_UI_TEXT,
   formatCardPhone,
   formatCardUsername,
   normalizeCardUrl
} from '../services/cards/cardPresentation'

describe('cardPresentation', () => {
   it('builds card title without placeholder values', () => {
      expect(
         buildCardTitle({
            displayTitle: '',
            brand: 'Achilles',
            model: '2233',
            year: '2005'
         })
      ).toBe('Achilles 2233, 2005')

      expect(
         buildCardTitle({
            displayTitle: '',
            brand: 'Addinol',
            model: CARD_UI_TEXT.notSpecified,
            year: ''
         })
      ).toBe('Addinol')
   })

   it('normalizes card usernames and urls', () => {
      expect(formatCardUsername(' owner ')).toBe('Owner')
      expect(formatCardUsername('')).toBe(CARD_UI_TEXT.user)
      expect(normalizeCardUrl('https://aligo.ru/moskva/parts/ads-1/')).toBe(
         '/moskva/parts/ads-1/'
      )
   })

   it('builds visible badge list and formats phone', () => {
      expect(
         buildCardBadges({
            isCreditBadge: true,
            isOwnerBadge: true
         }).map((badge) => badge.text)
      ).toEqual([CARD_UI_TEXT.creditBadge, CARD_UI_TEXT.ownerBadge])

      expect(formatCardPhone('79991234567')).toBe('+7 (999) 123-45-67')
   })
})
