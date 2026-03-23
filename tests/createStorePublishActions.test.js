import { describe, expect, it, vi } from 'vitest'
import {
   sendCreateStoreAd,
   updateCreateStoreAd
} from '../store/createStore/publishActions'

describe('create store publish actions', () => {
   it('sends create request and returns response', async () => {
      const formData = new FormData()
      const response = { success: true, id: 10 }
      const sendCreateAdRequest = vi.fn(async () => response)

      await expect(
         sendCreateStoreAd({
            formData,
            createAdRequest: vi.fn(),
            sendCreateAdRequest
         })
      ).resolves.toEqual(response)

      expect(sendCreateAdRequest).toHaveBeenCalledTimes(1)
      expect(sendCreateAdRequest).toHaveBeenCalledWith({
         formData,
         createAdRequest: expect.any(Function)
      })
   })

   it('logs and rethrows create request error', async () => {
      const formData = new FormData()
      const error = new Error('create failed')
      const sendCreateAdRequest = vi.fn(async () => {
         throw error
      })
      const onError = vi.fn()

      await expect(
         sendCreateStoreAd({
            formData,
            createAdRequest: vi.fn(),
            sendCreateAdRequest,
            onError
         })
      ).rejects.toThrow('create failed')

      expect(onError).toHaveBeenCalledWith(
         'Create advertisement request failed:',
         error
      )
   })

   it('updates request and returns response', async () => {
      const id = 77
      const formData = new FormData()
      const response = { success: true }
      const updateCreateAdRequest = vi.fn(async () => response)

      await expect(
         updateCreateStoreAd({
            id,
            formData,
            updateAdRequest: vi.fn(),
            updateCreateAdRequest
         })
      ).resolves.toEqual(response)

      expect(updateCreateAdRequest).toHaveBeenCalledTimes(1)
      expect(updateCreateAdRequest).toHaveBeenCalledWith({
         id,
         formData,
         updateAdRequest: expect.any(Function)
      })
   })

   it('logs and rethrows update request error', async () => {
      const error = new Error('update failed')
      const updateCreateAdRequest = vi.fn(async () => {
         throw error
      })
      const onError = vi.fn()

      await expect(
         updateCreateStoreAd({
            id: 10,
            formData: new FormData(),
            updateAdRequest: vi.fn(),
            updateCreateAdRequest,
            onError
         })
      ).rejects.toThrow('update failed')

      expect(onError).toHaveBeenCalledWith(
         'Update advertisement request failed:',
         error
      )
   })
})
