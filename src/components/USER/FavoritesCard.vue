<template>
  <div class="card">
    <div
      :class="['card__image', { 'card__image--dimmed': is_published === 0 }]"
    >
      <Swiper
        v-if="images.length"
        :modules="[SwiperAutoplay, SwiperPagination]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        :navigation="false"
        :loop="true"
      >
        <SwiperSlide v-for="(image, index) in images" :key="index">
          <img
            :src="getImageUrl(image.arr_title_size.preview)"
            draggable="false"
            @contextmenu.prevent
            alt="Slide Image"
          />
        </SwiperSlide>
        <div class="swiper-pagination"></div>
      </Swiper>
      <img
        v-else
        :src="placeholder"
        alt="Placeholder image"
        class="card__placeholder"
      />
    </div>
    <div class="card__body">
      <nuxt-link :to="`/car/${url}`" class="card__title">
        {{ brand }} {{ model }}, {{ year }}
      </nuxt-link>
      <div class="card__block">
        <span v-if="is_published !== 0" class="card__price">{{
          formatNumberWithSpaces(price)
        }}</span>
        <span v-if="is_published !== 0" class="card__currency">₽</span>
        <span v-if="is_published === 0" class="card__price"
          >Снято с публикации</span
        >
      </div>
      <div class="card__info">
        <div class="card__location">{{ place }}</div>
        <div class="card__date">{{ timeAgo }}</div>
      </div>
    </div>
    <div class="card__more">
      <WishlistButton
        @toggle-login-modal="toggleLoginModal"
        :id="id"
        isWithBorder
        size="small"
      />
      <div class="card__section">
        <div class="card__part">
          <div class="card__username">{{ formattedUsername }}</div>
          <div class="card__state">Частное лицо</div>
        </div>
        <div
          :class="[
            'card__buttons',
            { card__buttons__hidden: is_published === 0 },
          ]"
        >
          <button
            class="button"
            @click="isLoggedIn ? openChat() : toggleLoginModal()"
          >
            <img src="@/assets/icons/mail-blue.svg" alt="Chat" />
          </button>
          <button v-if="isLoggedIn" class="button" @click="handleCallClick">
            <img src="@/assets/icons/call.svg" alt="Call" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { formatNumberWithSpaces } from '@/services/amountUtils.js';
import { getImageUrl } from '@/services/imageUtils';
import { useUserStore } from '@/store/user';
import { seeContact } from '@/services/apiClient';
import { useRouter } from 'vue-router';
import { useLoginModalStore } from '@/store/loginModal.js';
import placeholder from '@/assets/icons/placeholder.png';

const loginModalStore = useLoginModalStore();
const router = useRouter();

const showPhone = ref(false);
const phone = ref('');

const props = defineProps({
  id: Number,
  id_user_owner_ads: Number,
  description: String,
  price: Number,
  place: {
    type: String,
    default: 'Не указано',
  },
  callNumber: String,
  messageEmail: String,
  brand: String,
  model: String,
  year: String,
  username: String,
  horizontal: {
    type: Boolean,
    default: false,
  },
  is_in_favorites: {
    type: Number,
    default: 1,
  },
  images: Array,
  created_at: String,
  is_published: Number,
});

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const formattedUsername = computed(() =>
  capitalize(props.username || 'Имя не указано')
);
const url = computed(() => {
  return [
    props.brand?.toLowerCase(),
    props.model?.toLowerCase(),
    props.year?.toLowerCase(),
    props.id,
  ]
    .filter(Boolean)
    .join('-');
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const toggleLoginModal = () => loginModalStore.toggleLoginModal();

const openChat = async () => {
  router.push('/profile/messages');
};

const fetchPhoneNumber = async () => {
  try {
    const response = await seeContact({ ads_id: props.id });
    if (response.success) {
      phone.value = response.phone;
      showPhone.value = true;
    }
  } catch (error) {
    console.error('Ошибка при получении телефона:', error);
  }
};

const handleCallClick = async () => {
  if (isLoggedIn.value) {
    await fetchPhoneNumber();
    if (phone.value) makeCall();
  }
};

const makeCall = () => (window.location.href = `tel:${phone.value}`);

const calculateTimeAgo = (dateString) => {
  const timeUnits = {
    seconds: ['секунда', 'секунды', 'секунд'],
    minutes: ['минута', 'минуты', 'минут'],
    hours: ['час', 'часа', 'часов'],
    days: ['день', 'дня', 'дней'],
  };

  const getDeclension = (number, unit) => {
    if (number % 10 === 1 && number % 100 !== 11) return unit[0];
    if (
      number % 10 >= 2 &&
      number % 10 <= 4 &&
      (number % 100 < 10 || number % 100 >= 20)
    )
      return unit[1];
    return unit[2];
  };

  const diff = new Date() - new Date(dateString);
  const units = [1000, 60, 60, 24];
  let time = diff;
  let unitIndex = 0;

  for (let i = 0; i < units.length; i++) {
    time = Math.floor(time / units[i]);
    if (time >= 1) {
      unitIndex = i;
    } else {
      break;
    }
  }

  const unitNames = Object.keys(timeUnits);
  const unit = unitNames[unitIndex];
  const value = time;

  return `${value} ${getDeclension(value, timeUnits[unit])} назад`;
};

const timeAgo = computed(() => calculateTimeAgo(props.created_at));
</script>

<style scoped lang="scss">
.card {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 120px;
  width: 100%;
  background: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;

  &__image {
    &--dimmed {
      background-color: var(--white);
      opacity: 0.7;
    }
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 16px;
    background: var(--white);

    @media (max-width: 1000px) {
      padding: 12px 16px;
    }
  }

  &__title {
    font-weight: bold;
    font-size: 16px;
    color: var(--primary);
    text-decoration: none;
    margin-bottom: 4px;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  &__location,
  &__date {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 16px;
  }

  &__price,
  &__currency {
    color: var(--text-main);
    font-weight: 700;
    line-height: 18px;
    font-size: 14px;
  }

  &__block {
    display: flex;
    column-gap: 6px;
    margin-bottom: 4px;
  }

  &__section {
    display: flex;
    column-gap: 30px;

    @media (max-width: 1200px) {
      flex-direction: column;
    }

    @media (max-width: 1000px) {
      display: none;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 12px;
    margin-top: auto;
    color: var(--color-text-select);
  }

  &__more {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px;
    gap: 40px;

    @media (max-width: 1200px) {
      gap: 40px;
    }

    @media (max-width: 1000px) {
      padding: 12px 0;
      padding-right: 12px;
    }
  }

  &__part {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__state {
    color: var(--text-main);
    font-size: 14px;
  }

  &__username {
    font-weight: bold;
    font-size: 16px;
    width: 200px;
    color: #000;
    margin-right: auto;
  }

  &__buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    &__hidden {
      visibility: hidden;
    }

    @media (max-width: 1200px) {
      width: fit-content;
      margin-top: 8px;
      gap: 12px;
    }

    @media (max-width: 1000px) {
      width: fit-content;
      gap: 12px;
    }
  }

  .button {
    border: none;
    height: 34px;
    width: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    color: var(--primary);
    background-color: #d6efff;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #9ed2f1;
    }

    @media (max-width: 1000px) {
      height: 28px;
      width: 28px;
    }
  }
}

.swiper {
  width: 120px;
  height: 100%;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 120px;
  }
}
</style>
