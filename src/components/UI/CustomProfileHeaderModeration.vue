<template>
  <div class="profile__header">
    <button @click="goBack" class="profile__back-button">
      <img :src="backIcon" alt="Назад" class="profile__back-icon" />
    </button>

    <div class="profile__main">
      <div class="profile__info-block">
        <div class="profile__info-title">
          {{ title ? `${title} (#${uniqueCode})` : `#${uniqueCode}` }}
        </div>
        <div class="profile__info-date">
          {{ formattedDate }}
        </div>
      </div>

      <div class="profile__meta-block">
        <div class="profile__moderator">
          {{ moderator }} <span class="profile__phone">[{{ phone }}]</span>
        </div>
        <div class="profile__address">
          {{ address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';

const props = defineProps({
  title: String,
  uniqueCode: [String, Number],
  goBack: Function,
  backIcon: String,
  phone: String,
  address: String,
  date: String,
  moderator: {
    type: String,
    default: 'Сергей Олегович',
  },
});

const { title, uniqueCode, goBack, backIcon, phone, address, date, moderator } =
  toRefs(props);

const formattedDate = computed(() => {
  if (!date?.value) return '';
  const d = new Date(date.value);

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} | ${hours}:${minutes}`;
});
</script>

<style lang="scss">
.profile__header {
  display: flex;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-block);
  margin-bottom: 24px;
}

.profile__back-button {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d6efff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a4dcff;
  }
}

.profile__back-icon {
  width: 14px;
}

.profile__main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.profile__info-block {
  display: flex;
  flex-direction: column;
}

.profile__info-title {
  color: #003bce;
  font-size: 16px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.profile__info-date {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-main);
}

.profile__meta-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.profile__moderator {
  font-size: 14px;
  line-height: 18px;
  color: var(--text-main);
  font-weight: 700;
}

.profile__address {
  font-size: 14px;
  line-height: 18px;
  color: var(--text-main);
}
</style>
