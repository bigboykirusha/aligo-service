<template>
  <transition name="fade">
    <div class="ui-preloader" v-if="isLoad">
      <Loader :size="size" />
    </div>
  </transition>
</template>

<script>
import Loader from '@/assets/icons/loader-svg';

export default {
  components: {
    Loader,
  },
  name: 'CustomPreloader',
  props: {
    isLoad: {
      type: Boolean,
      default: true,
    },
    size: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>

<style lang="scss">
.ui-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--white);
  z-index: 1000; /* Ensure it's on top of other content */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent any scrollbars */
}

.ui-preloader svg {
  width: 5vw;
  height: 5vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.333s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
