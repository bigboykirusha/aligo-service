<template>
   <header
      class="app-header-row"
      :class="{
         'app-header-row--create': isCreatePage,
         'app-header-row--compact': isCreateAdPage && !isDesktop
      }"
   >
      <div class="app-header-row__container">
         <div v-if="isCreatePage" class="app-header-row__create">
            <div class="app-header-row__brand-group">
               <button
                  v-if="isCreateAdPage"
                  type="button"
                  class="app-header-row__icon-button"
                  aria-label="Назад"
                  @click="goCreateBack"
               >
                  <img :src="backIcon" alt="" />
               </button>

               <NuxtLink
                  to="/"
                  class="app-header-row__logo-link"
                  @click="scrollToTop"
               >
                  <img
                     :src="
                        isCreateAdPage && !isDesktop ? logoCompact : logoMain
                     "
                     alt="Aligo"
                     class="app-header-row__logo"
                     :class="{
                        'app-header-row__logo--compact':
                           isCreateAdPage && !isDesktop
                     }"
                  />
               </NuxtLink>
            </div>

            <div class="app-header-row__create-copy">
               <div class="app-header-row__title">
                  Новое объявление
               </div>

               <div v-if="isCreateAdPage" class="app-header-row__breadcrumb">
                  <span class="app-header-row__breadcrumb-item">
                     {{ createCategoryLabel }}
                  </span>

                  <img
                     v-if="createConditionLabel"
                     :src="breadcrumbArrowIcon"
                     alt=""
                     class="app-header-row__breadcrumb-separator"
                  />

                  <span
                     v-if="createConditionLabel"
                     class="app-header-row__breadcrumb-item app-header-row__breadcrumb-item--muted"
                  >
                     {{ createConditionLabel }}
                  </span>
               </div>
            </div>

            <div class="app-header-row__create-actions">
               <button
                  v-if="isCreateAdPage && !isDesktop"
                  type="button"
                  class="app-header-row__icon-button app-header-row__icon-button--close"
                  aria-label="Закрыть создание"
                  @click="handleCreateExitClick"
               >
                  <img :src="closeIcon" alt="" />
               </button>
            </div>
         </div>

         <div v-else class="app-header-row__default">
            <NuxtLink to="/" class="app-header-row__brand">
               <img
                  :src="logoMain"
                  alt="Aligo"
                  class="app-header-row__brand-logo"
               />
               <span class="app-header-row__brand-text"
                  >Сервис публикации</span
               >
            </NuxtLink>

            <nav
               v-if="showPrimaryNavigation && isDesktop"
               class="app-header-row__nav"
               aria-label="Основная навигация"
            >
               <NuxtLink
                  v-for="item in navigationItems"
                  :key="item.to"
                  :to="item.to"
                  class="app-header-row__nav-link"
                  :class="{
                     'app-header-row__nav-link--active': isActiveNavItem(
                        item.to
                     )
                  }"
               >
                  <img
                     v-if="!isDesktop"
                     :src="item.icon"
                     :alt="item.label"
                     class="app-header-row__nav-icon"
                  />
                  <span v-else>{{ item.label }}</span>
               </NuxtLink>
            </nav>

            <div
               v-if="userStore.isLoggedIn && isDesktop"
               class="app-header-row__actions"
            >
               <UIButton
                  v-if="userStore.isLoggedIn"
                  :block="false"
                  variant="ghost"
                  @click="handleLogout"
               >
                  Выйти
               </UIButton>

               <UIButton
                  v-else-if="false"
                  :block="false"
                  variant="primary"
                  @click="openLogin"
               >
                  Войти
               </UIButton>
            </div>
         </div>
      </div>
   </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { navigateTo, useRoute, useRouter } from '#app'
import UIButton from '@/components/ui/UIButton.vue'
import logoMain from '@/assets/images/logo.svg'
import logoCompact from '@/assets/icons/a-logo.svg'
import usersIcon from '@/assets/icons/person.svg'
import adsIcon from '@/assets/icons/new/ads-icon.svg'
import backIcon from '@/assets/icons/back-wide.svg'
import closeIcon from '@/assets/icons/new/close-icon.svg'
import breadcrumbArrowIcon from '@/assets/icons/ar-gray.svg'
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
import { useCategorySelectStore } from '~/store/category-select'
import { useModalStore } from '~/store/modalStore'
import { useUserStore } from '~/store/user'

const CREATE_FORM_QUERY_KEYS = Object.freeze([
   'id',
   'main_category_id',
   'sub_category_id',
   'last_category_id'
])

