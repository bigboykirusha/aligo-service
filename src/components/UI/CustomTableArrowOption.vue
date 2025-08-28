<template>
  <div @click="handleClick" class="arrow-icon__wrapper">
    <img src="@/assets/icons/arrow-back.svg" alt="Arrow" class="arrow-icon" />
  </div>
</template>

<script>
/*Исправить почему это не кнопка */
export default {
  name: 'CustomTableArrowOption',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  emits: ['arrow-clicked'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('arrow-clicked', props.id);
    };

    return {
      handleClick,
    };
  },
};
</script>

<style scoped>
.arrow-icon__wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 16px;
  transform: rotate(180deg);
}
</style>
