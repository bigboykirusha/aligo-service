<template>
  <div class="info__detail">
    <span class="info__label">{{ label }}:</span>
    <span class="info__value-container">
      <span v-if="!isEditing" class="info__value">{{ value }}</span>
      <input
        v-if="isEditing"
        v-model="editableValue"
        class="info__input"
        @blur="finishEditing"
        ref="inputField"
      />
      <img
        v-if="showEdit && !isEditing"
        :src="editIcon"
        alt="Редактировать"
        class="info__edit-icon"
        @click="startEditing"
      />
      <img
        v-if="isEditing"
        :src="checkIcon"
        alt="Сохранить"
        class="info__edit-icon"
        @click="finishEditing"
      />
    </span>
  </div>
</template>

<script setup>
import { defineProps, ref, nextTick } from 'vue';
import editIcon from '@/assets/icons/edit.svg';
import checkIcon from '@/assets/icons/check-icon.svg';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
});

const isEditing = ref(false);
const editableValue = ref(props.value);
const inputField = ref(null);

const startEditing = () => {
  isEditing.value = true;
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus();
    }
  });
};

const finishEditing = () => {
  isEditing.value = false;
};
</script>

<style lang="scss">
.info {
  &__detail {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
  }

  &__label {
    color: var(--color-explain);
    display: block;
    width: 200px;
  }

  &__value-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__value {
    max-width: 500px;
    color: var(--text-main);
  }

  &__input {
    display: flex;
    align-items: center;
    height: 28px;
    font-size: 14px;
    padding: 0 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
  }

  &__edit-icon {
    height: 14px;
    width: 14px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
}
</style>
