import { describe, expect, it } from 'vitest'

import {
   CHAT_SORT_OPTIONS,
   CHAT_UI_TEXT,
   formatChatListDate,
   getOwnChatMessageChecksCount,
   getOwnChatMessageStatus,
   resolveChatAdUrl
} from '../services/chat/chatPresentation'

describe('chatPresentation', () => {
   it('formats chat list date in compact russian format', () => {
      expect(formatChatListDate('2026-03-12 10:45:00')).toBe('12 мар 10:45')
   })

   it('builds read status with two checks for read messages', () => {
      expect(
         getOwnChatMessageStatus({
            isSelf: true,
            read_at: '2026-03-12 11:00:00'
         })
      ).toBe('read')
      expect(
         getOwnChatMessageChecksCount({
            isSelf: true,
            read_at: '2026-03-12 11:00:00'
         })
      ).toBe(2)
   })

   it('builds single-check status for delivered self messages', () => {
      expect(getOwnChatMessageStatus({ isSelf: true, read_at: null })).toBe('sent')
      expect(getOwnChatMessageChecksCount({ isSelf: true, read_at: null })).toBe(1)
   })

   it('resolves chat ad urls by main category when backend url is missing', () => {
      expect(
         resolveChatAdUrl(
            {
               ads_id: 1004,
               main_category_id: 2
            },
            'moskva'
         )
      ).toBe('/moskva/moto/ads-1004')
   })

   it('exposes stable ui text and sort options for chat screens', () => {
      expect(CHAT_UI_TEXT.messages).toBe('Сообщения')
      expect(CHAT_SORT_OPTIONS.map((option) => option.value)).toEqual([
         '0',
         '1',
         '2',
         '3'
      ])
   })
})
