<template>
   <div class="characteristics">
      <div class="characteristics__content">
         <BlockTitle text="Категория*" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="conditionIdOptions" label="Состояние"
            @updateSelected="(value) => handleFieldUpdate('condition_id', value)"
            :activeIndex="createStore.condition_id" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Внешний вид*" />
         <PhotoUploader label="Фотографии (до 10 шт)" :photos="createStore.photos"
            @updatePhotos="(photos) => handleFieldUpdate('photos', photos)" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectColor v-else label="Цвет" :initialSelectedOption="createStore.color_ids" :options="colorOptions"
            @updateSort="(value) => handleFieldUpdate('color_ids', value)" />
         <ColorPickerCreateSkeleton v-if="loading" />
         <ColorPickerCreate v-else :options="colorOptions" label="Цвет"
            @updateSelected="(value) => handleFieldUpdate('color_ids', value)" :activeIndex="createStore.color_ids" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Регистрационные данные" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Страна регистрации*" :initialSelectedOption="createStore.country_id"
            :options="countryOptions" @updateSort="(value) => handleFieldUpdate('country_id', value)" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="VIN или номер кузова*" placeholder="Нажмите для ввода"
            :option="createStore.vin" @update:option="(value) => handleFieldUpdate('vin', value)"
            validationType="vin" />
         <TextSkeleton v-if="loading" />
         <AutosStateNumber v-show="showStateNumber" label="Государственный номер" placeholder="Нажмите для ввода"
            :option="createStore.state_number" @update:option="(value) => handleFieldUpdate('state_number', value)" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="Технические характеристики*" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Марка" :initialSelectedOption="createStore.brand_id"
            :options="dropdownMarksOptions" @updateSort="handleMarksUpdate" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Модель" :initialSelectedOption="createStore.model_id"
            :options="dropdownModelsOptions" @updateSort="handleModelsUpdate" :disabled="isModelsDropdownDisabled" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Поколение" :initialSelectedOption="createStore.generation_id"
            :options="dropdownGenerationOptions" @updateSort="handleGenerationUpdate"
            :disabled="isGenerationDropdownDisabled" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Комплектация" :initialSelectedOption="createStore.equipment_id"
            :options="dropdownEquipmentOptions" @updateSort="(value) => handleFieldUpdate('equipment_id', value)"
            :disabled="isEquipmentDropdownDisabled" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Год выпуска" :initialSelectedOption="createStore.year_id"
            :options="yearOptions" @updateSort="(value) => handleFieldUpdate('year_id', value)" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Тип кузова" :initialSelectedOption="createStore.car_body_type_id"
            :options="checkboxBodyTypeOptions" @updateSort="(value) => handleFieldUpdate('car_body_type_id', value)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="handlebarIdOptions" label="Руль"
            @updateSelected="(value) => handleFieldUpdate('handlebar_id', value)"
            :activeIndex="createStore.handlebar_id" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate v-else label="Количество дверей" placeholder="Нажмите для ввода"
            :option="createStore.count_doors" @update:option="(value) => handleFieldUpdate('count_doors', value)"
            validationType="doors" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="Тип двигателя" :initialSelectedOption="createStore.engine_type_id"
            :options="checkboxEngineTypeOptions" @updateSort="(value) => handleFieldUpdate('engine_type_id', value)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="checkboxDriveOptions" label="Привод"
            @updateSelected="(value) => handleFieldUpdate('drive_id', value)" :activeIndex="createStore.drive_id" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else :options="dropdownTransmissionOptions" label="Коробка передач"
            @updateSelected="(value) => handleFieldUpdate('transmission_id', value)"
            :activeIndex="createStore.transmission_id" />
      </div>
      <div class="characteristics__content">
         <BlockTitle text="История эксплуатации и состояние" />
         <AutosTextTemplate v-show="showUsedOptions" label="Пробег, км" placeholder="Нажмите для ввода"
            :option="createStore.mileage" @update:option="(value) => handleFieldUpdate('mileage', value)"
            validationType="number" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else v-show="showUsedOptions" :options="switcherStateOptions" label="Состояние*"
            @updateSelected="(value) => handleFieldUpdate('state_id', value)" :activeIndex="createStore.state_id" />
         <SwitcherCreateSkeleton v-if="loading" />
         <AutosSwitcherCreate v-else v-show="showUsedOptions" :options="ownersOptions" label="Владельцев"
            @updateSelected="(value) => handleFieldUpdate('count_owners', value)"
            :activeIndex="createStore.count_owners" />
         <AutosSelectCreateSkeleton v-if="loading" />
         <AutosSelectCreate v-else label="ПТС*" :initialSelectedOption="createStore.pts_id" :options="PtsOptions"
            @updateSort="(value) => handleFieldUpdate('pts_id', value)" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Данные о ТО</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate label="Есть сервисная книжка" :checked="createStore.is_service_book"
                  @updateChecked="(value) => handleFieldUpdate('is_service_book', value)" />
               <SimpleCheckboxTemplate label="Обслуживался у диллера" :checked="createStore.is_serviced_dealer"
                  @updateChecked="(value) => handleFieldUpdate('is_serviced_dealer', value)" />
               <SimpleCheckboxTemplate label="На гарантии" :checked="createStore.is_under_warranty"
                  @updateChecked="(value) => handleFieldUpdate('is_under_warranty', value)" />
            </div>
         </div>
      </div>
      <div class="characteristics__info">*– обязательные поля</div>
   </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCreateStore } from '@/store/create';
