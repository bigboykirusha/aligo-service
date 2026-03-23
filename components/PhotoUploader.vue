<template>
   <div class="photo-uploader">
      <div class="photo-uploader__label">
         <label>{{ label }}</label>
         <div v-if="helperText" class="photo-uploader__helper">{{ helperText }}</div>
      </div>
      <div class="photo-uploader__photos">
         <div v-for="(photo, index) in localPhotos" :key="photo.id || `photo-${index}`" class="photo-uploader__photo">
            <img :src="buildPhotoUrl(photo)" alt="Uploaded photo" loading="lazy">
            <button
type="button" class="photo-uploader__remove-btn" aria-label="Remove photo"
               @click="removePhoto(index, photo)">
               <img src="@/assets/icons/close-white.svg" alt="">
            </button>
         </div>

         <div
v-for="uploading in uploadingPhotos" :key="uploading.id"
            class="photo-uploader__photo photo-uploader__skeleton" aria-hidden="true">
            <div class="skeleton" />
         </div>

         <button
v-if="canAddMore" type="button" class="photo-uploader__add-btn" aria-label="Add photos"
            @click="triggerFileInput">
            <input ref="fileInput" type="file" multiple :accept="acceptTypes" @change="onPhotoSelected">
            <span>
               <img src="@/assets/icons/photo-add.svg" alt="">
            </span>
         </button>
      </div>
   </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCreateStore } from '@/store/create'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { getImageUrl as resolveImageUrl } from '~/services/imageUtils'

const props = defineProps({
   label: {
      type: String,
      default: 'Photos (up to 10)'
   },
   helperText: {
      type: String,
      default: ''
   },
   maxPhotos: {
      type: Number,
      default: 10
   },
   photos: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['updatePhotos'])
const createStore = useCreateStore()
const popupErrorStore = usePopupErrorStore()

const localPhotos = ref([])
const uploadingPhotos = ref([])
const fileInput = ref(null)
const uploadSeq = ref(0)

const maxFileSizeMB = 20
const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024
const allowedFileTypes = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/gif',
   'image/webp',
   'image/avif',
   'image/heic',
   'image/heif'
]
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.heif']
const acceptTypes = [...allowedFileTypes, ...allowedExtensions].join(',')

const objectUrlCache = new WeakMap()
const activeObjectUrls = new Set()

const totalPhotos = computed(
   () => localPhotos.value.length + uploadingPhotos.value.length
)
const availableSlots = computed(() =>
   Math.max(0, Number(props.maxPhotos || 0) - totalPhotos.value)
)
const canAddMore = computed(() => availableSlots.value > 0)

const normalizePhotos = (photos) =>
   Array.isArray(photos) ? [...photos] : []

watch(
   () => props.photos,
   (newPhotos) => {
      localPhotos.value = normalizePhotos(newPhotos)
   }
)

const resetFileInput = () => {
   if (fileInput.value) {
      fileInput.value.value = ''
   }
}

const hasAllowedExtension = (file) => {
   const name = String(file?.name || '').toLowerCase()
   return allowedExtensions.some((ext) => name.endsWith(ext))
}

const validateFile = (file) => {
   const hasAllowedType =
      allowedFileTypes.includes(file.type) ||
      (!file.type && hasAllowedExtension(file))

   if (!hasAllowedType) {
      popupErrorStore.showError(
         'Allowed formats: JPEG, JPG, PNG, GIF, WEBP, AVIF, HEIF, HEIC.'
      )
      return false
   }

   if (file.size > maxFileSizeBytes) {
      popupErrorStore.showError(`File must be smaller than ${maxFileSizeMB} MB.`)
      return false
   }

   return true
}

const getObjectUrl = (file) => {
   if (!file || typeof URL === 'undefined') return ''

   const cached = objectUrlCache.get(file)
   if (cached) return cached

   const objectUrl = URL.createObjectURL(file)
   objectUrlCache.set(file, objectUrl)
   activeObjectUrls.add(objectUrl)
   return objectUrl
}

const buildPhotoUrl = (photo) => {
   const previewPath = photo?.arr_title_size?.preview
   if (previewPath) {
      return resolveImageUrl(previewPath, '')
   }

   if (photo?.file instanceof Blob) {
      return getObjectUrl(photo.file)
   }

   if (typeof photo?.path === 'string' && photo.path.length > 0) {
      return resolveImageUrl(photo.path, '')
   }

   return ''
}

const emitUpdatedPhotos = () => {
   emit('updatePhotos', [...localPhotos.value])
}

