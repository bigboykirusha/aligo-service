<template>
   <div class="characteristics">
      <div v-if="showDraftRecoveryConditionField" class="characteristics__content">
         <UISwitcher
            :options="conditionOptions"
            label="Состояние"
            :active-index="createStore.condition_id"
            class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'condition_id',
                  createStore.condition_id
               )
            }"
            @click="dismissRequiredField('condition_id')"
            @update-selected="(value) => updateField('condition_id', value)"
         />
      </div>

      <div class="characteristics__content">
         <BlockTitle text="Внешний вид" />
         <PhotoUploader
label="Фотографии" helper-text="до 10 шт., формат jpg, jpeg, png, gif, webp, avif, heif, heic"
            :photos="createStore.photos" @update-photos="(photos) => updateField('photos', photos)" />
         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
v-else layout="row" input-width="310px" color-mode emit-value-as-array searchable
            search-mode="includes" capitalize-options label="Цвет" :initial-selected-option="createStore.color_ids"
            :options="colorOptions" class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'color_ids',
                  createStore.color_ids
               )
            }" @click="dismissRequiredField('color_ids')"
            @update-sort="(value) => updateField('color_ids', value)" />
      </div>

      <div class="characteristics__content">
         <BlockTitle text="Регистрационные данные" />
         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith"
            label="Страна регистрации" :initial-selected-option="createStore.country_id" :options="countryOptions"
            class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'country_id',
                  createStore.country_id
               )
            }" @click="dismissRequiredField('country_id')"
            @update-sort="(value) => updateField('country_id', value)" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate
v-else label="VIN или номер кузова" placeholder="Нажмите для ввода" :option="createStore.vin" validation-type="vin" :label-clickable="isMobileViewport"
            class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'vin',
                  createStore.vin
               )
            }" @click="dismissRequiredField('vin')" @label-click="handleVinLabelClick"
            @update:option="(value) => updateField('vin', value)">
            <template #label-extra>
               <VinHelpTooltip ref="vinHelpRef" :icon-only="true" />
            </template>
         </AutosTextTemplate>
         <TextSkeleton v-if="loading" />
         <AutosStateNumber
v-show="showStateNumber" label="Государственный номер" placeholder="Нажмите для ввода"
            :option="createStore.state_number" class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'state_number',
                  createStore.state_number,
                  showStateNumber
               )
            }" @click="dismissRequiredField('state_number')"
            @update:option="(value) => updateField('state_number', value)" />
      </div>

      <div class="characteristics__content">
         <BlockTitle text="Технические характеристики" />

         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith" label="Марка" :initial-selected-option="createStore.brand_id" :options="dropdownMarksOptions" class="draft-required-field"
            :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'brand_id',
                  createStore.brand_id
               )
            }" @click="dismissRequiredField('brand_id')" @update-sort="handleMarksUpdate" />

         <Transition name="field-reveal">
            <div v-if="showModelField" class="characteristics__animated-field">
               <SelectSkeleton v-if="loading" layout="row" />
               <SelectUI
v-else ref="modelSelectRef" layout="row" input-width="310px" searchable
                  search-mode="startsWith" label="Модель" :initial-selected-option="createStore.model_id"
                  :options="dropdownModelsOptions" :disabled="isModelSelectDisabled" class="draft-required-field" :class="{
                     'draft-required-field--active': shouldHighlightRequiredField(
                        'model_id',
                        createStore.model_id
                     )
                  }" @click="dismissRequiredField('model_id')" @update-sort="handleModelsUpdate" />
            </div>
         </Transition>

         <Transition name="field-reveal">
            <div v-if="showGenerationField" class="characteristics__animated-field">
               <SelectSkeleton v-if="loading" layout="row" />
               <SelectUI
v-else ref="generationSelectRef" layout="row" input-width="310px" searchable
                  search-mode="startsWith" label="Поколение" :initial-selected-option="createStore.generation_id"
                  :options="dropdownGenerationOptions" :disabled="isGenerationSelectDisabled" class="draft-required-field" :class="{
                     'draft-required-field--active': shouldHighlightRequiredField(
                        'generation_id',
                        createStore.generation_id
                     )
                  }" @click="dismissRequiredField('generation_id')" @update-sort="handleGenerationUpdate" />
            </div>
         </Transition>

         <Transition name="field-reveal">
            <div v-if="showModificationField" class="characteristics__animated-field">
               <SelectSkeleton v-if="loading" layout="row" />
               <SelectUI
v-else ref="modificationSelectRef" layout="row" input-width="310px" searchable
                  search-mode="startsWith" label="Модификация" :initial-selected-option="createStore.modification_id"
                  :options="dropdownModificationOptions" :disabled="isModificationSelectDisabled" class="draft-required-field" :class="{
                     'draft-required-field--active': shouldHighlightRequiredField(
                        'modification_id',
                        createStore.modification_id
                     )
                  }" @click="dismissRequiredField('modification_id')" @update-sort="handleModificationUpdate" />
            </div>
         </Transition>

         <Transition name="field-reveal">
            <div v-if="showEquipmentField" class="characteristics__animated-field">
               <SelectSkeleton v-if="loading" layout="row" />
               <SelectUI