const CREATE_FLOW_CONDITION_LABELS = Object.freeze({
   [CREATE_FLOW_PARTS_CAR_TIRES]: 'Легковые шины',
   [CREATE_FLOW_PARTS_CAR_DISKS]: 'Диски',
   [CREATE_FLOW_PARTS_MOTO_TIRES]: 'Мотошины',
   [CREATE_FLOW_PARTS_FULL_WHEELS]: 'Колёса в сборе',
   [CREATE_FLOW_PARTS_MOTOR_OIL]: 'Моторное масло',
   [CREATE_FLOW_MOTO_MOTORCYCLES]: 'Мотоциклы',
   [CREATE_FLOW_MOTO_SCOOTERS]: 'Мопеды и скутеры'
})

const navigationItems = Object.freeze([
   { to: '/', label: 'Пользователи', icon: usersIcon },
   { to: '/ads', label: 'Объявления', icon: adsIcon }
])

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const createStore = useCreateStore()
const categorySelectStore = useCategorySelectStore()
const modalStore = useModalStore()

const isDesktop = ref(false)

const isCreatePage = computed(() => route.path.startsWith('/create'))
const isAuthorizationPage = computed(() => route.path === '/authorization')
const showPrimaryNavigation = computed(() => !isAuthorizationPage.value)
const isCreateAdPage = computed(() =>
   CREATE_FORM_QUERY_KEYS.some((key) => {
      const raw = route.query?.[key]
      const value = Array.isArray(raw) ? raw[0] : raw
      return value !== null && value !== undefined && value !== ''
   })
)

const createFlow = computed(() =>
   typeof createStore.create_flow === 'string'
      ? createStore.create_flow.toLowerCase()
      : ''
)

const selectedCreateLeafCategoryName = computed(() => {
   const selectedItems = categorySelectStore.selectedCategories
   if (!Array.isArray(selectedItems) || !selectedItems.length) return ''

   const leafItem = selectedItems[selectedItems.length - 1]
   return typeof leafItem?.name === 'string' ? leafItem.name : ''
})

const createCategoryLabel = computed(() => {
   const flowValue = createFlow.value

   if (
      flowValue === CREATE_FLOW_PARTS_CAR_TIRES ||
      flowValue === CREATE_FLOW_PARTS_CAR_DISKS ||
      flowValue === CREATE_FLOW_PARTS_MOTO_TIRES ||
      flowValue === CREATE_FLOW_PARTS_FULL_WHEELS ||
      flowValue === CREATE_FLOW_PARTS_MOTOR_OIL
   ) {
      return 'Автотовары'
   }

   if (
      flowValue === CREATE_FLOW_MOTO_MOTORCYCLES ||
      flowValue === CREATE_FLOW_MOTO_SCOOTERS
   ) {
      return 'Мототехника'
   }

   const mainCategoryId = Number(createStore.main_category_id)
   if (mainCategoryId === 3) return 'Автотовары'
   if (mainCategoryId === 2) return 'Мототехника'
   if (mainCategoryId === 1) return 'Автомобили'

   return (
      categorySelectStore.selectedCategories[0]?.name || 'Автомобили'
   )
})

const createConditionLabel = computed(() => {
   const flowLabel = CREATE_FLOW_CONDITION_LABELS[createFlow.value]
   if (flowLabel) {
      return selectedCreateLeafCategoryName.value || flowLabel
   }

   if (createStore.condition_id === 1) return 'Новые'
   if (createStore.condition_id === 2) return 'С пробегом'

   return ''
})

const updateViewport = () => {
   if (!import.meta.client) return
   isDesktop.value = window.innerWidth >= 768
}

const scrollToTop = () => {
   if (!import.meta.client) return

   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   })
}

const isActiveNavItem = (path) => {
   if (path === '/') return route.path === '/'
   return route.path === path || route.path.startsWith(`${path}/`)
}

const openLogin = () => {}

const handleLogout = async () => {
   userStore.invalidateSession({
      clearCookies: true,
      resetCreateStore: true,
      reason: 'manual'
   })

   await navigateTo('/authorization')
}

const goCreateBack = async () => {
   if (createStore.activeTab > 1) {
      createStore.setActiveTab(createStore.activeTab - 1)
      return
   }

   await router.push('/create/')
}

const handleCreateExitClick = async () => {
   if (createStore.isAnyFieldFilled) {
      modalStore.open('createAdSaveExit')
      return
   }

   createStore.resetParams()
   categorySelectStore.clearSelectedCategories()
   await router.push('/create/')
}

onMounted(() => {
   updateViewport()

   if (import.meta.client) {
      window.addEventListener('resize', updateViewport, { passive: true })
   }
})