import {
   getCarsPts, getCarBrands, getCarModels, getCarGenerations, getCarEquipment,
   getCarTransmission, getCarBodyType, getCarEngineType, getCarDrive, getCarState,
   getColors, getCarCountry, getYear, getCarsOwners, getCarsHandlebar, getCarCondition
} from '@/services/apiClient';
import { fetchDataWithCache } from '@/services/createUtils';
import AutosTextTemplate from '@/components/CREATEAD/AutosTextTemplate.vue';
import AutosSelectCreate from '@/components/CREATEAD/AutosSelectCreate.vue';
import AutosSwitcherCreate from '@/components/CREATEAD/AutosSwitcherCreate.vue';
import AutosSelectColor from '@/components/CREATEAD/AutosSelectColor.vue';
import AutosStateNumber from '@/components/CREATEAD/AutosStateNumber.vue';
import SimpleCheckboxTemplate from '@/components/CREATEAD/SimpleCheckboxTemplate.vue';
import SwitcherCreateSkeleton from '@/components/CREATEAD/SwitcherCreateSkeleton.vue';
import AutosSelectCreateSkeleton from '@/components/CREATEAD/AutosSelectCreateSkeleton.vue';
import BlockTitle from './BlockTitle.vue';
import TextSkeleton from '@/components/CREATEAD/TextSkeleton.vue';
import PhotoUploader from './PhotoUploader.vue';
import ColorPickerCreate from './ColorPickerCreate.vue';
import ColorPickerCreateSkeleton from './ColorPickerCreateSkeleton.vue';

const loading = ref(true);
const createStore = useCreateStore();
const dropdownMarksOptions = ref([]);
const dropdownModelsOptions = ref([]);
const dropdownGenerationOptions = ref([]);
const dropdownEquipmentOptions = ref([]);
const dropdownTransmissionOptions = ref([]);
const checkboxBodyTypeOptions = ref([]);
const checkboxEngineTypeOptions = ref([]);
const checkboxDriveOptions = ref([]);
const switcherStateOptions = ref([]);
const conditionIdOptions = ref([]);
const colorOptions = ref([]);
const countryOptions = ref([]);
const ownersOptions = ref([]);
const selectedModel = ref([]);
const yearOptions = ref([]);
const handlebarIdOptions = ref([]);
const PtsOptions = ref([]);

const isModelsDropdownDisabled = computed(() => !createStore.brand_id);
const isGenerationDropdownDisabled = computed(() => !createStore.model_id);
const isEquipmentDropdownDisabled = computed(() => !createStore.generation_id);

const showStateNumber = computed(() => createStore.country_id !== null && createStore.country_id !== 1);
const showUsedOptions = computed(() => createStore.condition_id !== 1);

const fetchOptions = async () => {
   try {
      loading.value = true;
      await Promise.all([
         fetchMarksDropdownOptions(),
         fetchTransmissionDropdownOptions(),
         fetchBodyTypeOptions(),
         fetchEngineTypeOptions(),
         fetchDriveOptions(),
         fetchColorOptions(),
         fetchStateOptions(),
         fetchCountryOptions(),
         fetchYearOptions(),
         fetchOwnersOptions(),
         fetchHandlebarOptions(),
         fetchPtsOptions(),
         fetchConditionOptions(),
      ]);

      if (createStore.brand_id) {
         await fetchModelsDropdownOptions(createStore.brand_id);
      }

      if (createStore.model_id) {
         await fetchGenerationDropdownOptions(createStore.brand_id, createStore.model_id);
      }

      if (createStore.generation_id) {
         await fetchEquipmentDropdownOptions(createStore.brand_id, createStore.model_id, createStore.generation_id);
      }

   } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
   } finally {
      loading.value = false;
   }
};

