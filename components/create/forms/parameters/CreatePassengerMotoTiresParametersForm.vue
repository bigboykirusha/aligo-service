<template>
   <div class="moto-tires-parameters">
      <div class="moto-tires-parameters__content">
         <BlockTitle text="Параметры товара" />

         <UISwitcher
            label="Состояние"
            :options="conditionOptions"
            :active-index="createStore.moto_tires_condition_id"
            @update-selected="(value) => handleFieldUpdate('moto_tires_condition_id', value)"
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Производитель"
            :initial-selected-option="createStore.moto_tires_brand_id"
            :options="brandOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('moto_tires_brand_id', value)"
         />

         <div class="moto-tires-parameters__size-group">
            <div class="moto-tires-parameters__size-label">Размер шин</div>
            <div class="moto-tires-parameters__size-row">
               <SelectUI
                  class="moto-tires-parameters__size-select"
                  :initial-selected-option="createStore.moto_tires_width_id"
                  :options="widthOptions"
                  placeholder="Ширина"
                  searchable
                  search-mode="startsWith"
                  @update-sort="(value) => handleFieldUpdate('moto_tires_width_id', value)"
               />
               <SelectUI
                  class="moto-tires-parameters__size-select"
                  :initial-selected-option="createStore.moto_tires_height_id"
                  :options="heightOptions"
                  placeholder="Высота"
                  searchable
                  search-mode="startsWith"
                  @update-sort="(value) => handleFieldUpdate('moto_tires_height_id', value)"
               />
               <SelectUI
                  class="moto-tires-parameters__size-select"
                  :initial-selected-option="createStore.moto_tires_diameter_id"
                  :options="diameterOptions"
                  placeholder="Диаметр"
                  searchable
                  search-mode="startsWith"
                  @update-sort="(value) => handleFieldUpdate('moto_tires_diameter_id', value)"
               />
            </div>
         </div>

         

         

         <SelectUI
            layout="row"
            input-width="310px"
            label="Ось"
            :initial-selected-option="createStore.moto_tires_axle_id"
            :options="axleOptions"
            searchable
            search-mode="startsWith"
            @update-sort="(value) => handleFieldUpdate('moto_tires_axle_id', value)"
         />
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import { useCreatePassengerMotoTiresParametersModel } from '~/composables/create/useCreatePassengerMotoTiresParametersModel'

defineOptions({
   name: 'CreatePassengerMotoTiresParametersForm'
})

const {
   createStore,
   conditionOptions,
   brandOptions,
   widthOptions,
   heightOptions,
   diameterOptions,
   axleOptions,
   updateField
} = useCreatePassengerMotoTiresParametersModel()

const handleFieldUpdate = updateField
</script>

<style scoped lang="scss">
.moto-tires-parameters {
   display: flex;
   flex-direction: column;
   gap: 40px;

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
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;

      @media (max-width: 768px) {
         flex-direction: column;
      }
   }

   &__size-label {
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

:deep(.moto-tires-parameters__size-select.select-field) {
   gap: 0;
}

:deep(.moto-tires-parameters__size-select .select-field__control),
:deep(.moto-tires-parameters__size-select .select-field__list) {
   width: 112px;
   min-width: 112px;

   @media (max-width: 768px) {
      width: 100%;
      min-width: 0;
   }
}






</style>
