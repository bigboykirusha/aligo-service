<template>
  <div v-click-outside="closeInfo" class="ui-table-alert" ref="alertRef">
    <div class="ui-table-alert__svg-box" v-if="close">
      <CloseSvg @click.stop="closeInfo" />
    </div>
    <h4 class="ui-table-alert__title small-title bold" v-if="title">
      {{ title }}
    </h4>
    <div class="ui-table-alert__text medium-text">
      <template v-if="$slots.tableAlert">
        <slot name="tableAlert"></slot>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onUnmounted, onMounted, nextTick } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@floating-ui/dom';
import CloseSvg from '@/assets/icons/close-gray';

const props = defineProps({
  date: {
    type: String,
  },
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  close: {
    type: Boolean,
    default: false,
  },
  route: {
    type: String,
    default: '/helper',
  },
  box: {
    type: Object,
  },
});
const visibility = ref(false);
const boxRef = ref(props.box);
const alertRef = ref(null);
let cleanupAutoUpdate;

const calcPosition = async () => {
  visibility.value = true;
  await nextTick();
  if (alertRef.value && boxRef.value) {
    cleanupAutoUpdate = autoUpdate(boxRef.value, alertRef.value, async () => {
      const { x, y } = await computePosition(boxRef.value, alertRef.value, {
        placement: 'bottom',
        middleware: [offset({ mainAxis: 20 }), flip({ padding: 20 })],
      });

      alertRef.value.style.left = `${x}px`;
      alertRef.value.style.top = `${y}px`;
    });
  }
};

const closeInfo = () => {
  visibility.value = false;
  if (cleanupAutoUpdate) cleanupAutoUpdate();
};

onMounted(() => {
  calcPosition();
});

onUnmounted(() => {
  if (cleanupAutoUpdate) cleanupAutoUpdate();
});
</script>
