<template>
   <span class="badge" :style="{ backgroundColor: color }">
      {{ text }}
   </span>
</template>

<script setup>
defineOptions({
   name: 'BadgeItem'
})

defineProps({
   text: {
      type: String,
      required: true
   },
   color: {
      type: String,
      default: '#999999'
   }
})
</script>

<style lang="scss" scoped>
.badge {
   display: flex;
   align-items: center;
   width: fit-content;
   height: 16px;
   padding: 0 6px;
   font-size: 10px;
   font-weight: 700;
   border-radius: 4px;
   color: #323232;
   line-height: 1;
   box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
   white-space: nowrap;
}
</style>
