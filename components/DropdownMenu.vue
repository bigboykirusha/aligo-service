<template>
   <div ref="menuRef" class="menu-2" :class="{ 'menu-2--open': modelValue }">
      <div class="menu-2__header-row">
         <div class="menu-2__block">
            <img
               class="header__close-icon"
               :src="closeIcon"
               alt="Close menu"
               @click="uiStore.setDropdownState(false)">
            <button type="button" class="header__nav-link" @click="toggleModal">
               <img :src="defaultLocationIcon" alt="Location icon" class="header__icon">
               <span class="header__text header__text--hidden">{{
                  translatedCityName
               }}</span>
            </button>
         </div>
      </div>
      <div class="menu-2__container">
         <div class="menu-2__columns">
            <div v-for="(group, groupIndex) in detailedGroups" :key="groupIndex" class="menu-2__column">
               <div class="menu-2__list-item" @click="handleMenuItemClick(group)">
                  <img :src="group.icon" :alt="group.text" class="menu-2__list-item-icon">
                  {{ group.title }}
                  <span class="menu-2__list-item-count-total">{{
                     formatNumberWithSpaces(Number(group.count || 0))
                  }}</span>
               </div>
               <div class="menu-2__column-list">
                   <div
                      v-for="(item, itemIndex) in group.items"
                      :key="itemIndex"
                      class="menu-2__column-list-item"
                      @click="handleSubCategoryClick(item)">
                     <div class="menu-2__column-list-link">
                        {{ item.title }}
                     </div>
                  </div>
               </div>
            </div>
            <div class="menu-2__placeholder" />
         </div>
      </div>
   </div>
</template>
<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { getCars, getAutogoodsFiltered, getMotosFilters } from '@/services/apiClient.js'
import { formatNumberWithSpaces } from '@/services/amountUtils.js'
import { useRoute, useRouter } from 'vue-router'
import carIcon from '@/assets/icons/car.svg'
import diskIcon from '@/assets/icons/disc.svg'
import motoIcon from '@/assets/icons/moto.svg'
import closeIcon from '@/assets/icons/new/close-icon.svg'
import { useUiStore } from '~/store/ui'
import { useModalStore } from '~/store/modalStore'
import { useCityStore } from '~/store/city.js'
import defaultLocationIcon from '@/assets/icons/Location-blue.svg'
import { buildSharedCatalogNavSections } from '@/composables/catalog/domain/catalogSectionNavConfig'

const props = defineProps({
   modelValue: Boolean
})

const adsCount = ref(0)
const partsCount = ref(0)
const motoCount = ref(0)
const menuRef = ref(null)
const uiStore = useUiStore()
const cityStore = useCityStore()
const modalStore = useModalStore()

const router = useRouter()
const route = useRoute()

const translatedCityName = computed(() => cityStore.selectedCity.name)
const sharedCatalogNavSections = buildSharedCatalogNavSections()

const toggleModal = () => {
   modalStore.toggle('location')
}

const detailedGroups = computed(() => [
   {
      target: 'auto',
      title: sharedCatalogNavSections.auto.title,
      link: sharedCatalogNavSections.auto.link,
      icon: carIcon,
      count: adsCount.value,
      items: sharedCatalogNavSections.auto.dropdownItems
   },
   {
      target: 'parts',
      title: sharedCatalogNavSections.parts.title,
      link: sharedCatalogNavSections.parts.link,
      icon: diskIcon,
      count: partsCount.value,
      items: sharedCatalogNavSections.parts.dropdownItems
   },
   {
      target: 'moto',
      title: sharedCatalogNavSections.moto.title,
      link: sharedCatalogNavSections.moto.link,
      icon: motoIcon,
      count: motoCount.value,
      items: sharedCatalogNavSections.moto.dropdownItems
   }
])

