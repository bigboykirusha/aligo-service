<template>
  <div :class="['card', { 'card--not-confirmed': isEmailNotConfirmed }]">
    <!-- Checkbox -->
    <div v-if="!isArchivePage && !isUnderModeration" class="card__checkbox">
      <CheckboxUI
        :model-value="isSelected"
        @update:model-value="toggleSelection"
        :showLabel="false"
      />
    </div>

    <!-- Image Section -->
    <div
      v-if="images.length"
      :class="[
        'card__image',
        {
          'card__image--dimmed':
            isArchivePage || isUnderModeration || isEmailNotConfirmed,
        },
      ]"
    >
      <Swiper
        :modules="[SwiperAutoplay, SwiperPagination]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        :loop="true"
      >
        <SwiperSlide v-for="(image, index) in images" :key="index">
          <img
            class="card__img"
            :src="getImageUrl(image.arr_title_size.middle, placeholder)"
            alt="Slide Image"
            preload
          />
        </SwiperSlide>
      </Swiper>
    </div>
    <img
      v-else
      :src="placeholder"
      alt="Placeholder image"
      class="card__image"
    />

    <!-- Card Body -->
    <div class="card__section">
      <!-- Popup Dialog -->
      <div
        ref="popupRef"
        @pointerdown.stop
        class="popup-main"
        :class="{ 'popup-main--active': showPopup }"
      >
        <ul class="popup-main__list">
          <li
            class="popup-main__item"
            v-for="(option, index) in popupOptions"
            :key="index"
            @click="option.action"
          >
            <img
              :src="option.icon"
              :alt="option.text"
              class="popup-main__icon"
            />
            {{ option.text }}
          </li>
        </ul>
        <button class="popup__close-button" @click="togglePopup">
          <img :src="closeIcon" alt="Close icon" />
        </button>
      </div>

      <!-- Card Details -->
      <div class="card__body">
        <div class="card__container">
          <!-- Title -->
          <nuxt-link
            v-if="!isDraft && !isArchivePage"
            :to="`/car/${url}`"
            class="card__title"
          >
            {{ displayTitle }}
          </nuxt-link>
          <span v-else class="card__title card__title--inactive">
            {{ displayTitle }}
          </span>

          <div class="card__block">
            <!-- Status -->
            <span v-if="isEmailNotConfirmed" class="card__accept-title"
              >Объявление не опубликовано</span
            >
            <span v-if="delete_after_days" class="card__accept-title"
              >Удалится через {{ delete_after_days }} дней</span
            >
            <span v-else-if="price" class="card__price"
              >{{ formatNumberWithSpaces(Number(price)) }} ₽</span
            >
            <span v-else class="card__price card__price--skinny"
              >Цена не указана</span
            >
          </div>

          <!-- Email Confirmation -->
          <div v-if="isEmailNotConfirmed" class="card__accept">
            <p>
              Подтвердите адрес электронной почты для публикации объявления.
            </p>
            <p>
              Это можно сделать в
              <nuxt-link class="blue-dec">Управлении профилем</nuxt-link> или
              при изменении объявления.
            </p>
          </div>

          <!-- Description -->
          <div
            v-else
            :class="[
              'card__description',
              { 'card__description--main': !isArchivePage && !isDraft },
            ]"
          >
            {{ description || 'Описание не указано' }}
          </div>

          <div v-if="!isArchivePage && !isDraft" :class="['card__stat']">
            <div class="button">
              <span class="button__text">{{ actionStatus }}</span>
            </div>
            <div class="button__block">
              <div class="button" v-for="(icon, idx) in statsIcons" :key="idx">
                <img :src="icon.src" :alt="icon.alt" class="button__icon" />
                <span class="button__text">{{ icon.count }}</span>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div v-if="!isEmailNotConfirmed" class="card__info">
            <div class="card__location">{{ place || 'Адрес не указан' }}</div>
          </div>
        </div>
      </div>

      <!-- More Actions -->
      <div class="card__more">
        <div v-if="!isDraft && !isArchivePage" class="card__more-column">
          <div class="button">
            <span class="button__text">{{ actionStatus }}</span>
          </div>
          <div class="button__block">
            <div class="button" v-for="(icon, idx) in statsIcons" :key="idx">
              <img :src="icon.src" :alt="icon.alt" class="button__icon" />
              <span class="button__text">{{ icon.count }}</span>
            </div>
          </div>
        </div>
        <div
          :class="[
            'card__more-row',
            { 'card__more-row--hidden': isUnderModeration },
          ]"
        >
          <div
            v-if="isDraft || isArchivePage"
            :class="['button-2']"
            @click="handleButtonMainClick"
          >
            <img :src="buttonIcon" alt="Action icon" class="button-2__icon" />
            <span class="button-2__text">{{ buttonText }}</span>
          </div>
          <div
            v-if="!delete_after_days"
            class="button-2"
            @click="handleButtonClick"
          >
            <img :src="actionIcon" alt="Action icon" class="button-2__icon" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popups -->
  <PopupDialog
    v-if="showPopupDialog"
    :message="popupMessage"
    :confirmText="confirmText"
    :cancelText="cancelText"
    :closeIcon="closeIcon"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="closePopup"
  />
