<template>
  <div class="profile__switcher">
    <div
      v-for="(item, index) in switcherItems"
      :key="index"
      class="profile__item"
      :class="{ 'profile__item--active': modelValue === item }"
      @click="handleSwitch(item)"
    >
      {{ item }}
    </div>
    <div class="profile__indicator" :style="indicatorStyle"></div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  switcherItems: Array,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const indicatorStyle = computed(() => {
  const index = props.switcherItems.indexOf(props.modelValue);
  const percentage = (index / props.switcherItems.length) * 100;
  return {
    width: `${100 / props.switcherItems.length}%`,
    left: `${percentage}%`,
  };
});

const handleSwitch = (item) => {
  emit('update:modelValue', item);
};
</script>

<style lang="scss" scoped>
.profile__switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 20px;
  margin-bottom: 16px;
  min-height: 40px;
  border: 1px solid var(--color-stroke);
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0;
    gap: 8px;
    margin-bottom: 8px;
  }
}

.profile__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;

  &--active {
    color: var(--primary);
    font-weight: 700;
  }

  &:hover {
    color: #003bce;
  }
}

.profile__indicator {
  position: absolute;
  bottom: 0;
  height: 4px;
  background-color: var(--primary);
  transition: left 0.3s ease, width 0.3s ease;
  border-radius: 2px;
}
</style>
