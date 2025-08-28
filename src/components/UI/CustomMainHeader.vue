<template>
  <div class="user-table-header">
    <div class="user-table-header__controls">
      <AdsDropdown
        :options="sortOptions"
        @updateSort="handleSortUpdate"
        :defaultValue="sortOptions[0].value"
      />
      <CustomSerch
        v-model="searchQuery"
        placeholder="Введите запрос..."
        @clickIcon="serchAction"
      />
      <ButtonUI
        v-if="showCreateButton"
        svg="add-icon"
        @click="createNewUser"
        text="Новый профиль"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import AdsDropdown from '@/components/AdsDropdown.vue';
import ButtonUI from '@/components/UI/ButtonUI';
import CustomSerch from '@/components/UI/CustomSerch';

defineProps({
  sortOptions: {
    type: Array,
    required: true,
  },
  showCreateButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['updateSort', 'create']);

const searchQuery = ref('');

function handleSortUpdate(value) {
  emit('updateSort', value);
}

function createNewUser() {
  emit('create');
}
</script>

<style lang="scss">
.user-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 16px 24px;
  margin: 16px 0;
  border-radius: 6px;
  background-color: #eef9ff;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
  }

  &__search {
    position: relative;
    display: flex;
    align-items: center;
    height: 34px;
    padding: 0 10px;
    max-width: 270px;
    width: 100%;
    background-color: var(--white);
    border: 1px solid var(--color-stroke);
    border-radius: 6px;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  &__search-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  &__search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: var(--text-main);

    &::placeholder {
      color: #a0a0a0;
    }
  }
}
</style>
