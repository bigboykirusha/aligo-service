<template>
  <MainLayouts>
    <router-view />
  </MainLayouts>
</template>

<script setup>
import MainLayouts from '@/layouts/MainLayouts';
import { onMounted } from 'vue';

const setMetaTags = () => {
  document.title = 'Admin';

  const metaDescription = document.createElement('meta');
  metaDescription.name = 'description';
  document.head.appendChild(metaDescription);
};

onMounted(() => {
  setMetaTags();
});
</script>