const resolveSubCategoryLink = (item) => {
   const rawLink = String(item?.link || '').trim()
   if (!rawLink) return '/'

   if (rawLink.startsWith('/auto')) {
      if (item?.type === 'new') return '/auto/type-new'
      if (item?.type === 'used') return '/auto/type-used'
      return rawLink
   }

   if (rawLink.startsWith('/moto')) {
      if (item?.type === 'motorcycles') return '/moto/motorcycles'
      if (item?.type === 'scooters-and-mopeds') return '/moto/scooters'
      if (item?.type === 'all-terrain-vehicles') return '/moto/atv'
      if (item?.type === 'go-karts') return '/moto/karting'
      if (item?.type === 'atvs-and-buggies') return '/moto/quad-buggy'
      if (item?.type === 'snowmobiles') return '/moto/snowmobiles'
      return rawLink
   }

   return rawLink
}

const handleClickOutside = (event) => {
   if (!props.modelValue) return
   if (event.target?.closest?.('[data-dropdown-toggle]')) return

   if (menuRef.value && !menuRef.value.contains(event.target)) {
      uiStore.setDropdownState(false)
   }
}

const handleEscapeKeyDown = (event) => {
   if (event.key === 'Escape' && props.modelValue) {
      uiStore.setDropdownState(false)
   }
}

const toCityPath = (path) => {
   const normalizedPath = String(path || '').trim()
   if (!normalizedPath) return '/'

   const city = String(route.params.city || '').trim()
   if (!city || normalizedPath.startsWith('/' + city + '/')) return normalizedPath
   if (!normalizedPath.startsWith('/')) return '/' + city + '/' + normalizedPath
   return '/' + city + normalizedPath
}

const handleSubCategoryClick = (item) => {
   uiStore.setDropdownState(false)
   const rawTargetPath = resolveSubCategoryLink(item)
   router.push(toCityPath(rawTargetPath)).catch((error) => {
      console.error('Failed to navigate from dropdown subcategory:', error)
   })
}

const handleMenuItemClick = (item) => {
   uiStore.setDropdownState(false)
   const targetPath = String(item?.link || item?.target || '/').trim()
   const normalizedTargetPath = targetPath.startsWith('/')
      ? targetPath
      : '/' + targetPath
   router.push(toCityPath(normalizedTargetPath)).catch((error) => {
      console.error('Failed to navigate from dropdown section:', error)
   })
}

const fetchMenuCounts = async () => {
   const results = await Promise.allSettled([
      getCars({ page: 1 }),
      getAutogoodsFiltered({ page: 1 }),
      getMotosFilters({ page: 1 })
   ])

   const [carsResult, partsResult, motoResult] = results

   if (carsResult.status === 'fulfilled') {
      adsCount.value = Number(carsResult.value?.totalCount || 0)
   } else {
      adsCount.value = 0
      console.error('Failed to fetch auto count: ', carsResult.reason)
   }

   if (partsResult.status === 'fulfilled') {
      partsCount.value = Number(partsResult.value?.totalCount || 0)
   } else {
      partsCount.value = 0
      console.error('Failed to fetch autogoods count: ', partsResult.reason)
   }

   if (motoResult.status === 'fulfilled') {
      motoCount.value = Number(motoResult.value?.totalCount || 0)
   } else {
      motoCount.value = 0
      console.error('Failed to fetch moto count: ', motoResult.reason)
   }
}

onMounted(() => {
   document.addEventListener('pointerdown', handleClickOutside, { passive: true })
   window.addEventListener('keydown', handleEscapeKeyDown)
   fetchMenuCounts()
})

onUnmounted(() => {
   document.removeEventListener('pointerdown', handleClickOutside)
   window.removeEventListener('keydown', handleEscapeKeyDown)
})

watch(
   () => route.fullPath,
   () => {
      if (uiStore.showDropdown) {
         uiStore.setDropdownState(false)
      }
   }
)
</script>

