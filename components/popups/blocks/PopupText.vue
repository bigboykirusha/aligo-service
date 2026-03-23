<template>
   <component :is="tag" class="popup-text" :class="[
      `popup-text--${tone}`,
      `popup-text--${size}`,
      {
         'popup-text--center': center
      }
   ]">
      <slot>{{ text }}</slot>
   </component>
</template>

<script setup>
defineProps({
   text: {
      type: String,
      default: ''
   },
   tag: {
      type: String,
      default: 'p'
   },
   tone: {
      type: String,
      default: 'default' // default | muted | danger
   },
   size: {
      type: String,
      default: 'md' // sm | md
   },
   center: {
      type: Boolean,
      default: false
   }
})
</script>

<style scoped lang="scss">
.popup-text {
   margin: 0;
   color: var(--popup-color-text, #323232);

   &--md {
      font-size: 14px;
      line-height: 18px;
   }

   &--sm {
      font-size: 12px;
      line-height: 16px;
   }

   &--muted {
      color: var(--popup-color-text-muted, #787878);
   }

   &--danger {
      color: #c62828;
   }

   &--center {
      text-align: center;
   }
}
</style>
