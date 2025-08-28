<template>
  <div class="popup__content">
    <h2 class="popup__title small-title">
      Вы уверены, что хотите покинуть страницу? Несохраненные данные будут
      потеряны.
    </h2>

    <div class="popup__btn-box">
      <ButtonUI
        text="Все равно покинуть"
        buttonClass="btn--primary"
        @action="$router.back()"
      />
      <ButtonUI
        text="Продолжить"
        buttonClass="btn--second"
        @action="$emit('closing')"
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import ButtonUI from '@/components/UI/ButtonUI';

defineProps({
  id: String,
  data: Object,
});
// emits: ['closing', 'success'],
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
    border-top: 1px solid var(--color-stroke);
    display: flex;
  }
}
</style>
