<template>
   <div class="header-with-icon" :title="`Подсказка для ${title}`">
      <span>{{ title }}</span>
      <img v-if="icon" :src="icon" class="header-icon" />
   </div>
</template>

<script setup>

const props = defineProps({
   title: String,
   icon: {
      type: String,
      default: '@/assets/icons/tooltip.svg'
   }
});
</script>

<style scoped>
.header-with-icon {
   display: flex;
   align-items: center;
   white-space: nowrap;

}

.header-icon {
   width: 16px;
   height: 16px;
   margin-left: 4px;
}
</style>