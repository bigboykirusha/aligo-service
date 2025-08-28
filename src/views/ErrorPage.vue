<template>
  <div class="container">
    <NotFound />
  </div>
</template>

<script setup>
import NotFound from '@/components/NotFound.vue';
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
</style>
