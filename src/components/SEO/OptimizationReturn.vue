<template>
  <div class="optimization__main-manu">
    <div class="optimization__manu-item">
      <ButtonUI
        svg="back-arrow-svg"
        buttonClass="btn--second"
        @action="() => $router.back()"
      />
      <p class="optimization__manu-title">{{ title }}</p>
    </div>
    <div class="optimization__manu-item">
      <slot name="option-slot" :emitEvent="handleSlotClick"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import ButtonUI from '@/components/UI/ButtonUI.vue';

const emit = defineEmits(['slot-clicked']);

defineProps({
  title: String,
});

const handleSlotClick = (eventType) => {
  emit('slot-clicked', eventType);
};
</script>
<style scoped lang="scss">
.optimization {
  &__main {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.14);
    margin: 16px 12px 16px 0px;
    padding: 12px 24px;
    flex-direction: column;

    @media (max-width: 1024px) {
      margin: 16px 12px 16px 12px;
    }
    &-manu {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
  }
  &__manu-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &__manu-title {
    font-size: 16px;
    font-weight: 700;
    color: #003bce;
  }
}
</style>
