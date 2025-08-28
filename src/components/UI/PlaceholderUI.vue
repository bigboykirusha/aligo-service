<template>
  <div class="placeholder-block">
    <img :src="image" alt="Плейсхолдер" />
    <div class="placeholder-block__text">{{ title }}</div>
    <div class="placeholder-block__description">{{ description }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  image: {
    type: String,
    default: () => '@/assets/icons/ad-sad.svg',
  },
  title: {
    type: String,
    default: () => 'Ничего не найдено',
  },
  description: {
    type: String,
    default: () => 'Похоже, здесь пока пусто.',
  },
});
</script>

<style scoped lang="scss">
.placeholder-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  margin: auto;
  margin-top: 200px;

  img {
    height: 56px;
  }

  &__text {
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: var(--text-main);
  }

  &__description {
    font-size: 14px;
    color: var(--text-main);
  }
}
</style>
