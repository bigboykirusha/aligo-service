import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
   normalizeProfileSlug,
   resolveProfileSection
} from '@/services/profile/profileSections'

export const useProfileSlug = () => {
   const route = useRoute()

   const slugSegments = computed(() => normalizeProfileSlug(route.params.slug))

   const section = computed(() =>
      String(slugSegments.value[0] || '').toLowerCase()
   )
   const resolvedSection = computed(() => resolveProfileSection(route.params.slug))
   const tab = computed(() => String(slugSegments.value[1] || '').toLowerCase())

   const isSection = (value) =>
      section.value === String(value || '').toLowerCase()

   return {
      route,
      slugSegments,
      section,
      resolvedSection,
      tab,
      isSection
   }
}
