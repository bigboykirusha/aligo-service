<template>
   <div class="tires-parameters">
      <div class="tires-parameters__content">
         <BlockTitle text="Параметры товара" />

         <UISwitcher
label="Состояние" :options="conditionOptions"
            :active-index="createStore.tires_condition_id"
            @update-selected="(value) => handleFieldUpdate('tires_condition_id', value)" />

         <SelectUI
v-if="countOptions.length" layout="row" input-width="310px"
            label="Количество шин, шт." :initial-selected-option="createStore.tires_count" :options="countOptions"
            searchable search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('tires_count', value)" />
         <AutosTextTemplate
v-else label="Количество шин, шт."
            placeholder="Нажмите для ввода" validation-type="number" :option="createStore.tires_count"
            @update:option="(value) => handleFieldUpdate('tires_count', value)" />

         <SelectUI
layout="row" input-width="310px" label="Производитель" :initial-selected-option="createStore.tires_brand_id" :options="brandOptions"
            searchable search-mode="startsWith" @update-sort="handleBrandUpdate" />

         <SelectUI
v-if="createStore.tires_brand_id" layout="row" input-width="310px" label="Марка" :initial-selected-option="createStore.tires_model_id"
            :options="modelOptions" :disabled="isModelSelectDisabled" searchable search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('tires_model_id', value)" />

         <SelectUI
layout="row" input-width="310px" label="Сезонность" :initial-selected-option="createStore.tires_season_id" :options="seasonOptions"
            searchable search-mode="startsWith" @update-sort="(value) => handleFieldUpdate('tires_season_id', value)" />

         <SelectUI
layout="row" input-width="310px" label="Год выпуска" :initial-selected-option="createStore.tires_year_id" :options="yearOptions"
            searchable search-mode="startsWith" @update-sort="(value) => handleFieldUpdate('tires_year_id', value)" />
      </div>

      <div class="tires-parameters__content">
         <div class="tires-parameters__title-row">
            <BlockTitle text="Характеристики" />
            <TireSizeHelpTooltip />
         </div>

         <UISwitcher
v-if="isStaggeredSetVisible" label="Разноширокий комплект" :options="staggeredSetOptions"
            :active-index="createStore.tires_staggered_set_id"
            @update-selected="(value) => handleFieldUpdate('tires_staggered_set_id', value)" />

         <div class="tires-parameters__size-group">
            <div class="tires-parameters__size-field">
               <div class="tires-parameters__size-field-label">Размер шин передняя ось</div>
               <div class="tires-parameters__size-row">
                  <SelectUI
class="tires-parameters__size-select" :initial-selected-option="createStore.tires_width_id"
                     :options="widthOptions" placeholder="Ширина" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_width_id', value)" />
                  <SelectUI
class="tires-parameters__size-select" :initial-selected-option="createStore.tires_height_id"
                     :options="heightOptions" placeholder="Высота" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_height_id', value)" />
                  <SelectUI
class="tires-parameters__size-select"
                     :initial-selected-option="createStore.tires_diameter_id" :options="diameterOptions"
                     placeholder="Диаметр" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_diameter_id', value)" />
               </div>
            </div>

            <div v-if="isStaggeredSet" class="tires-parameters__size-field">
               <div class="tires-parameters__size-field-label">Размер шин задняя ось</div>
               <div class="tires-parameters__size-row">
                  <SelectUI
class="tires-parameters__size-select"
                     :initial-selected-option="createStore.tires_rear_width_id" :options="rearWidthOptions"
                     placeholder="Ширина" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_rear_width_id', value)" />
                  <SelectUI
class="tires-parameters__size-select"
                     :initial-selected-option="createStore.tires_rear_height_id" :options="rearHeightOptions"
                     placeholder="Высота" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_rear_height_id', value)" />
                  <SelectUI
class="tires-parameters__size-select"
                     :initial-selected-option="createStore.tires_rear_diameter_id" :options="rearDiameterOptions"
                     placeholder="Диаметр" searchable search-mode="startsWith"
                     @update-sort="(value) => handleFieldUpdate('tires_rear_diameter_id', value)" />
               </div>
            </div>
         </div>

         <SelectUI
layout="row" input-width="310px" label="Индекс нагрузки" :initial-selected-option="createStore.tires_load_index_id"
            :options="loadIndexOptions" searchable search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('tires_load_index_id', value)" />

         <SelectUI
