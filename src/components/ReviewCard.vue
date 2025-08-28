<template>
  <div class="review-card">
    <div class="review-card__header">
      <img :src="avatarUrl" alt="User Avatar" class="review-card__avatar" />
      <div class="review-card__info">
        <div class="review-card__user-name">{{ userName }}</div>
        <div class="review-card__timestamp">{{ formattedTimestamp }}</div>
      </div>

      <button
        v-if="!hideOptionsButton"
        class="review-card__button"
        @click="togglePopup"
      >
        <img src="../assets/icons/options.svg" alt="Options" />
      </button>

      <div
        v-if="!hideOptionsButton"
        :class="['popup', { 'popup--active': showPopup }]"
        @click.stop
      >
        <div class="popup__header">
          <img :src="avatarUrl" alt="User Avatar" class="popup__avatar" />
          <div class="popup__info">
            <div class="popup__user-name">{{ userName }}</div>
            <div class="popup__timestamp">{{ formattedTimestamp }}</div>
          </div>
          <button class="popup__button" @click="togglePopup">
            <img src="../assets/icons/close-blue.svg" alt="Options" />
          </button>
        </div>
        <button class="popup__option" @click="goToAd">
          <img src="../assets/icons/ad.svg" alt="Ad Icon" class="popup__icon" />
          Перейти в объявление
        </button>
        <button
          v-if="props.review.user_id == userStore.userId"
          class="popup__option"
          @click="reply"
        >
          <img
            src="../assets/icons/alert.svg"
            alt="Reply Icon"
            class="popup__icon"
          />
          Ответить
        </button>
        <button
          class="popup__option popup__option--delete"
          @click="
            showDeleteConfirm = true;
            closePopup();
          "
        >
          <img
            src="../assets/icons/delete.svg"
            alt="Delete Icon"
            class="popup__icon"
          />
          Удалить комментарий
        </button>
      </div>
    </div>
    <div class="review-card__body">
      <div class="review-card__ad-title">{{ adTitle }}</div>
      <div class="review-card__comment">
        <span class="review-card__comment-title">Комментарий:</span>
        {{ review.comment }}
      </div>
      <div class="review-card__rating">
        <div class="review-card__comment-title">Оценка:</div>
        <div class="review-card__rating-stars">
          <svg
            v-for="star in 5"
            :key="star"
            :class="getStarClass(star)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 34 32"
            fill="none"
          >
            <path
              d="M16.7842 25.8744L7.03538 31L8.89765 20.1439L1 12.4563L11.8988 10.8768L16.7732 1L21.6476 10.8768L32.5464 12.4563L24.6487 20.1439L26.511 31L16.7842 25.8744Z"
              stroke="#3366FF"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div v-if="review.photos.length > 0" class="review-card__images">
        <img
          v-for="photo in review.photos"
          :key="photo.id"
          :src="getImageUrl(photo.path)"
          :alt="photo.title"
          class="review-card__image"
        />
      </div>
    </div>
    <div v-if="review.answer_owner_ad" class="review-card__owner-reply">
      <div class="review-card__header">
        <img
          :src="ownerReplyAvatarUrl"
          alt="Owner Avatar"
          class="review-card__avatar"
        />
        <div class="review-card__info">
          <div class="review-card__user-name">{{ ownerReplyUserName }}</div>
          <div class="review-card__timestamp">
            {{ ownerFormattedTimestamp }}
          </div>
        </div>
      </div>
      <div class="review-card__body">
        <div class="review-card__comment">
          <span class="review-card__comment-title">Ответ владельца:</span>
          {{ review.answer_owner_ad.comment }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineProps } from 'vue';
import { getImageUrl } from '../services/imageUtils';
import { useRouter } from 'vue-router';
import { getUser, getCarById } from '~/services/apiClient';
import { useUserStore } from '../store/user.js';
import avatar from '../assets/icons/avatar-revers.svg';

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  hideOptionsButton: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const avatarUrl = ref('');
const userStore = useUserStore();
const userName = ref('');
const adTitle = ref('');
const showPopup = ref(false);
const showDeleteConfirm = ref(false);
const isPopupVisible = ref(false);

const ownerReplyAvatarUrl = ref('');
const ownerReplyUserName = ref('');

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};

const closePopup = () => {
  showPopup.value = false;
};

const handleClickOutside = (event) => {
  if (
    !event.target.closest('.popup') &&
    !event.target.closest('.review-card__button')
  ) {
    closePopup();
  }
};

const ownerFormattedTimestamp = computed(() => {
  return formatDate(props.review.answer_owner_ad.created_at);
});

const goToAd = () => {
  if (props.review.ads_id) {
    router.push(`/car/${props.review.ads_id}`);
  } else {
    console.error('ID объявления отсутствует');
  }
};

const reply = () => {
  // нужен ли этот лог в проекте
  console.log('Ответить на комментарий');
  isPopupVisible.value = true;
};

