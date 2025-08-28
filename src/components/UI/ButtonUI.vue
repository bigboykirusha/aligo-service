<template>
  <button class="btn" :disabled="disabled || loading" :class="buttonClasses" @click="$emit('action')">
    <Loader class="btn__icon" v-if="loading" />
    <component class="btn__icon" :is="iconComponent" v-if="svg && !loading" />
    <span class="btn__text" v-if="text && !loading">{{ text }}</span>
    <span v-if="loading && text">Загрузка</span>
  </button>
</template>

<script setup>
import { computed, defineAsyncComponent, defineProps } from 'vue';
import Loader from '@/assets/icons/loader-svg';

const props = defineProps({
  buttonClass: {
    type: String,
    default: 'btn--primary',
    validator: function (value) {
      return [
        'btn--primary',
        'btn--second',
        'btn--third',
        'btn--blue',
        'btn--error',
        'btn--disabled',
      ].includes(value);
    },
  },
  svg: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const createClass = computed(() => {
  if (props.svg && props.text) {
    return 'btn--full';
  } else if (props.svg) {
    return 'btn--svg';
  } else if (props.text) {
    return 'btn--text';
  } else {
    return '';
  }
});

const buttonClasses = computed(() => {
  if (props.disabled) {
    return ['btn--disabled', createClass.value].join(' ');
  } else {
    return [props.buttonClass, createClass.value].filter(Boolean).join(' ');
  }
});

const iconComponent = computed(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/${props.svg}.vue`));
});
</script>

<style lang="scss">
.btn {
  display: flex;
  height: 34px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;

  color: var(--white);
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &--primary {
    transition: background-color 0.2s ease, color 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--primary);

    &:hover {
      background-color: #144df8;
    }

    svg {
      fill: none;

      path {
        stroke: var(--white);
      }
    }

    .btn--reversed {
      background-color: var(--white);
      color: var(--primary);
      border: 1px solid var(--primary);
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

      &:hover {
        background-color: var(--color-block);
      }
    }
  }

  &--second {
    background-color: #eef9ff;
    color: var(--primary);

    &:hover {
      background-color: #a4dcff;
    }
  }

  &--blue {
    color: #3366FF;
    background-color: #D6EFFF;

    &:hover {
      background-color: #a4dcff;
    }
  }

  &--third {
    color: var(--primary);
    background-color: transparent;

    svg {
      fill: transparent;

      path {
        stroke: var(--primary);
      }

      rect {
        stroke: var(--primary);
      }
    }

    &:hover {
      background-color: #a4dcff;
    }
  }

  &--error {
    color: #ff5959;
    background-color: transparent;

    svg {
      fill: transparent;

      path {
        stroke: #ff5959;
      }

      rect {
        stroke: #ff5959;
      }
    }
  }

  &--disabled {
    background-color: #f0f0f0;
    color: var(--color-explain);
  }

  &__icon {
    width: 18px;
    height: 18px;
  }

  &__text {
    white-space: nowrap;
  }
}
</style>