v-else ref="equipmentSelectRef" layout="row" input-width="310px" searchable
                  search-mode="startsWith" label="Комплектация" :initial-selected-option="createStore.equipment_id"
                  :options="dropdownEquipmentOptions" :disabled="isEquipmentSelectDisabled" class="draft-required-field" :class="{
                     'draft-required-field--active': shouldHighlightRequiredField(
                        'equipment_id',
                        createStore.equipment_id
                     )
                  }" @click="dismissRequiredField('equipment_id')" @update-sort="handleEquipmentUpdate" />
            </div>
         </Transition>

         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith" label="Год выпуска" :initial-selected-option="createStore.year_id" :options="yearOptions" class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'year_id',
                  createStore.year_id
               )
            }" @click="dismissRequiredField('year_id')" @update-sort="(value) => updateField('year_id', value)" />

         <SwitcherCreateSkeleton v-if="loading" />
         <UISwitcher
v-else :options="handlebarIdOptions" label="Руль" :active-index="createStore.handlebar_id"
            class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'handlebar_id',
                  createStore.handlebar_id
               )
            }" @click="dismissRequiredField('handlebar_id')" @update-selected="
               (value) => updateField('handlebar_id', value)
            " />

         <template v-if="showAutoInfoFields">
            <SelectSkeleton v-if="loading || isAutoInfoLoading" layout="row" />
            <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith" label="Тип кузова" :initial-selected-option="createStore.car_body_type_id" :options="checkboxBodyTypeOptions"
               :disabled="isAutoInfoLocked" class="draft-required-field" :class="{
                  'draft-required-field--active': shouldHighlightRequiredField(
                     'car_body_type_id',
                     createStore.car_body_type_id,
                     showAutoInfoFields
                  )
               }" @click="dismissRequiredField('car_body_type_id')" @update-sort="
                  (value) => updateField('car_body_type_id', value)
               " />

            <TextSkeleton v-if="loading || isAutoInfoLoading" />
            <AutosTextTemplate
v-else label="Количество дверей" placeholder="Нажмите для ввода" :option="createStore.count_doors" validation-type="doors" :disabled="isAutoInfoLocked"
               class="draft-required-field" :class="{
                  'draft-required-field--active': shouldHighlightRequiredField(
                     'count_doors',
                     createStore.count_doors,
                     showAutoInfoFields
                  )
               }" @click="dismissRequiredField('count_doors')" @update:option="
                  (value) => updateField('count_doors', value)
               " />

            <SelectSkeleton v-if="loading || isAutoInfoLoading" layout="row" />
            <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith" label="Тип двигателя" :initial-selected-option="createStore.engine_type_id" :options="checkboxEngineTypeOptions"
               :disabled="isAutoInfoLocked" class="draft-required-field" :class="{
                  'draft-required-field--active': shouldHighlightRequiredField(
                     'engine_type_id',
                     createStore.engine_type_id,
                     showAutoInfoFields
                  )
               }" @click="dismissRequiredField('engine_type_id')" @update-sort="
                  (value) => updateField('engine_type_id', value)
               " />

            <SwitcherCreateSkeleton v-if="loading || isAutoInfoLoading" />
            <UISwitcher
v-else :options="checkboxDriveOptions" label="Привод"
               :active-index="createStore.drive_id" :disabled="isAutoInfoLocked" class="draft-required-field" :class="{
                  'draft-required-field--active': shouldHighlightRequiredField(
                     'drive_id',
                     createStore.drive_id,
                     showAutoInfoFields
                  )
               }" @click="dismissRequiredField('drive_id')" @update-selected="
                  (value) => updateField('drive_id', value)
               " />

            <SwitcherCreateSkeleton v-if="loading || isAutoInfoLoading" />
            <UISwitcher
v-else :options="dropdownTransmissionOptions" label="Коробка передач"
               :active-index="createStore.transmission_id" :disabled="isAutoInfoLocked" class="draft-required-field"
               :class="{
                  'draft-required-field--active': shouldHighlightRequiredField(
                     'transmission_id',
                     createStore.transmission_id,
                     showAutoInfoFields
                  )
               }" @click="dismissRequiredField('transmission_id')" @update-selected="
                  (value) => updateField('transmission_id', value)
               " />

            <TextSkeleton v-if="loading || isAutoInfoLoading" />
            <AutosTextTemplate
v-else
               :label="autoInfoLabels.power"
               :placeholder="tapToEnterPlaceholder"
               :option="createStore.power_range"
               validation-type="number"
               :disabled="isAutoInfoLocked"
               @update:option="
                  (value) => updateField('power_range', value)
               " />

            <TextSkeleton v-if="loading || isAutoInfoLoading" />
            <AutosTextTemplate
v-else
               :label="autoInfoLabels.engineVolume"
               :placeholder="tapToEnterPlaceholder"
               :option="createStore.engine_volume"
               validation-type="number"
               :disabled="isAutoInfoLocked"
               @update:option="
                  (value) => updateField('engine_volume', value)
               " />
         </template>
      </div>

      <div class="characteristics__content">
         <BlockTitle text="История эксплуатации и состояние" />
         <TextSkeleton v-if="loading" />
         <AutosTextTemplate
