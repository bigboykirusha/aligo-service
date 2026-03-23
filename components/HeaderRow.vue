<template>
   <div
      class="header-row"
      :class="{
         'header-row--expanded': showDropdown || !isWithMargin,
         'header-row--dropdown-open': showDropdown,
         'header-row--with-margin-soon': isWithMargin && isHomePage,
         'header-row--with-margin': isWithMargin && !isHomePage,
         'header-row--search-page': isSearchPage,
         'header-row--business': isBusinessPage,
         'header-row--no-mobile-offset': isNoMobileOffsetPage,
         'header-row--create': isCreatePage,
         'header-row--burger': isBurgerOpen,
         'header-row--car': isCarPage || isAutoPage,
         'header-row--purchase-transaction': isPurchaseTransactionPage,
         'header-row--wallet-transaction': isWalletTransactionPage,
         'header-row--profile-mobile': isMobileProfilePage,
         'header-row--search-expanded':
            isMobileSearchExpanded && showMainControls
      }"
   >
      <div
         class="header-row__container"
         :class="{
            'header-row__container--create': isCreatePage,
            'header-row__container--profile-mobile': isMobileProfilePage
         }"
      >
         <h1
            v-if="showPrimaryLogoSection"
            class="header-row__logo-section"
            :class="{
               'header-row__logo-section--create-mobile':
                  isCreateAdPage && !isDesktop
            }"
         >
            <button
               v-if="isCreateAdPage"
               type="button"
               class="header-row__create-back"
               :aria-label="headerRowLabels.backToPreviousStep"
               @click="goCreateBack"
            >
               <img src="@/assets/icons/back-wide.svg" alt="" />
            </button>

            <nuxt-link
               class="header-row__logo header-row__logo--link"
               :class="{
                  'header-row__logo--compact': isCreateAdPage && !isDesktop
               }"
               to="/"
               @click="scrollToTop"
            >
               <img
                  :src="headerLogoSrc"
                  alt="Logo"
                  class="header-row__logo header-row__logo--image"
                  :class="{
                     'header-row__logo--compact': isCreateAdPage && !isDesktop
                  }"
               />
            </nuxt-link>
         </h1>

         <div
            v-if="showCompactHeaderSection"
            class="header-row__logo-section header-row__logo-section--compact"
            :class="{
               'header-row__logo-section--wallet-transaction':
                  isWalletTransactionPage
            }"
         >
            <button
               type="button"
               class="header-row__back"
               :class="{
                  'header-row__back--desktop-visible': isReportPage,
                  'header-row__back--wallet-transaction':
                     isWalletTransactionPage
               }"
               :aria-label="headerRowLabels.back"
               @click="handleCompactBack"
            >
               <img
                  src="@/assets/icons/back-wide.svg"
                  :alt="headerRowLabels.back"
               />
            </button>

            <button
               v-if="showCompactReportLogo"
               type="button"
               class="header-row__logo header-row__logo--link"
               @click="scrollToTop"
            >
               <img
                  :src="logoReport"
                  alt="Logo"
                  class="header-row__logo header-row__logo--image"
               />
            </button>

            <span
               v-else-if="isMobileProfilePage"
               class="header-row__compact-title"
               :class="{
                  'header-row__compact-title--wallet-transaction':
                     isWalletTransactionPage
               }"
            >
               {{ currentProfileCompactTitle }}
            </span>
         </div>

         <div v-if="showMainControls" class="header-row__controls">
            <button
               type="button"
               class="header-row__btn"
               data-dropdown-toggle
               @click.stop="toggleCategories"
            >
               <div
                  :class="
                     showDropdown
                        ? 'header-row__icon header-row__icon--cross'
                        : 'header-row__icon header-row__icon--categories'
                  "
               />
               <span class="header-row__controls-text">
                  {{ $t('header.allCategories') }}
               </span>
            </button>

            <span
               v-if="isUserPage && !isDesktop"
               class="header-row__compact-title"
            >
               Продавец
            </span>
            <HeaderRowSearch
               v-else
               :is-desktop="isDesktop"
               :show-dropdown="showDropdown"
               @update:mobile-search-expanded="isMobileSearchExpanded = $event"
            />

            <nuxt-link
               v-if="isLoggedIn"
               to="/create/"
               class="header-row__btn header-row__btn--post-ad"
            >
               <span>{{ $t('header.postAd') }}</span>
            </nuxt-link>

            <button
               v-else
               type="button"
               class="header-row__btn header-row__btn--post-ad"
               @click="toggleLoginModal"
            >
               <span>{{ $t('header.postAd') }}</span>
            </button>

            <div v-if="showAuthenticatedAvatar" class="header-row__user-menu-anchor">
               <button
                  type="button"
                  class="header-row__avatar"
                  :class="{ 'header-row__avatar--active': isUserMenuOpen }"
                  @click.stop="toggleUserMenu"
               >
                  <img
                     :src="userAvatar"
                     :alt="headerRowLabels.userAvatar"
                     class="header-row__avatar-image"
                     @error="handleUserAvatarLoadError"
                  />

                  <div class="header-row__small-text">
                     {{
                        userStore.username ||
                        userStore.phoneNumber ||
                        userStore.email
                     }}
                  </div>
               </button>

               <ClientOnly>
                  <component :is="UserMenuPopup" />
               </ClientOnly>
            </div>

            <button
               v-if="showGuestAvatar"
               type="button"
               class="header-row__avatar"
               @click="toggleLoginModal"
            >
               <img
                  src="@/assets/icons/avatar-revers.svg"
                  :alt="headerRowLabels.login"
                  class="header-row__avatar-image"
               />
            </button>
         </div>

         <div v-if="showDesktopProfileNav" class="header-row__controls">
            <div class="header-row__buttons">
               <nuxt-link
                  v-for="item in profileDesktopNavItems"
                  :key="item.to"
                  :to="item.to"
                  class="header-row__button"
               >
                  <img :src="item.icon" alt="" />
                  <span>{{ item.label }}</span>
               </nuxt-link>
            </div>
         </div>

         <div
            v-if="isPurchaseTransactionPage"
            class="header-row__purchase-transaction"
         >
            <div class="header-row__purchase-transaction-title">
               <button
                  type="button"
                  class="header-row__back header-row__back--desktop-visible header-row__purchase-transaction-back"
                  :aria-label="headerRowLabels.back"
                  @click="goBack"
               >
                  <img
                     src="@/assets/icons/back-wide.svg"
                     :alt="headerRowLabels.back"
                  />
               </button>
               <span class="header-row__compact-title">
                  {{ headerRowLabels.payment }}
               </span>
            </div>

            <img
               class="header-row__purchase-transaction-logo"
               src="@/assets/icons/logo-report.svg"
               alt=""
            />
         </div>

         <div
            v-if="isCreatePage"
            class="header-row__title header-row__create-title"
         >
            {{ headerRowLabels.newAd }}

            <div v-if="isCreateAdPage" class="header-row__create-breadcrumb">
               <span
                  class="header-row__create-breadcrumb-item header-row__create-breadcrumb-item--primary"
               >
                  {{ createCategoryLabel }}
               </span>

               <img
                  v-if="createConditionLabel"
                  :src="breadcrumbArrowIcon"
                  alt=""
                  class="header-row__create-breadcrumb-separator"
               />

               <span
                  v-if="createConditionLabel"
                  class="header-row__create-breadcrumb-item header-row__create-breadcrumb-item--secondary"
               >
                  {{ createConditionLabel }}
               </span>
            </div>
         </div>

         <button
            v-if="isMobileCreateCloseButton"
            type="button"
            class="header-row__create-close-edge"
            :aria-label="headerRowLabels.saveAndExit"
            @click="openCreateAdSavePopup"
         >
            <img :src="closeIcon" alt="" />
         </button>

         <div v-if="showAboutActions" class="header-row__about">
            <WishlistButton
               v-if="isAdPage && !isDesktop && hasCarAdId"
               :id="carAdId"
               :main-category-id="carAdMainCategoryId"
               :initial-is-in-favorites="initialCarFavoriteState"
               @toggle-login-modal="toggleLoginModal"
            />

            <ShareButton />
         </div>
      </div>

      <div
         v-if="isMobileProfilePage"
         v-show="shouldShowProfileSecondaryRow"
         class="header-row__profile-secondary"
      >
         <ProfileTabs
            v-if="shouldShowProfileTabs"
            :model-value="currentProfileHeaderTabValue"
            :tabs="currentProfileHeaderTabs"
            mobile-scrollable
            @update:model-value="
               selectProfileHeaderTab(currentProfileSectionId, $event)
            "
         />

         <div
            v-show="!shouldShowProfileTabs"
            :id="PROFILE_HEADER_ACTIONS_HOST_ID"
            class="header-row__profile-actions-host"
         />
      </div>

      <Teleport to="body" :disabled="isDesktop">
         <DropdownMenu v-model="showDropdown" />
      </Teleport>
   </div>
