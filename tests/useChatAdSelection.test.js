import { describe, expect, it } from 'vitest'

import { applySelectedAdToChat } from '../composables/useChatAdSelection'

describe('useChatAdSelection', () => {
   it('preserves selected ad main category id', () => {
      expect(
         applySelectedAdToChat(
            {
               for_user: { id: 10 },
               from_user: { id: 20 },
               main_category_id: 1
            },
            {
               id: 1004,
               main_category_id: 2,
               title: 'Moto ad'
            }
         )
      ).toMatchObject({
         ads_id: 1004,
         main_category_id: 2
      })
   })
})
