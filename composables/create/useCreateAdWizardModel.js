import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from '#app'
import { useCreateStore } from '@/store/create'
import { shouldShowPhotosOnCreateAdStep } from '@/store/createStore/flows'
import {
   buildCreateAdRequiredFieldsMessage,
   buildCreateCharacteristicsRequiredFieldsMessage
} from '@/store/createStore/publishHelpers'
import { getCreateWizardStepKeysByFlow } from '@/store/createStore/wizardSteps'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { useDocumentsStore } from '@/store/documents'

const RULES_TITLE_EXACT =
   'Условия размещения и содержания объявлений'
const RULES_TITLE_HINTS = ['условия размещения', 'правила публикации']

const normalizeTitle = (value) => String(value || '').trim().toLowerCase()

export const useCreateAdWizardModel = ({ props, emit }) => {
   const createStore = useCreateStore()
   const popupErrorStore = usePopupErrorStore()
   const documentsStore = useDocumentsStore()
   const config = useRuntimeConfig()

   const rulesLink = ref('')
   const rulesTitle = ref('')

   const activeTab = computed(() => createStore.activeTab)
   const createFlow = computed(() => createStore.create_flow)
   const stepKeys = computed(() => getCreateWizardStepKeysByFlow(createFlow.value))
   const currentTab = computed(() => Number(activeTab.value) || 1)
   const lastTabIndex = computed(() => Math.max(1, stepKeys.value.length))
   const currentStepKey = computed(
      () => stepKeys.value[currentTab.value - 1] || stepKeys.value[0]
   )
   const showPhotosOnAdStep = computed(() =>
      shouldShowPhotosOnCreateAdStep(createFlow.value)
   )

   const isNextEnabled = computed(() => {
      if (currentTab.value === 1) {
         return createStore.isCharacteristicFieldsFilled
      }
      return true
   })

   const isPublishEnabled = computed(() => {
      if (currentTab.value === lastTabIndex.value) {
         return createStore.isAdFieldsFilled
      }
      return true
   })

   const canPublishNow = computed(
      () => isPublishEnabled.value && !props.isPublishing && !props.isSaving
   )

   const isSaveAndExitEnabled = computed(
      () => createStore.isAnyFieldFilled && !props.isPublishing && !props.isSaving
   )

   const findRulesDocument = () => {
      const documents = Array.isArray(documentsStore.documents)
         ? documentsStore.documents
         : []

      const exactTitle = normalizeTitle(RULES_TITLE_EXACT)

      return (
         documentsStore.documentByTitle(RULES_TITLE_EXACT) ||
         documents.find((item) => normalizeTitle(item?.title) === exactTitle) ||
         documents.find((item) => {
            const title = normalizeTitle(item?.title)
            return RULES_TITLE_HINTS.some((hint) => title.includes(hint))
         }) ||
         null
      )
   }

   const loadRulesDocument = async () => {
      try {
         await documentsStore.fetchDocuments()
         const doc = findRulesDocument()

         if (doc?.path) {
            rulesLink.value = `${config.public.apiBaseUrl}/${doc.path}`
            rulesTitle.value = doc.title
         }
      } catch (error) {
         console.error('Create rules document load failed:', error)
      }
   }

   const saveAndExit = () => {
      if (showBusyActionWarning('сохранить черновик')) return

      if (!createStore.isAnyFieldFilled) {
         popupErrorStore.showWarning(
            'Сохранение недоступно: в форме пока нет заполненных полей.'
         )
         return
      }

      emit('saveAd')
   }

   const showCharacteristicsRequiredFieldsError = () => {
      popupErrorStore.showError(
         buildCreateCharacteristicsRequiredFieldsMessage(createStore)
      )
   }

   const showAdRequiredFieldsError = () => {
      popupErrorStore.showError(buildCreateAdRequiredFieldsMessage(createStore))
   }

   const showBusyActionWarning = (actionLabel) => {
      if (props.isPublishing) {
         popupErrorStore.showWarning(
            `Сейчас идет публикация объявления. Дождитесь завершения, чтобы ${actionLabel}.`
         )
         return true
      }

      if (props.isSaving) {
         popupErrorStore.showWarning(
            `Сейчас идет сохранение черновика. Дождитесь завершения, чтобы ${actionLabel}.`
         )
         return true
      }

      return false
   }

   const publishAndExit = () => {
      if (showBusyActionWarning('продолжить работу с формой')) return

      if (!isPublishEnabled.value) {
         showAdRequiredFieldsError()
         return
      }

      emit('sendAd')
   }

   const continueToNextTab = () => {
      if (showBusyActionWarning('перейти к следующему шагу')) return

      if (!isNextEnabled.value) {
         showCharacteristicsRequiredFieldsError()
         return
      }

      if (currentTab.value < lastTabIndex.value) {
         createStore.setActiveTab(currentTab.value + 1)
      }
   }

   const updateBottomBarHeight = (tab) => {
      if (!import.meta.client) return
      const height = Number(tab) === lastTabIndex.value ? 130 : 70
      document.documentElement.style.setProperty(
         '--create-bottom-bar-height',
         `${height}px`
      )
   }

   onMounted(() => {
      void loadRulesDocument()
   })

   watch(
      [currentTab, lastTabIndex],
      ([tab]) => {
         updateBottomBarHeight(tab)
      },
      { immediate: true }
   )

   onBeforeUnmount(() => {
      if (!import.meta.client) return
      document.documentElement.style.removeProperty('--create-bottom-bar-height')
   })

   return {
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
   }
}
