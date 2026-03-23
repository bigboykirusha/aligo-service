<template>
   <nav
      v-if="showToolbar"
      class="bottom-toolbar"
      aria-label="Мобильная навигация"
   >
      <ul class="bottom-toolbar__list">
         <li
            v-for="item in navigationItems"
            :key="item.to"
            class="bottom-toolbar__item"
         >
            <button
               type="button"
               class="bottom-toolbar__link"
               :class="{ 'bottom-toolbar__link--active': isActive(item.to) }"
               :aria-label="item.label"
               @click="navigate(item.to)"
            >
               <img
                  :src="item.icon"
                  :alt="item.label"
                  class="bottom-toolbar__icon"
               >
               <span class="bottom-toolbar__text">{{ item.label }}</span>
            </button>
         </li>

         <li
            v-if="userStore.isLoggedIn"
            class="bottom-toolbar__item"
         >
            <button
               type="button"
               class="bottom-toolbar__link"
               aria-label="Выйти"
               @click="logout"
            >
               <img
                  :src="logoutIcon"
                  alt="Выйти"
                  class="bottom-toolbar__icon"
               >
               <span class="bottom-toolbar__text">Выйти</span>
            </button>
         </li>
      </ul>
   </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navigateTo } from '#app'
import { usePageNavigationState } from '@/composables/usePageNavigationState'
import usersIcon from '@/assets/icons/person.svg'
import adsIcon from '@/assets/icons/new/ads-icon.svg'
import logoutIcon from '@/assets/icons/new/out-icon.svg'
import { useUserStore } from '~/store/user'

const route = useRoute()
const router = useRouter()
const { stableRoute } = usePageNavigationState()
const userStore = useUserStore()

const stablePath = computed(() => String(stableRoute.value?.path || route.path || '/'))

const navigationItems = Object.freeze([
   { to: '/', label: 'Пользователи', icon: usersIcon },
   { to: '/ads', label: 'Объявления', icon: adsIcon }
])

const showToolbar = computed(() => {
   const path = stablePath.value
   return !path.startsWith('/authorization') && !path.startsWith('/create')
})

const isActive = (path) => {
   if (path === '/') return stablePath.value === '/'
   return stablePath.value === path || stablePath.value.startsWith(`${path}/`)
}

const navigate = (path) => {
   if (isActive(path)) return
   router.push(path)
}

const logout = async () => {
   userStore.invalidateSession({
      clearCookies: true,
      resetCreateStore: true,
      reason: 'manual'
   })

   await navigateTo('/authorization')
}
</script>

<style scoped lang="scss">
.bottom-toolbar {
   position: fixed;
   right: 0;
   bottom: 0;
   left: 0;
   z-index: 90;
   display: none;
   padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
   background: rgba(255, 255, 255, 0.94);
   border-top: 1px solid rgba(168, 168, 168, 0.24);
   backdrop-filter: blur(14px);
   -webkit-backdrop-filter: blur(14px);
}

.bottom-toolbar__list {
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
   gap: 8px;
   width: 100%;
   max-width: 420px;
   margin: 0 auto;
   padding: 0;
   list-style: none;
}

.bottom-toolbar__item {
   min-width: 0;
}

.bottom-toolbar__link {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 4px;
   width: 100%;
   min-height: 48px;
   padding: 6px 10px;
   color: var(--color-text-secondary);
   font: inherit;
   text-decoration: none;
   background: transparent;
   border: 1px solid transparent;
   border-radius: 12px;
   cursor: pointer;
   transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
}

.bottom-toolbar__link--active {
   color: var(--color-text-accent);
   background: rgba(51, 102, 255, 0.1);
   border-color: rgba(51, 102, 255, 0.16);
}

.bottom-toolbar__icon {
   width: 18px;
   height: 18px;
   display: block;
}

.bottom-toolbar__text {
   font-size: var(--font-size-12);
   line-height: var(--line-height-12);
   white-space: nowrap;
}

@media (max-width: 768px) {
   .bottom-toolbar {
      display: block;
   }
}
</style>