const formatDate = (dateString) => {
  const months = [
    'янв',
    'фев',
    'март',
    'апр',
    'май',
    'июнь',
    'июль',
    'авг',
    'сен',
    'окт',
    'нояб',
    'дек',
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} | ${hours}:${minutes}`;
};

const formattedTimestamp = computed(() => {
  return formatDate(props.review.created_at);
});

const fetchUserData = async (userId) => {
  try {
    const userData = await getUser(userId);
    avatarUrl.value = getImageUrl(userData.photo?.path, avatar);
    userName.value =
      userData.username || userData.login || userData.email || 'Артемий';
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
  }
};

const fetchAdData = async (adId) => {
  try {
    const adData = await getCarById(adId);
    adTitle.value = `${adData.auto_technical_specifications[0].brand.title} ${adData.auto_technical_specifications[0].model.title}, ${adData.auto_technical_specifications[0].year_release.title}`;
  } catch (error) {
    console.error('Ошибка при получении данных объявления:', error);
  }
};

const getStarClass = (star) => {
  return star <= props.review.grade ? 'review-card__rating-star--filled' : '';
};

const fetchOwnerReplyUserData = async (userId) => {
  try {
    const userData = await getUser(userId);
    ownerReplyAvatarUrl.value = getImageUrl(userData.photo?.path, avatar);
    ownerReplyUserName.value = userData.username || 'Имя не указано';
  } catch (error) {
    console.error('Ошибка при получении данных владельца:', error);
  }
};

onMounted(() => {
  if (props.review.comment_user_id) {
    fetchUserData(props.review.comment_user_id);
  }
  if (props.review.ads_id) {
    fetchAdData(props.review.ads_id);
  }

  if (props.review.answer_owner_ad) {
    fetchOwnerReplyUserData(props.review.answer_owner_ad.user_id);
  }

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.review-card {
  border-radius: 6px;
  padding: 24px;
  background-color: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);

  &__header {
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 8px;
  }

  &__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__user-name {
    font-weight: 700;
    color: var(--text-main);
    font-size: 16px;
  }

  &__timestamp {
    font-size: 12px;
    color: var(--text-main);
  }

  &__body {
    margin-top: 8px;
  }

  &__ad-title {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-main);
    margin-bottom: 8px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    &-text {
      font-size: 14px;
      color: var(--primary);
    }

    &-stars {
      display: flex;
      gap: 3px;

      svg {
        width: 14px;
        height: 14px;
        cursor: default;

        path {
          fill: var(--white);
          stroke: var(--primary);
        }

        &.review-card__rating-star--filled path {
          fill: var(--primary);
        }
      }
    }
  }

  &__comment {
    font-size: 14px;
    color: var(--text-main);
    margin-bottom: 8px;

    strong {
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }
  }

  &__comment-title {
    font-weight: 700;
    font-size: 14px;
    color: var(--text-main);
  }

  &__images {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  &__image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }

  &__button {
    height: 34px;
    width: 34px;
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d6efff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    img {
      height: 16px;
    }

    &:hover {
      background-color: #a4dcff;
    }
  }

  &__owner-reply {
    padding-top: 16px;

    & .review-card__header {
      margin-bottom: 8px;
      margin-left: 40px;

      @media (max-width: 768px) {
        margin-left: 16px;
      }
    }

    & .review-card__body {
      margin-top: 8px;
      margin-left: 40px;

      @media (max-width: 768px) {
        margin-left: 16px;
      }
    }

    &__comment {
      font-size: 14px;
      color: var(--text-main);

      strong {
        font-weight: 700;
        display: block;
        margin-bottom: 4px;
      }
    }
  }
}

.popup {
  position: absolute;
  background-color: var(--white);
  top: 0;
  right: 0;
  border: 1px solid var(--primary);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1001;
  transform: scale(0);
  transform-origin: top right;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.popup--active {
    opacity: 1;
    transform: scale(1);
  }

  &__button {
    height: 34px;
    width: 34px;
    margin-left: auto;
    background-color: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;

    img {
      height: 16px;
    }
  }
}

.popup__icon {
  height: 14px;
  margin-right: 8px;
}

.popup__option {
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 14px;
  border-radius: 12px;
  color: var(--text-main);
  background-color: var(--white);
  transition: background-color 0.2s;

  &:hover {
    background-color: #d6efff;
  }
}

@media (max-width: 768px) {
  .popup-overlay {
    display: block;
    padding: 0 16px;
  }

  .popup {
    width: 100%;
  }
}

.popup__header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 16px;
  margin-bottom: 8px;

  .popup__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
  }

  .popup__info {
    display: flex;
    flex-direction: column;
  }

  .popup__user-name {
    font-weight: 700;
    color: var(--text-main);
    font-size: 16px;
  }

  .popup__timestamp {
    font-size: 12px;
    color: var(--text-main);
  }
}

@media (min-width: 768px) {
  .popup__header {
    display: none;
  }
}
</style>
