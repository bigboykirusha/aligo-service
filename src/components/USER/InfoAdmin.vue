<template>
  <div v-if="user" class="info">
    <div class="info__photo">
      <img
        :src="getImageUrl(user.photo?.arr_title_size.default, avatarPhoto)"
        :alt="user.username"
        class="info__image"
      />
    </div>

    <InfoDetail
      label="Номер профиля"
      :value="formatProfileNumber(user.unique_code)"
    />
    <InfoDetail label="Имя" :value="user.username || 'нет данных'" />

    <div class="info__divider"></div>

    <InfoDetail label="Номер телефона" :value="user.phone || 'нет данных'" />
    <InfoDetail
      label="Электронная почта"
      :value="user.email || user.unconfirmed_email || 'нет данных'"
    />
    <InfoDetail
      label="Регион подбора"
      :value="user.address || user.city || 'нет данных'"
    />

    <div class="info__divider"></div>

    <InfoDetail
      label="Дата регистрации"
      :value="formatDateTime(user.created_at)"
    />
    <InfoDetail
      label="Последний вход"
      :value="formatDateTime(user.last_login_at)"
    />
    <InfoDetail label="IP" :value="user.last_ip || 'нет данных'" />
    <InfoDetail label="MAC-адрес" :value="user.mac_address || 'нет данных'" />
    <InfoDetail label="Устройство" :value="user.device || 'нет данных'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUserOtherInfo } from '@/services/apiClient';
import { getImageUrl } from '@/services/imageUtils';
import avatarPhoto from '@/assets/icons/avatar-revers.svg';
import InfoDetail from '@/components/USER/InfoDetail.vue';

const user = ref(null);
const route = useRoute();

const fetchUserData = async () => {
  try {
    const response = await getUserOtherInfo(route.params.id);
    user.value = response;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
  }
};

const formatProfileNumber = (code) => {
  return code ? code.toString().replace(/(\d{4})(?=\d)/g, '$1 ') : 'нет данных';
};

const formatDateTime = (date) => {
  if (!date) return 'нет данных';
  const d = new Date(date);
  return `${d.toLocaleDateString()} | ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

onMounted(fetchUserData);
</script>

<style lang="scss">
.info {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__image {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 50%;
  }

  &__divider {
    height: 1px;
    background-color: var(--color-stroke);
  }
}
</style>
