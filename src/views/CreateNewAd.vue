<template>
   <div class="container">
      <!-- Показываем CreateAdForm только после загрузки данных -->
      <CreateAdForm v-if="!isLoading" @sendAd="handleSendAd" @saveAd="handleSaveAd" :isPublishing="isPublishing"
         :isSaving="isSaving" />
      <SaveAdPopup v-if="isPopupVisible && isAnyFieldFilled" title="Хотите сохранить объявление в черновики?"
         :isVisible="isPopupVisible" @close="closePopup" @save="saveAd" @discard="discardAd" />
   </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCreateStore } from '@/store/create.js';
import { useTabsStore } from '@/store/tabsStore.js';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import SaveAdPopup from '@/components/CREATEAD/SaveAdPopup.vue';
import CreateAdForm from '@/components/CREATEAD/CreateAdForm.vue';

// Инициализация стора и роутинга
const createStore = useCreateStore();
const tabsStore = useTabsStore();
const router = useRouter();
const route = useRoute();

// Получаем доступ к cookies
const { cookies } = useCookies();
const token = cookies.get('token');
const userId = cookies.get('user_id');

// Состояния компонента
const isPopupVisible = ref(false);
const isPublishing = ref(false);
const isSaving = ref(false);
const isLoading = ref(true);

// Проверяем, заполнены ли поля
const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled);

// Функция отправки объявления
const handleSendAd = async () => {
   isPublishing.value = true;
   try {
      const response = await createStore.setField('is_draft', 0);
      if (!response?.success) throw response.error;
   } catch (error) {
      console.error('Ошибка отправки объявления:', error);
   } finally {
      setTimeout(() => {
         router.push('/users/');
         isPublishing.value = false;
      }, 500);
   }
};

// Функция сохранения в черновики
const saveAd = async () => {
   isSaving.value = true;
   try {
      const response = await createStore.setField('is_draft', 1);
      if (!response?.success) throw response.error;
   } catch (error) {
      console.error('Ошибка при сохранении объявления:', error);
   } finally {
      setTimeout(() => {
         router.push('/users/');
         isSaving.value = false;
      }, 500);
   }
};

// Открытие попапа для сохранения в черновики
const handleSaveAd = () => {
   saveAd();
};

// Закрытие попапа без сохранения
const closePopup = () => {
   isPopupVisible.value = false;
};

// Отмена объявления и возврат на главную
const discardAd = () => {
   resetState();
};

// Сброс состояния
const resetState = () => {
   createStore.resetParams();
   tabsStore.resetTabs();
   isPopupVisible.value = false;
};

// Автоматическое обновление параметров в URL
watch(
   () => [createStore.id, createStore.id_user_owner_ads],
   ([id, owner]) => {
      if (id && owner) {
         router.replace({ query: { ...route.query, id, id_user_owner_ads: owner } });
      }
   },
   { immediate: true }
);

// Проверка токена и userId при монтировании
onMounted(async () => {
   const urlId = route.query.id_user_owner_ads;
   const fromUserId = route.params.id;

   createStore.create_by_user_id = fromUserId;

   if (token && userId && userId.toString() === urlId) {
      console.log('Токен существует и user_id совпадает с id в URL.');
      await createStore.setStoreFromApi(route.query.id);
   } else {
      console.log('Токен или user_id отсутствует, либо не совпадает.');
   }

   isLoading.value = false;
});

// Автосохранение перед уходом со страницы
onBeforeRouteLeave((to, from, next) => {
   if (!createStore.id) {
      next();
      return;
   }
   resetState();
   next();
});
</script>

<style scoped lang="scss">
.container {
   flex: 1;
   min-height: 100%;
   width: 100%;
   padding: 16px;
   margin: 0 auto;

   @media (max-width: 1024px) {
      margin-top: 60px;
   }
}
</style>