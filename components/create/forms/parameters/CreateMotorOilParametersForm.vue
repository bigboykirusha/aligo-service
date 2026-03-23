<template>
   <div class="motor-oil-parameters">
      <div class="motor-oil-parameters__content">
         <BlockTitle text="Параметры товара" />

         <UISwitcher
            label="Состояние"
            :options="conditionOptions"
            :active-index="createStore.motor_oil_condition_id"
            @update-selected="
               (value) => handleFieldUpdate('motor_oil_condition_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Производитель"
            :initial-selected-option="createStore.motor_oil_brand_id"
            :options="brandOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_brand_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Класс вязкости SAE"
            :initial-selected-option="createStore.motor_oil_sae_id"
            :options="saeOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_sae_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Объем"
            :initial-selected-option="createStore.motor_oil_volume_id"
            :options="volumeOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_volume_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Стандарт ACEA"
            :initial-selected-option="createStore.motor_oil_acea_id"
            :options="aceaOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_acea_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Стандарт API"
            :initial-selected-option="createStore.motor_oil_api_id"
            :options="apiOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_api_id', value)
            "
         />

         <SelectUI
            layout="row"
            input-width="310px"
            label="Допуски OEM"
            :initial-selected-option="createStore.motor_oil_oem_id"
            :options="oemOptions"
            searchable
            search-mode="startsWith"
            @update-sort="
               (value) => handleFieldUpdate('motor_oil_oem_id', value)
            "
         />

         <AutosTextTemplate
            label="Артикул"
            placeholder="Введите артикул"
            :option="createStore.motor_oil_article"
            @update:option="
               (value) => handleFieldUpdate('motor_oil_article', value)
            "
         />
      </div>
   </div>
</template>

<script setup>
import SelectUI from '~/components/ui/SelectUI.vue'
import AutosTextTemplate from '~/components/AutosTextTemplate.vue'
import { useCreateMotorOilParametersModel } from '~/composables/create/useCreateMotorOilParametersModel'

defineOptions({
   name: 'CreateMotorOilParametersForm'
})

const {
   createStore,
   conditionOptions,
   brandOptions,
   saeOptions,
   volumeOptions,
   aceaOptions,
   apiOptions,
   oemOptions,
   updateField
} = useCreateMotorOilParametersModel()

const handleFieldUpdate = updateField
</script>

<style scoped lang="scss">
.motor-oil-parameters {
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
</style>
