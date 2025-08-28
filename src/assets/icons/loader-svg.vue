<template>
  <div class="preloder">
    <span class="preloder-spinner" :style="spinnerStyle"></span>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  size: {
    type: [String, Number],
    default: 16,
  },
  color: {
    type: String,
    default: '#3366FF',
  },
  background: {
    type: String,
    default: '#ffffff',
  },
});

const spinnerStyle = computed(() => {
  const size = `${props.size}px`;
  const borderWidth = `calc(${size} / 8)`;

  return {
    width: size,
    height: size,
    borderWidth: borderWidth,
    borderStyle: 'solid',
    borderColor: props.background,
    borderTopColor: props.color,
    boxSizing: 'border-box',
  };
});
</script>

<style scoped lang="scss">
.preloder {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &-spinner {
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>
