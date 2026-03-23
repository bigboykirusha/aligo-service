import { describe, expect, it } from 'vitest'

import { resolveWalletTopUpSubmission } from '../services/wallet/topUpFlow'

describe('wallet top-up flow helpers', () => {
   it('returns error state for missing response', () => {
      expect(
         resolveWalletTopUpSubmission(null, {
            errorMessage: 'Не удалось создать пополнение.'
         })
      ).toEqual({
         ok: false,
         message: 'Не удалось создать пополнение.',
         link: ''
      })
   })

   it('returns error state for unsuccessful response', () => {
      expect(
         resolveWalletTopUpSubmission(
            {
               success: false,
               message: 'Сервис оплаты недоступен.'
            },
            {
               errorMessage: 'Не удалось создать пополнение.'
            }
         )
      ).toEqual({
         ok: false,
         message: 'Сервис оплаты недоступен.',
         link: ''
      })
   })

   it('returns success state and trims payment link', () => {
      expect(
         resolveWalletTopUpSubmission(
            {
               success: true,
               message: 'Переходите к оплате.',
               link: ' https://pay.example/top-up '
            },
            {
               successMessage: 'Ссылка на оплату пополнения создана.'
            }
         )
      ).toEqual({
         ok: true,
         message: 'Переходите к оплате.',
         link: 'https://pay.example/top-up'
      })
   })

   it('falls back to success copy when message is missing', () => {
      expect(
         resolveWalletTopUpSubmission(
            {
               success: true
            },
            {
               successMessage: 'Ссылка на оплату пополнения создана.'
            }
         )
      ).toEqual({
         ok: true,
         message: 'Ссылка на оплату пополнения создана.',
         link: ''
      })
   })
})