layout="row" input-width="310px" label="Индекс скорости" :initial-selected-option="createStore.tires_speed_index_id"
            :options="speedIndexOptions" searchable search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('tires_speed_index_id', value)" />

         <UISwitcher
label="Run Flat" :options="runFlatOptions"
            :active-index="createStore.tires_run_flat_id"
            @update-selected="(value) => handleFieldUpdate('tires_run_flat_id', value)" />
      </div>

      <div v-if="isUsedCondition" class="tires-parameters__content">
         <BlockTitle text="Состояние" />

         <SelectUI
layout="row" input-width="310px" label="Остаток протектора" :initial-selected-option="createStore.tires_tread_depth_id"
            :options="treadDepthOptions" searchable search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('tires_tread_depth_id', value)" />

         <UISwitcher
label="Сколько шин с грыжами" :options="bulgesCountOptions"
            :active-index="createStore.tires_bulges_count_id"
            @update-selected="(value) => handleFieldUpdate('tires_bulges_count_id', value)" />

         <UISwitcher
label="Сколько шин с боковым ремонтом" :options="sideRepairCountOptions"
            :active-index="createStore.tires_side_repair_count_id"
            @update-selected="(value) => handleFieldUpdate('tires_side_repair_count_id', value)" />

         <div class="checkbox-section">
            <div class="checkbox-section__title">Прочие дефекты</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
v-for="defect in defectsOptions" :key="defect.field" :label="defect.label"
                  :checked="createStore[defect.field]"
                  @update-checked="(value) => handleDefectUpdate(defect.field, value)" />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import TireSizeHelpTooltip from '~/components/TireSizeHelpTooltip.vue'
import SelectUI from '~/components/ui/SelectUI.vue'
import { useCreatePassengerTiresParametersModel } from '~/composables/create/useCreatePassengerTiresParametersModel'

defineOptions({
   name: 'CreatePassengerTiresParametersForm'
})

const {
   createStore,
   brandOptions,
   modelOptions,
   isModelSelectDisabled,
   widthOptions,
   heightOptions,
   diameterOptions,
   rearWidthOptions,
   rearHeightOptions,
   rearDiameterOptions,
   loadIndexOptions,
   speedIndexOptions,
   countOptions,
   conditionOptions,
   seasonOptions,
   staggeredSetOptions,
   treadDepthOptions,
   bulgesCountOptions,
   sideRepairCountOptions,
   defectsOptions,
   yearOptions,
   runFlatOptions,
   isStaggeredSetVisible,
   isStaggeredSet,
   isUsedCondition,
   updateField,
   handleDefectUpdate,
   handleBrandUpdate
} = useCreatePassengerTiresParametersModel()

const handleFieldUpdate = updateField
</script>

<style lang="scss" scoped>
.tires-parameters {
   display: flex;
   flex-direction: column;
   gap: 40px;

   @media (max-width: 768px) {
      gap: 24px;
   }

   &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;

      @media (max-width: 768px) {
         gap: 16px;
      }
   }

   &__title-row {
      display: flex;
      align-items: center;
      gap: 8px;
   }

   &__size-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }

   &__size-field {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;

      @media (max-width: 768px) {
         flex-direction: column;
      }
   }

   &__size-field-label {
      font-size: 14px;
      line-height: 20px;
      width: 270px;
      min-width: 270px;
      color: #323232;

      @media (max-width: 768px) {
         width: 100%;
         min-width: 0;
      }
   }

   &__size-row {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
      gap: 12px;

      @media (max-width: 768px) {
         gap: 8px;
      }
   }

   &__size-select {
      width: 112px;
      min-width: 112px;

      @media (max-width: 768px) {
         width: calc((100% - 16px) / 3);
         min-width: 0;
      }
   }
}

:deep(.tires-parameters__size-select.select-field) {
   gap: 0;
}

:deep(.tires-parameters__size-select .select-field__control),
:deep(.tires-parameters__size-select .select-field__list) {
   width: 112px;
   min-width: 112px;

   @media (max-width: 768px) {
      width: 100%;
      min-width: 0;
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

   &__title {
      font-size: 14px;
      color: #323232;
      width: 270px;

      @media (max-width: 768px) {
         width: 100%;
      }
   }

   &__items {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }
}
</style>
