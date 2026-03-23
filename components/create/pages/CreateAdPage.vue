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
         :confirm-disabled="!isAnyFieldFilled"
         :confirm-loading="isSaving"
         :cancel-disabled="isSaving"
         @confirm="saveAd"
         @cancel="closePopup"
         @close="closePopup"
      />
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
   isAnyFieldFilled,
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
</style>
