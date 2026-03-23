<template>
   <component :is="tag" v-bind="$attrs">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="sanitizedHtml" />
   </component>
</template>

<script setup>
import { computed } from 'vue'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

defineOptions({
   name: 'SafeHtml',
   inheritAttrs: false
})

const props = defineProps({
   html: {
      type: String,
      default: ''
   },
   tag: {
      type: String,
      default: 'div'
   }
})

const sanitizedHtml = computed(() => sanitizeHtml(props.html))
</script>
