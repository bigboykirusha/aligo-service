import { describe, expect, it } from 'vitest'

import {
   collectUnreadIncomingMessageIds,
   extractRealtimeChatMessages,
   getChatMessageServerId,
   isSameConversationForChat
} from '../services/chat/chatRealtime'

describe('chatRealtime', () => {
   it('extracts a single read receipt message from websocket payload', () => {
      expect(
         extractRealtimeChatMessages({
            show_message: {
               id: 421,
               from_user_id: 10,
               for_user_id: 20,
               read_at: '2026-03-12 03:20:00'
            }
         })
      ).toEqual([
         {
            id: 421,
            from_user_id: 10,
            for_user_id: 20,
            read_at: '2026-03-12 03:20:00'
         }
      ])
   })

   it('extracts new chat message from store_message payload', () => {
      expect(
         extractRealtimeChatMessages({
            new_message: {
               id: 422,
               ads_id: 1004,
               main_category_id: 2
            }
         })
      ).toEqual([
         {
            id: 422,
            ads_id: 1004,
            main_category_id: 2
         }
      ])
   })

   it('matches messages to the current conversation by chat context and users', () => {
      expect(
         isSameConversationForChat(
            {
               ads_id: 1004,
               main_category_id: 2,
               from_user_id: 10,
               for_user_id: 20
            },
            {
               id: 422,
               ads_id: 1004,
               main_category_id: 2,
               from_user_id: 20,
               for_user_id: 10
            }
         )
      ).toBe(true)
   })

   it('collects only unread incoming message ids for mark_as_read_define_messages', () => {
      expect(
         collectUnreadIncomingMessageIds(
            [
               {
                  id: 1,
                  from_user_id: 20,
                  for_user_id: 10,
                  read_at: null
               },
               {
                  id: 2,
                  from_user_id: 10,
                  for_user_id: 20,
                  read_at: null
               },
               {
                  id: 3,
                  from_user_id: 20,
                  for_user_id: 10,
                  read_at: '2026-03-12 03:20:00'
               },
               {
                  db_id: 4,
                  from_user_id: 20,
                  for_user_id: 10,
                  read_at: null
               }
            ],
            10
         )
      ).toEqual([1, 4])
   })

   it('prefers db_id as the stable server message id', () => {
      expect(
         getChatMessageServerId({
            id: 'pending-1',
            db_id: 555
         })
      ).toBe(555)
   })
})