const handleFieldUpdate = (field, value) => {
   createStore.setField(field, value);
};

const fetchMarksDropdownOptions = async () => {
   dropdownMarksOptions.value = await fetchDataWithCache('dropdownMarksOptions', getCarBrands);
};

const fetchPtsOptions = async () => {
   PtsOptions.value = await fetchDataWithCache('PtsOptions', getCarsPts);
};

const fetchHandlebarOptions = async () => {
   handlebarIdOptions.value = await fetchDataWithCache('handlebarIdOptions', getCarsHandlebar);
};

const fetchConditionOptions = async () => {
   conditionIdOptions.value = await fetchDataWithCache('conditionOptions', getCarCondition);
};

const fetchColorOptions = async () => {
   colorOptions.value = await fetchDataWithCache('colorOptions', getColors);
};

const fetchTransmissionDropdownOptions = async () => {
   dropdownTransmissionOptions.value = await fetchDataWithCache('dropdownTransmissionOptions', getCarTransmission);
};

const fetchBodyTypeOptions = async () => {
   checkboxBodyTypeOptions.value = await fetchDataWithCache('checkboxBodyTypeOptions', getCarBodyType);
};

const fetchEngineTypeOptions = async () => {
   checkboxEngineTypeOptions.value = await fetchDataWithCache('checkboxEngineTypeOptions', getCarEngineType);
};

const fetchOwnersOptions = async () => {
   ownersOptions.value = await fetchDataWithCache('ownersOptions', getCarsOwners);
};

const fetchDriveOptions = async () => {
   checkboxDriveOptions.value = await fetchDataWithCache('checkboxDriveOptions', getCarDrive);
};

const fetchStateOptions = async () => {
   switcherStateOptions.value = await fetchDataWithCache('switcherStateOptions', getCarState);
};

const fetchCountryOptions = async () => {
   countryOptions.value = await fetchDataWithCache('countryOptions', getCarCountry);
};

const fetchYearOptions = async () => {
   yearOptions.value = await fetchDataWithCache('yearOptions', getYear);
};

const fetchModelsDropdownOptions = async (brandId) => {
   try {
      dropdownModelsOptions.value = await getCarModels(brandId);
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const fetchGenerationDropdownOptions = async (brandId, modelId) => {
   try {
      dropdownGenerationOptions.value = await getCarGenerations(brandId, modelId);
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const fetchEquipmentDropdownOptions = async (brandId, modelId, generationId) => {
   try {
      dropdownEquipmentOptions.value = await getCarEquipment(brandId, modelId, generationId);
   } catch (error) {
      console.error('Ошибка при получении моделей автомобилей:', error);
   }
};

const handleMarksUpdate = (selectedOptions) => {
   createStore.setField('brand_id', selectedOptions);
   fetchModelsDropdownOptions(selectedOptions);
   selectedModel.value = null;
   dropdownGenerationOptions.value = [];
   dropdownEquipmentOptions.value = [];
   createStore.model_id = null;
   createStore.generation_id = null;
   createStore.equipment_id = null;
};

const handleModelsUpdate = (selectedOptions) => {
   createStore.setField('model_id', selectedOptions);
   dropdownGenerationOptions.value = [];
   dropdownEquipmentOptions.value = [];
   createStore.generation_id = null;
   createStore.equipment_id = null;
   fetchGenerationDropdownOptions(createStore.brand_id, selectedOptions);
};

const handleGenerationUpdate = (selectedOptions) => {
   dropdownEquipmentOptions.value = [];
   createStore.setField('generation_id', selectedOptions);
   createStore.equipment_id = null;
   fetchEquipmentDropdownOptions(createStore.brand_id, createStore.model_id, selectedOptions);
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

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }

   &__info {
      font-size: 14px;
      line-height: 18px;
      color: #A8A8A8;
   }
}

.checkbox-section {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 5px;

   @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
   }

   &__items {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 24px;

      @media (max-width: 768px) {
         gap: 8px;
      }
   }

   &__title {
      font-size: 14px;
      color: #323232;
      width: 270px;
   }
}
</style>