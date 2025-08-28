<template>
   <div class="photo-uploader">
      <label>{{ label }}</label>
      <div class="photo-uploader__photos">
         <div v-for="(photo, index) in localPhotos" :key="photo.id || `photo-${index}`" class="photo-uploader__photo">
            <img :src="getImageUrl(photo)" alt="uploaded photo" />
            <button @click="removePhoto(index, photo)" class="photo-uploader__remove-btn">
               <img src="@/assets/icons/close-white.svg" alt="Remove photo" />
            </button>
         </div>

         <div v-for="(photo, index) in uploadingPhotos" :key="`uploading-${index}`"
            class="photo-uploader__photo photo-uploader__skeleton">
            <div class="skeleton"></div>
         </div>

         <div v-if="localPhotos.length + uploadingPhotos.length < maxPhotos" class="photo-uploader__add-btn"
            @click="triggerFileInput">
            <input type="file" ref="fileInput" multiple @change="onPhotoSelected" />
            <span>
               <img src="@/assets/icons/photo-add.svg" alt="Add photo" />
            </span>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import { useCreateStore } from '@/store/create';
import { usePopupErrorStore } from '@/store/popupErrorStore';

const props = defineProps({
   label: {
      type: String,
      default: 'Фотографии* до 10 шт',
   },
   maxPhotos: {
      type: Number,
      default: 10,
   },
   photos: {
      type: Array,
      default: () => [],
   },
});

const emit = defineEmits(['updatePhotos']);
const localPhotos = ref([...props.photos]);
const uploadingPhotos = ref([]);
const baseUrl = 'https://api.aligo.ru';
const createStore = useCreateStore();
const popupErrorStore = usePopupErrorStore();
const fileInput = ref(null);

const maxFileSizeMB = 20;
const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

const allowedFileTypes = [
   'image/jpeg',
   'image/jpg',
   'image/png',
   'image/webp',
   'image/heic',
   'image/heif',
];

watch(
   () => props.photos,
   (newPhotos) => {
      localPhotos.value = newPhotos;
   }
);

const onPhotoSelected = async (event) => {
   const files = event.target.files;
   if (!files || files.length === 0) return;

   const validFiles = Array.from(files).filter((file) => {
      if (!allowedFileTypes.includes(file.type)) {
         popupErrorStore.showError('Вы можете загрузить только изображения формата JPEG, JPG, PNG, WEBP, HEIC, HEIF');
         return false;
      }
      if (file.size > maxFileSizeBytes) {
         popupErrorStore.showError(`Ошибка: размер файла не должен превышать ${maxFileSizeMB} МБ.`);
         return false;
      }
      return true;
   });

   if (validFiles.length === 0) return;

   for (const file of validFiles) {
      const skeleton = { id: `skeleton-${Date.now()}`, isUploading: true };
      uploadingPhotos.value.push(skeleton);

      try {
         const response = await createStore.autoSaveField('photos', file);
         if (response?.photos?.length) {
            const lastPhoto = response.photos[response.photos.length - 1];

            uploadingPhotos.value = uploadingPhotos.value.filter((p) => p.id !== skeleton.id);

            localPhotos.value.push({
               id: lastPhoto.id,
               arr_title_size: {
                  preview: lastPhoto.arr_title_size.preview,
               },
               is_file: 0,
            });
            emit('updatePhotos', localPhotos.value);
         }
      } catch (error) {
         popupErrorStore.showError('Ошибка загрузки фото');
         uploadingPhotos.value = uploadingPhotos.value.filter((p) => p.id !== skeleton.id);
      }
   }

   event.target.value = '';
};

const removePhoto = async (index, photo) => {
   if (photo.is_file === 0 && photo.id) {
      try {
         await createStore.autoSaveField('ids_delete_photos', photo.id);
         localPhotos.value.splice(index, 1);
         emit('updatePhotos', localPhotos.value);
      } catch (error) {
         console.error('Ошибка удаления фото:', error);
      }
   } else {
      localPhotos.value.splice(index, 1);
      emit('updatePhotos', localPhotos.value);
   }
};

const triggerFileInput = () => {
   if (fileInput.value) {
      fileInput.value.click();
   }
};

const getImageUrl = (photo) => {
   return photo.is_file === 0 ? `${baseUrl}/${photo.arr_title_size?.preview}` : URL.createObjectURL(photo.file);
};

onMounted(() => {
   localPhotos.value = [...props.photos];
});
</script>

<style lang="scss" scoped>
.photo-uploader {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   row-gap: 12px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
   }

   label {
      font-size: 14px;
      font-weight: 500;
      color: #323232;
      min-width: 270px;
   }

   &__photos {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
   }

   &__photo {
      position: relative;
      cursor: pointer;
      border-radius: 6px;
      overflow: hidden;
      transition: transform 0.2s ease-in-out;

      img {
         width: 85px;
         height: 65px;
         object-fit: cover;
         border-radius: 6px;
         aspect-ratio: 4/3;
         transition: transform 0.3s ease-in-out;
      }

      &:hover {
         transform: scale(1.05);
      }
   }

   &__skeleton {
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 85px;
      height: 65px;
      border-radius: 6px;
      position: relative;
      overflow: hidden;

      .skeleton {
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
         background-size: 200% 100%;
         animation: loading 1.5s infinite;
      }
   }

   @keyframes loading {
      from {
         background-position: 200% 0;
      }

      to {
         background-position: -200% 0;
      }
   }

   &__remove-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s ease-in-out, transform 0.2s ease;

      img {
         width: 12px;
         height: 12px;
      }

      &:hover {
         background-color: rgba(255, 0, 0, 0.85);
         transform: scale(1.1);
      }
   }

   &__add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 85px;
      height: 65px;
      background-color: #eaf7ff;
      cursor: pointer;
      border-radius: 6px;
      position: relative;
      transition: background-color 0.3s ease, transform 0.3s ease-in-out;
      border: 1px dashed #8bcaff;

      &:hover {
         background-color: #d4efff;
         transform: scale(1.02);
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
         flex-direction: column;
         align-items: center;
         font-size: 12px;
         color: #333;

         img {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
         }
      }
   }
}
</style>