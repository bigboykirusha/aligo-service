<template>
  <div class="ui-accordion" v-if="!hidden">
    <div
      class="ui-accordion__head"
      :class="{ active: open }"
      @click.stop="$emit('togler', item)"
    >
      <span class="ui-accordion__head-title large-text bold">
        {{ title }}
      </span>
      <div class="ui-accordion__head-icon" :class="{ active: open }">
        <SvgArrow
          class="ui-accordion__arrow"
          :class="{ 'ui-accordion__arrow--top': open }"
        />
        <span
          class="ui-accordion__head-icon-text bold large-text"
          v-if="text"
          >{{ open ? 'Скрыть' : 'Показать' }}</span
        >
      </div>
    </div>
    <div class="ui-accordion__items" :class="{ active: open }">
      <p class="ui-accordion__item medium-text">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>
<script>
import SvgArrow from '@/assets/svg/ArrowTabs';

export default {
  components: {
    SvgArrow,
  },
  emits: ['togler'],
  props: {
    item: {
      type: Object,
    },
    title: {
      type: String,
    },
    paragraph: {
      type: String,
    },
    link: {
      type: String,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
