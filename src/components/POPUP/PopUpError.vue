<template>
  <div class="popup__content">
    <ClosureSvg class="popup__svg-closure" @click="$emit('closing')" />
    <p class="popup__title small-title">Отчет об ошибках ({{ data.length }})</p>
    <ul class="popup__error-list">
      <li class="popup__error-item" v-for="(item, index) in data" :key="index">
        {{ index + 1 }}. <a :href="item.path">{{ item.title }}</a>
        <ul>
          <li v-for="(error, i) in item.errors" :key="i">{{ error }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import ClosureSvg from '@/assets/icons/close-gray';

defineProps({
  id: String,
  data: Object,
});
// emits: ['closing', 'success'],
</script>
<style scoped lang="scss">
.popup {
  &__error-item {
    width: 100%;
  }
}
</style>