v-else v-show="showUsedOptions" label="Пробег, км" placeholder="Нажмите для ввода" :option="createStore.mileage" validation-type="number"
            @update:option="(value) => updateField('mileage', value)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <UISwitcher
v-else v-show="showUsedOptions" :options="switcherStateOptions" label="Состояние*"
            :active-index="createStore.state_id" class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'state_id',
                  createStore.state_id,
                  showUsedOptions
               )
            }" @click="dismissRequiredField('state_id')"
            @update-selected="(value) => updateField('state_id', value)" />
         <SwitcherCreateSkeleton v-if="loading" />
         <UISwitcher
v-else v-show="showUsedOptions" :options="ownersOptions" label="Владельцев"
            :active-index="createStore.count_owners" @update-selected="
               (value) => updateField('count_owners', value)
            " />
         <SelectSkeleton v-if="loading" layout="row" />
         <SelectUI
v-else layout="row" input-width="310px" searchable search-mode="startsWith" label="ПТС" :initial-selected-option="createStore.pts_id" :options="ptsOptions" class="draft-required-field" :class="{
               'draft-required-field--active': shouldHighlightRequiredField(
                  'pts_id',
                  createStore.pts_id
               )
            }" @click="dismissRequiredField('pts_id')" @update-sort="(value) => updateField('pts_id', value)" />
         <div class="checkbox-section">
            <div class="checkbox-section__title">Данные о ТО</div>
            <div class="checkbox-section__items">
               <SimpleCheckboxTemplate
label="Есть сервисная книжка" :checked="createStore.is_service_book"
                  @update-checked="
                     (value) => updateField('is_service_book', value)
                  " />
               <SimpleCheckboxTemplate
label="Обслуживался у диллера" :checked="createStore.is_serviced_dealer"
                  @update-checked="
                     (value) => updateField('is_serviced_dealer', value)
                  " />
               <SimpleCheckboxTemplate
label="На гарантии" :checked="createStore.is_under_warranty" @update-checked="
                  (value) => updateField('is_under_warranty', value)
               " />
            </div>
         </div>
      </div>
   </div>

</template>

<script setup>
import SelectUI from '@/components/ui/SelectUI.vue'
import SelectSkeleton from '@/components/SelectSkeleton.vue'
import VinHelpTooltip from '@/components/VinHelpTooltip.vue'
import { useCreateAutosParametersModel } from '@/composables/create/useCreateAutosParametersModel'

defineOptions({
   name: 'CreateAutosParametersForm'
})

const autoInfoLabels = Object.freeze({
   power: '\u041C\u043E\u0449\u043D\u043E\u0441\u0442\u044C, \u043B.\u0441.',
   engineVolume:
      '\u041E\u0431\u044A\u0451\u043C \u0434\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044F, \u0441\u043C3'
})
const tapToEnterPlaceholder =
   '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u0432\u0432\u043E\u0434\u0430'

const {
   loading,
   isAutoInfoLoading,
   isAutoInfoLocked,
   createStore,
   dropdownMarksOptions,
   dropdownModelsOptions,
   dropdownGenerationOptions,
   dropdownModificationOptions,
   dropdownEquipmentOptions,
   dropdownTransmissionOptions,
   checkboxBodyTypeOptions,
   checkboxEngineTypeOptions,
   checkboxDriveOptions,
   conditionOptions,
   switcherStateOptions,
   colorOptions,
   countryOptions,
   ownersOptions,
   yearOptions,
   handlebarIdOptions,
   ptsOptions,
   showDraftRecoveryConditionField,
   showStateNumber,
   showUsedOptions,
   showModelField,
   showGenerationField,
   showModificationField,
   showEquipmentField,
   isModelSelectDisabled,
   isGenerationSelectDisabled,
   isModificationSelectDisabled,
   isEquipmentSelectDisabled,
   showAutoInfoFields,
   isMobileViewport,
   vinHelpRef,
   modelSelectRef,
   generationSelectRef,
   modificationSelectRef,
   equipmentSelectRef,
   shouldHighlightRequiredField,
   dismissRequiredField,
   handleVinLabelClick,
   updateField,
   handleMarksUpdate,
   handleModelsUpdate,
   handleGenerationUpdate,
   handleModificationUpdate,
   handleEquipmentUpdate
} = useCreateAutosParametersModel()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/create/draftRequiredField' as draftRequiredField;

.characteristics {
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

   &__info {
      font-size: 14px;
      line-height: 18px;
      color: #a8a8a8;
   }
}

@include draftRequiredField.draft-required-field-highlight;

.field-reveal-enter-active,
.field-reveal-leave-active {
   transition:
      opacity 0.24s ease,
      transform 0.24s ease;
}

.field-reveal-enter-from,
.field-reveal-leave-to {
   opacity: 0;
   transform: translateY(-6px);
}

.checkbox-section {
   display: flex;
   flex-direction: row;
   align-items: flex-start;
   gap: 8px;

   @media (max-width: 768px) {
      flex-direction: column;
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
