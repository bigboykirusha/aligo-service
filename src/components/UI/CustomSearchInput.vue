<template>
  <div class="search-input">
    <img :src="icon" alt="Иконка поиска" class="search-input__icon" />
    <input type="text" :placeholder="placeholder" class="search-input__field" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: 'Поиск...',
  },
  icon: {
    type: String,
    required: true,
  },
});
/* Исправить модель  по сути тут value должно связываться а его вообще нет*/
</script>

<style scoped lang="scss">
.search-input {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: 6px;
  width: 100%;
  max-width: 270px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--color-stroke);

  &__icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  &__field {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: var(--text-main);

    &::placeholder {
      color: #a0a0a0;
    }
  }
}
</style>
