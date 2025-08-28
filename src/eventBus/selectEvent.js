import { ref } from 'vue';

export const eventBus = ref({
  on(event, callback) {
    window.addEventListener(event, callback);
  },
  emit(event) {
    window.dispatchEvent(new CustomEvent(event));
  },
});
