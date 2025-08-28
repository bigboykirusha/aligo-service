<template>
  <div class="admin-layout">
    <AdminSidebar
      v-if="userStore.isLoggedIn"
      :isSidebarOpen="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />
    <div :class="['admin-layout__main', { 'sidebar-open': isSidebarOpen }]">
      <BurgerMenu @toggle-sidebar="toggleSidebar" />
      <slot />
    </div>
  </div>
  <ToastTemplate />
  <CustomPopUP
    v-if="isVisible"
    name="Code"
    @closing="closePopUp"
    @submit-action="console.log('Открыт')"
  />
</template>

<script setup>
import ToastTemplate from '@/components/ToastTemplate';
import BurgerMenu from '@/components/BurgerMenu.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import CustomPopUP from '@/components/POPUP/PopUpCode.vue';
import { useUserStore } from '@/store/user';
import { ref, onMounted } from 'vue';
import { popupCodeStore } from '@/store/popupCode.js';

const popUpCode = popupCodeStore();
const isVisible = ref(false);
const isSidebarOpen = ref(false);
const userStore = useUserStore();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const getIsisVisible = () => {
  isVisible.value = popUpCode.isVisible;
};
const closePopUp = () => {
  popUpCode.closePopUp();
  isVisible.value = false;
};
onMounted(() => {
  getIsisVisible();
});
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  flex-direction: row;
  height: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  &__main {
    flex: 1;
    transition: margin-left 0.3s ease;
  }
}
</style>
