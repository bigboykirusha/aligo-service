<template>
   <div class="characteristics">
      <BlockTitle text="Параметры объявления" />
      <div class="characteristics__content">
         <AutosTextAreaTemplate label="Описание" placeholder="Нажмите для ввода" :option="createStore.ads_description"
            @update:option="(value) => handleFieldUpdate('ads_description', value)" />
         <AutosTextTemplate label="Цена, ₽" placeholder="Нажмите для ввода" :option="createStore.amount"
            validationType="number" @update:option="(value) => handleFieldUpdate('amount', value)" />
      </div>
      <BlockTitle text="Местоположение" />
      <div class="characteristics__content">
         <CityAutosCreate @updateCity="handleCitySelection" />
      </div>
      <BlockTitle text="Контакты" />
      <div class="characteristics__content">
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Способ связи" :initialSelectedOption="createStore.communication_method_id"
            :options="CommunicationMethodOptions"
            @updateSort="(value) => handleFieldUpdate('communication_method_id', value)" />
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCreateStore } from '@/store/create';
import { getCommunicationMethod } from '@/services/apiClient';
import { fetchDataWithCache } from '@/services/createUtils';
import AutosSelectCreate from '@/components/CREATEAD/AutosSelectCreate.vue';
import AutosTextTemplate from '@/components/CREATEAD/AutosTextTemplate.vue';
import AutosTextAreaTemplate from '@/components/CREATEAD/AutosTextAreaTemplate.vue';
import AutosSelectCreateSkeleton from './AutosSelectCreateSkeleton.vue';
import BlockTitle from './BlockTitle.vue';
import CityAutosCreate from './CityAutosCreate.vue';

const loading = ref(true);
const createStore = useCreateStore();
const CommunicationMethodOptions = ref([]);

const handleFieldUpdate = (field, value) => {
   createStore.setField(field, value);
};

const fetchOptions = async () => {
   try {
      await Promise.all([
         fetchCommunicationMethod()
      ]);
      loading.value = false;
   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   }
};

const fetchCommunicationMethod = async () => {
   CommunicationMethodOptions.value = await fetchDataWithCache('CommunicationMethod', getCommunicationMethod);
};

onMounted(() => {
   fetchOptions();
});
</script>

<style lang="scss" scoped>
.characteristics {
   display: flex;
   flex-direction: column;
   gap: 40px;

   @media (max-width: 768px) {
      padding-bottom: 70px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }
}
</style>