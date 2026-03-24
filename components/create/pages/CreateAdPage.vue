<template>
   <div class="container">
      <Suspense>
         <CreateAdWizard
            v-if="!isLoading"
            class="create-layout__wizard"
            :is-publishing="isPublishing"
            :is-saving="isSaving"
            @send-ad="handleSendAd"
            @save-ad="saveAd"
         />

         <template #fallback>
            <div class="loading">Загружаем форму...</div>
         </template>
      </Suspense>

      <PopupDialog
         v-if="isSavePopupOpen"
         title="Объявление будет сохранено в черновики?"
         confirm-text="Сохранить"
         cancel-text="Отменить"
         :confirm-disabled="!hasUnsavedChanges"
         :confirm-loading="isSaving"
         :cancel-disabled="isSaving"
         @confirm="saveAd"
         @cancel="closePopup"
         @close="closePopup"
      >
         <template #body>
            <div class="save-popup-body">
               <p class="save-popup-body__text">Вы изменили поля:</p>
               <ul
                  v-if="changedFieldLabels.length"
                  class="save-popup-body__list"
               >
                  <li
                     v-for="label in changedFieldLabels"
                     :key="label"
                     class="save-popup-body__item"
                  >
                     {{ label }}
                  </li>
               </ul>
               <p v-else class="save-popup-body__text">
                  Измененные поля не определены.
               </p>
            </div>
         </template>
      </PopupDialog>
   </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import PopupDialog from '~/components/popups/PopupDialog.vue'
import { useCreateAdPageModel } from '@/composables/create/useCreateAdPageModel'

const CreateAdWizard = defineAsyncComponent(
   () => import('~/components/create/wizard/CreateAdWizard.vue')
)

const {
   isPublishing,
   isSaving,
   isLoading,
   hasUnsavedChanges,
   changedFieldLabels,
   isSavePopupOpen,
   handleSendAd,
   saveAd,
   closePopup
} = useCreateAdPageModel()
</script>

<style scoped lang="scss">
.container {
   flex: 1;
   height: 100%;
   max-width: 1312px;
   width: 100%;
   padding: 16px;
   margin: 0 auto;
}

.create-layout {
   width: 100%;
}

.create-layout__wizard {
   width: 100%;
   min-width: 0;
}

.loading {
   padding: 24px 0;
   font-size: 14px;
   line-height: 18px;
   color: #787878;
}

.save-popup-body {
   display: flex;
   flex-direction: column;
   gap: 10px;
}

.save-popup-body__text {
   margin: 0;
   font-size: 14px;
   line-height: 20px;
   color: var(--color-text-primary);
}

.save-popup-body__list {
   margin: 0;
   padding-left: 18px;
   font-size: 14px;
   line-height: 20px;
   color: var(--color-text-secondary);
}

.save-popup-body__item {
   margin: 0;
}
</style>