</template>

<script setup>
import {
   computed,
   defineAsyncComponent,
   onMounted,
   onUnmounted,
   ref,
   watch
} from 'vue'
import { useRouter } from 'vue-router'
import { usePageNavigationState } from '@/composables/usePageNavigationState'
import { useAdRoute } from '@/composables/useAdRoute'
import { useHeaderRowRouteState } from '@/composables/header/useHeaderRowRouteState'
import {
   PROFILE_SECTIONS,
   resolveProfileSection
} from '@/services/profile/profileSections'
import HeaderRowSearch from '@/components/header-row/HeaderRowSearch.vue'
import ProfileTabs from '~/components/profile/shared/ProfileTabs.vue'
import {
   PROFILE_HEADER_ACTIONS_HOST_ID,
   useProfileHeaderTabs
} from '~/composables/profile/useProfileHeaderTabs'
import { getUserAvatarUrl } from '~/services/imageUtils.js'
import { useCityStore } from '~/store/city'
import { useUserStore } from '~/store/user'
import { useUiStore } from '~/store/ui'
import { useModalStore } from '~/store/modalStore'
import { useCategorySelectStore } from '~/store/category-select'
import {
   CREATE_FLOW_MOTO_MOTORCYCLES,
   CREATE_FLOW_MOTO_SCOOTERS,
   CREATE_FLOW_PARTS_CAR_DISKS,
   CREATE_FLOW_PARTS_CAR_TIRES,
   CREATE_FLOW_PARTS_FULL_WHEELS,
   CREATE_FLOW_PARTS_MOTO_TIRES,
   CREATE_FLOW_PARTS_MOTOR_OIL,
   useCreateStore
} from '~/store/create'

