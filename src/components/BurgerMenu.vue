<template>
  <div class="burger-menu">
    <img
      v-if="userStore.isLoggedIn"
      class="burger-menu__icon"
      @click="toggleSidebar"
      src="../assets/icons/menu.svg"
      alt="Menu"
    />
    <div class="burger-menu__logo-section">
      <!-- <img :src="aligoIcon" alt="Logo" class="burger-menu__logo" /> -->
      <div class="burger-menu__role">Администратор</div>
    </div>
  </div>
</template>

<script setup>
// import aligoIcon from '@/assets/images/logo-white.svg';
import { useUserStore } from '@/store/user';
import { defineEmits } from 'vue';

const userStore = useUserStore();
const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};
</script>

<style scoped lang="scss">
.burger-menu {
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    position: fixed;
    align-items: center;
    z-index: 10;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    background-color: var(--primary);
    padding: 0 24px;
  }

  &__logo-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &__logo {
    height: 20px;
  }

  &__role {
    font-size: 12px;
    color: var(--white);
  }
}
</style>
