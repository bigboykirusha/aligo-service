<template>
  <div class="ui-helper__svg-wrapper" ref="buttonRef" @click="clickIcon">
    <HelperAskSvg />
  </div>
  <Transition />
  <div
    v-if="visibility"
    v-click-outside="closeInfo"
    ref="boxRef"
    class="ui-helper__description"
  >
    <div class="ui-helper__svg-box">
      <CloseSvg @click.stop="closeInfo" />
    </div>
    <h4 class="ui-helper__title small-title bold">{{ title }}</h4>
    <div class="ui-helper__text medium-text">
      <template v-if="$slots.content">
        <slot name="content"></slot>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </div>
    <!-- <router-link :to="route" class="ui-helper__inform-link small-title bold"
      >Подробнее </router-link> -->
  </div>
  <Transition />
</template>

<script setup>
import { ref, nextTick, onUnmounted, defineProps } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@floating-ui/dom';
import HelperAskSvg from '@/assets/icons/helper-ask-svg';
import CloseSvg from '@/assets/icons/close-gray';

defineProps({
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
    default: true,
  },
  route: {
    type: String,
    default: '/helper',
  },
});

const visibility = ref(false);
const boxRef = ref(null);
const buttonRef = ref(null);
let cleanupAutoUpdate;

const clickIcon = async () => {
  visibility.value = true;
  // floating-ui/dom  выполняет расчеты
  await nextTick();
  if (buttonRef.value && boxRef.value) {
    cleanupAutoUpdate = autoUpdate(buttonRef.value, boxRef.value, async () => {
      const { x, y } = await computePosition(buttonRef.value, boxRef.value, {
        placement: 'bottom-start',
        middleware: [offset({ mainAxis: -20 }), flip()],
      });

      boxRef.value.style.left = `${x}px`;
      boxRef.value.style.top = `${y}px`;
    });
  }
};
const closeInfo = () => {
  visibility.value = false;
  if (cleanupAutoUpdate) cleanupAutoUpdate();
};
onUnmounted(() => {
  if (cleanupAutoUpdate) cleanupAutoUpdate();
});
</script>
