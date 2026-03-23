import { useRuntimeConfig } from '#imports'
import avatarFallback from '~/assets/icons/avatar-revers.svg'

const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:)?\/\//i
const SPECIAL_URL_PATTERN = /^(?:blob:|data:)/i
const INVALID_IMAGE_PATH_PATTERN =
   /^(?:undefined|null|false|\[object Object\]|about:blank)$/i
const IMAGE_EXTENSION_PATTERN =
   /\.(?:avif|gif|heic|heif|jpe?g|png|svg|webp)(?:[?#].*)?$/i
const STORAGE_IMAGE_PATH_PATTERN = /(?:^|\/)(?:storage|images)\//i

const isAbsoluteUrl = (value) =>
   ABSOLUTE_URL_PATTERN.test(value) || SPECIAL_URL_PATTERN.test(value)

const normalizeBaseUrl = (baseUrl) => String(baseUrl || '').replace(/\/+$/, '')

export const isRenderableImagePath = (path) => {
   if (typeof path !== 'string') return false

   const normalizedPath = path.trim()

   if (!normalizedPath || INVALID_IMAGE_PATH_PATTERN.test(normalizedPath)) {
      return false
   }

   if (SPECIAL_URL_PATTERN.test(normalizedPath)) {
      return true
   }

   return (
      IMAGE_EXTENSION_PATTERN.test(normalizedPath) ||
      STORAGE_IMAGE_PATH_PATTERN.test(normalizedPath)
   )
}

export const getImageUrl = (path, defaultAvatar) => {
   if (!path) {
      return defaultAvatar
   }

   if (typeof path !== 'string') {
      return path
   }

   if (!isRenderableImagePath(path)) {
      return defaultAvatar
   }

   if (isAbsoluteUrl(path)) {
      return path
   }

   const config = useRuntimeConfig()
   const baseUrl = normalizeBaseUrl(config.public.apiBaseUrl)

   if (!baseUrl) {
      return path
   }

   if (path.startsWith('/')) {
      return `${baseUrl}${path}`
   }

   return `${baseUrl}/${path}`
}

export const resolveUserAvatarPath = (photo) => {
   if (!photo) return ''
   if (typeof photo === 'string') return photo

   return (
      photo?.arr_title_size?.preview ||
      photo?.arr_title_size?.default ||
      photo?.preview ||
      photo?.path ||
      ''
   )
}

export const getUserAvatarUrl = (photo, fallbackAvatar = avatarFallback) =>
   getImageUrl(resolveUserAvatarPath(photo), fallbackAvatar)

