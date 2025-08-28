import { defineStore } from 'pinia';
import {
  getUserDetails,
  logoutUser,
  updateUserInfo,
} from '@/services/apiClient';
import { getCookie, setCookie } from '@/services/auth';
import { useFavoritesStore } from './favorites';

function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
}

function formatUniqueCode(code) {
  return code.match(/.{1,4}/g)?.join(' ') || '';
}

export const useUserStore = defineStore('user', {
  state: () => ({
    login: null,
    userId: null,
    email: null,
    unconfirmed_email: null,
    phoneNumber: null,
    isLoggedIn: false,
    username: null,
    uniqueCode: null,
    latitude: null,
    longitude: null,
    city_id: null,
    city_name: null,
    address: null,
    photo: null,
    createdAt: null,
    countAds: 0,
    countFavorites: 0,
    countUnreadNotify: 0,
    count_new_messages: 0,
    countDrafts: 0,
    countReviews: 0,
    grade: 0,
  }),
  actions: {
    setUserData(data) {
      this.$patch(data);
      this.isLoggedIn = true;
    },
    async updateUsername(newUsername) {
      try {
        if (!newUsername.trim()) {
          throw new Error('Имя пользователя не может быть пустым.');
        }

        const formData = new FormData();
        formData.append('username', newUsername);

        await updateUserInfo(formData);

        await this.fetchAndSetUserdata();
      } catch (error) {
        console.error('Ошибка при обновлении имени пользователя: ', error);
      }
    },
    setCountNewMessages() {
      this.count_new_messages += 1;
    },
    setCountUnreadNotify() {
      this.countUnreadNotify += 1;
    },
    decCountUnreadNotify() {
      this.countUnreadNotify -= 1;
    },
    setCounts(countData) {
      if (countData.success) {
        this.countAds = countData.count_ads ?? this.countAds;
        this.countFavorites = countData.count_favorites ?? this.countFavorites;
        this.countUnreadNotify =
          countData.count_unread_notify ?? this.countUnreadNotify;
        this.count_new_messages =
          countData.count_new_messages ?? this.count_new_messages;
        this.countDrafts = countData.count_drafts ?? this.countDrafts;
        this.countReviews =
          countData.count_reviews_about_myself ?? this.countReviews;
      } else {
        console.error('Ошибка при обновлении счетчиков: данные не валидны.');
      }
    },
    async fetchAndSetUserdata() {
      try {
        console.log('Запрос данных пользователя...');
        const { success, data } = await getUserDetails();
        console.log('Ответ API:', success, data);

        if (success && data) {
          this.setUserData({
            userId: data.id,
            username: data.username,
            uniqueCode: data.unique_code
              ? formatUniqueCode(data.unique_code)
              : null,
            login: data.login,
            email: data.email,
            unconfirmed_email: data.unconfirmed_email,
            phoneNumber: data.phone ? formatPhoneNumber(data.phone) : null,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            city_id: data.city?.id,
            city_name: data.city?.title,
            photo: data.photo,
            createdAt: data.created_at,
            grade: data.grade,
          });

          this.isLoggedIn = true;
          console.log('Пользователь загружен, isLoggedIn =', this.isLoggedIn);

          await useFavoritesStore().fetchFavorites();

          // Обновляем куки
          const userData = JSON.parse(getCookie('userData') || '{}');
          if (data.email) userData.email = data.email;
          if (data.phone) userData.phoneNumber = data.phone;
          setCookie('userData', JSON.stringify(userData), 7);
        } else {
          this.isLoggedIn = false;
          console.log(
            'Ошибка: success=false или data отсутствует, isLoggedIn =',
            this.isLoggedIn
          );
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        this.isLoggedIn = false;
      }
    },

    async clearUserdata() {
      try {
        await logoutUser();
        const userData = JSON.parse(getCookie('userData'));
        delete userData.token;
        setCookie('userData', JSON.stringify(userData), 7);
        this.$reset();
        this.isLoggedIn = false;
      } catch (error) {
        console.error('Ошибка при очистке данных пользователя: ', error);
      }
    },

    // Обновление профиля
    async updateProfile(changedFields) {
      try {
        const formData = new FormData();
        console.log(changedFields);

        Object.entries(changedFields).forEach(([key, value]) => {
          if (key === 'phone') {
            value = value.replace(/[^\d+]/g, '');
          }
          formData.append(key, value);
        });

        const response = await updateUserInfo(formData);

        await this.fetchAndSetUserdata();

        return response;
      } catch (error) {
        return error.response;
      }
    },
  },
});