onBeforeUnmount(() => {
   if (!import.meta.client) return
   window.removeEventListener('resize', updateViewport)
})
</script>

<style scoped lang="scss">
.app-header-row {
   position: fixed;
   top: 0;
   right: 0;
   left: 0;
   z-index: 120;
   background: var(--color-surface);
   box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
}

.app-header-row__container {
   max-width: 1312px;
   margin: 0 auto;
   padding: 16px;
}

.app-header-row__default,
.app-header-row__create {
   display: flex;
   align-items: center;
   gap: 24px;
}

.app-header-row__default {
   justify-content: space-between;
}

.app-header-row__brand {
   display: inline-flex;
   align-items: center;
   gap: 10px;
   color: var(--color-text-primary);
   text-decoration: none;
   flex-shrink: 0;
}

.app-header-row__brand-logo {
   height: 34px;
   width: auto;
}

.app-header-row__brand-text {
   font-size: var(--font-size-20);
   line-height: var(--line-height-24);
   font-weight: 700;
}

.app-header-row__nav {
   display: flex;
   align-items: center;
   gap: 8px;
   flex: 1;
   min-width: 0;
}

.app-header-row__nav-link {
   display: inline-flex;
   align-items: center;
   min-height: 34px;
   padding: 0 12px;
   border-radius: 999px;
   color: var(--color-text-primary);
   text-decoration: none;
   transition:
      color 0.2s ease,
      background-color 0.2s ease;
}

.app-header-row__nav-link:hover,
.app-header-row__nav-link--active {
   background: #d6efff;
   color: var(--color-text-accent);
}

.app-header-row__nav-icon {
   width: 16px;
   height: 16px;
   display: block;
}

.app-header-row__actions {
   display: flex;
   align-items: center;
   gap: 10px;
   flex-shrink: 0;
}

.app-header-row__create {
   justify-content: space-between;
}

.app-header-row__brand-group {
   display: flex;
   align-items: center;
   gap: 12px;
   flex-shrink: 0;
}

.app-header-row__logo-link {
   display: inline-flex;
   align-items: center;
}

.app-header-row__logo {
   height: 34px;
   width: auto;
}

.app-header-row__logo--compact {
   height: 28px;
}

.app-header-row__create-copy {
   display: flex;
   flex: 1;
   min-width: 0;
   flex-direction: column;
   gap: 4px;
}

.app-header-row__title {
   color: var(--color-text-primary);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
   font-weight: 700;
}

.app-header-row__breadcrumb {
   display: inline-flex;
   align-items: center;
   gap: 8px;
   min-width: 0;
   color: var(--color-text-muted);
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
}

.app-header-row__breadcrumb-item {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}

.app-header-row__breadcrumb-item--muted {
   color: var(--color-text-secondary);
}

.app-header-row__breadcrumb-separator {
   width: 9px;
   height: 6px;
   flex-shrink: 0;
}

.app-header-row__create-actions {
   display: flex;
   align-items: center;
   justify-content: flex-end;
   gap: 10px;
   flex-shrink: 0;
}

.app-header-row__icon-button {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   width: 32px;
   height: 32px;
   border: none;
   border-radius: 50%;
   background: transparent;
   cursor: pointer;
   transition: background-color 0.2s ease;
}

.app-header-row__icon-button:hover {
   background: #d6efff;
}

.app-header-row__icon-button img {
   width: 16px;
   height: 16px;
}

.app-header-row__icon-button--close img {
   width: 14px;
   height: 14px;
}

@media (max-width: 900px) {
   .app-header-row__brand {
      min-width: 0;
   }

   .app-header-row__nav {
      grid-column: 1 / -1;
      flex-wrap: wrap;
   }
}

@media (max-width: 768px) {
   .app-header-row__container {
      padding: 14px 16px;
   }

   .app-header-row__create {
      gap: 12px;
      padding-bottom: 0;
      border-bottom-color: transparent;
   }

   .app-header-row__title {
      font-size: 16px;
      line-height: 20px;
   }

   .app-header-row__breadcrumb {
      gap: 6px;
      max-width: 100%;
   }
}

@media (max-width: 640px) {
   .app-header-row__brand-text {
      display: none;
   }

   .app-header-row__nav-link {
      justify-content: center;
      min-height: 32px;
      min-width: 32px;
      padding: 0 8px;
   }

   .app-header-row__actions {
      width: auto;
      min-width: 0;
      justify-content: flex-end;
   }

   .app-header-row__actions :deep(.ui-button) {
      min-width: auto;
      white-space: nowrap;
   }
}
</style>
