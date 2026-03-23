import { describe, expect, it } from 'vitest'

import { buildReportPaymentPayload } from '../services/report/presentation'

describe('report payment payload', () => {
   it('includes main category id from ad context', () => {
      expect(
         buildReportPaymentPayload({
            ad: {
               id: 1004,
               main_category_id: 2
            }
         })
      ).toMatchObject({
         id: 1004,
         mainCategoryId: 2
      })
   })
})
