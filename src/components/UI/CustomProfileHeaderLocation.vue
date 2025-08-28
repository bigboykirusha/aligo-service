<template>
  <div class="simple-header">
    <button @click="goBack" class="simple-header__back-button">
      <img :src="backIcon" alt="Назад" class="simple-header__back-icon" />
    </button>
    <h1 class="simple-header__title">{{ title }}</h1>
  </div>
</template>

<script setup>
import { defineProps, toRefs } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  goBack: {
    type: Function,
    required: true,
  },
  backIcon: {
    type: String,
    required: true,
  },
});

const { title, goBack, backIcon } = toRefs(props);
</script>

<style lang="scss">
.simple-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-block);
  margin-bottom: 24px;
}

.simple-header__back-button {
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

.simple-header__back-icon {
  width: 14px;
}

.simple-header__title {
  font-size: 16px;
  margin: 0;
  font-weight: 700;
  color: #003bce;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}
</style>
