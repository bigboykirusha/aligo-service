<template>
  <div class="table-header__item--flex small-text" @click="actionHeader(code)">
    <p>{{ name }}</p>

    <CustomHelper
      v-if="helper.title || helper.text"
      :title="helper.title"
      :text="helper.text"
    >
      <template #content v-if="shouldShowHtml">
        <div v-dompurify-html="helper.html"></div>
      </template>
    </CustomHelper>
  </div>
</template>

<script setup>
import CustomHelper from '@/components/UI/CustomHelper';
import { computed, defineProps, defineEmits } from 'vue';

const emits = defineEmits(['heder-item-action']);

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  helper: {
    type: Object,
    default: () => ({}),
  },
  code: {
    type: String,
    default: '',
  },
  filter: {
    type: Boolean,
    default: false,
  },
});
const actionHeader = (code) => {
  if (props.filter) {
    emits('heder-item-action', code, props.filter);
  }
};
const shouldShowHtml = computed(() => {
  return (
    typeof props.helper.html === 'string' && props.helper.html.trim() !== ''
  );
});
</script>
