import { describe, expect, it } from 'vitest'

import {
   formatWalletDate,
   formatWalletDateTime,
   groupWalletTransactionsByDate,
   normalizeWalletTransaction
} from '../services/wallet/formatters'

describe('wallet formatters', () => {
   it('formats invalid dates to fallback label', () => {
      expect(formatWalletDate('')).toBe('Неизвестно')
      expect(formatWalletDateTime('not-a-date')).toBe('Неизвестно')
   })

   it('normalizes ruble debit transaction', () => {
      const transaction = normalizeWalletTransaction({
         id: 101,
         title: 'Покупка услуги',
         payment: 300,
         is_plus: 0,
         currency: 'RUB',
         detail: JSON.stringify({
            result: {
               Status: 'CONFIRMED'
            }
         }),
         created_at: '2026-03-20 10:15:00'
      })

      expect(transaction).toMatchObject({
         id: 101,
         title: 'Покупка услуги',
         amount: -300,
         currency: '₽',
         isPlus: false,
         status: 'CONFIRMED',
         canDownload: true
      })
      expect(transaction.amountLabel).toBe('300 ₽')
      expect(transaction.dateLabel).not.toBe('Неизвестно')
      expect(transaction.dateTimeLabel).not.toBe('Неизвестно')
   })

   it('normalizes bonus credit transaction', () => {
      const transaction = normalizeWalletTransaction({
         id: 202,
         description: 'Начисление бонусов',
         amount: 50,
         is_plus: 1,
         currency_name: 'bonus',
         created_at: '2026-03-20 11:00:00'
      })

      expect(transaction).toMatchObject({
         id: 202,
         title: 'Начисление бонусов',
         amount: 50,
         currency: 'Б',
         isPlus: true,
         canDownload: false
      })
      expect(transaction.amountLabel).toBe('50 Б')
   })

   it('groups transactions by normalized date label', () => {
      const first = normalizeWalletTransaction({
         id: 1,
         amount: 10,
         is_plus: 1,
         created_at: '2026-03-20 08:00:00'
      })
      const second = normalizeWalletTransaction({
         id: 2,
         amount: 20,
         is_plus: 1,
         created_at: '2026-03-20 12:00:00'
      })
      const third = normalizeWalletTransaction({
         id: 3,
         amount: 30,
         is_plus: 1,
         created_at: '2026-03-21 09:00:00'
      })

      const groups = groupWalletTransactionsByDate([first, second, third])

      expect(Object.keys(groups)).toHaveLength(2)
      expect(groups[first.dateLabel]).toHaveLength(2)
      expect(groups[third.dateLabel]).toHaveLength(1)
   })
})