<style scoped lang="scss">
.menu-2 {
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   z-index: 1;
   max-width: 1360px;
   margin: 0 auto;
   min-height: 66px;
   transform-origin: top center;
   transform: translate3d(0, 0, 0) scaleY(0.96);
   opacity: 0;
   visibility: hidden;
   pointer-events: none;
   box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
   will-change: transform, opacity;
   transition:
      transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.2s ease,
      visibility 0s linear 0.34s;

   @media (max-width: 768px) {
      position: fixed;
      max-width: none;
      inset: 0;
      height: 100vh;
      height: 100dvh;
      min-height: 100dvh;
      background: #fff;
      padding-top: 0;
      z-index: 140;
      transform: translate3d(0, 8px, 0);
      overflow: hidden;
   }

   &--open {
      transform: translate3d(0, 0, 0) scaleY(1);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition-delay: 0s, 0s, 0s;

      @media (max-width: 768px) {
         transform: translate3d(0, 0, 0);
      }
   }

   &__block {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      height: 62px;
   }

   &__header-row {
      display: none;
      padding: 0 16px;
      background-color: #ffffff;

      &::after {
         content: '';
         width: 100%;
         height: 1px;
         background-color: #d6d6d6;
      }

      @media (max-width: 768px) {
         display: flex;
         flex-direction: column;
         min-height: calc(66px + env(safe-area-inset-top));
         padding-top: env(safe-area-inset-top);
      }
   }

   &__placeholder {
      background-color: #d6efff;
      border-radius: 6px;
      height: 100%;
      width: 100%;

      @media (max-width: 991px) {
         display: none;
      }
   }

   &__container {
      padding: 66px 40px 60px;
      border-radius: 0 0 4px 4px;
      background: $white;
      width: 100%;
      border: 1px solid $color-block;
      border-top: none;
      transition: max-height 0.2s ease-in-out;

      @media (max-width: 768px) {
         padding: 0 16px 60px;
         padding-bottom: calc(40px + env(safe-area-inset-bottom));
         overflow-y: auto;
         overscroll-behavior: contain;
         -webkit-overflow-scrolling: touch;
         border: none;
         height: calc(100vh - 66px - env(safe-area-inset-top));
         height: calc(100dvh - 66px - env(safe-area-inset-top));
         border-radius: 0;
      }
   }

   &__columns {
      display: grid;
      grid-template-columns: repeat(4, 25%);
      row-gap: 64px;
      border-top: 1px solid #d6d6d6;
      padding-top: 32px;

      @media (max-width: 991px) {
         grid-template-columns: repeat(3, 33%);
      }

      @media (max-width: 768px) {
         display: flex;
         flex-direction: column;
         padding-top: 16px;
         row-gap: 32px;
         border: none;
      }
   }

   &__column {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__list {
      list-style: none;
      padding: 0;
      margin: 0;
      height: 100%;
      overflow-y: auto;
      min-width: 290px;
   }

   &__list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      cursor: pointer;
      transition:
         color 0.2s ease,
         transform 0.2s ease;

      &:hover {
         color: #3366ff;
      }

      &:active {
         transform: translateX(2px);
      }

      &-icon {
         width: 16px;
         height: 16px;
         object-fit: contain;
      }

      &-count-total {
         background: #eef9ff;
         border-radius: 12px;
         padding: 3px 10px;
         font-weight: 400;
         font-size: 14px;
         height: 24px;
         display: flex;
         align-items: center;
         color: $main-button;
         white-space: nowrap;
      }
   }

   &__column-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0;
      margin: 0;
   }

   &__column-list-item {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #323232;
      cursor: pointer;
      transition:
         color 0.2s ease,
         transform 0.2s ease;

      &:hover {
         color: #3366ff;
      }

      &:active {
         transform: translateX(2px);
      }
   }

   @media (prefers-reduced-motion: reduce) {
      transition: none;

      .menu-2__list-item,
      .menu-2__column-list-item {
         transition: none;
      }
   }
}

.header__nav-link {
   display: flex;
   align-items: center;
   color: #3366ff;
   font-weight: 400;
   font-size: 14px;
   line-height: 18px;
   gap: 8px;
   background: none;
   border: none;
   outline: none;
   cursor: pointer;
   text-decoration: none;

   .header__icon {
      height: 18px;
   }
}

.header__close-icon {
   width: 16px;
   height: 16px;
   cursor: pointer;
   -webkit-tap-highlight-color: transparent;
}
</style>
