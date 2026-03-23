<template>
   <component
      :is="tag"
      class="popup-stack"
      :class="[
         gapClass,
         {
            'popup-stack--top-pad': topPad,
            'popup-stack--stretch': stretch
         }
      ]"
   >
      <slot />
   </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
   tag: {
      type: String,
      default: 'div'
   },
   gap: {
      type: String,
      default: 'md' // sm | md | lg
   },
   topPad: {
      type: Boolean,
      default: false
   },
   stretch: {
      type: Boolean,
      default: false
   }
})

const gapClass = computed(() => {
   if (props.gap === 'sm') return 'popup-stack--gap-sm'
   if (props.gap === 'lg') return 'popup-stack--gap-lg'
   return 'popup-stack--gap-md'
})
</script>

<style scoped lang="scss">
.popup-stack {
   display: flex;
   flex-direction: column;
   min-width: 0;

   &--gap-sm {
      gap: 12px;
   }

   &--gap-md {
      gap: 16px;
   }

   &--gap-lg {
      gap: 24px;
   }

   &--top-pad {
      padding-top: 16px;
   }

   &--stretch {
      width: 100%;
   }
}
</style>
