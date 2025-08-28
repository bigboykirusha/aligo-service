<template>
  <div class="menu" @click.stop="$emit('closing')">
    <component
      :is="menuContent"
      :tytle="tytle"
      :data="data"
      :id="id"
      @click.stop
      @closing="$emit('closing')"
      @success="menuAction"
      @menu-action="action"
      @submit-action="menuSubmitAction"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, defineEmits, defineProps } from 'vue';

const emit = defineEmits([
  'closing',
  'success',
  'submit-action',
  'menu-action',
]);

const props = defineProps({
  id: { type: Number, default: 0 },
  name: { type: String },
  data: { type: Object, default: () => ({}) },
  tytle: { type: String, default: '' },
  isWait: { type: Boolean, default: false },
});

const menuContent = computed(() =>
  defineAsyncComponent(() => import(`@/components/Menu/Menu${props.name}.vue`))
);

const menuAction = (itemId) => {
  emit('success', itemId || undefined);
};

const menuSubmitAction = (menuOption) => {
  emit('submit-action', menuOption);
};
const action = (name, data) => {
  emit('menu-action', name, data || undefined);
};
</script>
