<template>
  <div class="profile">
    <ProfileHeader
      :username="user?.username"
      :uniqueCode="user?.unique_code"
      :goBack="goBack"
      :backIcon="backIcon"
    />
    <ProfileSwitcher
      :switcherItems="switcherItems"
      v-model:modelValue="selectedItem"
    />

    <div class="profile__wrapper">
      <component :is="currentComponent" :userId="route.params.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserOtherInfo } from '@/services/apiClient';
import backIcon from '@/assets/icons/back-wide.svg';

import InfoAdmin from '@/components/USER/InfoAdmin.vue';
import AdsAdmin from '@/components/USER/AdsAdmin.vue';
import CommentsAdmin from '@/components/USER/CommentsAdmin.vue';
import FavoritesAdmin from '@/components/USER/FavoritesAdmin.vue';
import FunnelsAdmin from '@/components/USER/FunnelsAdmin.vue';
import LogAdmin from '@/components/USER/LogAdmin.vue';

import ProfileHeader from '@/components/UI/CustomProfileHeader.vue';
import ProfileSwitcher from '@/components/UI/CustomProfileSwitcher.vue';

const route = useRoute();
const router = useRouter();
const user = ref(null);
const loading = ref(true);

const switcherItems = [
  'Инфо',
  'Объявления',
  'Комментарии',
  'Избранное',
  'Воронки',
  'Лог',
];
const selectedItem = ref(switcherItems[0]);

const fetchUserData = async () => {
  try {
    const response = await getUserOtherInfo(route.params.id);
    user.value = response;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    user.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const currentComponent = computed(() => {
  switch (selectedItem.value) {
    case 'Инфо':
      return InfoAdmin;
    case 'Объявления':
      return AdsAdmin;
    case 'Комментарии':
      return CommentsAdmin;
    case 'Избранное':
      return FavoritesAdmin;
    case 'Воронки':
      return FunnelsAdmin;
    case 'Лог':
      return LogAdmin;
    default:
      return InfoAdmin;
  }
});

onMounted(fetchUserData);
</script>

<style scoped lang="scss">
.profile {
  padding: 16px;
  min-height: calc(100% - 32px);
  margin: 16px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  height: calc(100% - 32px);
  width: calc(100% - 32px);
  border-radius: 6px;

  &__wrapper {
    height: 100%;
    overflow: auto;
  }
}
</style>
