<template>
  <div
    class="ui-textarea"
    :class="{
      'ui-textarea--error': error,
      'ui-textarea--status': status,
      'ui-textarea--success': success,
      'ui-textarea--empty': !modelValue && !isFocus,
      'ui-textarea--disabled': disabled,
    }"
  >
    <label class="ui-textarea__box">
      <textarea
        ref="textareaRef"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        class="ui-textarea__field"
        @focus="onFocus"
        @blur="outFocus"
        @input="handleInput"
      />
      <span v-if="label" class="ui-textarea__label">
        {{ label }}
      </span>
    </label>
    <div v-if="text" class="ui-textarea__text medium-text">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['onFocus', 'outFocus', 'update:model-value']);
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
  text: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
});

const textareaRef = ref(null);
const isFocus = ref(false);
const maxLines = 23;

const onFocus = () => {
  isFocus.value = true;
  emit('onFocus');
};

const outFocus = () => {
  isFocus.value = false;
  emit('outFocus');
};

const handleInput = async (event) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  textarea.style.height = 'auto';

  const lineHeight = 14;
  const minHeight = 80;
  const maxHeight = lineHeight * maxLines;

  textarea.style.height = `${Math.max(
    minHeight,
    Math.min(textarea.scrollHeight, maxHeight)
  )}px`;

  emit('update:model-value', event.target.value);
};

onMounted(() => {
  nextTick(() => {
    if (textareaRef.value) handleInput({ target: textareaRef.value });
  });
});
</script>