import logoMain from '@/assets/images/logo.svg'
import logoCompact from '@/assets/icons/a-logo.svg'
import logoReport from '@/assets/icons/logo-report.svg'
import avatarPhoto from '@/assets/icons/avatar-revers.svg'
import carIcon from '@/assets/icons/car.svg'
import discIcon from '@/assets/icons/disc.svg'
import motoIcon from '@/assets/icons/moto.svg'
import closeIcon from '@/assets/icons/new/close-icon.svg'
import breadcrumbArrowIcon from '@/assets/icons/ar-gray.svg'

const UserMenuPopup = defineAsyncComponent(
   () => import('~/components/UserMenuPopup.vue')
)

const headerRowLabels = Object.freeze({
   back: '\u041d\u0430\u0437\u0430\u0434',
   backToPreviousStep:
      '\u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u043a \u043f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0435\u043c\u0443 \u0448\u0430\u0433\u0443',
   login: '\u0412\u043e\u0439\u0442\u0438',
   newAd: '\u041d\u043e\u0432\u043e\u0435 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435',
   payment: '\u041e\u043f\u043b\u0430\u0442\u0430',
   saveAndExit:
      '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438 \u0432\u044b\u0439\u0442\u0438',
   userAvatar:
      '\u0410\u0432\u0430\u0442\u0430\u0440 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f'
})

const profileDesktopNavItems = Object.freeze([
   {
      to: '/auto',
      icon: carIcon,
      label: '\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438'
   },
   {
      to: '/parts',
      icon: discIcon,
      label: '\u0410\u0432\u0442\u043e\u0442\u043e\u0432\u0430\u0440\u044b'
   },
   {
      to: '/moto',
      icon: motoIcon,
      label: '\u041c\u043e\u0442\u043e\u0442\u0435\u0445\u043d\u0438\u043a\u0430'
   }
])

