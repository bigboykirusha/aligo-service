<template>
  <div class="popup" @click.stop="$emit('closing')">
    <!-- Данный компонент формирует контент, подгружая динамически компоненты -->
    <component
      :is="popUpContent"
      :tytle="tytle"
      :data="data"
      :id="id"
      @click.stop
      @closing="$emit('closing')"
      @success="popupAction"
      @submit-action="popUpSubmitAction"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, defineEmits, defineProps } from 'vue';

const emit = defineEmits([
  'closing',
  'success',
  'submit-action',
  'update:data',
]);

const props = defineProps({
  id: { type: Number, default: 0 },
  name: { type: String },
  data: { type: Object, default: () => ({}) },
  tytle: { type: String, default: '' },
  isWait: { type: Boolean, default: false },
});

const popUpContent = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/POPUP/PopUp${props.name}.vue`)
  )
);

const popupAction = (itemId) => {
  emit('success', itemId || undefined);
};

const popUpSubmitAction = (popUpOption) => {
  emit('submit-action', popUpOption);
};
</script>
