<template>
   <div class="container">
      <NotFound
         v-if="isNotFound"
         :status-code="statusCode"
         :status-message="statusMessage"
      />
      <ServerError
         v-else
         :status-code="statusCode"
         :status-message="statusMessage"
      />
   </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
   error: {
      type: Object,
      default: () => ({})
   }
})

const statusCode = computed(() => Number(props.error?.statusCode || 500))
const statusMessage = computed(
   () => props.error?.statusMessage || props.error?.message || ''
)
const isNotFound = computed(() => statusCode.value === 404)
</script>

<style scoped lang="scss">
.container {
   display: flex;
   flex-direction: column;
   justify-content: center;
   min-height: 100vh;
   min-height: 100dvh;
}
</style>