const modalStore = useModalStore()
const uiStore = useUiStore()
const cityStore = useCityStore()
const categorySelectStore = useCategorySelectStore()
const createStore = useCreateStore()
const userStore = useUserStore()
const router = useRouter()
const { stableRoute } = usePageNavigationState()
const { route, isAdPage, section } = useAdRoute(stableRoute)

const showDropdown = computed({
   get: () => uiStore.showDropdown,
   set: (value) => uiStore.setDropdownState(value)
})

const EMPTY_PROFILE_HEADER_TABS_STATE = Object.freeze({
   title: '',
   items: [],
   value: '',
   onSelect: null,
   onBack: null
})

const {
   isAuthorizationPage,
   isProfilePage,
   isCreatePage,
   isCreateAdPage,
   isReportPage,
   isCarPage,
   isAutoPage,
   isPurchaseTransactionPage,
   isWalletTransactionPage,
   isSearchPage,
   isBusinessPage,
   isCatalogPage,
   isUserPage,
   isNoMobileOffsetPage,
   isHomePage
} = useHeaderRowRouteState({
   route,
   section,
   isAdPage
})

const {
   profileHeaderActionsRegistry,
   profileHeaderTabsRegistry,
   selectProfileHeaderTab
} = useProfileHeaderTabs()

const isWithMargin = ref(true)
const isDesktop = ref(false)
const id = ref('')
const isMobileSearchExpanded = ref(false)
let scrollRafId = 0
const HEADER_ROW_COLLAPSE_SCROLL_THRESHOLD = 12
const HEADER_ROW_EXPAND_SCROLL_THRESHOLD = 4

const isLoggedIn = computed(() => userStore.isLoggedIn)
const isBurgerOpen = computed(() => uiStore.isBurgerOpen)
const isUserMenuOpen = computed(() => uiStore.isUserMenuOpen)
const isMobile = computed(() => !isDesktop.value)
const showAuthenticatedAvatar = computed(
   () => isLoggedIn.value && !isWithMargin.value
)
const showGuestAvatar = computed(() => !isLoggedIn.value && !isWithMargin.value)
const isMobileProfilePage = computed(
   () => isProfilePage.value && !isDesktop.value && !isCreatePage.value
)
const isCreateCategoryPage = computed(
   () => isCreatePage.value && !isCreateAdPage.value
)
const showCompactHeaderSection = computed(
   () =>
      (isMobile.value &&
         (isReportPage.value ||
            isAdPage.value ||
            isCatalogPage.value ||
            isCreateCategoryPage.value ||
            isMobileProfilePage.value ||
            isUserPage.value)) ||
      isReportPage.value
)
const showCompactReportLogo = computed(() => isReportPage.value)
const showPrimaryLogoSection = computed(
   () =>
      !isPurchaseTransactionPage.value &&
      !showCompactHeaderSection.value &&
      (!isAdPage.value || isDesktop.value)
)
const showMainControls = computed(
   () =>
      !isPurchaseTransactionPage.value &&
      !isProfilePage.value &&
      !isCreatePage.value &&
      !isReportPage.value &&
      (!isAdPage.value || isDesktop.value)
)
const showDesktopProfileNav = computed(
   () => isProfilePage.value && isDesktop.value && !isCreatePage.value
)
const showAboutActions = computed(
   () =>
      isReportPage.value ||
      (isAdPage.value && !isDesktop.value) ||
      (isUserPage.value && !isDesktop.value)
)
const shouldShowProfileTabs = computed(
   () => isMobileProfilePage.value && currentProfileHeaderTabs.value.length > 0
)
const shouldShowProfileActionsHost = computed(
   () =>
      isMobileProfilePage.value &&
      !shouldShowProfileTabs.value &&
      Boolean(profileHeaderActionsRegistry.value[currentProfileSectionId.value])
)
const shouldShowProfileSecondaryRow = computed(
   () => shouldShowProfileTabs.value || shouldShowProfileActionsHost.value
)
const isMobileCreateCloseButton = computed(
   () => isCreateAdPage.value && !isDesktop.value
)
const CREATE_EXIT_IGNORED_KEYS = new Set([
   'id',
   'id_user_owner_ads',
   'is_draft',
   'is_finished',
   'is_published',
   'create_flow',
   'activeTab',
   'tabs',
   'currency_id',
   'autosave_pending_count',
   'autosave_last_error',
   'autosave_last_error_field',
   'autosave_last_success_at',
   'isDraftEditMode',
   'isUserDataInitializing',
   'isUserDataInitialized',
   'main_category_id',
   'sub_category_id',
   'last_category_id',
   'condition_id',
   'city_id',
   'city_name',
   'phone',
   'email',
   'username',
   'communication_method_id'
])

