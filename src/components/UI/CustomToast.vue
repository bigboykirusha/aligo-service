<template>
  <transition name="toast" appear>
    <div
      v-if="isVisible"
      class="toast"
      :class="{
        'toast--error': error,
        'toast--status': status,
        'toast--success': success,
      }"
    >
      <component :is="iconComponent" v-if="svg" class="toast__svg" />
      <p class="toast__text medium-text">{{ text }}</p>
    </div>
  </transition>
</template>

<script setup>
import {
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
  defineProps,
  defineEmits,
} from 'vue';
// import CustomBtn from '@/components/UI/CustomBtn.vue';

const props = defineProps({
  error: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  svg: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  durationMassage: {
    type: Number,
    default: 7000,
  },
});

const emit = defineEmits(['action', 'distructor']);

const isVisible = ref(true);

const iconComponent = computed(() => {
  return defineAsyncComponent(() => import(`@/assets/icons/${props.svg}.vue`));
});

const distructor = () => {
  setTimeout(() => {
    isVisible.value = false;
    setTimeout(() => emit('distructor'), 500);
  }, props.durationMassage);
};

onMounted(() => {
  distructor();
});
</script>
