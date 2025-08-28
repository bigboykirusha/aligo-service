<template>
  <div class="ui-description">
    <span
      :class="['ui-description__rule-text', ruleColorClass]"
      v-if="shouldShowRuleText"
    >
      {{ ruleText }}
    </span>
    <p class="ui-description__text-content">
      <span :class="{ 'ui-description__text-length-error': hasTextLengthError }"
        >{{ textLength }} / {{ length }}</span
      >
      <span class="ui-description__arrow">→</span>
      <span
        class="ui-description__text-color-gray"
        :class="{ 'ui-description__text-length-error': hasTextLengthError }"
      >
        {{ processedText }}</span
      >
    </p>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const emit = defineEmits(['textLengthChanged']);

const props = defineProps({
  ruleText: {
    type: String,
    default: 'Заголовок H1 не должен полностью совпадать с Title',
  },
  validateText: {
    type: String,
    default: '',
  },
  ruleColor: {
    type: String,
    default: 'red',
  },
  text: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 60,
  },
  textColor: {
    type: String,
    default: 'gray',
  },
  variables: {
    type: Object,
    default: () => ({}),
  },
  more: {
    type: Boolean,
    default: false,
  },
});

const mockVariables = ref({
  CITY: 'Ростов-на-Дону',
  'CITY-PRED': 'Ростове-на-Дону',
  CTG: 'Автомобили',
  'CTG-PRED': 'Автомобилях',
  'FILTER-NAME': 'Цена',
  'FILTERS-CHPU': 'цена,год',
  'FILTERS-NAME-PARAMS': '',
  'FILTERS-NAME-PARAM': '',
});

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const textLength = computed(() => processedText.value.length);

const ruleColorClass = computed(
  () => `ui-description__rule-color-${props.ruleColor}`
);

const processedText = computed(() => {
  let result = props.text.replace(/_\s*>/g, '→');

  const variables =
    Object.keys(props.variables).length > 0
      ? props.variables
      : mockVariables.value;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `[${key}]`;
    const escapedPlaceholder = escapeRegExp(placeholder);
    const regex = new RegExp(escapedPlaceholder, 'g');
    result = result.replace(regex, value);
  }

  return result;
});

const hasTextLengthError = computed(() => {
  return props.more
    ? processedText.value.length > props.length
    : processedText.value.length < props.length;
});

const shouldShowRuleText = computed(() => props.text === props.validateText);
watch(
  processedText,
  (newText) => {
    emit('changeText', newText);
  },
  { immediate: true }
);
</script>

<style lang="scss">
.ui-description {
  &__rule-text {
    display: block;
    font-size: 12px;
  }

  &__text-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  &__arrow {
    margin: 0 2px;
  }

  &__rule-color-red {
    color: var(--color-error);
  }

  &__text-color-gray {
    color: var(--color-explain);
  }

  &__text-length-error {
    color: var(--color-error);
  }
}
</style>
