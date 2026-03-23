<template>
   <div class="full-wheels-parameters">
      <div class="full-wheels-parameters__content">
         <BlockTitle text="Параметры товара" />

         <UISwitcher
            label="Состояние"
            :options="conditionOptions"
            :active-index="createStore.full_wheels_condition_id"
            @update-selected="
               (value) => handleFieldUpdate('full_wheels_condition_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Количество колес, шт."
            :initial-selected-option="createStore.full_wheels_count"
            :options="countOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('full_wheels_count', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Производитель"
            :initial-selected-option="createStore.full_wheels_brand_id"
            :options="brandOptions"
            searchable
            search-mode="startsWith"
            @update-sort="handleBrandUpdate"
         />

         <SelectUI
            v-if="createStore.full_wheels_brand_id"
            layout="row"
            input-width="310px"
            label="Модель"
            :initial-selected-option="createStore.full_wheels_model_id"
            :options="modelOptions"
            :disabled="isModelSelectDisabled"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_model_id', value)
            "
         />
      </div>

      <div class="full-wheels-parameters__content">
         <BlockTitle text="Характеристики шин" />

         <UISwitcher
            label="Разноширокий комплект"
            :options="staggeredSetOptions"
            :active-index="createStore.full_wheels_staggered_set_id"
            @update-selected="
               (value) => handleFieldUpdate('full_wheels_staggered_set_id', value)
            "
         />

         <div class="full-wheels-parameters__size-group">
            <div class="full-wheels-parameters__size-field">
               <div class="full-wheels-parameters__size-field-label">
                  Размер шин передняя ось*
               </div>
               <div class="full-wheels-parameters__size-row">
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_front_width_id"
                     :options="widthOptions"
                     placeholder="Ширина"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate('full_wheels_front_width_id', value)
                     "
                  />
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_front_height_id"
                     :options="heightOptions"
                     placeholder="Высота"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate('full_wheels_front_height_id', value)
                     "
                  />
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_front_diameter_id"
                     :options="diameterOptions"
                     placeholder="Диаметр"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate(
                              'full_wheels_front_diameter_id',
                              value
                           )
                     "
                  />
               </div>
            </div>

            <div v-if="isStaggeredSet" class="full-wheels-parameters__size-field">
               <div class="full-wheels-parameters__size-field-label">
                  Размер шин задняя ось
               </div>
               <div class="full-wheels-parameters__size-row">
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_rear_width_id"
                     :options="rearWidthOptions"
                     placeholder="Ширина"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate('full_wheels_rear_width_id', value)
                     "
                  />
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_rear_height_id"
                     :options="rearHeightOptions"
                     placeholder="Высота"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate('full_wheels_rear_height_id', value)
                     "
                  />
                  <SelectUI
                     class="full-wheels-parameters__size-select"
                     :initial-selected-option="createStore.full_wheels_rear_diameter_id"
                     :options="rearDiameterOptions"
                     placeholder="Диаметр"
                     searchable
                     search-mode="startsWith"
                     @update-sort="
                        (value) =>
                           handleFieldUpdate('full_wheels_rear_diameter_id', value)
                     "
                  />
               </div>
            </div>
         </div>

         <SelectUI
            layout="row"
            input-width="310px"
            label="Индекс нагрузки"
            :initial-selected-option="createStore.full_wheels_load_index_id"
            :options="loadIndexOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_load_index_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Индекс скорости"
            :initial-selected-option="createStore.full_wheels_speed_index_id"
            :options="speedIndexOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_speed_index_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Сезонность*"
            :initial-selected-option="createStore.full_wheels_season_id"
            :options="seasonOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('full_wheels_season_id', value)"
         />

         <UISwitcher
            label="Run Flat"
            :options="runFlatOptions"
            :active-index="createStore.full_wheels_run_flat_id"
            @update-selected="
               (value) => handleFieldUpdate('full_wheels_run_flat_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Остаток протектора"
            :initial-selected-option="createStore.full_wheels_tread_depth_id"
            :options="treadDepthOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_tread_depth_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Год выпуска*"
            :initial-selected-option="createStore.full_wheels_year_id"
            :options="yearOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('full_wheels_year_id', value)"
         />
      </div>

      <div class="full-wheels-parameters__content">
         <BlockTitle text="Характеристики дисков" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Ширина обода, дюймы"
            :initial-selected-option="createStore.full_wheels_disk_rim_width_id"
            :options="diskRimWidthOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) =>
                  handleFieldUpdate('full_wheels_disk_rim_width_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Количество отверстий"
            :initial-selected-option="createStore.full_wheels_disk_hole_count_id"
            :options="diskHoleCountOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) =>
                  handleFieldUpdate('full_wheels_disk_hole_count_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Диаметр расположения отверстий"
            :initial-selected-option="
               createStore.full_wheels_disk_hole_pattern_diameter_id
            "
            :options="diskHolePatternDiameterOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) =>
                  handleFieldUpdate(
                     'full_wheels_disk_hole_pattern_diameter_id',
                     value
                  )
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Тип диска"
            :initial-selected-option="createStore.full_wheels_disk_type_id"
            :options="diskTypeOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_disk_type_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Центральное отверстие (DIA)"
            :initial-selected-option="createStore.full_wheels_disk_dia_id"
            :options="diskDiaOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_disk_dia_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Вылет (ET)"
            :initial-selected-option="createStore.full_wheels_disk_et_id"
            :options="diskEtOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('full_wheels_disk_et_id', value)
            "
         />
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import { useCreatePassengerFullWheelsParametersModel } from '~/composables/create/useCreatePassengerFullWheelsParametersModel'

defineOptions({
   name: 'CreatePassengerFullWheelsParametersForm'
})

const {
   createStore,
   countOptions,
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
   diskHoleCountOptions,
   diskHolePatternDiameterOptions,
   diskTypeOptions,
   diskDiaOptions,
   diskEtOptions,
   diskRimWidthOptions,
   conditionOptions,
   staggeredSetOptions,
   seasonOptions,
   treadDepthOptions,
   yearOptions,
   runFlatOptions,
   isStaggeredSet,
   updateField,
   handleBrandUpdate
} = useCreatePassengerFullWheelsParametersModel()

const handleFieldUpdate = updateField
</script>

<style lang="scss" scoped>
.full-wheels-parameters {
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

:deep(.full-wheels-parameters__size-select.select-field) {
   gap: 0;
}

:deep(.full-wheels-parameters__size-select .select-field__control),
:deep(.full-wheels-parameters__size-select .select-field__list) {
   width: 112px;
   min-width: 112px;

   @media (max-width: 768px) {
      width: 100%;
      min-width: 0;
   }
}
</style>
