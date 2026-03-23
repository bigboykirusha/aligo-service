<template>
   <div class="moto-parameters">
      <div class="moto-parameters__content">
         <BlockTitle :text="formTitle" />

         <UISwitcher
            label="Состояние"
            :options="conditionOptions"
            :active-index="valueBySuffix('condition_id')"
            @update-selected="(value) => handleFieldUpdate('condition_id', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Наличие"
            :initial-selected-option="valueBySuffix('availability_id')"
            :options="availabilityOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('availability_id', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Марка"
            :initial-selected-option="valueBySuffix('brand_id')"
            :options="brandOptions"
            searchable
            search-mode="startsWith"
            @update-sort="handleBrandUpdate"
         />

         <SelectUI
            v-if="valueBySuffix('brand_id')"
            layout="row"
            input-width="310px"
            label="Модель"
            :initial-selected-option="valueBySuffix('model_id')"
            :options="modelOptions"
            :disabled="isModelSelectDisabled"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('model_id', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Тип"
            :initial-selected-option="valueBySuffix('type_id')"
            :options="typeOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('type_id', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Год выпуска"
            :initial-selected-option="valueBySuffix('year')"
            :options="yearOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('year', value)"
         />

         <AutosTextTemplate
            label="VIN / номер рамы"
            placeholder="Нажмите для ввода"
            validation-type="vin"
            :option="createStore.vin"
            @update:option="(value) => createStore.setField('vin', value)"
         />
      </div>

      <div class="moto-parameters__content">
         <BlockTitle text="Технические характеристики" />

         <UISwitcher
            label="Тип двигателя"
            :options="engineTypeOptions"
            :active-index="valueBySuffix('engine_type_id')"
            @update-selected="(value) => handleFieldUpdate('engine_type_id', value)"
         />

         <AutosTextTemplate
            label="Мощность, л.с."
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('power_hp')"
            @update:option="(value) => handleFieldUpdate('power_hp', value)"
         />

         <AutosTextTemplate
            label="Объём двигателя, см3"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('engine_volume')"
            @update:option="(value) => handleFieldUpdate('engine_volume', value)"
         />

         <UISwitcher
            label="Подача топлива"
            :options="fuelFeedOptions"
            :active-index="valueBySuffix('fuel_feed_id')"
            @update-selected="(value) => handleFieldUpdate('fuel_feed_id', value)"
         />

         <UISwitcher
            label="Тип привода"
            :options="driveTypeOptions"
            :active-index="valueBySuffix('drive_type_id')"
            @update-selected="(value) => handleFieldUpdate('drive_type_id', value)"
         />

         <UISwitcher
            label="Число тактов"
            :options="strokeOptions"
            :active-index="valueBySuffix('stroke_id')"
            @update-selected="(value) => handleFieldUpdate('stroke_id', value)"
         />

         <UISwitcher
            label="Количество цилиндров"
            :options="countCylinderOptions"
            :active-index="valueBySuffix('count_cylinder_id')"
            @update-selected="(value) => handleFieldUpdate('count_cylinder_id', value)"
         />

         <UISwitcher
            label="Количество передач"
            :options="numberOfGearsOptions"
            :active-index="valueBySuffix('number_of_gears_id')"
            @update-selected="(value) => handleFieldUpdate('number_of_gears_id', value)"
         />

         <UISwitcher
            label="Коробка передач"
            :options="transmissionOptions"
            :active-index="valueBySuffix('transmission_id')"
            @update-selected="(value) => handleFieldUpdate('transmission_id', value)"
         />

         <UISwitcher
            label="Расположение цилиндров"
            :options="cylinderPositionOptions"
            :active-index="valueBySuffix('cylinder_position_id')"
            @update-selected="(value) => handleFieldUpdate('cylinder_position_id', value)"
         />

         <UISwitcher
            label="Охлаждение"
            :options="engineCoolingOptions"
            :active-index="valueBySuffix('engine_cooling_id')"
            @update-selected="(value) => handleFieldUpdate('engine_cooling_id', value)"
         />

         <AutosTextTemplate
            label="Максимальная скорость, км/ч"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('top_speed')"
            @update:option="(value) => handleFieldUpdate('top_speed', value)"
         />

         <AutosTextTemplate
            label="Ёмкость аккумулятора, Ah"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('battery_capacity')"
            @update:option="(value) => handleFieldUpdate('battery_capacity', value)"
         />

         <AutosTextTemplate
            label="Запас хода, км"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('electric_range')"
            @update:option="(value) => handleFieldUpdate('electric_range', value)"
         />

         <AutosTextTemplate
            label="Время зарядки, ч"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('charging_time')"
            @update:option="(value) => handleFieldUpdate('charging_time', value)"
         />
      </div>

      <div class="moto-parameters__content">
         <BlockTitle text="История и состояние" />

         <AutosTextTemplate
            v-if="isMileageVisible"
            label="Пробег, км"
            placeholder="Нажмите для ввода"
            validation-type="number"
            :option="valueBySuffix('mileage')"
            @update:option="(value) => handleFieldUpdate('mileage', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="ПТС"
            :initial-selected-option="valueBySuffix('pts_id')"
            :options="ptsOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('pts_id', value)"
         />

         <UISwitcher
            v-if="isOwnersVisible"
            label="Владельцев по ПТС"
            :options="countOwnerOptions"
            :active-index="valueBySuffix('count_owner_id')"
            @update-selected="(value) => handleFieldUpdate('count_owner_id', value)"
         />
      </div>

      <div class="moto-parameters__content">
         <BlockTitle text="Дополнительные опции" />

         <div class="checkbox-section">
            <div class="checkbox-section__title">Опции мототехники</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
                  v-for="option in additionalOptionFields"
                  :key="option.key"
                  :label="option.label"
                  :checked="Boolean(valueBySuffix(option.key))"
                  @update-checked="(value) => handleBooleanFieldUpdate(option.key, value)"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import { useCreateMotoMotorcycleParametersModel } from '~/composables/create/useCreateMotoMotorcycleParametersModel'

defineOptions({
   name: 'CreateMotoMotorcycleParametersForm'
})

const {
   createStore,
   fieldName,
   conditionOptions,
   availabilityOptions,
   brandOptions,
   modelOptions,
   isModelSelectDisabled,
   typeOptions,
   yearOptions,
   engineTypeOptions,
   fuelFeedOptions,
   driveTypeOptions,
   strokeOptions,
   transmissionOptions,
   numberOfGearsOptions,
   engineCoolingOptions,
   ptsOptions,
   countOwnerOptions,
   countCylinderOptions,
   cylinderPositionOptions,
   isMileageVisible,
   isOwnersVisible,
   updateField,
   handleBrandUpdate,
   clearConditionDependentFields
} = useCreateMotoMotorcycleParametersModel()

const formTitle = 'Параметры мототехники'

const additionalOptionFields = Object.freeze([
   { key: 'is_electric_starter', label: 'Электростартер' },
   { key: 'is_abs', label: 'ABS' },
   { key: 'is_tcs', label: 'TCS' },
   { key: 'is_start_stop', label: 'Система Старт-стоп' },
   { key: 'is_windshield', label: 'Ветровое стекло' },
   { key: 'is_trunk', label: 'Кофр' }
])

const valueBySuffix = (suffix) => createStore[fieldName(suffix)]

const handleFieldUpdate = (suffix, value) => {
   updateField(fieldName(suffix), value)
   if (suffix === 'condition_id' || suffix === 'pts_id') {
      clearConditionDependentFields()
   }
}

const handleBooleanFieldUpdate = (suffix, value) => {
   updateField(fieldName(suffix), value ? 1 : 0)
}
</script>

<style lang="scss" scoped>
.moto-parameters {
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
}

.checkbox-section {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
   }

   &__title {
      width: 270px;
      font-size: 14px;
      line-height: 20px;
      color: #323232;

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
