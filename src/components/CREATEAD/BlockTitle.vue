<template>
   <div class="block-title">
      {{ text }}
   </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
   text: {
      type: String,
      required: true
   }
});
</script>

<style lang="scss" scoped>
.block-title {
   font-weight: 700;
   font-size: 14px;
   color: #323232;
}
</style>