const hasCreateFormChanges = computed(() => {
   const entries = Object.entries(createStore.$state || {})
   return entries.some(([key, value]) => {
      if (CREATE_EXIT_IGNORED_KEYS.has(key)) return false
      if (value === null || value === undefined) return false
      if (typeof value === 'string' && value.trim() === '') return false
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.keys(value).length > 0
      if (
         (key.startsWith('is_') || key.includes('_is_')) &&
         Number(value) === 0
      )
         return false

      return true
   })
})

const headerLogoSrc = computed(() =>
   isCreateAdPage.value && !isDesktop.value ? logoCompact : logoMain
)
const currentProfileSectionId = computed(() =>
   resolveProfileSection(route.params.slug)
)
const currentProfileHeaderTabsState = computed(() => {
   const state = profileHeaderTabsRegistry.value[currentProfileSectionId.value]
   return state || EMPTY_PROFILE_HEADER_TABS_STATE
})
const currentProfileHeaderTabs = computed(
   () => currentProfileHeaderTabsState.value.items
)
const currentProfileHeaderTabValue = computed(
   () => currentProfileHeaderTabsState.value.value
)
const currentProfileHeaderBackHandler = computed(
   () => currentProfileHeaderTabsState.value.onBack
)
const currentProfileSectionLabel = computed(
   () =>
      PROFILE_SECTIONS[currentProfileSectionId.value]?.label ||
      PROFILE_SECTIONS.ads.label
)
const currentProfileCompactTitle = computed(
   () =>
      currentProfileHeaderTabsState.value.title ||
      currentProfileSectionLabel.value
)
const userAvatar = computed(() => getUserAvatarUrl(userStore.photo, avatarPhoto))

const createFlow = computed(() =>
   typeof createStore.create_flow === 'string'
      ? createStore.create_flow.toLowerCase()
      : ''
)
const isPassengerTiresCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_PARTS_CAR_TIRES
)
const isPassengerDisksCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_PARTS_CAR_DISKS
)
const isPassengerMotoTiresCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_PARTS_MOTO_TIRES
)
const isPassengerFullWheelsCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_PARTS_FULL_WHEELS
)
const isMotorOilCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_PARTS_MOTOR_OIL
)
const isMotoMotorcyclesCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_MOTO_MOTORCYCLES
)
const isMotoScootersCreateFlow = computed(
   () => createFlow.value === CREATE_FLOW_MOTO_SCOOTERS
)

const CREATE_FLOW_CONDITION_LABELS = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]:
      '\u041b\u0435\u0433\u043a\u043e\u0432\u044b\u0435 \u0448\u0438\u043d\u044b',
   [CREATE_FLOW_PARTS_CAR_DISKS]: '\u0414\u0438\u0441\u043a\u0438',
   [CREATE_FLOW_PARTS_MOTO_TIRES]:
      '\u041c\u043e\u0442\u043e\u0448\u0438\u043d\u044b',
   [CREATE_FLOW_PARTS_FULL_WHEELS]:
      '\u041a\u043e\u043b\u0451\u0441\u0430 \u0432 \u0441\u0431\u043e\u0440\u0435',
   [CREATE_FLOW_PARTS_MOTOR_OIL]:
      '\u041c\u043e\u0442\u043e\u0440\u043d\u043e\u0435 \u043c\u0430\u0441\u043b\u043e',
   [CREATE_FLOW_MOTO_MOTORCYCLES]:
      '\u041c\u043e\u0442\u043e\u0446\u0438\u043a\u043b\u044b',
   [CREATE_FLOW_MOTO_SCOOTERS]:
      '\u041c\u043e\u043f\u0435\u0434\u044b \u0438 \u0441\u043a\u0443\u0442\u0435\u0440\u044b'
})

const handleUserAvatarLoadError = (event) => {
   const image = event?.target
   if (!image || image.dataset?.fallbackApplied === 'true') return

   image.dataset.fallbackApplied = 'true'
   image.src = avatarPhoto
}

