<template>
  <div class="ui-steps">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="ui-step"
      :class="{
        'ui-step--current': index === currentStep,
        'ui-step--completed': index < currentStep,
      }"
    >
      <div class="ui-step__box">
        <StepsOk v-if="index < currentStep" class="ui-step__box-icon" />
        <span v-else class="ui-step__number">{{ index + 1 }}</span>
        <span class="ui-step__circle"></span>
        <span class="ui-step-label">{{ step }}</span>
      </div>

      <StepsIcon
        v-if="index < steps.length - 1"
        class="ui-step__icon"
        :class="{
          'ui-step__icon--current': index === currentStep,
          'ui-step__icon--completed': index < currentStep,
        }"
      />
    </div>
  </div>
</template>

<script setup>
import StepsIcon from '@/assets/icons/steps-arrow-svg';
import StepsOk from '@/assets/icons/step-ok-svg';
import { defineProps } from 'vue';

defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>

<style lang="scss">
.ui-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

.ui-step {
  display: flex;
  align-items: center;
  position: relative;
  color: var(--color-explain);
  font-size: 14px;

  &__box {
    display: flex;
    align-items: center;
    border-radius: 12px;
    background-color: var(--color-block);
    padding: 4px 11px;
    gap: 4px;
    &-icon {
      width: 16px;
      height: 16px;
    }
  }
  &__circle {
    display: block;
    background-color: var(--color-explain);
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
  &__icon {
    margin-left: 8px;
    svg {
      fill: var(--color-explain);
      path {
        stroke: var(--color-explain);
      }
    }
    &--current {
      fill: var(--primary);
      path {
        stroke: var(--primary);
      }
    }
    &--completed {
      fill: var(--primary);
      path {
        stroke: var(--primary);
      }
    }
  }
  &--current {
    .ui-step__circle {
      background-color: var(--white);
    }
    .ui-step__box {
      color: var(--white);
      background-color: var(--primary);
    }
  }
  &--completed {
    .ui-step__circle {
      background-color: var(--white);
    }
    .ui-step__box {
      color: var(--white);
      background-color: var(--primary);
    }
  }
}
</style>
