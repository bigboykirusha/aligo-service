import { defineStore } from 'pinia'
import { getSiteDocuments } from '@/services/apiClient'

const normalizeDocuments = (payload) => {
   if (Array.isArray(payload)) return payload
   if (Array.isArray(payload?.data)) return payload.data
   return []
}

export const useDocumentsStore = defineStore('documents', {
   state: () => ({
      documents: [],
      isLoading: false,
      isLoaded: false
   }),
   getters: {
      documentByTitle: (state) => (title) => {
         const normalizedTitle = String(title || '').trim()
         if (!normalizedTitle) return null

         return (
            state.documents.find((document) => {
               const documentTitle = String(
                  document?.title || document?.name || ''
               ).trim()

               return documentTitle === normalizedTitle
            }) || null
         )
      }
   },
   actions: {
      async fetchDocuments({ force = false } = {}) {
         if (this.isLoading) return this.documents
         if (this.isLoaded && !force) return this.documents

         this.isLoading = true

         try {
            const response = await getSiteDocuments()
            this.documents = normalizeDocuments(response)
            this.isLoaded = true
            return this.documents
         } catch (error) {
            console.error('documents load error:', error)
            this.documents = []
            return this.documents
         } finally {
            this.isLoading = false
         }
      }
   }
})
