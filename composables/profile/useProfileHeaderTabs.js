import { computed, ref } from 'vue'

const headerTabsBySection = ref({})
const headerActionsBySection = ref({})

const normalizeSectionId = (value) =>
   String(value || '')
      .toLowerCase()
      .trim()
export const PROFILE_HEADER_ACTIONS_HOST_ID = 'profile-header-mobile-actions'

export const useProfileHeaderTabs = () => {
   const setProfileHeaderTabs = ({
      sectionId = '',
      title = '',
      items = [],
      value = '',
      handleSelect = null,
      handleBack = null
   } = {}) => {
      const normalizedSectionId = normalizeSectionId(sectionId)
      if (!normalizedSectionId) return

      headerTabsBySection.value = {
         ...headerTabsBySection.value,
         [normalizedSectionId]: {
            title,
            items: Array.isArray(items) ? items : [],
            value,
            onSelect: typeof handleSelect === 'function' ? handleSelect : null,
            onBack: typeof handleBack === 'function' ? handleBack : null
         }
      }
   }

   const clearProfileHeaderTabs = (sectionId = '') => {
      const normalizedSectionId = normalizeSectionId(sectionId)

      if (!normalizedSectionId) {
         headerTabsBySection.value = {}
         return
      }

      if (!headerTabsBySection.value[normalizedSectionId]) return

      const nextState = { ...headerTabsBySection.value }
      delete nextState[normalizedSectionId]
      headerTabsBySection.value = nextState
   }

   const selectProfileHeaderTab = (sectionId, tabId) => {
      headerTabsBySection.value[normalizeSectionId(sectionId)]?.onSelect?.(
         tabId
      )
   }

   const setProfileHeaderActionsActive = (sectionId, isActive) => {
      const normalizedSectionId = normalizeSectionId(sectionId)
      if (!normalizedSectionId) return

      headerActionsBySection.value = {
         ...headerActionsBySection.value,
         [normalizedSectionId]: Boolean(isActive)
      }
   }

   const clearProfileHeaderActions = (sectionId = '') => {
      const normalizedSectionId = normalizeSectionId(sectionId)

      if (!normalizedSectionId) {
         headerActionsBySection.value = {}
         return
      }

      if (!headerActionsBySection.value[normalizedSectionId]) return

      const nextState = { ...headerActionsBySection.value }
      delete nextState[normalizedSectionId]
      headerActionsBySection.value = nextState
   }

   return {
      profileHeaderActionsRegistry: computed(
         () => headerActionsBySection.value
      ),
      profileHeaderTabsRegistry: computed(() => headerTabsBySection.value),
      setProfileHeaderActionsActive,
      clearProfileHeaderActions,
      selectProfileHeaderTab,
      setProfileHeaderTabs,
      clearProfileHeaderTabs
   }
}
