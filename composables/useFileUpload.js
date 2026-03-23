/**
 * File upload helper for chat attachments.
 */

import { ref, onBeforeUnmount } from 'vue'
import { usePopupErrorStore } from '@/store/popupErrorStore'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES_COUNT = 10

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif']
const DOCUMENT_EXTENSIONS = ['odt', 'ods', 'pdf', 'xls', 'xlsx', 'txt', 'doc', 'docx']
const ALLOWED_EXTENSIONS = [...DOCUMENT_EXTENSIONS, ...IMAGE_EXTENSIONS]

const ALLOWED_MIME_TYPES = [
   'application/msword',
   'application/pdf',
   'application/vnd.ms-excel',
   'application/vnd.oasis.opendocument.spreadsheet',
   'application/vnd.oasis.opendocument.text',
   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
   'image/avif',
   'image/heic',
   'image/heic-sequence',
   'image/heif',
   'image/heif-sequence',
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp',
   'text/plain'
]

export const CHAT_FILE_ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')

const getFileExtension = (fileName) => {
   if (!fileName || typeof fileName !== 'string') return ''
   const cleanName = fileName.split('?')[0]
   if (!cleanName.includes('.')) return ''
   return cleanName.split('.').pop().toLowerCase()
}

const isAllowedByMimeType = (file) => {
   const mimeType = String(file?.type || '').toLowerCase()
   if (!mimeType) return false
   return ALLOWED_MIME_TYPES.includes(mimeType)
}

const isAllowedByExtension = (file) =>
   ALLOWED_EXTENSIONS.includes(getFileExtension(file?.name))

export function useFileUpload() {
   const files = ref([])
   const filePreviews = ref(new Map())
   const popupErrorStore = usePopupErrorStore()

   const isImage = (file) => {
      const mimeType = String(file?.type || '').toLowerCase()
      if (mimeType.startsWith('image/')) return true
      return IMAGE_EXTENSIONS.includes(getFileExtension(file?.name))
   }

   const validateFile = (file) => {
      if (file.size > MAX_FILE_SIZE) {
         popupErrorStore.showError(
            `File "${file.name}" is too large. Maximum size is 10 MB.`
         )
         return { valid: false, error: 'size' }
      }

      if (!isAllowedByMimeType(file) && !isAllowedByExtension(file)) {
         popupErrorStore.showError(
            `File "${file.name}" has an unsupported format. Allowed: ODT, ODS, PDF, XLS, XLSX, TXT, DOC, DOCX, JPG, PNG, JPEG, WEBP, AVIF, HEIC, HEIF.`
         )
         return { valid: false, error: 'type' }
      }

      return { valid: true }
   }

   const validateFilesCount = (newFilesCount) => {
      if (files.value.length + newFilesCount > MAX_FILES_COUNT) {
         popupErrorStore.showError(
            `You can attach up to ${MAX_FILES_COUNT} files.`
         )
         return false
      }
      return true
   }

   const addFiles = (newFiles) => {
      if (!newFiles || newFiles.length === 0) return

      const fileArray = Array.isArray(newFiles)
         ? newFiles
         : Array.from(newFiles)

      if (!validateFilesCount(fileArray.length)) return

      const validFiles = []

      for (const file of fileArray) {
         const validation = validateFile(file)
         if (!validation.valid) continue

         validFiles.push(file)
         if (isImage(file)) {
            filePreviews.value.set(file, URL.createObjectURL(file))
         }
      }

      files.value = [...files.value, ...validFiles]
   }

   const removeFile = (index) => {
      const file = files.value[index]
      if (file && filePreviews.value.has(file)) {
         URL.revokeObjectURL(filePreviews.value.get(file))
         filePreviews.value.delete(file)
      }
      files.value.splice(index, 1)
   }

   const clearFiles = () => {
      filePreviews.value.forEach((url) => URL.revokeObjectURL(url))
      filePreviews.value.clear()
      files.value = []
   }

   const getFilePreview = (file) => {
      if (filePreviews.value.has(file)) {
         return filePreviews.value.get(file)
      }
      if (!isImage(file)) return null

      const url = URL.createObjectURL(file)
      filePreviews.value.set(file, url)
      return url
   }

   const getFileSize = (file) => {
      if (file.size < 1024) return `${file.size} B`
      if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(1)} KB`
      return `${(file.size / (1024 * 1024)).toFixed(1)} MB`
   }

   const handleFileChange = (event) => {
      const selectedFiles = event.target.files
      if (selectedFiles && selectedFiles.length > 0) {
         addFiles(selectedFiles)
      }
      event.target.value = ''
   }

   onBeforeUnmount(() => {
      clearFiles()
   })

   return {
      files,
      addFiles,
      removeFile,
      clearFiles,
      isImage,
      getFilePreview,
      getFileSize,
      handleFileChange,
      validateFile
   }
}