const selectedCreateLeafCategoryName = computed(() => {
   const selectedItems = categorySelectStore.selectedCategories
   if (!Array.isArray(selectedItems) || !selectedItems.length) return ''

   const leafItem = selectedItems[selectedItems.length - 1]
   return typeof leafItem?.name === 'string' ? leafItem.name : ''
})

const createCategoryLabel = computed(() => {
   if (
      isPassengerTiresCreateFlow.value ||
      isPassengerDisksCreateFlow.value ||
      isPassengerMotoTiresCreateFlow.value ||
      isPassengerFullWheelsCreateFlow.value ||
      isMotorOilCreateFlow.value
   ) {
      return '\u0410\u0432\u0442\u043e\u0442\u043e\u0432\u0430\u0440\u044b'
   }

   if (isMotoMotorcyclesCreateFlow.value || isMotoScootersCreateFlow.value) {
      return '\u041c\u043e\u0442\u043e\u0442\u0435\u0445\u043d\u0438\u043a\u0430'
   }

   const mainCategoryId = Number(createStore.main_category_id)
   if (mainCategoryId === 3)
      return '\u0410\u0432\u0442\u043e\u0442\u043e\u0432\u0430\u0440\u044b'
   if (mainCategoryId === 2)
      return '\u041c\u043e\u0442\u043e\u0442\u0435\u0445\u043d\u0438\u043a\u0430'
   if (mainCategoryId === 1)
      return '\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438'

   const rootCategory = categorySelectStore.selectedCategories[0]
   return (
      rootCategory?.name ||
      '\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438'
   )
})

const createConditionLabel = computed(() => {
   const flowLabel = CREATE_FLOW_CONDITION_LABELS[createFlow.value]
   if (flowLabel) {
      return selectedCreateLeafCategoryName.value || flowLabel
   }

   if (createStore.condition_id === 1) return '\u041d\u043e\u0432\u044b\u0435'
   if (createStore.condition_id === 2)
      return '\u0421 \u043f\u0440\u043e\u0431\u0435\u0433\u043e\u043c'

   const selectedCondition = categorySelectStore.selectedCategories.find(
      (item) =>
         item?.slug === 'new' ||
         item?.slug === 'used' ||
         item?.id === 1 ||
         item?.id === 2
   )

   if (selectedCondition?.slug === 'new' || selectedCondition?.id === 1) {
      return '\u041d\u043e\u0432\u044b\u0435'
   }

   if (selectedCondition?.slug === 'used' || selectedCondition?.id === 2) {
      return '\u0421 \u043f\u0440\u043e\u0431\u0435\u0433\u043e\u043c'
   }

   return ''
})

const normalizeAdId = (value) => {
   if (value === null || value === undefined) return ''
   const raw = Array.isArray(value) ? value[0] : value
   const normalized = String(raw || '').trim()
   return normalized === '0' ? '' : normalized
}

const parseCarAdIdFromRoute = () => {
   const idFromParams = normalizeAdId(route.params?.id)
   if (idFromParams) return idFromParams

   const slugParts = Array.isArray(route.params.slug)
      ? route.params.slug
      : [route.params.slug].filter(Boolean)

   for (const part of slugParts) {
      if (typeof part !== 'string') continue

      const match = part.match(/ads-(.+)/i)
      if (match?.[1]) {
         const normalized = normalizeAdId(match[1])
         if (normalized) return normalized
      }
   }

   const pathMatch = String(route.path || '').match(/ads-([^/]+)/i)
   if (!pathMatch?.[1]) return ''

   return normalizeAdId(pathMatch[1])
}

const carAdId = computed(() => id.value)

const hasCarAdId = computed(() => Boolean(carAdId.value))

const initialCarFavoriteState = computed(() => null)

const MAIN_CATEGORY_ID_BY_SECTION = Object.freeze({
   auto: 1,
   moto: 2,
   parts: 3,
   autogoods: 3
})

const carAdMainCategoryId = computed(() => {
   const fallback =
      MAIN_CATEGORY_ID_BY_SECTION[String(section.value || '').toLowerCase()]
   return fallback || 1
})

const syncFavoritesForCarPage = async () => {
   return undefined
}

