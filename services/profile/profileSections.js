const PROFILE_LABELS = Object.freeze({
   wallet: '\u041a\u043e\u0448\u0435\u043b\u0435\u043a',
   services: '\u0423\u0441\u043b\u0443\u0433\u0438',
   reports: '\u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0430\u0432\u0442\u043e',
   ads: '\u041c\u043e\u0438 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f',
   messages: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f',
   notifications: '\u041e\u043f\u043e\u0432\u0435\u0449\u0435\u043d\u0438\u044f',
   reviews: '\u041e\u0442\u0437\u044b\u0432\u044b',
   edit: '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u043c'
})

export const PROFILE_SECTIONS = Object.freeze({
   wallet: {
      id: 'wallet',
      label: PROFILE_LABELS.wallet,
      hasHeaderTabs: true,
      defaultLink: '/profile/wallet',
      componentLoader: () => import('~/components/profile/wallet/Wallet.vue')
   },
   services: {
      id: 'services',
      label: PROFILE_LABELS.services,
      hasHeaderTabs: true,
      defaultLink: '/profile/services',
      componentLoader: () => import('~/components/profile/services/Services.vue')
   },
   reports: {
      id: 'reports',
      label: PROFILE_LABELS.reports,
      hasHeaderTabs: false,
      defaultLink: '/profile/reports',
      componentLoader: () => import('~/components/profile/reports/Reports.vue')
   },
   ads: {
      id: 'ads',
      label: PROFILE_LABELS.ads,
      hasHeaderTabs: true,
      defaultLink: '/profile/ads/all',
      componentLoader: () =>
         import('~/components/profile/publications/MyPublications.vue')
   },
   messages: {
      id: 'messages',
      label: PROFILE_LABELS.messages,
      hasHeaderTabs: false,
      defaultLink: '/profile/messages',
      componentLoader: () => import('~/components/chat/Messages.vue')
   },
   notifications: {
      id: 'notifications',
      label: PROFILE_LABELS.notifications,
      hasHeaderTabs: false,
      defaultLink: '/profile/notifications',
      componentLoader: () =>
         import('~/components/profile/notifications/Notifications.vue')
   },
   reviews: {
      id: 'reviews',
      label: PROFILE_LABELS.reviews,
      hasHeaderTabs: true,
      defaultLink: '/profile/reviews/mine',
      componentLoader: () => import('~/components/profile/reviews/Reviews.vue')
   },
   edit: {
      id: 'edit',
      label: PROFILE_LABELS.edit,
      hasHeaderTabs: true,
      defaultLink: '/profile/edit/account',
      componentLoader: () => import('~/components/profile/edit/EditProfile.vue')
   }
})

export const PROFILE_SECTION_ORDER = Object.freeze([
   'wallet',
   'services',
   'reports',
   'ads',
   'messages',
   'notifications',
   'reviews',
   'edit'
])

export const PROFILE_SECTION_CONFIG = Object.freeze(
   Object.fromEntries(
      Object.entries(PROFILE_SECTIONS).map(([sectionId, section]) => [
         sectionId,
         {
            id: section.id,
            defaultLink: section.defaultLink,
            hasHeaderTabs: Boolean(section.hasHeaderTabs)
         }
      ])
   )
)

export const PROFILE_SECTION_ALIASES = Object.freeze({
   account: 'edit',
   activity: 'edit',
   documents: 'edit'
})

export const PROFILE_MENU_BASE = Object.freeze(
   PROFILE_SECTION_ORDER.filter((sectionId) => sectionId !== 'edit').map(
      (sectionId) => ({
         id: PROFILE_SECTIONS[sectionId].id,
         label: PROFILE_SECTIONS[sectionId].label,
         link: PROFILE_SECTIONS[sectionId].defaultLink,
         dividerAfter: sectionId === 'reports'
      })
   )
)

export const PROFILE_SECTION_COMPONENT_LOADERS = Object.freeze(
   Object.fromEntries(
      Object.entries(PROFILE_SECTIONS).map(([sectionId, section]) => [
         sectionId,
         section.componentLoader
      ])
   )
)

export const normalizeProfileSlug = (slugValue) => {
   if (Array.isArray(slugValue)) return slugValue.filter(Boolean)
   return slugValue ? [slugValue] : []
}

export const resolveProfileSection = (slugValue) => {
   const [rawSection = 'ads'] = normalizeProfileSlug(slugValue)
   const normalized = String(rawSection).toLowerCase()
   const aliasResolved = PROFILE_SECTION_ALIASES[normalized] || normalized

   return PROFILE_SECTION_CONFIG[aliasResolved] ? aliasResolved : 'ads'
}
