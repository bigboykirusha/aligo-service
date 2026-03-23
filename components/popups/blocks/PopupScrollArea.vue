<template>
  <component
    :is="tag"
    class="popup-scroll-area"
    :style="{
      '--popup-scroll-area-max-height': normalizedMaxHeight
    }"
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
  maxHeight: {
    type: [String, Number],
    default: '400px'
  }
})

const normalizedMaxHeight = computed(() =>
  typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
)
</script>

<style scoped lang="scss">
.popup-scroll-area {
  max-height: var(--popup-scroll-area-max-height, 400px);
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 6px;
  }
}
</style>
