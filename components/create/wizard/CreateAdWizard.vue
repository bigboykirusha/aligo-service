<template>
   <div class="create-ad-form">
      <div class="create-ad-form__content">
         <div v-if="currentStepComponent" class="create-ad-form__desktop-pane">
            <component :is="currentStepComponent" v-bind="currentStepProps" />
         </div>
         <template v-else>
            <div class="create-ad-form__desktop-pane" />
         </template>
      </div>

      <div class="create-ad-form__actions">
         <div class="create-ad-form__overlay">
            <button
               v-if="currentTab === lastTabIndex"
               class="create-ad-form__button create-ad-form__button--continue"
               :class="{
                  disabled:
                     !canPublishNow && !props.isPublishing && !props.isSaving
               }"
               :disabled="props.isPublishing || props.isSaving"
               @click="publishAndExit"
            >
               <span v-if="props.isPublishing" class="spinner" />
               <span v-else>{{ publishButtonLabel }}</span>
            </button>

            <button
               class="create-ad-form__button create-ad-form__button--save"
               :class="{ disabled: !isSaveAndExitEnabled }"
               :disabled="!isSaveAndExitEnabled"
               @click="saveAndExit"
            >
               <span v-if="props.isSaving" class="spinner" />
               <span v-else>{{ saveButtonLabel }}</span>
            </button>

            <button
               v-if="currentTab !== lastTabIndex"
               class="create-ad-form__button create-ad-form__button--continue"
               @click="continueToNextTab"
            >
               {{ continueButtonLabel }}
            </button>

            <div v-if="currentTab === lastTabIndex" class="create-ad-form__text">
               {{ publishAgreementPrefix }}
               <a
                  v-if="rulesLink"
                  class="checkbox-wrapper--blue"
                  :href="rulesLink"
                  target="_blank"
                  rel="noopener"
               >
                  {{ rulesTitle || publishAgreementLinkLabel }}
               </a>
               <span v-else>{{ publishAgreementLinkLabel }}</span>
               {{ publishAgreementSuffix }}
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCreateAdWizardModel } from '@/composables/create/useCreateAdWizardModel'
import { resolveCreateWizardStepComponent } from '@/components/create/wizard/stepRegistry'
import { CREATE_WIZARD_STEP_AD_DETAILS } from '@/store/createStore/wizardSteps'

defineOptions({
   name: 'CreateAdWizard'
})

const props = defineProps({
   isPublishing: { type: Boolean, default: false },
   isSaving: { type: Boolean, default: false }
})

const emit = defineEmits(['sendAd', 'saveAd'])

const publishButtonLabel = 'Опубликовать'
const saveButtonLabel = 'Сохранить и выйти'
const continueButtonLabel = 'Продолжить'
const publishAgreementPrefix = 'Размещая объявление, вы соглашаетесь с '
const publishAgreementLinkLabel = 'условиями размещения'
const publishAgreementSuffix =
   ' и делаете его доступным неограниченному кругу лиц в интернете'

const {
   rulesLink,
   rulesTitle,
   currentTab,
   lastTabIndex,
   currentStepKey,
   showPhotosOnAdStep,
   canPublishNow,
   isSaveAndExitEnabled,
   publishAndExit,
   saveAndExit,
   continueToNextTab
} = useCreateAdWizardModel({ props, emit })

const currentStepComponent = computed(() =>
   resolveCreateWizardStepComponent(currentStepKey.value)
)

const currentStepProps = computed(() =>
   currentStepKey.value === CREATE_WIZARD_STEP_AD_DETAILS
      ? { showPhotos: showPhotosOnAdStep.value }
      : {}
)
</script>

<style lang="scss" scoped>
.create-ad-form {
   display: flex;
   flex-direction: column;
   width: 100%;
   margin-top: var(--app-header-create-offset-desktop);
   margin-bottom: var(--app-header-create-offset-desktop);

   @media (max-width: 768px) {
      margin-top: var(--app-header-create-offset-mobile);
      margin-bottom: var(--app-header-create-bottom-mobile);
      border: none;
      box-shadow: none;
   }

   &__content {
      width: 100%;
   }

   &__desktop-pane {
      width: 100%;
      margin-bottom: 84px;

      @media (max-width: 768px) {
         margin-bottom: 0;
      }
   }

   &__actions {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 16px calc(24px + env(safe-area-inset-bottom));
      background: #fff;
      backdrop-filter: blur(8px);
      border-radius: 6px 6px 0 0;
      box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.16);

      @media (max-width: 768px) {
         border: none;
      }
   }

   &__overlay {
      display: flex;
      gap: 24px;
      width: 100%;
      max-width: 1280px;
      margin: 0 16px;

      @media (max-width: 768px) {
         flex-wrap: wrap;
         gap: 16px;
         justify-content: center;
         margin: 0;
      }
   }

   &__text {
      max-width: 400px;
      font-size: 12px;
      line-height: 16px;
      color: #787878;

      @media (max-width: 768px) {
         max-width: 100%;
         text-align: center;
      }

      a {
         color: #3366ff;
         cursor: pointer;
         text-decoration: underline;
      }
   }

   &__button {
      width: calc(50% - 8px);
      max-width: 200px;
      height: 34px;
      padding: 8px 16px;
      font-size: 14px;
      white-space: nowrap;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition:
         background-color 0.3s,
         box-shadow 0.3s,
         transform 0.3s;

      @media (max-width: 768px) {
         width: 100%;
         max-width: none;
      }

      &--continue {
         color: #fff;
         background-color: #3366ff;
         transition: background-color 0.2s ease;

         &:hover {
            background-color: #144df8;
         }

         &:disabled {
            color: #787878;
            cursor: not-allowed;
            background-color: #eee;
            box-shadow: none;
         }
      }

      &--save {
         color: #3366ff;
         background-color: #d6efff;
         transition: background-color 0.2s ease;

         @media (max-width: 768px) {
            display: none;
         }

         &:hover {
            background-color: #a4dcff;
         }

         &:disabled {
            color: #787878;
            cursor: not-allowed;
            background-color: #eee;
            box-shadow: none;
         }
      }

      &.disabled {
         color: #787878 !important;
         cursor: not-allowed;
         background-color: #eee !important;
         box-shadow: none;
      }
   }
}

.spinner {
   display: inline-block;
   width: 16px;
   height: 16px;
   border: 2px solid #fff;
   border-top: 2px solid #3366ff;
   border-radius: 50%;
   animation: spin 0.6s linear infinite;
}

@keyframes spin {
   from {
      transform: rotate(0deg);
   }

   to {
      transform: rotate(360deg);
   }
}
</style>
