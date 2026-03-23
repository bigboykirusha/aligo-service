<template>
   <div class="disks-parameters">
      <div class="disks-parameters__content">
         <BlockTitle text="Параметры товара" />

         <UISwitcher
            label="Состояние"
            :options="conditionOptions"
            :active-index="createStore.disks_condition_id"
            @update-selected="(value) => handleFieldUpdate('disks_condition_id', value)" />

         <SelectUI
            v-if="countOptions.length"
            layout="row"
            input-width="310px"
            label="Количество дисков, шт."
            :initial-selected-option="createStore.disks_count"
            :options="countOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_count', value)" />

         <AutosTextTemplate
            v-else
            label="Количество дисков, шт."
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="createStore.disks_count"
            @update:option="(value) => handleFieldUpdate('disks_count', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Производитель"
            :initial-selected-option="createStore.disks_brand_id"
            :options="brandOptions"
            searchable
            search-mode="startsWith"
            @update-sort="handleBrandUpdate" />

         <SelectUI
            v-if="createStore.disks_brand_id"
            layout="row"
            input-width="310px"
            label="Марка"
            :initial-selected-option="createStore.disks_model_id"
            :options="modelOptions"
            :disabled="isModelSelectDisabled"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_model_id', value)" />

         
      </div>

      <div class="disks-parameters__content">
         <div class="disks-parameters__title-row">
            <BlockTitle text="Характеристики" />
            <DiskSizeHelpTooltip />
         </div>

         <SelectUI
            layout="row"
            input-width="310px"
            label="Диаметр, дюймы"
            :initial-selected-option="createStore.disks_rim_diameter_id"
            :options="rimDiameterOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_rim_diameter_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Количество отверстий"
            :initial-selected-option="createStore.disks_hole_count_id"
            :options="holeCountOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_hole_count_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Диаметр расположения отверстий"
            :initial-selected-option="createStore.disks_hole_pattern_diameter_id"
            :options="holePatternDiameterOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_hole_pattern_diameter_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Тип диска"
            :initial-selected-option="createStore.disks_type_id"
            :options="diskTypeOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_type_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Центральное отверстие (DIA)"
            :initial-selected-option="createStore.disks_dia_id"
            :options="diaOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_dia_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Вылет (ET)"
            :initial-selected-option="createStore.disks_et_id"
            :options="etOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_et_id', value)" />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Ширина обода, дюймы"
            :initial-selected-option="createStore.disks_rim_width_id"
            :options="rimWidthOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('disks_rim_width_id', value)" />
      </div>

      <div v-if="isUsedCondition" class="disks-parameters__content">
         <BlockTitle text="Состояние" />

         <UISwitcher
            label="Был ли ремонт дисков"
            :options="repairStatusOptions"
            :active-index="createStore.disks_repair_status_id"
            @update-selected="(value) => handleFieldUpdate('disks_repair_status_id', value)" />

         <TransitionGroup name="state-fields" tag="div" class="disks-parameters__state-animated">
            <UISwitcher
               v-if="isUsedCondition && isRepairYes"
               key="disks-straightened"
               label="Сколько дисков выпрямляли"
               :options="straightenedCountOptions"
               :active-index="createStore.disks_straightened_count_id"
               @update-selected="(value) => handleFieldUpdate('disks_straightened_count_id', value)" />

            <UISwitcher
               v-if="isUsedCondition && isRepairYes"
               key="disks-welded"
               label="Сколько дисков варили"
               :options="weldedCountOptions"
               :active-index="createStore.disks_welded_count_id"
               @update-selected="(value) => handleFieldUpdate('disks_welded_count_id', value)" />

            <UISwitcher
               v-if="isUsedCondition"
               key="disks-cracks"
               label="Сколько дисков с трещинами"
               :options="cracksCountOptions"
               :active-index="createStore.disks_cracks_count_id"
               @update-selected="(value) => handleFieldUpdate('disks_cracks_count_id', value)" />

            <UISwitcher
               v-if="isUsedCondition"
               key="disks-geometry"
               label="Дисков с изменением геометрии"
               :options="geometryChangesCountOptions"
               :active-index="createStore.disks_geometry_changes_count_id"
               @update-selected="(value) => handleFieldUpdate('disks_geometry_changes_count_id', value)" />

            <UISwitcher
               v-if="isUsedCondition"
               key="disks-paint"
               label="Какой тип окраски дисков"
               :options="paintTypeOptions"
               :active-index="createStore.disks_paint_type_id"
               max-width="410px"
               @update-selected="(value) => handleFieldUpdate('disks_paint_type_id', value)" />

            <UISwitcher
               v-if="isUsedCondition"
               key="disks-caps"
               label="Есть ли центральные колпачки"
               :options="centerCapsOptions"
               :active-index="createStore.disks_center_caps_id"
               @update-selected="(value) => handleFieldUpdate('disks_center_caps_id', value)" />

            <UISwitcher
               v-if="isUsedCondition"
               key="disks-pressure"
               label="Датчики давления"
               :options="pressureSensorsOptions"
               :active-index="createStore.disks_pressure_sensors_id"
               @update-selected="(value) => handleFieldUpdate('disks_pressure_sensors_id', value)" />
         </TransitionGroup>

         <div class="checkbox-section">
            <div class="checkbox-section__title">Прочие дефекты</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
                  v-for="defect in defectsOptions"
                  :key="defect.field"
                  :label="defect.label"
                  :checked="createStore[defect.field]"
                  @update-checked="(value) => handleDefectUpdate(defect.field, value)" />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import DiskSizeHelpTooltip from '~/components/DiskSizeHelpTooltip.vue'
import { useCreatePassengerDisksParametersModel } from '~/composables/create/useCreatePassengerDisksParametersModel'

defineOptions({
   name: 'CreatePassengerDisksParametersForm'
})

const {
   createStore,
   brandOptions,
   modelOptions,
   isModelSelectDisabled,
   rimWidthOptions,
   rimDiameterOptions,
   etOptions,
   holeCountOptions,
   holePatternDiameterOptions,
   diaOptions,
   diskTypeOptions,
   conditionOptions,
   countOptions,
   repairStatusOptions,
   straightenedCountOptions,
   weldedCountOptions,
   cracksCountOptions,
   geometryChangesCountOptions,
   paintTypeOptions,
   centerCapsOptions,
   pressureSensorsOptions,
   defectsOptions,
   isUsedCondition,
   isRepairYes,
   updateField,
   handleDefectUpdate,
   handleBrandUpdate
} = useCreatePassengerDisksParametersModel()

const handleFieldUpdate = updateField
</script>

<style lang="scss" scoped>
.disks-parameters {
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

   &__state-animated {
      display: flex;
      flex-direction: column;
      gap: 24px;
   }
}

.state-fields-enter-active,
.state-fields-leave-active,
.state-fields-move {
   transition: all 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.state-fields-enter-from,
.state-fields-leave-to {
   opacity: 0;
   transform: translateY(-6px);
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
