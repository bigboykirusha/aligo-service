<template>
  <div class="loader-ui">
    <div
      class="loader-ui__spinner"
      :style="spinnerStyle"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: '#3366ff'
  },
  trackColor: {
    type: String,
    default: ''
  }
})

const spinnerStyle = computed(() => {
  const borderWidth = Math.max(2, props.size / 8)
  const resolvedTrackColor = props.trackColor || `${props.color}33`

  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    borderWidth: `${borderWidth}px`,
    borderColor: resolvedTrackColor,
    borderTopColor: props.color
  }
})
</script>

<style scoped lang="scss">
.loader-ui {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-ui__spinner {
  border-radius: 50%;
  border-style: solid;
  animation: loader-ui-spin 0.8s linear infinite;
}

@keyframes loader-ui-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