</template>

<script setup>
import {
  ref,
  computed,
  watchEffect,
  defineEmits,
  defineProps,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { useSelectedAdsStore } from '@/store/selectedAds.js';
import { formatNumberWithSpaces } from '@/services/amountUtils.js';
import { useSelectedDraftsStore } from '@/store/selectedDrafts.js';
import { getImageUrl } from '@/services/imageUtils.js';
import {
  deleteFromArchive,
  publishFromMainTab,
  publishFromArchive,
} from '@/services/apiClient.js';
import { useRouter } from 'vue-router';

import deleteIcon from '@/assets/icons/delete.svg';
import optionsIcon from '@/assets/icons/options.svg';
import rocketIcon from '@/assets/icons/roket.svg';
import editIcon from '@/assets/icons/edit.svg';
import againIcon from '@/assets/icons/again.svg';
import personIcon from '@/assets/icons/person.svg';
import favIcon from '@/assets/icons/fav.svg';
import eyeIcon from '@/assets/icons/eye.svg';
import archiveIcon from '@/assets/icons/archive.svg';
import stopIcon from '@/assets/icons/stop.svg';
import closeIcon from '@/assets/icons/close.svg';
import placeholder from '@/assets/icons/placeholder.png';

const props = defineProps({
  id: Number,
  main_id: Number,
  description: String,
  price: [Number, String],
  place: String,
  brand: String,
  model: String,
  year: String,
  is_published: Number,
  is_moderation: Number,
  is_not_confirmed_email: Number,
  count_who_view_seller_contact: { type: Number, default: 0 },
  count_add_to_favorite: { type: Number, default: 0 },
  count_go_ad_page: { type: Number, default: 0 },
  delete_after_days: { type: Number, default: null },
  images: Array,
  created_at: String,
  pageType: String,
});

const router = useRouter();
const emit = defineEmits(['updateData', 'deleteAd']);
let store = ref(null);

const url = computed(() => {
  return [
    props.brand?.toLowerCase() ?? '',
    props.model?.toLowerCase() ?? '',
    props.year?.toLowerCase() ?? '',
    props.id ?? '',
  ]
    .filter(Boolean)
    .join('-');
});

watchEffect(() => {
  store.value =
    props.pageType === 'all' ? useSelectedAdsStore() : useSelectedDraftsStore();
});

const showPopup = ref(false);
const showPopupDialog = ref(false);
const popupMessage = ref('');
const confirmText = ref('');
const cancelText = ref('');
const popupAction = ref(null);
const popupRef = ref(null);

const openPopup = (type) => {
  showPopupDialog.value = true;
  switch (type) {
    case 'delete':
      popupMessage.value = 'Вы уверены, что хотите удалить объявление?';
      confirmText.value = 'Удалить';
      cancelText.value = 'Отменить';
      popupAction.value = confirmDelete;
      break;
    case 'archive':
      popupMessage.value =
        'Вы уверены, что хотите перенести объявление в архив?';
      confirmText.value = 'Перенести';
      cancelText.value = 'Отменить';
      popupAction.value = confirmArchive;
      break;
    case 'unpublish':
      popupMessage.value =
        'Вы уверены, что хотите снять объявление с публикации?';
      confirmText.value = 'Снять';
      cancelText.value = 'Отменить';
      popupAction.value = confirmUnpublish;
      break;
    case 'publish':
      popupMessage.value =
        'Вы уверены, что хотите опубликовать это объявление?';
      confirmText.value = 'Опубликовать';
      cancelText.value = 'Отменить';
      popupAction.value = confirmPublishAgain;
      break;
    case 'edit':
      popupMessage.value =
        'Вы уверены, что хотите отредактировать это объявление?';
      confirmText.value = 'Редактировать';
      cancelText.value = 'Отменить';
      popupAction.value = editAd;
      break;
    case 'restore':
      popupMessage.value =
        'Вы уверены, что хотите восстановить это объявление?';
      confirmText.value = 'Восстановить';
      cancelText.value = 'Отменить';
      popupAction.value = restoreFromArchive;
      break;
    default:
      popupMessage.value = 'Что-то пошло не так!';
      confirmText.value = 'Ок';
      cancelText.value = 'Закрыть';
      popupAction.value = null;
      break;
  }
};

const handleConfirm = () => {
  popupAction.value();
  closePopup();
};

const handleCancel = () => {
  closePopup();
};

const closePopup = () => {
  showPopupDialog.value = false;
};

const confirmDelete = async () => {
  await deleteFromArchive(props.id);
  emit('updateData');
};

const confirmArchive = async () => {
  await store.value.deleteAds([props.id]);
  emit('deleteAd', props.id);
};

const confirmUnpublish = async () => {
  await store.value.takeOffPublication([props.id]);
  emit('updateData');
};

const editAd = async () => {
  router.push('/create');
};

const restoreFromArchive = async () => {
  await publishFromArchive(props.id);
  emit('deleteAd', props.id);
};

const confirmPublishAgain = async () => {
  await publishFromMainTab(props.id);
  emit('updateData', props.id);
};

const isSelected = computed(() =>
  store.value?.selectedAdIds.includes(props.id)
);

const toggleSelection = (value) => {
  if (value) {
    store.value.selectedAdIds.push(props.id);
  } else {
    store.value.selectedAdIds = store.value.selectedAdIds.filter(
      (id) => id !== props.id
    );
  }
};
const isDraft = computed(() => props.pageType === 'drafts');
const isArchivePage = computed(() => props.pageType === 'archive');
const isAdPublished = computed(() => props.is_published === 1);
const isUnderModeration = computed(() => props.is_moderation === 1);
const isEmailNotConfirmed = computed(() => props.is_not_confirmed_email === 1);

const buttonIcon = computed(() =>
  isAdPublished.value ? rocketIcon : isDraft.value ? editIcon : againIcon
);
const actionIcon = computed(() =>
  isDraft.value ? archiveIcon : isArchivePage.value ? deleteIcon : optionsIcon
);
const actionStatus = computed(() =>
  isAdPublished.value
    ? 'Опубликовано'
    : isUnderModeration.value
    ? 'На модерации'
    : 'Снято с публикации'
);
const buttonText = computed(() =>
  isAdPublished.value
    ? 'Продвигать'
    : isDraft.value
    ? 'Продолжить'
    : props.delete_after_days
    ? 'Восстановить'
    : 'Вернуть в черновики'
);
const statsIcons = computed(() => [
  { src: eyeIcon, alt: 'Просмотры', count: props.count_go_ad_page },
  { src: favIcon, alt: 'В избранном', count: props.count_add_to_favorite },
  {
    src: personIcon,
    alt: 'Контакты',
    count: props.count_who_view_seller_contact,
  },
]);

const displayTitle = computed(() => {
  if (!props.brand) return 'Без названия';
  const { brand, model, year } = props;
  return [brand, model, year].filter(Boolean).join(year ? ', ' : ' ');
});

const popupOptions = computed(() => {
  if (isAdPublished.value) {
    return [
      {
        text: 'Редактировать',
        icon: editIcon,
        action: () => openPopup('edit'),
      },
      {
        text: 'Снять с публикации',
        icon: stopIcon,
        action: () => openPopup('unpublish'),
      },
      {
        text: 'Переместить в архив',
        icon: archiveIcon,
        action: () => openPopup('archive'),
      },
    ];
  }
  return [
    { text: 'Редактировать', icon: editIcon, action: () => openPopup('edit') },
    {
      text: 'Опубликовать снова',
      icon: againIcon,
      action: () => openPopup('publish'),
    },
    {
      text: 'Переместить в архив',
      icon: archiveIcon,
      action: () => openPopup('archive'),
    },
  ];
});

const handleButtonClick = async () => {
  if (isDraft.value) {
    openPopup('archive');
  } else if (props.pageType === 'all') {
    togglePopup();
  } else if (isArchivePage.value) {
    openPopup('delete');
  }
};

const handleButtonMainClick = async () => {
  if (isArchivePage.value) {
    try {
      openPopup('restore');
    } catch (error) {
      console.error('Ошибка при публикации объявления: ', error);
    }
  } else if (isDraft.value) {
    try {
      openPopup('edit');
    } catch (error) {
      console.error('Ошибка при загрузке черновика: ', error);
    }
  }
};

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};

