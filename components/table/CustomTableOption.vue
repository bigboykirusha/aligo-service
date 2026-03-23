<template>
   <span class="table-status" :class="`table-status--${tone}`">
      {{ label }}
   </span>
</template>

<script setup>
defineProps({
   label: {
      type: String,
      default: ''
   },
   tone: {
      type: String,
      default: 'neutral'
   }
})
</script>

<style scoped lang="scss">
.table-status {
   font-size: 12px;
   line-height: 1.35;
   font-weight: 600;
   color: #323232;
}

.table-status--muted,
.table-status--neutral {
   color: #787878;
}

.table-status--info {
   color: #3366ff;
}

.table-status--success {
   color: #3bbc71;
}

.table-status--warning {
   color: #f2994a;
}

.table-status--danger {
   color: #ff5959;
}
</style>
