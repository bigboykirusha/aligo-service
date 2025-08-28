<template>
   <div class="photo-uploader">
      <div class="photo-uploader__photos">
         <!-- Загруженное фото -->
         <div v-if="photo" class="photo-uploader__photo">
            <img :src="getImageUrl(photo)" alt="uploaded photo" />
            <button @click="removePhoto" class="photo-uploader__remove-btn">
               <img src="@/assets/icons/close-white.svg" alt="Remove photo" />
            </button>
         </div>

         <!-- Скелетон -->
         <div v-if="isUploading" class="photo-uploader__photo photo-uploader__skeleton">
            <div class="skeleton"></div>
         </div>

         <!-- Кнопка добавления -->
         <div v-if="!photo && !isUploading" class="photo-uploader__add-btn" @click="triggerFileInput">
            <input type="file" ref="fileInput" @change="onPhotoSelected" />
            <span>
               <img src="@/assets/icons/photo-add.svg" alt="Add photo" />
            </span>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';


const emit = defineEmits(['updatePhoto']);

const fileInput = ref(null);
const photo = ref(null);
const isUploading = ref(false);

const triggerFileInput = () => {
   if (fileInput.value) {
      fileInput.value.click();
   }
};

const onPhotoSelected = (event) => {
   const file = event.target.files?.[0];
   if (!file) return;

   isUploading.value = true;

   // Мок-загрузка
   setTimeout(() => {
      photo.value = {
         file,
         preview: URL.createObjectURL(file),
      };
      emit('updatePhoto', photo.value);
      isUploading.value = false;
   }, 1000);

   event.target.value = '';
};

const removePhoto = () => {
   photo.value = null;
   emit('updatePhoto', null);
};

const getImageUrl = (photo) => {
   return photo.preview || URL.createObjectURL(photo.file);
};
</script>

<style scoped lang="scss">
.photo-uploader {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 12px;

   @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
   }

   &__photos {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
   }

   &__photo {
      position: relative;
      cursor: pointer;
      border-radius: 50%;
      overflow: hidden;
      transition: transform 0.2s ease-in-out;

      img {
         width: 65px;
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
      width: 65px;
      height: 65px;
      border-radius: 50%;
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
      top: -6px;
      right: -6px;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      z-index: 10;
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
      width: 65px;
      height: 65px;
      background-color: #eaf7ff;
      cursor: pointer;
      border-radius: 50%;
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