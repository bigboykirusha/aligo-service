<template>
   <div class="edit-profile-page">
      <ProfileTabSection
         section-id="edit"
         title="Управление профилем"
         :model-value="selectedTabId"
         :tabs="EDIT_PROFILE_TABS"
         @update:model-value="handleSwitch"
      >
         <component :is="currentSectionComponent" />
      </ProfileTabSection>
   </div>
</template>

<script setup>
import { computed } from 'vue'
import Documents from '~/components/Documents.vue'
import Security from '~/components/Security.vue'
import ProfileTabSection from '~/components/profile/shared/ProfileTabSection.vue'
import EditProfileAccount from '~/components/profile/edit/EditProfileAccount.vue'
import { useProfileSectionTabs } from '~/composables/profile/useProfileSectionTabs'

defineOptions({ name: 'EditProfilePage' })

const EDIT_PROFILE_TABS = [
   { id: 'account', label: 'Личные данные' },
   { id: 'activity', label: 'Активные сеансы' },
   { id: 'documents', label: 'Документы и соглашения' }
]

const {
   selectedTabId,
   handleSwitch,
   watchRouteTab
} = useProfileSectionTabs({
   sectionId: 'edit',
   sectionAliases: ['account', 'activity', 'documents'],
   tabs: EDIT_PROFILE_TABS,
   defaultTab: 'account',
   routeBuilder: (tabId) => `/profile/edit/${tabId}`,
   getRouteTab: (segments) => {
      const [first = '', second = ''] = (segments || []).map((segment) =>
         String(segment).toLowerCase()
      )

      if (first === 'edit') return second
      return first
   }
})

const SECTION_COMPONENTS = Object.freeze({
   account: EditProfileAccount,
   activity: Security,
   documents: Documents
})

const currentSectionComponent = computed(
   () => SECTION_COMPONENTS[selectedTabId.value] || EditProfileAccount
)

watchRouteTab(() => Promise.resolve())
</script>

<style scoped lang="scss">
.edit-profile-page {
   width: 100%;
   max-width: 768px;
   margin-bottom: 40px;
}
</style>