const onPhotoSelected = async (event) => {
   const selected = Array.from(event?.target?.files || [])

   if (!selected.length) {
      resetFileInput()
      return
   }

   if (!canAddMore.value) {
      popupErrorStore.showError('Maximum number of photos reached.')
      resetFileInput()
      return
   }

   const filesToProcess = selected.slice(0, availableSlots.value)
   if (selected.length > filesToProcess.length) {
      popupErrorStore.showError(`Only ${availableSlots.value} more photo(s) allowed.`)
   }

   const uniqueCandidates = []
   const fingerprints = new Set()

   for (const file of filesToProcess) {
      const fingerprint = `${file.name}|${file.size}|${file.lastModified}`
      if (fingerprints.has(fingerprint)) continue
      fingerprints.add(fingerprint)
      if (validateFile(file)) {
         uniqueCandidates.push(file)
      }
   }

   for (const file of uniqueCandidates) {
      uploadSeq.value += 1

      const uploadId = `upload-${Date.now()}-${uploadSeq.value}`
      uploadingPhotos.value.push({ id: uploadId })

      try {
         const response = await createStore.autoSaveField('photos', file)
         const uploadedPhotos = Array.isArray(response?.photos)
            ? response.photos
            : []
         const uploaded = uploadedPhotos[uploadedPhotos.length - 1]

         if (!uploaded?.id) {
            popupErrorStore.showError('Upload failed. Please try again.')
            continue
         }

         const alreadyExists = localPhotos.value.some((item) => item.id === uploaded.id)
         if (alreadyExists) continue

         localPhotos.value.push({
            id: uploaded.id,
            arr_title_size: {
               preview: uploaded.arr_title_size?.preview || ''
            },
            is_file: 0
         })
         emitUpdatedPhotos()
      } catch {
         popupErrorStore.showError('Upload failed. Please try again.')
      } finally {
         uploadingPhotos.value = uploadingPhotos.value.filter((item) => item.id !== uploadId)
      }
   }

   resetFileInput()
}

const removePhoto = async (index, photo) => {
   if (index < 0 || index >= localPhotos.value.length) return

   try {
      if (photo?.is_file === 0 && photo?.id) {
         await createStore.autoSaveField('ids_delete_photos', photo.id)
      }

      localPhotos.value.splice(index, 1)
      emitUpdatedPhotos()
   } catch {
      popupErrorStore.showError('Could not remove photo. Please try again.')
   }
}

const triggerFileInput = () => {
   if (!canAddMore.value || !fileInput.value) return
   fileInput.value.click()
}

onMounted(() => {
   localPhotos.value = normalizePhotos(props.photos)
})

onUnmounted(() => {
   for (const url of activeObjectUrls) {
      URL.revokeObjectURL(url)
   }
   activeObjectUrls.clear()
})
</script>

<style lang="scss" scoped>
.photo-uploader {
   --thumb-width: 85px;
   --thumb-height: 65px;

   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
   }

   &__label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 14px;
      font-weight: 400;
      color: #323232;
      min-width: 270px;
   }

   label {
      font-size: 14px;
      font-weight: 400;
      color: #323232;
   }

   &__helper {
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      max-width: 210px;
      color: #323232;
   }

   &__photos {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
   }

   &__photo {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      transform: translateZ(0);
      transition:
         transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
         box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1);

      img {
         width: var(--thumb-width);
         height: var(--thumb-height);
         object-fit: cover;
         border-radius: 8px;
         aspect-ratio: 4 / 3;
         display: block;
      }

      @media (hover: hover) {
         &:hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
         }
      }
   }

   &__skeleton {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--thumb-width);
      height: var(--thumb-height);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      background: #f3f6fa;
      border: 1px solid #e5ebf3;

      .skeleton {
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg,
               rgba(255, 255, 255, 0) 0%,
               rgba(255, 255, 255, 0.6) 48%,
               rgba(255, 255, 255, 0) 100%);
         transform: translateX(-100%);
         animation: shimmer 1.1s linear infinite;
      }
   }

   @keyframes shimmer {
      to {
         transform: translateX(100%);
      }
   }

   &__remove-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(17, 17, 17, 0.52);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: none;
      border-radius: 999px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition:
         background-color 200ms ease,
         transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;

      img {
         width: 12px;
         height: 12px;
      }

      @media (hover: hover) {
         &:hover {
            background: rgba(216, 46, 46, 0.85);
         }
      }

      &:active {
         transform: scale(0.92);
      }
   }

   &__add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--thumb-width);
      height: var(--thumb-height);
      background: #D6EFFF;
      border-radius: 6px;
      border: none;
      position: relative;
      cursor: pointer;
      transition:
         transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
         background-color 260ms ease,
         border-color 260ms ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;

      @media (hover: hover) {
         &:hover {
            background: #dbf0ff;
            border-color: #67b7ff;
            transform: translateY(-1px);
         }
      }

      &:active {
         transform: scale(0.97);
      }

      input[type='file'] {
         position: absolute;
         opacity: 0;
         width: 0;
         height: 0;
         pointer-events: none;
      }

      span {
         display: flex;
         align-items: center;
         justify-content: center;

         img {
            width: 24px;
            height: 24px;
         }
      }
   }
}
</style>