const toggleUserMenu = () => uiStore.toggleUserMenu()

const closeCategoriesDropdown = () => {
   if (!showDropdown.value) return
   uiStore.setDropdownState(false)
}

const toggleCategories = () => {
   if (isCreatePage.value) {
      closeCategoriesDropdown()
      return
   }

   uiStore.toggleDropdown()
}

const toggleLoginModal = () => {
   if (!isAuthorizationPage.value) {
      router.push({
         path: '/authorization',
         query: { redirect: route.fullPath || '/' }
      })
   }
}

const openCreateAdSavePopup = () => {
   if (hasCreateFormChanges.value) {
      modalStore.open('createAdSaveExit')
      return
   }

   createStore.resetParams()
   router.push('/create/').catch((error) => {
      console.error('Failed to leave empty create form:', error)
   })
}

const scrollToTop = () => {
   if (!import.meta.client) return

   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   })
}

const normalizeHistoryPath = (value) => {
   const path = String(value || '')
      .split('#')[0]
      .split('?')[0]
   if (!path) return ''
   const normalized = path.replace(/\/+$/, '')
   return normalized || '/'
}

const goBack = () => {
   if (!import.meta.client) return

   const historyBack = window.history?.state?.back
   const normalizedBack = normalizeHistoryPath(historyBack)
   const normalizedCurrent = normalizeHistoryPath(route.fullPath)
   if (
      typeof historyBack === 'string' &&
      historyBack.startsWith('/') &&
      normalizedBack &&
      normalizedBack !== normalizedCurrent
   ) {
      router.replace(historyBack).catch(() => {})
      return
   }

   const selectedCity = String(cityStore.selectedCity?.translit || '')
      .trim()
      .toLowerCase()
   const target =
      !selectedCity || selectedCity === 'moskva' ? '/' : `/${selectedCity}`
   router.push(target).catch(() => {})
}

const handleCompactBack = () => {
   const sectionBackHandler = currentProfileHeaderBackHandler.value

   if (typeof sectionBackHandler === 'function') {
      sectionBackHandler()
      return
   }

   goBack()
}

const goCreateBack = async () => {
   if (createStore.activeTab > 1) {
      createStore.setActiveTab(createStore.activeTab - 1)
      return
   }

   await router.push('/create/')
}

const handleScroll = () => {
   if (!import.meta.client) return
   if (scrollRafId) return

   scrollRafId = requestAnimationFrame(() => {
      const scrollTop =
         window.scrollY ||
         document.documentElement.scrollTop ||
         document.body.scrollTop ||
         0

      if (isWithMargin.value) {
         if (scrollTop > HEADER_ROW_COLLAPSE_SCROLL_THRESHOLD) {
            isWithMargin.value = false
         }
      } else if (scrollTop <= HEADER_ROW_EXPAND_SCROLL_THRESHOLD) {
         isWithMargin.value = true
      }

      scrollRafId = 0
   })
}

const updateIsDesktop = () => {
   if (!import.meta.client) return
   isDesktop.value = window.innerWidth >= 768
}

const updateIdFromRoute = () => {
   id.value = parseCarAdIdFromRoute()
}

onMounted(() => {
   updateIdFromRoute()
   updateIsDesktop()
   syncFavoritesForCarPage()
   closeCategoriesDropdown()
   uiStore.closeUserMenu()

   if (import.meta.client) {
      window.addEventListener('resize', updateIsDesktop, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
   }
})

onUnmounted(() => {
   if (!import.meta.client) return

   if (scrollRafId) {
      cancelAnimationFrame(scrollRafId)
   }

   window.removeEventListener('resize', updateIsDesktop)
   window.removeEventListener('scroll', handleScroll)
})

watch(
   isCreatePage,
   (isCreate) => {
      if (isCreate) {
         closeCategoriesDropdown()
      }
   },
   { immediate: true }
)

watch([carAdId, isLoggedIn, isAdPage], () => {
   syncFavoritesForCarPage()
})

watch(
   () => route.fullPath,
   () => {
      updateIdFromRoute()
      closeCategoriesDropdown()
      uiStore.closeUserMenu()
      syncFavoritesForCarPage()
   }
)
</script>

<style scoped lang="scss" src="./HeaderRow.scss"></style>