const handleClickOutside = (event) => {
  const isOutside = popupRef.value && !popupRef.value.contains(event.target);
  if (isOutside) showPopup.value = false;
};

onMounted(() => document.addEventListener('pointerdown', handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', handleClickOutside)
);
</script>

<style scoped lang="scss">
.card {
  display: flex;
  min-height: 200px;
  position: relative;
  flex-direction: row;
  background: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
  border-radius: 6px;
  transition: transform 0.3s, box-shadow 0.3s;

  &--not-confirmed {
    border-color: #ff4d4f;
    background-color: var(--white) 6df;
  }

  @media (max-width: 768px) {
    min-height: 160px;
  }

  @media (max-width: 480px) {
    min-height: 145px;
  }

  &:hover {
    .card__buttons {
      transform: none;
      opacity: 1;
    }
  }

  &__image {
    width: 200px;
    max-height: 200px;
    object-fit: cover;
    cursor: pointer;

    &--dimmed {
      background-color: var(--white);
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      width: 160px;
      max-height: 160px;
    }

    @media (max-width: 480px) {
      width: 125px;
      max-height: 145px;
    }
  }

  &__title {
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    color: var(--primary);
    cursor: pointer;
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__section {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  &__block {
    display: flex;
    gap: 5px;
  }

  &__price,
  &__currency,
  &__accept-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: var(--text-main);
  }

  &__location,
  &__date {
    font-size: 12px;
    color: var(--color-explain);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__body {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 24px;
    padding-right: 0;

    @media (max-width: 1280px) {
      flex-direction: row;
      justify-content: space-between;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      padding: 16px;
    }
  }

  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__stat {
    display: none;

    @media (max-width: 1024px) {
      display: flex;
      margin-top: auto;
      flex-direction: column;
      gap: 8px;
    }
  }

  &__more {
    display: flex;
    gap: 70px;
    height: 100%;
    flex-direction: row;
    padding: 24px;
    margin-left: auto;
    justify-content: space-between;

    @media (max-width: 768px) {
      padding: 16px;
    }

    @media (max-width: 480px) {
      padding-left: 0;
    }
  }

  &__more-column {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__more-row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: fit-content;
    justify-content: flex-end;
    margin-left: auto;

    &--hidden {
      visibility: hidden;
    }

    @media (max-width: 768px) {
      margin-left: 0;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  &__accept {
    color: var(--text-main);

    p {
      font-size: 14px;
      font-weight: 18px;
    }
  }

  &__description {
    font-size: 14px;
    line-height: 18px;
    color: var(--text-main);
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 1280px) {
      -webkit-line-clamp: 3;
    }

    &--main {
      @media (max-width: 1024px) {
        display: none;
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__info {
    margin-top: auto;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 14px;
    background: #eef9ff;
    border-radius: 12px;
    font-size: 14px;
    transition: background-color 0.3s;
    width: fit-content;
    text-wrap: nowrap;

    @media (max-width: 480px) {
      padding: 3px 8px;
    }

    &__icon {
      height: 14px;

      @media (max-width: 768px) {
        height: 12px;
      }
    }

    &__block {
      display: flex;
      flex-direction: column;
      gap: 14px;

      @media (max-width: 1024px) {
        flex-direction: row;
        gap: 6px;
      }
    }

    &__text {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: var(--primary);
    }
  }

  .button-2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 34px;
    padding: 0 9px;
    background: #d6efff;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    width: fit-content;
    height: 34px;

    &__icon {
      height: 16px;
    }

    &__text {
      font-weight: 400;
      font-size: 14px;
      color: var(--primary);
      text-wrap: nowrap;

      @media (max-width: 1200px) {
        display: none;
      }
    }

    &--not-confirmed {
      background-color: var(--primary);
      color: var(--white);
      padding: 0 18px;

      .button-2__text {
        color: var(--white);

        @media (max-width: 1200px) {
          display: block;
        }
      }
    }

    &:hover {
      background: #9ed2f1;
    }
  }
}

.card__checkbox {
  position: absolute;
  top: 16px;
  z-index: 5;
  left: 16px;
  min-width: 16px;
  min-height: 16px;
}

.swiper {
  height: 200px;
  width: 200px;
  border-radius: 6px 0 0 6px;

  @media (max-width: 768px) {
    height: 160px;
    width: 160px;
  }

  @media (max-width: 480px) {
    height: 145px;
    width: 125px;
  }

  img {
    height: 200px;
    width: 200px;
    width: 100%;
    object-fit: cover;

    @media (max-width: 768px) {
      height: 160px;
      width: 160px;
    }

    @media (max-width: 480px) {
      height: 145px;
      width: 125px;
    }
  }
}

.popup-main {
  position: absolute;
  background-color: var(--white);
  top: 24px;
  right: 24px;
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 9;
  transform: scale(0);
  transform-origin: top right;
  transition: transform 0.2s ease;

  &--active {
    transform: scale(1);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    top: 0;
    right: 0;
    display: flex;
    transform: scale(0);
    border-radius: 0 8px 8px 0;
    border: none;
    width: calc(100% - 145px);
    padding: 12px;
  }

  &--active {
    @media (max-width: 480px) {
      transform: scale(1);
    }
  }

  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;

    @media (max-width: 768px) {
      gap: 3px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  }

  &__item {
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

  &__icon {
    height: 14px;
    margin-right: 8px;
  }
}

.popup__close-button {
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  background: #d6efff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: background-color 0.2s ease;

  @media (max-width: 480px) {
    display: flex;
  }

  img {
    height: 16px;
  }
}

.blue-dec {
  color: var(--primary);
  cursor: pointer;
}
</style>
