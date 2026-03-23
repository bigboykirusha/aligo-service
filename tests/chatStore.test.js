import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChatStore } from '../store/chatStore'

vi.mock('~/services/chat/chatPresentation', () => ({
   resolveChatAdInfo: vi.fn(() => 'Test ad')
}))

describe('chatStore', () => {
   beforeEach(() => {
      setActivePinia(createPinia())
   })

   it('keeps current messages when the same chat arrives with another peer-id shape', () => {
      const store = useChatStore()

      store.setCurrentChat({
         ads_id: 1004,
         main_category_id: 2,
         for_user_id: 20
      })
      store.setMessages([{ id: 1, message: 'hello' }])

      store.setCurrentChat({
         ads_id: '1004',
         main_category_id: '2',
         for_user: { id: 20 }
      })

      expect(store.messages).toEqual([{ id: 1, message: 'hello' }])
      expect(store.messagesLoaded).toBe(false)
      expect(store.currentChat?.ads_info).toBeDefined()
   })
})
