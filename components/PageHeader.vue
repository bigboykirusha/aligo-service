<template>
   <header class="page-header">
      <h1>{{ pageTitle }}</h1>
   </header>
</template>

<script setup>
import { computed } from 'vue'
import { useCityStore } from '~/store/city'

const cityStore = useCityStore()

const pageTitle = computed(
   () =>
      `\u0410\u0432\u0442\u043e\u0442\u043e\u0432\u0430\u0440\u044b \u0432 \u0433. ${cityStore.selectedCity?.name || ''}`
)
</script>

<style scoped>
.page-header {
   width: 100%;
   max-width: 1312px;
   padding: 0 16px;
   margin: var(--app-header-content-offset-desktop) auto 16px;

   @media (max-width: 768px) {
      margin-top: var(--app-header-content-offset-mobile);
   }
}

.page-header h1 {
   color: var(--color-text-accent);
   font-size: var(--font-size-20);
   line-height: var(--line-height-20);
   font-weight: 700;
}
</style>
