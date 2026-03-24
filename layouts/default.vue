<template>
   <div class="admin-shell" :style="shellCssVars">
      <AppHeaderRow v-if="!isAuthorizationPage" />

      <main
         class="admin-shell__content"
         :class="{
            'admin-shell__content--create': isCreatePage,
            'admin-shell__content--auth': isAuthorizationPage
         }"
      >
         <slot />
      </main>

      <BottomToolbar />

      <ClientOnly>
         <LocationModal v-if="modalStore.isVisible('location')" />
      </ClientOnly>
   </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'
import AppHeaderRow from '@/components/header-row/AppHeaderRow.vue'
import BottomToolbar from '@/components/BottomToolbar.vue'
import LocationModal from '~/components/popups/LocationModal.vue'
import { useModalStore } from '~/store/modalStore'

const route = useRoute()
const modalStore = useModalStore()

const isCreatePage = computed(() => route.path.startsWith('/create'))
const isAuthorizationPage = computed(() => route.path === '/authorization')

const shellCssVars = computed(() => ({
   '--app-header-main-height': '0px',
   '--app-header-banner-height': '0px',
   '--app-header-row-height': '82px',
   '--app-header-mobile-hidden-offset': '0px',
   '--app-header-mobile-row-height': '62px',
   '--app-header-content-offset-desktop': '98px',
   '--app-header-content-offset-mobile': '78px',
   '--app-header-content-offset-mobile-compact': '78px',
   '--app-header-create-offset-desktop': '86px',
   '--app-header-create-offset-mobile': '70px',
   '--app-header-create-bottom-mobile': '32px'
}))
</script>

<style scoped lang="scss">
.admin-shell {
   min-height: 100vh;
   min-height: 100dvh;
   display: flex;
   flex-direction: column;
   background:
      radial-gradient(circle at top left, rgba(51, 102, 255, 0.08), transparent 24%),
      linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.admin-shell__content {
   flex: 1;
   width: 100%;
   padding-top: var(--app-header-content-offset-desktop);
   padding-bottom: 40px;
}

.admin-shell__content--create,
.admin-shell__content--auth {
   padding: 0;
   background-color: #ffffff;
}

@media (max-width: 768px) {
   .admin-shell__content {
      padding-top: var(--app-header-content-offset-mobile);
      padding-bottom: 94px;

      &--auth {
         padding: 0;
      }
   }

   .admin-shell__content--create,
   .admin-shell__content--auth {
      padding-top: 0;
   }
}
</style>
