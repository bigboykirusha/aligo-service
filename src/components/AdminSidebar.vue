<template>
  <aside :class="['admin-layout__sidebar', { 'is-open': isSidebarOpen }]">
    <!-- Профиль и логотип -->
    <div class="admin-layout__profile-section">
      <!-- Логотип и бургер -->
      <div
        :class="['admin-layout__logo-section', { 'is-open': isSidebarOpen }]"
      >
        <!-- <img :src="isSidebarOpen ? aligoIcon : aIcon" alt="Logo" class="admin-layout__logo"
          @click="router.push('/users')" /> -->
        <img
          src="@/assets/icons/sidemenu.svg"
          alt="Toggle Sidebar"
          class="admin-layout__burger-icon"
          @click="toggleSidebar"
          :class="{ rotated: isSidebarOpen }"
        />
      </div>
      <div class="admin-layout__divider"></div>
      <!-- Аватар -->
      <div
        :class="['admin-layout__avatar-section', { 'is-open': isSidebarOpen }]"
      >
        <img
          :src="avatarUrl"
          alt="Avatar"
          :class="['admin-layout__avatar', { 'is-open': isSidebarOpen }]"
        />
        <p class="admin-layout__username" :class="{ 'is-open': isSidebarOpen }">
          {{
            isSidebarOpen
              ? userStore.username || userStore.phoneNumber || '-'
              : userStore.username?.charAt(0) || '-'
          }}
        </p>
      </div>
      <div class="admin-layout__divider"></div>
    </div>
    <!-- Меню -->
    <ul class="admin-layout__menu-list">
      <li
        v-for="item in menuItems"
        :key="item.name"
        class="admin-layout__menu-item"
      >
        <div
          :class="[
            'admin-layout__menu-link',
            { 'is-open': isSidebarOpen, active: $route.path === item.route },
          ]"
          @click="handleMenuClick(item)"
        >
          <img :src="item.icon" alt="" class="icon-16" />
          <span v-if="isSidebarOpen">{{ item.label }}</span>
        </div>
        <!-- Подменю -->
        <div
          v-if="item.submenu && openedMenu === item.name"
          class="admin-layout__submenu"
        >
          <div
            v-for="subItem in item.submenu"
            :key="subItem.label"
            class="admin-layout__submenu-item"
            @click="navigateToSubItem(subItem)"
          >
            {{ subItem.label }}
          </div>
        </div>
      </li>
    </ul>
    <div class="admin-layout__divider"></div>
    <!-- Выход -->
    <div
      class="admin-layout__menu-link"
      :class="{ 'is-open': isSidebarOpen }"
      @click="logout"
    >
      <img src="@/assets/icons/leave.svg" alt="" class="icon-16" />
      <span v-if="isSidebarOpen">Выйти</span>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref, defineProps, defineEmits } from 'vue';
import { getImageUrl } from '@/services/imageUtils';
import { useUserStore } from '@/store/user';

import avatarPhoto from '@/assets/icons/avatar-revers.svg';
import aIcon from '@/assets/icons/a-logo.svg';
import peopleIcon from '@/assets/icons/peoples.svg';

const props = defineProps({ isSidebarOpen: Boolean });
const emit = defineEmits(['toggle-sidebar']);

const img1 = new Image();
img1.src = aIcon;


const router = useRouter();
const userStore = useUserStore();
const avatarUrl = computed(() =>
  getImageUrl(userStore.photo?.arr_title_size.default, avatarPhoto)
);
const openedMenu = ref(null);

const logout = () => {
  userStore.clearUserdata();
  router.push('/authorization');
};

const menuItems = [
  { name: 'users', label: 'Пользователи', icon: peopleIcon, route: '/users/' },
];

const toggleSidebar = () => {
  emit('toggle-sidebar');
  openedMenu.value = null;
};

const handleMenuClick = (item) => {
  if (item.submenu) {
    if (!props.isSidebarOpen) {
      emit('toggle-sidebar');
      openedMenu.value = item.name;
    } else {
      openedMenu.value = openedMenu.value === item.name ? null : item.name;
    }
    return;
  }

  if (window.innerWidth <= 1024) {
    emit('toggle-sidebar');
  }
  router.push(item.route);
  openedMenu.value = null;
};
const navigateToSubItem = (subItem) => {
  if (window.innerWidth <= 1024) {
    emit('toggle-sidebar');
  }
  router.push(subItem.route);
};
</script>

<style lang="scss" scoped>
.admin-layout {
  &__sidebar {
    z-index: 5;
    background-color: var(--primary);
    color: var(--white);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    width: 56px;
    min-height: 100vh;
    padding: 24px 8px;

    &.is-open {
      width: 260px;
      padding: 24px;
    }

    @media (max-width: 1024px) {
      position: fixed;
      height: 100%;
      width: 100%;
      transform: translateX(-100%);

      &.is-open {
        transform: translateX(0);
        padding: 16px 24px;
        width: 100%;
      }
    }
  }

  &__burger-icon {
    transform: rotate(180deg);
    transition: transform 0.3s ease;

    &.rotated {
      transform: rotate(360deg);
    }
  }

  &__profile-section {
    @media (max-width: 1024px) {
      margin-top: 40px;
    }
  }

  &__logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    cursor: pointer;
    gap: 6px;

    &.is-open {
      justify-content: space-between;
    }

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__logo {
    height: 24px;
  }

  &__avatar-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;

    &.is-open {
      align-items: flex-start;
    }
  }

  &__avatar {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease;

    @media (max-width: 1024px) {
      width: 48px;
      height: 48px;
      margin-bottom: 0;
    }

    &.is-open {
      width: 48px;
      height: 48px;
      margin-bottom: 0;
    }
  }

  &__username {
    font-size: 20px;
    font-weight: 700;
  }

  &__divider {
    height: 2px;
    background-color: var(--white);
    opacity: 0.1;
    margin: 16px 0;
  }

  &__menu-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin-bottom: auto;
  }

  &__menu-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: font-weight 0.3s ease;

    &.active {
      font-weight: 700;
    }

    &.is-open {
      flex-direction: row;
      justify-content: flex-start;
    }
  }

  &__submenu {
    padding-left: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
  }

  &__submenu-item {
    cursor: pointer;
  }
}

.icon-16 {
  width: 16px;
  height: 16px;
}
</style>
