<template>
  <div class="status-indicator">
    <span :class="['status-indicator__dot', statusColorClass]"></span>
    <span class="status-indicator__text">{{ title }}</span>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['gray', 'green', 'yellow', 'red'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
});

const statusColorClass = computed(() => {
  return `status-indicator__dot--${props.status}`;
});
</script>

<style scoped lang="scss">
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-main);

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--gray {
      background-color: #bdbdbd;
    }

    &--green {
      background-color: #00c853;
    }

    &--yellow {
      background-color: #ffd600;
    }

    &--red {
      background-color: #ff1744;
    }
  }

  &__text {
    font-weight: 400;
  }
}
</style>
