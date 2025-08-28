<template>
  <div class="popup__content">
    <p class="popup__title small-title">
      Вы уверены, что хотите удалить запись N {{ data.id.value }}?
    </p>
    <p class="popup__text small-title">
      <span>URL:</span>
      <a :href="data.option.info" target="_blank" rel="noopener noreferrer">{{
        data.option.info
      }}</a>
    </p>
    <div class="popup__btn-box">
      <ButtonUI
        text="Удалить"
        buttonClass="btn--primary"
        @action="popupAction"
      />
      <ButtonUI
        text="Отмена"
        buttonClass="btn--second"
        @action="$emit('closing')"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ButtonUI from '@/components/UI/ButtonUI';

const props = defineProps({
  id: String,
  data: Object,
});

const emit = defineEmits(['closing', 'success']);

const popupAction = () => {
  emit('success', props.data);
};
</script>

<style scoped lang="scss">
.popup {
  &__content {
    justify-content: space-between;
  }
  &__title {
    color: var(--primary);
    font-size: 20px;
    font-weight: 700;
  }
  &__btn-box {
    display: flex;
  }
}
</style>
